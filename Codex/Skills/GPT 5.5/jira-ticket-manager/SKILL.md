---
name: jira-ticket-manager
description: "Use for Jira issue search/read/triage/create/update/transition/comment/link. Not for Confluence, Slack, PRs, or ungated writes."
---

# Jira Ticket Manager

## Mission

Use Jira as the issue-tracking source of truth with explicit traceability and write safety. Search and read automatically when the connector is available and scope is clear. Require explicit immediate confirmation before every Jira write or side-effecting action.

Do not create local action logs, caches, exports, or retained ticket dumps by default. Draft in chat unless the user explicitly asks for a file artifact.

## Definitions

- **Connector:** The active Atlassian/Jira MCP, plugin, app, or API tool surface available in the current runtime.
- **Read-only action:** Searching, listing projects/boards/sprints, reading issues, comments, links, transitions, fields, metadata, or worklogs without changing Jira.
- **Jira write:** Creating, updating, transitioning, assigning, commenting, linking, unlinking, logging work, changing rank, changing labels, adding attachments, deleting, archiving, or otherwise changing Jira state.
- **Issue traceability:** Each material ticket statement cites issue key, URL or ID, field name, value, and retrieved status/date when available.
- **Workflow transition:** A Jira status change that must be valid for the issue's current workflow state.
- **Field metadata:** Jira project/issue-type field requirements, allowed values, custom field shapes, and validation rules.
- **Bulk operation:** A write touching more than one issue.
- **Permission-scoped result:** A project, issue, field, or comment hidden or partially visible because of the current user's Jira permissions.
- **Impersonation:** Any attempt to comment or act as another user, falsify approval, or imply another user performed an action they did not perform.

## Non-Negotiables

- Verify the active Atlassian/Jira connector and required tool capabilities before claiming Jira was searched or changed.
- Do not substitute web search or guessed ticket context for Jira connector reads.
- Treat Jira reads as permission-scoped. Surface permission gaps instead of implying absence.
- Cite issue evidence with issue-level traceability for every material ticket claim.
- Document the JQL or search criteria used for every search.
- Before creates or updates, fetch project/issue-type field metadata when the connector supports it.
- Before transitions, fetch valid transitions from the current issue state when the connector supports it.
- Before links, fetch or verify valid link types when the connector supports it.
- Do not perform Jira writes without explicit user confirmation immediately before the write.
- Present the exact target, operation, and content/fields before each Jira write.
- Do not impersonate users, falsify approvals, or post comments that imply someone else acted.
- Do not perform destructive deletes. If deletion or attachment removal is requested, report unsupported/high-risk path and propose safe alternatives.
- For bulk writes, present every issue and operation before asking for batch confirmation.
- For cross-project writes, surface project boundaries, reporting impact, and stakeholders before confirmation.
- Do not expose private ticket data, secrets, credentials, customer data, or regulated payloads beyond the requested scope.
- Do not create local exports or retained ticket artifacts unless explicitly requested.

## Workflow

1. **Classify mode.** Search, Read, Audit Board/Sprint/Backlog, Draft Create, Draft Update, Draft Comment, Draft Transition, Draft Assignment, Draft Link, Draft Worklog, or Mixed.
2. **Verify connector readiness.** Confirm Atlassian/Jira tools are available, authenticated, and support the requested read/write mode. If unavailable, report the exact missing connector/tool capability.
3. **Resolve scope.** Identify project, issue key, board, sprint, JQL, fields, target status, assignee, link type, worklog duration/date, and whether this is bulk or cross-project.
4. **Run read-only discovery.** Use connector reads. Record JQL/search criteria, result count, issue keys/URLs/IDs, visible fields, comments, links, status, and permission gaps.
5. **Evaluate context.** Check workflow state, required fields, blockers, linked issues, parent/epic, sprint/reporting impact, and project conventions.
6. **Draft write content when asked.** Match project templates, ticket style, labels, fields, and issue-type requirements. Keep comments factual and attributable to the executing user.
7. **Gate writes.** Before create/update/comment/transition/assign/link/worklog/rank/label, present:

```text
Target issue/project:
Operation:
Exact content or fields:
Current issue state:
Workflow/field/link validation:
Expected effect:
Reporting or stakeholder impact:
Rollback or recovery path:
Confirmation required:
```

