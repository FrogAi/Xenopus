# Verification

Read when choosing how to prove a change and when reporting what was proven.

The aim is evidence sufficient for the claim you will make, not the cheapest or the most numerous checks. Choose each check by asking what would show the change is wrong. Size the effort to the change's risk: do bounded fixes and single-area audits directly, with the standard checks that show the result works, and add verifier agents, staged workflows or repeated reviews beyond the final simplicity review only where a missed defect is costly and such layers have caught real defects before. Stop once the checks that could show the change is wrong have passed; layers that don't change the result cost hours without adding quality.

## Before changing

- Run the existing checks that cover the area and note what already fails, so pre-existing failures are reported rather than attributed to the change or silently fixed.
- For a defect, reproduce it and record the wrong result. For a performance goal, measure the current behavior on a representative workload.

## Choosing checks

- Exercise the real path with real or representative inputs: the actual function, process, build or device the behavior runs on. A mock, or a test that restates the implementation, shows only that the code does what it says.
- When the system is built, deployed or run elsewhere, verify what actually runs there: the revision, binary and settings. A successful build or upload does not show the new behavior is active.
- Use the same measurement before and after, under comparable conditions.
- Check the check. It should show the defect without the fix, and comparing the old version with itself should show no difference. A check that cannot fail proves nothing. For new or changed behavior, also break the changed lines by hand a few ways (flip a comparison, shift a boundary constant, drop a branch) and confirm a check fails for each; a break no check notices is a gap to close or explain.
- When reading recorded or logged data, confirm the decoder matches the format version that produced it (field numbers, units, enums). A surprisingly uniform result, such as a field that is always zero, usually means a mismatched decoder rather than a finding.
- For a change meant to preserve behavior, such as a simplification, refactor or deletion of dead code, compare the old and new outputs across the conditions that matter, for example every combination of the settings involved. For a fix, also compare the old and new outputs on recorded or generated inputs; every difference must fall inside the defect's trigger condition. Where the contract states an invariant, such as a limit, a round trip or an ordering, check it on generated inputs as well as chosen examples.
- Check each piece as it lands, then check the integrated flow with checks sized to the change's reach. After a fix, rerun only what that fix could invalidate.
- When the defect or check depends on timing, threads, ordering, randomness or hardware, record how often it fails before the fix (k of n runs) and run it enough times afterwards for a remaining failure to show (about 3/p runs for a failure rate p); report the counts. An intermittent failure on the fixed code is a finding, not noise to retry away.

## Performance

Follow [efficiency.md](efficiency.md): measure on the hardware the code runs on, with the same method and a representative workload before and after, repeated enough to see the variance. Report an improvement only when it exceeds the noise; say so when the result is inconclusive.

## Interfaces

Check user-facing changes in the real render path, at the supported screen sizes and in the states that matter, with realistic content, and apply [interface-qa.md](interface-qa.md). Changing the order in which styles or themes are applied can change rendering even when the rules are unchanged (in Qt, a widget that sets its own style sheet after building its children renders differently once an ancestor already has one), so compare before and after on every screen the change can reach, not only the ones it targets.

## Temporary and permanent checks

Investigative scripts, fixtures, probes and benchmarks live outside the deliverable and are removed when the work is done, keeping any evidence the result depends on. Add a permanent test on an admission ground, as with any other addition. Change an existing test only when the behavior it checks was asked to change, or to follow a requested rename, move or signature change.

## Tests that change state

Before a test that alters persistent state, snapshot that state; afterwards, diff against the snapshot and restore it. Delete snapshots that contain credentials or personal data once they are no longer needed. A background job keeps running after whatever started it stops, including an agent that fails, so give it an exit trap that restores what it changed and keep its process ID so it can be stopped.

## Reporting

State what was verified and how, and what was not. A check covers only what it exercised; do not generalize it to conditions it did not reach. If a required check fails, the work is not done.
