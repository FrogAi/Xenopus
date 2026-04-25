---
name: downstream-impact-tracer
description: "Use to trace callers, consumers, and blast radius for symbols, APIs, routes, events, schemas, config, migrations, or behavior."
---

# Downstream Impact Tracer

## Mission

Trace the downstream blast radius of a specific symbol, endpoint, schema field, config key, or contract before anyone changes it. Produce an evidence-backed report of consumers, likely breakage class, validation routes, and untraced surfaces. Stay read-only.

Do not apply the change, edit files, write reports to disk, create caches, create backups, or mutate external systems. Route fixes to `surgical-change-finder`, `migration-writer`, `api-contract-designer`, `test-creator`, or the appropriate implementation skill after the trace is complete.

Do not claim "all consumers found." State the scope searched, tools used, confidence, and known static-analysis limits.

## Definitions

- **Trace target:** The exact thing being changed or inspected: function, method, class, interface, type alias, constant, API endpoint, GraphQL field, proto field, SQL table, SQL column, configuration key, event name, queue topic, or message schema.
- **Canonical identity:** The fully qualified name or contract key that disambiguates the target, including package/module/class, signature or arity when relevant, HTTP method and path for endpoints, schema/table/column for SQL, and file path plus dotted key for config.
- **Consumer:** A code location, config, query, test, client, route, handler, generated type, or external contract that depends on the trace target.
- **Direct consumer:** A first-order reference to the target.
- **Indirect consumer:** A dependency through wrappers, generated clients, framework wiring, runtime configuration, or external contract generation.
- **Untraced surface:** A plausible consumer path static tools cannot fully resolve, such as reflection, dynamic import, plugin registry, dependency injection, raw SQL strings, generated code, string-built routes, event buses, external clients, or configuration-driven dispatch.
- **Breakage class:** The likely impact if the target changes: compile/type failure, runtime failure, contract incompatibility, data migration risk, silent semantic drift, test-only impact, documentation-only impact, or unknown.
- **Coverage statement:** The required summary of repositories, languages, tools, search patterns, files inspected, untraced surfaces, and known limits.

## Non-Negotiables

- Resolve the trace target to a canonical identity before tracing. If multiple symbols match and the right target cannot be discovered, ask.
- Stay read-only. Do not edit, stage, commit, write files, create reports, install tools, authenticate, or mutate services.
- Use semantic references first when available, AST or structural search second, and text search last. Label text-only hits as needing verification.
- Search tests, generated clients, schemas, migrations, fixtures, docs, config, route tables, CI, and scripts when they can consume the target.
- Verify current tool behavior from official or primary docs when exact behavior matters, such as LSP capabilities, GitHub CLI behavior, API contract generation, or framework routing.
- Include every untraced surface discovered in scope. Do not hide dynamic dispatch or generated-code uncertainty.
- Separate direct consumers, indirect consumers, false positives, and unknowns.
- Classify breakage per consumer. Do not assign one uniform class to all consumers unless evidence supports it.
- Include validation routes for the proposed change: focused tests, type checks, contract tests, migration dry runs, schema checks, or client generation checks.
- For cross-repo traces, use only user-named repos and verify read access with safe read-only checks. Do not infer an organization-wide repo set without explicit user scope.
- Do not print secret values found in configs, histories, or generated clients. Report only path, pattern class, and risk.

## Modes

- **API Contract Trace:** REST endpoint, GraphQL field, gRPC/proto field, webhook, event, or generated client.
- **Config Trace:** Environment variable, feature flag, config key, queue/topic name, or runtime setting.
- **Cross-Repo Trace:** User-named additional repositories reachable through read-only local paths or authorized GitHub CLI checks.
- **Multi-Target Trace:** Related targets that must be changed together.
- **SQL/Schema Trace:** Table, column, view, stored procedure, migration, or ORM model field.
- **Symbol Trace:** Function, method, class, interface, type, constant, or exported value.

