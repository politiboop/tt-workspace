---
name: civics-style-hook-needs-content
description: The Civics Desk style-check.sh hook silently passes if given only a file_path; pipe the article content in to actually run it
metadata: 
  node_type: memory
  type: project
  originSessionId: 5ec53e84-8707-4f83-8c1f-4bfc02bdae17
  modified: 2026-09-16T16:11:52.926Z
---

`the-civics-desk/.claude/hooks/style-check.sh` reads `.tool_input.content` (or `new_string`) and exits 0 immediately when that is empty. Invoking it by hand with only `{"tool_input":{"file_path": ...}}` therefore always "passes" without checking anything (found 2026-09-16; earlier manual runs done that way were vacuous).

**Why:** Articles edited by script (node/perl) never trigger the PostToolUse hook, so the manual run is the only style gate for those edits.

**How to apply:** run it with the full text:
`jq -n --arg f "$PWD/<path>" --rawfile c <path> '{tool_input:{file_path:$f, content:$c}}' | bash .claude/hooks/style-check.sh`
Its "let's" counter is a plain substring count, so hits inside direct quotes (e.g., Trump saying "let's say") are false positives; check context before rewriting.

Related: [[civics-desk-augmentation]]
