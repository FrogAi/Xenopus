---
name: root-cause-bug-finder
description: "Use to find root cause of bugs, failing tests, regressions, crashes, endpoint errors, logs, CI failures, or events."
---

# Root Cause Bug Finder

## Mission

Find the actual cause of a specific bug. Build an evidence chain from observed symptom to root-cause code path, validate the chain with reproduction or equivalent production evidence, and identify the smallest correct fix route. Do not settle for plausible patches, retries, sleeps, guards, broad refactors, or "works on my machine" explanations.

Stay in the investigation layer while this skill is active. Do not edit files solely because this skill was invoked. When the same user request asks to fix the bug, complete the root-cause investigation first, then route execution to the matching repair surface: `surgical-change-finder` for change-shape decisions, `code-optimizer` for performance fixes, `migration-writer` for migration artifacts, `test-creator` for regression tests, `backend-implementer` for backend changes, or direct tools for narrow local edits.

## Definitions

- **Bug:** A concrete failing test, production error, crash, wrong output, regression, flaky behavior, timeout, data inconsistency, or user-visible behavior mismatch.
- **Symptom:** The externally observed failure: command output, stack trace, log line, status code, screenshot observation, event ID, expected-vs-actual result, or failing test name.
- **Root cause:** The smallest cause-level explanation that makes the symptom expected and predicts how the bug disappears when fixed.
- **Evidence chain:** Numbered links from symptom to root cause. Each link cites file/line or tool output, names the reasoning, and states confidence.
- **Reproduction:** A command, request, input, fixture, trace replay, test run, or production evidence path that demonstrates the symptom.
- **Confidence:** High when the symptom is reproduced or observed with equivalent production evidence and the chain is confirmed by source or runtime evidence. Medium when source evidence is strong but reproduction is unavailable. Low when material hypotheses remain.
- **Band-aid fix:** A change that hides the symptom without addressing the cause, such as retrying a flaky test, sleeping longer, catching and ignoring an exception, adding a null guard without explaining why null is produced, or broadening a timeout without identifying the slow path.
- **Nondeterminism source:** The actual cause of a flaky bug, such as race, timing dependency, global state leak, test-order dependency, random seed, clock dependency, external service variability, or resource contention.

## Non-Negotiables

- Capture the symptom verbatim before investigating.
- Reproduce locally when feasible. If local reproduction is impossible, identify the production or CI evidence that substitutes and state the confidence cap.
- Generate competing hypotheses before settling when the cause is not obvious from the first evidence link.
- Read the failing test, stack trace, highest relevant user-code frame, recent changes, relevant config, and call path before recommending a cause.
- Do not treat the first plausible suspect as the root cause. The root cause must explain the symptom and fit all material evidence.
- Do not recommend a fix before the evidence chain reaches the root cause. If the chain is incomplete, state the missing evidence.
- Do not call a retry, sleep, blanket catch, broad null guard, or unrelated refactor a fix unless evidence proves it addresses the cause.
- For flaky tests, identify the nondeterminism source. A retry is only a temporary mitigation and must be labeled that way.
- For regressions, use git history, diff review, and bisect when feasible. A bisected commit is chronology, not root cause, until the diff is tied to the symptom.
- For production bugs, protect sensitive data. Do not print secret values, private payloads, PII, PHI, or credential material.
- Clean up temporary test outputs created during investigation when safe, but do not delete project caches or artifacts the project expects without explicit reason.

## Workflow

1. **Classify the bug.** Failing test, production error, unexpected behavior, regression, flaky test, crash, data issue, or performance-class bug with a concrete symptom.
2. **Extract the brief.** Record symptom, expected result, actual result, environment, command or request, stack trace, event ID, affected version, recent change, and any known-good/known-bad range.
3. **Check dependencies.** Identify required local runtime, package manager, test command, database/service, browser, credentials, observability connector, or log source. Mark missing or unsafe dependencies before relying on them.
4. **Inspect local evidence.** Read the failing test, stack trace, highest user-code frame, relevant implementation, config, fixtures, recent git diff/log, and project instructions.
5. **Reproduce or observe.** Run the smallest safe repro. For CI-only or production-only bugs, use logs, traces, event details, sanitized payloads, or failing CI output as substitute evidence and label the confidence cap.
6. **Generate hypotheses.** List at least three plausible causes unless the evidence immediately identifies one cause. For each, name evidence for, evidence against, and the next check that would confirm or reject it.
7. **Trace the execution path.** Follow inputs, state changes, branches, side effects, async boundaries, dependency calls, generated code, and error handling from symptom toward cause.
8. **Confirm the root cause.** The final cause must predict the symptom and explain why alternatives are weaker. If it cannot, continue investigation or report the blocker.
9. **Check blast radius.** Use `downstream-impact-tracer` or equivalent read-only search when the root-cause symbol has consumers that could be affected by a fix.
10. **Define the minimal fix route.** If the user asked for a fix, route to the smallest correct implementation path after the evidence chain is validated. Otherwise, provide a fix sketch and validation plan.
11. **Define regression validation.** Name the test or probe that should fail before the fix and pass after the fix. Route to `test-creator` when a new test is needed.
12. **Self-review.** Re-read cited files or command output, verify each evidence-chain link, recalibrate confidence to the weakest material link, and scan for band-aid behavior.
13. **Deliver.** Report root cause, evidence, confidence, fix route, validation, residual risks, and cleanup performed.

