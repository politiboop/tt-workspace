---
name: sweep-research-agents
description: "In tracker sweeps, research subagents share one 200-WebSearch session cap, and helper agents they spawn report to main, leaving the parent waiting"
metadata:
  node_type: memory
  type: project
  originSessionId: 5ec53e84-8707-4f83-8c1f-4bfc02bdae17
  modified: 2026-09-28T14:54:48.580Z
---

Learned in the September 28, 2026 sweep (b28), which used six parallel research agents:

- **WebSearch is capped at 200 calls per session, shared by every subagent.** Six agents exhausted it partway through; later agents fell back to fetches, Google News RSS and headless-browser resolution, and could not run debunk or right-leaning-outlet searches. Main-session WebSearch is gone too once it hits. Agents noted `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` as the setting that raises it.
- **Nested helpers report to the main session, not to their parent.** When a research agent spawns its own helper agents, the helpers' completion notices arrive in the main conversation, and the parent keeps "waiting" forever. Fix: SendMessage the parent saying the helpers finished and ask for its final report on the stories it handled itself.
- A shared `RULES.md` in the sweep scratch dir (save full text + map.tsv, exact headlines, verbatim quotes, flag single-source) worked well; the saved texts let `dive4/qcheck.js` verify every quote before commit.

**How to apply:** give each agent a search budget (about 25) in its prompt, tell it not to spawn helpers, and front-load the stories most likely to need search.

Related: [[news-check-reddit-rss]], [[parallel-bash-shared-cwd]]
