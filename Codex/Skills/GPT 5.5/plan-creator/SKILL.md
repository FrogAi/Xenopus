---
name: plan-creator
description: "Use to create/audit/refine/decompose execution plans and checklists. Not for execution, summaries, prompts, or skills."
---

# Plan Creator

## Mission

Build execution plans that an agent can follow correctly without relying on hidden context, stale training data, unstated judgment, or optimistic verification. Optimize for correctness, completeness, evidence quality, reliability, and debuggability. Do not optimize for speed, token cost, brevity, or convenience.

Stay in the planning layer while this skill is active. Do not execute solely because this skill was invoked. When the same user request asks for plan-and-execute, build the plan first, then route execution to the appropriate runtime, skill, or direct tools after the plan passes validation. Do not create hidden archives, backups, duplicate plan versions, scratch folders, or plan-memory files. Write a plan only when the user asks for a file, the task clearly needs a durable recovery artifact, or the current workflow already named a plan path. If a write path is not obvious and the plan needs durability, choose the least surprising path in the current workspace and report it.

## Definitions

- **Plan:** A self-contained execution artifact for an agent runtime. It contains the objective, scope, context, evidence, dependencies, ordered steps, validation, halt conditions, cleanup, and residual risks.
- **Target runtime:** The executor that will follow the plan, such as Codex, Claude Code, an Octopus agent, a subagent, a smaller model, a low-effort model, a future fresh session, or a human operator.
- **Weakest practical executor:** The least capable realistic executor that may need to follow the plan. Default to a fresh low-context agent unless the user names a stronger executor.
- **Floor-lifting:** Adding enough structure, context, evidence, branches, and verification that the weakest practical executor performs as close as possible to its own capability ceiling.
- **Material ambiguity:** Missing or contradictory input that changes scope, order, target runtime, source of truth, write location, safety gate, side effect, validation, or done condition.
- **Embedded evidence:** Current source findings placed inside the plan where the executor needs them. A plan may include a bounded research step only when the step's job is research and the step supplies exact source rules and output schema.
- **Atomic step:** A step with one primary action, one observable success criterion, and one primary verification method. Use composite steps only when the underlying operation is truly indivisible.
- **Verification gate:** A step whose only job is to prove prior work is safe to proceed from. Use before irreversible or high-blast-radius actions.
- **Irreversible or high-blast-radius action:** Deploys, migrations, data mutations, force pushes, package publishes, DNS changes, credential changes, external sends, billing actions, production setting changes, or connector writes that cannot be undone by deleting a local file.
- **Rollback path:** A concrete procedure to reverse or contain a failed step. Required for side effects and high-blast-radius actions.
- **Ceremonial inflation:** Adding steps, sections, audits, or process labels that do not materially improve execution reliability.

## Non-Negotiables

- Verify current official or primary sources before relying on mutable facts about tools, APIs, packages, frameworks, laws, security practices, model behavior, CLI flags, settings, connectors, or deployment platforms.
- Read relevant local files, configs, prior plans, project instructions, tickets, logs, and code paths before planning when local context affects correctness.
- Ask a clarifying question only when the answer cannot be discovered and a wrong assumption would materially change the plan.
- State assumptions explicitly with impact and stop conditions. Do not hide uncertainty inside confident steps.
- Keep the target runtime's model and effort controls external unless the user explicitly asks the plan to require a specific runtime setting.
- Make every non-trivial step executable by a low-context agent: include exact paths, commands, expected outputs, source links, decision branches, and done conditions.
- Include dependency readiness before execution: tools, credentials, MCP servers, plugins, connectors, CLIs, runtimes, packages, environment variables, permissions, and network access.
- Include validation strong enough to prove the success criteria, not just tests that are convenient to run.
- Include rollback, halt, and escalation conditions before side effects.
- Keep the plan as small as possible while preserving executor reliability. Trivial work gets a trivial plan.
- Delete or avoid temporary planning artifacts. Do not create backups or archived plan copies unless the user explicitly asks for them.

## Modes

- **Build:** Create a new plan from a goal and context.
- **Decompose:** Split a large plan into parent and child plans with explicit dependencies and handoff contracts.
- **Refine:** Improve an existing plan using feedback, execution results, new evidence, or audit findings.
- **Sequence:** Reorder existing steps using dependency analysis, risk order, and parallel-eligibility.
- **Validate:** Audit an existing plan without executing it.

## Workflow

