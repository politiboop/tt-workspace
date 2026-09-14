---
name: parallel-bash-shared-cwd
description: "Parallel Bash tool calls share one shell working directory, so a cd in one call can redirect commands in a sibling call"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5ec53e84-8707-4f83-8c1f-4bfc02bdae17
  modified: 2026-09-14T15:10:56.553Z
---

Parallel Bash calls issued in the same response share the shell's working directory. On 2026-09-14, `cd the-civics-desk && git checkout -- src/generated/update-counts.json` failed with "pathspec did not match," and a call meant to build `election-rigging` rebuilt the Civics Desk instead, because sibling calls were cd'ing into other repos at the same moment. Relative-path greps also reported "No such file."

**Why:** the failures look plausible (a build "succeeds," a push says "Everything up-to-date") while running in the wrong repo, so a commit, discard or style check can silently miss its target.

**How to apply:** when running Bash calls in parallel, use absolute paths, `git -C <repo>` and `npm --prefix <repo>`; keep any cd-dependent sequence inside a single call. After parallel commit/push work, confirm with `git -C <repo> show --stat HEAD`. Related: [[shared-memory-sync]]
