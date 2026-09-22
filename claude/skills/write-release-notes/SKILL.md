---
name: write-release-notes
description: Create, rewrite or review public release notes, update blog posts and update announcements from change evidence, with engaging explanations for first-time and returning readers, useful visuals and concise feature coverage. Use when writing or reviewing release notes, a what's-new post or an update announcement for a product release.
---

# Write Release Notes

Write updates with the warmth, fun and cheeky charm of a knowledgeable friend. Personality and reading enjoyment are part of the deliverable, alongside an accurate understanding of what the product does, what changed, what readers will notice and anything they need to do.

Write for ordinary people considering or using the product. Assume no engineering knowledge or prior familiarity with the product, its features or previous releases. Follow an explicitly different audience, purpose, publisher voice or format when requested.

## Establish the release

Use supplied material and inspect relevant sources to identify the product, release boundary, intended publication, availability, affected setups and actual changes. Reuse established context; clarify missing facts or preferences only when they materially affect the result. Do not make a routine release depend on a new questionnaire. When tone is unclear or has missed the mark, a short representative passage can help calibrate it before drafting a long release.

Identify the actual prior release and target, retaining exact source versions for comparisons. A commit's parent or title does not establish what people previously received or what is deployed now. When release history is unavailable, label a bounded source comparison accordingly. Distinguish shipped, planned, experimental and investigating states.

Never invent benefits, measurements, causes, availability, community sentiment, personal experiences or claims that feedback motivated a change. Omitted information is unknown, not a public fact. Resolve material conflicts and missing facts before calling the affected content ready; keep any requested partial draft and its unresolved questions clearly separate. Factual support does not grant publication authority or permission to disclose private material.

## Investigate the reader-visible effects

Use change lists and diffs to find the work, then reconstruct material before-and-after behavior. Check what changes for existing users who change nothing, such as a new default or a replaced option whose saved choice now behaves differently. When readers would notice it, such as in how the product behaves, or need to choose again, say who is affected and what to do. Group changes by the experience they produce and account for each material outcome or its audience-based omission.

For material claims, actively obtain or produce missing evidence when feasible within the task; do not stop at a diff summary or merely propose useful experiments when you can perform them. For substantial algorithm, performance, quality or interaction changes, or a material claim requiring technical reconstruction or comparison, read [technical-investigation.md](references/technical-investigation.md) before drafting the claim. Keep temporary probes and evidence outside the product deliverable. This work does not authorize changing the product, its releases, published content or live services; for device measurements, screens and driving logs, follow the `develop-on-comma-device` skill.

Let results determine the story, including unchanged behavior, regressions and tradeoffs. Distinguish what implementation establishes, what controlled execution measures, what a simulation or calculation predicts and what representative product use demonstrates. Code or a simulation alone cannot establish deployment, real-world performance, driving feel or improved safety. When drafting a headline change in how a vehicle drives, ask the publisher in one grouped question what they noticed on their own drives unless they already said, and describe driving experience only as they report it. If required data, devices or access are missing, pursue useful authorized alternatives and identify the smallest remaining evidence need. Narrow unsupported claims and disclose material limits; a qualitative explanation must not silently replace a requested comparison. Scale investigation to reader impact and the claim, so a small wording fix does not acquire an unnecessary benchmark project.

Keep working evidence and omissions outside public prose unless a source or qualification helps readers interpret a claim. Preserve material compatibility conditions, limitations and required actions through simplification.

## Explain only what readers need

Translate the change into an understandable experience: what the feature does, what is different, when it matters, who it affects and where to find or use it. Answer the applicable questions naturally rather than repeating those labels under every heading. Group implementation work by its shared visible outcome; do not turn the commit list into the release structure or invent a visible benefit for internal cleanup.

Supply only the context needed to understand each change and its significance. A short phrase explaining an unfamiliar feature often suffices. Avoid explaining everyday concepts, repeating established context or making every section a tutorial. Expand when brevity would leave a meaningful gap or misunderstanding. Let each independently skimmed change make sense, while allowing its sentences, captions and nearby visuals to work together.

Use familiar situations, concrete examples and plain-language mechanisms when they make complex changes easier to grasp. Keep examples within supported behavior; distinguish a hypothetical illustration from an observed result. Use the actual names of controls people need to find and quote wording when referring to verbatim interface text. Explain essential unfamiliar terms in place rather than leaving readers to decode acronyms or consult earlier posts.

For driving-related changes, make applicability, changed behavior and any necessary action unmistakable. Do not imply capabilities, reliability, safety or reduced driver responsibility beyond the evidence. Keep words such as always, never and every within what the evidence covers, especially for how the car steers, brakes or responds to other vehicles. Include warnings and limits that affect understanding or action; avoid burying the explanation in unrelated technical caveats or repetitive generic disclaimers.