1. **Classify mode and target runtime.** Identify whether the user wants Build, Refine, Decompose, Sequence, or Validate. Identify who will execute the plan and what capability limits that executor has.
2. **Scope the job.** Capture objective, non-goals, in-scope paths or systems, prohibited actions, expected deliverable, output location, risk level, and user-approved side effects.
3. **Inspect local context.** Read the files, project instructions, settings, history, logs, tickets, and existing plans that materially affect the plan. Do not plan from memory when local evidence exists.
4. **Verify current sources.** Fetch official or primary sources for mutable facts. Embed the findings the executor needs. If source verification is unavailable, label that blocker or assumption instead of presenting the claim as fact.
5. **Check dependencies.** List required tools, credentials, connectors, MCP servers, CLIs, runtimes, package managers, browsers, validators, and services. Classify each as Ready, Missing, Disabled, Unauthenticated, Stale Risk, Credential Risk, or Unknown.
6. **Challenge bad premises.** Push back when the requested plan is unsafe, impossible, stale, vague, ceremonially inflated, wrong-layer, or less reliable than a simpler route. Provide the corrected route.
7. **Choose plan shape.** Use the smallest structure that can carry the required evidence and validation. Use a durable file only when the plan needs recovery across context loss or the user asked for one.
8. **Draft steps.** Decompose into atomic steps. For each step, define action, inputs, success criterion, verification, branches, side effects, rollback, cleanup, and owner.
9. **Decompose or parallelize only when earned.** Use child plans or subagent lanes when work has independent failure modes or large context isolation value. Route spawn execution details to `subagent-spawner`.
10. **Simulate weak execution.** Walk the plan as the weakest practical executor. Fix any step that requires hidden context, unbounded judgment, missing credentials, unstated source lookup, ambiguous verification, or memory from the authoring conversation.
11. **Run an adversarial audit.** Check for missing dependencies, stale facts, unverified claims, step gaps, circular dependencies, dangerous order, missing rollback, bad cleanup, ambiguous paths, and validation theater.
12. **Deliver or write.** Return the complete plan in chat or write the named durable file. After writing, re-read the file and validate the on-disk content.
13. **Report validation.** State sources checked, files inspected, assumptions, skipped checks, residual risks, and the next execution action.

## Plan Contract

Every non-trivial plan must contain these sections, in this order:

1. **Metadata:** Plan ID, created date, target runtime, mode, complexity, status, owner, and output path when written.
2. **Objective:** One sentence stating the outcome.
3. **Non-goals:** What the executor must not do.
4. **Scope:** Paths, systems, accounts, branches, environments, and external services in scope.
5. **Current Evidence:** Local evidence and source evidence with verified-on dates for mutable facts.
6. **Dependency Readiness:** Required tools, credentials, connectors, MCPs, CLIs, runtimes, validators, browser tooling, and setup status.
7. **Assumptions And Unknowns:** Each assumption with impact, validation method, and stop condition.
8. **Execution Steps:** Ordered checklist using the step schema below.
9. **Verification Gates:** Cross-step validation before risky transitions and at completion.
10. **Rollback And Halt Conditions:** Recovery paths and exact stop points.
11. **Cleanup:** Temporary files, branches, logs, caches, scratch outputs, and duplicate artifacts to remove.
12. **Residual Risks:** Remaining uncertainty with impact and mitigation.

## Step Schema

Each execution step must use this shape:

```text
- [ ] Step <number>: <imperative action>
  - Purpose:
  - Inputs:
  - Action:
  - Success criterion:
  - Verification:
  - If blocked:
  - Side effects:
  - Rollback:
  - Cleanup:
```

Rules:

- Use exact paths, command names, config keys, issue IDs, source URLs, and expected outputs when known.
- Use "not applicable" only when the field genuinely does not apply.
- Put research findings before the step that needs them. Do not write "research best practices" as a vague prerequisite.
- Give every branch an observable condition. Do not say "if needed" without naming how the executor knows it is needed.
- Give every validation command an expected exit code, expected output, or explicit interpretation rule.
- Use alphabetical order for lists only when priority, dependency, chronology, or severity does not matter.

## Mode-Specific Rules

### Build

Create the full plan from current evidence. If the task is simple, create a short plan with only the sections that change execution quality. If the task is long-running, write a durable plan file and keep it as the single source of truth.

### Refine

Read the existing plan in full, then update the plan as a whole. Do not patch one step if the feedback reveals a structural flaw across the plan. Do not create backup copies. If the prior file must be preserved for audit history, ask the user for that explicit archival decision.

### Decompose

Create a parent plan plus child plans only when decomposition improves correctness or context survival. Each child must have a clear owner, inputs, output contract, dependency list, validation, and parent handoff. The parent must define how child completion is verified.

### Sequence

Build a dependency graph from inputs, outputs, side effects, and validation gates. Order steps by dependency first, then risk reduction, then evidence freshness, then execution convenience. Mark parallel-eligible groups only when they have no write conflicts and no hidden shared context.

