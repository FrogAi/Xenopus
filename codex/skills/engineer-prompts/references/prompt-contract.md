# Prompt contract

## Contents

- Establish what success means
- Clarify decisions, not ordinary phrasing
- Conditional semantics that names do not settle
- Close runtime dependencies
- Keep authority separate
- Preserve acceptance units and gates

Use when resolving material semantics, runtime dependencies, authoring or target authority, or
separate acceptance units and gates. Keep the resolved contract as concise working state.

## Establish what success means

Establish the intended outcome, audience, actual target surface, inputs and authoritative sources,
required behavior and output, constraints, authority, and observable success, failure and stopping
conditions. For reusable work, distinguish fixed instructions from changing inputs and establish
whether a human can answer questions or intervene at runtime.

Separate requirements, preferences, optional additions and accepted defaults. Record material
decisions' source and priority. Implementation discretion does not permit waiving requirements.

## Clarify decisions, not ordinary phrasing

Resolve material gaps, as [SKILL.md](../SKILL.md) defines them, before drafting. In addition to its rules:

- Disclose choices you make under delegated judgment when the user needs them to understand the result.
- Recommend defaults from evidence, expressed priorities or a clear tradeoff rationale; obtain
  informed acceptance when a default resolves a material user choice.
- Define intentionally variable runtime inputs as described below.

Handle routine wording, organization and creative implementation independently. Ask only for
semantics the task needs; these examples are not an exhaustive questionnaire. Models, documentation
and convenient guesses cannot decide the user's policy or supply accepted defaults.

Scan all known material gaps before each batch and group related questions into one batch. Reuse known answers and continue as many rounds as necessary when new gaps emerge.
Do not hide known related blockers behind serial questions. Independent research or internal
sketches may proceed; draft prompts and placeholders must not silently settle unresolved choices.

## Conditional semantics that names do not settle

Inspect supplied definitions first. Resolve missing semantics or obtain bounded delegation where
alternatives materially change the result:

| Task dependency | Meaning to establish |
| --- | --- |
| Classification, scoring, ranking, approval, or routing | Governing policy, definitions, thresholds, precedence, and treatment of insufficient or conflicting evidence. Enums supply allowed labels, not decision criteria. |
| Extraction, selection, transformation, or fixed-count results | Inclusion/exclusion, counting unit, deduplication, ordering, evidence spans and normalization as needed. Define too few/too many and selection policy when correctness depends on them; never invent filler, duplicates, truncation, or ranking. |
| Machine-consumed schema | Material field types, allowed values, nullability, cardinality, units, precision/canonical form, and missing/error behavior. Key names do not define these. |
| Input validation or numeric/status reporting | Distinguish structural type from domain validity. Resolve relevant absent/null/empty/whitespace, malformed/range, coercion, duplicates and invalid-item cases. Define trigger, population, overlap/double-counting and timing when they affect results. An error label is not an input sentinel or a counting rule. |
| Tool-dependent decisions or effects | Actual input/result schemas and detectable success/error signaling; relevant state, execution ownership, idempotency/retry safety and host phases. A signature or error name alone does not define whether an action succeeded. |

A request for creative suggestions does not automatically need selection algorithms or error
taxonomies. Resolve choices that change a required contract. Make delegated consequential policies
and their implications visible; do not attribute them to the user's source material.

## Close runtime dependencies

Establish how the target receives each necessary policy, fact, file, schema, example, tool, state
or variable: embedded text, supported attachment/message, defined runtime input or verified
authorized retrieval. Record source, location, access and freshness when material. An unresolved
essential dependency prevents a complete target-specific deliverable.

Do not assume access to this conversation, local files, prior runs, URL contents or unsupported
capabilities. For persistent prompts, define how changing policies and data stay current; transient
observations are not permanent truth. If inputs exceed verified limits, use a supported strategy
that preserves coverage or obtain a scope decision; never silently truncate required context.

Runtime bindings defer intentionally changing values, not design decisions. Define type/meaning,
delivery location and material missing/invalid behavior. Calling a hardcoded policy or creative
direction replaceable does not authorize it. Missing tool mechanics can be defined inputs to an
intentional template; they cannot establish that an unresolved deployment is complete.

For unattended work, agree on supported results, failure signals, escalation or stopping for missing
input, uncertain evidence, unavailable capabilities, execution failure or needed approval; do not
rely on a reply nobody can supply.
Preserve intended dialogue and clarification for interactive chatbots. When completeness or
persistence is required, define scope/denominator, progress evidence, legitimate pause and recovery,
and terminal conditions using actual host capabilities.

## Keep authority separate

Establish authoring permission to inspect, transmit, test, spend or change separately from target
permission to read, disclose, execute, send, mutate or spend.  Define relevant target tool/action boundaries and approval points.

Before an uncovered action, prepare the exact candidate, destination, minimum content, purpose,
effects and bounded plan so approval is concrete. Without execution access or authority, deliver
useful authorized work and relevant test cases with honest limits.  Expose incompatible target requirements.

## Preserve acceptance units and gates

Identify outcomes the user can accept, reject or revise independently, including one that consumes
another's result. Always give these separate acceptance units separate prompts, even with shared
topic, sources, tools or authority. State sequencing or independence and each prompt's context,
allowed work, acceptance condition, stop and transition.

Keep components, prerequisites, revisions, recovery and validation together when they serve one
cohesive outcome under the same resolved inputs, authority and stop. A useful step, section, field,
file or report alone does not create a unit; diagnosing, implementing and verifying one fix may
remain one prompt.

Also split at every gate requiring a separate verdict, evidence checkpoint, fresh authority or
approval before later work. Its prompt must report and stop even on pass. Name the controlled
later work, including research, planning/design, preview, prototyping and execution when applicable;
the gate prompt must not begin it. Define the observable exit and fresh input or authority for continuation.

Intermediate discovery within one outcome is not a gate. On one-shot surfaces, an external actor
or actual host mechanism must enforce transitions; otherwise report the gated workflow blocked.
A prompt cannot authorize its own continuation. Do not invent approval stages.
