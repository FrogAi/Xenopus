---
name: subagent-spawner
description: Decides when Claude Code should delegate work to subagents, then builds and runs tightly scoped subagent briefs when delegation materially improves correctness, context hygiene, isolation, or parallel evidence coverage.
when_to_use: Use when the user asks to spawn, delegate, fork, use agents, run work in parallel, split an investigation across subagents, or decide whether subagents are appropriate. Use when another skill or plan needs a delegation decision. Do not use for trivial inline work, for invoking ordinary skills, for persistent subagent or custom-agent definition authoring; route those to custom-agent-builder. Do not use when the task requires continuous back-and-forth in the main conversation.
argument-hint: "[delegation goal, scope, paths, and constraints]"
---

# Subagent Spawner

## Mission

Decide whether Claude Code subagents earn their overhead for the current task. When they do, create self-contained briefs that preserve the user's quality bar, keep the parent conversation in control of synthesis, and use native Claude Code subagent behavior instead of wrapper machinery.

Spawn when delegation materially improves correctness, evidence coverage, context isolation, tool restriction, worktree isolation, or independent parallelism. Work inline when delegation would add handoff loss, duplicate context gathering, create merge risk, or push final judgment away from the parent thread.

Do not optimize the decision for speed, token cost, or convenience. Optimize for the highest reliable result.

## Definitions

- **Parent thread:** The main Claude conversation. It owns decomposition, final judgment, user-facing answers, ledger updates, and verification of subagent claims.
- **Subagent:** A separate Claude Code agent context created through native Claude Code subagent behavior. Named subagents start with their own definition; forked subagents inherit the current conversation when fork mode is enabled.
- **Delegation lane:** One bounded unit of work assigned to one subagent.
- **Independent lane:** A lane with its own goal, input scope, output schema, failure modes, and write scope. Parallel lanes are independent only when their work does not require constant shared context and their writes cannot collide.
- **Handoff loss:** Accuracy risk introduced by moving work into another context: missing background, duplicated discovery, stale assumptions, malformed summaries, merge conflicts, or parent integration burden.
- **Quality gain:** Accuracy improvement from delegation: broader evidence, isolated verbose tool output, independent failure-mode coverage, specialized tools, isolated permissions, or concurrent review of unrelated surfaces.
- **Material ambiguity:** Missing or contradictory information that would change whether to spawn, lane count, lane scope, allowed side effects, subagent type, isolation mode, or validation plan.
- **Write-capable lane:** A lane allowed to edit files, mutate external systems, kill processes, change settings, install dependencies, deploy, send messages, or perform any other side effect.
- **Read-only lane:** A lane limited to reading, searching, testing, inspecting, summarizing, or reporting. It must not edit, delete, move, disable, install, send, deploy, authenticate, rotate secrets, or mutate connector state.
- **Weak-executor adequate brief:** A brief a fresh subagent can execute without hidden context. It includes objective, scope, paths, known facts, source rules, tool limits, output schema, validation steps, halt conditions, cleanup expectations, and uncertainty behavior.
- **Persistent subagent candidate:** A proposed durable subagent definition for future tasks. It requires a separate agent-building workflow with mission, non-goals, trigger evidence, overlap analysis, tool scope, validation plan, maintenance cost, and removal condition.

## Non-Negotiables

- Verify current official Claude Code documentation before relying on subagent fields, scope priority, model or effort inheritance, permission modes, foreground/background behavior, fork behavior, worktree isolation, skill preloading, or agent listing behavior.
- Prefer native Claude Code subagents, `/agents`, `claude agents`, `@agent-name`, `/fork`, skill `context: fork`, and documented settings over custom wrappers, prompt hacks, watcher scripts, or cache edits.
- Inherit the active session model and effort by default. Set model or effort only when the user explicitly asks or the current task has a source-supported reason that outweighs runtime control.
- Treat the user's direct request to spawn, delegate, fork, or run agents in parallel as authorization for delegation within the named scope. Ask only when material ambiguity, unsafe side effects, production impact, credential risk, or write-scope conflict remains.
- Keep final synthesis in the parent thread. Subagents gather evidence, produce bounded artifacts, or make disjoint scoped edits; the parent verifies and integrates.
- Do not ask a subagent to spawn another subagent. Chain subagents from the parent when sequential delegation is needed.
- Do not run parallel write-capable lanes against the same file, API resource, database object, branch, setting, credential store, or external system. Split the scope, serialize the work, or use one writer.
- Give every write-capable lane an exact write set, prohibited paths, validation commands, cleanup duties, and a parent-review handoff.
- Give every read-only lane an explicit no-write rule and a no-secret-value-disclosure rule.
- Do not delegate tasks that need frequent user back-and-forth, continuous parent context, or a quick targeted inline change unless the user explicitly chooses the tradeoff after seeing the handoff loss.
- Do not trust a subagent's summary as proof. Verify relevant files, diffs, commands, logs, citations, or returned evidence before acting on it.
- Repair or reject vague delegation prompts before spawning. A non-trivial lane brief must be executable by a fresh low-context agent without guessing about scope, evidence, side effects, validation, or stop conditions.

