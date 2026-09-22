"""UserPromptSubmit and SessionEnd hook: in the desktop app, hold messages sent while Claude is working until the task finishes.

A message picked up mid-task carries the running prompt's prompt_id. Returning "continue": false for it makes
Claude Code keep it queued and send it as a new message when the current task ends (observed in Claude Code
2.1.281; the docs describe "continue": false only as stopping, so recheck this after Claude Code updates).
"""
import json
import os
import sys
import tempfile

data = json.load(sys.stdin)

# Terminal and IDE sessions keep their own queueing behavior.
if os.environ.get("CLAUDE_CODE_ENTRYPOINT") != "claude-desktop":
    sys.exit(0)

state_path = os.path.join(tempfile.gettempdir(), "claude-queue-until-done", data["session_id"])

if data["hook_event_name"] == "SessionEnd":
    if os.path.exists(state_path):
        os.remove(state_path)
    sys.exit(0)

if os.path.exists(state_path):
    with open(state_path) as f:
        mid_task = f.read() == data["prompt_id"]
    # Background task notices still reach Claude mid-task.
    if mid_task and not data["prompt"].startswith("<task-notification>"):
        print(json.dumps({"continue": False}))
        sys.exit(0)

os.makedirs(os.path.dirname(state_path), exist_ok=True)
with open(state_path, "w") as f:
    f.write(data["prompt_id"])
