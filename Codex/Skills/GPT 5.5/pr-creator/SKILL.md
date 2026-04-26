---
name: pr-creator
description: "Use for PR/MR titles, bodies, risk, tests, rollback, screenshots, reviewers, labels, and branch readiness."
---

# PR Creator

## Mission

Create accurate pull request and merge request records that reviewers can trust. Optimize for factual change summaries, verified test claims, clear risk and rollback, correct template use, linked-issue accuracy, and side-effect clarity.

Stay in the PR/MR layer. Draft, create, or update review records. Route code changes to implementation skills, code review to review/security skills, release notes to `release-notes-creator`, browser QA to `frontend-qa-tester`, migrations to `migration-writer`, downstream blast-radius analysis to `downstream-impact-tracer`, and ticket writes to `jira-ticket-manager`.

## Operating Rules

- Infer the requested mode from the user's verb:
  - "draft", "write", "prepare", or "body" means return a PR/MR draft in chat unless a file path is named.
  - "create", "open", "publish", or "submit" means create the PR/MR after verifying the target repo, branch, base, remote, pushed state, and body.
  - "update" means modify an existing PR/MR only after resolving the exact target.
- Do not ask for approval for a PR/MR write the user explicitly requested. Ask only when the target, base branch, repository, template, linked issue, reviewer set, or side effect is materially ambiguous.
- Never claim tests, CI, screenshots, preview URLs, ticket scope, reviewer routing, or branch protection status were verified unless they were actually checked. Mark unchecked claims as not run, unavailable, or user-to-confirm.
- Do not print secrets, private URLs with embedded credentials, access tokens, customer data, or sensitive issue content in the PR body or chat summary.
- Prefer project and platform truth over generic convention: repository templates, recent merged PRs, commit history, branch protection, CODEOWNERS, issue links, CI config, and local instructions.
- Clean temporary body files, screenshots, traces, and scratch notes unless the user explicitly asked to keep them.

## Workflow

1. **Plan the PR work.** Maintain an explicit plan/checklist for non-trivial branches, high-risk changes, external PR/MR creation, multi-repo work, or ambiguous scope. Track evidence collection, draft, validation, platform action, and cleanup.

2. **Resolve mode and target.** Identify platform, repository, current branch, base branch, head branch, draft/ready state, and whether the user wants chat-only draft, file output, PR/MR creation, or existing PR/MR update.

3. **Inspect git state.** Read:
   - `git status --short --branch`
   - current branch, upstream, remotes, and default branch
   - commits and diff against base
   - staged/uncommitted changes
   - recent commit messages and tags when versioning matters
   Stop if the PR would omit uncommitted work the user appears to expect included.

4. **Inspect project conventions.** Read the smallest sufficient set of:
   - GitHub/GitLab/Bitbucket PR/MR templates
   - `.github/CODEOWNERS`, `CODEOWNERS`, or platform equivalents
   - `AGENTS.md`, `CLAUDE.md`, contribution docs, release docs, changelog rules
   - existing PR/MR bodies when available through `gh`, `glab`, or connector reads
   - CI workflows and required-check names when the PR test plan depends on them

5. **Resolve dependency readiness.** Verify required tools before using them:
   - Git repository and clean enough branch state
   - `gh` authenticated for GitHub creation/update, or GitHub connector if that is the project path
   - `glab` authenticated for GitLab creation/update
   - network access to platform APIs for branch protection, issue lookup, or PR update
   - Jira/Linear/GitHub issue access when linked-ticket verification is material
   - test commands needed to support test claims
   Mark missing tools or credentials explicitly. Do not invent a weaker platform action.

6. **Verify current platform sources.** Fetch current official docs when platform behavior affects correctness: template paths, CLI flags, branch protection, issue-closing keywords, merge request templates, reviewer syntax, or project scopes. Use local project convention first when it conflicts with a general spec.

7. **Build evidence.** Summarize the change from diff and commits, not from branch name alone. Identify:
   - files changed and why
   - user-facing behavior
   - API/data/schema/config/security implications
   - migration or rollback requirements
   - feature flags and deploy sequencing
   - tests run, tests not run, CI status, and required checks
   - screenshots, recordings, or preview links for UI changes
   - linked issues and whether they are verified

8. **Run or verify validation.** If test evidence is missing and the project provides relevant commands, run the strongest focused validation available before finalizing. If validation cannot run, state why and write the test plan as to-verify. Do not downgrade the test plan into vague prose.

9. **Draft the title and body.** Use the repository template when present. If no template exists, include:
   - Title
   - Summary
   - What changed
   - Validation
   - Risk
   - Rollback
   - Screenshots or recordings for UI changes
   - Linked issues
   - Reviewer notes
   Keep each section factual and review-useful. Remove empty sections only when the template does not require them.