## Evidence Chain Contract

Every investigation report must include:

```text
Symptom:
Reproduction or observation:
Hypotheses:
Evidence chain:
Root cause:
Confidence:
Minimal fix route:
Regression validation:
Blast radius:
Residual risks:
```

Each evidence-chain link must include:

- Source: file:line, command output summary, log/event reference, trace span, or test result.
- Claim: what the evidence proves.
- Reasoning: how it connects to the previous and next link.
- Confidence: High, Medium, or Low.

## Confidence Rules

- **High:** Repro or equivalent production evidence exists, the root-cause path is tied to source or runtime evidence, and the proposed fix route explains why the symptom disappears.
- **Medium:** Static evidence strongly supports the cause but repro or runtime confirmation is unavailable.
- **Low:** One or more material hypotheses remain unresolved.

Do not inflate confidence because the hypothesis is plausible, the fix is easy, the user is impatient, or the failure matches a familiar pattern.

## Bug-Class Notes

- **Failing test:** Run the focused test first, then the smallest broader suite that can reveal fixture or order dependency.
- **Production error:** Use sanitized logs, traces, event IDs, and environment/config evidence. Do not expose sensitive values.
- **Unexpected behavior:** Capture expected and actual outputs, then find the first branch where they diverge.
- **Regression:** Establish known-good and known-bad points. Use `git bisect` when feasible; reset bisect state afterward.
- **Flaky test:** Characterize frequency with repeated runs when safe. Identify race, timing, global state, random seed, external dependency, or resource contention.
- **Performance-class bug:** Confirm that the symptom is a bug, not a general optimization request. Route measurement-heavy work to `performance-benchmarker` or `code-optimizer` after the hot path is identified.

## Output Contract

Return:

- Bug class and symptom.
- Repro command or observation source, including result.
- Hypotheses considered and rejected.
- Evidence chain with file/line or tool-output evidence.
- Root cause with confidence and confidence rationale.
- Minimal fix route or fix sketch.
- Regression validation plan.
- Blast-radius notes.
- Any sensitive-data handling or redactions.
- Temporary artifacts created and cleaned up, or none.
- Residual risks and next exact action.

## Failure Modes

- **Band-aid fix:** Proposed change masks the symptom. Reject and continue to cause-level analysis.
- **Bisect misuse:** Bisected commit is treated as semantic cause. Read the diff and connect it to the symptom.
- **Cleanup miss:** Investigation creates temp outputs and leaves them behind. Remove them when safe or report why retained.
- **Environment drift:** Local and failing environments differ. Record differences and avoid High confidence unless evidence bridges them.
- **Flaky retry trap:** Retry is proposed as fix. Identify nondeterminism source or label retry as temporary mitigation only.
- **Incomplete chain:** A link lacks evidence. Stop before recommending a fix or label confidence lower.
- **Instrumentation distortion:** Debug logging or breakpoints change timing. Re-test without the instrumentation before claiming cause.
- **Missing regression validation:** Cause is found but no proof path exists. Define a red-before/green-after test or probe.
- **No repro:** Local command does not reproduce. Use CI/production evidence, state confidence cap, and identify missing environment factors.
- **Overbroad fix route:** Recommended fix touches more than root cause requires. Route to `surgical-change-finder` for minimal change.
- **Premature suspect:** First plausible cause is accepted without rejecting alternatives. Generate hypotheses and test them.
- **Sensitive data exposure:** Logs or payloads contain private material. Redact values and preserve only the shape needed for reasoning.

## Examples

### Failing Test

Run the named test, read the assertion and setup, follow the failing branch, identify the first value that diverges, and tie the divergence to the root-cause line. Recommend the smallest fix route and a regression test that fails before the fix.

### Regression

Use known-good and known-bad SHAs. Bisect when feasible. Treat the first bad commit as a lead, then inspect the diff and prove which changed line explains the symptom.

### Flaky Test

Run repeated attempts when safe. Compare pass and fail logs. Identify the nondeterminism source before recommending changes. Do not accept retry as the fix.

## Source Ledger

- OpenAI Codex skills documentation, `https://developers.openai.com/codex/skills`. Use for current skill frontmatter, progressive disclosure, sidecar metadata, invocation policy, dependency declaration, discovery, and invocation behavior; refresh before relying on mutable Codex runtime details.
- Git `bisect` documentation, `https://git-scm.com/docs/git-bisect`. Used for regression investigation and bisect cleanup behavior.

Refresh these sources during use when skill format, debugging tool behavior, git behavior, observability platforms, test runners, or framework behavior affects the investigation.
