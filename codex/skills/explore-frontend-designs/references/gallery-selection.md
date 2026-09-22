# Gallery selection handoff

Use for interactive comparison rounds. [../assets/gallery-template.html](../assets/gallery-template.html) implements the controls below and the static-bridge wiring; fill in its placeholders rather than starting over.

The gallery gives the user:

- a clear "Choose this direction" action beside each option and in its full-size view, separate from product controls and preview navigation, bound to the exact round and the option's stable ID and name, for every presented version;
- a way to reject the set or keep exploring, with optional notes, combined traits or uncertainty, never forcing an explanation or making the user diagnose what is wrong;
- an optional note that travels with any choice, reachable from the full-size view as well as the index;
- one button in the full-size view that switches the preview between the desktop, tablet and phone widths, so the user never needs browser developer tools to see another width;
- an "open in new tab" link beside each option that opens it in that full-size view, full-window, and one action that opens every option that way, each in its own tab, and says when the browser opened fewer (pop-up blocking).

An embedded preview pane may open new-tab links in place, so also give the user the gallery's address for their regular browser.

Connect a deliberate selection action to the executing session. Prefer a documented callback supplied by the actual rendering host; do not assume a standalone page has an embedded host's API. Otherwise use the smallest local handoff supported by the preview runtime and execution tools. Reuse an existing integration when it satisfies the same contract. In Claude Code, use `review_bridge.py` below and open its `READY` URL in the Browser pane when it is available; a gallery published as an Artifact cannot reach the helper.

The submitted data identifies the exact round, design ID and optional feedback. Show success only after acknowledgement, prevent repeat submissions, and surface failures without pretending the choice was received. Interpret the result as design feedback within the current task's boundaries. Opening a preview, highlight state, browser storage, a preselected default, elapsed time or silence is not a submitted selection. Keep the active round associated with its question so a delayed answer is not applied to a newer set.

If the environment cannot support the requested gallery handoff, explain the concrete limitation and offer a native clickable question as the fallback, listing the directions in gallery order with neutral labels and no recommended option unless the user asked for your pick; for these taste choices this overrides a general preference for leading with a recommendation. When the set has more options than the question tool allows, or no supported clickable path is available, ask in chat by design ID. Do not add unrelated services, hooks or background automation.

## Static local galleries

[../scripts/review_bridge.py](../scripts/review_bridge.py) serves a static artifact directory on loopback and emits one accepted selection to its command output. Use it when no existing gallery handoff is available; other preview stacks should use their own runtime rather than impose a static server.

Start it through the execution tools with an available Python runtime:

```text
python <skill-directory>/scripts/review_bridge.py --root <artifact-directory> --round <round-id> --choices <ids...> --port <port>
```

Port `0` selects an available port. Open exactly the URL in the `READY` output; the helper refuses any other host name, including `localhost`. List in `--choices` every ID the gallery can send, including the ID its reject or keep-exploring action sends (for example `explore`); the helper refuses any other value. Serve the gallery and its dependencies beneath the artifact root, preserving earlier round files. Retain the command/session ID, origin and active round in the existing task state.

Gallery actions POST JSON `{round, choice, note}` with `Content-Type: application/json` to `/__review_selection` from a page the helper serves; `note` is optional and the body must fit within 8192 UTF-8 bytes. The helper returns an acknowledgement with the accepted round and choice, and emits a flushed `SELECTION` line containing the submitted data. Start the helper as a background command that stays alive for the whole review: where the host limits background commands, as Claude Code documents (30 minutes by default, or a longer `timeout` up to 2 hours), pass a timeout that covers it. If the helper stops before a selection arrives, restart it with the port from its first `READY` output and the same round and choices. Use the execution tool's bounded waits to receive that output. Verify its process, active round and allowed choice before continuing; consume each selection once.

The helper keeps serving files after selection. It cannot wake a finished task by itself. In a Claude Code main session, a background command that exits when the `SELECTION` line appears in the helper's output re-invokes the session, so you may end the turn after starting one with a timeout that covers the review. Elsewhere, keep the turn active while waiting, and never end the turn while claiming to await this event. Remain responsive to other user input and controlling limits; a verified rendering-host callback may instead deliver a new user message after a turn ends.

When the round's response arrives in chat instead, stop its bridge; serve the files statically at the same origin if the previews are still needed. Use one active selection endpoint for the review tree. Before advancing to another round, including through chat or delegated feedback, stop the previous bridge and restart with the port from its first `READY` output and the same root with the new round and choices. Old static previews remain addressable but their old round submissions are rejected. If the review ends without another round, close the selection bridge; use ordinary static serving at that origin if preview access is still needed. Do not leave an unsubmitted old endpoint accepting choices.

## Verify and prepare for real selection

Exercise the actual gallery wiring in a test instance on its own port, never the instance the user may be choosing in. Confirm from the page code that each choice control, including the keep-exploring action, sends its own ID and that every such ID is in `--choices`. Submit one choice and confirm that success appears only after an accepted acknowledgement, that the `SELECTION` line matches, and that the page then blocks another choice. Reload the page, submit again, and confirm the page shows the helper's duplicate rejection as a failure rather than success. Testing the helper alone does not verify a particular gallery's bindings. Treat synthetic choices as test data. Since the helper accepts only one submission, stop the test instance afterward and launch a fresh instance at the intended origin with the real round and complete choice set. Reopen the gallery in its initial state and verify fresh `READY` output before presenting it; do not consume that instance's choice during testing.

For a host callback or existing runtime integration, establish the equivalent lifecycle and evidence using its supported contract. Do not add an assumed callback, hidden application endpoint or background automation to make a disconnected control appear functional.
