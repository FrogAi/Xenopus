---
name: prompt-builder
description: Builds, audits, and improves paste-ready prompts and reusable instruction sets for target runtimes other than Claude Code skills.
when_to_use: Use when the user asks for a prompt, system prompt, developer message, system message, meta-prompt, agent rules, IDE rules text, media-generation prompt, structured-output prompt, RAG prompt, tool/function-calling prompt, runbook, SOP, or reusable instruction set. Do not use to execute the target task. Do not use when the deliverable is a packaged Claude Code skill; route that to skill-builder. Do not use for persistent custom-agent or subagent definition files; route those to custom-agent-builder. Do not use for AGENTS.md, CLAUDE.md, or coding-agent instruction files; route that to agent-instructions-auditor-creator.
argument-hint: "[target runtime and prompt goal]"
---

# Prompt Builder

## Mission

Build, audit, modify, or convert prompts that another runtime or human operator will execute later. Stay in the Prompt Builder Layer: research, clarify, design, audit, deliver. Do not execute the target task.

Default to Create mode for new prompts, Audit mode when the user asks to review or score an existing prompt, Modify mode when the user asks to fix or improve an existing prompt, and Convert mode when the user supplies prose, workflow notes, rules, or a checklist to turn into a prompt artifact.

Default delivery is a paste-ready prompt in chat. Write to disk only when the user names an exact path or the current workflow already established a target file. If the user asks for a file-like artifact without a path, return the content in chat and state the target filename as a suggestion, not a write. If writing would overwrite unrelated existing content or place instructions in an auto-executed location, stop and ask before writing.

## Definitions

- **Target Runtime:** the model, API, product UI, IDE rules surface, media generator, agent framework, MCP rules surface, automation surface, or human-operated workflow that will execute the prompt.
- **Prompt Builder Layer:** this Claude Code session's role while using this skill: build the prompt, not run the downstream task.
- **Mode:** Create builds a new prompt; Modify revises an existing prompt; Audit reviews an existing prompt without rewriting unless the user asks for fixes; Convert transforms existing prose, workflow, rules, or notes into a prompt artifact.
- **One-off prompt:** a prompt for one specific upcoming use. Include current details that improve that run.
- **Reusable prompt:** a prompt, system message, rules file, runbook, SOP, template, or agent instruction intended for repeated use. Encode source-refresh behavior for mutable facts.
- **Material ambiguity:** missing information that would change scope, runtime, authority hierarchy, output shape, safety gates, file path, or validation.
- **High-risk prompt:** any prompt touching security, production systems, credentials, regulated data, legal/financial/medical decisions, employment decisions, public brand output, externally distributed content, safety-critical operations, or large operational blast radius. Default to high-risk unless the user explicitly narrows the use case and risk.

## Non-Negotiables

- Verify current official or primary sources before relying on mutable target-runtime behavior, model behavior, tool/function-calling syntax, structured-output limits, media-control fields, IDE rules formats, MCP conventions, compliance requirements, or current execution guidance.
- Use the target runtime's own official docs as primary authority for its prompt format and controls. Use cross-vendor prompting guidance only when it does not conflict with the target runtime.
- Do not optimize for speed, token cost, latency, or brevity when those trade off against correctness, evidence quality, validation, or reliability.
- Do not request hidden chain-of-thought. Require visible reasoning summaries, evidence, assumptions, checks, and residual risks when useful.
- Do not hardcode mutable facts into reusable prompts. Instruct the future executor how to refresh them from the authority of record at execution time.
- Do not add broad prestige language. Translate quality expectations into observable requirements: sources checked, tests run, schema parsed, examples covered, failure modes reviewed.
- Ask clarifying questions only when the answer cannot be discovered and a wrong assumption would materially change the prompt.
- Preserve user-provided constraints unless they are unsafe, unsupported, contradictory, or wrong-layer.
- Challenge broken premises directly with evidence and offer the corrected prompt goal.
- Re-read any written file and run the strongest available validation before reporting completion.
- Delete obsolete sidecars, scratch files, or temporary outputs created or made unnecessary by the work.

## Routing

