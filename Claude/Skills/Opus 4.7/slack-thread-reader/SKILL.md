---
name: slack-thread-reader
description: |
  Requires a configured Slack MCP or connector; if missing or unauthenticated, report the blocker and required user action instead of claiming Slack was searched or read. Reads, searches, summarizes, and extracts decisions or unanswered questions from Slack when that connector is available. Use for "summarize this Slack thread," "read this Slack permalink," "search Slack for X," "what happened in #channel," "find decisions in Slack," "find unanswered questions," "summarize on-call channel," or "draft a Slack reply in chat." Avoid Slack-side sends, drafts, scheduled messages, canvases, reactions, pins, access escalation, retention bypass, Confluence/Jira work, and non-Slack platforms.
when_to_use: Use when Slack is the source of truth for messages, threads, channel activity, users, profiles, or canvases and a Slack connector is configured, or when the correct response is to report missing Slack connector/auth setup. Also use when the user wants Slack text prepared in chat. Do not use for Teams/Discord/email, Confluence/Jira, external research, or any Slack write unless the user's global Slack read-only policy is explicitly changed.
argument-hint: "[permalink/channel/user/time window/search query/thread/draft text]"
---

# Slack Thread Reader

## Mission

Use Slack as a read-only evidence source. Search, read, summarize, and extract decisions with permalink traceability. Prepare Slack message drafts in chat only. Do not create Slack drafts, send messages, schedule messages, create canvases, update canvases, add reactions, pin messages, or perform any other Slack write while the user's Slack read-only rule is active.

Do not create local Slack exports, caches, action logs, or retained message dumps by default.

## Definitions

- **Connector:** The active Slack MCP, plugin, app, or API tool surface available in the current runtime.
- **Read-only action:** Searching messages/channels/users, reading threads, reading channels, reading profiles, reading canvases, and summarizing accessible content without changing Slack.
- **Slack write:** Sending, scheduling, drafting in Slack, creating or updating canvases, adding reactions, pinning, bookmarking, joining/leaving channels, changing channel metadata, or modifying messages.
- **Permalink traceability:** Each material message-derived claim cites permalink or channel+timestamp, author display name when available, and timestamp.
- **Permission-scoped result:** Slack content hidden or partially visible because of channel membership, workspace permissions, retention, Slack Connect boundaries, or API scopes.
- **Decision:** A message or thread state that indicates an agreed direction, explicit decision marker, owner assignment, approval reaction, or resolution.
- **Unanswered question:** A question or ask that lacks a reply, reaction, owner, or resolution within the requested time window.
- **Regulated or sensitive content:** Messages involving legal, HR, security incidents, customer data, credentials, payment data, medical data, compliance, or other restricted material.

## Non-Negotiables

- Verify the active Slack connector and required read capability before claiming Slack was searched or read.
- Treat Slack as read-only unless the user explicitly changes the global Slack policy.
- Do not perform Slack-side writes, even with stage approval, while read-only policy is active.
- If the user asks to send, schedule, react, pin, create a canvas, or create a Slack draft, provide the proposed content in chat and state that no Slack write was performed.
- Do not substitute memory, web search, or guessed context for Slack connector reads.
- Cite material Slack-derived claims with permalink or channel+timestamp traceability.
- Surface permission gaps, retention gaps, deleted/edited messages, pagination limits, and search index limitations.
- Respect DMs, private channels, Slack Connect, and regulated-channel sensitivity. Do not expand audience or quote sensitive content unnecessarily.
- Redact secrets, tokens, credentials, private URLs, customer data, and regulated payload values.
- Distinguish observed messages from inferred consensus, inferred decisions, and unresolved questions.
- Do not claim consensus when dissent or unresolved questions remain.
- Do not create local exports or retained Slack artifacts unless explicitly requested.

## Workflow

1. **Classify mode.** Read Thread, Read Channel Summary, Search, Decision Extraction, Unanswered Questions, Profile/User Context, Canvas Read, or Chat Draft.
2. **Verify connector readiness.** Confirm Slack tools are available, authenticated, and support the requested read mode. If unavailable, report the exact missing connector/tool capability.
3. **Resolve scope.** Identify permalink, channel, channel ID, user, time window, search query, thread root, canvas, privacy class, and sensitivity signals.
4. **Run read-only discovery.** Use connector reads only. Record query, channel, time window, messages captured, pagination state, permission gaps, and retention limits.
5. **Build traceable evidence.** For each material claim, attach permalink or channel+timestamp, author, and timestamp when available.
6. **Extract decisions or questions.** Identify explicit decision markers, owner assignments, approvals, objections, unresolved questions, and follow-up asks. Label confidence.
7. **Handle sensitive content.** Redact values and summarize only the minimum needed for the user's requested purpose.
8. **Prepare chat-only drafts when asked.** Write Slack-ready text in chat. Do not write it into Slack or a Slack draft.
9. **Self-review.** Recheck traceability, permissions, privacy, consensus claims, redactions, partial coverage, and read-only compliance.
10. **Deliver.** Provide summary, evidence, decisions/questions, limitations, draft text if requested, and next exact action.

