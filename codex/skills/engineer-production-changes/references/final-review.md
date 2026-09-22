# Final simplicity review

Read when preparing or performing the independent review of an integrated result, and when acting on its findings.

An author judges a design against the assumptions that produced it, so unneeded elements look necessary from the inside. A reviewer with no part in the work, who derives the design independently, can see them.

## Brief

Give the reviewer:

- the contract: required behavior, owning component, the ordinary inputs and conditions it must handle, constraints and non-goals;
- the stable candidate: the diff against its baseline revision, with access to the full files and the repository;
- the evidence the design rests on: reproductions, measurements, check results, and the facts about producers and consumers;
- examples of the local style when style is in question.

Leave out why you built it this way, what you considered and rejected, and any expected verdict. Keep the candidate unchanged while it is reviewed.

## Review method

1. From the contract and the surrounding code, derive the simplest complete design at the owning component before studying the candidate.
2. Compare the candidate with that design end to end, including structure it inherits within the change's scope. Each element beyond the derived design needs an admission ground (it was asked for; the requested use cannot work at all without it; the project's existing checks cannot pass without it; an actual failure in the requested use shows it is needed) and evidence for it. Constructed scenarios, synthetic reproductions, best practice and negligible cost do not qualify; nor do passing tests, prior effort or the fact that it works. Safety requirements the system's design establishes are part of the contract and need no observed failure.
3. For each defensive element, such as a check, guard, handler, fallback, retry or timeout, trace the value it protects to its producer. Is the condition reachable from real inputs and lifecycle? Is it already handled elsewhere? Does it hide a failure that should surface? A safety requirement the system's design establishes stays even when its condition has never been observed. For a defensive element the candidate removes, read the commit or discussion that added it (`git log -S`, blame) before judging it unnecessary.
4. Look for duplicated ownership: new state, flags, timers, computations or copied literal values the system already provides.
5. In code that runs often or on a constrained device, look for avoidable work, such as repeated computation, scans, and per-cycle work whose inputs change only on events, and for optimizations that add state or machinery without a measured gain on the target hardware.
6. Check correctness against the contract with real inputs: the reported problem is gone, consumers still work, and nothing the change made dead or wrong remains. Diff the test and check files against the baseline: every changed or deleted assertion needs an asked-for behavior change, and the candidate must not special-case test names, fixtures or expected values.
7. Check readability against the local style: plain constructs, descriptive names, no compression, such as a statement on the same line as its `if` or loop condition a long chain of calls that named steps would make plain, or a long stretch of code with no blank lines between its steps.
8. Keep what is needed: required behavior, safeguards with evidence behind them, and useful fixes. Fewer lines, denser formatting and indiscriminate reverts are not simplifications. A clean result is a valid outcome; findings and requirements are not invented to fill the report.

## Findings

For each finding give the location; what is unnecessary or wrong; the concrete scenario, or the missing evidence; the simpler alternative or fix; what the alternative must preserve; and how to verify it. Keep established defects, unnecessary elements and open questions that lack evidence either way distinct.

## Acting on the findings

Confirm each finding against the code yourself. Apply supported fixes and simplifications, and reject a finding only with specific counterevidence. A finding that proposes adding something is a proposed addition and needs an admission ground like any other. After changing the candidate, rerun the checks the changes could invalidate.
