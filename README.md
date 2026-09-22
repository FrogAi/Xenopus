# Xenopus

Xenopus, like the lab frog it's named after, is where I experiment with how I work with AI coding agents. It's my personal setup for Claude Code and Codex, with the agents, global instructions and skills I use every day. Everything here is something I actually use, tested and revised as I go.

## Why it might be useful to you

Out of the box, coding agents tend to do too much and claim too much. They add safeguards, options and abstractions nobody asked for, report work as tested when it wasn't, and drift from what you asked toward what they think you might want. Most of this setup exists to push back on that.

- **Ask when it matters, decide when it doesn't.** Real tradeoffs and hard-to-undo steps go to you as a question; small choices get made and stated.
- **Claude and Codex stay in step.** Every skill and agent exists for both, so you get the same behavior whichever one you use.
- **Do exactly what was asked, fully.** The smallest change that completely does the job, reusing what's already there, with nothing extra.
- **Evidence over confidence.** Check facts that can change (versions, docs, your own code) instead of answering from memory, say where a claim came from, and say plainly what wasn't verified.
- **Fix causes, not symptoms.** Understand a system before changing it, fix the problem where it starts, and prove the fix on the real path, not just in a unit test.
- **Get better as you work.** When you correct the agent or state a preference, it updates the responsible instruction or skill (with a backup), so the same correction isn't needed twice.

## Cost and speed

This setup puts quality first. When quality pulls against speed or token cost, it picks quality. It checks facts instead of answering from memory, proves changes on the real path, gets an independent review before finishing work where a mistake would be costly, and runs most specialist agents on the strongest models at high effort. Expect more tokens and longer turns than a stock setup, especially on larger or riskier tasks.

