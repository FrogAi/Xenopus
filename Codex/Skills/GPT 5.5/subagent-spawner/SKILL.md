---
name: subagent-spawner
description: "Use after explicit delegation/spawn/fork/parallel-work intent to plan Codex subagents. Not for inline work or durable agents."
---

# Subagent Spawner

## Mission

Decide when Codex should delegate work to subagents, then build precise briefs for the active runtime's available agent controls. Keep the parent conversation responsible for decomposition, integration, verification, ledger updates, and user-facing judgment.

Spawn only when delegation materially improves correctness, independent evidence coverage, context isolation, or parallel progress without reducing final quality. Work locally when the next step is blocking, tightly coupled, small enough to do directly, or likely to suffer handoff loss.

## Operating Rules

- Verify current Codex subagent documentation and active tool metadata before relying on agent types, model inheritance, context forking, write behavior, or wait/close semantics.
- Spawn only when the user explicitly asks for subagents, delegation, forking, agents, or parallel agent work. Requests for depth, review, research, or thoroughness do not authorize spawning by themselves.
- Do not override inherited model or reasoning settings unless the user asks for a specific model or the task has a concrete source-supported need.
- Prefer read-only explorer lanes for independent evidence gathering and bounded worker lanes for disjoint implementation slices. Do not invent unavailable agent types.
- Keep the immediate critical path in the parent thread. Delegate independent sidecar work while the parent continues useful non-overlapping work.
- Give each worker an explicit ownership boundary, disjoint write set, validation expectation, and instruction that other edits may exist and must not be reverted.
- Give every read-only lane an explicit no-write rule and a no-secret-value-disclosure rule.
- Do not ask a subagent to spawn another subagent. Chain or redirect agents from the parent.
- Do not trust a subagent summary as proof. Verify material claims from files, diffs, tool output, citations, or reproducible commands before using them.
- Close agents when their results are integrated or no longer needed.

## Decision Workflow

1. **Classify the request.** Identify whether the user authorized transient subagents, persistent custom-agent definitions, or ordinary task execution. Route persistent custom-agent files to `custom-agent-builder`.
2. **Inspect active controls.** Use only the subagent roles, fork behavior, model controls, and wait/close tools exposed in the current Codex session. Label unavailable behavior instead of assuming it.
3. **Name the parent task.** Capture objective, non-goals, scope, paths, source rules, side-effect limits, validation, and stop conditions.
4. **Apply the delegation test.** Compare quality gain against handoff loss. Spawn when independent evidence or disjoint work improves the result; work locally when delegation would duplicate effort or block the parent.
5. **Partition lanes.** Assign the fewest lanes that cover independent questions or disjoint implementation slices. Avoid overlapping writes, shared external resources, credential stores, and live infrastructure.
6. **Write lane briefs.** For each lane, include objective, scope, paths, source hierarchy, secret policy, read/write boundary, output schema, validation expectations, cleanup, and stop conditions.
7. **Launch and continue.** Spawn authorized lanes, then continue non-overlapping parent work. Wait only when the next parent step needs the result.
8. **Verify returns.** Reject or redirect results that omit schema fields, make unsupported claims, expose secret values, report out-of-scope edits, or conflict with stronger evidence.
9. **Integrate.** Review worker diffs before adopting them, rerun relevant validation, close agents that are done, and report residual risks.

## Brief Contract

Every non-trivial subagent brief includes:

- **Objective:** One sentence naming the deliverable.
- **Scope:** In-scope paths, sources, systems, and explicit exclusions.
- **Source hierarchy:** Primary sources, live filesystem/runtime evidence, user-attested facts, and disallowed evidence.
- **Secret policy:** Do not print secret values; report path, pattern class, exposure risk, and required action only.
- **Read/write boundary:** Read-only or exact write set with prohibited paths.
- **Validation:** Commands, parsers, tests, source checks, or manual proof expected before return.
- **Output schema:** Fields the parent needs to integrate the result.
- **Stop conditions:** Missing credentials, unsafe action, source conflict, locked resources, destructive ambiguity, or scope uncertainty.
- **Cleanup:** Temporary artifacts to remove unless they are needed as named evidence.

## Failure Modes

- **Critical-path delegation:** Do the blocking task locally unless a subagent result can arrive while useful parent work continues.
- **External mutation risk:** Do not let subagents mutate connector-backed objects, live infrastructure, credential stores, or production systems without exact user authorization and a validation plan.
- **Missing evidence:** Ask the agent for evidence or verify directly before relying on the result.
- **No explicit authorization:** Do not spawn; explain that delegation requires explicit user authorization.
- **Parallel write collision:** Serialize the work or split into disjoint write sets.
- **Secret exposure risk:** Narrow scope or stop before reading credential stores or printing sensitive material.
- **Unavailable role:** Use an exposed role or work locally; do not claim a custom role exists.

## Output Contract

When this skill is used, report:

- Delegation decision and reason.
- Agent roles used or why none were used.
- Lane objectives, scopes, and write boundaries.
- Validation performed by agents and by the parent.
- Material findings adopted, rejected, or reopened.
- Residual risks and any closed or still-running agents.

## Examples

### Read-Only Explorer

The user asks to use agents for a setup audit. Spawn an explorer to inspect a bounded path read-only while the parent implements a separate local batch. The explorer reports evidence and validation gaps; the parent verifies before editing.

### Disjoint Worker

The user asks to split a frontend refactor. Spawn one worker for `src/components/nav/*` and another for `src/components/forms/*`, with explicit no-overlap rules and validation commands. The parent reviews both diffs before finalizing.

### Inline Work

The task is a two-line config correction. Do not spawn; the parent can inspect, patch, and validate faster with less handoff risk.

### Persistent Agent

The user asks to create a reusable code-review agent. Route to `custom-agent-builder`; transient delegation rules do not authorize durable agent files.

## Source Ledger

- OpenAI Codex subagents documentation, `https://developers.openai.com/codex/subagents`. Used for Codex custom agents, explicit triggering, and delegation boundaries.
- Current Codex session tool metadata. Used for exposed transient roles, inherited model behavior, fork-context control, worker ownership guidance, and wait/close behavior.
