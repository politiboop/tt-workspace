---
name: feedback-daily-update-delegation
description: "The daily update runs as a chain of cheaper agents (Sonnet triage and research, Opus writer and cross-site carry) with the main session only deciding, reviewing, committing and pushing"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5ec53e84-8707-4f83-8c1f-4bfc02bdae17
  modified: 2026-10-27T13:20:03.217Z
---

Standing arrangement from the user (2026-10-27): "designate sub-sessions for things that we can using 'lesser' agents who are still capable of doing what needs to get done as part of our daily update", to conserve tokens while keeping the result world-class. The main session (Fable) keeps only the judgment and the irreversible steps.

The chain, with the briefs kept in tt-workspace `tools/sweep/` (the scratchpad is wiped on restart):

1. **Feeds** (main, two curl calls a minute apart): `day.rss` and, when sweeps are days apart, `week.rss` into the sweep folder.
2. **Triage** (one Sonnet agent, `TRIAGE.template.md`): parses the feeds, applies the scope rule, dedupes against the corpus, writes `triage.tsv`, proposes research groups. No fetching or search.
3. **Decide** (main): pick the stories, set holds and severity ceilings in `decisions.md`.
4. **Research** (Sonnet agents, `RULES.template.md`, two at a time, headless only, search budget about 8 each, no helpers): save texts and `map.tsv`, and write `report.md` in their folder as well as returning it.
5. **Write** (one Opus agent, `WRITER.template.md`): entries and updates through `apply.py` with a `U()` map.tsv lookup for every URL, then qcheck, sync, audit, verify-sources (structural and `--live --since today`). Reports to `writer-report.md`. No commits.
6. **Review** (main): read the diff of every entry against the rubric and the saved texts, spot-check quotes, fix severity or wording.
7. **Cross-site** (one Opus agent, `CROSS-SITE.template.md`): research fallback count and tickers, Rigged cards and `LAST_UPDATED`, Dives when a seed entry changed, Civics as a candidate list only. No commits.
8. **Commit, push, report, wiki note** (main): pathspec commits only (other sessions share the working trees), the Civics Desk only on the user's word.

**Why:** Fable reading every target entry and writing every update was the bulk of a sweep's cost; the writing and carrying are rule-driven once the research is verified, and the briefs already encode the rules.

**How to apply:** Set `model` on every agent (Sonnet for triage and research, Opus for the writer and cross-site). Keep the main session's own reading to the triage list, the decisions, the diffs and the reports. If a cheaper agent fails a step, redo that step on the next model up, not on Fable. Related: [[feedback-side-session-models]], [[project-sweep-research-agents]], [[feedback-urls-only-from-map-tsv]], [[news-check-reddit-rss]]
