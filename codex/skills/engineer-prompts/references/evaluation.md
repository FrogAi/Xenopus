# Evaluation and readiness

Use for meaningful behavioral changes; creation or assessment of reusable, unattended, consequential
or production prompts; readiness or performance claims; or changes to engineer-prompts itself. Evaluate the
requested artifact and actual use, not this entire skill.

## Review every artifact

Check the whole result against what was agreed: every mandatory requirement and priority is covered; terms whose meaning changes the result, runtime inputs and what the target should do when it cannot comply are defined; the target can reach the context it needs within its limits; claims about the target and its configuration rest on matching evidence; the author's permissions are kept apart from the target's, and the target knows which sources to trust; outcomes the user accepts separately and required stops stay separate, and it is clear whether a person can intervene at run time. Read [prompt-contract.md](prompt-contract.md) for any of these that apply and that you have not resolved. Verify that every requirement reaches the target with an observable
check. Remove clauses, examples, steps, fields and settings without a requirement or evidenced need.
The result must be readable and directly usable with its setup.

Findings need a violated requirement, a plausible triggering condition, the resulting behavior or output, and support; distinguish defects from preferences and untested concerns. State that consequence as what would then happen, not only as something that cannot be verified. Unless you are a subagent assigned to review the artifact, obtain useful fresh independent scrutiny for complex, consequential or broad work within authority. Give neutral requirements, the exact
artifact and necessary evidence; seek disconfirming cases and deletable complexity. Adjudicate
with evidence, not votes.

## Test meaningful behavior

For the work this reference covers, including repairs, define acceptance criteria and representative tests. Wording or
formatting changes that preserve meaning can use source comparison and structural checks. Cover
relevant normal, boundary, failure and adversarial inputs in behavioral tests, including
missing/conflicting context and instruction-bearing data where applicable. Test long-run coverage
or multi-turn behavior when required; do not add unrelated schemas, providers or modes.

Run useful target tests within the authoring authority set under [prompt-contract.md](prompt-contract.md). Without target access
or authority, perform useful review and provide relevant expected tests; label expectations rather
than presenting them as observed outputs.

Before testing, fix candidate/version, the targets it will run on, criteria, inputs, run count and stopping rule appropriate to variability and consequence; a pass on one host or model does not cover another. Record actual target/interface/settings, context, observations and
failures sufficiently to reproduce and assess the claim; mark unknown values. Use temporary
fixtures or an existing setup. Retain regressions and evidence with continuing value; do not build
a new framework merely to author a prompt.

Distinguish parseability, schema conformance, task correctness and successful authorized actions;
valid JSON proves neither a correct decision nor tool execution. Verify outcomes at their actual
boundary. Use suitable deterministic checks and clear subjective rubrics; calibrate material
model-based judgments against inspectable cases. An unvalidated grader cannot establish correctness.

Compare candidates' task outcomes under comparable targets, settings and inputs while preserving mandatory behavior. Run compared candidates interleaved, and when outputs are judged rather than checked deterministically, grade them without knowing which candidate produced each. Use held-out or independently chosen cases when tuning risks overfitting.
Report inconclusive differences; shortness and author preference do not prove improvement. With a handful of runs per case, count a difference only when chance is an unlikely explanation (for example 4 of 4 against 0 of 4) and otherwise record no detectable difference; a guarded case at that size shows the change is not badly broken, not that nothing regressed. After revising wording because a test failed, check it on one or two new cases written from the requirement alone by someone who hasn't seen the failed case. For behavior that fails late in long sessions, include a case run after a realistic multi-step task or a replay of the real context; a fresh single-turn session doesn't cover it.

Diagnose failures before revising: distinguish prompt defects from context, target/harness limits, integration faults, bad expectations and unexplained variation. To find which instruction drives an unwanted behavior, check whether the target's narration names it or ask it in a test run to quote the instruction it acted on, then confirm by changing that clause alone and rerunning the same cases. Fix the in-scope cause, retain useful constraints, and rerun failed and affected cases, including the nearest case the fix must leave unchanged. When the target cannot reliably produce an output the prompt asks for, such as exact tallies, and that output is not a mandatory requirement, narrow or remove the demand before adding procedure. Broaden regressions when other behavior
may change. Do not add permanent clauses for every anomaly or retry until a sample passes.

Permission violations, unsupported claims, lost requirements, instruction takeover and false
completion cannot be averaged away. Known material defects prevent acceptance. Stop when criteria
and meaningful verification hold, or report the controlling constraint and remaining gap.

## State exactly what is ready

Describe construction status in plain language:

- **Complete for the stated surface:** Required choices, evidence, authority, context and placement
  are resolved. Name any defined runtime inputs still to bind. This does not establish performance.
- **Target-neutral draft:** Intent is resolved but target mechanics remain unverified. Name remaining
  adaptation/evidence needs; do not call it optimized.
- **Blocked:** A mandatory requirement, essential dependency, authority boundary or contradiction
  prevents completeness. Identify what resolves it; draft labels and placeholders cannot conceal it.

Separately state review-only or actual target-test status. For tests, report material conditions,
acceptance result, coverage and limits. Failed, incomplete or inconclusive required tests are not
passes. Deployment/production readiness requires agreed operational criteria and verified
dependencies; wording, documentation, schema validation and a few samples cannot establish it.
Passing samples never guarantee future behavior.

Make verification status explicit for permanent, unattended or consequential prompts even when fully
specified. For simple prompts, keep it brief. Apply the main skill's delivery rules and exceptions.

## Maintaining engineer-prompts itself

When changing or release-testing engineer-prompts, use `$improve-personal-customizations` for
baseline, candidate, proportional verification, review, installation, recovery and records. Apply
these prompt-specific checks where relevant:

Map changed requirements to existing meaningful regressions. For broad rewrites, review all
applicable modes and boundaries and select finite representative cases covering clarification and
immediate drafting, context/evidence/authority, adaptation, schemas/tools, source trust, acceptance
units/gates, readiness and delivery. Include affected positive and close non-triggers. Test provider
or modality details when changed or needed for a claim; do not keep a fixed list of providers or expectations that no longer hold.

Apply the testing rules above to raw scenarios and allowed actions. Give fresh performers the
skill, realistic request, necessary inputs and authority; keep expected properties and suspected
defects separate. Retain actual outputs, failures, adjudication and source/candidate identities.
Role-play decisions and source inspection do not prove real target performance.

If the skill-creator skill is installed, run its `scripts/quick_validate.py` on the skill folder, otherwise check the frontmatter and references by hand; inspect metadata, references, source scope, encoding, duplication
and orphan resources. When discovery/loading contracts change or necessary loading evidence remains
unverified, verify active discovery and enabled state in a fresh runtime. Include relevant description,
metadata, packaging and installation/runtime changes. Supplied-text tests do not prove native loading.
For changed triggers, test required implicit selection on a real surface or disclose that discovery
and explicit invocation do not prove it.

Verify installed content under the maintenance owner's process. Candidate behavior tests remain
valid after byte-identical installation unless installation or runtime introduces a material
difference or unresolved concern; repeat affected behavior only when that warrants it.
