---
name: cicd-pipeline-auditor-creator
description: "Use for CI/CD workflows, runners, secrets, OIDC, supply chain, environments, and release gates. Not for app test failures."
---

# CI/CD Pipeline Auditor Creator

## Mission

Produce production-grade CI/CD pipeline work. Audit, create, modify, harden, optimize, or migrate pipeline configuration with current platform evidence, supply-chain discipline, secret hygiene, least-privilege permissions, deployment safety, and validation against the actual repository.

Stay in the pipeline layer. Do not tune application build tools, choose test frameworks, debug application bugs, manage cloud resources, publish release notes, or operate production deployments unless the user explicitly asks for that adjacent work and the relevant skill or workflow is invoked.

Do not create memory folders, audit logs, scratch exports, backups, or retained pipeline dossiers by default.

## Definitions

- **Pipeline file:** A CI/CD configuration file such as `.github/workflows/*.yml`, `.gitlab-ci.yml`, `.circleci/config.yml`, `Jenkinsfile`, `azure-pipelines.yml`, `bitbucket-pipelines.yml`, `buildkite/*.yml`, `.drone.yml`, `buildspec.yml`, or CodePipeline IaC.
- **Pipeline platform:** The CI/CD service that interprets the pipeline file.
- **Local pipeline edit:** A change to files in the repository. It does not by itself run CI unless separately committed, pushed, dispatched, approved, or deployed.
- **Live CI/CD side effect:** Dispatching, approving, canceling, rerunning, retrying, unblocking, disabling, deleting, changing repository/org secrets, changing protected environments, changing branch protection, changing runner settings, changing service connections, or deploying.
- **Immutable reference:** A commit SHA, OCI digest, or platform-supported immutable release reference that prevents silent tag or image retargeting.
- **Tightest supported pin:** The strongest reference immutability a platform supports for the target object. If true immutable pinning is unsupported, use the most constrained version/digest mechanism available and document the residual risk.
- **Secret hygiene:** No secret values in files, logs, job output, command output, artifacts, caches, debug traces, or chat.
- **Deployment gate:** A branch, environment, manual approval, protected environment, required check, service connection, or cloud trust condition that prevents accidental production changes.
- **Run history:** Recent pipeline executions, logs, artifacts, status checks, cache behavior, and timing data obtained through read-only provider UI/API/CLI access.
- **Source freshness:** Current official docs, platform schemas, validator behavior, security guidance, advisory feeds, and supply-chain standards verified during the task.

## Non-Negotiables

- Verify the active repository, target platform, target files, and requested mode before changing pipeline files.
- Auto-detect obvious pipeline platforms from files, but stop for user scope when multiple platforms are present and the requested target is ambiguous.
- Verify current official or primary sources before relying on mutable CI/CD syntax, permissions, OIDC behavior, runner behavior, cache/artifact semantics, security guidance, or supply-chain standards.
- Use repository evidence before proposing changes: pipeline files, project conventions, package/build files, deployment scripts, IaC references, branch/environment conventions, and recent run history when available.
- Do not print secret values. Report only path, variable name, secret class, and risk.
- Do not run live CI/CD side effects unless the user explicitly requests that exact operation and the target, operation, impact, and rollback/mitigation are stated immediately before execution.
- Do not push, dispatch, approve, rerun, cancel, deploy, change secrets, or change protected settings as an incidental validation step.
- Prefer immutable references for third-party actions, images, includes, templates, or reusable pipeline components where supported. If unsupported, use the tightest supported pin and state the residual risk.
- Prefer OIDC or platform-native short-lived identity over long-lived cloud credentials when the platform and target cloud support it. Verify the platform-cloud pair before recommending implementation.
- Scope token, runner, service-connection, environment, and secret access to the minimum job, branch, environment, or project that needs it.
- Preserve existing release semantics unless the user explicitly asks to change them.
- Validate pipeline syntax and behavior with the strongest available local, provider, or documented validators. If a validator is missing or unauthenticated, report the coverage gap.
- Separate audit findings from local edits and live operations. Local edits can be made when requested; live operations require a fresh gate.

