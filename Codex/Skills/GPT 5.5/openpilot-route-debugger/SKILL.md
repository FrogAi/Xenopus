---
name: openpilot-route-debugger
description: "Use for openpilot/FrogPilot routes, logs, control/model/planning signals, calibration, telemetry, and route-backed code."
---

# Openpilot Route Debugger

## Mission

Debug and validate openpilot/FrogPilot behavior from source code plus real route evidence. Treat logged drive data as the deciding evidence for control-loop behavior.

Static checks, successful builds, and plausible math are not enough for route-affecting changes. Before claiming a route, control, tuning, telemetry, or deployment change is ready, verify it against the relevant logged data or state the missing coverage explicitly.

## Operating Rules

- Inspect the actual checkout before making openpilot/FrogPilot claims. Use local source files and commit state as primary evidence.
- Use full-rate logged data for control-loop claims when available. Treat qlog or sampled data as reduced coverage and state the limitation.
- Verify cereal schemas, event names, message fields, and coordinate frames from the current checkout and the current route. Do not carry assumptions across forks or versions.
- Derive constants from logged distributions, physical limits, current source code, or cited standards. Do not accept round numbers with no derivation.
- Design telemetry before or with feature logic. A feature that cannot be diagnosed from logs is not complete.
- Keep route analysis separate from deployment. Device writes, service restarts, build commands on a comma device, and safety-layer changes require explicit per-action authorization.
- Treat steering, braking, acceleration, CAN messaging, panda safety, calibration, and driver-facing behavior as high risk.
- Treat route IDs, dongle IDs, device paths, VINs, usernames, precise locations, camera frames, and raw log extracts as sensitive. Report only the minimum identifier needed for user-owned debugging, redact secret-like values, and do not upload logs or screenshots to external services unless the user explicitly authorizes that exact transfer.
- Do not disable safety clips, limits, watchdogs, or validation checks to make a result pass.
- Clean temporary replay scripts, extracted logs, plots, and scratch outputs unless the user asks to keep them.

## Modes

- Deployment prep: produce a guarded device/build/deploy validation plan without executing device mutations unless explicitly authorized.
- Forensic: explain a route symptom, disengagement, bad model/control behavior, or user-reported regression.
- Telemetry design: define the data needed to diagnose a feature from future logs.
- Tuning: derive thresholds, constants, gains, or gates from logged distributions.
- Validation: prove a proposed code change or feature behaves correctly on route data before deploy or release.

## Workflow

1. **Plan the work.** Maintain an explicit plan/checklist for any route analysis, control change, tuning, telemetry, or deploy-prep task.

2. **Classify mode and risk.** Identify Forensic, Validation, Tuning, Telemetry design, Deployment prep, or a combination. Mark steering, longitudinal, panda, CAN, calibration, and driver-facing work as high risk.

3. **Resolve inputs.** Capture route ID or log path, checkout path, fork, branch/commit, target vehicle if known, symptom, target behavior, files under change, deploy target, and whether device access is authorized.

4. **Verify dependencies.** Check required local pieces before claiming coverage:
   - openpilot/FrogPilot checkout
   - route files or device path
   - Python environment and repo scripts
   - cereal/capnp/zstd support
   - plotting or tabular tools when distributions matter
   - SSH/scp/rsync only when device work is requested
   - build tooling such as scons only when build validation is requested

5. **Inspect source of truth.** Read the relevant current files from the checkout, commonly:
   - `cereal/log.capnp`
   - `cereal/custom.capnp`
   - `cereal/services.py`
   - `selfdrive/modeld/*`
   - `selfdrive/controls/*`
   - `frogpilot/*`
   - vehicle/interface code and panda safety code when touched

6. **Inspect route evidence.** Locate the segments and logs. Prefer `rlog.zst` for high-rate control and model evidence. Use `qlog.zst` only when the needed events and frequency are sufficient. Record route, segment count, event counts, time range, and missing segments.

7. **Build hypotheses.** For debugging work, produce at least three competing causes before selecting one. Tie each hypothesis to source evidence, log evidence, and disconfirming checks.

8. **Trace the signal path.** Follow the value from sensor/model event through planners, controllers, actuators, telemetry, and UI. Identify the first layer where expected state becomes wrong or unobservable.

9. **Verify coordinate frames and signs empirically.** For geometry, lanes, position, yaw, curvature, steering, or lateral offsets, verify signs from a real frame and current source code. Check worst-case frames, not only median frames.

10. **Measure distributions.** For tuning and validation, compute counts, percentiles, extrema, activation rates, clip rates, disagreement rates, skipped-frame reasons, and route coverage. State sample size and route diversity.

