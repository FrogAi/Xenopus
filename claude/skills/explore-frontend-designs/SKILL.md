---
name: explore-frontend-designs
description: Explore, compare and refine frontend UI design alternatives, including supplied options. Use when the user wants alternatives or help choosing, or wants to define or change the overall look, feel, style or direction of a page, site or app they have not already prescribed. Do not use for an exact reference, a minor change or one specific design the user has already described, unless exploration is explicitly requested.
---

# Explore Frontend Designs

Help the user discover the frontend they want by letting them compare working designs. When you create the options, open with a wide range of substantially different, polished, interactive directions, then branch and refine toward the user's preferences, narrowing the size of changes as evidence accumulates and keeping earlier versions available to revisit. Not knowing an aesthetic preference is a reason to show useful alternatives, not a requirement-gathering failure.

The references own the detail:

- [references/exploration-workflow.md](references/exploration-workflow.md): the order of work for creating directions for anything larger than a component: folders and shared kit, research, direction plan, builder and reviewer briefs, presenting, the decision record, refinement rounds and converging.
- [references/design-quality.md](references/design-quality.md): the quality bar: product fit, distinctness, fair comparison, responsive intent and verification. Read it when generating or judging alternatives and before final acceptance.
- [references/gallery-selection.md](references/gallery-selection.md): the comparison gallery's controls, the selection handoff to this session and its fallbacks, and each round's selection lifecycle. Read it before building a gallery; [assets/gallery-template.html](assets/gallery-template.html) implements it.

## Decide whether and how to explore

Explore when meaningful visual or interaction decisions remain open and the user wants alternatives, help choosing, or to define or change the overall look, style or direction of something they have not prescribed; a request to redesign something without describing the result counts. Take the direct implementation path for an exact reference, a settled design-system decision, a minor or mechanical change, or one specific design the user has already described, unless alternatives are explicitly requested.

For supplied alternatives, keep their set and count and compare them as supplied. If only assessment is requested, report tradeoffs and missing responsive or interaction evidence without reconstructing designs, inventing states or building a gallery. Create or prepare interactive previews only when authorized, and add or replace options only when asked.

## Establish the brief

Before creating the first new mockups, understand the intended experience. Inspect available context and reuse answers already given; a page category alone is not a brief. Establish:

- what the page or product is, what it offers and where it fits in the broader experience;
- the end goal, the visitor's primary action and what success looks like;
- the audience, their needs, familiarity, reasons for visiting and device or usage context;
- the intended impression, brand personality, and any references or dislikes that explain it;
- required content and flows, fixed brand or design-system rules, assets, technical constraints, accessibility needs and review widths.

Ask the missing questions in manageable groups, in plain language, with useful choices and room for free-form answers. Follow up where an answer leaves a material conflict or ambiguity; do not repeat answered questions, demand every detail, or require design vocabulary or references the user does not have. Unknown taste is welcome: ask about purpose and effect, and let the mockups discover taste.

Summarize the working brief, fixed requirements, open aesthetic choices and your creative assumptions before generating options. Wait for the answers that establish purpose, audience and intended outcome, and gather context and research meanwhile. An explicit request to invent the brief or skip intake permits stated assumptions. Once the brief is clear enough, proceed without an approval ceremony, and update it as evidence changes rather than restarting the questionnaire each round.

## Open with real breadth

- Start an open page, screen, flow, site or app with six directions, or a substantial component with four contextual directions, unless another count is requested. These are opening sets, not a ceiling. Rework an implausible or repetitive set before showing it; never fill a count with weaker copies.
- Make the directions differ in their governing idea: structure, hierarchy, navigation, density, interaction and visual character, within the brief's open decisions. Be willing to propose unfamiliar or expressive designs within the real product constraints; do not force every option into the same safe template or assume minimalism is the desired taste.
- Give every direction a stable ID, a short name, its governing idea and its material tradeoff.
- Ground the first broad round of anything larger than a component in research: leading current work in the product's domain, and the currently documented tells of generic AI-generated design as rules to avoid. Skip it for a component, a focused refinement or an exact reference.
- Where subagents are available, give each direction its own builder subagent and folder, all working from the same brief, content and assets; for a component, use them when that widens the range of ideas. You keep the brief, check the set for distinctness and assemble the gallery.

