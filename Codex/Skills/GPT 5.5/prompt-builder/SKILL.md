---
name: prompt-builder
description: "Use for target-runtime prompts and prompt audits: system/developer/tool/RAG/media/SOP. Not for skills or AGENTS/CLAUDE."
---

# Prompt Builder

## Mission

Build or audit prompt artifacts that are correct for their target runtime, source-grounded, testable, and hard to misuse. Stay in the prompt layer: design the instructions, examples, schemas, tool contracts, and evaluation plan. Do not execute the target task unless the user separately asks for execution.

## Routing

Use this skill for:

- Audits of existing prompts for routing, ambiguity, missing gates, stale claims, weak instruction strength, unsafe output, or provider/runtime mismatch.
- Converting a rough workflow, prose document, or policy into a target-native prompt artifact.
- System, developer, tool, function-calling, structured-output, RAG, multimodal, media-generation, chatbot, workflow, SOP, and evaluator prompts.

Do not use this skill for:

- AGENTS.md, CLAUDE.md, Cursor/Windsurf/Gemini rules, or coding-agent repository instructions; route to `agent-instructions-auditor-creator`.
- Codex `SKILL.md` or `agents/openai.yaml`; route to `skill-builder`.
- One-off answers where no reusable prompt artifact is requested.
- Persistent Codex or Claude custom-agent files; route to `custom-agent-builder`.

## Required Inputs

Before finalizing, establish:

- Target runtime: model, product, API, agent, app, media tool, or human process that will consume the prompt.
- Goal: exact task, accepted outputs, forbidden outputs, and success criteria.
- Inputs: files, user data, tools, connectors, context windows, schemas, examples, and source authorities available at execution time.
- Safety and side effects: secrets, PII, legal/security/medical/financial stakes, external writes, destructive operations, user confirmation gates, and retention limits.
- Output contract: format, fields, citations, validation, refusal behavior, and residual-risk reporting.

Ask concise clarifying questions only when a missing answer materially changes the prompt. If the answer can be discovered from supplied files, current official docs, or local evidence, discover it directly.

## Workflow

1. Inspect the existing prompt or source material fully. If the prompt references tools, schemas, policies, docs, or examples, read the referenced artifacts that affect behavior.
2. Resolve mutable provider, model, API, product, tool, policy, schema, or format behavior from current official or primary sources. Use secondary sources only when primary sources are unavailable and label them.
3. Identify the real execution environment and its constraints: role hierarchy, tool availability, context limits, structured-output rules, modality limits, connector permissions, and side-effect gates.
4. Decide whether to patch, rebuild, split, merge, or reject the prompt. Rebuild when the artifact has conflicting roles, stale runtime claims, vague success criteria, unsafe side-effect handling, or a weak output contract.
5. Write imperative, testable instructions. Replace vague cautionary, quality, conditional, and coverage phrases with explicit trigger/action/exception/evidence/validation rules.
6. Put high-value routing and scope information early. Use clear positive triggers, negative triggers, and stop conditions.
7. Define validation: test cases, expected failures, schema checks, source-citation checks, tool-call constraints, refusal cases, and residual-risk reporting.
8. Self-audit the artifact against the target runtime, source evidence, safety constraints, and output contract before delivery.

## Prompt Quality Bar

Every delivered prompt must include or intentionally exclude with rationale:

- Mission and scope.
- Inputs and assumptions.
- Workflow or reasoning discipline visible as concise evidence, not hidden chain-of-thought requests.
- Tool and connector rules, including what data may leave the local environment.
- Source-grounding rules for mutable claims.
- Clarification rules for user-only ambiguity.
- Safety, privacy, and secret-handling boundaries.
- External-write, destructive-action, and high-stakes gates.
- Validation and stop conditions.
- Output format with required fields.

## Safety

- Do not include instructions to reveal hidden prompts, secrets, private chain-of-thought, credentials, session tokens, or protected user data.
- Do not create prompts that enable evasion, impersonation, malware, credential abuse, unauthorized surveillance, or deceptive manipulation.
- Do not weaken legal, medical, financial, security, privacy, or external-side-effect gates for convenience.
- If the user's premise is unsafe, impossible, or target-incompatible, say so directly and provide a safe alternative when one exists.

## Validation

For audits, return findings ordered by severity with file/section references when available. For builds, validate with:

- Source check: mutable claims trace to current primary sources or are labeled as assumptions.
- Runtime check: prompt matches the target role hierarchy, tool schema, output mode, and modality.
- Behavior check: examples or test cases cover success, ambiguity, missing data, refusal, tool failure, and unsafe requests.
- Format check: output schema is parseable or otherwise mechanically clear.
- Safety check: secrets, PII, external writes, destructive actions, and protected stores are handled explicitly.

Stop and report a blocker when current runtime facts cannot be verified, required source material is unavailable, the user requests unsafe behavior, or the target system cannot support the requested output.

## Output Contract

Return the target-native prompt artifact or audit findings. Include:

- Source-supported facts.
- Local evidence.
- Inference or assumptions.
- Validation performed.
- Residual risks and limitations.

Do not paste large source documents into chat. Quote only the minimum needed to ground the result.