It doesn't spend for nothing, though. Simple tasks are done directly, and checks that can't change the result are skipped. If you'd rather trade some quality for speed or cost, lower the agents' models and effort levels (see [Make it yours](#make-it-yours)) or relax the review rule under "Subagent delegation" in the global instructions.

## How it fits together

- **Agents** are specialists the main session hands bounded jobs to, such as tracing a bug or reviewing a change, each with its own fresh context. `coordinate-specialists` decides when delegating is worth it, which is less often than you'd think, since simple work is done directly.
- **Global instructions** (`CLAUDE.md`, `AGENTS.md`) load into every session. They set the working rules above and point to the skills that own each kind of work.
- **Hook and mods** change how Claude Code itself behaves, such as queueing the messages you send while it's working.
- **Skills** load only when a task matches their description, so they cost nothing until needed. Each one is a method for one kind of work, such as engineering, prompt writing or translation.

Pieces refer to each other by name. Several agents work by the engineering skill, and some load a skill directly (`device-runner` loads the device skill, `prompt-evaluator` the prompt skill). Install the whole set rather than picking pieces out.

## It improves itself

The setup keeps itself current as you use it, through `improve-personal-customizations`.

- **Both runtimes stay in step.** A change made in Claude gets the same change in its Codex copy, and the other way round.
- **Changes are safe to make.** Every change is backed up first and tested in proportion to its risk. A narrow rule gets a quick check in a fresh session, and broader changes, such as to the global instructions, this skill itself, or a new agent or hook, get a before-and-after comparison on both Claude and Codex plus an independent review. Permissions, credentials and anything that costs money stay with you.
- **It fixes what goes wrong.** When it notices a skill or agent is wrong or out of date, or you correct something a rule already covered, it repairs the rule itself, rewriting it when the wording caused the miss rather than piling on another rule.
- **It learns your preferences, not your tasks.** When you state how you want something done or correct the agent in a way that applies beyond the task at hand, it writes that preference into the instruction, skill or agent responsible for it. It doesn't save task notes, one-off requests or things it could find in the code, so your instructions don't fill up with clutter.
- **New models get an audit.** When you move to a new Claude model, it starts from Claude Code's prompt audit to find instructions written for older models, stale paths and contradictions.

Every change is logged in `~/.agents/CUSTOMIZATIONS.md`, along with checks that are still pending and ideas that were tried and rejected, so you can see what changed and why.

## Requirements

- Claude Code 2.1.287 or later, for the mods.
- Claude Code, Codex CLI, or both. Tested with Claude Code 2.1.283 to 2.1.288 on Claude Opus 5.5, and Codex CLI 0.160 on GPT-6 Astra.
- Codex CLI signed in with a ChatGPT plan, or an OpenAI API key, for `create-images` to generate images.
- Codex CLI, signed in, for the `codex-reviewer` agent.
- Python 3 with Pillow, NumPy, OpenCV and requests, for the `create-images` scripts.
- Python 3, for the hook.

## Layout

The two folders mirror where each runtime looks for its files.

```text
claude/          copy into ~/.claude
  agents/        specialist subagents
  CLAUDE.md      global instructions
  hooks/         queue-until-done.py
  mods/          Claude Code mods: collapse-work, queue
  skills/        skills
codex/           copy into ~/.codex, except skills/
  AGENTS.md      global instructions
  agents/        specialist subagents (.toml)
  skills/        copy into ~/.agents/skills
```

The Claude and Codex copies of each skill and agent say the same thing and differ only in how each runtime names things (for example `the coordinate-specialists skill` in Claude and `$coordinate-specialists` in Codex). Two pieces exist for one runtime only, the `codex-reviewer` agent (Claude) and the `handoff-task` skill (Codex).

## Install

Each block backs up the files it's about to replace into a dated folder in your home directory, then copies the setup in. Your own skills and agents with other names are left alone. You can install the Claude or Codex half on its own. Start a new session afterwards, since instructions and skills load when a session starts.

### Windows (PowerShell)

#### Claude Code

```powershell
if (Test-Path "$env:TEMP\Xenopus") {
  Remove-Item "$env:TEMP\Xenopus" -Recurse -Force
}
git clone https://github.com/FrogAi/Xenopus.git "$env:TEMP\Xenopus"
$backup = "$HOME\xenopus-backup-claude-$(Get-Date -Format yyyyMMdd-HHmmss)"
New-Item -ItemType Directory $backup | Out-Null
foreach ($item in "agents", "CLAUDE.md", "hooks", "mods", "skills") {
  if (Test-Path "$HOME\.claude\$item") {
    Copy-Item "$HOME\.claude\$item" $backup -Recurse
  }
}
New-Item -ItemType Directory "$HOME\.claude" -Force | Out-Null
Copy-Item "$env:TEMP\Xenopus\claude\*" "$HOME\.claude" -Recurse -Force
```

#### Codex

```powershell
if (Test-Path "$env:TEMP\Xenopus") {
  Remove-Item "$env:TEMP\Xenopus" -Recurse -Force
}
git clone https://github.com/FrogAi/Xenopus.git "$env:TEMP\Xenopus"
$backup = "$HOME\xenopus-backup-codex-$(Get-Date -Format yyyyMMdd-HHmmss)"
New-Item -ItemType Directory $backup | Out-Null
foreach ($item in ".agents\skills", ".codex\agents", ".codex\AGENTS.md") {
  if (Test-Path "$HOME\$item") {
    Copy-Item "$HOME\$item" (Join-Path $backup ($item -replace "\\", "-")) -Recurse
  }
}
New-Item -ItemType Directory "$HOME\.agents\skills", "$HOME\.codex" -Force | Out-Null
Copy-Item "$env:TEMP\Xenopus\codex\agents", "$env:TEMP\Xenopus\codex\AGENTS.md" "$HOME\.codex" -Recurse -Force
Copy-Item "$env:TEMP\Xenopus\codex\skills\*" "$HOME\.agents\skills" -Recurse -Force
```

### macOS and Linux

#### Claude Code

```bash
rm -rf /tmp/Xenopus
git clone https://github.com/FrogAi/Xenopus.git /tmp/Xenopus
backup=~/xenopus-backup-claude-$(date +%Y%m%d-%H%M%S)
mkdir -p "$backup"
for item in agents CLAUDE.md hooks mods skills; do
  if [ -e ~/.claude/$item ]; then
    cp -R ~/.claude/$item "$backup"/
  fi
done
mkdir -p ~/.claude
cp -R /tmp/Xenopus/claude/. ~/.claude/
```

#### Codex

```bash
rm -rf /tmp/Xenopus
git clone https://github.com/FrogAi/Xenopus.git /tmp/Xenopus
backup=~/xenopus-backup-codex-$(date +%Y%m%d-%H%M%S)
mkdir -p "$backup"
for item in .agents/skills .codex/agents .codex/AGENTS.md; do
  if [ -e ~/$item ]; then
    cp -R ~/$item "$backup"/$(echo $item | tr / -)
  fi
done
mkdir -p ~/.agents/skills ~/.codex
cp -R /tmp/Xenopus/codex/agents /tmp/Xenopus/codex/AGENTS.md ~/.codex/
cp -R /tmp/Xenopus/codex/skills/. ~/.agents/skills/
```

The hook and mods need one more step each, covered in [Hook and mods](#hook-and-mods-claude-code).

## Make it yours

- **Create the customizations record** if you use `improve-personal-customizations`. It's an empty `~/.agents/CUSTOMIZATIONS.md` with four headings, `Decided against or reverted`, `Pending`, `Recent changes` and `Twins and intentional differences`.
- **Fill in your voice.** `write-in-my-voice/references/voice-profile.md` ships as a blank template with prompts to replace.
- **Name your comma devices** if you use `develop-on-comma-device`. Say in your global instructions which SSH alias is your development device and which is your driving device.
- **Read the global instructions and edit them.** They're written in the first person, as my preferences. Change anything that isn't how you want to work.
- **Remove what you don't need.** A skill you never use costs only its one-line description per session, but an unused agent or skill is still something to keep current.
- **Set the agents' models.** Each agent names a model and effort level in its frontmatter (Claude) or `.toml` (Codex). Change them to models you have access to.

## Skills

| Skill | What it's for |
| --- | --- |
| `coordinate-specialists` | When to delegate to subagents and when not to, how to brief them, and how to maintain the agent library. |
| `create-images` | Making, editing and repairing AI-generated images, from composing several real subjects into one scene to removing artifacts and seams. |
| `develop-on-comma-device` | openpilot development on a comma three or 3X, covering device roles, safe bench testing, measurements and crash investigation. |
| `engineer-production-changes` | The engineering method for all software work. Understand the system first, fix causes where they start, build the smallest complete design, prove it on the real path and report honestly. |
| `engineer-prompts` | Writing, revising and evaluating prompts, skills, agent definitions and instruction files. |
| `explore-frontend-designs` | Exploring and comparing UI design directions before one is chosen. |
| `handoff-task` (Codex) | Handing a task to a fresh conversation, or recovering context from an earlier one. |
| `implement-frontend-designs` | Building an approved design in a real project with exact visual and interaction fidelity. |
| `improve-personal-customizations` | Keeps your agents, instructions and skills improving as you work. It saves your stated preferences (not task notes), fixes customizations that prove wrong, keeps the Claude and Codex copies in step, and tests changes in proportion to their risk. Keeps a record at `~/.agents/CUSTOMIZATIONS.md` (see [Make it yours](#make-it-yours)). |
| `translate-content` | Translation and localization, from prose to UI string catalogs. |
| `write-in-my-voice` | Drafting messages that sound like you. Ships with a blank voice profile to fill in. |
| `write-release-notes` | Public release notes and update posts that are accurate and fun to read. |

## Agents

Specialists that the main session delegates to through `coordinate-specialists`. Each has one bounded job and reports back; none decides what to ship.

| Agent | What it does |
| --- | --- |
| `audience-reviewer` | Reviews prose and visuals for what the intended reader would actually understand. |
| `behavior-tracer` | Traces an execution or data path through code and configuration. |
| `check-runner` | Runs assigned existing checks and reports what actually happened. |
| `cloud-auditor` | Read-only audit of cloud provider state, usage and cost. |
| `codex-reviewer` | Claude only. Gets a second opinion from Codex through its CLI. It sends your material to OpenAI, so it runs only when you ask for it. |
| `design-exploration-reviewer` | Reviews frontend design alternatives for fit, quality and fair comparison. |
| `device-runner` | Runs checks or retrieves logs on a comma device over SSH, with `develop-on-comma-device`. |
| `engineering-reviewer` | Reviews a design or implementation for correctness, regressions and unnecessary complexity. |
| `evidence-auditor` | Checks whether the evidence actually supports a claim of correctness, testing or completion. |
| `frontend-reviewer` | Reviews an implemented interface against its accepted design and user flows. |
| `image-artifact-reviewer` | Inspects a generated or edited image at full zoom for AI artifacts, wrong details and compositing seams, and reports them without editing the image. |
| `log-triager` | Organizes logs or telemetry into event groups, counts and a timeline. |
| `performance-investigator` | Measures latency, throughput and resource use with controlled comparisons. |
| `privacy-reviewer` | Reviews data that leaves a device or system for personal information. |
| `prompt-evaluator` | Assesses a prompt, skill or agent definition against its task and target model. |
| `reliability-reviewer` | Reviews rollouts, recovery and operational behavior across versions and dependencies. |
| `repository-locator` | Finds files, symbols, references and configuration in a repository. |
| `root-cause-investigator` | Establishes a defect's trigger, mechanism and responsible boundary. |
| `security-reviewer` | Reviews a design or change for reachable security weaknesses. |
| `source-extractor` | Extracts specified facts or passages from files and web sources, with provenance. |
| `targeted-implementer` | Implements one small, understood change and verifies it. |
| `translation-reviewer` | Reviews translations for natural language, fidelity and complete coverage. |
| `verification-designer` | Designs the checks that would actually prove a change works. |

## Hook and mods (Claude Code)

These rely on Claude Code internals that can change between releases, so check them after updating.

- **`hooks/queue-until-done.py`.** In the desktop app, it holds a message you send while Claude is working and delivers it when the current task ends. It depends on undocumented behavior of `"continue": false`; last confirmed on 2.1.284. Register it for both `UserPromptSubmit` and `SessionEnd` in `~/.claude/settings.json`, using the script's full path.

  ```json
  "hooks": {
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "python /path/to/.claude/hooks/queue-until-done.py" }] }],
    "SessionEnd": [{ "hooks": [{ "type": "command", "command": "python /path/to/.claude/hooks/queue-until-done.py" }] }]
  }
  ```

  Use `python3` instead of `python` where that's your interpreter's name (macOS and most Linux).

- **`mods/collapse-work`.** Folds a finished turn's work under a "Worked for" line.
- **`mods/queue`.** A Codex-style queue for messages sent while Claude works, sent one per turn.

The mods need Claude Code 2.1.287 or later and were tested in the terminal on 2.1.288. Load one with `claude --plugin-dir ~/.claude/mods/queue`. Use either the hook or `mods/queue`, not both, since they act on the same message. Each mod has tests in its `tests` folder, which you can run from the mod's folder with `claude plugin test .`.

## License

Public domain ([Unlicense](LICENSE)).
