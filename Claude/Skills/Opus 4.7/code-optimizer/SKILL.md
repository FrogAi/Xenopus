---
name: code-optimizer
description: Improves runtime, memory, allocation, concurrency, serialization, or I/O performance of source code with measurement-grounded discipline. Use for "optimize this function," "speed up this path," "reduce memory," "reduce allocations," "reduce latency," "increase throughput," "profile and optimize," "remove blocking calls," "fix this O(n^2) loop," "batch this I/O," "stream instead of buffering," or "find code-level hotspots." Avoid SQL/query-plan optimization, server/OS/container tuning, generic benchmarking without an optimization goal, test creation without optimization, application bug root-cause work, and language rewrites.
when_to_use: Use when the user wants code changed or reviewed for better performance. Do not use for database index/query/schema work, web-server or infrastructure tuning, CI/CD performance, frontend UX performance, pure benchmark harness design, or production incident triage unless the code path itself is the target.
argument-hint: "[file/symbol/path, workload, metric: latency/throughput/memory/I/O, constraints]"
---

# Code Optimizer

## Mission

Improve code-level performance without breaking behavior. Find the real bottleneck, measure a representative baseline, make the smallest correct code change that addresses the cause, and validate both behavior and performance.

Stay in the code layer. Route SQL plan/index/schema work to `database-auditor-optimizer`, server/OS/container tuning to `server-optimizer`, measurement-only work to `performance-benchmarker`, frontend UX/perceived-performance work to frontend skills, and bug root-cause work to `root-cause-bug-finder`.

Do not create retained benchmark ledgers, memory folders, scratch reports, cache directories, or backups by default. Remove temporary benchmark outputs and profiler files after extracting the needed result unless the user explicitly asks to keep them.

## Definitions

- **Workload of record:** The input size, dataset, traffic pattern, request shape, or benchmark scenario that represents the user's real performance target.
- **Baseline:** Measured current behavior for the target metric before any optimization.
- **Profile:** Evidence showing where time, memory, allocation, lock contention, I/O wait, or event-loop blocking is concentrated.
- **Benchmark:** Repeatable measurement that compares before and after behavior under controlled enough conditions to support a performance claim.
- **Hot path:** Code that materially contributes to the target metric under the workload of record.
- **Cold path:** Code that does not materially affect the target metric under the workload of record.
- **Behavior-preserving optimization:** A change intended to keep externally observable behavior the same.
- **Behavior-changing optimization:** A change that trades correctness, precision, ordering, consistency, timing, memory ceiling, security property, or API behavior for performance.
- **Asymptotic proof:** A clear complexity improvement such as repeated linear search to indexed lookup, where behavior preservation can be proven from local code and tests.
- **Regression:** Any worse result in correctness, target performance metric, secondary performance metric, resource usage, API behavior, security, determinism, or maintainability.

## Non-Negotiables

- Identify the performance goal and target metric before changing code.
- Inspect the real code path, callers, tests, inputs, and runtime conventions before proposing an optimization.
- Establish a baseline with the workload of record whenever feasible.
- Do not claim a performance improvement unless it is measured, profiled, or backed by an asymptotic proof whose assumptions are explicit.
- Preserve behavior by default. Behavior-changing optimizations require explicit user acceptance of the tradeoff.
- Create or strengthen focused tests when the optimized hot path lacks meaningful behavioral coverage and the test can be built from local evidence.
- Validate nearby tests before and after material code edits when feasible.
- Run the strongest practical benchmark or profiler for the target language/runtime. If a tool is unavailable, use the next-best local measurement and report the gap.
- Treat one-shot wall-clock timings as weak evidence. Use repeated measurements, warmup when relevant, stable inputs, and noise controls where practical.
- Check secondary metrics that can invert the win: memory, allocations, p95/p99 latency, CPU, I/O, lock contention, cold-start time, artifact size, and error rate.
- Reject optimizations that only make code look faster while moving cost elsewhere, weakening validation, or hiding a failure.
- Keep the change surgical unless the measured root cause is structural.
- Re-read final code and compare the final behavior path against the original before delivery.

## Workflow

