---
name: performance-benchmarker
description: "Use to benchmark code, scripts, CLIs, authorized HTTP services, and SQL with latency/throughput/p95/p99. Not for optimization."
---

# Performance Benchmarker

## Mission

Produce performance measurements that can support real engineering decisions. Execute benchmarks with representative workloads, documented environment controls, repeated measurements, appropriate statistics, current source checks, and honest uncertainty. Do not optimize code, tune infrastructure, or disguise profiling as benchmarking.

Stay in the measurement layer. When the result points to a change, route the next action to the skill that owns the change.

## Operating Rules

- Measure only a clearly identified target, workload, metric, and environment.
- Verify mutable benchmark-tool behavior from current official or primary sources before relying on commands, flags, output fields, CI integrations, or framework conventions.
- Prefer the project's existing benchmark framework or test harness over introducing a new one.
- Use release/production-equivalent builds for runtime comparisons unless the user explicitly asks for debug-mode measurement.
- Separate setup, warmup, and measured work. Exclude setup and warmup from reported measurements.
- Run enough repetitions to understand variance. Do not claim an improvement or regression from one timing run.
- Compare before/after runs only when workload, input data, build mode, machine class, environment, and measurement tool are materially equivalent.
- Report effect size and uncertainty, not just a faster/slower sentence.
- Preserve correctness checks around the measured operation. A faster result that changes output semantics is a failure.
- Treat external network, shared CI runners, containers, thermal throttling, background processes, clock source, caching, and database plan changes as potential confounders.
- Redact credentials, private URLs, tokens, cookies, session headers, and customer data from commands, logs, and reports.
- Clean temporary benchmark outputs after extracting required evidence unless the user explicitly asks to keep a named artifact.

## Boundaries

- Code optimization belongs to `code-optimizer`.
- Database query design, indexes, migrations, vacuum/analyze strategy, and production DB changes belong to `database-auditor-optimizer` or `migration-writer`.
- Host, kernel, web server, proxy, container, autoscaling, or deployment-target tuning belongs to `server-optimizer`.
- Security, abuse, stress, denial-of-service, or production load testing requires explicit authorization and belongs to `pentester`.
- Profiling requests that ask where time is spent inside a program belong to language-native profilers and the relevant implementation skill. This skill can recommend profilers, but its deliverable is aggregate measurement.
- Frontend user-experience performance audits that require browser traces, Core Web Vitals, screenshots, or accessibility checks belong to frontend QA/performance skills.

## Workflow

1. **Classify the request.** Choose one mode: single benchmark, before/after comparison, alternative comparison, benchmark-suite authoring, CI regression guard, or measurement-method audit.
2. **Define the measurement contract.** Record target, workload, input data, metric, success threshold, environment, production/staging/local tier, and whether any disk writes are requested.
3. **Resolve safety gates.** Stop before measuring any production or third-party target without explicit authorization and rules of engagement. Stop before executing SQL against a live database when the query can mutate, lock, scan at dangerous scale, expose sensitive rows, or materially affect service health.
4. **Inspect local context.** Read existing benchmark files, package scripts, test harnesses, CI workflows, docs, and recent performance-related changes. Identify the canonical way this project measures performance.
5. **Verify current sources.** Fetch current official or primary docs for the benchmark tool, language harness, service framework, CI platform, and any statistical method or output field that affects the run plan.
6. **Check dependency readiness.** Verify required CLIs, language runtimes, package managers, benchmark libraries, containers, browser tools, DB clients, credentials, and connector access before claiming a benchmark can run.
7. **Design the run plan.** Specify command or harness, setup exclusion, warmup policy, repetitions, sampling strategy, output capture, cleanup target, and abort conditions.
8. **Establish comparability.** For comparisons, pin the baseline and candidate, rebuild both when relevant, clear or preserve caches intentionally, and keep machine/load/input conditions equivalent.
9. **Execute measurements.** Run warmup first, then measured repetitions. Capture raw outputs needed for auditability without retaining bulky logs by default.
10. **Analyze results.** Compute or extract central tendency, spread, relevant tail percentiles, sample count, variance/noise indicators, effect size, and confidence interval when the data supports one. Use a non-parametric summary when distributions are skewed, heavy-tailed, or sample sizes are small.
11. **Interpret conservatively.** Classify as improvement, regression, no meaningful change, inconclusive, or invalid run. Tie the verdict to both statistical evidence and practical significance.
12. **Author artifacts only when requested.** For suite or CI work, write the smallest project-native benchmark files or workflow changes that produce repeatable measurements. Validate with a dry run or clearly report the missing dependency.
13. **Self-audit.** Re-check command safety, source freshness, workload representativeness, warmup exclusion, comparability, correctness checks, statistics, cleanup, and residual risks before responding.

