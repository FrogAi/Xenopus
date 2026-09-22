---
name: engineer-production-changes
description: The engineering method for all software work. Understand the system before changing it, fix causes where they originate, build the smallest complete design, sweep everything the change touches, prove it on the real path, measure efficiency on the hardware the code runs on and report honestly. Use for any software-engineering task, from planning, diagnosis and design through implementation, review, refactoring, optimization, security and testing.
---

# Engineer Production Changes

This is a method for producing changes that are correct, minimal and easy to read. It describes how to think at each stage and why. Scale it to the change: a one-line fix needs a moment at each stage, not a ceremony. The global instructions set the limits on what to build; this method is how to meet them.

## Why minimal matters

Everything a change adds is permanent: every branch, check, fallback, option, helper, layer, piece of state, test and comment has to be read, kept working and reasoned around by whoever comes next. Code written for situations that never happen still carries all of that cost, and it hides real behavior. A guard that quietly substitutes a default turns a bug into wrong output; a fallback path is a second system nobody exercises. So the burden of proof sits on adding, not on removing. "It might help" and "it's cheap" are not reasons. A concrete need in the actual system is.

Minimal means fewer concepts, not fewer lines. Compressing the same design into denser code makes it harder to read without making it simpler.

## 1. Understand the system first

- Read the whole unit you are changing, not only the lines in question, then trace how it is used: every consumer, including dynamic access (names built at runtime, lookups by string), serialized payloads, other processes and the UI. Trace producers and lifecycle as well: who creates the data, when it changes, where it is stored, which defaults and persisted state apply, and how failures behave today.
- Learn where and how often the code runs: which device and process, whether it runs every cycle of a loop, per event or once, what else shares that CPU and memory, and what time or memory budget it must fit in. Efficiency is judged against that context.
- Find the intent behind existing code before judging it: the user's statements, UI text and documentation (users rely on them, so they are contracts), upstream or original implementations, earlier versions, and the history of the specific lines.
- Settle factual questions mechanically, by searching, running the code or writing a small script, before forming opinions. Facts gathered this way decide most design questions outright.
- Look for mechanisms that already own what you need: an existing flag, parameter, constant, computed value, signal, helper, wrapper or pattern. Much overbuilding is new state or policy that duplicates something the system already has. Before writing a literal value, such as a limit, threshold, delay, list, ID or key, or importing a library directly, search the codebase, its upstream and its dependencies for an existing definition, published value or wrapper, and use it; a copied value goes stale when its source changes. When nothing defines a new tunable value yet, give it a named constant, in the project's variables or settings file when it keeps such values there.

Many defects, and much unnecessary code, come from not knowing how the pieces connect.

## 2. Define the contract

Before designing, establish in your working notes:

- the required behavior and the component that owns it;
- the ordinary inputs and conditions the requested use actually meets, found by tracing real callers, data sources and runtime states. Handling these is part of working correctly;
- the constraints that genuinely apply, such as safety, compatibility, performance, security and style;
- explicit non-goals: situations you will deliberately not handle because nothing shows they occur;
- the evidence that will show the work is done.

Hold the contract fixed; only the user or new evidence about the real need changes it. Anything outside it is a non-goal until evidence arrives.

Deliver the stage that was asked for: a diagnosis gives the cause and its evidence, a review gives findings, a plan gives a plan, an implementation gives the change. Investigate as widely as understanding requires, and change only what the contract requires.

## 3. Diagnose before fixing

