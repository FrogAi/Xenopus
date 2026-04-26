---
name: skill-builder
description: Builds, audits, modifies, converts, and hardens Claude Code SKILL.md files with current-source validation, routing tests, side-effect gates, sidecar checks, and on-disk verification.
when_to_use: Use when creating or reviewing SKILL.md files under ~/.claude/skills, .claude/skills, or plugin skills; tightening skill descriptions, frontmatter, sidecars, scripts, or validation; converting a repeatable prompt, checklist, playbook, or procedure into a Claude Code skill; or migrating another runtime's skill into a Claude Code skill. Do not use for executing a skill, creating one-off prompts, authoring AGENTS.md, building Codex-target skills, or changing hooks/settings unless the requested deliverable is a Claude Code skill.
argument-hint: "[skill path, skill name, or skill brief]"
---

# Skill Builder

## Mission

Build, audit, modify, and convert Claude Code skills that earn their place in a high-reliability setup. Stay in the builder layer: research, inspect, design, write, validate, and report. Do not execute the skill being built.

Create, Modify, and Convert modes write the final artifact to disk after validation. Audit mode is read-only unless the user explicitly requests an output file.

Route the work to a different artifact type when the request is not a Claude Code skill. For cross-runtime skill migration, the target runtime owns the build: use this skill when the requested output is a Claude Code skill, and route Codex-target outputs to the Codex `skill-builder`. Use output styles or settings for global behavior, hooks for deterministic lifecycle enforcement, commands for one-off stored prompts, AGENTS.md for Codex project guidance, and Codex skills for Codex runtime behavior.

## Non-Negotiables

- Verify current official Anthropic or Claude Code documentation before relying on skill format, frontmatter fields, discovery behavior, invocation controls, allowed tools, subagent behavior, hooks, shell execution, or lifecycle behavior.
- Use primary domain sources for mutable domain claims, including security, legal, financial, medical, infrastructure, package, framework, API, model, or compliance guidance.
- Inherit the active session model and effort by default. Do not set `model` or `effort` in a skill unless the user explicitly asks for that override or the skill cannot work correctly without it.
- Keep `SKILL.md` focused and under 500 lines. Move bulky references, examples, templates, or scripts to one-level sidecars that are directly linked from `SKILL.md`.
- Write descriptions in third person, front-load the key use case, include concrete trigger terms, and add anti-triggers when adjacent skills or workflows could collide.
- Default user-owned skills to model invocation so Claude can route work automatically when applicable. Use `disable-model-invocation: true` only when the user explicitly asks for manual-only invocation or the workflow cannot safely stage, validate, or gate irreversible external effects inside the skill body.
- Treat `allowed-tools` as pre-approval, not restriction. Grant only tools the skill materially needs; use settings deny rules for blocking.
- Encode current-practice lookup workflows instead of freezing today's best-practice checklist as permanent truth.
- Design every skill so the weakest practical intended executor can follow it without hidden judgment, missing research, or unspecified validation.
- Remove placeholders, unused sidecars, stale static source lists, dead examples, scratch files, duplicate rules, vague prestige language, and machinery that does not change behavior.
- Re-read every written file from disk and validate the on-disk artifact before reporting completion.
- State assumptions, source gaps, skipped checks, residual risks, and same-context self-audit limits. Do not imply certainty that was not earned.

## Modes

- **Audit:** review an existing skill and report findings without editing.
- **Convert:** turn a repeatable prompt, checklist, playbook, or procedure into a packaged Claude Code skill.
- **Create:** build a new Claude Code skill from a brief.
- **Modify:** update an existing skill at a named path.

Ask before editing only when the user's wording leaves Audit versus Modify ambiguous or the target path is unclear. Do not ask for information that can be discovered with available tools.

## Workflow

1. **Classify the mode.** Determine Create, Modify, Audit, or Convert. Identify whether the request is actually a Claude Code skill request or belongs in output style, settings, hooks, commands, AGENTS.md, Codex skills, or a one-off answer. For migration, classify by the requested output runtime rather than the source artifact.

2. **Extract the brief.** Capture purpose, target users, target runtime, trigger phrases, anti-triggers, desired invocation style, deployment path, sidecars, scripts, required tools, side effects, credential handling, safety constraints, success criteria, and risk surface.

