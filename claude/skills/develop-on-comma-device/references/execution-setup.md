# Prepare device execution

## Windows scripts and source exports

For multiline SSH scripts sent from Windows, pass LF-encoded input to the remote shell through a subprocess argument list; quote any interpolated data for the receiving shell.

Over SSH, `pkill -f` and `pgrep -f` patterns also match the remote shell whose command line contains them, so they can kill your own session or count it. Stop processes by PID, or write the pattern so it cannot match itself, such as `[s]cons`.

When exporting Git sources from Windows for Linux execution, use `git -c core.autocrlf=false archive ...`. Git archive can apply checkout line-ending conversion even when stored blobs use LF. Verify exported executable shebangs, line endings, modes and symlinks before staging; preserve binary payload bytes.

When overlaying changed sources onto an existing incremental build tree, ensure the build system detects the new content, and build with the same options the tree was built with (for a device tree, the boot build's command without extra compiler flags): changed flags change every object's signature and rebuild the whole target. Reused fixed timestamps can bypass timestamp-gated content checks; use timestamps distinguishable from cached values or force content checking/recompilation. Before claiming a build incorporates the changes, verify the affected compilation and linking occurred; source hashes or an "up to date" result alone do not establish this. Files built before the device clock syncs carry the boot clock's date, so check what a compiled object contains rather than comparing timestamps.

## Swapping in a test binary

To run a test build of the UI without touching the installed files, build it outside the installed tree (in RAM, for example in an overlay under `/dev/shm`, when it fits), bind-mount it over the installed binary and kill the running UI; the manager's watchdog starts the mounted one about five seconds later. This replaces a running process, so SKILL.md's device rules apply: on a driving device only when the request covers it. It works only for a process with a manager watchdog (`watchdog_max_dt` in `system/manager/process_config.py`; currently only the UI). The manager does not restart any other process that exits, so those need an openpilot restart (run `touch /tmp/booted` first, as SKILL.md says). Two traps:

- The watchdog restarts the UI only after it has seen a kick from that process, so a test UI that crashes during startup stays dead until openpilot restarts. After the swap, check that the new process is alive and has a `/dev/shm/wd_<pid>` file. If it died before its first kick: first remove the test mount, then write a fresh eight-byte timestamp (`struct.pack('Q', int(time.monotonic() * 1e9))`) to `/dev/shm/wd_<pid>` for the pid the manager started (`managerState` still lists it). The manager takes that as a kick, times out five seconds later and starts the UI again. A process that has already kicked is restarted without this.
- The UI changes directory to the folder of its executable, so a copy started from another path cannot find its files and crashes at startup. To run it through a wrapper script (for example to set `LD_PRELOAD`), bind-mount the binary over an unused file in `selfdrive/ui`, such as `main.o`, and the wrapper over `selfdrive/ui/ui`; the wrapper must `exec` the binary so it keeps the pid the manager watches. The process is then named after the file it was mounted over, so find it by pid.
