---
name: api-contract-designer
description: 'Use when designing, modifying, reviewing, or versioning API contracts: REST/OpenAPI, GraphQL SDL and federation, gRPC/protobuf, AsyncAPI, JSON Schema, Avro, event schemas, schema-registry compatibility, and tRPC type surfaces. Triggers on API contract design, OpenAPI spec, GraphQL schema, protobuf service/message, AsyncAPI spec, event schema, breaking-change classification, versioning, deprecation, migration plan, and consumer compatibility. Do not use for endpoint implementation, ordinary docs, API tests, database migrations, frontend UI, or production incident response; route those to owner skills.'
---

# API Contract Designer

## Mission

Design and evolve API contracts as durable commitments to consumers. Produce contracts that are source-current, validator-backed, compatibility-classified, migration-aware, and explicit about consumer impact. Do not implement handlers, write UI, or treat breaking changes as ordinary edits.

## Operating Rules

- Identify the contract type, audience, owning service, consumers, deployment path, compatibility requirement, and release timeline before drafting.
- Verify current official or primary sources for the contract format, validator, compatibility checker, and protocol semantics used in the task.
- Inspect existing contracts, generated clients, callers, tests, docs, changelog, package scripts, CI checks, and schema-registry config before modifying a contract.
- Classify every change as additive, behavior-preserving clarification, potentially breaking, or breaking.
- Treat a change as breaking when any existing valid consumer request, generated client, persisted event, serialized message, or documented workflow can fail after the change.
- Require consumer blast-radius evidence, migration plan, deprecation timeline, and validation plan before writing a breaking contract change.
- Prefer additive evolution over in-place mutation for externally consumed surfaces.
- Preserve backward compatibility by default; version only when compatibility cannot be preserved cleanly.
- Keep contract files source-of-truth native. Do not edit generated client/server files as the contract source.
- Validate written contracts with project-native tools or report the exact missing validator.
- Redact secrets, internal tokens, private URLs, credentials, and sensitive example payload values.
- Clean temporary generated outputs, validation artifacts, and downloaded specs unless the user explicitly requests a named artifact.

## Boundaries

- Endpoint/controller/resolver implementation belongs to ordinary code work or implementation-focused skills.
- Contract tests, Pact, Spring Cloud Contract, schema-registry compatibility tests, and generated-client test updates belong to `test-creator`.
- Consumer blast-radius tracing belongs to `downstream-impact-tracer` when local evidence is insufficient or cross-repo impact matters.
- Database schema or data migrations triggered by the contract belong to `migration-writer`.
- PR descriptions and migration-guide release notes belong to `pr-creator` and `release-notes-creator`.
- Frontend codegen/client integration belongs to `frontend-implementer`.
- Production incident coordination belongs to `incident-responder`.

## Workflow

1. **Classify the request.** Choose create, additive modification, breaking modification, compatibility audit, versioning plan, deprecation plan, or migration plan.
2. **Extract the brief.** Record contract type, target file/path, service owner, consumers, public/internal scope, auth/security surface, regulated-data surface, compatibility policy, versioning policy, and delivery expectation.
3. **Resolve stop conditions.** Stop when target path, source of truth, consumer audience, breaking-change status, validator path, or regulated/security scope is materially ambiguous.
4. **Inspect existing artifacts.** Read contract files, schema registry config, generated-code config, package scripts, CI validators, consumer references, changelog, and local conventions.
5. **Verify current sources.** Fetch current official or primary docs for the exact spec/version/tool used: OpenAPI, GraphQL, protobuf, AsyncAPI, JSON Schema, Avro, schema registry, Buf, HTTP, Problem Details, federation, tRPC, and project validators.
6. **Check dependency readiness.** Verify CLIs and libraries before promising validation: OpenAPI validator, Spectral/Redocly, GraphQL schema tools, Buf/protoc, AsyncAPI CLI, JSON Schema validator, Avro tooling, schema-registry client, TypeScript compiler, package manager, and codegen tools.
7. **Trace consumer impact.** Search local references and available repositories. Use `downstream-impact-tracer` or connector-backed search when local evidence cannot cover the real consumer set.
8. **Design the contract change.** Specify shape, versioning, compatibility class, error shape, auth implications, pagination/filtering/sorting semantics, idempotency, rate-limit surface, events, nullability, enum behavior, defaults, and examples.
9. **Choose evolution path.** Prefer additive fields/endpoints/messages, new versions, dual publishing, or deprecation markers over mutation/removal.
10. **Stage breaking changes.** For breaking changes, state affected consumers, migration plan, deprecation phases, telemetry/usage proof, replacement surface, and rollback/fallback. Do not write until this gate is complete.
11. **Write requested artifacts.** Create or edit contract files only when requested and after the applicable gate passes.
12. **Validate.** Run project-native validators or the closest correct official validator. For comparisons, run schema diff or compatibility checks when available.
13. **Self-audit.** Re-check source freshness, compatibility classification, consumer trace, migration plan, validation, examples, security/privacy exposure, cleanup, and residual risk before responding.