1. **Classify mode.** Use Audit, Profile, Optimize, Apply, or Verify. If the user only wants measurement, route to `performance-benchmarker`; if they want code performance improved, stay here.
2. **Resolve scope.** Identify file, symbol, endpoint, job, command, dataset, input scale, target metric, runtime, version, hardware/container constraints, and non-goals.
3. **Inspect evidence.** Read the target code, callers, tests, benchmark harnesses, profiling scripts, package/runtime config, relevant lockfiles, and recent performance notes if present.
4. **Verify current sources.** Check current official docs for the runtime, profiler, benchmark framework, and performance-sensitive APIs before relying on mutable behavior.
5. **Establish baseline.** Use existing benchmarks/profilers first. If missing, build the smallest representative harness that does not become permanent junk unless the user wants it retained.
6. **Locate the bottleneck.** Use profiling or code-path analysis to separate CPU, memory, allocation, I/O, lock contention, event-loop blocking, database wait, network wait, and downstream service wait.
7. **Generate hypotheses.** List plausible causes, evidence for, evidence against, and the chosen target. Do not chase a user-suspected slow path if measurement points elsewhere.
8. **Design candidate changes.** Prefer algorithmic, data-structure, batching, streaming, allocation, caching, async, or concurrency fixes that address the measured cause. Reject cosmetic micro-optimizations on cold paths.
9. **Check correctness risk.** Trace callers and downstream assumptions. Identify ordering, precision, consistency, mutation, concurrency, caching, security, and API-contract risks.
10. **Edit when requested.** Apply the smallest correct local code change. Rewrite a larger section only when localized patches preserve the bottleneck or make correctness harder to prove.
11. **Validate behavior.** Run focused tests, type checks, lint, property checks, golden tests, or manual simulations appropriate to the code path.
12. **Validate performance.** Re-run the baseline scenario with the same workload and comparable conditions. Report improvement, regression, or no-change honestly.
13. **Clean up.** Remove temporary profiler output, generated benchmark files, logs, and scratch data unless explicitly requested.
14. **Self-review.** Re-read final files, compare before/after behavior, check metrics, check secondary regressions, and verify the output does not overstate confidence.
15. **Deliver.** State what changed, why it targets the measured cause, validation results, residual risks, and next exact action.

## Optimization Lenses

Check the relevant lenses before deciding the fix:

- **Algorithmic complexity:** nested scans, repeated sorting, quadratic joins, avoidable recursion, unbounded retries, and poor data-structure choice.
- **Allocation and memory:** per-iteration allocation, unnecessary copies, string concatenation, buffering whole streams, object churn, pool misuse, excessive retained memory, and cache growth.
- **I/O and serialization:** repeated file/network calls, chatty APIs, N+1 service requests, synchronous disk access in async paths, inefficient encodings, and avoidable parse/stringify cycles.
- **Concurrency:** lock contention, coarse critical sections, blocking in event loops, unbounded goroutines/tasks/threads, queue backpressure, race-prone caches, and false sharing.
- **Runtime behavior:** JIT warmup, interpreter overhead, garbage collection, vectorization, compiler optimizations, pgo/autofdo, and runtime-version-specific behavior.
- **Caching and batching:** cache key correctness, invalidation, memory ceiling, stampede behavior, stale reads, batching size, streaming boundaries, and backpressure.
- **Tail latency:** p95/p99 regressions, cold starts, long pauses, retry storms, head-of-line blocking, and noisy-neighbor sensitivity.
- **Maintainability:** complexity added by the optimization, readability loss, hidden invariants, broader blast radius, and future debugging cost.
- **Security:** timing side channels, weakened constant-time paths, cache poisoning, unsafe deserialization shortcuts, unsafe native code, and precision-loss attacks.

## Measurement Discipline

- Use the existing project benchmark or profiler if it already represents the workload.
- Prefer profiler evidence before editing when the bottleneck is unknown.
- Use release/production-like build settings when measuring runtime performance.
- Keep inputs fixed between before and after runs.
- Separate warmup from measured iterations for JIT or adaptive runtimes.
- Repeat enough runs to detect noise; report instability instead of cherry-picking.
- Compare the target metric and secondary metrics.
- Use the same machine/container class when possible.
- Avoid changing dependencies, environment, or workload between baseline and post-change unless that change is the optimization being tested.
- If measurement is impossible from local context, label the performance claim as unverified and provide the strongest validation that was possible.

## Mutation Gates

Local code edits are allowed when the user asks for optimization. Gate only these cases with explicit user acceptance:

- Behavior-changing optimization.
- Security-sensitive path where performance and safety trade off.
- Public API or serialized format change.
- Persistent cache or state format change.
- New dependency, native extension, service, worker, queue, or background process.
- Removal of tests, validation, logging needed for correctness, or safety checks.

For gated changes, state the tradeoff, affected behavior, blast radius, validation plan, and rollback path before applying.

