# Efficiency

Read when code runs often (control and planning loops, per-message handlers, render and paint paths), runs on a resource-constrained device, or when the goal is speed or resource use.

Wasted work on a hot path is paid on every cycle, and on a device the CPU and memory it takes are shared with everything else running there. Guesses about where the time goes are usually wrong, so efficiency is decided by measurement, not by how the code looks. An optimization is also code: it earns its place like any other element, and most of the best ones make the code smaller.

## Know the cost context

- **How often it runs:** per frame of a loop, per message, per user action or once at startup. The same cost is negligible once and significant at 100 Hz.
- **The budget:** the loop's time budget and how close it already runs, the process's share of CPU, and the memory headroom on the device.
- **Where it runs:** measure on the hardware the code runs on. A desktop CPU differs from an embedded ARM system in architecture, clock speed, caches, core count and thermal behavior, so timings do not transfer, and even which of two versions is faster can flip. Local runs are fine for finding hotspots and comparing algorithms; numbers that decide whether code is efficient enough come from the target. The device's own skill or documentation covers how to measure there.

## Look for waste

When writing or reviewing code on a hot path, look for work that does not need to happen. Prefer fixes near the top of this list; each step down adds concepts and needs stronger evidence.

1. **Remove or skip work:** computations whose results are unused, repeated reads or conversions of the same value, conditions ordered so the cheapest or most decisive check runs first and short-circuits the rest, early returns, per-cycle work whose inputs change only on events.
2. **Move work:** hoist loop-invariant work out of loops, compute once at startup instead of per call, recompute when the input changes instead of every cycle.
3. **Choose cheaper operations:** a dict or set lookup instead of a scan, no quadratic patterns, no needless copies, allocations or serialization.
4. **Reuse what the system already computes:** read a value another component already publishes instead of deriving it again.
5. **Cache or memoize:** only with a measured gain, and only with a clear owner for invalidation. A cache is state that can go stale.
6. **Concurrency, native code or low-level tricks:** last, with strong measured justification.

The first three usually leave the code no larger, and often smaller.

## Measure, don't guess

- Profile or time the real code to find where the cost is before changing anything.
- Measure the quantity the change could affect: CPU time per call or cycle, the process's CPU use, loop time against its budget and missed deadlines, resident memory and its growth, allocations, I/O, or wakeups.
- Compare baseline and candidate with the same method, inputs and conditions on the target hardware. Control warmup, other load, thermal state and CPU frequency and core state. Repeat enough to see the variance, and report the median and spread.
- A microbenchmark isolates a function; when the result matters, confirm it in the real process under realistic load, where caches, contention and data differ.
- Confirm outputs are unchanged. An optimization that changes behavior is a behavior change.
- Keep an optimization only when its gain exceeds the noise and matters against the budget; otherwise keep the simpler code. Report before and after numbers, their spread, and where and how they were measured.

Code that runs rarely and does little, such as a settings action or one-time setup, needs sound design, not a benchmark. Scale the measurement to how often the code runs, how tight its budget is and how strong a claim you are making.
