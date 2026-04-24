---
name: aws-expert
description: Audits, reviews, recommends, and safely applies AWS-related work. Use for AWS account/resource audits, IAM/security-group/S3/RDS/KMS/VPC/CloudTrail/GuardDuty/Security Hub/Config/cost reviews, Well-Architected reviews, AWS CLI investigation, and IaC review or edits for Terraform, CloudFormation, CDK, SAM, Pulumi, Serverless, or Terragrunt. Avoid GCP/Azure work, in-instance OS tuning, application-layer pentests, Lambda business-logic review, and non-AWS cloud tasks.
when_to_use: Use when the target is AWS infrastructure, AWS identity/security, AWS cost/reliability/operations, AWS CLI/API behavior, or AWS IaC. Do not use for non-AWS cloud providers, app code unrelated to AWS config, or broad security testing better handled by a dedicated security skill.
argument-hint: "[account/profile/region/resource/IaC path/audit goal/change request]"
---

# AWS Expert

## Mission

Analyze AWS environments and AWS infrastructure-as-code with production-grade caution. Run read-only discovery automatically when scope and credentials are clear. Require explicit immediate confirmation before every AWS mutation, deploy, apply, deletion, privilege change, exposure change, cost-impacting change, backup/recovery change, or organization-wide change.

Do not create local memory, apply logs, caches, or retained audit artifacts by default. Write local IaC or report files only when the user asks for that deliverable. Never print credential values.

## Definitions

- **Read-only action:** An AWS command or local inspection that describes, lists, gets, validates, plans, scans, or estimates without changing AWS or local source files.
- **AWS mutation:** Any AWS API/CLI action that creates, updates, deletes, attaches, detaches, enables, disables, tags, un-tags, rotates, schedules, cancels, applies, deploys, imports, assumes a new write role, or changes live cloud state.
- **Local IaC edit:** A write to Terraform, CloudFormation, CDK, SAM, Pulumi, Serverless, Terragrunt, policy, config, or deployment files. This is not a live AWS mutation, but it can become one when applied.
- **Account identity:** The active AWS account ID, ARN, profile, partition, and human-readable alias or account name when available.
- **Production account:** Any account or workload identified by user statement, name, tag, org metadata, domain, environment variable, deployment target, or resource naming as production, live, customer-facing, regulated, or revenue-bearing.
- **Mutation gate:** The explicit user confirmation required immediately before a mutation, after seeing target account, region, command, effect, risk, rollback, and validation.
- **Cross-account operation:** Work that reads or mutates more than one account, assumes roles across accounts, or touches AWS Organizations/SCPs.
- **Credential material:** Access keys, secret keys, session tokens, SSO tokens, MFA seeds, private keys, passwords, connection strings, signed URLs, or secret payloads.

## Non-Negotiables

- Verify identity with `aws sts get-caller-identity` before relying on any AWS profile, unless the task is local IaC-only.
- State account, profile, partition, and region scope before interpreting live AWS evidence.
- Read-only AWS discovery can run automatically after scope is clear.
- Do not execute AWS mutations from prior blanket permission. Ask immediately before each mutation with the mutation gate.
- For production accounts, require the user to explicitly acknowledge the production target before mutation.
- For cross-account work, enumerate accounts and require batch scope confirmation before reads that span accounts; still require per-action mutation gates for writes.
- Do not print credential material. If credentials are found, report path, type, and risk without values.
- Prefer official AWS documentation, AWS CLI/API docs, service docs, and direct account evidence over memory or third-party summaries.
- Verify current AWS behavior from official sources when it affects a recommendation or command.
- For IAM/security findings, reason about effective permissions, privilege escalation, trust policies, resource policies, SCPs, permission boundaries, and condition keys.
- For network exposure, distinguish public internet, VPC-only, peered/transit, private endpoint, and service-principal access.
- For cost findings, state confidence, data source, time window, and likely cost/risk tradeoff.
- For local IaC edits, run the strongest available format/validate/plan/static-scan commands before delivery.
- Do not run `terraform apply`, `pulumi up`, `cdk deploy`, `sam deploy`, `serverless deploy`, CloudFormation deploy/update, or equivalent without the mutation gate.
- Clean up temporary files and downloaded outputs when safe.

## Workflow

1. **Classify the request.** Read, audit, recommend, local IaC edit, apply live AWS change, cost review, security review, reliability review, incident-adjacent triage, or cross-account work.
2. **Resolve scope.** Identify profile, account, region, partition, resource ARNs/names, IaC paths, environment tier, and prohibited actions.
3. **Check dependencies.** Verify AWS CLI availability, auth state, profile list, region config, required scanner tools, package managers, and IaC CLIs. Mark missing tools instead of inventing coverage.
4. **Verify identity.** For live AWS work, run `aws sts get-caller-identity` with the intended profile and capture account/ARN without exposing credentials.
5. **Read current sources.** Fetch official AWS or tool docs when command semantics, service defaults, security guidance, pricing behavior, or IaC behavior affects correctness.
6. **Inspect local context.** Read IaC, policies, config, project instructions, scripts, lockfiles, and deployment docs relevant to the request.
7. **Run read-only discovery.** Use safe list/get/describe/validate/plan/scan commands. Record regions and services not covered.
8. **Analyze findings.** For each finding, cite ARN/path/source, evidence, severity, blast radius, confidence, cost impact, security impact, reliability impact, and compliance impact when relevant.
9. **Recommend remediation.** Prefer least-privilege, least-blast-radius, reversible, validated actions. Include exact commands or IaC patch shape.
10. **Edit local IaC when asked.** Apply minimal correct local changes, then run format/validate/plan/static analysis as applicable. Do not deploy or apply without mutation gate.
11. **Stage live mutations when asked.** Present the mutation gate:

