---
name: shared-memory-sync
description: memory/ at the workspace root (tracked by tt-workspace) is the version-controlled mirror of local auto-memory; keep both in sync on meaningful changes
metadata:
  type: reference
---

Two memory locations exist for this workspace and they should stay in sync:

- **Local auto-memory:** `/Users/brock/.claude/projects/-Users-brock-dev-politiboop/memory/` — what Claude Code reads/writes by default. Per-machine, does not sync through Claude Code.
- **Shared repo copy:** `/Users/brock/dev/politiboop/memory/` (tracked by the `tt-workspace` repo, whose working tree is the workspace root) — version-controlled backup. Survives machine moves and is the only thing that gets a fresh machine caught up.

**Why:** `CLAUDE.md` (new-machine setup, step 6) names the repo copy as the canonical backup because auto-memory doesn't sync via Claude Code.

**How to apply:**
- When adding or meaningfully editing a memory file, mirror the change in both locations.
- Trivial re-saves don't need mirroring every time — sync periodically when changes accumulate.
- On a fresh machine, copy `memory/*.md` (from the freshly cloned tt-workspace working tree at the workspace root) → local auto-memory dir (create if absent) before doing real work.

Related: [[politiboop-macos-migration]]
