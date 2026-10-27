# Tools: building an edition's prologue

The four pages build from `topics.cjs` with `node build.cjs`. The prologue that opens the story, its quote check, its
reader cautions and the page review are built by the scripts in this folder: seven node tools you run directly and five
workflow scripts you run through Claude Code's Workflow tool. Nothing here holds a path: every tool reads `topics.cjs`
and takes the topic key as its first argument, so a third edition needs no new scripts.

Two editions exist: `corruption` (builds to the prototype root) and `press` (builds to `press/`). Their prologues were
built with exactly this sequence on October 26, 2026, from scripts that then lived only in a session scratchpad; these
are those scripts with the paths taken out.

## What you need before any of this

1. **A ledger** at the workspace root in the shape of `trump-corruption-chronology.md` and `trump-press-chronology.md`:
   a "How to read this document" section with the label table and the actor rule; one `## ` chapter per period with a
   paragraph of prose; one bullet per act, `- **YYYY-MM-DD · Title.** body *[Label · tracker rating: X]* Sources:
   [text](url); ... [Tracker entry](https://thetrumptracker.com/controversy?id=...)`; and three appendices (considered
   and set aside; the totals as the record states them; method and sources). `build.cjs` parses that shape and nothing
   else. Every URL must be one somebody loaded: a tracker entry's source, a Civics Desk or Deep Dives source, or a page
   a research agent saved and listed in a `map.tsv`. Run the press ledger's gate on it, `python3
   press-chronology/gate.py <ledger.md>`, after pointing its map.tsv glob at the new topic's research folder; it exits
   1 on any URL nobody loaded, any tracker id that does not exist, and any em dash in a title.
2. **A `topics.cjs` entry** copied from `press` and edited: `key`, `out` (the folder the edition builds to), `ledger`,
   the copy (`kicker`, `unit`, `of`, `description`), `start`, the five chapters with the same keys (`before`, `first`,
   `between`, `second25`, `second26`) and this ledger's headings and bounds, `terms`, `eras`, the `families` that group
   the ledger's labels (validate their colors in display order with the dataviz palette validator on the paper surface
   `#f3eee4`; the reference light palette has nine hues and the press order is the one order of nine that passed), the
   door's chip groups, the `threads` (Deep Dives data files to follow, with the rows that feed their headline figures),
   and `story` (`topicList`, `introGap`, `coldOpen`, `storybar`, and the `prologue` block below).