## Workflow

1. **Classify the request.** Identify whether the user wants a delegation decision, actual spawning, fork use, persistent subagent creation, or ordinary skill execution. Route persistent subagent or custom-agent definition work to `custom-agent-builder` when available. Use the documented Claude `/agents` workflow only when explicitly requested, approved, and no local custom-agent builder is available. If an ordinary task reveals a repeated durable-agent gap, record a persistent subagent candidate instead of creating it inside this skill.
2. **Check source freshness.** When runtime behavior affects the decision, verify official Claude Code docs and, when available, `claude agents` for the active roster. If those checks are unavailable, label the limitation and avoid claiming exact behavior.
3. **Extract the task.** Capture objective, non-goals, files or systems in scope, current known facts, what has already been ruled out, user-approved side effects, expected output, deadlines only if quality-relevant, and validation requirements.
4. **Apply the delegation test.** Spawn only when quality gain clearly exceeds handoff loss. Name both sides explicitly. Do not refuse solely because spawning costs time or tokens.
5. **Partition lanes.** Create the fewest lanes that cover the independent work. Prefer one lane per independent evidence category, module, system, or artifact. Merge lanes that share heavy context or write scope.
6. **Select execution mode.** Use foreground when the parent cannot proceed without the result or when interactive clarification may be needed. Use background for independent work where the parent can continue and all required permissions can be preapproved.
7. **Select context mode.** Use a named subagent when a focused role or tool restriction fits. Use a fork only when the lane needs substantial parent conversation context and fork mode is enabled. Use inline work when neither isolation nor parallelism improves quality.
8. **Select isolation.** Use worktree isolation for write-capable lanes when parent and subagent could edit overlapping repository state. Use in-place execution only for read-only lanes or non-overlapping write scopes.
9. **Choose subagent type.** Prefer an available specialized subagent whose description matches the lane. Otherwise use the general-purpose or explore-style agent the runtime exposes. Do not invent a subagent type.
10. **Build lane briefs.** Use the brief contract below. Make each lane self-contained; do not rely on "as discussed" or hidden parent context unless using a fork and still summarize the needed scope.
11. **Self-audit before launch.** Check independence, write collisions, source freshness, permission assumptions, secret handling, output schemas, and validation steps. Fix any issue before spawning or presenting the plan.
12. **Run or stage.** If the active runtime exposes subagent invocation and the request authorizes this delegation, run the lanes. If the runtime does not expose invocation or a gate remains, present the exact stage block and the unresolved gate.
13. **Verify returns.** Check that each subagent answered the requested schema and supplied evidence. Retry, narrow, or escalate malformed, unsupported, or contradictory returns.
14. **Synthesize in the parent.** Reconcile conflicts, verify material claims with tools or primary sources, apply edits only from the parent or from approved disjoint write lanes, and report residual risks.

## Brief Contract

Every lane brief must include these fields in this order:

1. **Goal:** One sentence naming the exact deliverable.
2. **Context:** Relevant background, paths, current findings, constraints, and facts already ruled out.
3. **Scope:** In-scope files, systems, sources, commands, and allowed tools. Name out-of-scope areas explicitly.
4. **Steps:** Ordered required steps, followed by open research questions where the subagent may choose methods.
5. **Side effects:** Read-only or write-capable. For write-capable lanes, list exact permitted writes and prohibited writes.
6. **Quality bar:** Require source-current verification for mutable facts, root-cause analysis, uncertainty labeling, no secret disclosure, and validation appropriate to the lane.
7. **Output schema:** Exact fields the parent needs, length cap if context hygiene matters, and citation or file-reference expectations.
8. **Halt conditions:** When to stop instead of guessing, including missing credentials, permission failure, unsafe action, conflicting source evidence, or scope ambiguity.
9. **Cleanup:** Temporary files, branches, logs, or test artifacts the lane must remove before returning unless needed as evidence.

