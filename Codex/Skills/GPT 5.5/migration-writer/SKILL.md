---
name: migration-writer
description: "Use for migrations, rollbacks, backfills, upgrade steps, compatibility shims, deprecations, and verification."
---

# Migration Writer

## Mission

Write migration artifacts that can be reviewed, tested, and applied safely by the user or deployment system. Produce the migration, rollback or forward-recovery path, verification steps, and cutover plan needed for production-grade change.

Stay in the local artifact layer unless the user explicitly asks for a live operation. Do not apply migrations to production, run destructive database operations, deploy, push, release, or change external systems as part of this skill. Local file edits and local validation commands are allowed when requested.

Do not create backup copies, retained apply logs, memory folders, scratch plans, or migration ledgers by default.

## Definitions

- **Migration artifact:** A migration file, SQL script, framework migration, backfill script, compatibility shim, deprecation header/code path, lockfile update, or verification script written to the repository.
- **Migration type:** Database schema, database data/backfill, dependency upgrade, framework migration, cross-language port, API contract migration, or ETL/data-shape move.
- **Live apply:** Running a migration against a database, deploying an app, pushing code, changing traffic, executing a backfill on production data, or changing an external system.
- **Safety class:** Reversible, locking, online-with-tooling, data-mutating, storage-heavy, replication-sensitive, security-sensitive, irreversible, destructive, or cross-service.
- **Expand-contract:** Additive migration sequence that supports old and new code until cutover is proven, then removes the old shape.
- **Backfill discipline:** Chunked, idempotent, resumable, rate-limited, monitored, and safe to retry.
- **Rollback path:** The action that returns the system to the previous safe state, or a forward-recovery path when rollback is impossible.
- **Staging dry run:** Applying the migration to staging, a restored backup, or local representative environment with validation and rollback/recovery rehearsal.
- **Consumer-side plan:** Enumeration of callers, clients, jobs, reports, APIs, SDKs, webhooks, queues, data warehouses, and integrations affected by the migration.

## Non-Negotiables

- Identify migration type, target files, system/engine/framework, environment, and desired end state before writing.
- Inspect existing conventions before adding migration artifacts: prior migrations, naming, timestamps, rollback style, ORM/schema conventions, test strategy, and deployment process.
- Verify current official docs before relying on mutable migration syntax, lock behavior, online DDL support, framework migration APIs, package-manager behavior, or deprecation conventions.
- Write the migration only at the correct project location and in the project's established style.
- Preserve compatibility by default. Use expand-contract for breaking schema/API/data-shape changes unless the user explicitly accepts lock-step downtime and the risk is documented.
- Include rollback or forward-recovery. If rollback is impossible, state that honestly and require backup/restore or forward-fix validation.
- Make backfills chunked, idempotent, resumable, rate-limited, and observable when they can touch production-scale data.
- Never claim "safe for production" without validation plan, staging/dry-run expectation, lock/load/storage analysis, and rollback/recovery path.
- Do not apply migrations to production from this skill.
- Do not run destructive SQL or package-manager update commands against real targets unless the user explicitly requested that local artifact generation requires it and the target is local/non-production.
- Gate live operations separately if the user asks for them.
- Validate generated artifacts with the strongest available local checks.
- Clean temporary files and generated scratch outputs.

## Workflow

1. **Classify migration.** Determine database schema, database data, dependency, framework, cross-language, API contract, or ETL/data-shape.
2. **Resolve scope.** Identify current state, target state, target files, runtime/engine/framework versions, environment, downtime budget, data sensitivity, consumers, and non-goals.
3. **Inspect existing artifacts.** Read prior migrations, schema files, model definitions, callers, tests, package manifests/lockfiles, route/API definitions, generated clients, and deployment docs.
4. **Verify current sources.** Refresh official docs for the engine/framework/tooling that controls the migration.
5. **Classify safety.** Determine safety class, lock/load/storage/replication/security impact, reversibility, and consumer compatibility risk.
6. **Choose migration strategy.** Select additive/expand-contract, online DDL, chunked backfill, dual-read/dual-write, feature flags, compatibility shims, or phased deprecation according to table size, lock behavior, compatibility window, rollback needs, and application read/write paths.
7. **Design validation.** Define pre-checks, post-checks, invariants, sample queries, tests, dry-run commands, rollback/recovery rehearsal, and monitoring.
8. **Write artifacts.** Create or edit the local migration/backfill/rollback/test files in project style. Keep edits scoped to the migration.
9. **Run local validation.** Use linters, migration dry-run commands, tests, type checks, SQL parsers, generated-client checks, or package-manager checks that do not affect production.
10. **Self-review.** Re-read final files and verify compatibility, rollback truthfulness, idempotency, source freshness, and no hidden live actions.
11. **Deliver.** State files changed, strategy, safety class, validation, production apply instructions, residual risks, and next exact action.

## Migration Lenses

- **Database schema:** locks, online DDL, constraints, indexes, data type changes, defaults, nullable-to-not-null, renames, drops, partitioning, generated columns, and RLS/security effects.
- **Data/backfill:** chunking, idempotency, retry cursor, write amplification, replica lag, concurrent writes, verification queries, and abort criteria.
- **Dependency upgrade:** manifest/lockfile changes, changelog/release notes, breaking changes, transitive effects, runtime compatibility, tests, and rollback pin.
- **Framework migration:** middleware semantics, routing, request/response behavior, error handling, serialization, config, plugins, observability, and consumer compatibility.
- **API contract migration:** additive fields, versioning, deprecation headers, client rollout, SDK regeneration, contract tests, compatibility windows, and sunset plan.
- **Cross-language port:** semantic equivalence, numeric/timezone/encoding behavior, serialization, concurrency model, deployment shadowing, and rollback.
- **ETL/data-shape:** source/target ownership, reconciliation, idempotency, partial failure, replay, dedupe keys, audit trail, and data retention.

