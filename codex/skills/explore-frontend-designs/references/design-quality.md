# Frontend Design Quality

Judge alternatives against the product and current comparison question. An unusual aesthetic is not a defect merely because it is unfamiliar. For comparison-only supplied material, assess the available evidence, preserve the supplied set and report imbalances or missing responsive/interaction evidence. Do not reconstruct it or invent unseen states. The creation, interactive-preview and verification requirements below apply to mockups the task authorizes creating or preparing for interactive review, including refinements.

## Product fit and visual quality

Use the actual users, task sequence, domain, content and operating constraints. Preserve governing brand and design-system requirements while exploring their real degrees of freedom. Hierarchy should express what matters and what can be done, with coherent typography, spacing, color, imagery, shape and motion.

Use credible content, labels, values and data density. Separate supplied facts from creative assumptions; do not invent customers, outcomes or product capabilities. Avoid decorative metrics or placeholder copy that make an option persuasive without testing the real content.

Choose visual language deliberately. Generic heroes, interchangeable card grids, gradients, glass effects, rounded surfaces or animation are neither required nor forbidden styles. They need a coherent design purpose rather than serving as automatic decoration. Explore expressive and restrained directions as appropriate; do not replace a stock template with a universal sterile-minimalist template.

Require product fit, understandable hierarchy, coherent visual language, recognizable controls and states, realistic content fit, accessibility and feasible implementation in the target stack. State the actual tradeoff. Give competing options comparable polish; repair an agent-generated set when one dominates merely because the others are unfinished or implausible. Preserve a user-supplied set and report imbalances unless replacements are requested.

## Distinctness appropriate to the round

Each initial broad direction must differ meaningfully from the others on at least two structural axes and one visual-system axis within the brief's open decisions.

- Structural axes include grouping, hierarchy, navigation, workflow/disclosure, density/space, interaction and responsive composition.
- Visual axes include typography, color roles, shape, surfaces/depth, imagery, iconography and motion language.

Give each broad option a distinct governing idea. Several surface changes to the same composition do not establish a new direction. Do not invent features or violate fixed requirements to force difference; repair the design set or resolve an incompatible brief.

For a focused child comparison, vary the named decision and preserve the rest of its parent. Small differences are valuable when they answer the current question; the initial broad-direction test must not force late variants to change unrelated structure. Make the changed property easy to inspect and compare. Before presenting, compare each child with its parent outside the varied part, including shared tokens and global styles, so the change does not reach the rest of the page.

## Fair, interactive comparison

Hold required content, data, capabilities, review widths and comparison state constant. Use the same capture scale and enough context to judge each design. Keep names and descriptions neutral; do not hide a preferred answer behind praise, privileged ordering or unequal finish.

Provide a launchable, browser-runnable comparison with a bird's-eye index, full-size views and a lightweight way to return to earlier rounds. Screenshots aid scanning; the runnable prototype establishes interaction. Keep descriptions short: what changes, the key tradeoff and relevant fidelity boundary. Put simulation or unavailable-integration notes beside the preview, not inside the product design.

Every presented option must look complete and feel credible to interact with. Use realistic fixture content and simulate the interaction or state changes that materially affect evaluating it. For example, expose an open-menu composition or a form's feedback when that is part of the design question. Use comparable representative flows across options; keep their demonstrated states reachable and resettable where useful. Do not require complete feature logic, real persistence or a working operation behind every visible control. Illustrative actions are acceptable when their behavior is not needed to judge the design; disclose relevant limits without letting polish imply working integration.

Distinguish live, simulated, fixture-backed and unavailable integration in concise preview/handoff notes. A local success state must not imply that a real payment, message or deployment occurred. Keep truthful product claims separate from creative sample content.

## Responsive intent and verification

Show full-size desktop, tablet and mobile for every option, and provide interaction at each size. Use the project's own desktop, tablet and mobile review widths when it defines them, otherwise 1440, 768 and 390 CSS pixels; treat its other breakpoints as transitions, not as extra review views. Components need the same owning-page context at each width. Adapt hierarchy, navigation and composition deliberately rather than merely scaling or stacking desktop geometry. Scaled desktop images are insufficient; essential actions and information must remain available.

Use browser observations to verify the actual code at the review widths and material transitions. In every round, fix overflow, lost content or low contrast that would distort the comparison, measuring text contrast against the surface the text actually sits on, including panels revealed by interaction. Before final acceptance, also inspect the selected design for long labels, realistic values, relevant empty/error states, 400% zoom (reflow at a 320 CSS-pixel width) and reduced height, and check keyboard order, visible focus, semantics and reduced motion where relevant. A screenshot establishes only the captured appearance, not interaction or behavior between widths.

Before presenting a set, inspect every option's three responsive views and exercise its implemented interactions and representative flows. Verify enough behavior to judge the intended experience; do not impose exhaustive feature tests on a visual mockup. Independently review distinctness, comparable finish and interaction/responsive coverage when materially useful; retain one integration owner. Correct material defects before asking the user to judge the set. If a required check is unavailable, disclose the gap and keep the readiness claim bounded.

For gallery choice delivery and lifecycle checks, use [gallery-selection.md](gallery-selection.md) before presenting an interactive set.

After merging refinements, repeat the affected responsive, interaction and accessibility checks above on the whole selected page or flow, not just the changed fragment. Include loading, empty, success, validation or error states when they materially affect the design or are requested; preserve coherence and realistic content across states without turning mockup completion into full feature implementation. Before final handoff, verify the agreed demonstration scope, selected design coherence and absence of placeholder/debug residue. Report actual checks and material gaps. Distinguish an accepted prototype from a production-integrated implementation; do not claim user acceptance, live integration or checks that have not occurred.