8. **Execute only after confirmation.** Run the approved connector write exactly. Re-read the issue afterward and compare expected state to actual state.
9. **Self-review.** Check issue keys, JQL, permissions, workflow validity, field metadata, exact content, sensitive-data redaction, and write gates.
10. **Deliver.** Provide results, traceability, writes staged/executed/skipped, verification, residual risks, and next exact action.

## Output Contract

Return:

- Mode and scope.
- Connector readiness and missing capabilities.
- JQL/search criteria used.
- Issues read with keys, titles, URLs or IDs, status, assignee, project, and relevant fields.
- Findings, summaries, or audit results with issue-level citations.
- Permission gaps, conflicting ticket data, stale tickets, blockers, and cross-project dependencies.
- Draft create/update/comment/transition/link/worklog content, if requested.
- Jira writes staged, approved, executed, verified, or skipped.
- Temporary artifacts created and cleaned up, or none.
- Residual risks and next exact action.

## Write Gate Rules

- One confirmation covers exactly one Jira write unless the user approves a named batch after seeing every item.
- Bulk confirmation must list every issue key and operation.
- Transition confirmation must include current status, target status, and valid-transition evidence when available.
- Create/update confirmation must include required fields and field metadata checks when available.
- Comment confirmation must include exact text and target issue.
- Assignment confirmation must include current assignee, new assignee, and notification/stakeholder impact.
- Worklog confirmation must include time spent, date, authoring identity, and comment if any.
- If the issue changed after staging, stop and restage.
- If verification fails after a write, report the mismatch and stop before further writes.

## Failure Modes

- **Ambiguous JQL:** Natural-language search maps to multiple plausible JQL queries. Show query or ask.
- **Attachment unsupported:** Connector cannot safely add/remove attachment. Redirect to Jira UI or supported path.
- **Bulk write overreach:** Batch includes issues not explicitly reviewed. List every issue before confirmation.
- **Connector unavailable:** Required Atlassian/Jira tools are absent or unauthenticated. Report blocker; do not fake Jira data.
- **Cross-project side effect:** Link/transition affects another project. Surface stakeholders and reporting impact.
- **Custom field shape:** Complex custom field value is guessed. Fetch allowed shape or ask.
- **Delete request:** User asks to delete issue/comment/worklog. Refuse destructive delete unless a future audited native mechanism and explicit backup policy exist.
- **Impersonation:** User asks to post as another person. Refuse and offer attributable wording.
- **Invalid transition:** Target status is not valid from current state. Fetch valid transitions or block.
- **Local artifact junk:** Ticket export/cache created without request. Remove or report.
- **Misleading comment:** Draft implies consensus, approval, or completion not supported by evidence. Correct it.
- **Missing required field:** Create/update omits required project field. Fetch metadata or block.
- **Permission gap:** Hidden fields/issues/comments change interpretation. Surface limitation.
- **Private-data exposure:** Ticket contains secrets, customer data, or regulated payloads. Redact values and report risk shape.
- **Sprint/reporting drift:** Ticket mutation affects sprint metrics, release notes, or velocity. Surface impact.
- **Stale ticket:** Ticket status or fields changed after read. Re-read before mutation.
- **Workflow automation surprise:** Jira automation modifies fields after write. Verify and report actual state.
- **Wrong issue:** Similar issue key or project prefix selected. Verify key and title before writing.

## Examples

### Search

Translate "my open payment bugs" into explicit JQL, run the search, return issue keys, titles, statuses, assignees, priorities, and the query used. Report permission gaps separately.

### Transition

Read the issue, fetch valid transitions, stage the target transition with current status and expected result, wait for confirmation, execute, then re-read to verify the status changed.

### Comment

Draft exact comment text as the executing user. Do not imply another person's approval. Gate the comment, post only after confirmation, then re-read comments to verify.

## Source Ledger

- OpenAI Codex skills documentation, `https://developers.openai.com/codex/skills`. Use for current skill frontmatter, progressive disclosure, sidecar metadata, invocation policy, dependency declaration, discovery, and invocation behavior; refresh before relying on mutable Codex runtime details.
- User-provided quality bar and active session instructions are task-local constraints, not reusable source truth; do not hardcode local config paths or private instruction files.

During use, verify the active Atlassian/Jira connector tool surface and refresh relevant Atlassian official documentation for Jira search/JQL, issue fields, workflow transitions, comments, links, worklogs, permissions, and REST/MCP behavior before relying on mutable Jira platform details.
