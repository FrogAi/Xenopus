---
name: test-creator
description: Creates or modifies tests that prove specific production behavior. Use for "write tests," "add regression test," "test this function/class/endpoint," "increase meaningful coverage for this path," "add unit/integration/e2e/contract/property-based test," or "prove this bug cannot come back." Avoid running existing tests only, debugging failing tests, choosing a new framework architecturally, broad QA audits, and performance benchmarking without a test-authoring goal.
when_to_use: Use when the user wants new or improved tests written to disk for a concrete target behavior. Do not use when the user only wants to run tests, investigate why a test fails, design a whole testing strategy, migrate frameworks, or benchmark performance without adding a regression guard.
argument-hint: "[target behavior, file/symbol/endpoint, bug evidence, test type, or coverage gap]"
---

# Test Creator

## Mission

Write tests that would fail for the targeted wrong behavior and pass for the correct behavior. Match the project's existing framework, structure, naming, fixture style, and assertion style. Prefer meaningful behavioral proof over raw coverage numbers.

Act when the user asks for tests. Do not stage every file for approval. Ask only when a missing answer would materially change the test design and cannot be discovered from the repo.

## Definitions

- **System under test (SUT):** The real function, class, endpoint, service, component, or flow being verified.
- **Boundary:** A dependency outside the SUT's ownership, such as network, database, file system, clock, random source, subprocess, third-party service, or browser.
- **Unit test:** Exercises a small SUT directly, mocking only true boundaries.
- **Integration test:** Exercises multiple owned components together, using real or faithful test infrastructure for the integration point.
- **End-to-end test:** Exercises a full user or system flow through the same interfaces a real user or client uses.
- **Contract test:** Verifies request, response, event, schema, status, error envelope, or consumer/provider compatibility.
- **Property-based test:** Uses generators to check an invariant across many inputs, with preconditions and shrinking behavior understood.
- **Regression test:** Proves a known bug or risk cannot recur; it is tied to the exact symptom, root cause, or invariant.
- **Meaningful coverage:** Coverage of behavior, branches, invariants, failure modes, and risk surfaces. Raw percentage alone is not meaningful.
- **Validation-theater test:** A test that passes without proving the SUT, such as mocking the SUT, asserting `true`, snapshotting unstable output, or checking only that a value exists.
- **Deterministic test:** A test that does not depend on current time, random seed, execution order, live services, network variance, or shared mutable state unless those are controlled.

## Non-Negotiables

- Inspect manifests, test configs, existing test files, and project instructions before writing tests.
- Use the existing test framework and conventions unless the user explicitly asks for a new framework decision.
- Verify current official framework/tool documentation when matcher APIs, test-runner flags, browser APIs, contract tools, property generators, or framework behavior affect correctness.
- Test the real SUT. Mock only true boundaries and only at the narrowest useful point.
- Reject validation theater. Do not write tests that would still pass if the target behavior were broken.
- Do not use real secrets, production credentials, private tokens, PII, PHI, payment data, or production-only payloads in fixtures.
- Prefer deterministic fixtures, controlled clocks, seeded randomness, isolated storage, and cleanup hooks.
- For regression tests, tie the assertion to the known symptom or root cause. If the root cause is unknown, route to `root-cause-bug-finder` first.
- For code changes just selected by `surgical-change-finder`, write the smallest regression proof that covers the chosen behavior and the risky edge.
- Do not chase 100 percent coverage. Add tests that protect meaningful behavior and high-risk branches.
- Run the narrowest relevant test command after writing. If that passes and blast radius is broader, run the next strongest practical check.
- If a new test fails because the production code is wrong and the user asked only for tests, report that clearly instead of changing production code.
- Clean up temporary files, test databases, generated outputs, and scratch artifacts when safe.

## Workflow

1. **Classify the target.** Identify test type, SUT, target behavior, risk level, and whether this is a regression, new feature guard, coverage gap, or contract proof.
2. **Discover conventions.** Read manifests, lock/config files, existing tests near the target, project instructions, fixtures, factories, helper utilities, and test commands.
3. **Resolve missing dependencies.** Confirm the test framework, package manager, runner command, required services, browser tooling, fixture data, and credentials. Mark missing or unsafe dependencies before relying on them.
4. **Check current sources.** Fetch current official docs for framework/tool APIs when the test uses mutable behavior or unfamiliar APIs.
5. **Design the proof.** Define what failure the test would catch, why the chosen test level is appropriate, what boundaries to mock, what data to use, and how determinism is enforced.
6. **Choose file placement.** Match existing naming and directory conventions. Modify an existing test file only when that is the local pattern; otherwise create the smallest new test file.
7. **Write the tests.** Use project helpers, factories, setup hooks, and assertion style. Keep tests readable and focused. Add comments only when the reason is not obvious.
8. **Run focused validation.** Run the narrowest test command for the new/changed tests. Use the project package manager and script conventions.
9. **Fix test defects.** If the test code is wrong, fix it and rerun. If production code fails against a valid new test and the user did not ask for a production fix, stop and report.
10. **Run broader validation when needed.** Run related suite, type check, lint, browser check, contract verifier, or coverage command when blast radius or project norms require it.
11. **Self-review.** Confirm the test exercises the real SUT, fails for the targeted wrong behavior, avoids validation theater, uses safe data, matches conventions, and leaves no temporary junk.
12. **Deliver.** Summarize files changed, behavior covered, commands run, results, unrun checks, and residual risks.

