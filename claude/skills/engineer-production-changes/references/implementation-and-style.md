# Implementation and style

Read before writing or rewriting code, and when reviewing an implementation.

## Building in pieces

A piece is one observable behavior or invariant, not a line, a file or an arbitrary cleanup. Complete the thinnest end-to-end slice first, then extend it. Add only what the current piece needs; scaffolding for pieces you anticipate is speculative structure. Work sequentially within a dependency chain and within anything that has a single writer; independent pieces can progress in parallel when their changes cannot collide and their interfaces are clear. A one-behavior change is one piece, with no invented stages. Pause for the user only for a genuine open choice, an authority boundary or a blocker.

## Matching the codebase

Establish the style from the applicable instructions and tooling, then from a small sample of established code doing comparable work in the same language and subsystem. Take its form: naming, imports, declaration grouping, control flow, state ownership, helper boundaries, whitespace, and the tone of messages and user-facing text. Do not take its extras: defensive patterns, type annotations, docstrings or comments in the sample do not admit the same things into new code, which still need an admission ground.

Generated or vendored code, and your own new edits, are not style authority. Where local conventions differ, follow the one that applies to the file you are editing, and match its existing line endings and encoding. On Windows, editing tools and scripts can silently change a file's line endings, so check them after editing, for example with `git ls-files --eol` or a carriage-return count. Before committing or applying a change, including one an agent wrote, compare its full diff against the examples and fix mismatches without reformatting unrelated code, and remove every comment, docstring or annotation it newly writes (not one carried over with moved or copied code) that lacks an admission ground and that project convention or tooling does not require; passing a formatter does not establish a match.

Explicit instructions, language semantics, established formatters and tooling, public interfaces, generated or external ownership, and verified local conventions take precedence over the defaults below. Mention any material departure.

## Defaults

- Use descriptive names and keep established domain abbreviations. Names are not shortened, truncated or generalized to save characters.
- In a repository, change files, documents, assets and links in place under their existing names; don't add version markers such as v2 or ?v=2 to names, paths, links or labels, or keep superseded versions beside the current one, because git keeps the history. Release versions the project already uses are outside this default. If a marker seems needed, for example to bypass a cache, explain what keeping the plain name costs and let the user choose.
- Use straightforward control flow, visible data movement, explicit state ownership and focused responsibilities.
- Express condition-dependent alternatives for an assignment as explicit branches, each showing its resulting assignment.
- Use a local variable for a meaningful intermediate or real reuse; keep a clear, direct expression inline.
- Create a helper for meaningful reuse or a named domain concept. Add comments, docstrings, type annotations and configuration only on an admission ground, or where project convention or tooling requires them.
- Give shared mutable state an explicit runtime owner that passes it to consumers, rather than a module-level global or singleton, or the same global hidden in a closure, a mutable default or a function attribute. Immutable constants and unrelated existing code are outside this default.
- Use the language's common conventions for indentation and line length (such as PEP 8 or the ecosystem's standard formatter) and plain, readable constructs. In code you write or rewrite, never put a statement on the same line as its condition: give every `if`, `else` and loop body its own indented block, even a single `return`, and split long chained expressions into named steps or a plain loop. Give each step its own line group: put a blank line between statements that do different things, around every `if`, loop or `try` block that sits among other statements, and between groups of top-level declarations; keep declarations that belong together, such as a group of related constants, on consecutive lines. Never put one right after an opening brace or right before a closing brace, and never two in a row. Python signatures carry no annotations or docstrings unless they serve a real interface, tooling or correctness obligation.
- Let statements, predicates, line breaks and whitespace show meaning, stages and ownership. Keep independent operations separate and combine only what is semantically related. Keep configuration near its owner, organize declarations by role and lifecycle, and order comparable names consistently when their order has no meaning.

## Committing

In a checkout that others also commit to or rebase, confirm the expected HEAD in the same command right before committing, amending or rebasing. Stage exact paths, never someone else's uncommitted work, and never rewrite history that has been pushed.

## Requested rewrites

"Rewrite from scratch" asks for a new implementation of the target. Design it from the target's purpose, required behavior, constraints and integration contracts first; then use the existing code to confirm those contracts and to find defects. Separate required contracts, such as external behavior, interfaces, look and interaction where users rely on them, and parity with an upstream counterpart, from incidental legacy behavior, and verify the required ones against the old implementation.

A requested rewrite is not reduced by small-change preferences, and returning the existing code unchanged does not satisfy it. "Rewrite it if useful" leaves the choice to you; an explicit rewrite request does not. Unrelated systems, dependencies, data and user work stay outside it. If something blocks the rewrite, report the blocker rather than substituting a refactor.
