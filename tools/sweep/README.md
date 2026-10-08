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
