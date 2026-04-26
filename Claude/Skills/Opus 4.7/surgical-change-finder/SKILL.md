---
name: surgical-change-finder
description: Finds the smallest correct change path for a specific code goal before implementation. Use for "minimal patch," "surgical fix," "least invasive change," "smallest blast radius," "change as little as possible," or "is there a one-line fix?" Avoid broad codebase tours, unknown-root-cause debugging, general refactors, pure performance benchmarking, migration authoring, and test creation after the change path is already known.
when_to_use: Use when the user wants to identify, compare, or justify the smallest safe implementation strategy for a concrete code behavior change. Do not use when the user only wants a bug investigated with no known cause, when the request is intentionally architectural, when the task is a broad cleanup, or when the implementation path has already been selected.
argument-hint: "[goal, symptom, expected behavior, target file/symbol, constraints, or candidate change]"
---

# Surgical Change Finder

## Mission

Find the smallest correct change path for a concrete code goal. "Smallest" means the least machinery and narrowest behavioral surface that fully achieves the goal without hiding the root cause, breaking contracts, weakening validation, or creating future cleanup debt.

Stay in the decision layer while this skill is active. Do not edit source files solely because this skill was invoked. When the same user request asks to implement the selected path, finish the surgical analysis first, then route execution to direct edits or the appropriate implementation skill with the chosen candidate, validation plan, and residual risks.

## Definitions

- **Goal:** The exact behavior, bug fix, feature slice, refactor target, or constraint the change must satisfy.
- **Non-goal:** Adjacent work that is not necessary for the goal. Non-goals are kept out of the candidate set.
- **Candidate:** A distinct implementation strategy that could satisfy the goal.
- **Smallest correct change:** The candidate that satisfies the full goal with the narrowest safe blast radius and no hidden correctness debt.
- **Blast radius:** The files, symbols, callers, data contracts, tests, runtime paths, generated artifacts, deployments, and external consumers likely affected by the candidate.
- **Surgical candidate:** A candidate localized to one behavior site, usually one function or one file, with no public contract change and no unrelated cleanup.
- **Localized candidate:** A candidate contained within one module or tightly coupled set of files, with private contract changes only.
- **Structural candidate:** A candidate that changes public contracts, signatures, schemas, shared abstractions, or multiple modules.
- **Architectural candidate:** A candidate that crosses service, deployment, persistence, security, or ownership boundaries.
- **Band-aid candidate:** A candidate that hides the symptom without fixing the cause, such as swallowing errors, adding retries, widening timeouts, adding broad null guards, or special-casing one caller without explaining why that caller is unique.
- **Goal shrinkage:** Excluding mechanically required work from the goal to make a structural change look surgical.
- **Scope creep:** Adding adjacent cleanup, refactors, style changes, or feature work not required by the goal.
- **Validation proof:** The specific test, type check, lint, repro, runtime probe, browser check, or source-backed reasoning that should prove the selected candidate works.

## Non-Negotiables

- Restate the goal and non-goals before ranking candidates.
- Verify root cause first for bug fixes. If the cause is unknown, route to `root-cause-bug-finder` or perform equivalent investigation before recommending a patch.
- Do not equate fewer lines with higher quality. A one-line change that widens behavior for many callers can be worse than a slightly larger caller-local change.
- Generate multiple candidates when more than one plausible strategy exists. Include caller-side, callee-side, config/data, existing-abstraction, and new-abstraction options when relevant.
- Reject band-aids unless the user explicitly asks for a temporary mitigation. Label any mitigation as temporary and separate it from the cause-level fix.
- Reject goal shrinkage. Required call-site, schema, test, migration, documentation, or generated-code updates count as part of the real change.
- Reject scope creep. Offer adjacent work as a separate cycle, not as part of the minimal change.
- Inspect existing patterns before proposing new abstractions.
- Trace blast radius with the strongest available local evidence: references, call sites, tests, schemas, generated clients, route maps, config, migrations, and runtime entry points.
- Use current official or primary sources before relying on mutable framework, API, security, language, build-tool, or deployment behavior.
- State confidence honestly. Do not present a candidate as proven when evidence is static-only, partial, or blocked.
- Clean up temporary outputs created during analysis when safe.

## Workflow

1. **Classify the request.** Confirm whether the user wants a candidate analysis only, or analysis followed by implementation after the path is selected.
2. **Restate the goal.** Write the exact goal, known constraints, non-goals, and success signal. If the goal is ambiguous and the answer would change the candidate set, ask a focused clarification.
3. **Check root cause.** For bug fixes, identify the proven cause and evidence. If missing, route to `root-cause-bug-finder` or investigate until the cause is known or confidence is capped.
4. **Read the code path.** Inspect the relevant files, callers, tests, config, schemas, migrations, generated artifacts, and project instructions.
5. **Check current sources.** Fetch or inspect current official/primary docs when candidate viability depends on mutable behavior.
6. **List candidate strategies.** Produce all realistic strategies that satisfy the goal, including the smallest obvious patch and at least one safer-but-larger alternative when such an alternative exists.
7. **Classify each candidate.** Mark each as Surgical, Localized, Structural, Architectural, or Rejected. Explain the classification with evidence.
8. **Trace blast radius.** Use `downstream-impact-tracer` or equivalent read-only searches for candidate symbols and contracts. Include untraced surfaces instead of claiming completeness.
9. **Reject invalid candidates.** Remove candidates that fail the full goal, hide the cause, break contracts, depend on stale claims, or require unsafe side effects.
10. **Rank viable candidates.** Rank by correctness first, then blast radius, existing-pattern fit, validation strength, rollback simplicity, and operational risk. Speed and token cost do not affect the ranking.
11. **Select the recommendation.** Choose the smallest correct candidate. If no surgical or localized candidate can satisfy the goal, state `structural-required` or `architectural-required`.
12. **Define implementation route.** Provide the exact edit location, patch shape, and downstream implementation path. If the user requested implementation, proceed after the analysis through the appropriate edit workflow.
13. **Define validation proof.** Name the strongest red-before/green-after checks and any broader regression checks needed for the blast radius.
14. **Self-review.** Re-read cited lines and candidate classifications, check for hidden scope creep, goal shrinkage, band-aids, stale-source assumptions, and missing validation.
15. **Deliver.** Return the candidate report and the next exact action.

