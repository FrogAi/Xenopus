---
name: skill-builder
description: "Use for Codex skills: SKILL.md, agents/openai.yaml, sidecars, routing, and portfolio fit. Not for prompts or custom agents."
---

# Skill Builder

## Mission

Build, audit, modify, convert, or repair Codex skills so they route correctly, execute reliably, stay source-grounded, and validate their own work. Stay in the Codex skill layer. Do not execute the task described by the skill being built unless the user separately asks.

## Routing

Use this skill for:

- Codex skill directories, `SKILL.md`, `agents/openai.yaml`, and justified `scripts/`, `references/`, or `assets/` sidecars.
- Converting a workflow or prompt into a Codex skill.
- Creating, auditing, rebuilding, renaming, splitting, merging, removing, packaging, or validating Codex skills.
- Diagnosing Codex skill invocation, routing, sidecar metadata, MCP dependency declarations, or portfolio conflicts.

Do not use this skill for:

- AGENTS.md, CLAUDE.md, Cursor/Windsurf/Gemini rules, or repository coding-agent instructions; route to `agent-instructions-auditor-creator`.
- Claude skills unless a Codex skill explicitly references Claude behavior and current Claude docs must be compared.
- Durable Codex or Claude custom-agent TOML/Markdown definitions; route to `custom-agent-builder`.
- Hidden hooks, prompt appenders, wrappers, watchdogs, or runtime machinery.
- Plain prompts or non-Codex instruction artifacts; route to `prompt-builder`.

## Current Codex Contract

Before judging or editing a skill, refresh current official Codex/OpenAI docs that affect the work. Treat the following as mutable and verify when material:

- A Codex skill is a directory with a required `SKILL.md` containing YAML frontmatter `name` and `description`.
- Optional sidecars include `scripts/`, `references/`, `assets/`, and `agents/openai.yaml`.
- Codex uses progressive disclosure: initial discovery sees name, description, and path; full `SKILL.md` loads only after selection.
- The initial skill list is capped; descriptions may be shortened or omitted when many skills are installed. Front-load routing triggers and boundaries.
- Skills can be invoked explicitly. Implicit invocation depends on the `description` unless `policy.allow_implicit_invocation` is false.
- `agents/openai.yaml` may define `interface.display_name`, `interface.short_description`, `interface.default_prompt`, invocation policy, and concrete MCP tool dependencies.
- Declare `dependencies.tools` only for real MCP dependencies with current official support and a concrete server identifier or URL. Do not invent dependencies for ordinary plugins, apps, or local shell tools.
- Plugins are the distribution unit for reusable skills and app integrations. Direct skill folders are the local authoring unit.
- Codex custom agents are separate TOML files under Codex agent roots and are not `agents/openai.yaml`.

Use official OpenAI/Codex docs as source of truth. Use the open Agent Skills spec and other provider docs only as secondary support when Codex docs are silent; label conflicts.

## Workflow

1. Inventory the target skill root or named skill. Exclude system skills unless the user explicitly scopes them in.
2. Read the full `SKILL.md`, full `agents/openai.yaml` when present, and every directly referenced sidecar that affects behavior. Do not read credential stores, sessions, histories, caches, browser stores, databases, or secret-bearing files.
3. Parse frontmatter and sidecars with YAML tooling or a strict parser. Do not rely on visual plausibility.
4. Assess routing: name, directory alignment, description triggers, negative boundaries, sidecar display text, default prompt, implicit-invocation policy, duplicates, stale names, and portfolio conflicts.
5. Assess behavior: mission, executable workflow, source grounding, autonomy, validation, stop conditions, safety/privacy gates, cleanup expectations, and output contract.
6. Decide disposition: keep, patch, rebuild, rename, split, merge, remove, or investigate. Choose rebuild over patch when accumulated edits would leave contradiction, bloat, stale source ledgers, weak routing, or unclear execution.
7. Edit only scoped Codex skill artifacts. Preserve useful domain specificity, remove filler, and use imperative instructions.
8. Keep `SKILL.md` compact enough for progressive disclosure while complete enough to execute. Move bulky examples or references into sidecars only when they are useful and directly referenced.
9. Re-run validation across the edited skill and then across the portfolio.

## Skill Quality Bar

Every retained skill must have:

- Valid YAML frontmatter with `name` matching the directory and a clear `description`.
- Strong description that front-loads use cases, positive triggers, and negative boundaries.
- Explicit mission, routing rules, workflow, source-grounding rules, validation, stop conditions, output contract, and relevant safety/privacy/cleanup rules.
- Instructions written as commands, not vague suggestions.
- Autonomy rules: ask only for material user-only ambiguity; otherwise inspect sources, docs, local files, tools, tests, connectors, and companion skills directly.
- Current-source posture: mutable facts are refreshed during execution, not frozen as dated truth.
- Sidecar metadata that is useful, valid YAML, human-readable, and honest about implicit invocation and dependencies.

## Safety

- Do not print secret values. If credential-like material is discovered, report only path, pattern class, and risk.
- Do not edit Claude skills, credentials, sessions, histories, logs, caches, browser stores, database files, sandbox secrets, auth files, or protected runtime state unless explicitly scoped and safe.
- Do not create backups, duplicate skill versions, hidden hooks, wrappers, prompt appenders, watchdogs, or machinery unless the user explicitly asks and the behavior is safe.
- Gate external writes, connector writes, live infrastructure changes, destructive filesystem operations, and legal/security-sensitive actions.

## Validation

Run validation appropriate to the change:

- Parse every edited `SKILL.md` frontmatter.
- Parse every edited `agents/openai.yaml`.
- Verify name/directory alignment and required metadata.
- Scan for stale names, old source-date claims, placeholders, TODO/FIXME, weak optional phrasing, provider confusion, unsupported fields, and generic default prompts.
- Verify referenced sidecars exist and avoid protected stores.
- Scan for high-confidence secret values without printing them.
- Check portfolio routing conflicts, duplicates, companion-skill fit, and missing high-value coverage.

Report skipped checks explicitly. Do not claim production readiness when validation was partial.

## Output Contract

For audits, return direct verdict, systemic findings, per-skill table, detailed findings with absolute paths and lines, source facts, local evidence, inference, validations run, and recommended actions.

For edits, return whether the skill layer meets the requested bar, changed files, per-skill summary, validations and results, and residual risks or blockers.

For new or rebuilt skills, write the files to disk when the user authorized edits. Do not paste full files unless asked.
