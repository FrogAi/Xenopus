# Runtime: Claude Code

Read when delegating work or arranging the final simplicity review.

- Delegate according to the subagent rules in the global instructions. Choose an agent by the method or deliverable that is missing, from the available agent types.
- Run the final simplicity review in a fresh `engineering-reviewer` subagent, briefed as [final-review.md](final-review.md) describes. The Agent tool starts it without this conversation's history; keep rationale out of the prompt as well.
- Add a domain reviewer, such as `security-reviewer`, `performance-investigator` or `frontend-reviewer`, when the change carries that kind of risk.
- For reviews or audits that span many files, a Workflow can run reviewers in parallel, only when the user has opted into workflows.
  - Write Workflow scripts with LF line endings; a carriage return in the script blocks the launch.
  - Don't message an agent that a running workflow started: the message starts a second copy of that agent alongside the first. To change its course, stop and relaunch the workflow, or let the agent finish.
  - Save each finished agent's result to a file as it completes. Resuming a workflow replays only the unchanged prefix of its agent calls, so after an interruption a small follow-up workflow that reads the saved results avoids rerunning finished work.
- When work is split into stages or agents (implement, verify, integrate, review), size the pipeline to the risk and let each stage add only its own checks:
  - A stage runs the checks its own contribution could invalidate. One stage owns the full integrated run of the suites; the others do not repeat it.
  - Tell each verifier what evidence is enough, so it doesn't add open-ended extras: for example, the revert control plus a few hand-made breaks of the changed lines, rather than a mutation-testing campaign.
  - Keep an adversarial verifier per change where a missed defect is costly, such as safety-critical control code; there it has repeatedly caught real defects the implementer missed. Do small, low-risk changes and housekeeping directly.
  - For safety-critical batches, keep one independent review of the integrated result: it has caught interactions between changes, such as one setting reopening a path another change had closed, that the per-change verifiers and the integrator's own checks missed.
  - Partition fan-out scopes so agents do not re-examine the same items, and share one prepared test environment instead of having each agent rebuild it.
  - Settle the decisions the user must make for a batch before launching it, from the evidence already gathered, in one round of questions.
  - When usage limits apply, run one workflow at a time: a limit reached mid-run discards the in-flight agents' work.
  - After each batch, note what each layer caught, and drop a layer that catches nothing real across batches of its kind.