3. **Inspect local evidence.**
   - Create: search personal, project, added-directory, and plugin skill roots for overlapping names or scopes.
   - Modify: read `SKILL.md` and every referenced sidecar before editing.
   - Audit: read `SKILL.md` and the sidecars needed to verify behavior.
   - Convert: read the source artifact in full and preserve intent, not wording.

4. **Validate the premise.** Reject or reroute skill work when the ask is a one-off answer, a single shell-command wrapper, a global preference better handled by output style/settings, a lifecycle guard better handled by hooks, a Codex-target artifact, or an unsafe workflow such as credential exfiltration. A Codex skill used as source material is allowed when the requested output is a Claude Code skill. State the corrected route.

5. **Research current sources.** Resolve current Claude skill docs and any domain sources that affect correctness. If a required source is unreachable, stop and report the source gap unless the user explicitly accepts a fallback with the limitation documented.

6. **Resolve material ambiguity.** Ask only when the missing answer changes path, scope, trigger behavior, side effects, required tools, source of truth, risk posture, or validation. Continue once the answer is discovered, verified, or explicitly accepted as an assumption.

7. **Choose structure.**
   - Default to one `SKILL.md`.
   - Add `references/` for long source hierarchies, policies, schemas, or domain references.
   - Add `examples/` when examples are useful but would distract from the main workflow.
   - Add `scripts/` when deterministic code is safer than repeatedly regenerating logic.
   - Add `assets/` only for reusable templates or media needed by the skill.
   - Do not create empty directories or placeholder files.

8. **Design frontmatter first.** Decide `name`, `description`, optional `when_to_use`, `argument-hint`, `arguments`, invocation controls, `allowed-tools`, `paths`, `context`, `agent`, `hooks`, and `shell`. Use only fields supported by current Claude Code docs and only when each field materially improves behavior.

9. **Design the body.** Use imperative, concrete instructions. Include the skill's job, workflow, source hierarchy, tool use, validation gates, output contract, failure handling, and examples. Do not add generic excellence slogans unless translated into observable checks.

10. **Future-proof mutable facts.** For each mutable fact the skill may need later, encode:
    - authority of record
    - freshness requirement
    - what to verify
    - what to do if verification fails
    - how to disclose uncertainty

11. **Optimize trigger behavior.** Build and run a description eval set before finalizing:
    - at least 15 should-trigger cases
    - at least 10 should-not-trigger cases
    - at least 5 borderline cases
    Iterate until the description and anti-triggers pass all cases. Include adjacent-skill collision cases.

12. **Patch or rebuild.** Patch only when the current skill is structurally sound and the fix is local. Rebuild when duplicated rules, stale sidecars, conflicting sections, repeated patching, broad source drift, or confusing structure would survive a patch.

13. **Run the audit loop.** Review the artifact as if it were written by someone else. Fix material findings and repeat until a full static and behavioral pass finds no new material issue, or until a blocker/residual risk is explicit.

14. **Write and validate.** For write modes, edit files directly, re-read final files from disk, parse frontmatter, verify sidecar links, verify referenced scripts/assets exist, run available validators or substitute documented manual checks, and remove obsolete files created or made unnecessary by the work.

15. **Report.** Return paths changed, mode, source checks, validation results, material residual risks, and the next concrete action. Do not omit material findings to be brief.

## Static Audit Checklist

- Frontmatter uses current Claude Code fields correctly.
- `name` is lowercase letters, numbers, and hyphens only, at most 64 characters, and avoids reserved words.
- `description` is non-empty, third person, front-loaded, specific, and within current limits.
- `when_to_use` is used only when it materially improves routing without bloating the skill listing.
- Invocation controls match the risk: side-effecting or timing-sensitive workflows are user-invoked only.
- `allowed-tools` grants only tools the skill materially needs.
- `model` and `effort` are omitted unless explicitly justified.
- `paths`, `context`, `agent`, `hooks`, and `shell` are used only with current-source support and a clear need.
- The skill does one job and routes adjacent work elsewhere.
- `SKILL.md` stays focused; sidecars are one level deep, directly linked, and useful.
- Every mutable fact has a refresh path and failure behavior.
- Every rule has a trigger, action, and validation or stop condition.
- No section duplicates, weakens, or contradicts another section.
- No stale references to removed files, old wrappers, legacy command paths, stale validators, or non-existent tools.
- Destructive actions, external writes, credential handling, production changes, security testing, and subagents have explicit gates.
- The output contract is complete enough for a weaker executor to produce the intended artifact.
- Examples cover normal, edge, and blocked-state behavior.
- The final artifact avoids filler, prestige language, and instructions already handled by global output style or settings.