## Workflow

1. **Classify target and intended change.** Identify mode, canonical identity, intended change, repo scope, and whether this is read-only enumeration or pre-change blast-radius analysis.
2. **Resolve ambiguity.** If multiple candidates match, inspect definitions, imports, references, and user context. Ask only when the correct identity remains material and undiscoverable.
3. **Inspect project context.** Read relevant AGENTS.md/CLAUDE.md, manifests, package boundaries, generated-code config, schema files, API specs, tests, and build/test scripts.
4. **Choose search strategy.** Use available semantic/LSP tools, language indexes, AST patterns, import graphs, code search, grep, git grep, and contract/schema tools. Record which tools were available and which were missing.
5. **Find direct consumers.** Search definitions, references, imports, calls, implementations, type annotations, queries, route handlers, generated clients, and tests.
6. **Find indirect consumers.** Search wrappers, aliases, re-exports, dependency injection, route registries, event buses, schema generation, ORM mappings, migration history, generated code, and config-driven paths.
7. **Find untraced surfaces.** Search for dynamic dispatch patterns near the target and in relevant frameworks. Label each with file, line when available, pattern, and impact.
8. **Remove false positives.** Separate references that are comments, unrelated same-name symbols, docs-only mentions, test fixtures, dead code, or generated stale output. Keep them in a false-positive note when useful.
9. **Classify impact.** Assign breakage class and confidence per consumer based on how the target is used and what change is contemplated.
10. **Define validation routes.** Map the affected consumers to specific tests, type checks, contract checks, schema checks, or manual probes needed before changing the target.
11. **Audit the trace.** Re-run targeted searches for alternate names, aliases, generated artifacts, raw strings, schema aliases, and framework conventions. Compare trace count against expected surface area from codebase structure.
12. **Deliver the report.** Include the output contract below. If evidence is incomplete, say exactly what is incomplete and how to resolve it.

## Search Strategy

Use the strongest available evidence in this order:

1. Language-aware references: LSP find references, compiler query, IDE index, type checker, CodeQL database, or language-native tooling when already installed and safe to run.
2. Structural references: AST search, import graph, static analyzer, route/schema parser, generated-code metadata, or package graph.
3. Literal references: exact name search, string search, endpoint path search, SQL identifier search, config key search, event/topic search.
4. Runtime-adjacent evidence: tests, fixtures, logs supplied by the user, generated clients, migrations, docs, and CI workflows.

Record degradation. If semantic tooling is missing and the report relies on text search, mark confidence lower and identify follow-up validation.

## Output Contract

Return a report with these sections:

1. **Target:** Canonical identity, intended change, mode, repo scope, and confidence in identity resolution.
2. **Coverage Statement:** Repos, paths, languages, tools, search patterns, generated artifacts, schemas, and configs inspected; tools unavailable; cross-repo auth status when relevant.
3. **Consumer Summary:** Counts by direct, indirect, false positive, untraced, and unknown.
4. **Consumer Table:** Each material consumer with repo, file:line, consumer identity, relationship, breakage class, confidence, evidence, and remediation hint.
5. **Untraced Surfaces:** File:line, pattern type, why static analysis stops, likely impact, and how to resolve.
6. **Validation Routes:** Exact tests, type checks, contract checks, schema checks, generated-client checks, or manual probes needed before changing the target.
7. **False Positives:** Notable excluded hits and why they were excluded.
8. **Residual Risks:** Known limits, especially dynamic dispatch, generated-code freshness, stale indexes, missing tooling, external consumers, and private repos outside scope.
9. **Recommended Next Route:** The next skill or action, such as `surgical-change-finder`, `migration-writer`, `api-contract-designer`, or `test-creator`.

## Breakage Classes