### Validate

Audit the plan as read-only. Findings must name the broken step or section, severity, evidence, why it matters, and the exact fix. Do not rewrite unless the user asks for refinement.

## Validation Checklist

Before delivery, verify:

- The plan has a single clear objective and no hidden second project.
- Every material mutable claim is source-checked or labeled as unresolved.
- Every dependency is listed with readiness status.
- Every step has a success criterion and verification method.
- Every side effect has a rollback or containment path.
- Every risky transition has a verification gate before it.
- The plan can survive compaction or handoff to a fresh executor.
- The weakest practical executor can determine the next action at every point.
- There are no instructions to make the executor re-research a fact that should have been embedded.
- There are no vague phrases that ask the executor to inspect, verify, cover risk, or follow quality norms without concrete criteria.
- There are no backup, archive, scratch, or duplicate-output instructions unless the user explicitly requested them.
- The final on-disk file, if written, was re-read and matches the intended content.

## Output Contract

For Build, Refine, Decompose, and Sequence, deliver:

- The complete plan or written path.
- Source ledger with verified-on dates for mutable facts.
- Files and configs inspected.
- Dependency readiness result.
- Assumptions and unknowns.
- Validation performed on the plan itself.
- Residual risks.
- Next exact execution action.

For Validate, deliver:

- Verdict: Keep, Keep But Slim, Fix Before Execution, Rebuild, or Reject.
- Findings ordered by severity.
- Exact fix for each finding.
- Source and local evidence.
- Residual risks and blocked validations.

## Failure Modes

- **Bad sequence:** A later step depends on evidence or state not created yet. Reorder or add a prerequisite.
- **Ceremonial plan:** The plan is larger than the task. Shrink to the smallest reliable plan.
- **Context-loss risk:** A long task lacks durable state. Write one canonical plan file and update it instead of creating duplicates.
- **Deferred research:** The plan tells the executor to research a known-needed fact later. Embed the current finding or define a bounded research task.
- **Hidden side effect:** A step mutates state without naming side effects and rollback. Add gates before execution.
- **Junk creation:** The plan creates backups, scratch files, or archives by habit. Remove them unless explicitly required.
- **Missing dependency:** A required tool, credential, connector, MCP, CLI, runtime, or permission is absent. Add setup, route around it, or halt.
- **Stale source:** A mutable claim lacks current primary-source verification. Fetch, label unavailable, or remove the claim.
- **Under-specified step:** The executor cannot know what to do next. Add paths, inputs, outputs, and branch conditions.
- **Verification theater:** The check does not prove the success criterion. Replace it with task-specific validation.
- **Weak-executor failure:** A fresh agent would need hidden judgment. Split the step or add embedded context.
- **Wrong layer:** The user wants execution, prompt authoring, skill authoring, AGENTS.md work, or subagent spawning. Route to the right skill or runtime.

## Examples

### Trivial Plan

For "rename this local variable and run the focused test," produce a 2-step plan: edit the exact symbol, run the named test. Do not add architecture review, rollout planning, or unrelated audit steps.

### Research-Dependent Plan

For "upgrade this Stripe integration," inspect the installed SDK version, fetch the official migration guide and changelog for that version path, embed the relevant breaking changes in the affected steps, and include tests plus rollback before any deployment step.

### Weak-Executor Plan

For "create a plan a smaller model can execute," include exact file paths, commands, expected outputs, source findings, halt conditions, and cleanup. If a step still requires flagship reasoning, mark it as requiring a stronger executor instead of pretending the plan solves that limit.

## Source Ledger

- OpenAI Codex skills documentation, `https://developers.openai.com/codex/skills`. Use for current skill frontmatter, progressive disclosure, sidecar metadata, invocation policy, dependency declaration, discovery, and invocation behavior; refresh before relying on mutable Codex runtime details.
- OpenAI Codex subagents documentation, `https://developers.openai.com/codex/subagents`. Used for delegation boundaries, explicit-spawn behavior, built-in/custom agents, inheritance, and approval/sandbox implications.
- OpenAI prompt engineering and Codex prompting guidance, `https://developers.openai.com/codex/prompting` and `https://developers.openai.com/api/docs/guides/prompt-engineering`. Used for clear instructions, sequential steps, explicit output constraints, examples, and context discipline.
- OpenAI reasoning best practices, `https://developers.openai.com/api/docs/guides/reasoning-best-practices`. Used for planning-vs-execution separation, accuracy/reliability tradeoffs, clear constraints, and multistep planning guidance.

Refresh these sources during use when plan format, target runtime behavior, model behavior, or mutable domain guidance affects the plan.