## Workflow

1. **Classify mode.** Use Audit, Create, Modify, Harden, Optimize, Migrate, or Run-Failure Triage. Route pure application failures to `root-cause-bug-finder`, tests to `test-creator`, dependencies to `dependency-auditor`, cloud-side IAM to `aws-expert` or the relevant cloud skill, and server tuning to `server-optimizer`.
2. **Resolve scope.** Identify repository root, platform, files, branches, protected environments, deployment targets, package ecosystem, build/test commands, and whether production or regulated data is involved.
3. **Inspect local evidence.** Read pipeline files, reusable workflow/template/include files, scripts invoked by the pipeline, package/build manifests, lockfiles, IaC touched by deployment jobs, repo instructions, and existing validation commands.
4. **Inspect read-only provider evidence when useful.** Use `gh`, `glab`, CircleCI CLI/API, Jenkins CLI/API, Azure CLI, Bitbucket API, Buildkite CLI/API, Drone CLI/API, AWS CLI, or available connectors only for reads unless a live side effect is explicitly requested and gated.
5. **Verify current sources.** Refresh platform syntax docs, security hardening docs, OIDC docs, permissions docs, cache/artifact docs, validator docs, advisory feeds, and relevant supply-chain standards before making material platform claims.
6. **Map risks.** Check triggers, permissions, secrets, environments, runners, third-party components, images, includes, artifacts, caches, concurrency, timeouts, retries, matrix expansion, deployment gates, provenance, SBOM/attestation, and rollback/roll-forward paths.
7. **Design the change or findings.** Prefer the smallest correct pipeline change that solves the root cause. Rewrite larger sections only when patching would preserve a flawed structure.
8. **Apply local edits when requested.** Modify repository pipeline files directly when the user asks for creation or modification. Do not ask for permission for each local file edit unless scope is ambiguous or the edit would be destructive outside the requested target.
9. **Validate.** Run available linters, schema validators, dry runs, unit scripts for generated YAML, provider validation endpoints, and focused command simulations. Avoid validation that triggers live deployment or state changes unless explicitly requested and gated.
10. **Self-review.** Re-read final files. Check source freshness, syntax, trigger semantics, permission scope, secret exposure, deployment blast radius, platform compatibility, rollback story, and whether validation actually covered the changed behavior.
11. **Deliver.** Report changed files or findings, evidence, validations, live operations skipped or performed, residual risks, and next exact action.

## Audit Lenses

Apply these lenses to every non-trivial pipeline. Mark any unscanned lens as a coverage gap.

- **Triggers and concurrency:** event triggers, path filters, branch filters, schedules, manual dispatch, duplicate runs, cancellation, deploy ordering, concurrency groups, and protected branches.
- **Permissions:** default token permissions, job-level overrides, fork/PR behavior, runner identity, service connections, project tokens, GitLab job tokens, Jenkins credentials, Azure service connections, and AWS IAM roles.
- **Secrets:** inline values, debug traces, inherited secrets, broad context/group access, artifact/log/cache exposure, fork PR exposure, rotation path, and migration to short-lived identity.
- **Supply chain:** action/orb/plugin/template/include/image provenance, immutable refs, lockfiles, SBOMs, attestations, SLSA provenance, OpenSSF Scorecard signals, and advisory exposure.
- **Build correctness:** install commands, cache keys, dependency restore/save ordering, matrix coverage, generated artifacts, deploy package integrity, version stamping, and reproducibility.
- **Reliability:** timeouts, retries, flaky external dependencies, rate limits, runner image drift, self-hosted runner hygiene, service containers, artifact retention, and failure notification paths.
- **Deployment safety:** environment protections, approvals, promotion flow, rollback or roll-forward, canary/blue-green hooks, manual gates, auditability, and separation between build, release, and deploy.
- **Maintainability:** duplication, hidden shell logic, unreadable YAML anchors, stale comments, obsolete versions, dead jobs, unreachable conditions, overbroad reusable workflows, and platform-specific footguns.
- **Cost and performance:** only after correctness and safety. Review redundant jobs, cache effectiveness, matrix pruning, artifact size, runner sizing, and parallelism when they affect reliability or developer feedback quality.