## Stage Block

When presenting a delegation plan before execution, use this compact structure:

```text
Decision: spawn | do not spawn | stage only
Quality gain:
Handoff loss:
Lane count:
Execution mode: foreground | background | mixed
Context mode: named subagent | fork | inline fallback
Isolation: in-place | worktree | not applicable
Write policy:
Subagent types:
Validation:
Residual risks:
Lane briefs:
```

## Return Handling

- Reject a return that omits required schema fields, lacks evidence for material claims, hides uncertainty, reports edits outside scope, exposes secret values, or cannot be reconciled with local evidence.
- For contradictory returns, compare evidence quality before choosing. Prefer primary sources, local files, passing tests, and direct tool output over unsupported reasoning.
- For write-capable returns, inspect diffs and run validation before finalizing. Do not accept "I changed it" as proof.
- For read-only returns, keep only the distilled evidence the parent needs. Do not paste large raw logs or file dumps into the parent context.

## Output Contract

- For an executed delegation: report the decision, lanes run, subagent types, evidence received, parent-side verification, integrated changes if any, validation results, and residual risks.
- For a staged delegation: provide the Stage Block and complete lane briefs ready to run without hidden context.
- For a no-spawn decision: state the quality gain considered, handoff loss, inline path, validation plan, and any persistent-agent candidate worth recording elsewhere.

## Failure Modes

- **Background clarification failure:** A background lane needs user input. Retry foreground or narrow the brief so no question is needed.
- **Fork misuse:** Forking preserves too much noisy context or weakens isolation. Use named subagents or inline work instead.
- **Hidden parent context:** A named subagent would lack needed background. Add context to the brief or use a fork when enabled.
- **Invented subagent type:** The requested type is not in the active roster. Use an available type or ask the user to create one.
- **Over-delegation:** The task is small or tightly coupled. Work inline and state the handoff loss.
- **Parallel write collision:** Two lanes may mutate the same resource. Serialize, partition, or use a single writer.
- **Permission mismatch:** Background lane needs unapproved tools. Switch to foreground, preapprove correctly, or narrow the lane.
- **Secret exposure:** A lane may encounter tokens or credentials. Instruct it to report only path, pattern class, and risk.
- **Skill inheritance gap:** A subagent needs a skill the parent loaded. Explicitly preload or include the necessary instructions in the brief, following current Claude docs.
- **Summary trust failure:** The returned summary is not evidence. Verify with files, diffs, commands, logs, citations, or tests.
- **Under-delegation:** The task has independent evidence lanes that would improve correctness. Spawn or stage lanes.
- **Unverified mutable fact:** The lane depends on current APIs, laws, models, docs, or security practice. Add primary-source lookup to the lane.

## Examples

### Read-Only Parallel Audit

Use subagents for five independent skills. Each lane reads one skill, checks official docs where relevant, returns findings in the audit schema, and performs no writes. Parent updates the ledger and applies all edits.

### Refused Parallel Writes

Do not spawn three agents to edit the same migration file. Reframe as one writer plus one or more read-only reviewers, or serialize disjoint patches.

### Fork Candidate

Use a fork when the lane needs the current conversation's detailed context, such as drafting tests for changes the parent has been discussing for many turns. Use a named subagent instead when the lane can start from a self-contained prompt.

### Inline Better Than Spawn

Do not spawn for a single small file read or a two-line config fix. The parent can perform the work directly with less integration risk.

## Source Refresh

- Claude Code skills documentation, `https://code.claude.com/docs/en/skills`. Used for skill frontmatter, lifecycle, allowed tools, invocation controls, sidecars, and skill/subagent interaction.
- Claude Code subagents documentation, `https://code.claude.com/docs/en/sub-agents`. Used for subagent scope, roster discovery, foreground/background behavior, skill preloading, fork behavior, worktree isolation, and subagent limitations.

Refresh these sources during use whenever an exact runtime behavior affects spawning, permissions, isolation, or validation.