## Test Design Rules

- **Unit:** Cover happy path, meaningful edge cases, error paths, and boundary behavior. Mock true boundaries, not owned logic.
- **Integration:** Prefer real owned infrastructure or faithful test doubles. Verify data persistence, transactions, serialization, dependency wiring, and collaborator failure paths.
- **End-to-end:** Use stable selectors and user-visible assertions. Avoid brittle timing waits; prefer explicit readiness signals.
- **Contract:** Verify shape, status, error envelope, required/optional fields, compatibility expectations, and representative negative cases.
- **Property-based:** State the invariant, generator domain, preconditions, shrink behavior, and seed strategy when the runner supports it.
- **Regression:** Use the smallest input that reproduces the bug or invariant breach. Name the behavior clearly enough that a future maintainer sees why the test exists.
- **Coverage gap:** Target high-risk uncovered behavior first. Report raw coverage only as supporting evidence, not as the goal.

## Output Contract

Return:

- Files created or modified.
- Test type and SUT.
- Behaviors and edge cases covered.
- Framework/convention evidence used.
- Current sources checked, when any mutable framework/tool behavior mattered.
- Validation commands run and their results.
- Checks not run and why.
- Any production failure exposed by the new tests.
- Temporary artifacts created and cleaned up, or none.
- Residual risks and next exact action.

## Failure Modes

- **Coverage theater:** Test increases coverage but protects no meaningful behavior. Replace with risk-based assertions.
- **Fixture leak:** Test leaves rows, files, globals, browser state, mocks, or environment variables behind. Add teardown or isolation.
- **Framework mismatch:** Test uses a matcher, setup hook, or file pattern not used by the project. Match corpus or verify from current docs.
- **Generated artifact gap:** Schema snapshots, clients, lockfiles, or generated fixtures need updates. Include or report.
- **Invalid expected behavior:** Test asserts behavior that conflicts with source docs, product requirements, or existing contract. Resolve before writing.
- **Live service dependency:** Test depends on network or third-party state. Replace with controlled test double unless the test is explicitly e2e against a controlled environment.
- **Mocked SUT:** The test mocks the function being tested. Rewrite to execute the real SUT.
- **Order dependency:** Test passes only after another test. Isolate state and cleanup.
- **Overbroad mock:** Mock graph replaces the behavior the test should prove. Move mock boundary outward.
- **Production failure exposed:** New valid test fails because production code is wrong. Report clearly and route to implementation if requested.
- **Root cause unknown:** Regression test is drafted before the bug cause is known. Investigate first.
- **Snapshot rubber stamp:** Snapshot added or updated without stable semantic review. Prefer explicit assertions.
- **Tautological assertion:** The assertion would pass regardless of behavior. Replace with behavior-specific assertions.
- **Time/random flake:** Test depends on wall clock or random data. Control clock, seed, or generator domain.
- **Unrun test:** Test is written but not executed. Report the exact blocker and confidence limit.
- **Unsafe fixture data:** Fixture includes secrets, private data, or production payloads. Redact or synthesize safe data.

## Examples

### Regression Test

For an off-by-one bug in pagination, write a test with the smallest page size and item count that previously failed. Assert exact returned items and pagination metadata. Run the focused test. If it fails against current production code and the user only asked for tests, report the red result.

### Boundary Mock

For a service that computes invoice totals and sends an email, test the real total calculation and mock only the email transport. Do not mock the invoice calculator. Assert total, tax, rounding, and the email payload passed to the boundary.

### Property-Based Supplement

For a parser with many valid numeric formats, keep the example tests for known edge cases and add a property-based test for round-trip parse/format invariants. Restrict generators to the documented input domain and exclude invalid inputs with explicit preconditions.

## Source Refresh

- Claude Code skills documentation, `https://code.claude.com/docs/en/skills`. Used for skill frontmatter, lifecycle, allowed tools, sidecars, and model/effort inheritance.
- User maximum-quality standard, `C:\Users\James\.claude\output-styles\maximum-quality.md`, use at execution time as the local policy source. Used for local quality bar and source discipline.

During use, refresh current official or primary sources for the detected test framework, assertion library, browser runner, contract tool, property-based library, coverage tool, language runtime, or build system when those details affect the test.