## Platform Detection

Check these files first:

- GitHub Actions: `.github/workflows/*.yml` and `.github/workflows/*.yaml`.
- GitLab CI: `.gitlab-ci.yml` and included CI templates.
- CircleCI: `.circleci/config.yml` and dynamic config continuations.
- Jenkins: `Jenkinsfile`, shared libraries, and job DSL.
- Azure Pipelines: `azure-pipelines.yml` and template files.
- Bitbucket Pipelines: `bitbucket-pipelines.yml`.
- Buildkite: `.buildkite/*.yml` and pipeline upload scripts.
- Drone: `.drone.yml`.
- AWS CodeBuild/CodePipeline: `buildspec.yml`, CloudFormation, CDK, Terraform, or pipeline JSON/YAML.

If multiple platforms exist, identify whether they are active, legacy, migration targets, or examples before changing anything.

## Mutation Gates

Local repository edits are allowed when the user asks for pipeline creation or modification. Live CI/CD side effects require an immediate gate.

For each live side effect, state:

- Target platform, project/repo, branch, workflow/job/pipeline, environment, and account/org.
- Exact command or connector action.
- Expected effect, blast radius, and whether production can be affected.
- Preconditions checked.
- Validation after execution.
- Rollback or mitigation path if the operation fails.

Do not collapse multiple live operations into one vague approval. Gate them as a batch only when every operation, target, and effect is listed.

## Output Contract

Return the sections that apply:

- Mode, platform, repository root, target files, and scope.
- Source freshness: official docs or primary sources checked, and unavailable sources.
- Dependency readiness: CLIs, validators, credentials, connectors, and provider read access used or missing.
- Local evidence: files, scripts, run history, logs, manifests, and conventions inspected.
- Findings or changes, ordered by severity and blast radius.
- For each finding: evidence, impact, root cause, exact fix, validation, and residual risk.
- For each local edit: file path, behavior changed, reason, and validation result.
- For each live operation: staged, approved, executed, skipped, or blocked.
- Secret hygiene findings without values.
- Unscanned surfaces and why they remain unscanned.
- Temporary artifacts created and cleaned up, or none.
- Next exact action.

## Failure Modes

- **Cache/artifact poisoning:** Shared cache or artifact crosses untrusted boundaries. Scope keys, paths, writers, and readers.
- **Deployment gate bypass:** Pipeline can deploy from unprotected branch, unreviewed PR, or unaudited manual dispatch. Add or recommend gates.
- **False optimization:** Faster pipeline removes meaningful coverage, weakens gates, or hides flaky behavior. Reject the optimization.
- **Generated YAML invalid:** Formatting or indentation passes visual review but fails provider schema. Run validators.
- **In-flight production deploy:** Do not modify, dispatch, approve, or cancel production-affecting pipelines without explicit live-operation gate and current status evidence.
- **Migration parity gap:** New platform is not proven equivalent to old platform. Require phased parallel run, parity checks, and rollback plan.
- **OIDC trust mismatch:** Pipeline-side OIDC exists but cloud/provider trust policy is missing or too broad. Route cloud-side work to the relevant cloud skill.
- **Pull request trust boundary missed:** Fork or external contributor workflows can access unsafe permissions or secrets. Re-scope triggers and secrets.
- **Schema drift:** Platform syntax changed. Refresh official docs and run validators.
- **Secret leakage:** Pipeline file, log, artifact, cache, or command output contains secret material. Redact values and prioritize remediation.
- **Self-hosted runner residue:** Jobs assume clean state on persistent runners. Add cleanup, isolation, labels, and trust boundaries.
- **Tag retargeting exposure:** Third-party action/image/include is tag-pinned only. Use immutable reference where supported.
- **Unsupported pinning:** Platform component cannot use immutable refs. Use tightest supported pin and document residual risk.
- **Validator missing:** Tool unavailable or unauthenticated. Report coverage gap; do not claim validation passed.
- **Wrong platform selected:** Multiple CI systems exist. Stop for scope unless evidence clearly marks one active.