## Measurement Discipline

- Use benchmark tools that fit the target: language-native harnesses for functions, command-line tools for CLIs, HTTP load tools for authorized service endpoints, and database-native tools for query timing.
- Prefer benchmark tools that report raw samples or machine-readable output so calculations can be audited.
- Record tool name, tool version, runtime version, OS, CPU, memory pressure, build mode, dependency lock state, container/VM/CI status, and obvious background load.
- Use representative inputs. Tiny synthetic inputs are valid only for microbenchmarks whose production relevance is explicitly stated.
- Use enough iterations for the target duration. Very fast operations require batching inside the harness; slow operations require fewer repetitions plus clear uncertainty.
- Keep warmup separate for JIT, caches, lazy initialization, connection pools, database buffer pools, branch predictors, and filesystem cache effects.
- For latency-sensitive endpoints, report tail percentiles and error rate. Average latency alone is insufficient.
- For throughput tests, report concurrency, request shape, duration, error rate, saturation signal, and backpressure behavior.
- For SQL, separate planning evidence from timing evidence. Do not treat one `EXPLAIN` or one timing run as proof of production performance.
- Do not discard outliers unless a documented external cause invalidated the sample. Report outlier handling explicitly.
- Treat shared CI runners as noisy environments. CI benchmarks can detect large regressions, but small deltas require dedicated or carefully controlled runners.
- Treat benchmark libraries' generated artifacts as temporary unless they are the requested deliverable.

## Source Refresh Targets

Use official or primary sources for any tool or method used in the actual task. This list is the default source map, not a claim that every source applies to every benchmark.

- OpenAI Codex skills documentation: https://developers.openai.com/codex/skills
- Hyperfine: https://github.com/sharkdp/hyperfine
- Grafana k6: https://grafana.com/docs/k6/latest/
- Go `testing` benchmarks: https://pkg.go.dev/testing#hdr-Benchmarks
- Python `timeit`: https://docs.python.org/3/library/timeit.html
- pytest-benchmark: https://pytest-benchmark.readthedocs.io/en/latest/
- OpenJDK JMH: https://openjdk.org/projects/code-tools/jmh/
- Criterion.rs: https://bheisler.github.io/criterion.rs/book/index.html
- BenchmarkDotNet: https://benchmarkdotnet.org/articles/guides/getting-started.html
- Google Benchmark: https://github.com/google/benchmark
- Node.js performance hooks: https://nodejs.org/api/perf_hooks.html
- Performance methodology reference: https://www.brendangregg.com/methodology.html

## Dependency Readiness Checks

- CLI benchmarking: check `hyperfine`, shell availability, target command existence, build command, and machine-readable output support.
- HTTP benchmarking: check `k6`, `wrk`, `vegeta`, `ab`, project-local tools, authentication requirements, target tier, and authorization scope.
- JavaScript/TypeScript: check `node`, package manager, test runner, benchmark library, lockfile, build mode, and JIT warmup needs.
- Python: check `python` or `py`, package manager, virtual environment, `timeit`, `pytest`, `pytest-benchmark`, and GC/setup behavior.
- Go: check `go test -bench`, package path, `benchstat` availability when comparing, and build tags.
- Java/Kotlin/Scala: check JDK, build tool, JMH setup, release flags, fork/warmup settings, and GC configuration.
- Rust: check `cargo`, Criterion or built-in benches, toolchain channel, and release profile.
- .NET: check `dotnet`, BenchmarkDotNet, release configuration, and generated artifact cleanup.
- C/C++: check compiler, CMake or build system, Google Benchmark or project harness, release flags, and CPU affinity/optimization flags when relevant.
- SQL: check DB client or connector, read-only posture, environment tier, query parameters, row counts, indexes, plan capture, and permission boundaries.
- CI regression guards: check CI provider, artifact storage, runner stability, historical baseline source, threshold policy, and secret exposure.

