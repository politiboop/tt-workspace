---
name: project-press-chronology
description: "The sourced press-freedom ledger (2015-2026) lives at the workspace root as trump-press-chronology.md, built 2026-10-26 behind press-chronology/gate.py; how to extend it"
metadata:
  type: project
---

`/Users/brock/dev/politiboop/trump-press-chronology.md` (uncommitted as of 2026-10-27) is a 197-item ledger of acts by Trump and his administration against the press and public access to information, 2015 to October 2026, in the corruption ledger's shape, built as the source for a press version of The Count prototype.

**Why:** the user wants The Count to become a template for other topics, and the press topic needed a ledger of the same shape first. The tracker covers only 2026 densely, so earlier years came from five Sonnet research agents whose saved pages and map.tsv files are in `press-chronology/research/<period>/`.

**How to apply:** to extend it, cite URLs only from a tracker source list, a Civics/Dives source file, or a research `map.tsv`, then run `python3 press-chronology/gate.py` (exits 1 on any miss). The scratchpad build scripts (gen_tracker.py, overrides.py, assemble.py, qcheck.py) do not survive a restart; the ledger itself is the record. Rhetoric items need a threatened consequence or a named reporter or outlet. Related: [[project-corruption-chronology]], [[feedback-urls-only-from-map-tsv]], [[project-the-count-prototype]]

**Since the build (2026-10-26 and 27):** the Selzer suit had been counted twice (filing and dismissal); the dismissal was folded into the suit's bullet, so the count is 197. The chapter prose overstated its bullets in four places and was corrected; re-read the period prose after any ledger edit. The three tracker errors the build found (`bls-commissioner-fired` dated Aug 15 instead of Aug 1, 2025; `ej-antoni-bls-nomination` dated Aug 1 instead of Aug 11, withdrawn Sept 30; `trump-epstein-wsj-defamation-lawsuit-dismissed` giving the defendants' arguments as the judge's findings) were fixed in the tracker on 2026-10-27 with dated correction notes, and the same wrong BLS date was fixed on the research site's attacks-on-science page and the Civics Desk science explainer. The unsourced "first BLS commissioner ever fired in 140-year history" claim was softened the same day on all three sites to Erica Groshen's "unprecedented" (Newsweek, Sept 5, 2025), the entry's title included; superlatives need a source that states the history.