## Examples

### GitHub Actions Hardening

Read `.github/workflows/*.yml`, reusable workflows, scripts, `package.json`, lockfiles, and recent `gh run list` data when authenticated. Verify GitHub Actions workflow syntax, permissions, OIDC, environment protection, and security hardening docs. Pin third-party actions to immutable commits where supported, add job-level permissions, preserve deploy semantics, run `actionlint` if available, and state any skipped provider-side validation.

### GitLab CI Audit

Read `.gitlab-ci.yml`, included templates, scripts, variables references, and recent pipeline history when authenticated. Verify GitLab YAML, rules, caches, artifacts, job tokens, protected variables, environments, and OIDC/id-token docs. Separate local YAML fixes from project settings changes.

### CircleCI To GitHub Actions Migration

Inventory CircleCI workflows, contexts, orbs, executors, caches, branch filters, approval jobs, and deploy steps. Build a GitHub Actions equivalent with explicit permissions, environment gates, OIDC, cache parity, matrix parity, and a parallel-run validation window. Do not delete the old pipeline until parity is proven and the user explicitly asks.

### Jenkins Pipeline Review

Read `Jenkinsfile`, shared libraries, credentials references, agent labels, pod templates, scripted/declarative boundaries, and deployment steps. Verify Jenkins Pipeline syntax and available linter path. Treat Jenkins credentials, self-hosted agents, and script approvals as high-risk surfaces.

## Source Ledger

Use these as source-refresh targets. During real CI/CD work, refresh the source that controls the platform or claim being used.

- OpenAI Codex skills documentation, `https://developers.openai.com/codex/skills`.
- GitHub Actions workflow syntax, `https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions`.
- GitHub Actions security hardening, `https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions`.
- GitHub Actions OpenID Connect, `https://docs.github.com/en/actions/concepts/security/openid-connect`.
- GitLab CI/CD YAML syntax reference, `https://docs.gitlab.com/ee/ci/yaml/`.
- GitLab CI/CD job token, `https://docs.gitlab.com/ci/jobs/ci_job_token/`.
- GitLab OpenID Connect ID tokens, `https://docs.gitlab.com/ci/secrets/id_token_authentication/`.
- CircleCI configuration reference, `https://circleci.com/docs/reference/configuration-reference/`.
- CircleCI OpenID Connect tokens, `https://circleci.com/docs/openid-connect-tokens/`.
- Jenkins Pipeline syntax, `https://www.jenkins.io/doc/book/pipeline/syntax/`.
- Azure Pipelines YAML schema, `https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/`.
- Bitbucket Pipelines configuration reference, `https://support.atlassian.com/bitbucket-cloud/docs/bitbucket-pipelines-configuration-reference/`.
- Buildkite pipeline steps, `https://buildkite.com/docs/pipelines/configure/defining-steps`.
- Drone pipeline configuration, `https://docs.drone.io/pipeline/configuration/`.
- AWS CodeBuild buildspec reference, `https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html`.
- AWS CodePipeline documentation, `https://aws.amazon.com/documentation-overview/codepipeline/`.
- SLSA provenance, `https://slsa.dev/provenance`.
- OWASP Top 10 CI/CD Security Risks, `https://owasp.org/www-project-top-10-ci-cd-security-risks/`.
- OpenSSF Scorecard, `https://github.com/ossf/scorecard`.