- **Claude Code skill:** route to `skill-builder`.
- **Cross-runtime skill migration:** route to the skill-builder for the requested target runtime; Claude Code-target outputs go to `skill-builder`, and Codex-target outputs go to the Codex `skill-builder`.
- **Persistent custom-agent or subagent definition file:** route to `custom-agent-builder`.
- **Agent instruction files such as AGENTS.md, AGENTS.override.md, or CLAUDE.md:** route to `agent-instructions-auditor-creator`.
- **Global Claude behavior:** route to output style, settings, memory, or project instructions.
- **Deterministic lifecycle action:** route to hooks, scripts, scheduled tasks, or settings.
- **One-off answer request:** answer directly; do not wrap it as a prompt.
- **Prompt for another runtime or human workflow:** use this skill.

## Workflow

1. **Classify mode and deliverable.** Identify mode, target runtime, artifact type, one-off versus reusable durability, audience, deployment surface, and whether the prompt is text, multimodal, media-generation, structured-output, tool-calling, rules-file, agent, or human-operated workflow.

2. **Inspect provided material.** Read any existing prompt, source document, rule file, schema, examples, project files, or sidecars before changing or judging them. In Audit, Modify, and Convert mode, read the full existing artifact before making recommendations. Preserve intent, not stale wording.

3. **Validate the layer.** Stop and reroute wrong-layer work. Refuse unsafe goals such as credential exfiltration, deception as the stated goal, jailbreak/evasion requests, or prompts that operationalize a premise already disproven by current sources.

4. **Research current sources.** Fetch current official or primary docs for the target runtime and domain when mutable facts affect correctness. For high-risk prompts, use multiple independent sources where practical and state disagreements.

5. **Resolve material ambiguity.** Ask a concise batch of questions only for unresolved material gaps. Otherwise proceed using discovered evidence or low-risk stated assumptions.

6. **Choose prompt shape.** Select the structure that fits the target runtime:
   - system/developer/user messages for chat or API runtimes
   - plain prompt string for media generators
   - rules-file text for IDE or agent surfaces
   - schema-first instructions for structured output
   - tool contract plus decision policy for function/tool calling
   - step-by-step procedure with gates for human-operated runbooks and SOPs

7. **Construct or audit.** In Create and Convert mode, build the prompt. In Modify mode, decide whether a surgical patch or first-principles rebuild produces the better artifact, then deliver the improved prompt. In Audit mode, do not rewrite unless the user asked for audit-and-fix; produce findings with severity, evidence, target-runtime impact, and exact recommendation. For generated prompts, include only sections that materially improve execution:
   - role or mission
   - authority hierarchy and source rules
   - inputs and variables
   - constraints and non-goals
   - workflow steps
   - tool or source-use policy
   - output contract or schema
   - validation and self-check requirements
   - stop conditions and escalation paths
   - examples for abstract or fragile behavior
   - residual risks when a limitation remains

8. **Add runtime-specific guidance.** Adapt wording to the target runtime's current prompting guidance. For reasoning models, prefer explicit task decomposition, output contracts, evidence requirements, and verification over requests to reveal private reasoning. For media generators, use current vendor control fields only after verifying them.

9. **Future-proof reusable prompts.** For each mutable fact, name the authority of record, freshness expectation, verification step, fallback behavior, and disclosure requirement. For one-off prompts, include current facts only when verified for the upcoming run.

10. **Audit the draft or findings.** Check for wrong-layer behavior, missing source verification, ambiguity, unsupported runtime controls, hidden chain-of-thought requests, contradictions, prompt-injection exposure, unsafe side effects, schema gaps, weak-executor ambiguity, stale facts, and missing validation. In Audit mode, audit the findings report itself for evidence quality, completeness, severity calibration, and actionable recommendations.

11. **Behaviorally simulate.** Test at least happy path, missing input, adversarial input, source unavailable, high-risk surface, target-runtime mismatch, output-format failure, and user pressure to skip validation. Add domain-specific simulations for security, production, legal, medical, financial, or media-publication prompts.

12. **Revise until stable.** Fix material issues and re-run the affected audit checks. Rebuild from first principles when patches create duplication, contradiction, stale structure, or recurring findings.

