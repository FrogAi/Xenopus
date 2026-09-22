---
name: develop-on-comma-device
description: Use a comma device (comma three or 3X) for openpilot development, testing, debugging and hardware measurements, and an in-car device to retrieve personal driving logs. Use proactively when device evidence can materially answer the task; ordinary local work need not contact a device.
---

# openpilot Development on comma Devices

## Device roles and authority

Each device has one of two roles. The user's local instructions name which device has which role and its SSH alias; ask when that is missing.

**A development device** is for development. Use it freely for task-relevant development, demanding tests, multi-variant experiments, simulation, replay and hardware measurements. Standing authorization covers file and system changes, software installation, builds, configuration, process management, restarts and reboots. Proceed without routine permission requests; development downtime is acceptable. Preserve unrelated work and evidence needed by other tasks.

**A driving device** is the one the user drives with. Its default role is lightweight, read-only inspection and retrieval of driving logs. Copy the needed logs to the PC or a development device for analysis, replay and experiments, preserving originals. Keep its software, settings, services and recordings unchanged for retrieval work; do not install tooling or start builds, benchmarks or other heavy workloads there merely to analyze logs. An explicit request can authorize other work within that request's scope; a development device's broad authorization does not transfer to a driving device.

Being installed in a car does not prohibit ordinary work. Before an action could actuate the vehicle, disrupt active driving assistance or materially contend with it, establish current conditions and use an isolated replay, bench setup or suitable controlled test with a safe transition out of active control. Do not make those interventions during active driving. Unknown vehicle state does not block non-interfering inspection or analysis.

## Access the selected device

Addresses, accounts, keys and host trust belong to local SSH configuration, outside this skill. Verify the selected connection and actual execution host/account before accessing data or making changes. If already on the intended device, use its local tools.

From the PC, use a verified native Codex connection when device-side execution fits the task, or standard SSH/SCP with the selected alias. For driving-log retrieval, prefer a lightweight transfer and run analysis elsewhere. A saved app entry alone does not establish a working remote runtime: verify the CLI, authentication and required skills before relying on native execution. Diagnose access failures through the configured connection; preserve existing host trust and never disable verification, blindly replace trust entries or expose credentials. A device's network address can change after a reboot. To find one again, look for the comma network adapter's MAC prefix in the PC's ARP table (a comma device answers ping with TTL 64), then confirm its identity against the stored host key by connecting with `-o HostName=<new address> -o HostKeyAlias=<old address>` and strict checking before updating the alias's address.

On the device, starting points are `/data/openpilot`, `/data/params/d` and `/data/media/0/realdata`. Verify current paths and required privileges on the selected device. `/home` is a temporary overlay; keep staging, checkouts and anything else that must survive a reboot under `/data`. `/tmp` is a small tmpfs (about 150 MB on a comma three), so point build and tool temp directories (for example `TMPDIR`, `GOTMPDIR`) under `/data` for large builds. Build on the device only while it is offroad: a build's load while onroad competes with the UI and other real-time processes, which disturbs the drive state and whatever is being measured or investigated.

Read [execution-setup.md](references/execution-setup.md) when sending SSH scripts from Windows, stopping device processes by pattern, rebuilding an existing build tree on the device, running a test binary in place of an installed one, exporting Git sources from Windows for Linux execution, or setting up or recovering native Codex execution, including after reboot.

## Work on the actual device state

Inspect the relevant source revision, branch, dirty files, installed/running artifacts, settings, workload and free space on `/data` before changing or measuring them. Read applicable device/repository instructions. Preserve existing edits, logs and other sessions' work. Use a task-specific staging area or checkout where it prevents interference; do not reset a dirty checkout to make deployment convenient.

Use `$engineer-production-changes` for engineering and `$coordinate-specialists` for useful delegation and independent scrutiny. Give each mutable device resource one owner; serialize experiments that compete for the same hardware or state. Independent local analysis can run in parallel. Do not stop an unidentified process merely to make a benchmark quieter.

Other sessions may use a development device at the same time. Keep each task's files under `/data/agent_test/<task>/`. Before work that would disturb others' measurements or the device's availability, such as timing runs, restarts, reboots or heavy disk activity, take the shared lock: create `/data/agent_test/DEVICE_EXCLUSIVE` with `mkdir` and put a note inside saying who holds it and why. Let the `mkdir` itself be the check, and run the disturbing work only if it succeeded (in a script, stop when it fails). While another session holds it, read the note inside and wait. Remove it when done, and tell sessions waiting on it that it is free.

After deploying or building, verify which source, binary and settings actually run. An uploaded file or successful build does not establish that the intended behavior is active. After a restart or reboot, reconnect and check the intended state. With automatic updates on, a device installs newly pushed commits on its branch and reboots by itself, so recheck the running revision and uptime before relying on earlier state. After a timeout or disconnect, inspect remote job state before retrying; a lost connection does not prove the job stopped. Keep any repository settings the device depends on, such as a `core.sshCommand` for a private remote, through a reinstall.

Before starting or restarting the `comma` service (`sudo systemctl restart comma`, or `start` after a stop), run `touch /tmp/booted`; a reboot needs nothing. AGNOS's launcher (`/usr/comma/comma.sh`) runs its factory-reset checks whenever that file is missing, and opens the "System Reset" screen if the touchscreen's touch count is above four. The launcher creates the file at boot, but it has been found missing later in the same boot, most likely removed by systemd's temp-file cleanup (which runs 15 minutes after boot) because the file carries the unsynchronized boot clock's date. Run the `touch` every time rather than checking for the file. If the reset screen does appear, leave it: it erases nothing unless Confirm is pressed twice, and after three minutes it exits and openpilot starts.

Read only the methods needed for the task:

- For crashes, hangs, investigation of an incident before a reboot, or finding what caused an unexpected change on the device, read [crashes-and-hangs.md](references/crashes-and-hangs.md).
- For behavior tests on the device (including forcing it onroad on the bench), behavior or performance comparisons and hardware measurements, read [comparisons-and-measurements.md](references/comparisons-and-measurements.md).

## Preserve evidence and report outcomes

Keep driving logs and derived private material within authorized storage and analysis destinations. Clean up only this task's temporary artifacts and restore its temporary changes as appropriate, preserving required evidence, intended final changes and others' work. Test runs also leave artifacts outside their working folder: `OPENPILOT_PREFIX` params namespaces under `/data/params` and `/cache/params` (a symlink and its `.tmp_*` target; name each explicitly, since the live params use the same pattern), screen recordings, settings backups and forced params. Report what changed, what was measured and any unresolved limits.

## Improve the reusable method

When feedback or device work reveals a lasting preference, a verified connection change or a useful reusable testing method, use `$improve-personal-customizations` to repair this skill or its responsible dependency during the task. Rewrite or simplify coherently when warranted. Keep addresses, unique host identifiers, personal paths and credentials in local connection settings, outside the skill. Keep transient branch state and one-off results out of reusable instructions.