- A defect needs a concrete scenario: these inputs and this state produce this wrong, observable result, judged against the right contract (the user's intent, the UI text or documentation, upstream behavior, declared defaults). If you cannot write the scenario, the defect is not established.
- Reproduce it when practical, with inputs drawn from what actually happens, and measure the wrong result so you can show it is gone afterwards. Choose evidence that distinguishes between possible causes; a test that encodes your hypothesis does not test it. When the cause is still unclear, gather more evidence rather than shipping a speculative change. Shrink a large trigger to the smallest input that still fails, and when a regression appeared between a known good and bad version, bisect (`git bisect`, or halving the change set) instead of reasoning across the whole range.
- Find the violated invariant and the component responsible for it, and fix the cause there. If you can only mitigate, say that it is a mitigation.
- Classify each finding: a defect; dead or redundant code; a simplification with identical behavior; a decision for the user, such as a product default or removing a feature; or an intentional placeholder for unfinished work, which stays. Before calling something a bug, check whether it only looks wrong: trace whether the suspicious path is reachable, gated or already handled elsewhere.

## 4. Design the smallest complete solution

- Derive the simplest design that satisfies the contract at the owning component before writing code or recommending a design, then compare what you are about to build or propose against it. Count size in concepts: new state, branches, types, files, dependencies and special cases.
- Prefer the design that makes existing code unnecessary, then delete that code. Reuse existing mechanisms when their meaning, lifecycle and failure behavior match, rather than building a parallel version.
- Put each decision in the component that owns the state or policy it depends on, and pass that component narrow inputs instead of moving the decision into its callers.
- Every element earns its place. For each branch, check, exception handler, retry, fallback, option, flag, configuration value, helper, abstraction, cache, log line, type annotation, comment or test, name its admission ground from the global quality rules (it was asked for; the requested use cannot work at all without it; the project's existing checks cannot pass without it; an actual failure in the requested use shows it is needed) and the evidence for that ground. A scenario you constructed, a synthetic reproduction, general best practice and negligible cost show that something is possible or harmless, not that it is needed. Delete each element in your head: if no real scenario in the contract breaks, it goes.
- Defenses belong where untrusted data enters: user input, external services, vendor feeds, the network, files written by older versions. Validate there, once, against what that source actually does. Inside trusted code, trace a value to its producer and read the producer's contract; if the producer guarantees the property, a check for it is dead code. Let violations of internal guarantees fail visibly through the language's default errors. A handler belongs only where some owner can act on the failure, never merely to reword it or to continue as if it succeeded.
- In safety-critical code, the safety requirements the system's design establishes, such as actuator limits, fail-safe behavior when inputs are lost or invalid, and the project's safety model, are part of the contract. They are needed because the failure they prevent must never happen, not because it has been observed. Preserve them, and meet them in new code; a missing one is a defect, not a simplification. This covers the safety requirements the system's design establishes, not every check that could be argued to make something safer.
- Build for the needs that exist. Configurability, extension points, generality and compatibility with callers that do not exist are added when a real need appears; adding them then costs less than carrying speculative structure until then.
- Preserve every intended behavior the change could disturb: modes such as debug or diagnostics, live updates, and behavior for configurations the change does not target.
- Efficiency is part of the design. In code that runs often or on a constrained device, avoid work that does not need to happen, and prefer optimizations that remove work over ones that add machinery. An optimization that adds state, such as a cache, earns its place with a measured gain on the target hardware like any other element. Read [efficiency.md](references/efficiency.md) for how to find waste and measure it.
- If the design keeps growing, stop and re-derive it. Growth usually means the owner or the contract is wrong, not that more machinery is needed.
- When asked whether something is needed, answer with the concrete failure it prevents in the real system. If there is none, it is not needed.

## 5. Implement in thin, verifiable pieces

Build one observable behavior at a time, getting the thinnest end-to-end path working before filling in layers. Read [implementation-and-style.md](references/implementation-and-style.md) before writing code; it covers matching the local style, the default style, building in pieces and requested rewrites. For interface text and layout, read [ui-content.md](references/ui-content.md). Leave none of your own dead, debug, placeholder or unrelated code behind.

## 6. Sweep the ripple

After each change, check four directions before calling it done:

1. **Consumers:** everything that reads what you changed, including dynamic and serialized access, still works with the new behavior or shape.
2. **Code the change made dead or redundant:** helpers, branches, parameters, imports, flags and workarounds for the problem you just fixed. Delete it.
3. **Siblings:** the same defect pattern elsewhere. Search for it.
4. **Anything the change made wrong:** descriptions, documentation, UI text, defaults, signatures and related configuration.

What your change breaks or leaves dead is part of the change. Pre-existing problems found elsewhere are reported in one line with their concrete consequence when they are likely to cause real trouble, or fixed where the user has asked you to fix what you notice.

## 7. Verify and review

Prove the change with the narrowest checks that could show it is wrong, on the real path; read [verification.md](references/verification.md), and for anything a user sees or uses, [interface-qa.md](references/interface-qa.md). When the change touches code that runs often or on a constrained device, measure its cost on the hardware it runs on, as [efficiency.md](references/efficiency.md) describes. When a missed mistake would be costly, such as code going to production, obtain the final simplicity review before presenting the work as complete: an independent review of the integrated result, described in [final-review.md](references/final-review.md). [runtime.md](references/runtime.md) covers how this tool runs delegated and independent work.

Treat review findings as evidence to check, not as instructions. Confirm each against the code yourself. A finding that something is missing is a proposed addition and passes the same admission test as your own additions.

## 8. Finish and report

Restore any environment you changed, remove the scratch artifacts you created, and keep the evidence the result depends on. Report briefly:

- what changed and the cause it addresses;
- what you kept on purpose, and why;
- what was verified, and how;
- what was not verified;
- any decision the user needs to make, with your recommendation.

Judge code, including your own earlier work, by present evidence of its behavior and cost, regardless of who wrote it or when.
