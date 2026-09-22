import argparse
import json
import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Lock


class ReviewServer(ThreadingHTTPServer):
  allow_reuse_address = os.name != "nt"


class ReviewHandler(SimpleHTTPRequestHandler):
  def log_message(self, format, *args):
    pass

  def send_json(self, status, payload):
    body = json.dumps(payload, ensure_ascii=True).encode("utf-8")
    self.send_response(status)
    self.send_header("Content-Type", "application/json; charset=utf-8")
    self.send_header("Content-Length", str(len(body)))
    self.send_header("Cache-Control", "no-store")
    self.end_headers()
    self.wfile.write(body)
    self.wfile.flush()

  def valid_host(self):
    return self.headers.get_all("Host") == [self.server.review_host]

  def do_GET(self):
    if not self.valid_host():
      self.send_json(403, {"error": "Invalid host"})
      return
    super().do_GET()

  def do_HEAD(self):
    if not self.valid_host():
      self.send_error(403, "Invalid host")
      return
    super().do_HEAD()

  def do_POST(self):
    if self.path != "/__review_selection":
      self.send_json(404, {"error": "Unknown endpoint"})
      return
    if not self.valid_host() or self.headers.get_all("Origin") != [self.server.review_origin]:
      self.send_json(403, {"error": "Selection must come from this review page"})
      return
    if self.headers.get_content_type() != "application/json":
      self.send_json(415, {"error": "Content-Type must be application/json"})
      return
    lengths = self.headers.get_all("Content-Length", [])
    if len(lengths) != 1 or self.headers.get("Transfer-Encoding"):
      self.send_json(400, {"error": "One Content-Length is required"})
      return
    try:
      length = int(lengths[0])
    except ValueError:
      self.send_json(400, {"error": "Invalid Content-Length"})
      return
    if length < 1 or length > 8192:
      self.send_json(413, {"error": "Request must be between 1 and 8192 bytes"})
      return
    try:
      payload = json.loads(self.rfile.read(length).decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
      self.send_json(400, {"error": "Invalid JSON"})
      return
    if not isinstance(payload, dict) or set(payload) - {"round", "choice", "note"}:
      self.send_json(400, {"error": "Expected round, choice, and optional note"})
      return
    if payload.get("round") != self.server.review_round:
      self.send_json(409, {"error": "This review round is no longer active"})
      return
    if not isinstance(payload.get("choice"), str) or payload["choice"] not in self.server.review_choices:
      self.send_json(400, {"error": "Unknown choice"})
      return
    if "note" in payload and not isinstance(payload["note"], str):
      self.send_json(400, {"error": "Note must be a string"})
      return
    with self.server.selection_lock:
      if self.server.selection_received:
        self.send_json(409, {"error": "A selection was already submitted for this review"})
        return
      self.server.selection_received = True
      try:
        self.send_json(200, {"accepted": True, "round": payload["round"], "choice": payload["choice"]})
      finally:
        print("SELECTION " + json.dumps(payload, ensure_ascii=True), flush=True)


def main():
  parser = argparse.ArgumentParser(
    description="Serve a local static review and hand one submitted selection to the active coordinator through stdout.",
    epilog="Keep the coordinator waiting on this process. This bridge cannot wake a coordinator after its turn ends. "
      "The preview stays available after selection until this process is stopped.",
  )
  parser.add_argument("--root", required=True, help="Existing task-owned directory containing the static review")
  parser.add_argument("--round", required=True, help="Stable identifier for the active review round")
  parser.add_argument("--choices", nargs="+", required=True, help="Exact allowed choice IDs, such as b0 b1 b2 b3 explore")
  parser.add_argument("--port", type=int, default=8765, help="Localhost port (default: 8765; 0 chooses an available port)")
  args = parser.parse_args()
  root = Path(args.root).resolve()
  if not root.is_dir():
    parser.error("--root must be an existing directory")
  if not args.round or any(not choice for choice in args.choices) or len(set(args.choices)) != len(args.choices):
    parser.error("--round and --choices must be nonempty, with unique choice IDs")
  if not 0 <= args.port <= 65535:
    parser.error("--port must be between 0 and 65535")
  handler = partial(ReviewHandler, directory=str(root))
  with ReviewServer(("127.0.0.1", args.port), handler) as server:
    server.review_host = "127.0.0.1:" + str(server.server_port)
    server.review_origin = "http://" + server.review_host
    server.review_round = args.round
    server.review_choices = set(args.choices)
    server.selection_lock = Lock()
    server.selection_received = False
    print("READY " + json.dumps({"url": server.review_origin + "/", "round": args.round}), flush=True)
    try:
      server.serve_forever()
    except KeyboardInterrupt:
      pass


if __name__ == "__main__":
  main()