## Live Operation Gates

This skill writes local artifacts. If the user asks to apply, deploy, run against production, push, publish, dispatch, or mutate external state, gate it separately.

For each live operation, state:

- Target system, environment, account/project, database/service, and exact identifier.
- Exact command/action.
- Safety class and blast radius.
- Preconditions, including backup/restore evidence for destructive or irreversible work.
- Rollback or forward-recovery path.
- Validation after execution.
- Abort criteria.

Do not treat prior permission to write migration files as permission to apply them.

## Output Contract

Return:

- Migration type, target system, environment, scope, and end state.
- Sources checked and unavailable sources.
- Existing artifacts inspected.
- Safety class and rationale.
- Strategy: expand-contract, online DDL, backfill, compatibility shim, deprecation, or other.
- Files created/changed and why.
- Rollback or forward-recovery path.
- Validation run and validation still required.
- Production apply notes, clearly marked as not executed unless explicitly gated and done.
- Consumer-side impact and required coordination.
- Temporary artifacts created and cleaned up, or none.
- Residual risks and next exact action.

## Failure Modes

- **API deprecation missing:** v1 consumers get no deprecation signal. Add headers/docs/outreach plan.
- **Blocking DDL:** Schema change locks hot table. Use online DDL, maintenance window, or staged plan.
- **Breaking change without expand-contract:** Old and new code cannot run together. Use phased migration or gate lock-step downtime.
- **Concurrent write gap:** Backfill ignores writes occurring during migration. Add dual-write/reconciliation.
- **Cross-language semantic mismatch:** Decimal, timezone, Unicode, sort order, or concurrency behavior changes. Add equivalence tests.
- **Dependency upgrade drift:** Lockfile and manifest disagree. Update both or report mismatch.
- **Drop before consumers migrate:** Old field/table/API removed while callers still depend on it. Trace consumers.
- **Framework semantic drift:** Middleware, error handling, serialization, auth, or routing changes silently. Add compatibility tests.
- **Lifecycle script hazard:** Package command runs untrusted scripts. Avoid or gate.
- **No rollback truth:** Rollback file exists but cannot restore data or behavior. State true recovery path.
- **Non-idempotent backfill:** Re-run changes results differently. Make deterministic or state risk.
- **Production apply hidden in validation:** Validation command mutates real DB or deploys. Stop and gate.
- **Regulated data migration:** PII/PHI/payment data moves without retention/access/legal review. Route to legal/security.
- **Replica lag ignored:** Backfill or index build overwhelms replicas. Add lag monitoring and abort criteria.
- **Temporary junk:** Generated scratch migration files or dumps remain. Remove or report.
- **Unchunked backfill:** Large data update runs as one transaction. Chunk and make resumable.
- **Unverified production safety:** No staging dry run or production-shaped data. Mark not production-ready.
- **Wrong target file:** Migration written in the wrong directory or wrong framework format. Inspect conventions first.

## Examples

### Add Nullable Column

Create one additive migration, no backfill unless required, a rollback that drops the column only for non-production or clearly reversible cases, and validation that schema reflects the new nullable column.

### Rename Column

Use expand-contract: add new column, dual-write/backfill, cut reads over, verify consumers, then contract old column after soak. Do not use one-step rename on production unless the user accepts lock-step downtime.

### Backfill

Write a resumable script keyed by stable primary key range or cursor, with chunk size, retry behavior, progress logging, rate limit, verification query, and abort criteria.

### API v1 To v2

Add v2 without breaking v1, generate contract tests, add deprecation/sunset communication plan, keep both versions through the migration window, and remove v1 only after consumer evidence supports it.

## Source Ledger

Use these as source-refresh targets. During real migration work, refresh the source that controls the target engine/framework/tool.

- OpenAI Codex skills documentation, `https://developers.openai.com/codex/skills`.
- PostgreSQL `ALTER TABLE`, `https://www.postgresql.org/docs/current/sql-altertable.html`.
- PostgreSQL `CREATE INDEX`, `https://www.postgresql.org/docs/current/sql-createindex.html`.
- MySQL InnoDB Online DDL, `https://dev.mysql.com/doc/refman/8.4/en/innodb-online-ddl.html`.
- MySQL Online DDL limitations, `https://dev.mysql.com/doc/refman/en/innodb-online-ddl-limitations.html`.
- Rails Active Record Migrations, `https://guides.rubyonrails.org/active_record_migrations.html`.
- Django migrations, `https://docs.djangoproject.com/en/stable/topics/migrations/`.
- Alembic documentation, `https://alembic.sqlalchemy.org/`.
- Prisma Migrate, `https://www.prisma.io/docs/orm/prisma-migrate`.
- Liquibase documentation, `https://docs.liquibase.com/`.
- Flyway documentation, `https://documentation.red-gate.com/fd`.
- gh-ost, `https://github.com/github/gh-ost`.
- pg_repack, `https://reorg.github.io/pg_repack/`.
- Percona pt-online-schema-change, `https://docs.percona.com/percona-toolkit/pt-online-schema-change.html`.