## Shape an engaging release

For ordinary public updates, make the lively, quirky, cheeky spirit of Jagex's RuneScape updates evident in the feature explanations and transitions as well as the opening. Start from situations readers recognize, speak to them naturally, and let playful observations carry useful meaning through the passage. A neutral technical account with a few amusing headings does not meet this voice requirement. Choose natural rhythm over a joke quota; avoid forced puns, hype, condescension and stock promotional language, and use no em dashes or other machine-written habits anywhere in the published copy. Preserve literal meaning when using humor or analogy. Keep warnings, serious failures and required actions direct, and scale the personality to the space and subject without flattening an otherwise ordinary release.

Match narrative perspective to the actual publisher and supplied facts. Release notes and update posts are publication copy rather than conversational messages, so apply the `write-in-my-voice` skill to them only when the user explicitly asks.

Open with a concrete, supported reason to keep reading. Put urgent actions or material limitations where readers will encounter them in time; a hook must not delay them. Organize the rest around what is most useful or interesting to the reader:

- Give each substantial feature or change its own recognizable heading and enough explanation, examples or visual support to understand it. Keep distinct substantive features discoverable even when they share a technical area.
- Put smaller changes needing only a sentence or two into concise, self-contained bullets under broad reader-facing categories, such as the product's main feature areas, naming the feature in each. Start each with a short change label, such as Added, Bug Fix, Changed, Removed or Tweak, when labels help. Judge importance by reader impact rather than code size.
- Sort comparable items, labels and sections alphabetically when doing so preserves meaning, priority, flow and readability. Use a more meaningful order when importance, chronology, dependencies or understanding calls for it.
- Use short paragraphs and descriptive headings. Let the release determine its length and structure; add summaries, navigation or other sections only when they help. Avoid duplicating the same explanation in an opening, feature section and closing recap.

## Show meaningful differences

Create and include useful visuals with available capabilities rather than merely suggesting them. When creating or reviewing visuals or media comparisons, read [visuals-and-comparisons.md](references/visuals-and-comparisons.md) for format choice, evidence and delivery checks. Small updates need not contain visuals.

## Review and deliver

Read the complete release as both a curious newcomer and a returning reader. Check that important changes are covered, explanations are sufficient without repetition, the voice feels natural, no machine-written habits remain, a text search finds no em dashes, and every section earns its length. Verify actions, labels, applicability, release state and numerical or behavioral claims against their evidence; a claimed change with no matching evidence is unsupported, not just wording to simplify. Check the rendered publication or representative preview when layout or embedded media materially affects comprehension; source inspection alone does not prove visual readability.

Before handing off a substantive release you wrote or revised, use the `coordinate-specialists` skill for fresh independent review of the draft and useful evidence checks; if you are the assigned reviewer, return findings instead. Have the reviewer first explain what a reader would understand about the changes, applicability and actions, then compare that interpretation with the underlying evidence. Challenge the comparison design and coverage as well as the wording: a correct chart can still omit a controlling limit or use an unrepresentative workload. Seek omissions, misleading implications, confusing examples, weak organization, overexplaining, awkward humor and misleading visuals. Review actual prose and artifacts, not merely compliance with a checklist. Fix supported defects and recheck affected content before handoff. State material verification gaps without claiming guaranteed reader understanding or publication readiness.

When revising, rebuild the coherent passage or whole release needed to solve the problem; do not preserve weak wording or structure, but leave publication-ready passages unchanged. Check for the same underlying defect elsewhere in scope and reread the release for cohesion. An explicit rewrite from scratch requires composing anew from purpose and verified facts. A review-only request remains a review.

Deliver the requested draft, revision or review with its useful assets. Keep private working evidence, critique and unresolved publication blockers outside publishable copy. Creating release notes does not itself authorize publishing or sending them.

## Improve through real use

During work and before handoff, assess feedback, lasting preferences, reader misunderstandings, successful methods, gaps and useful existing or new tools for reusable improvement. A first useful discovery can warrant action; do not wait for repeated failure or an explicit maintenance request. Correct the current result and use the `improve-personal-customizations` skill to diagnose and improve the responsible permanent source, including rewriting, consolidating or retiring weak instructions rather than accumulating exceptions. That skill owns admission, verification and recovery. Keep release facts and project-only choices local, preserve explicit checkpoints, and do not treat an unexplained execution miss or unadopted suggestion as a reason to add another rule. Retain a small approved example only when it adds useful calibration beyond the instructions.
