---
name: custom-agent-builder
description: Create, audit, modify, convert, or retire persistent Claude Code or Codex custom agent definitions. Use when the user asks for a reusable custom agent, subagent definition, agent portfolio, persistent reviewer/researcher/worker agent, or an audit of existing agent files. Do not use for one-off transient delegation, ordinary skill authoring, AGENTS.md work, connector setup, hooks, or prompts that do not need a durable agent file.
when_to_use: Use when persistent custom-agent files under .claude/agents, .codex/agents, or project agent directories are the target. Do not use for spawning temporary subagents; route that to subagent-spawner.
argument-hint: "[create|audit|modify|convert|retire] [runtime] [agent name or path]"
---

# Custom Agent Builder

## Mission

Create, audit, modify, convert, or retire persistent custom agent definitions only when a durable agent is the correct native surface. Keep ordinary one-off work on transient subagents and keep task workflows in skills unless an agent's separate context, tool scope, model policy, or recurring role materially improves quality.

## Operating Rules

- Verify current Claude Code and Codex custom-agent documentation before relying on file locations, frontmatter/TOML fields, tool scoping, model inheritance, invocation behavior, priority, or project-vs-user precedence.
- Treat persistent agent files as high-blast workflow surfaces. Do not create or modify them during unrelated work just because a one-off delegation lane was useful.
- Use the narrowest durable surface. Prefer an existing skill, clearer prompt, transient subagent brief, validation step, or existing agent when it provides equal quality with lower maintenance.
- For ordinary tasks, require explicit user approval before writing, overwriting, deleting, or retiring a persistent agent file. During an active setup or audit plan, use the plan's recorded authority only when it names the exact agent path, write action, scope, validation method, and stop conditions.
- Do not create backup copies, hidden scratch directories, compatibility symlinks, wrapper launchers, scheduled repair tasks, prompt appenders, or memory sidecars.
- Do not put secrets, private URLs, OAuth material, API keys, credential paths that reveal values, or tenant-sensitive data inside agent definitions. Report credential-like findings by path, pattern class, risk, and required action only.
- Default persistent agents to read-only analysis unless the mission proves write capability is necessary. Connector writes, live infrastructure actions, credential actions, destructive cleanup, and production changes require explicit gates inside the agent definition and at invocation time.
- Do not let a persistent agent spawn other agents by default. Nested delegation requires separate evidence, explicit user approval, and a validation plan.

## Modes

- Audit: review existing agent files and return findings without edits unless the user asks for fixes.
- Candidate triage: decide whether a repeated gap deserves a persistent agent candidate.
- Convert: convert a Claude agent to Codex, a Codex agent to Claude, or a prose role description to one or both native formats.
- Create: write a new custom agent definition after admission gates pass.
- Modify: update an existing agent definition in place.
- Retire: remove or disable an agent only after exact-path approval and source-of-truth checks.

## Workflow

1. **Classify the request.** Identify mode, target runtime, target path, write intent, side effects, and whether the request is for a persistent agent or transient delegation. Route transient work to `subagent-spawner`.

2. **Refresh sources.** Verify current official docs for the target runtime. If source access is unavailable and file-format behavior materially affects file validity, discovery, permissions, tools, memory, model policy, or write behavior, stop before drafting. Label the limitation only for non-material background claims that do not affect the agent definition's correctness or safety.

3. **Inventory overlap.** Inspect existing user and project agents, relevant skills, global instructions, hooks, commands, MCP/apps/connectors, and recent task evidence. Do not create a duplicate role with a different name.

4. **Run the admission gate.** A persistent agent is eligible only when all evidence is recorded:
   - Candidate name and human-readable display purpose.
   - Mission, non-goals, and exact trigger phrases.
   - Three realistic task examples where a durable agent improves quality.
   - Why existing skills, transient subagents, prompts, hooks, or validators are insufficient.
   - Required context isolation, tool scope, model/reasoning policy, memory policy, and write boundaries.
   - Maintenance cost, owner, review cadence, and removal condition.
   - Validation prompts covering positive, negative, and borderline routing.

5. **Design the native artifact.** Use the runtime's native file format and directory. Keep instructions short, explicit, and role-specific. State evidence requirements, allowed and prohibited actions, output schema, halt conditions, validation expectations, and escalation path.

6. **Apply safety gates.** Before any write-capable or external-capable agent, record exact permitted writes, prohibited paths, connector-write gates, live-infrastructure gates, credential handling, and cleanup rules. Reject broad "can do anything" agents.

7. **Write or report.** In Create, Modify, Convert, or Retire mode, write only after target path and write authority are explicit. In Audit or Candidate triage mode, report findings and do not mutate files.

8. **Validate.** Re-read written files, parse frontmatter or TOML, verify names and paths, scan for stale source URLs and secret patterns, and run safe runtime list/smoke commands when available. Validate routing with positive, negative, and borderline prompts.

9. **Deliver.** Report changed paths, source checks, admission evidence, validation results, residual risks, and any deferred candidates. Do not paste full agent files unless the user asks.

## Stop Conditions

Stop and ask when the target runtime or path is ambiguous, source docs cannot verify a material format claim, an existing skill or transient subagent is the better surface, the requested agent would hide side effects, the write would overwrite unrelated content, the agent needs credentials or live infrastructure authority, or deletion/retirement lacks exact-path approval.

## Output Contract

- For Create, Modify, Convert, or Retire: report changed paths, runtime, authority used, source checks, validation results, and residual risks.
- For Audit or Candidate triage: report verdict, material findings with file/line evidence, admission-gate result, recommended disposition, validation gaps, and next concrete action.
- Never paste full agent files, secret values, or large raw diffs unless the user explicitly asks.

## Source Refresh

- Claude Code subagents documentation, `https://code.claude.com/docs/en/sub-agents`. Used for Claude custom subagent locations, frontmatter behavior, tool scoping, and management workflow.
- OpenAI Codex subagents documentation, `https://developers.openai.com/codex/subagents`. Used for Codex built-in/custom agents, user/project agent paths, TOML fields, inheritance, and explicit spawning behavior.
- Claude Code skills documentation, `https://code.claude.com/docs/en/skills`. Used for this skill's frontmatter and routing behavior.
