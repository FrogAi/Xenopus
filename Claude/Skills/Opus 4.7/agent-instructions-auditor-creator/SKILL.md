---
name: agent-instructions-auditor-creator
description: Use when creating, auditing, modifying, reconciling, migrating, or diagnosing agent instruction files such as AGENTS.md, AGENTS.override.md, CLAUDE.md, CLAUDE.local.md, .claude/rules, .cursorrules, .windsurfrules, Gemini CLI context files, or configured Codex fallback instruction files. Triggers on "AGENTS.md", "agents file", "agent instructions", "CLAUDE.md to AGENTS.md", "audit our AGENTS.md", "reconcile nested instructions", "why is Codex not following instructions", "why is Claude not following CLAUDE.md", or "make repo instructions for coding agents". Do not use for SKILL.md authoring, one-off prompts, README-only work, deterministic hook/settings enforcement, or AGENTS.md mentioned only as ordinary file data.
---

# Agent Instructions Auditor / Creator

## Mission

Create, audit, modify, reconcile, migrate, or diagnose repository instruction files for coding agents. Produce concise, source-grounded instructions that agents can actually load, understand, and follow.

Stay in the instruction-file layer. Do not execute the build, test, deploy, security, release, or migration work described by the instruction file. Route deterministic enforcement to hooks, settings, CI, scripts, policy, or connector configuration.

## Operating Rules

- Verify current runtime behavior from official or primary sources before relying on mutable claims about AGENTS.md, AGENTS.override.md, CLAUDE.md, fallback filenames, load order, context limits, imports, rules files, or supported tools.
- Inspect the real repository before creating or changing instructions. Use package manifests, scripts, CI files, formatter/linter/test config, docs, existing instruction files, and source layout as evidence.
- Separate verified runtime behavior, local repo evidence, inference, and unknowns. Do not present unsupported agent behavior as fact.
- Prefer one canonical instruction source per audience. Avoid duplicating the same rule across AGENTS.md, CLAUDE.md, rules files, README, skills, hooks, and global memory.
- Write local instruction-file changes when requested and the target path is clear. Do not create backups, symlink compatibility layers, persistent memory folders, or sidecar state unless the user explicitly requests that artifact.
- Treat instruction files as behavioral guidance, not hard enforcement. When the user needs guaranteed blocking or automation, route to settings, hooks, CI, policy, or permissions.
- Remove stale, vague, redundant, contradictory, unenforceable, or non-actionable rules instead of rewriting them more forcefully.

## Modes

- Audit: review existing instruction files and return findings without edits unless the user asks for fixes.
- Create: write a new instruction file from repo evidence and user goals.
- Diagnose: investigate why an agent did not appear to follow an instruction.
- Migrate: convert from CLAUDE.md, .cursorrules, .windsurfrules, Gemini context, README sections, or other agent instruction files to the target runtime format.
- Modify: update an existing instruction file in place.
- Reconcile: resolve conflicts across global, root, nested, override, fallback, and runtime-specific instruction files.

## Workflow

1. **Plan the work.** Use `TodoWrite` for multi-file, migration, reconciliation, diagnosis, or write tasks. Track scope, runtime-source checks, repo evidence, draft/fix, validation, and cleanup.

2. **Resolve target audience.** Identify the exact runtimes and surfaces: Codex, Claude Code, Claude Desktop, Cursor, GitHub Copilot coding agent, Gemini CLI, Aider, Amp, Devin, Windsurf, or another named tool. If a runtime is named, verify its current instruction-file support from official or primary sources before relying on it.

3. **Resolve target paths.** Determine whether the target is global, project root, nested directory, local/private, managed policy, or runtime-specific. Stop if the path, repository, audience, or write mode is ambiguous enough to affect loaded behavior.

4. **Inventory instruction surfaces.** Find relevant files and config:
   - `AGENTS.md`
   - `AGENTS.override.md`
   - `CLAUDE.md`
   - `CLAUDE.local.md`
   - `.claude/rules/*.md`
   - `.codex/config.toml` instruction discovery fields
   - configured fallback instruction filenames
   - legacy agent files such as `.cursorrules`, `.windsurfrules`, `.aider.conf.yml`, `.gemini/settings.json`, or tool-specific context files
   - README sections or docs that duplicate agent-only rules

5. **Verify load behavior.** For each target runtime, verify or mark unknown:
   - discovery path and precedence
   - nested-file behavior
   - override-file behavior
   - fallback filename behavior
   - import behavior
   - maximum loaded size or truncation behavior
   - whether instructions are loaded at startup, on demand, or by explicit config
   - whether the file is guidance only or enforced by the client

6. **Inspect repo evidence.** Read the smallest sufficient set of source files and config to ground instructions:
   - build, test, lint, format, typecheck, package-manager, and dev-server commands
   - CI workflows and release scripts
   - formatter, linter, type, test, and framework config
   - module boundaries, generated-code locations, migrations, schemas, security-sensitive paths, and deployment config
   - current README or contributor docs when they are the source of truth

7. **Classify every proposed rule.** Keep a rule only when it passes all checks:
   - It names a concrete trigger and action.
   - It changes behavior in a realistic future agent task.
   - It is not already enforced by tooling, CI, settings, hooks, or the target runtime's default behavior.
   - It does not duplicate a broader instruction unless it narrows scope.
   - It has local evidence or a user-attested reason.
   - It can be validated or diagnosed later.