## Output Contract

Return:

- Scope, workload of record, target metric, and non-goals.
- Baseline evidence and profiler/benchmark method.
- Bottleneck diagnosis with verified facts, local evidence, inference, and unknowns separated.
- Candidate fixes considered and why the chosen fix is the root-cause fix.
- Files changed and exact behavior changed.
- Tests, type checks, linters, profilers, benchmarks, and simulations run.
- Before/after results, including no-change or regression if that is what happened.
- Secondary metric and correctness risks checked.
- Temporary artifacts created and cleaned up, or none.
- Residual risks and next exact action.

## Failure Modes

- **Async blocking:** Sync work is introduced into an event loop or async path. Offload or keep async-safe.
- **Behavior drift:** Faster code changes ordering, precision, casing, locale, error handling, or concurrency semantics. Fix or gate as behavior-changing.
- **Cache illusion:** Benchmark measures warm cache only while real workload is cold or mixed. Measure both where relevant.
- **Cold-path churn:** Change targets code irrelevant to the metric. Reject or reframe.
- **Concurrency hazard:** Cache, pooling, or shared state creates race, leak, deadlock, or stale read. Validate with tests or analysis.
- **Debug build measurement:** Debug/dev mode hides production behavior. Use production-like build settings.
- **JIT/warmup confusion:** Warmup and measured iterations are mixed. Separate them.
- **Moved cost:** Change reduces CPU but increases memory, I/O, latency tail, or downstream load. Report tradeoff.
- **No baseline:** Performance claim has no before measurement. Create baseline or label claim unverified.
- **No-change verdict:** Benchmark does not improve. Do not claim success; revert or keep only for explicitly named non-performance reasons.
- **One-shot timing:** A single wall-clock run is noisy. Repeat or downgrade confidence.
- **Overfitting:** Optimization only helps the benchmark input. Test edge sizes and representative input ranges.
- **Security regression:** Optimization removes constant-time behavior, validation, escaping, auth checks, or safe parsing. Reject unless explicitly accepted and separately reviewed.
- **Temporary junk:** Profiler output or generated benchmark files remain after use. Remove them or report why retained.
- **Test gap:** Hot path lacks coverage. Add focused tests when feasible or state residual risk.
- **Unrepresentative workload:** Benchmark inputs do not match the real target. Report and rebuild the workload.
- **Validator unavailable:** Required profiler or benchmark tool is missing. Use next-best evidence and report the gap.
- **Wrong bottleneck:** User-suspected function is not hot. Surface evidence and optimize the measured hot path or stop.

## Examples

### Asymptotic Fix

Replace repeated linear lookup inside a loop with a precomputed map only after proving key uniqueness, preserving duplicate behavior if duplicates matter, adding or running tests for edge cases, and measuring or explaining the complexity improvement.

### Allocation Fix

Reduce per-request allocations by reusing buffers or streaming output only after checking concurrency safety, maximum retained memory, error handling, and before/after allocation metrics.

### Async Fix

Replace blocking disk or CPU work inside an async request path with async I/O, worker offload, or batching only after measuring event-loop delay and preserving cancellation/error semantics.

### No-Change Result

If the benchmark shows no meaningful improvement, say so. Keep the code change only when the user explicitly values another benefit such as clarity and the change does not harm behavior.

## Source Refresh

Use the listed authorities as starting points. During real optimization work, refresh the source that controls the target runtime, profiler, or benchmark framework.

- Claude Code skills documentation, `https://code.claude.com/docs/en/skills`.
- Python `profile` and `cProfile`, `https://docs.python.org/3/library/profile.html`.
- Python `timeit`, `https://docs.python.org/3/library/timeit.html`.
- Go diagnostics and profiling, `https://go.dev/doc/diagnostics`.
- Go `runtime/pprof`, `https://pkg.go.dev/runtime/pprof`.
- Node.js profiling guide, `https://nodejs.org/en/docs/guides/simple-profiling/`.
- OpenJDK JMH, `https://openjdk.org/projects/code-tools/jmh`.
- BenchmarkDotNet documentation, `https://benchmarkdotnet.org/articles/guides/getting-started.html`.
- Google Benchmark, `https://github.com/google/benchmark`.
- Criterion.rs documentation, `https://docs.rs/criterion/latest/criterion/`.
- Linux `perf`, `https://man7.org/linux/man-pages/man1/perf.1.html`.
- Brendan Gregg performance methodology, `https://www.brendangregg.com/methodology.html`.