11. **Check magnitude and safety bounds.** Compare proposed outputs against current source limits, physical constraints, actuator ranges, comfort/safety limits, and observed production distributions. Treat bound violations as blockers.

12. **Implement only when requested.** If the user asks for a code fix, edit the smallest source-of-truth files. Keep replay harnesses and telemetry additions narrow. Do not edit generated files unless the repo workflow requires it and validation confirms it.

13. **Validate changes.** Use the strongest available checks:
    - focused unit or repo tests
    - static checks or build commands
    - replay against logged routes
    - worst-frame sign check
    - magnitude/distribution check
    - telemetry presence check
    - no-regression comparison against baseline logs
    - build/deploy dry run when requested and safe

14. **Gate device actions.** Before any on-device mutation, present exact target, command, files, risk, expected result, validation, and recovery path. Execute only after explicit authorization for that action.

15. **Audit before delivery.** Confirm:
    - route/log evidence backs the conclusion
    - no "ready" claim rests only on static checks
    - signs and coordinate frames were verified or marked uncovered
    - constants have derivation
    - telemetry supports future diagnosis
    - sensitive route, device, location, image, and credential-like data was minimized and redacted
    - high-risk changes name residual risks
    - temporary artifacts are cleaned

16. **Deliver.** Report mode, route/source evidence, findings, root cause or validation result, commands run, files changed, replay coverage, unresolved risks, deployment gate status, and next owner.

## Stop Conditions

Stop and ask or report a blocker when any condition applies:

- A coordinate-frame/sign conclusion lacks a real-frame check.
- A high-risk claim depends on qlog-only or partial logs.
- A tuning constant lacks enough route diversity to generalize.
- Checkout path, route path, fork, target branch, or target vehicle is materially ambiguous.
- No route/log data is available for a route-dependent claim.
- Required cereal/zstd/capnp parsing support is missing and no alternate parser is available.
- The requested change requires disabling safety limits, clips, watchdogs, or validation checks.
- The user asks to deploy, restart services, build on device, modify panda safety, or touch CAN/safety code without explicit per-action authorization.

## Severity Rubric

- Critical: safety-layer change, steering/braking/acceleration sign error, disabled safety bound, incorrect CAN/panda behavior, route evidence contradicts a ready claim, or unapproved device mutation.
- High: control change without real-data replay, stale cereal/schema assumption, missing telemetry for a new control feature, qlog-only validation for high-rate behavior, or constant tuned from too little data.
- Medium: incomplete route coverage, weak hypothesis testing, missing worst-frame check, unclear source-to-log trace, or validation without baseline comparison.
- Low: cleanup, documentation, plotting, naming, or non-critical telemetry polish.

## Output Contract

Every completed response includes:

- Mode and risk class.
- Checkout, branch/commit when available, route/log paths, and files inspected.
- Current source evidence and route evidence used.
- Hypotheses and verdict for forensic work.
- Measurements, distributions, signs, bounds, and coverage for validation/tuning.
- Files changed and validation commands when edits occurred.
- Device/deploy actions requested, authorized, executed, or blocked.
- Residual risks, missing data, and route-diversity limits.
- Privacy handling for route identifiers, device identifiers, logs, locations, and images.
- Cleanup confirmation.

Do not say a route-affecting change is ready unless replay/log validation supports that claim. If validation is partial, say exactly what remains unverified.

## Examples

### Route regression

User reports bad steering on a route. Locate route logs, count relevant events, inspect model/control events, build hypotheses, trace the first bad signal, verify signs from worst-case frames, and report root cause plus validation gaps.

### Constant tuning

User asks for a threshold. Extract the relevant event values across routes, compute percentiles and activation rates, compare against source limits, choose a value with derivation, and state route-specific limits.

### Telemetry design

User plans a new FrogPilot feature. Identify every gate, raw value, clipped value, skip reason, and output needed for future replay. Propose schema fields and publisher/consumer paths before implementation.

### Deploy gate

User asks to deploy. Present exact device commands, files, expected result, validation, and recovery path. Wait for explicit authorization before touching the device.

## Source Ledger

- OpenAI Codex skills documentation, `https://developers.openai.com/codex/skills`. Used for this skill's Codex routing, frontmatter, and sidecar behavior.
- commaai openpilot source repository, `https://github.com/commaai/openpilot`. Use the user's target checkout as the source of truth for code, cereal schemas, log semantics, and route tooling during each invocation.
- FrogPilot source repository, `https://github.com/FrogAi/FrogPilot`. Use the user's target fork checkout as the source of truth for fork-specific behavior during each invocation.
- FrogPilot public wiki, `https://www.frogpilot.com/wiki`. Use only as supporting user-facing documentation; local source and logs outrank it for implementation or validation claims.