8. **Audit quality.** Flag and fix:
   - vague quality slogans
   - prestige language with no observable behavior
   - stale commands, paths, models, tools, or package managers
   - contradictory rules across files
   - rules that fight current code style or CI
   - excessive global rules that belong in nested files
   - nested rules hidden by override/fallback/load-order behavior
   - huge files likely to reduce adherence or exceed runtime limits
   - instructions that ask the agent to violate user prompts, leak secrets, bypass safety, or perform unapproved side effects

9. **Diagnose non-adherence.** When the user asks why instructions were not followed, test competing hypotheses before deciding:
   - file was not loaded
   - wrong working directory or home directory
   - fallback filename not configured
   - nested or override behavior differed by runtime
   - instruction was truncated
   - instruction conflicted with another rule
   - user prompt overrode the file
   - rule was vague, unactionable, or contradicted tooling
   - the agent lacked tool permission or environment access
   - the claimed runtime does not support that instruction surface

10. **Draft or patch.** Create instructions that are compact, concrete, and executor-ready:
    - project overview only when it changes navigation
    - exact setup commands with working directory and prerequisites
    - exact test/lint/typecheck/build commands and when to run each
    - code style rules tied to existing config or source evidence
    - generated-file and migration rules
    - security, data, and secret-handling rules with clear side-effect gates
    - PR, commit, and review expectations when relevant
    - runtime-specific sections only when the target runtime actually reads them

11. **Handle Claude and Codex differences.** Use current docs rather than memory. As a current baseline to verify at invocation:
    - Codex uses AGENTS.md and supports its own discovery/config behavior.
    - Claude Code reads CLAUDE.md by default; AGENTS.md requires a CLAUDE.md import or another supported loading path.
    - CLAUDE.md and AGENTS.md are context, not deterministic enforcement.
    Route to settings, hooks, permissions, or CI when the user needs guaranteed enforcement.

12. **Validate.** Use the strongest available checks:
    - reread written files
    - verify paths and imports resolve
    - count loaded instruction size when the runtime has a size limit
    - simulate runtime discovery order from the launch directory
    - compare nested rules against parent rules
    - run markdown/frontmatter/link checks when project tooling exists
    - run a safe runtime smoke command only when it will not mutate state or leak secrets

13. **Audit before delivery.** Confirm:
    - every retained rule has a trigger, action, evidence, and owner
    - no rule duplicates global instructions, skills, settings, hooks, or CI without adding scope
    - runtime-specific claims were source-checked or marked unknown
    - write targets match actual load paths
    - contradictions and stale rules were removed or named
    - no secrets or private tokens were printed
    - no temporary artifacts remain

14. **Deliver.** Report mode, target runtimes, paths inspected or changed, source checks, evidence, findings or edits, validation, unresolved unknowns, cleanup, and the next owner for deterministic enforcement or runtime setup.

## Stop Conditions

Stop and ask or report a blocker when any condition applies:

- A claimed runtime's instruction-file support cannot be verified from official or primary sources and the claim affects the result.
- A migration would require preserving stale or contradictory rules without a user decision.
- A write would replace unrelated human documentation or collide with an existing non-instruction file.
- Target runtime, target path, launch directory, audience, or write mode is materially ambiguous.
- The requested behavior belongs in settings, hooks, CI, policy, permissions, or code instead of an instruction file.
- The user asks for an instruction file that overrides explicit user prompts, guarantees compliance, exfiltrates secrets, hides dangerous behavior, or bypasses required approvals.

## Severity Rubric

- Critical: instruction file not loaded, wrong target file, secret leakage, dangerous side-effect rule, user-prompt override claim, or live enforcement falsely represented as guidance.
- High: major load-order conflict, truncation risk, broad contradiction, stale command used by many tasks, runtime-specific rule placed where the runtime will not read it, or compliance/security rule with no enforceable control.
- Medium: redundant or vague rule, stale path, missing validation command, nested-scope mismatch, duplicated README content, or unclear owner.
- Low: wording cleanup, ordering, headings, comments, or minor maintainability issue.

## Output Contract

Every completed response includes:

- Mode and target runtime audience.
- Instruction files and config inspected.
- Current official or primary sources checked for mutable runtime behavior.
- Findings or files changed.
- Rule-level evidence, severity, recommendation, and validation.
- Runtime load-order and size/truncation assessment when relevant.
- Commands/tools run and results.
- Unknowns and unsupported runtime claims.
- Deterministic enforcement items that belong outside instruction files.
- Cleanup confirmation.

For edits, list changed paths and validation commands. For audits, include exact replacement text for important findings when useful.

## Examples

### Create root AGENTS.md

Create a root AGENTS.md for Codex. Verify Codex's current discovery behavior, inspect package scripts and CI, write only commands and rules supported by repo evidence, reread the file, simulate launch from the repo root, and report the loaded-path expectation.

### Claude Code plus Codex migration

Migrate a repo from CLAUDE.md-only to shared instructions. Verify current Claude Code memory/import behavior and current Codex AGENTS.md behavior, move shared repo rules into AGENTS.md, keep Claude-specific rules in CLAUDE.md after an import, validate both paths, and report remaining runtime-specific differences.

### Diagnose ignored nested rule

Investigate why a nested instruction was ignored. Simulate runtime discovery from the user's launch directory, check override and fallback behavior, measure loaded size, compare conflicting parent rules, inspect the actual prompt scenario, and return the most likely cause with evidence.

### Refuse false enforcement

User asks for AGENTS.md to prevent agents from ever running destructive commands. Explain that instruction files guide behavior but do not enforce policy, then route to permissions, hooks, CI, or sandbox configuration for deterministic blocking.
