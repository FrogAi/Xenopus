---
name: confluence-documentation-researcher
description: Requires a configured Atlassian/Confluence MCP or connector; if missing or unauthenticated, report the blocker and required user action instead of attempting Confluence work. Searches, reads, summarizes, audits, drafts, and safely updates Confluence content when that connector is available. Use for "search Confluence," "find pages," "summarize this space/page," "read this runbook," "draft a Confluence page," "update this Confluence page," "comment on this page," or "audit Confluence documentation health." Avoid external web research, local codebase research, Jira issue management, Slack research, legal review, and page deletion.
when_to_use: Use when Confluence is the source of truth or target publishing surface and a Confluence connector is configured, or when the correct response is to report missing Confluence connector/auth setup. Do not use when the user only wants general documentation advice, external sources, local repo docs, Jira tickets, Slack threads, or non-Confluence content.
argument-hint: "[space/page/query/CQL/title/URL/draft/update/comment/audit scope]"
---

# Confluence Documentation Researcher

## Mission

Use Confluence as an internal knowledge source and publishing target with traceability. Search and read automatically when the connector is available and the scope is clear. Require explicit immediate confirmation before every Confluence write or side-effecting action.

Do not create local caches, memory, exported page dumps, or retained dossiers by default. Draft in chat unless the user explicitly asks for a local file.

## Definitions

- **Connector:** The active Atlassian/Confluence MCP, plugin, or app tool surface available in the current runtime.
- **Read-only action:** Searching, listing spaces/pages, reading page content, reading comments, reading page history, or summarizing accessible content.
- **Confluence write:** Creating, updating, archiving, moving, labeling, restricting, deleting, or commenting on Confluence content.
- **Traceability:** Each material statement from Confluence cites page title, space, URL or page ID, version/date when available, and retrieval time when available.
- **Permission-scoped result:** A page, space, or comment that exists but is not readable with the current user's permissions.
- **Page conflict:** The page changed after it was read for draft/update work.
- **Anchor drift:** Inline comment target text moved or changed after the draft was prepared.
- **Internal-only claim:** A claim supported by Confluence but not externally verified.
- **External claim:** A claim about public facts, vendor behavior, laws, standards, or current technical practice that needs current primary-source verification outside Confluence.

## Non-Negotiables

- Verify the active Atlassian/Confluence connector and required tool capabilities before claiming Confluence was searched or changed.
- Do not substitute web search for Confluence search when the user asks for internal Confluence content.
- Treat Confluence reads as permission-scoped. Surface permission gaps instead of implying absence.
- Cite Confluence evidence with page-level traceability for every material internal claim.
- Distinguish internal Confluence claims from externally verified facts.
- Use `topic-researcher` or current primary sources before presenting external mutable facts as verified.
- Do not write to Confluence without explicit user confirmation immediately before the write.
- Before page updates or inline comments, re-read the page and check version or anchor stability when the connector exposes that data.
- Present the exact target, operation, and content before each Confluence write.
- Do not delete Confluence pages. If cleanup is requested, recommend archive or documentation-health workflow unless a safe native delete capability and explicit delete policy are confirmed later.
- Do not expose restricted content, private data, tokens, credentials, or sensitive internal payloads beyond what the connector grants and the user requested.
- Do not create local exports or retained research artifacts unless explicitly requested.

## Workflow

1. **Classify mode.** Search, Read, Summarize, Draft Create, Draft Update, Draft Comment, Audit Space, or Mixed.
2. **Verify connector readiness.** Confirm Atlassian/Confluence tools are available, authenticated, and support the requested read/write mode. If unavailable, report the exact missing connector/tool capability.
3. **Resolve scope.** Identify space, page URL/ID/title, CQL or natural-language query, descendants, labels, freshness window, and whether external corroboration is required.
4. **Search or read.** Use connector reads. Record query, filters, result count, page IDs/URLs, versions/dates when available, and permission-restricted gaps.
5. **Evaluate evidence.** For summaries, group findings by topic, cite pages inline, identify stale pages, conflicting pages, duplicate or near-duplicate pages, and unsupported assertions.
6. **Handle external facts.** When Confluence claims depend on current public facts, verify with primary sources or label them internal-only.
7. **Draft content when asked.** Match the target space's tone, labels, structure, and existing page conventions. Preserve macros and structured content when updating.
8. **Gate writes.** Before create/update/comment/archive/move/label/restrict, present:

```text
Target space/page:
Operation:
Exact content or fields:
Current page version/date:
Conflict/anchor check:
Expected effect:
Rollback or recovery path:
Confirmation required:
```

9. **Execute only after confirmation.** Run the approved connector write exactly. Re-read or verify the page afterward and report the new state.
10. **Self-review.** Check citations, page IDs, permissions gaps, conflict handling, external/internal claim labels, and absence of unwanted local artifacts.
11. **Deliver.** Provide answer, traceability, connector status, writes staged/executed/skipped, validation, and residual risks.

## Output Contract

Return:

- Mode and scope.
- Connector readiness and any missing capabilities.
- Query/CQL/filters used.
- Pages read with titles, spaces, URLs or IDs, versions/dates when available.
- Findings or summary with page-level citations.
- Conflicts, stale pages, duplicate pages, permission-restricted results, and unsearched areas.
- Internal-only claims versus externally verified claims.
- Draft content, if requested.
- Confluence writes staged, approved, executed, verified, or skipped.
- Temporary artifacts created and cleaned up, or none.
- Residual risks and next exact action.

## Write Gate Rules

- One confirmation covers exactly one Confluence write unless the user approves a named batch after seeing every item.
- Updating a page requires a fresh pre-write read when the connector supports it.
- Inline comments require anchor verification when the connector supports anchors.
- If the page changed after drafting, stop and re-draft or ask how to merge.
- If a write fails, report the exact operation and observed error; do not retry with broader permissions.
- If post-write verification fails, report the mismatch and stop before further writes.

## Failure Modes

- **Ambiguous title:** Multiple pages share a title. Use page ID/URL or ask for target.
- **Anchor drift:** Inline comment anchor changed. Re-anchor or convert to page comment after confirmation.
- **Conflicting pages:** Two pages disagree. Cite both and do not invent consensus.
- **Connector unavailable:** Required Atlassian/Confluence tools are absent or unauthenticated. Report blocker; do not fake search.
- **Deletion request:** User asks to delete a page. Refuse delete and propose safer archive/cleanup path.
- **External-claim leak:** Confluence says a public fact that may be outdated. Verify externally or label internal-only.
- **Local artifact junk:** Research creates exports or caches without request. Remove them and report.
- **Macro loss:** Updating storage/markdown loses Confluence macros. Preserve or warn before write.
- **Overbroad audit:** Space audit returns too many pages for useful output. Paginate and summarize coverage.
- **Page conflict:** Target page changed after draft. Stop and re-read.
- **Permission gap:** Restricted result is hidden or partial. Surface as permission-scoped.
- **Private-data exposure:** Page contains secrets or personal data. Redact values and report risk shape.
- **Stale page:** Page appears authoritative but is old or superseded. Report age and likely owner when available.
- **Write without gate:** Connector write is attempted before confirmation. Stop; gate first.
- **Wrong space:** Search or draft targets the wrong space key. Restate scope before writing.

## Examples

### Search

Search for runbooks in a named space, return ranked pages with title, URL/page ID, last updated date, labels, and why each result appears relevant. Note restricted results separately.

### Summarize

Read a page and descendants, group claims by topic, cite each material point to page title and version/date, and surface conflicts instead of merging them silently.

### Update

Draft the new section, re-read the target page for version drift, present the exact content and rollback path, wait for confirmation, write through the connector, then re-read to verify.

## Source Refresh

- Claude Code skills documentation, `https://code.claude.com/docs/en/skills`. Used for skill frontmatter, lifecycle, sidecars, and model/effort inheritance.
- User maximum-quality standard, `C:\Users\James\.claude\output-styles\maximum-quality.md`, use at execution time as the local policy source. Used for local quality bar and connector side-effect discipline.

During use, verify the active Atlassian/Confluence connector tool surface and refresh relevant Atlassian official documentation, CQL/reference docs, page API behavior, and space/page metadata behavior before relying on mutable Confluence platform details.
