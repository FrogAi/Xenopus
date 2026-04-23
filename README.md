# Xenopus

Xenopus, just like the lab frog of the same name, is my experimental Claude + Codex workflow library for high-rigor engineering work. It collects the instructions, specialist agents, reusable skills, and portable config examples behind a deliberately heavyweight engineering posture: maximum quality and performance, with no concern for speed, latency, token cost, or compute cost.

This library is for teams and individuals who want principal-level, FAANG-scale review pressure in their local assistant workflows. It is slightly opinionated: inspect real sources, prefer native Claude/Codex surfaces, validate hard, and keep only durable workflow artifacts that earn their maintenance cost.

## At a Glance

| Surface | Claude target: `Opus 4.7` | Codex target: `GPT 5.5` |
| --- | ---: | ---: |
| Canonical workflows | 75 | 75 |
| Custom agents | 33 | 33 |
| Skills | 46 | 46 |

## Repository Layout

```text
LICENSE
README.md
Claude/
  Instructions/
    Opus 4.7/
      maximum-quality.md
      settings.example.json
  Agents/
    Opus 4.7/
      <agent>.md
  Skills/
    Opus 4.7/
      <skill>/
        SKILL.md
Codex/
  Instructions/
    GPT 5.5/
      AGENTS.md
      config.example.toml
      rules/
        default.rules
  Agents/
    GPT 5.5/
      <agent>.toml
  Skills/
    GPT 5.5/
      <skill>/
        SKILL.md
        agents/
          openai.yaml
```

## How the Pieces Fit

Agents define delegated specialist roles. They are narrow, bounded lanes for implementation, review, research, and validation work where isolated context improves quality.

Config examples show the portable setup shape. They are intentionally examples, not drop-in credentials or machine-specific state. Review paths, permissions, plugins, MCP servers, connector settings, and environment variables before adapting them.

Instructions define the default behavior for a runtime. `maximum-quality.md` is the Claude output style for this stack, and `AGENTS.md` is the Codex-native instruction surface.

Skills define reusable workflows. They are loaded when a task needs a repeatable method, a domain-specific checklist, or a durable routing contract.

## Workflow Philosophy

- Durable artifacts only when earned: persist workflow machinery when it solves a recurring, material gap better than a prompt, a one-off plan, or ordinary tool use.
- High-autonomy: do the work directly inside the authorized local scope instead of handing execution back to the user.
- Live-doc aware: refresh mutable vendor, API, model, security, legal, and operational claims from primary sources when correctness depends on them.
- Native surfaces first: use Claude and Codex instructions, agents, skills, rules, and config before inventing wrapper machinery.
- Source-grounded: inspect the actual files, configs, APIs, logs, docs, and runtime behavior before asserting conclusions.
- Validation-heavy: parse, test, lint, build, run browser checks, scan, or otherwise verify before claiming completion.

## Workflow Catalog

- Accessibility Reviewer
- Agent Instructions Auditor Creator
- AI Text Pattern Flagger
- API Contract Designer
- Architecture Reviewer
- Artifact Privacy Auditor
- AWS Expert
- Backend Implementer
- Backend Worker
- Bugfix Worker
- CI/CD Pipeline Auditor Creator
- CI CD Reviewer
- CI CD Worker
- Cleanup Drift Reviewer
- Cloud Platform Advisor
- Code Optimizer
- Code Reviewer
- Codebase Explorer
- Confluence Documentation Researcher
- Custom Agent Builder
- Data Contract Reviewer
- Database Auditor Optimizer
- Database Migration Reviewer
- Database Worker
- Dependency Auditor
- Dependency Supply Chain Reviewer
- Dependency Worker
- Documentation Knowledge Reviewer
- Documentation Worker
- Documentation Writer
- Downstream Impact Tracer
- Dynatrace Expert
- External Side Effect Reviewer
- Frontend Implementer
- Frontend Mock Creator
- Frontend QA Tester
- Frontend Quality Reviewer
- Frontend Worker
- Gmail Email Assistant
- Incident Responder
- Infrastructure Cloud Reviewer
- Infrastructure Worker
- Integration Worker
- Jira Ticket Manager
- Legal Reviewer
- Maintenance Worker
- Migration Writer
- Observability Incident Reviewer
- Observability Investigator
- openpilot Route Debugger
- Pentester
- Performance Benchmarker
- Performance Reliability Reviewer
- Plan Creator
- Plan Scope Reviewer
- PR Creator
- Product Impact Reviewer
- Prompt Builder
- Release Notes Creator
- Release Readiness Reviewer
- Root Cause Bug Finder
- Security Privacy Reviewer
- SEO Optimizer
- Server Optimizer
- Skill Builder
- Slack Thread Reader
- Source Evidence Reviewer
- Subagent Spawner
- Surgical Change Finder
- Test Creator
- Test Quality Reviewer
- Test Worker
- Topic Researcher
- Workflow Artifact Reviewer
- Workflow Artifact Worker

## Install and Adapt

For Claude, copy the instruction output style into your Claude output styles directory, copy agents into your Claude agents directory, copy skills into your Claude skills directory, and adapt `Claude/Instructions/Opus 4.7/settings.example.json` into your local settings after review.

For Codex, adapt `Codex/Instructions/GPT 5.5/AGENTS.md` as your global or repository instruction file, copy agents into your Codex agents directory, copy skills into your Codex skills directory, copy rules as needed, and adapt `Codex/Instructions/GPT 5.5/config.example.toml` into your local config after review.

You need your own connector, MCP, auth, and environment setup. This repository intentionally excludes credentials, sessions, caches, app state, logs, databases, plugin caches, OAuth material, and machine-private paths.

## License

Xenopus is released under the [Unlicense](LICENSE).