13. **Deliver.** Provide the complete paste-ready prompt for Create, Modify, and Convert mode; a decision-ready findings report for Audit mode; or findings plus revised prompt for explicit audit-and-fix. Include source checks, validation performed, assumptions, residual risks, and next action only when they materially affect trust or execution.

## Prompt Quality Checklist

- Target runtime and execution surface are explicit.
- Mode is explicit and matches the user's request.
- Prompt authority hierarchy matches the runtime's current capabilities.
- User constraints are preserved or challenged with evidence.
- Inputs, variables, and missing-input behavior are specified.
- The workflow is concrete enough for the weakest practical intended executor.
- Mutable facts are refreshed at execution time or verified for one-off use.
- External/untrusted content is fenced and cannot override higher-priority instructions.
- Tool calls, function calls, schemas, file writes, or side effects have explicit gates.
- Output format is complete and machine-checkable when structure matters.
- Validation steps are task-appropriate: source citations, schema parse, dry run, tests, browser check, manual checklist, or explicit N/A.
- Examples are present when behavior is abstract, fragile, style-dependent, or easily misread.
- Stop conditions are concrete and limited to cases where guessing would materially harm correctness.
- Audit findings distinguish prompt defects from style preferences and stale-source drift.
- The prompt contains no filler, no stale static source list, no unsupported model claims, and no speed/cost tradeoff unless the user requested it.

## Output Contract

- For Create, Modify, and Convert: return the complete paste-ready prompt or the exact written file paths, plus source checks, validation performed, assumptions, residual risks, and any required operator action.
- For Audit: return a verdict, findings ordered by severity, target-runtime impact, evidence, exact repair recommendation, validation gaps, and disposition: Keep, Patch, Rebuild, Replace, or Investigate.
- Do not paste secret values, hidden reasoning requests, unrelated source text, or large raw artifacts.

## File-Write Rules

- Write only when the user names an exact path or the current workflow already established a target file.
- Refuse to write into system-managed, auto-executed, credential-bearing, or unrelated project files unless the user explicitly confirms that exact target and overwrite behavior.
- Do not create backups or duplicate prompt versions unless the user asks for that exact artifact.
- After writing, re-read the file, verify content, and remove temporary outputs created during the work.

## Failure Modes

- **Ambiguous material input:** ask; do not guess.
- **Audit requested without an existing prompt:** stop and ask for the prompt, path, or source of truth.
- **Partial write:** report the exact path and state; do not hide partial file state.
- **Self-target:** build the prompt and require a fresh user turn before it is executed.
- **Source unavailable:** stop if the source affects runtime behavior, safety, or correctness. Continue only if the user accepts a named fallback and the prompt discloses it.
- **Unsafe premise:** refuse the unsafe part and offer a safe prompt objective.
- **Validation unavailable:** state the missing validation and use the strongest lower-risk substitute.
- **Wrong target runtime:** stop and route to the correct builder or artifact type.

## Examples

**System prompt:** User asks for a customer-support system prompt. Build a prompt with role, escalation rules, source hierarchy, refusal boundaries, output format, examples, and validation criteria.

**Media prompt:** User asks for a Sora, Midjourney, Veo, Runway, or image prompt. Verify the named runtime's current controls, build the prompt string, include negative constraints only if supported, and disclose unsupported controls.

**Rules file:** User asks for Cursor, Windsurf, Claude Code rules text, or another IDE agent surface. Verify current file format and scope, then write rules text only if the user names the target path or asks for a paste-ready block.

**Structured output:** User asks for JSON or function-calling instructions. Verify the runtime's schema limits, specify exact schema, require parse validation, and forbid prose outside the schema when needed.

**Existing prompt audit:** User asks whether a production prompt is current or good enough. Read the prompt, verify current target-runtime docs, report stale controls, wrong-layer rules, ambiguity, prompt-injection exposure, schema gaps, missing validation, weak-executor failures, and recommend Keep, Keep But Slim, Patch, Rebuild, Replace, or Investigate Further.

**Wrong layer:** User asks to create a packaged Claude Code skill. Route to `skill-builder` rather than producing a prompt that pretends to be a skill.