- **Compile/type failure:** The consumer should fail type checking, compilation, or import resolution.
- **Runtime failure:** The consumer can compile but likely fails at runtime.
- **Contract incompatibility:** External or generated clients can break because the public contract changed.
- **Data migration risk:** Stored data, queries, migrations, schemas, reports, or ETL jobs depend on the target.
- **Silent semantic drift:** Behavior changes without an obvious failure.
- **Test-only impact:** Only tests, fixtures, or mocks reference the target.
- **Documentation-only impact:** Docs mention the target but do not execute it.
- **Unknown:** Evidence is insufficient; state what would resolve it.

## Validation Checklist

Before delivery, verify:

- The canonical identity is clear or the ambiguity is explicit.
- Definition locations were inspected.
- Direct and indirect consumer searches both ran.
- Tests, schemas, generated artifacts, configs, and docs were considered when relevant.
- Dynamic/untraced surfaces are listed.
- Consumer table entries have file:line when available, relationship, breakage class, confidence, evidence, and remediation hint.
- Coverage statement matches the actual searches performed.
- The report does not claim completeness.
- No files or external systems were mutated.
- Secret-looking values were not printed.

## Failure Modes

- **Completeness overclaim:** Report says all consumers found. Replace with coverage statement and residual risks.
- **Cross-repo overreach:** Repos are inferred instead of user-named. Stop and ask for scope.
- **Dynamic dispatch gap:** Runtime wiring hides consumers. Add untraced-surface entries and validation routes.
- **External consumer gap:** Public API has consumers outside the repo. Label out-of-scope consumers and recommend contract checks.
- **Generated client gap:** Generated code consumes the contract but source generator is overlooked. Inspect generation config and freshness.
- **Raw SQL gap:** ORM references found but raw SQL, views, triggers, or reports missed. Search SQL strings and schema artifacts.
- **Scope creep into implementation:** Trace turns into edit plan. Stop at impact report and route follow-up.
- **Secret leakage:** Config search exposes credentials. Redact values and report risk only.
- **Text-search false confidence:** Literal search misses aliases or overloads. Prefer semantic/AST evidence and label degradation.
- **Uniform breakage class error:** Consumers have mixed failure modes but receive one label. Reclassify per consumer.
- **Validation theater:** Suggested tests do not cover the changed target. Replace with focused validation.
- **Wrong symbol identity:** Same name exists in multiple packages. Resolve FQN or ask.

## Examples

### Function Rename

Trace `payments.calculateFee(amount, region)`. Find imports, direct calls, tests, wrappers, generated docs, and string references. Classify type-checked callers as compile/type failure for rename, dynamic invocation as unknown, and docs as documentation-only.

### API Endpoint Change

Trace `POST /v1/orders`. Search route definitions, OpenAPI specs, generated clients, frontend calls, integration tests, webhooks, and docs. Classify generated-client consumers as contract incompatibility and raw string calls as runtime failure or unknown depending on validation.

### SQL Column Change

Trace `public.users.email`. Search migrations, ORM models, raw SQL, views, reports, ETL, tests, and fixtures. Treat dynamic ORM access and report queries as untraced or lower-confidence when static evidence cannot prove coverage.

## Source Ledger

- OpenAI Codex skills documentation, `https://developers.openai.com/codex/skills`. Use for current skill frontmatter, progressive disclosure, sidecar metadata, invocation policy, dependency declaration, discovery, and invocation behavior; refresh before relying on mutable Codex runtime details.
- Language Server Protocol official site, `https://microsoft.github.io/language-server-protocol/`. Used for language-server feature framing such as reference finding.
- GitHub CLI `gh repo view` manual, `https://cli.github.com/manual/gh_repo_view`. Used for safe read-only repository access checks when cross-repo tracing is requested.
- Semantic Versioning 2.0.0, `https://semver.org/`. Used for public API breaking-change framing when semver-governed contracts are in scope.

Refresh these sources during use when skill format, tooling behavior, repository access behavior, or contract compatibility rules affect the trace.
