---
name: politiboop-macos-migration
description: Workspace migrated from Windows G:/git/politiboop/ to macOS /Users/brock/dev/politiboop/ on 2026-05-26; SSH alias and per-dir git identity wired up
metadata:
  type: project
---

The politiboop workspace now lives on macOS at `/Users/brock/dev/politiboop/` (migrated from Windows `G:/git/politiboop/` on 2026-05-26). The `tt-workspace` repo's working tree IS the workspace root; the four content repos (`controversial-trump`, `controversial-trump-research`, `the-civics-desk`, `stand-against-trump`) are cloned as gitignored siblings inside it.

**Why:** User moved development machines. Account isolation is non-negotiable — they juggle multiple GitHub identities and never want the wrong key/email to slip through.

**How to apply:**
- Always clone via the `github-politiboop` SSH alias (e.g. `git@github-politiboop:politiboop/REPO.git`). Plain `github.com` URLs would use the wrong (`id_ed25519_nora`) key and fail with a permission error.
- `~/.gitconfig` has `includeIf gitdir/i:/Users/brock/dev/politiboop/` → `~/.gitconfig-politiboop`, which sets `user.name = politiboop` and `user.email = 250234216+politiboop@users.noreply.github.com` automatically inside this dir. Verify with `git config user.email` if uncertain.
- Older notes/scripts may reference `G:/git/politiboop/...` — those paths are stale; adapt to `/Users/brock/dev/politiboop/...`.
- `CLAUDE.md`, `.claude/skills/`, `.mcp.json`, and `memory/` all sit at the workspace root and auto-load when Claude Code runs anywhere under `/Users/brock/dev/politiboop/`.
- `run-all.sh` (macOS/Linux) launches all four dev servers in the background; logs go to `.run-all-logs/<site>.log`. `run-all.ps1` is kept in the repo as the legacy Windows orchestrator for cross-OS users.
- `gh` CLI is not configured for the politiboop account yet — defer to git/SSH for now. If/when needed, set up scoped `GH_CONFIG_DIR` so politiboop auth doesn't bleed into other accounts.

Related: [[shared-memory-sync]]