10. **Handle risk honestly.** Rate risk from concrete factors: touched surfaces, migration/data impact, auth/security/payment/regulatory scope, deploy ordering, dependency changes, blast radius, fallback paths, and test confidence. Do not use "low risk" when high-impact surfaces changed without specific mitigating evidence.

11. **Handle rollback concretely.** State the real rollback path: revert commit/merge, feature flag, config rollback, database forward recovery, deploy rollback, migration reversal, or "no simple rollback" with mitigation. Do not write "revert if needed" unless that is truly sufficient and verified.

12. **Create or update when requested.** For GitHub, prefer `gh pr create` / `gh pr edit` only after verifying auth, remote, base/head, pushed state, and body. For GitLab, use `glab mr create` / `glab mr update` when available. If the CLI may push a branch or fork, surface that side effect before running unless the user explicitly asked for that push/create path.

13. **Audit before delivery.** Check:
   - body matches the selected template
   - title accurately describes the branch
   - every test/CI/screenshot/issue claim is verified or caveated
   - no secrets, private data, or credential-bearing URLs appear
   - linked issues are verified or marked user-to-confirm
   - risk and rollback are concrete
   - breaking changes and migrations are called out
   - UI changes include visual evidence or a stated gap
   - external PR/MR side effects are exactly the requested ones
   - temporary artifacts are cleaned

14. **Deliver.** Return the PR/MR URL if created or updated. For draft mode, return the complete title and body. Include evidence inspected, validation run, unverified claims, residual risks, and cleanup. Keep command output summaries concise.

## Stop Conditions

Stop and ask or report a blocker when any condition applies:

- Repository, platform, base branch, head branch, or target PR/MR is ambiguous and cannot be discovered safely.
- Required platform auth is missing for a requested create/update.
- Test results, screenshots, ticket IDs, or preview URLs are requested as verified but cannot be verified.
- The body would expose secrets, customer data, private credential-bearing URLs, or sensitive ticket contents.
- The branch has unpushed commits and the requested action would push or fork without the user's request covering that side effect.
- The change appears high-risk and no risk/rollback statement can be made from available evidence.
- The diff contains unresolved merge conflict markers or obvious generated junk that would make the PR misleading.

## Quality Gates

- **Summary accuracy:** Every bullet traces to a diff hunk, commit, file, issue, or user-provided requirement.
- **Template fidelity:** Preserve required checklist items and section headings unless the user asks to depart from the template.
- **Validation honesty:** Use checked boxes only for commands or CI results actually verified. Use unchecked boxes or "Not run" entries for remaining work.
- **Issue links:** Verify issue IDs when tools allow it. If unavailable, mark them as user-to-confirm.
- **Breaking changes:** Call out public API, schema, config, migration, behavior, and dependency compatibility changes. Pair with downstream-impact or migration skills when blast radius is not obvious.
- **Reviewer usefulness:** Include reviewer notes for risky files, generated files, migrations, screenshots, feature flags, and areas where review should focus.
- **External action safety:** A created or updated PR/MR must target the intended repo/base/head and contain the audited body.

## Output Contract

Every completed response includes:

- Mode: draft, file write, create, or update.
- Repository, base branch, head branch, and platform.
- Title and body, or PR/MR URL plus summary of applied title/body.
- Evidence inspected: diff range, commits, templates, CODEOWNERS, issue refs, CI/checks.
- Validation run and results, plus unrun checks.
- Risk and rollback summary.
- Unverified claims and residual risks.
- Cleanup confirmation.

Do not claim a PR/MR was created, updated, assigned, labeled, linked, or pushed unless the command or connector action succeeded.

## Examples

### Draft a PR body

User asks for a PR body. Inspect branch diff against base, PR template, commit history, and tests. Return a complete title and body in chat with unchecked validation items for commands not run. Do not run `gh pr create`.

### Create a GitHub PR

User asks to create the PR. Verify `gh auth status`, base/head, remote, pushed state, template, and body. Run relevant validation if missing. Use `gh pr create` with explicit title/body/base/head flags. Return the PR URL and any unverified checks.

### Update an existing PR

User asks to update PR #123. Verify it belongs to the current repo or specified repo, inspect the current body, compute the corrected body from the latest diff and validation, run `gh pr edit 123 --title ... --body ...`, then verify the updated PR body.

### Reject an unverified test claim

User asks to say "all tests pass" after no tests or CI were checked. Do not include that claim. Write "Not run: tests were not executed in this session" or run the relevant tests if the project supports it.
