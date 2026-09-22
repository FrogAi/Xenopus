---
name: translate-content
description: Translate or localize human-language text and review or repair existing translations, from standalone prose to UI strings and localization catalogs. Use when the user asks to translate or localize text or a product, to review or fix a translation, or explicitly for transcreation. Excludes ordinary same-language editing and programming or markup language conversion.
---

# Translate Content

Produce text that reads as if it were originally written for the target audience. One-to-one fidelity means equivalent meaning, intent, tone and user action, not English word order, sentence count or literal phrasing. Restructure freely where natural language requires it without adding, dropping or changing claims, conditions, commitments or capabilities. Fluency, semantic fidelity and usable presentation are all acceptance requirements.

## Establish the translation contract

Use the product's authoritative locale list or the explicitly selected targets. Clarify missing languages, regional variants or scripts that materially affect the result; do not invent worldwide coverage or silently substitute a nearby locale. Identify the current source, usually English, and translate directly from it with product context; another target translation is not the source of truth.

Inspect the supplied context and, for product work, the actual control, surrounding flow, neighboring strings, interpolation and relevant resource/runtime configuration. Establish audience, tone/formality, approved terminology, protected content and real space or timing constraints. Reuse evidenced decisions and clarify only material gaps. Standalone text does not require unrelated repository inspection or auxiliary artifacts. For UI strings, localization catalogs and other software resources, or any text containing placeholders or plural/select syntax, read [references/quality-gates.md](references/quality-gates.md) before translating or reviewing it. It owns stable message identity, locale-specific branches, syntax, runtime selection and rendering.

Distinguish an action from a status or object, and establish who does what to whom, under which conditions and with what outcome. Preserve negation, uncertainty, permission versus obligation, direction, exceptions, quantities, units, severity and reversibility. If context cannot resolve a consequential ambiguity, use target wording that keeps what the evidence supports and stays neutral on the open point when the language allows it; otherwise leave that unit unresolved and continue independent work. Never choose the opposite action and excuse it in a note. Flag source defects instead of silently changing the intended product behavior.

Preserve existing translations outside the requested scope. An instruction to revise or repair existing translations authorizes those changes, including human-authored entries; a review-only request produces findings. Preserve actual provenance and review states. Do not send private source text to public searches or external translation services without disclosure authority.

## Write natural, faithful language

Translate the complete message and interaction, not isolated English fragments. Use idiomatic phrasing, ordinary target-locale terminology, appropriate politeness and coherent register. Avoid calques, unnatural collocations, mixed regional conventions and unexplained borrowing; established native loanwords remain valid. Allow contextual grammar and inflection while keeping concepts and product terminology consistent.

Make controls recognizable and concise, errors understandable and instructions actionable using only the supplied meaning. Preserve the actual choice: canceling a subscription is not deleting an account, and the ability to retry is not a promise of automatic retry. Do not invent reassurance, recovery steps, guarantees or urgency. Adapt idioms to their intended effect without replacing facts or adding creative claims. Broader transcreation requires that scope to be requested.

Translate related messages together and keep visible labels, help references and accessible names aligned. Test the assembled message with realistic substituted values; grammatical information must not be invented from a name or an unknown variable. If concatenation, missing variants or a character limit prevents a natural faithful result, identify the resource/layout defect. Repair it when authorized, or resolve the specific conflict; do not drop meaning or shrink text into unreadability to fit.

Use `$engineer-production-changes` for behavior-affecting technical changes and `$coordinate-specialists` for useful translation/review delegation. Apply the relevant document, media or other format tooling when the content needs it.

Read [references/constrained-transcreation.md](references/constrained-transcreation.md) only for explicitly constrained novelty, dialect, pseudolocale or brand-voice transformations. Its source-exact rules must not restrict ordinary translation or regional localization.

## Review meaning and fluency independently

Review every in-scope translation and relevant branch. First read the target in its user context without following the English wording: does it sound natural, express a clear action and fit the surrounding experience? Then compare with the source and product context for omissions, additions and altered meaning. Keep these distinct review passes; neither a fluent paraphrase nor valid resource syntax proves fidelity.

For substantive product work, obtain fresh independent linguistic and semantic review for each target locale, with reviewers given the raw source, context, target and criteria rather than the translator's conclusions. Select reviewers able to assess that locale and domain; use separate focused contributions when they add coverage, not a fixed role count. Resolve disagreements from language/context evidence and rerun affected checks after corrections. Review the complete in-scope text; sampling runtime states does not substitute for linguistic coverage of the remaining messages or locales.

Resolve doubtful terminology or usage with approved product references and reliable target-locale or domain sources. Verify version-sensitive formatting rules against the actual runtime and its authoritative documentation. Back-translation can reveal meaning drift but cannot by itself prove native fluency, exact equivalence or reviewer competence. Multiple model opinions are not qualified human approval. When dependable locale review or material evidence is unavailable, state the affected gap and keep the claim bounded rather than promising perfection in every language.

Scale extra scrutiny to what a mistranslation could do where the text is actually used, judged for the smallest piece that can ship on its own. Operational or irreversible-action text needs explicit semantic checking and independent review. Where mistranslation could cause safety, medical, legal, financial, emergency, security or physical harm, require qualified human target-language review, qualified human domain review when domain meaning affects that harm, independent meaning reconstruction and in-context validation before release or claiming release readiness. One person may cover both qualifications when established. Gating one message does not raise the bar for unrelated ordinary messages in the same catalog, but a release that ships a gated message is not release-ready until that message's gates are met. A requested translation candidate can be delivered with unresolved release gates identified. Before gated content is released, tell the user which gates are unmet and what that risks; if the user then chooses to release it, follow that choice and report it as released without those gates, not as release-ready.

## Finish and improve

Do not call the deliverable complete until the whole requested scope is accounted for, required meaning decisions are resolved and the applicable linguistic, structural and runtime checks have passed. Deliver standalone translations first, with only material notes. For catalogs, concisely identify locales/coverage, actual reviews and checks, unresolved units and any missing release gate. Do not call copied English, a nonempty catalog, passing parser or partial review a completed localization. Do not claim certification, native approval or deployment without evidence.

Use `$improve-personal-customizations` for adopted lasting feedback or evidenced reusable improvements. Keep product glossaries and project-specific translation decisions in the project, not in this skill.
