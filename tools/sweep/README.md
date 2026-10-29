# Sweep helpers

The session scratchpad is wiped when the app restarts, so the sweep's helper files live here.
For a new sweep folder `$S` (e.g. the scratchpad's `b42/`):

    cp tools/sweep/apply.py tools/sweep/qcheck.py "$S"/
    sed 's/bNN/b42/; s/<DATES>/October 8-9, 2026/' tools/sweep/RULES.template.md > "$S"/RULES.md

Then set `TODAY` in `$S/apply.py`. Research agents read `$S/RULES.md` and save their texts and `map.tsv`
under `$S/<letter>/`. Run `python3 qcheck.py` from `$S` before syncing: it checks every new quote against
the saved texts and flags any new source URL that no `map.tsv` lists (a URL nobody actually loaded).

- `apply.py`: `load`, `save`, `update(id, paras=, facts=, sources=[(text,url,type)], replace=, title=, severity=)`,
  `create(entry)`. Rejects duplicate source URLs, bad source types and dashes in titles; sets `updatedDate`.
- `qcheck.py`: quote and URL tracing against the sweep folder it sits in.

## Agent briefs (since b54, October 27, 2026)

The sweep runs as a chain of cheaper agents; the main session decides, reviews, commits and pushes.
Instantiate each brief into the sweep folder with `sed` (replace `bNN`, `<SWEEP_DIR>`, `<TODAY>`,
`<CUTOFF>`, `<EXTRA_URLS>`, `<PRE_EXISTING_CHANGES>` as each template names them):

- `TRIAGE.template.md` (Sonnet): parses the saved feeds, applies the scope rule, dedupes against the
  corpus, writes `triage.tsv`, proposes research groups. No fetching, no search.
- `RULES.template.md` (Sonnet research agents, two at a time): save texts and `map.tsv`, and also save
  the final report as `<letter>/report.md` through Bash.
- `WRITER.template.md` (Opus): entries and updates through `apply.py` with a `U()` map.tsv lookup for
  every URL, then qcheck, sync, audit and verify-sources; `writer-report.md`. No commits.
- `CROSS-SITE.template.md` (Opus): research fallback count and tickers, Rigged cards, Dives when a
  seed changed, Civics as candidates only; `cross-site-report.md`. No commits.

The main session writes `decisions.md` between triage and research (holds, severity ceilings, what to
write) and reviews every diff before committing.

## Feeds

Fetch into the sweep folder, a minute apart for Reddit (rate limit): `day.rss`
(`https://www.reddit.com/r/politics/top/.rss?t=day&limit=100`), `week.rss` when sweeps are days apart
(`...?t=week&limit=100`), and `justsecurity.rss` (`https://www.justsecurity.org/feed/`, added October 29,
2026: its "Just the Docs" posts carry primary court documents, and its trackers, such as the
"presumption of regularity" study, collect judges' findings against the administration with citations).
