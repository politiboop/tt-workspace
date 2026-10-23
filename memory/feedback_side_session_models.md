---
name: feedback-side-session-models
description: "Every side session and subagent gets the cheapest model that can do its job, set explicitly; never let one inherit the main session's model"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5ec53e84-8707-4f83-8c1f-4bfc02bdae17
  modified: 2026-10-23T13:30:00.000Z
---

Standing rule (restated by the user 2026-10-23, "from now on"): whenever launching a side session or a subagent, pick the cheapest model that can actually do the work, and pass `model` explicitly. Never let it inherit the main session's model (Fable or Opus).

- **Haiku:** pure lookups and mechanical checks with no judgment (grep a corpus, run a script and report its output, list files).
- **Sonnet (default):** sweep research agents, fetching and saving articles, config and CSS edits, builds, verification runs, link checks, data entry from verified notes.
- **Opus:** work needing real engineering or editorial judgment (new build plugins, routing changes, page redesigns, severity calls on contested stories, Civics Desk prose).
- **Fable:** main session only, never a sub-session.

**Why:** On 2026-10-22 three fix sessions inherited Fable because no `model` was set, and the user asked "Do we need to use Fable for those? 😬". On 2026-10-23 they made it a standing rule: use the model that has the abilities needed while conserving tokens and cost.

**How to apply:** Decide the model before launching, state it in the brief or card, and keep briefs tight so cheaper models succeed the first time (a failed cheap run that must be redone costs more). If a session is already running on the wrong model, switch it with `set_session_model`. Related: [[project-sweep-research-agents]]