## Output Contract

Every report must include:

```text
Goal:
Non-goals:
Root-cause status:
Evidence inspected:
Candidates:
Recommended path:
Why not smaller:
Blast radius:
Validation proof:
Implementation route:
Residual risks:
Temporary artifacts:
```

For each candidate, include:

- Classification: Surgical, Localized, Structural, Architectural, or Rejected.
- Patch shape: file/symbol and conceptual diff.
- Evidence: file/line references, search results, test names, docs, or runtime observations.
- Blast radius: direct consumers, indirect consumers, untraced surfaces, and contract changes.
- Validation: checks that prove the candidate.
- Tradeoff: why it is better or worse than the recommended path.

## Ranking Rules

- Correctness outranks smallness.
- Cause-level fixes outrank mitigations.
- Caller-local changes outrank callee-wide changes when only one caller needs the behavior.
- Existing patterns outrank new abstractions unless the existing pattern is the cause of the problem.
- Contract-preserving candidates outrank signature/schema/API changes when both satisfy the goal.
- Fully traced candidates outrank partially traced candidates of the same correctness class.
- Validated candidates outrank unvalidated candidates.
- Structural honesty outranks surgical branding. If the correct change is structural, say so.

## Implementation Routing

- Use direct source edits when the recommended path is small, the user asked for implementation, and no specialized skill is needed.
- Route to `root-cause-bug-finder` when the cause is still unknown.
- Route to `downstream-impact-tracer` when blast radius needs deeper symbol or contract tracing.
- Route to `test-creator` when the missing piece is regression coverage for the selected path.
- Route to `migration-writer` when the selected path requires schema or data migration.
- Route to `code-optimizer` or `performance-benchmarker` when the goal is performance-shaped and requires measurement.
- Route to `plan-creator` when the verdict is structural-required or architectural-required and execution needs sequencing.
- Route to security, legal, or connector-specific skills when the path touches those risk surfaces.

## Failure Modes

- **Band-aid trap:** A retry, sleep, catch-all, timeout increase, or broad guard hides the symptom. Reject unless explicitly temporary.
- **Caller/callee inversion:** A callee-wide change is proposed when only one caller needs the behavior. Prefer caller-local unless shared behavior is intended.
- **Dynamic dispatch gap:** Reflection, string-based routing, event names, dependency injection, or feature flags hide consumers from text search. Report untraced surfaces.
- **Fewest-lines trap:** A tiny diff changes behavior for many callers. Count behavioral consumers, not only lines.
- **Generated-code gap:** Generated clients, lockfiles, build artifacts, or schema outputs are affected but not checked. Add them to blast radius.
- **Goal shrinkage:** Required call-site or schema updates are excluded from scope. Reclassify the true change honestly.
- **Mutable-doc drift:** Candidate depends on current API or framework behavior not verified from primary sources. Fetch sources or cap confidence.
- **Operational invisibility:** The smallest code diff changes production behavior without metrics, logs, flags, or rollout safety. Surface the operational risk.
- **Partial evidence overclaim:** Search coverage is incomplete. State the gap instead of claiming no downstream impact.
- **Pattern cargo cult:** Existing code style is copied even though it caused the defect. Prefer the cause-level fix.
- **Scope creep:** Adjacent cleanup gets bundled into the minimal patch. Split it out.
- **Security contract drift:** A small change touches auth, authorization, secrets, crypto, tenancy, or validation logic. Escalate risk and route to security review when needed.
- **Test theater:** Existing tests pass but do not cover touched behavior. Require a targeted regression check.
- **Unknown-cause patch:** A bug fix candidate appears before the cause is proven. Stop and investigate.

## Examples

### One Caller Needs Different Behavior

Goal: make one endpoint pass `includeArchived=true` to an existing service.

Candidate A changes the service default for all callers. This is not surgical if every caller now sees archived records. Candidate B passes the flag at the one endpoint. Candidate B is recommended if it satisfies the goal and preserves other callers.

### Signature Change Looks Small

Goal: add a required parameter to a shared function.

The function edit may be one line, but every caller must be updated or broken. Classify this as Structural unless a caller-local wrapper or optional parameter satisfies the goal without contract breakage.

### Guard Clause Looks Safe

Goal: stop a crash when `user` is null.

Adding `if (!user) return null` is rejected until the source of null is explained. If null is invalid state, the smallest correct change may be fixing the producer. If null is valid, the guard must preserve the function's contract and have a regression test.

## Source Refresh

- Claude Code skills documentation, `https://code.claude.com/docs/en/skills`. Used for skill frontmatter, lifecycle, allowed tools, sidecars, and model/effort inheritance.
- User maximum-quality standard, `C:\Users\James\.claude\output-styles\maximum-quality.md`, use at execution time as the local policy source. Used for local quality bar and source discipline.

Refresh current official or primary sources during use when candidate viability depends on framework behavior, language behavior, APIs, security practice, build tools, deployment platforms, package versions, or external services.
