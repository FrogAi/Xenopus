# Resource and interface quality

Use the project's actual localization format and runtime. These checks complement the linguistic and semantic review in [SKILL.md](../SKILL.md); green technical checks cannot establish fluent translation. Keep working notes and temporary probes proportionate; reuse existing tools and coverage rather than creating a localization framework or mandatory report templates.

## Source, identity and state

Inspect the active locale registry, extraction/update mechanism and source resources. Resolve stale source text before translating. Inventory in-scope keys and variants against an authoritative current source, not an arbitrary target file with the right count. Distinguish required, missing, obsolete, generated and excluded entries, including visible and accessibility-only strings.

Write by stable identity: resource ID, contextual message key or the format's actual disambiguator. Never zip generated translations onto file positions or a filtered list of unfinished entries. Preserve valid repeated messages using their distinct contexts; determine whether duplicate keys are allowed from format evidence. Track source changes so a previous translation is not silently accepted for new meaning.

Preserve comments, metadata, protected content and accurate draft/review/provenance states. Before relying on a draft marker, such as gettext's fuzzy flag or Qt's unfinished type, to keep an unresolved unit out of the product, confirm that the project's compiler or loader excludes it and its updater keeps it; otherwise leave the target empty where that falls back to the source, or report the unit. Nonempty text is not approval; source-identical text may be an intentional brand, shared word or constrained neutral entry, but is not automatic translation coverage. Distinguish translated, retained, intentionally source-exact and unresolved units as needed. Use a diff or existing version control for recovery; hashes and separate manifests are only needed when they serve a real identity or recovery requirement.

## Messages, variables and branches

Parse with the actual format's tooling. Where the product's lookup and formatter can be called, run every in-scope message and branch through them the way the calling code does, and report each error or source-language fallback the run shows. Preserve required argument identities, types, referents and supported formatting, plus markup, attributes, entities, escapes, rich-text boundaries and protected code/URLs.

Take placeholder syntax from the calling code, not from a catalog flag. Permit grammatical reordering where the runtime supports it; placeholders that bind by position, such as Python {} or printf %s, move only with explicit indices that the runtime and the project's checks accept, such as {1} or %2$s, and otherwise keep their source order; validate printf-style positional/type rules and MessageFormat quoting according to the installed runtime. Verify mnemonic/accelerator syntax and assigned keys against the localized controls and runtime rules, including unintended conflicts.

A universal token-count rule must not override valid inflection, repetition or locale-specific branches. A locale branch may leave out an argument its grammar doesn't need, such as a German singular without {count}, when that branch is selected for exactly one value and the runtime ignores unused arguments; that is not an argument-preservation defect. A branch that also covers other values, such as the Ukrainian form for 1, 21 and 31 or the French form for 0 and 1, keeps the number. Argument names belong to the calling code, not the locale: a renamed caller-supplied argument is a confirmed defect, and the fix restores the source name unconditionally.

Inspect the runtime's plural, ordinal, selection and fallback behavior for each target locale. Supply every required reachable branch, preserving exact-value selectors, offsets and semantic distinctions. Do not copy English singular/plural structure onto every language, equate category names with numeric values or require identical source/target branch counts. Exercise representative values for every applicable branch, including zero, fractions, boundaries and negative values when the product permits them. Verify grammatical agreement with substituted values and unknown gender; do not infer a user's identity from a display name.

Prefer complete translatable messages over concatenated fragments. If the schema cannot express a necessary word order or agreement, identify the integration repair rather than forcing invalid language. [ICU's message guidance](https://unicode-org.github.io/icu/userguide/format_parse/messages/) explains complete messages and movable arguments; [CLDR plural guidance](https://cldr.unicode.org/index/cldr-spec/plural-rules) explains locale categories. Check the product's actual library/data version rather than assuming the newest rules are deployed.

## Terminology and literal values

Preserve product names, commands, identifiers, URLs and other protected tokens according to their evidenced policy; approved localized forms or grammatical inflection can be valid. Recheck all instructional and help-text references after changing a visible control label. Keep equivalent concepts consistent without forcing one target word into unrelated meanings of an English homonym.

Preserve numeric magnitude, sign, comparison/inclusivity, ranges, quantities, units and currency identity. Distinguish durations from timestamps. Apply verified locale formatting through the product's formatter; changing separators or display conventions does not authorize conversion of money, units, calendar meaning or time zones. Honor an explicitly authorized conversion using evidenced rules and accuracy requirements.

## Render the experience

Inspect the translated flow in the actual application or format renderer: selected locale and fallback, complete messages, buttons, errors, help references and accessible names. Check narrow/mobile widths, expansion, clipping, wrapping, mixed scripts, font coverage/shaping, punctuation and relevant input formats. For RTL, inspect base direction, mixed-direction variables/URLs/numbers and appropriate layout behavior. Do not reverse strings, mirror every asset blindly or add/remove invisible controls without a demonstrated need. [W3C internationalization guidance](https://www.w3.org/International/quicktips/) covers language/direction, variable ordering and local presentation concerns.

Check actual character/timing limits without deleting essential meaning; preserve pronunciation, subtitle timing or non-text structure when relevant. Use representative stress cases for runtime coverage and identify any views or devices not tested. A pseudolocale can expose layout defects but cannot certify real translation quality.

Use explicit encoding for multilingual reads/writes and preserve the format's encoding, normalization, BOM, line endings and meaningful whitespace. Inspect unexpected replacement characters, control characters and normalization changes instead of deleting locale-correct text. Validate parse/serialize round trips where edits could affect structure.

## Verify the final artifacts

Run applicable extractor/updater, parser/schema, catalog compiler, build and localization/runtime checks. Check regeneration stability when generated output is involved. Exercise custom validators against valid locale examples and representative corruptions; distinguish exact format violations from linguistic heuristics and do not let an English-oriented validator redefine correct text.

Integrate all writers before final validation. After a wording, label or branch correction, repeat affected semantic, linguistic, reference, structural and runtime checks on the final artifacts. Account for every in-scope key/branch/locale and inspect the final diff for unauthorized changes. Record failed or unavailable checks and the actual coverage of substitutes. Keep only useful evidence and required regression protection; remove task-created disposable probes without removing pre-existing work.
