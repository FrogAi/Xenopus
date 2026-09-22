# Exploration workflow

## Contents

- Folders
- Before round 1
- Building a broad round
- Presenting
- After each round
- Converging
- Builder brief
- Reviewer brief
- BRIEF.md template

The order of work when you create directions for anything larger than a component. SKILL.md decides whether and how to explore; design-quality.md sets the quality bar; gallery-selection.md owns the gallery and the selection handoff. For a component or a narrow refinement, use only the steps that can change the result. For supplied alternatives, compare them as SKILL.md says, and use this workflow only once the user asks to add or refine options.

## Folders

Use one folder per exploration, named for the date it started, and keep later rounds in it:

```text
~/Design-explorations/<project>/<start-date>/
  index.html     every round: its question, a link, and its outcome
  kit/
    BRIEF.md       the shared brief every builder reads (template below)
    REFERENCES.md  the research and the generic-AI-design tells
    DIRECTIONS.md  round 1: one row per direction
    DECISIONS.md   each round's versions (ID and parent), and the user's feedback and decisions
    content/       real copy, data and captures of the current product
  round-<n>/
    index.html     the round's gallery, from assets/gallery-template.html
    assets/        the round's own copy of shared assets
    <ID>/          one option: index.html as its entry page, its CSS and JS, and its shot-*.png captures
```

Each round copies what it needs, so earlier rounds keep opening exactly as presented.

## Before round 1

1. **Gather the material.** Copy the product's real assets, current pages, posts, data, logos and existing design rules into `kit/` and the round's `assets/`. Where no real content exists yet, such as an app without data, write sample content and label it as sample in BRIEF.md.
2. **Research**, alongside the intake questions, with a research subagent where available. Save the result as `kit/REFERENCES.md`:
   - Enough current award-level or category-leading sites in the product's domain and adjacent ones to cover its leading approaches, often a dozen or more, each opened at desktop and phone width. For each, what makes it impressive and premium rather than templated, how it handles phones and performance, and one idea this product could adapt. Note any site that could only be fetched, not rendered.
   - The techniques ranked by impact for the effort the target stack allows, and the pitfalls that make such sites feel cheap or slow.
   - What designers currently list as the tells of generic AI-generated design, looked up fresh because the list changes, turned into rules.
3. **Write `kit/BRIEF.md`** from the intake answers and the research, using the template below.
4. **Plan the directions** in `kit/DIRECTIONS.md`: one row per direction with its ID, name, governing idea, structure and visual system. Within the brief's open decisions, assign each direction its own visual system (type pairing from an allowed font host, palette, imagery treatment) so no two share one, and make them differ as design-quality.md's distinctness test requires. Where the brand fixes type or color, vary the axes it leaves open instead.

## Building a broad round