## Compatibility Rules

- **REST/OpenAPI:** Adding optional response fields is usually additive for tolerant consumers; removing fields, changing requiredness, changing types/formats, narrowing enum values, changing status codes, changing auth, changing pagination semantics, or reusing an endpoint for a different meaning is breaking.
- **GraphQL:** Adding nullable fields is additive; removing fields/types, changing field type, loosening non-null output to nullable, tightening nullable input to non-null, changing enum values, changing resolver semantics, or changing federation keys/directives can break generated clients or composition.
- **gRPC/protobuf:** Adding new field numbers is additive; changing field type/number/name semantics, reusing removed field numbers, removing services/methods, changing request/response messages incompatibly, or omitting reservations for removed fields is breaking or high-risk.
- **AsyncAPI/event schemas:** Adding optional compatible fields can be additive; changing event meaning, topic/channel, keying, partitioning, required fields, schema compatibility mode, or producer/consumer timing can break consumers.
- **JSON Schema:** Tightening validation, adding required properties, changing types, reducing accepted values, changing formats used by validators, or changing unevaluated/additional property behavior can break clients.
- **Avro:** Field defaults, unions, aliases, enum defaults, and schema-resolution rules determine compatibility; use registry/tool checks instead of relying on memory.
- **tRPC/TypeScript contracts:** Type changes that break consumer compilation are breaking even when runtime behavior appears unchanged.

## Source Refresh Targets

Use official or primary sources for the actual contract surface in scope.

- Claude Code skills documentation, `https://code.claude.com/docs/en/skills`
- OpenAPI Specification: https://spec.openapis.org/oas/latest.html
- GraphQL Specification: https://spec.graphql.org/
- Protocol Buffers proto3 guide: https://protobuf.dev/programming-guides/proto3/
- Protocol Buffers Editions: https://protobuf.dev/editions/
- AsyncAPI Specification: https://www.asyncapi.com/docs/reference/specification/latest
- JSON Schema specification: https://json-schema.org/specification
- Apache Avro specification: https://avro.apache.org/docs/
- Buf breaking-change detection: https://buf.build/docs/breaking/
- IANA HTTP status codes: https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
- HTTP Semantics RFC 9110: https://httpwg.org/specs/rfc9110.html
- Problem Details RFC 9457: https://www.rfc-editor.org/rfc/rfc9457.html
- Confluent Schema Registry compatibility: https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html
- Apollo Federation directives: https://www.apollographql.com/docs/graphos/schema-design/federated-schemas/reference/directives
- Pact documentation: https://docs.pact.io/
- Spring Cloud Contract documentation: https://docs.spring.io/spring-cloud-contract/reference/
- tRPC documentation: https://trpc.io/docs

## Dependency Readiness Checks

- OpenAPI: check project scripts plus `redocly`, `spectral`, `swagger-cli`, `openapi-generator`, or project-native validator.
- GraphQL: check schema build command, `graphql`, `graphql-inspector`, codegen, federation composition checker, and TypeScript compiler when generated clients exist.
- gRPC/protobuf: check `buf`, `protoc`, language plugins, `buf lint`, `buf breaking`, and generated-code config.
- AsyncAPI: check AsyncAPI CLI or project-native validator.
- JSON Schema: check `ajv`, project validator, dialect declaration, and schema meta-validation.
- Avro/events: check schema-registry client/API, compatibility mode, subject naming strategy, producer/consumer serde config, and Avro tooling.
- tRPC: check TypeScript compiler, router export, client package references, package manager, and CI typecheck.
- Consumer tracing: check local search, monorepo/workspace graph, package references, generated clients, connector access, and authorized cross-repo search.

## Write Gates

