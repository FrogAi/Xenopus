---
name: implement-frontend-designs
description: Implement an approved frontend mockup, prototype or explicitly prescribed visual reference in a real project with exact visual and interaction fidelity. Use to turn a settled design into working product code or correct drift against it. Do not use for open-ended design exploration.
---

# Implement Frontend Designs

Make the approved design real without redesigning it. Treat pixel-perfect reproduction as an acceptance requirement, backed by controlled reference comparisons and working product behavior. Approval settles the visual decisions; it does not invite stylistic improvements or a merely similar result.

Use the `engineer-production-changes` skill for implementation, integration, security, code simplicity and test retention. This skill owns fidelity to the accepted reference. Use the `coordinate-specialists` skill for substantive parallel work and a fresh independent final audit.

## Establish the exact target

Recover the approved version, requested refinements, affected routes/components, responsive views and demonstrated states from current task evidence. Record a concise reference location/version and implementation scope. Preserve that reference independently of the implementation so later edits cannot move the target. A merged prototype handed over by the `explore-frontend-designs` skill already includes its agreed refinements; use its folder, unedited, as the preserved reference.

An explicit request to implement a particular reference establishes that target without another approval ceremony. A provisional preference such as "B is closer" alone does not. Accept references from outside the `explore-frontend-designs` skill; do not require a new exploration round or repeat its intake. If several versions could be meant, recover the intended one from context or ask the user which one before dependent work. A supplied list of approved changes modifies only those parts of the reference.

Inspect runnable mockup code, assets, styles and interactions when available; do not reconstruct them from a scaled gallery thumbnail. For screenshot-only references, establish their actual dimensions and represented state, inspect available assets and product context, and distinguish what is shown from what is unspecified. Ask the user about material gaps such as a missing mobile design or unknown action outcome; use established product conventions for nonmaterial unshown details without calling them approved facts. Continue independent work while required answers are pending.

Read [references/visual-fidelity.md](references/visual-fidelity.md) before preserving the reference or capturing comparisons. It owns baseline provenance, matched capture conditions, pixel/geometry checks, responsive/state coverage and difference adjudication.

## Preserve the design while integrating

Match the whole affected surface: layout, dimensions, spacing, alignment, typography and wrapping, colors, borders, radii, shadows, imagery/crops, icons, layering, responsive behavior, motion and visible interaction states. Preserve approved content and its fitting rules; do not rewrite copy, substitute assets/fonts or add elements to make implementation easier.

Prefer carrying over exact assets and compatible presentation code from a code-native mockup. Adapt its structure to the real project without changing the result; honor an explicit from-scratch implementation request when present. Use existing components only where they can reproduce the reference. Do not force the design into a library's defaults, add a parallel design system or build a permanent abstraction solely to transfer a mockup. A screenshot used as the page, inert controls or viewport-specific positioning that breaks responsive behavior is not a faithful implementation.

Map each in-scope control and state to actual navigation, data, validation, authorization, persistence and feedback. Inspect the product's existing contracts and connect the real path; do not ship prototype success messages or fixture responses as working integration. Sample values guide controlled comparisons, not hardcoded production data. Verify realistic data lengths and loading/error outcomes against the approved layout rules. Clarify a missing consequential behavior or backend scope instead of inventing it. Visual approval does not authorize unrelated backend work, publication or live external effects.

Satisfy fidelity and established accessibility, security and product requirements together at every approved width and state. First seek a solution preserving the appearance, such as semantic markup or invisible implementation changes. If an evidenced conflict still requires a visible deviation, ask the user before applying it, giving the exact conflict and the smallest change, unless already authorized. Do not turn that exception into a wider redesign or silently redefine the reference. Record accepted deviations separately.

## Verify and finish

Verify the integrated product, including shared styles and real data behavior, rather than a detached component or test-only imitation.

Correct every known implementation-caused visual deviation within the approved scope, including small ones; "close enough," passing functional tests or a high aggregate similarity score does not meet this contract. Do not change the reference, weaken checks or mask design content to produce a pass. If required fidelity cannot be verified or achieved, state the precise unresolved difference or evidence gap and keep the completion claim bounded.

Before final handoff, have a fresh independent reviewer inspect the preserved reference, final implementation and actual comparison/functional evidence. Review for visual drift, omitted widths or states, false baselines, simulated integration and needless complexity. Resolve supported findings and repeat affected checks. If independent review is unavailable, disclose the gap rather than presenting self-review as independent.

Finish only when the approved fidelity scope, real functional scope and applicable project checks are satisfied, with no known unaccepted discrepancy. Report the implemented reference, observed visual and functional checks, accepted exceptions and material limits concisely. A pixel-perfect claim applies only to the captured conditions and states actually established. Keep comparison captures and fidelity notes outside the product repository; comparison galleries, bridge servers, debug CSS and temporary fixtures do not belong in shipped product code.

## Improve this workflow

Proactively assess reference recovery, asset and presentation transfer, responsive/state parity, real integration and fidelity evidence during implementation, review and before handoff. Route reusable improvements, including useful first-use techniques and verified Claude Code/project capabilities, through the `improve-personal-customizations` skill; it owns admission, source repair, verification, installation and recovery. When a gap originates in prototype creation or handoff, repair its exploration owner rather than adding downstream workarounds. Verify affected reference-to-product checks before adopting a capability change. Preserve the accepted reference, evidence requirements and user-controlled checkpoints; workflow improvement does not authorize visible redesign or more product scope.