- Give each direction to its own builder subagent, in parallel, with the builder brief below. Each builds a complete working prototype of the agreed pages, for example a home, a list and a detail view switched as plain in-page views, with the navigation and links the product needs, the states it needs (theme or mode switches, each reachable by a URL parameter so captures are reproducible), and its signature interaction if the direction has one.
- Meanwhile, build the gallery from the template.
- When the builders report, look at the filled gallery grid (each option's desktop and phone first screen) yourself.
- Then get a fresh independent review of the whole set with the reviewer brief below (the `design-exploration-reviewer` agent where available), while a local server serves the options.
- Send each option's must-fix items to its own builder, resuming the same subagent where the runtime allows so it keeps its context, recheck, and only then present.

Subagents never use the shared preview pane and never press a choice control on a gallery the user may be using: a live bridge accepts exactly one submission.

## Presenting

Start the selection bridge as gallery-selection.md describes, with the exploration folder as its root; the round's gallery is the `READY` URL plus `round-<n>/`. Open it in the in-app browser where available and give the user its address. In one short message say what each option is and its tradeoff, how to choose (button or chat), and that a choice starts refinement rather than ending it.

## After each round

- Record the feedback in `kit/DECISIONS.md`, in the user's words where possible: what was chosen, what to keep, what to fix, what they dislike (rules for every later version) and anything locked.
- Plan the next round from it as SKILL.md's exploration tree describes. Usually two to four children; two suits a binary question such as light or dark.
- Resume the builder that knows the relevant code where the runtime allows, and point it at the DECISIONS.md section by name.
- Before presenting each refinement round, check it against design-quality.md and get the same independent review as round 1 (the reviewer brief covers refinement rounds) unless the change is small enough that it cannot add value. Name heavy effects that need measuring on real hardware before the user commits to them.

## Converging

When the user accepts a direction, list the pages and states in the agreed demonstration scope that the chosen style has not shown yet (for example not-found and error pages, empty states, or placeholders for planned sections) and confirm the list with the user. Build them in that style, merge everything into one prototype, and run design-quality.md's final checks.

## Builder brief

Fill every placeholder; give absolute paths.

```text
You are building ONE design direction, <ID> "<name>", for the <product> design exploration. It is a polished, working prototype the user will click through in a comparison gallery to choose a style, so it must look and behave like the finished product, not a picture of it.

Read first: <root>/kit/BRIEF.md, <root>/kit/REFERENCES.md, <root>/kit/DIRECTIONS.md (build only row <ID>, and stay clearly distinct from the other rows), and <skill-dir>/references/design-quality.md.

Your folder: <root>/<round>/<ID>/, with index.html as the entry page. Shared assets: <root>/<round>/assets/; add only files named <ID>-*. Touch no other folder, repository or live service, publish nothing, and never use the shared preview pane.

Scope: <pages and views>, with the working navigation and menus the product needs, hover and focus states, <states and their URL parameters>, <signature interaction, if any> working with mouse, touch and keyboard, a reduced-motion fallback and fallbacks for advanced graphics. Recompose deliberately for desktop, tablet and phone rather than stacking.

Check your work with your own headless browser at <desktop>, <tablet> and <phone> widths and in the key states (each state, the detail view, the open mobile menu, mid-interaction), and fix what you see until it meets design-quality.md at every width. Save shot-<width>.png for each width and shot-<width>-<state>.png for the key states in your folder.

Return: two sentences on the governing idea and its key tradeoff, the libraries and fonts used, what is simulated versus real, the captures, and known weaknesses.
```

## Reviewer brief

```text
Independent review (read-only) of round <n> of a design exploration, before the user sees it. The brief, directions and references are <root>/kit/BRIEF.md, DIRECTIONS.md and REFERENCES.md (and DECISIONS.md for later rounds); the quality bar is <skill-dir>/references/design-quality.md. The options are served at <URL>; each folder also holds the builder's captures. Use your own headless browser, never the shared preview pane, and never press the gallery's choice or send controls: they deliver a real selection.

Inspect every option at <widths>, including its secondary views and states. Report per option: (1) how strongly it delivers the intended first impression, compared honestly with the others; (2) generic-AI-design tells, with locations; (3) defects that would distort the comparison: overflow, clipped or overlapping text, low contrast on the actual surface, broken views, layout jumps, blank areas, awkward recomposition; (4) factual claims the supplied content does not back; (5) distinctness and comparable finish. For a refinement round, also say whether each requested change is done and what regressed against the parent. End with ranked must-fix items per option, separating defects from preferences.
```

## BRIEF.md template

```text
# <Product> design exploration: shared brief

## Product and goal
What it is, who it is for, why they arrive, the primary action and what success looks like; the intended impression and personality in the user's words.

## Content
Where each piece of copy, data and figure comes from (files, URLs, kit/content). Only these may be used; anything marked sample is labelled sample.

## Assets
Each file in assets/ with its size and what it shows, and what builders may derive from it and how to name it.

## Fixed and open decisions
Brand or design-system rules that are fixed, and the visual decisions that are open.

## Rules
The user's dislikes and requirements, and the generic-AI-design tells from REFERENCES.md.

## Technical constraints
Folder and file rules, allowed script and font hosts with pinned versions, no other network requests, required states and URL parameters, review widths, performance budget and fallbacks.
```
