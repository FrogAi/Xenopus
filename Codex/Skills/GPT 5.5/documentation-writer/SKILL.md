---
name: documentation-writer
description: "Use for local repo docs: README, guides, runbooks, ADRs, API docs, setup, migrations, and troubleshooting."
---

# Documentation Writer

## Mission

Create documentation that lets the intended reader act correctly without guessing. Ground docs in current local evidence and current primary sources when mutable public facts matter. Keep docs accurate, maintainable, scoped, and free of secret leakage.

Write local documentation files when requested. Do not publish to Confluence, send messages, update tickets, create releases, or mutate external systems from this skill.

## Routing

Use this skill for local repo docs or chat-delivered docs. Route Confluence work to `confluence-documentation-researcher`, release notes to `release-notes-creator`, PR descriptions to `pr-creator`, legal review to `legal-reviewer`, and prompt/skill/agent instructions to their owner skills.

## Workflow

1. Classify doc type: README, setup guide, runbook, ADR, API doc, migration guide, troubleshooting doc, onboarding doc, or audit.
2. Identify audience, task, source files, target path, freshness requirement, and whether to edit or draft in chat.
3. Read source code, configs, scripts, package manifests, tests, existing docs, supplied issue/PR references, and project instructions.
4. Refresh official docs for mutable external commands, APIs, products, standards, or compliance claims.
5. Choose headings that match reader workflow: purpose, prerequisites, steps, validation, troubleshooting, ownership, and references.
6. Update the canonical doc location. Remove or reconcile contradicted stale text when in scope.
7. Validate links, commands, code examples, paths, headings, markdown structure, and source consistency.
8. Confirm audience fit, no stale duplication, no secret exposure, and clear maintenance path.
9. Report changed files, evidence, validation, residual risks, and next action.

## Output Contract

Return documentation type, audience, target path, files changed or chat-only draft status, source evidence inspected, external sources checked, validation results, stale docs removed/reconciled, unverified claims, cleanup confirmation, and next exact action.

## Safety

Do not document aspirational behavior as current behavior. Do not expose secrets, tokens, customer data, private URLs with credentials, incident payloads, or regulated data.

## Failure Modes

- Commands, flags, paths, or examples are not validated when validation is available.
- Docs describe behavior not present in code or authoritative sources.
- Existing docs conflict and the correct source cannot be discovered.
- Publishing or external connector writes are requested.
- Target audience, source of truth, or output path is ambiguous.

## Source Refresh

Use local source files and existing docs as the source of truth for project behavior. Refresh current official docs for any external command, API, tool, framework, standard, or product claim that could drift.
