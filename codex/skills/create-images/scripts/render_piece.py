"""Send one image (plus reference photos) to OpenAI's image edit endpoint and save the result.

This is the paid fallback; Codex's built-in image generator is the default (see SKILL.md).

Usage:
  python render_piece.py --image source.png --prompt prompt.txt --size 2048x1104 --quality <level> --out result.png
                         --model <model> --prices <text,image-in,image-out> [--ref ref1.jpg --ref ref2.png ...] [--log usage.jsonl]

The key comes from OPENAI_API_KEY. Every call appends its token usage and cost to the log. Take the current model name,
sizes, quality levels and per-million-token prices from OpenAI's documentation each time.
"""
import argparse
import base64
import json
import os
import sys
from datetime import datetime
from pathlib import Path

import requests


parser = argparse.ArgumentParser()
parser.add_argument("--image", required=True)
parser.add_argument("--prompt", required=True)
parser.add_argument("--size", required=True)
parser.add_argument("--quality", required=True)
parser.add_argument("--out", required=True)
parser.add_argument("--ref", action="append", default=[])
parser.add_argument("--model", required=True)
parser.add_argument("--log", default="usage.jsonl")
parser.add_argument("--prices", required=True, help="text input, image input, image output, USD per million tokens")
args = parser.parse_args()

paths = [Path(args.image)] + [Path(p) for p in args.ref]
files = [("image[]", (path.name, path.open("rb"))) for path in paths]
response = requests.post(
    "https://api.openai.com/v1/images/edits",
    headers={"Authorization": "Bearer " + os.environ["OPENAI_API_KEY"]},
    data={
        "model": args.model,
        "prompt": Path(args.prompt).read_text(encoding="utf-8"),
        "size": args.size,
        "quality": args.quality,
        "output_format": "png",
        "n": "1",
    },
    files=files,
    timeout=900,
)
if response.status_code != 200:
    sys.exit(f"HTTP {response.status_code}: {response.text}")

body = response.json()
Path(args.out).write_bytes(base64.b64decode(body["data"][0]["b64_json"]))

text_price, image_in_price, image_out_price = (float(v) for v in args.prices.split(","))
usage = body["usage"]
cost = (
    usage["input_tokens_details"]["text_tokens"] * text_price
    + usage["input_tokens_details"]["image_tokens"] * image_in_price
    + usage["output_tokens"] * image_out_price
) / 1_000_000
record = {"time": datetime.now().isoformat(timespec="seconds"), "out": args.out, "model": args.model, "quality": args.quality, "size": args.size, "usage": usage, "cost_usd": round(cost, 4)}
with open(args.log, "a", encoding="utf-8") as log:
    log.write(json.dumps(record) + "\n")
print(args.out, f"${cost:.3f}")