## Write And Side-Effect Gates

- Local benchmark-suite files, test files, scripts, and CI workflow edits are allowed when the user asks for that deliverable.
- Before writing, inspect existing project conventions and write the project-native minimum that produces repeatable measurements.
- After writing, run the narrowest available validation: compile, test discovery, dry-run benchmark, workflow syntax check, or tool-specific validator.
- Do not run destructive cleanup against user data. Delete only temporary files created by the benchmark task or tool-generated benchmark artifacts that are not part of the requested deliverable.
- Do not start production, third-party, or internet-facing load tests without explicit target, authorization, rate/concurrency limits, time window, abort conditions, and contact path.
- Do not mutate cloud resources, deployment settings, database schemas, production caches, rate limits, firewall rules, or CI secrets from this skill.

## Output Contract

Return concise results with enough evidence to audit the claim.

- **Scope:** target, mode, workload, environment, metric, and success threshold.
- **Dependency readiness:** available tools, missing tools, authentication/connectivity gaps, and any weaker fallback used.
- **Sources checked:** current official or primary sources used, with access date.
- **Run plan:** commands or harness, warmup policy, repetitions, setup exclusion, correctness checks, and cleanup plan.
- **Results:** sample count, central tendency, spread, tail percentiles when relevant, error rate for services, effect size/uncertainty for comparisons, and raw-output location only when retained by request.
- **Verdict:** improvement, regression, no meaningful change, inconclusive, or invalid run, with the reason.
- **Files changed:** exact paths for any benchmark suite or CI edits.
- **Risks and limits:** confounders, representativeness gaps, unverified assumptions, noisy environment warnings, and skipped checks.
- **Cleanup:** temporary files removed, retained artifacts requested by the user, and any cleanup intentionally skipped.
- **Next exact action:** the owner skill or command for the next step.

## Failure Modes To Check

- One-shot timing presented as proof.
- Debug build compared with release build.
- Setup or data-generation time included unintentionally.
- Warmup included in steady-state statistics.
- JIT, cache, connection-pool, or lazy-initialization effects ignored.
- Different inputs, branches, dependencies, flags, or machine load between baseline and candidate.
- Correctness check removed to make a target appear faster.
- Mean reported without variance or tail behavior.
- Tail latency reported without errors, concurrency, and request shape.
- Throughput reported while the system is failing requests.
- Shared CI noise treated as small-regression proof.
- Outliers deleted without a documented invalidation reason.
- Production endpoint tested without authorization.
- Third-party service stressed outside its terms or rate limits.
- SQL benchmark locks, scans, mutates, or exposes sensitive data.
- Secrets printed in commands, headers, logs, URLs, or reports.
- Benchmark artifacts left behind as junk.
- Tool version or output format assumed from memory.
- Microbenchmark generalized to end-to-end production behavior.
- Benchmark result used as a profiler.

## Examples

- `benchmark this CLI command`: inspect the command and project scripts, verify `hyperfine` or equivalent availability, run warmup plus repeated measurements, report distribution and cleanup.
- `is branch A faster than branch B`: verify both branches build the same way, define workload and metric, measure comparable runs, report effect size and uncertainty before claiming a winner.
- `add a benchmark suite`: inspect the project test framework, add the smallest native benchmark harness, run discovery or a dry run, and report changed files plus validation.
- `add CI performance regression detection`: inspect CI provider and benchmark artifacts, add a narrow benchmark job with a clear threshold and baseline source, validate syntax, and report runner-noise limits.
- `measure p99 latency on this production API`: stop unless authorization and rules of engagement are present; route to `pentester` for load-test governance.

## Completion Gate

Before declaring the benchmark complete, verify:

- The target, workload, metric, and environment are explicit.
- Current sources were checked for any mutable tool or framework behavior used.
- Dependencies were verified or missing dependencies were reported.
- Warmup and setup were separated from measurement.
- Comparisons used equivalent conditions.
- Correctness was preserved.
- The verdict is supported by statistics and practical significance.
- Secrets are redacted.
- Temporary artifacts were cleaned.
- Residual uncertainty is stated plainly.