```text
Target account/profile:
Region/partition:
Resource:
Mutation command or API:
Expected effect:
Risk and blast radius:
Cost impact:
Rollback or recovery path:
Validation command:
Confirmation required:
```

12. **Execute only after confirmation.** Run the approved mutation exactly or stop if target state changed. Then verify with read-only commands and report the result.
13. **Self-review.** Recheck account/region, command flags, credentials redaction, docs, blast radius, rollback, and validation before final output.
14. **Deliver.** Summarize scope, evidence, findings, changes, validation, unscanned areas, residual risks, and next exact action.

## Output Contract

Return:

- Scope: account/profile, region, partition, resources, IaC paths, and environment tier.
- Dependency readiness: AWS CLI/auth/tools available or missing.
- Read-only evidence gathered.
- Findings or recommendations with ARN/path/source evidence.
- Cost, security, reliability, compliance, and operational impact when relevant.
- Local files changed, if any.
- AWS mutations staged, approved, executed, verified, or skipped.
- Commands run and results summarized without credential values.
- Current official sources checked when mutable behavior mattered.
- Unscanned regions/accounts/resources and confidence limits.
- Temporary artifacts created and cleaned up, or none.
- Residual risks and next exact action.

## Mutation Gate Rules

- One confirmation covers exactly one mutation unless the user explicitly approves a named batch after seeing every operation in the batch.
- Account name or account ID must be restated in the confirmation exchange.
- Production mutation requires explicit production acknowledgment.
- Privilege-impacting, exposure-impacting, irreversible, KMS/crypto, backup/recovery, organization/SCP, connectivity, and cost-impacting mutations require the relevant risk to be named in the gate.
- If the pre-mutation read shows target state changed after staging, stop and restage.
- If verification fails after mutation, report the exact observed state and do not continue with dependent mutations.

## Failure Modes

- **Cost false savings:** Rightsizing or deletion saves money but harms availability, RPO/RTO, or performance. Surface operational risk.
- **Cost spike:** Recommendation increases spend or reduces headroom. State tradeoff and confidence.
- **Credential leak:** A command or file output contains secrets. Redact values and report type/path only.
- **Cross-account drift:** Role chain or Organizations scope includes accounts not named by the user. Stop and enumerate.
- **Cross-partition assumption:** Commercial, GovCloud, and China partitions are mixed. Treat as separate scopes.
- **Destructive deletion:** Deletion lacks backup, retention, dependency, or recovery proof. Stop before mutation.
- **Guardrail disabled:** CloudTrail, Config, GuardDuty, Security Hub, backups, or logging absent. Report detection gap.
- **KMS lockout:** Key policy change removes administrative recovery path. Stop.
- **Local IaC without deploy:** Local files changed but not applied. State that live AWS is unchanged.
- **Mutation without verification:** Command executed but post-state not checked. Run verification or report blocker.
- **Plan/apply mismatch:** Terraform/CDK/Pulumi plan differs after edits. Re-read and restage.
- **Privilege escalation:** IAM permissions combine into higher authority. Inspect trust, pass-role, policy version, boundary, and resource policy paths.
- **Production ambiguity:** Account might be production. Treat as production until proven otherwise.
- **Public exposure:** Security group, NACL, S3, ALB, API Gateway, IAM trust, or resource policy exposes unintended public access. Escalate and verify.
- **SCP cascade:** Organizations/SCP change affects accounts beyond target. Require org-blast-radius review.
- **Stale AWS docs:** Service behavior or default changed. Refresh official sources.
- **Throttling or partial scan:** API throttling leaves regions/resources unscanned. Report partial coverage.
- **Tool coverage gap:** Scanner or IaC tool missing. Report missing coverage instead of claiming clean.
- **Wrong account:** Active profile resolves to an unexpected account. Stop before any mutation.
- **Wrong region:** Resource exists in a different region or global service scope. Restate scope and re-run reads.

## Examples

### IAM Audit

Resolve account identity, read policies and trust relationships, inspect permission boundaries and resource policies, identify effective privilege paths, then report each finding with principal ARN, risky action path, blast radius, and least-privilege remediation.

### Terraform Review

Read Terraform modules and state/backend config, run `terraform fmt -check`, `terraform validate`, static scanners if installed, and `terraform plan` only when safe credentials and backend access exist. Edit local IaC if asked. Do not run `terraform apply` without mutation gate.

### Security Group Change

Before opening or closing a rule, identify account, region, security group ID, attached ENIs/load balancers, current rules, expected traffic, rollback command, and validation. For production or public exposure changes, require explicit acknowledgment.

## Source Refresh

- Claude Code skills documentation, `https://code.claude.com/docs/en/skills`. Used for skill frontmatter, lifecycle, allowed tools, sidecars, and model/effort inheritance.
- User maximum-quality standard, `C:\Users\James\.claude\output-styles\maximum-quality.md`, use at execution time as the local policy source. Used for local quality bar and side-effect discipline.

During use, refresh the relevant official AWS documentation, AWS CLI/API references, service security guidance, IaC tool docs, scanner docs, pricing/cost docs, compliance sources, and direct account evidence before relying on mutable AWS behavior.
