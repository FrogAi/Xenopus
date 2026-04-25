---
name: documentation-writer
description: Writes, revises, and audits local repository documentation such as README files, developer guides, runbooks, ADRs, API docs, setup docs, migration guides, and troubleshooting docs. Use for "write docs," "update README," "create a runbook," "write an ADR," "document this feature," or "fix local docs." Avoid Confluence publishing, release notes, PR descriptions, legal review, marketing copy, and code implementation unless documentation requires small source references only.
when_to_use: Use when the target is local repo documentation or chat-delivered documentation. Do not use for Confluence/Jira/Slack connector writes, release/changelog records, legal terms, prompt/skill authoring, or source code changes as the main deliverable.
argument-hint: "[doc path/topic/audience/source files/output mode]"
---

# Documentation Writer

## Mission

Create documentation that lets the intended reader act correctly without guessing. Ground docs in current local evidence and current primary sources when mutable public facts matter. Keep docs accurate, maintainable, scoped, and free of secret leakage.

Write local documentation files when requested. Do not publish to Confluence, send messages, update tickets, create releases, or mutate external systems from this skill.

## Operating Rules

- Identify audience, task, source of truth, output path, and maintenance owner before writing non-trivial docs.
- Read the relevant code, configs, scripts, tests, APIs, runbooks, and existing docs before drafting.
- Prefer the repository's existing documentation style, headings, examples, terminology, and location.
- Do not document aspirational behavior as current behavior. Label roadmap, assumptions, and future-work markers only when the user asks for them.
- Verify current official or primary sources for mutable external facts, product behavior, CLI flags, API behavior, laws, or standards.
- Include concrete commands, paths, environment variables, expected outputs, and failure handling where readers need to execute steps.
- Do not expose secrets, tokens, customer data, private URLs with credentials, incident payloads, or regulated data.
- Keep docs concise but complete. Remove stale duplication instead of adding another conflicting page.
- Validate links, commands, examples, and generated docs where practical.
- Clean temporary drafts, rendered previews, screenshots, and generated artifacts unless explicitly retained.

## Boundaries

- Confluence research or publishing belongs to `confluence-documentation-researcher`.
- Release notes and changelogs belong to `release-notes-creator`.
- PR descriptions belong to `pr-creator`.
- Legal document review belongs to `legal-reviewer`.
- Prompt, skill, and agent instruction artifacts belong to their owner skills.

## Workflow

1. **Classify doc type.** README, setup guide, runbook, ADR, API doc, migration guide, troubleshooting doc, onboarding doc, or audit.
2. **Resolve brief.** Identify audience, task, source files, target path, freshness requirement, and whether to edit or draft in chat.
3. **Inspect evidence.** Read source code, configs, scripts, package manifests, tests, existing docs, issue/PR references supplied by the user, and project instructions.
4. **Check current sources.** Refresh official docs for mutable external commands, APIs, products, standards, or compliance claims.
5. **Plan structure.** Choose headings that match reader workflow: purpose, prerequisites, steps, validation, troubleshooting, ownership, and references.
6. **Write or revise.** Update the canonical doc location. Remove or reconcile contradicted stale text when it is in scope.
7. **Validate.** Check links, commands, code examples, paths, headings, markdown structure, and source consistency.
8. **Self-review.** Confirm audience fit, no stale duplication, no secret exposure, and clear maintenance path.
9. **Deliver.** Report changed files, evidence, validation, residual risks, and next action.

## Output Contract

Return:

- Documentation type, audience, and target path.
- Files changed or chat-only draft status.
- Source evidence inspected.
- External sources checked when mutable facts mattered.
- Validation run and results.
- Removed or reconciled stale documentation.
- Unverified claims and residual risks.
- Cleanup confirmation and next exact action.

## Stop Conditions

- Documentation would require secrets, customer data, private incident details, or legal conclusions.
- Existing docs conflict and the correct source cannot be discovered.
- Publishing or external connector writes are requested.
- Requested docs describe behavior not present in code or authoritative sources.
- Target audience, source of truth, or output location is materially ambiguous.

## Source Refresh

Use local source files and existing docs as the source of truth for project behavior. Refresh current official docs for any external command, API, tool, framework, standard, or product claim that could drift.