## Behavioral Simulation

Simulate these cases before delivery:

- Happy path: user provides a clear skill brief or path.
- Missing target: user gives a vague brief without a path or name.
- Wrong layer: user asks for global behavior, a hook, a Codex skill, or a one-off prompt.
- Side-effecting skill: user asks for deployment, Slack send, credential handling, or production change behavior.
- Source drift: current Claude skill docs or domain docs changed since the skill was written.
- Weak executor: a less capable model follows the generated skill without hidden assumptions.
- Trigger collision: the skill overlaps an existing skill, command, or plugin skill.
- Compaction: only the first 5,000 tokens of the invoked skill may survive after compaction.
- User pressure: user asks to skip research, validation, or audit.
- Partial write: one file writes successfully and another fails.
- Self-target: this builder modifies itself or a sibling builder and same-context audit is the only review.

## Patch vs Rebuild

Patch when the current skill is sound and the fix is local: one stale path, one description issue, one missing validation step, one broken sidecar reference, or one small contradiction.

Rebuild when any condition holds:

- Three or more major sections need changes.
- Multiple sections restate the same rule differently.
- The current structure hides required gates.
- Sidecars contain more obsolete guidance than useful guidance.
- Old static source lists, stale dates, or dead validators dominate behavior.
- The skill fails its own stated quality gates.
- A patch would preserve confusing structure or low-value verbosity.

When rebuilding, preserve proven intent and discard prior wording. Rebuild from current sources, the user's goal, and observed failures.

## Output Contracts

For Create, Modify, and Convert, return:

- files changed with absolute paths
- mode
- source checks performed
- validation results
- residual risks
- next concrete action

For Audit, return:

- production-readiness verdict
- findings ordered by severity
- file and line references when available
- exact proposed patch or rebuild recommendation
- validation gaps
- residual risks

Do not create backups, duplicate artifacts, scratch folders, or placeholder sidecars unless the user explicitly requests that exact artifact.

## Failure Modes

- **Ambiguous write path:** ask before writing.
- **Partial write:** report exactly which files changed and which failed.
- **Self-audit limit:** disclose when the writer and auditor share context; request independent review when the skill is high-risk or foundational.
- **Source unavailable:** stop when the source affects platform behavior, safety, or correctness.
- **Target collision:** ask before overwriting an existing skill in Create mode.
- **Unsafe premise:** refuse the unsafe part and offer a safe scope.
- **Validation unavailable:** report the missing validator and substitute only low-risk manual checks.
- **Wrong target runtime:** stop and route to the correct artifact type.

## Examples

**Create:** "Build a skill that audits OAuth in Node services."

Behavior: confirm the target path and risk surface, verify current Claude skill docs and current OAuth/security sources, encode source-refresh behavior, write the skill, validate frontmatter and trigger behavior, and report residual risks.

**Audit:** "Audit ~/.claude/skills/seo-optimizer/SKILL.md."

Behavior: read the skill and sidecars, verify current Claude skill rules and current SEO source expectations if the skill embeds SEO guidance, report findings without editing.

**Convert:** "Turn this long prompt into a skill."

Behavior: determine whether the prompt represents a repeatable workflow, preserve intent, replace prompt-only wording with durable skill instructions, add sidecars only when needed, validate, and write the skill.

**Wrong layer:** "Make every Claude answer maximum quality forever."

Behavior: route to output style, settings, or global instructions. Do not inflate a domain skill with global behavior.

**Mutable guidance:** "Make this security skill follow the current authority of record forever."

Behavior: encode a source-refresh workflow. Do not hardcode today's checklist as permanent truth. Require current primary-source verification each time the skill runs and disclosure when refresh fails.
