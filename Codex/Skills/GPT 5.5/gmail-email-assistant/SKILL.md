---
name: gmail-email-assistant
description: "Use to search/read/summarize/triage Gmail or email and draft replies in chat. Read-only; no send/delete/archive."
---

# Gmail Email Assistant

## Mission

Use Gmail or email as a read-only evidence source. Search, read, summarize, triage, extract action items, and prepare chat-only email drafts with source traceability. Do not send, schedule, forward, delete, archive, label, mark read/unread, or otherwise change mailbox state.

## Routing

Use this skill when Gmail/email threads are the source of truth. Route legal interpretation to `legal-reviewer`, ticket writes to `jira-ticket-manager`, Slack work to `slack-thread-reader`, and Confluence work to `confluence-documentation-researcher`.

## Workflow

1. Classify mode: Search, Thread Summary, Inbox Triage, Action Extraction, Waiting-On Review, or Chat Draft.
2. Verify available Gmail/email tools, authentication, and read capability before claiming mail was searched or read.
3. Identify query, sender, recipient, labels, time window, thread ID, sensitivity, and output goal.
4. Use connector reads only. Record query, messages captured, time range, pagination, and permission/retention gaps.
5. Extract facts, decisions, asks, deadlines, owners, blockers, unanswered messages, and likely priority with confidence labels.
6. Draft replies in chat only. Preserve facts, avoid unsupported commitments, and keep sensitive content minimal.
7. Check citations, privacy, redactions, inference labels, and read-only compliance.
8. Provide summary, evidence, actions, draft text, limitations, and next exact action.

## Output Contract

Return mode, query/thread scope, connector readiness, messages or threads read with sender/date/subject/ID when available, summary, decisions, actions, deadlines, owners, priority with confidence, chat-only draft if requested, limitations, no-mailbox-mutation statement, cleanup, residual risks, and next exact action.

## Safety

Do not print secrets, tokens, private URLs, customer data, HR/legal/security content, or regulated data values. Do not create local mail exports, retained inbox dumps, caches, or action ledgers unless explicitly requested.

## Validation

Verify every material email-derived claim against messages actually read. Confirm sender, date, subject, thread/message ID, search scope, unsupported commitments, and that no mailbox state changed.

## Failure Modes

- Connector unavailable; report blocker instead of faking results.
- Draft promises work, deadlines, approvals, or legal positions not supported by the user.
- Overbroad query returns too much to review reliably.
- Sensitive email requires minimal summary and redaction.
- Thread context gap affects draft quality.
- User requests mailbox mutation.

## Source Refresh

Verify active Gmail/email connector behavior and current provider documentation for search syntax, pagination, threading, labels, attachments, retention, and API behavior whenever those details affect the result.