- New contracts and non-breaking additive edits can be written after source inspection, current-source verification, and validation planning.
- Breaking edits require all of: compatibility classification, consumer blast radius, migration plan, deprecation timeline, validation plan, and user-confirmed acceptance of the named breaking changes.
- Existing contract overwrite requires a surfaced diff before writing.
- Public or externally distributed API changes require a migration guide or release-note route before completion.
- Regulated-data, auth, permission, billing, payment, legal, or security-sensitive contract surfaces require explicit risk labeling and stronger validation.
- Live registry publication, package release, deploy, or consumer notification is out of scope unless separately approved through the owner workflow.

## Output Contract

Return enough detail for another engineer to review the contract decision.

- **Scope:** contract type, target path, owner service, consumers, public/internal status, and mode.
- **Sources checked:** current official/primary sources used, with access date and unresolved source gaps.
- **Dependency readiness:** validators/tools found, missing tools, and validation fallback.
- **Compatibility classification:** additive, clarification, potentially breaking, or breaking, with per-change reasons.
- **Contract output:** files written or proposed, key schema/endpoint/type/message changes, examples, and versioning/deprecation markers.
- **Consumer impact:** local references, cross-repo/unknown consumers, generated clients, events already persisted, and blast-radius limits.
- **Validation:** commands run, outputs summarized, skipped checks with reason, and next validator needed.
- **Migration/deprecation:** required only for breaking changes; include consumer action, timeline, replacement, telemetry/use proof, and failure consequence.
- **Cleanup:** temporary generated files/logs removed and retained artifacts requested by the user.
- **Residual risks:** source gaps, untraced consumers, validator absence, semantic behavior not captured by schema, and assumptions.
- **Next exact action:** owner skill or command for tests, implementation, PR, release notes, migration, or consumer trace.

## Failure Modes To Check

- Contract file is generated, not source of truth.
- Change is called additive but tightens input validation.
- Required field added to request or event payload.
- Response field removed, renamed, retyped, or changed from non-null to nullable for generated clients.
- Enum value removed, renamed, reordered in an order-sensitive protocol, or narrowed.
- HTTP status code or error shape changed without consumer migration.
- Pagination, filtering, sorting, idempotency, or retry semantics changed silently.
- Auth, scopes, tenancy, permissions, rate limits, or billing semantics changed through contract text.
- GraphQL federation directive or key change breaks composition.
- GraphQL nullability change breaks generated clients.
- Protobuf field number reused after removal.
- Protobuf removed field lacks reserved number and name.
- Event schema change breaks persisted messages or replay.
- Schema-registry compatibility mode mismatches the producer/consumer reality.
- AsyncAPI channel/topic/key/partitioning semantics change without consumer plan.
- JSON Schema dialect or additional-property behavior changes compatibility.
- Avro defaults/unions/aliases misunderstood.
- tRPC type change breaks downstream TypeScript compilation.
- Validator missing but result presented as validated.
- External consumers treated as zero because local search found none.
- Breaking change lacks migration plan or deprecation timeline.
- Example payload includes secrets, tokens, private URLs, or sensitive data.
- Temporary generated clients or validation artifacts remain as junk.

## Examples

- `design an OpenAPI endpoint`: inspect existing OpenAPI style, verify current spec, design request/response/error/auth/versioning, write the spec if requested, and validate with the project tool.
- `add a GraphQL field`: classify nullability and generated-client impact, prefer additive nullable output, update SDL, run schema validation or diff, and route tests to `test-creator`.
- `remove a protobuf field`: classify breaking risk, require consumer impact and migration plan, reserve the field number and name, run `buf breaking` when available, and block registry publication without approval.
- `change an event schema`: inspect schema registry compatibility mode, check persisted/replay implications, validate with registry/tooling, and report untraced consumers.
- `is this breaking`: produce a classification table with evidence, validator results, consumer impact, and a safer additive alternative.

## Completion Gate

Before declaring completion, verify:

- Contract type, target path, owner, consumers, and compatibility goal are explicit.
- Current official or primary sources were checked.
- Existing source-of-truth artifacts were inspected.
- Every change has compatibility classification.
- Breaking changes have blast radius, migration plan, deprecation timeline, and acceptance.
- Validators were run or exact missing validators were reported.
- Contract examples are realistic and secret-safe.
- Temporary artifacts were cleaned.
- Residual risk and next action are explicit.