## Output Contract

Return:

- Mode and scope.
- Connector readiness and missing capabilities.
- Query, permalink, channel, user, and time window used.
- Coverage: messages captured, pagination limits, retention gaps, and permission gaps.
- Summary with permalink/channel+timestamp citations.
- Decisions, owners, objections, dissent, and confidence.
- Unanswered questions and follow-up candidates.
- Sensitive-content redactions or privacy caveats.
- Chat-only Slack draft, if requested.
- Explicit statement that no Slack write was performed when a draft or send-like request was involved.
- Temporary artifacts created and cleaned up, or none.
- Residual risks and next exact action.

## Validation

- Verify each material Slack-derived claim against messages actually read through the Slack connector.
- Confirm permalink or channel+timestamp traceability for decisions, owners, objections, unanswered questions, and summaries.
- Check that inferred consensus, inferred urgency, and unresolved questions are labeled with confidence and not presented as observed facts.
- Confirm no Slack message, draft, scheduled message, canvas, reaction, pin, bookmark, channel membership change, or metadata change was performed.
- State permission, retention, pagination, deleted/edited-message, Slack Connect, search-lag, and privacy limitations that could affect coverage.

## Read-Only Rules

- A request to send becomes a chat-only draft.
- A request to schedule becomes a chat-only scheduled-message draft plus no Slack action.
- A request to create or update a canvas becomes chat-only canvas content.
- A request to react or pin becomes a recommendation in chat.
- A request to join, invite, change channel settings, or access private content is refused or routed to the Slack UI/admin path.
- If the user explicitly changes the global Slack read-only policy, re-audit this skill before enabling Slack-side writes.

## Failure Modes

- **Access escalation:** User asks to read a channel they cannot access. Refuse and suggest proper access request.
- **Connector unavailable:** Slack tools are absent or unauthenticated. Report blocker; do not fake Slack results.
- **Decision overclaim:** Reaction or casual agreement is treated as binding. Label confidence and evidence.
- **Deleted or edited message:** Source changed after read. Report if detected.
- **DM sensitivity:** DM/MPIM content has narrower audience. Summarize minimally and avoid unnecessary quotation.
- **False consensus:** Summary collapses disagreement into consensus. Surface dissent.
- **Local artifact junk:** Export/cache/log created without request. Remove or report.
- **Pagination gap:** Not all messages were retrieved. State captured range and cursor/limit status.
- **Permission gap:** Channel/thread/profile is not visible. Report permission-scoped limitation.
- **Retention bypass:** User asks to evade retention or compliance controls. Refuse.
- **Retention gap:** Messages are outside retention. Report unavailable history.
- **Search lag:** Recent messages may not appear in search. Prefer direct thread/channel reads when possible.
- **Sensitive data exposure:** Secret or private data appears. Redact values.
- **Slack Connect boundary:** External workspace participants are present. Surface audience/privacy caveat.
- **Unanswered-question false positive:** Question was answered elsewhere in thread/channel. Cross-check before listing.
- **Write request:** User asks for send/draft/canvas/reaction/pin. Provide chat-only content and perform no Slack write.

## Examples

### Thread Summary

Read the thread from the permalink, preserve message order, summarize decisions and objections, and cite each claim with permalink and author/timestamp.

### Channel Search

Search for a term in a named channel over a time window, return relevant messages with permalinks, and state whether pagination, permission, or search lag may have hidden results.

### Chat-Only Draft

When asked to send a Slack reply, draft the exact reply in chat, name the intended channel/thread, and state that no Slack draft or message was created.

## Source Refresh

- Claude Code skills documentation, `https://code.claude.com/docs/en/skills`. Used for skill frontmatter, lifecycle, sidecars, and model/effort inheritance.
- User maximum-quality standard, `C:\Users\James\.claude\output-styles\maximum-quality.md`, use at execution time as the local policy source. Used for local quality bar and Slack read-only rule.

During use, verify the active Slack connector tool surface and refresh relevant Slack official documentation for search, conversations, pagination, permalinks, retention, Slack Connect, canvases, user/profile reads, and API behavior before relying on mutable Slack platform details.