## Make every mockup reviewable

Keep exploration code and history in a design-explorations folder outside the product (for example `~/Design-explorations/<project>/`), outside a real product repository unless that work was requested there. Frontend code is the layout and behavior source: generated images may supply imagery or mood but cannot replace selectable UI, and static images alone never satisfy this skill's review contract. Use browser tooling for interaction, responsive checks and comparable captures.

For mockups the task authorizes creating or preparing for interactive review, provide polished, browser-runnable desktop, tablet and mobile views of every option, including refinements, in a launchable comparison gallery with a bird's-eye index and links to earlier rounds. Check every set against design-quality.md and fix what would distort the comparison before the user sees it.

## Branch from feedback

Let the user choose inside the gallery without typing a design ID in chat. Wait for a submitted response, then continue from it; a direction choice starts refinement, it does not accept a final design or lock every trait. A choice or direction-setting feedback the user gives in chat for the active round also counts as its response; a question about the options does not.

Treat the work as a reversible exploration tree:

- A preference such as "B is closer" selects a promising branch, not an irrevocable base. Distinguish what the user likes, dislikes, explicitly locks and still wants to explore; silence, praise or a ranking does not lock every trait.
- Build children of one or several promising options, combine compatible requested traits, return to a parent, or introduce new directions as the feedback warrants. Integrate borrowed traits coherently and expose real conflicts instead of making a collage.
- Size the changes deliberately: early rounds can replace whole compositions and visual languages, middle rounds explore major choices within promising directions, and late rounds isolate spacing, typography, density, color or interaction details. Use enough alternatives to expose the meaningful possibilities, including focused A/B comparisons for subtle choices; never add filler or narrow just because a round has finished.
- In a focused comparison, hold everything except the open question constant: put agreed changes that apply to every child into one shared parent, build it first, and branch the children from it.
- If feedback shows the larger idea is wrong, reopen it rather than polishing it. Respect explicit locks until the user reopens them, and explain a conflict before changing a locked requirement. Continued dissatisfaction means the design is unresolved, however complete the prototype.
- Never edit a presented version. Build each new version in its own folder, with its own fixture data and pinned versions of anything it loads, so every earlier version opens exactly as the user saw it. Record each version's ID, parent or borrowed traits, location and the decisive feedback in a decision record (`kit/DECISIONS.md` in the workflow; for a component, the gallery's index of rounds is enough); no dedicated tool is needed. Unpresented failed drafts may be discarded.

Make the next set from the feedback, then pause for the next comparison unless the user delegates the choice. Never invent preferences or run speculative rounds without a decision they serve. When delegated, choose against the brief and explain the deciding criteria without claiming the user's approval. If repeated rounds fail to clarify preferences, change the comparison scale or explore new territory; ask only for product constraints that cannot be inferred.

## Accept and finish

Converge when the user accepts a direction and its remaining details, or explicitly delegates the final choice. Summarize the selected design, the agreed demonstration scope and any integration limits, reusing decisions already made and without an approval ceremony; resolve material ambiguity before calling a result accepted.

Merge the agreed refinements into one prototype, complete it to the agreed scope and run the final checks in design-quality.md. Give its location with brief notes on scope, demonstrated states, checks run and material gaps; a polished prototype is not production readiness. Exploration does not authorize publication, deployment or live external effects; honor existing explicit authority without asking again.

Keep comparison history with the exploration files, never in shipped product code. Keep presented alternatives at least until the accepted design and requested revisions are done, then keep or clean them up as the user asks. Delete only temporary files you made, never supplied work or versions a recorded choice refers to. To implement an accepted or prescribed design in a real project, when asked, use the `implement-frontend-designs` skill with the prototype's location, scope and demonstrated states; a direction choice alone does not authorize implementation.

## Improve this workflow

Proactively assess intake, the variety and realism of the mockups, responsive previews, comparison clarity, refinement and the selection handoff during the work and before handoff. Route reusable improvements, including useful first-use techniques and verified preview or browser capabilities, through the `improve-personal-customizations` skill, and exercise the affected comparison and selection flow before adopting a capability change. Workflow improvement never authorizes extra rounds or implementation, and never changes presented versions, accepted decisions or the user's checkpoints.
