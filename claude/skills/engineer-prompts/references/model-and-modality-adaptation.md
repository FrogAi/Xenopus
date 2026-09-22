# Model and modality adaptation

Adapt expression to verified language, model, modality, product and interface mechanics while
preserving the contract. Do not force one template or provider's conventions onto every surface.

## Render what the real surface accepts

Identify the actual surface: single field, separate messages, stored prompt/agent, template, API
request or creative interface. Distinguish model capabilities from application capabilities;
verify material mechanics through [evidence-and-research.md](evidence-and-research.md).

Use supported native facilities for structured output, tools and controls when they improve the
contract. Prose cannot replace required configuration. Separate settings from instructions where
the interface does, and supply usable placement and attachment, reference, variable and tool bindings.

Trace behavior-changing settings to requirements, user choices, verified mechanics or an explicit
recommendation explaining the effect. Retention/storage, sampling, reasoning effort, tools,
persistence and cost/latency/quality choices require this basis; parameter availability alone does
not authorize them. Honor deliberate settings and bounded delegation; do not invent controls.

Remove target-irrelevant instructions and examples without losing required behavior or context.
Keep necessary setup visible and separate external settings from copyable instructions.

## Preserve meaning across languages

Distinguish instruction, input and output languages from literal content. Preserve obligation
strength, source priority, domain meaning, examples and exclusions. Keep placeholders, schema keys,
enums, tool names, code and quoting boundaries literal unless localization is explicitly authorized.
Resolve material terminology ambiguity; consult target guidance where language affects support.
Handle mixed-language inputs when required. Translation does not authorize a different task or output.

## Choose the relevant form

| Target/use | Specify when material |
| --- | --- |
| Language or reasoning | Outcome, audience, sources, obligations, output and inability behavior. Use headings, delimiters, examples and schemas for actual clarity or target support. Ask for evidence, calculations or concise rationale when needed; not private chain-of-thought. |
| Code | Available repository/files, applicable instructions, allowed change scope, preserved behavior, environment, tools, requested artifact and verification. Distinguish implementation from diagnosis or review; do not assume repository or terminal access. |
| Image | Subject/action, composition, environment, lighting, color, style, fidelity and reference relationships according to the intended result. Put aspect ratio, negative controls, seeds or weights only where supported. For producing, editing or repairing the image itself, use the `create-images` skill. |
| Video | Scene/sequence, framing and motion, timing, continuity and references. Distinguish single-shot generation, storyboard, image-to-video, extension and editing. Use actual supported duration and other controls. |
| Text-to-speech | Exact words to speak and separately supported delivery/pronunciation controls. Verify whether tags and stage directions are interpreted or spoken. |
| Voice design | Intended reusable voice characteristics and supported references/settings. Do not confuse designing a voice with synthesizing supplied speech. |
| Sound effects or music | Intended audible event or musical structure, texture/instruments, timing, mood and duration. Establish speech/vocals/lyrics boundaries as needed; do not transfer controls between products. |
| Multimodal | Each input's modality, order, role, accessible format and authoritative relationship. Resolve conflicting evidence and distinguish content, style, identity, layout and other reference purposes. |

Creative prompts should express the controllable result clearly. Do not append workflows, schemas
or exhaustive questionnaires because they suit another model. Use examples for relevant benefit.

## Reusable agents, automations and chatbots

Apply the runtime context, intervention, authority and gate rules in [prompt-contract.md](prompt-contract.md). Establish
tool access, state and output destination. Use progress, retries, recovery and persistence only for
required behavior on a supporting host; prose cannot create compaction, durable memory, pausing,
idempotency or external execution.

Identify missing application configuration, deterministic validation or integration at its owner;
implement only within scope. Evaluate the prompt and relevant integration before claiming full-flow
performance; stronger prose cannot establish it.

## Unknown or changed targets

Use the target-neutral path in [evidence-and-research.md](evidence-and-research.md) for unknown mechanics. When the target, interface,
tools or settings change, recheck affected guidance and behavior; prior target results do not
certify the new one.