3. **The `story.prologue` block**, which is the whole configuration of the sweep: `title`; `intro` (one clause saying
   what the prologue is about, no thesis); `framing` (the standing instruction every agent sees, kept as the record of
   what was asked); `whyRule` (what a step's "why" must say for this topic); `termNote`; `precedents`; `gapsRule`;
   `endSection` (or empty); `criticChecks` (the list the completeness critic must find entries for); `subjectExample`
   (how the reader cautions refer to a step); `reviewFocus`; and `themes`, five to seven of them, each with a `key`,
   `title`, `look` (what to look for, in plain phrases), `keywords` (grep terms over the entry files) and `mustRead`
   (entry ids every finder for that theme reads first).
4. `node build.cjs <topic>` once, so `<out>/ledger.json` exists; the edition then works without a prologue (the story
   page shows the eras and threads and a one-screen note that the prologue is being written).

## The sequence

Every workflow is run as `Workflow({ scriptPath: 'prototypes/the-count/tools/workflows/<name>.js', args: <JSON> })`,
with the JSON printed by `node tools/args.cjs <topic> <name>`. Each run's result lands in a task output file; the node
tool that follows reads that file. Models are set in the scripts (Sonnet for finding, verifying and refuting; Opus for
synthesis, the critic, the cautions and the review); do not raise them.

1. **Sweep.** `node tools/args.cjs <topic> sweep` → run `workflows/prologue-sweep.js`. Themed finders read the tracker
   entries and the ledger, a verifier per theme checks every beat against its record, Opus writes the outline, a critic
   checks completeness and overreach, one gap-fill round runs, and a final outline is written. With no prologue in the
   folder yet, the synthesis reads another edition's prologue for the shape; with one present (a regenerate), it keeps
   the prior outline's structure and wording where the beats are unchanged.
2. **Assemble.** `node tools/assemble-prologue.cjs <topic> <sweep output>` reports; add `--write` to produce
   `<out>/story/prologue.json` and `beats.json`. It refuses to write while any step's id fails to resolve, any URL is
   outside the corpus (tracker sources, ledger sources, the ledger's own links), two steps claim the same act, a date is
   malformed, or an em dash appears. It computes `inCount` per step by tracker id, by `ledger:<date> <title prefix>`,
   or by a step's explicit `ledgerId`.
3. **Build and look.** `node build.cjs <topic>`, open `/<out>/story.html`, read it once end to end.
4. **Quotes.** `node tools/quotes.cjs extract <topic>` writes `<out>/story/quotes-to-check.json`; `node tools/args.cjs
   <topic> refute` → run `workflows/quote-refute.js` (one skeptic per quote, defaulting to refuted); `node
   tools/quotes.cjs apply <topic> <refute output>` reports, `--write` applies: a quote that is not verbatim or is
   refuted with no better speaker is dropped; a better speaker replaces `quoteBy`; a speaker string that reads as an
   explanation is listed for a hand decision; a dated working caution records the counts.
5. **Review.** Start the server (`.claude/launch.json` entry `the-count`, port 4341, or `python3 -m http.server 4341`
   from the prototype folder), `node tools/args.cjs <topic> review [port]` → run `workflows/page-review.js`. Apply its
   findings by hand against `src/story.html` (page code and copy), `topics.cjs` (topic-supplied copy) or the prologue
   file (framing, theses, steps); rebuild. Count-based strings must read correctly at zero and at a full span; a title
   or framing written for one edition's counts is wrong for another's.
6. **Reader cautions.** `node tools/args.cjs <topic> cautions` → run `workflows/reader-cautions.js` (an Opus writer,
   then an Opus verifier that traces every line to a working note). When the verifier does not pass, apply its fixes to
   the output file by hand and set `verdict.pass` to true with a note, or rerun. Then `node
   tools/ingest-reader-notes.cjs <topic> <output>` to validate (refs, ids, banned process words, kebab-case ids, lengths,
   em dashes) and `--write` to store `readerNotes`. A reader note and the step it sits on must agree; when the verifier
   finds the step's own attribution unsupported, fix the step's `quoteBy`, not only the note.
7. **Rebuild and verify live.** `node build.cjs <topic>`; check the story, the count and one-at-a-time pages with no
   console errors; `node tools/dump-beats.cjs <topic>` lists every step with the act it lights.

## Keeping a prologue right

- **An entry was corrected.** `node tools/args.cjs <topic> beat refresh <id> "<the section or theme the step sits in>"
  ["<any rule the new step must meet>"]` → run `workflows/beat.js`; then `node tools/refresh-beat.cjs <topic> <output>
  --match "<regex over the working cautions that name the old step>" "<what changed, one sentence>"`. The old step is
  replaced in place, the matching cautions get a dated note (or a new caution is appended), and the tool warns when a
  reader step note on that step may now be stale. Rebuild; rerun the quote extract if the step carries a quote.
- **A new entry belongs in the prologue.** `node tools/args.cjs <topic> beat add <id> "<section context>"` → run
  `workflows/beat.js`; then `node tools/add-beat.cjs <topic> <output> <section-key> ["<gap note to append>"]`. The step
  is inserted in date order, the section's `thesisBasis` gains the id, the thesis is not rewritten (rewrite it by hand
  if the new step changes it), and the counts are updated.
- **A ledger act was folded into another.** Point the step at the surviving act's id, keep the step's own date and add
  a `dateNote`; the badge then reads "From the entry for one of the N acts" on its own. Rebuild for the title snapshot.
- **The whole prologue needs regenerating** (many new entries): run the sweep again; with a prologue present it keeps
  the prior structure and wording where the beats are unchanged. Then quotes, review and cautions again.

## What each gate refuses

| Gate | Refuses |
|---|---|
| `press-chronology/gate.py` | a ledger URL nobody loaded; a tracker id that does not exist; an em dash in a title |
| `assemble-prologue.cjs --write` | an id that resolves to no entry or ledger act; a URL outside the corpus; two steps on one act; a bad date; an em dash |
| `quotes.cjs apply --write` | an em dash in a speaker; it never writes a speaker string that reads as an explanation |
| `ingest-reader-notes.cjs --write` | a ref to a gap or caution that does not exist; a step id not in the prologue; a process word or kebab-case id in reader copy; a line over 40 words (25 for a step note); an em dash; a failed verifier verdict unless `--force` |
| `add-beat.cjs`, `refresh-beat.cjs` | a step whose verifier failed on sources or date; a step unsupported with no fix; a URL outside the corpus; a duplicate step; an em dash |

## Files

| File | Does |
|---|---|
| `lib.cjs` | paths from `topics.cjs`, the corpus (tracker sources, ledger sources, ledger links), step-to-act resolution, the term for a date |
| `args.cjs` | prints a workflow's `args` from `topics.cjs` |
| `assemble-prologue.cjs` | sweep output to `prologue.json` and `beats.json`, gated |
| `quotes.cjs` | `extract` the quotes; `apply` the refute verdicts |
| `ingest-reader-notes.cjs` | validate and store the reader cautions |
| `add-beat.cjs`, `refresh-beat.cjs` | one step in, one step replaced |
| `dump-beats.cjs` | every step with the act it lights |
| `workflows/prologue-sweep.js` | finders, verifiers, synthesis, critic, gap fill, final outline |
| `workflows/quote-refute.js` | one skeptic per quote |
| `workflows/reader-cautions.js` | writer and verifier of the cautions screen |
| `workflows/page-review.js` | one reviewer of an edition's story page in headless Chrome |
| `workflows/beat.js` | finder and verifier for one step |

House rules the scripts enforce and the operator keeps: every URL traces to the corpus; no em dashes; the most precise
language the evidence supports; a superlative needs a source that states the history; hand-written framing never claims
a step caused an act; reader screens get reader copy, with the working notes folded away behind a disclosure; nothing is
summed across periods; no family is reduced to its most loaded word; the story stays the default path.
