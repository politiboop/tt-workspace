# The Count (prototype)

The corruption ledger, counted: one tally mark per documented act, read three ways from one data
file. Built October 26, 2026 from `trump-corruption-chronology.md` at the workspace root.

Four pages, one look (paper, ink and one red; Fraunces, Source Serif 4, IBM Plex Mono):

- `index.html` is **the door**. It asks three questions in the reader's words (what do you want
  to see, which years, how do you want to read), shows the whole wall with the acts you will read
  dark and the rest faint, counts live ("72 of 317"), and sends you on with the choices in the
  link. "Skip · show me everything" is always in the top bar; choices are remembered in the
  browser and offered back as "Continue"; "Choose what to see" on every page returns here with the
  current choices preselected. The first answer to every question is everything, and a narrowed
  view never hides the whole.
- `story.html` is **the story**, the door's first and recommended answer: the ledger told in
  order, one screen per thing, with the wall and strip beside it. A cold open on one sourced
  figure from Appendix B; the prologue, "How the Stage Was Set", section by section and step by
  step, each step with its reason marked as stated in its entry or as a reading not stated there,
  its quote with the speaker its entry names, its sources and its tracker entry's real title, with
  the steps that are not acts in the count (23 of 44) drawn on their own row at the top of the
  wall, labeled "Prologue · 23 not in the count", and badged "Context · not in the count"; a cautions screen written for the reader ("What this prologue cannot support": the limits
  of the prologue as its own checks found them, in plain words, each line drawn from the sweep's
  notes under a no-new-claims rule and traced back by a second agent) with the sweep's working
  notes folded behind a disclosure, each step carrying its own caution lines under its reason, and
  a red "read them" line in the panel throughout the prologue;
  then the eras, each with the ledger's own chapter words, the count filling on the wall, the
  average days between acts over the era with the coverage caveat, the most common kind, and a
  link to walk that era one act at a time; the threads as interludes where they begin; the
  totals; and the close. Play advances a screen every seven seconds. Nothing on it is written
  separately from `ledger.json` and `story/prologue.json` except the framing lines, which are
  labeled.
- `count.html` is **all at once**: the scroll-driven count with the wall (in ink), the zoom-out
  histogram (in family color), threads, filters, the running breakdown and the time strip.
- `focus.html` is **one at a time**: one act per screen.

The family palette on paper is the dataviz reference light theme in family order, validated on
the paper surface (self-dealing `#2a78d6`, foreign `#eb6834`, crypto `#1baf7a`, access `#6250d6`,
pardons `#e87ba4`, appointees `#008300`, trades `#eda100`, enforcement `#9a4a1f`); the four
lighter hues always sit beside their labels. Family color appears only where it is labeled; the
wall itself is ink. Thread actors are ink tints plus red for the administration.

## The prologue material (`story/`)

`story/prologue.json` is the sourced outline for a prologue, "How the Stage Was Set": seven
sections (the watchdogs removed, the ethics rules loosened, his own lawyers atop the Justice
Department, loyalists in key posts, enforcement cut back, clemency routed around the pardon
office, and the law's limits around a sitting president), 44 beats, 124 source links. It was first
produced on October 26, 2026 by a research sweep over the tracker corpus and the ledger (seven
themed finders, a verifier per theme that checked every beat against its entry, a synthesis, a
completeness critic, one gap-fill round) and regenerated the same evening by the same sweep over
the corpus as it stood after commit 32fa05b, which added seven setup entries and the stock-ban entry
and corrected the IG-purge date; the second run also had the verifiers check each quote's speaker
and was synthesized against the first, reviewed outline so its wording carried over where the
beats did (the first run is kept beside it as `prologue.prior-2026-10-26.json`). Every URL was
gated against the corpus and the ledger with zero misses both times. Each beat carries its entry id
and whether the act is already in the count (21 of the 44 are; 23 are not),
its `why` with a `whyBasis` of stated or inferred, and the file keeps the sweep's own `gaps` and
`cautions`, which must travel with it: the record does not show Trump pushing to keep congressional
stock trading legal; it shows him backing a ban limited to Congress and attacking the one bill that
also covered the president, so that entry and the stalled Senate vote sit in the last section among
the law's limits. `story/beats.json` holds the 109 verified beats of the second run for later use.
`story.html` renders `prologue.json` as written: the beats in the outline's order, the `why`
with its basis, the sources, and the gaps and cautions on their own screen. Beats are matched to
acts by tracker id or by ledger date and title prefix (no date-only fallback); the page checks
that every match agrees with the beat's own `inCount` flag and that no act is claimed twice, and
shows a red notice if not. Four fields were added to the file for the page on October 26, 2026,
each derived from the sweep's own notes or verified against the source passage (the file's
`pageFields` note lists them): `quoteBy` on all 19 quoted beats (the speaker or document the
entry attributes the quote to, found by a lookup sweep with a refuter per quote and read again by
hand; a quote with no `quoteBy` is not rendered), `dateNote` on the two placeholder-dated beats
(caution 1: shown as "Undated · placed at the start of the term", with no playhead), `sourceGap`
on the CR-15 beat (gap 4: a red "Source pending" line on the step and its section while no NOTUS
source was attached; the tracker session attached it the same evening, so the flag is gone), and `thesisInferred` on the loyalists and limits sections (caution 2: the
section screen says parts of its summary are inference). `build.cjs` also writes
`story/tracker-titles.json`, a snapshot of the real tracker titles for the 26 tracker beats, so
the page never shows the sweep's paraphrase as a title.

## The review round (October 26, 2026)

Four independent reviewers (sourcing fidelity, house voice, accessibility, code) read the story
page and its data; 56 findings, 7 of them blockers, all fixed the same day. A second round (two
reviewers over the patched page) found 30 more, one a blocker: the thread screen had called the
four lit acts "moments" of the dive, when they are the count's items whose tracker entries seed it
(the same claim was corrected on the count page's thread card). The rest were labels and edges:
the wall's row for the fourteen steps is now "Prologue · 14 not in the count" rather than "The
setup"; the panel shorts are "Appointee misconduct" and "Dismantling enforcement", the ledger's
own leads, since "Appointees 45" and "Enforcement 14" read as the opposite of what they count; the
era stat quotes each family label ("filed first under “Pay-to-play, favors and contracts”") so the
comma-laden labels can be parsed; the pace divides the span by the intervals between acts, not the
acts; the coverage line says the non-tracker acts "were added by new research for the ledger", the
ledger's own words, not "afterward"; a step whose date differs from its act's is badged "From the
entry for one of the 317 acts"; the "inferred" basis tag reads "Attributed or inferred · see the
cautions", since most of those whys attribute what the entry states; the screen-activation rule is
one rule (the observer only prompts a re-check), Play reads its dwell after the move, focus stays on
the Pause button while Play runs and a live region announces each screen, a second arrow press
during a scroll counts from the screen being reached, and sections use 100svh so a phone toolbar
does not make every screen look taller than the viewport. The story page tells all 317 acts: a
filter chosen on the door is shown on its first screen as the reader's choice and carried to the
header's links, while the era and thread links drop it, so their counts hold. The ones that change
how the pages read: no hand-written sentence may say the prologue caused the count (the hero now
asks what else is on the record, and the intro says the setup steps sit "above the count", not
behind it); the family shorts in every panel are "Favors and contracts" and "Foreign and family"
rather than "Pay-to-play" and "Foreign money", the era stats use the ledger's full family
labels, and the door's chip is "Favors, contracts and access"; the era pace is "days per
documented act" over the span from the era's first act to its last, ties are named, and every
era carries a coverage line computed from how many of its acts have a tracker link (all 127 of
2026's do, 1 of the first term's 72), ending "the pace is not comparable across eras"; the
thread screen takes its past set from the preceding era in ledger order, not from dates; the
totals heading no longer says the figures add up; the end screen counts 317 acts and 14 steps
outside the count rather than 35 plus 317. Interaction: the arrow keys and Play scroll a screen
taller than the viewport in parts before moving on (the cautions and totals were being skipped),
Play dwells by word count (7 to 30 seconds), Space on a focused button no longer navigates,
modifier-key combinations pass through, the controls come right after the header in the tab
order with a skip link before them, each screen takes focus when reached, source links carry
their full citation and "opens in a new tab" for screen readers, snapping is proximity under
861px, and the small-text ink (`--ink-3`) is `#6b6458` (5.06:1 on paper) on all four pages,
with the old `#857d70` kept as `--ink-3l` for rules and tag borders.

## Two editions from one set of pages

Since the evening of October 26, 2026 the prototype is a template. `topics.cjs` holds one entry per
topic: the ledger it reads (a markdown chronology at the workspace root with its own URL gate), the
five chapter headings and their date bounds (the chapter keys are the same for every topic, so the
pages' layout rules hold), the period choices, the time strip's eras and start, the families that
group the ledger's labels with a short name and a color each (the palette validated on the paper
surface in display order), the door's chip groups, the threads (Deep Dives data files) with the
rows that feed their headline figures and any actor names of their own, and a few words of copy
(the kicker, the unit, the story's topic list and gap line, the story offer's sentence). The four
pages live once, in `src/`, and read all of that from `ledger.json`'s `topic` block; `build.cjs`
parses each topic's ledger into `<out>/ledger.json`, snapshots the tracker titles its prologue
cites, and copies the pages into `<out>/`, stamping each copy with its edition and whether a
prologue exists. Edit the masters in `src/`, never the copies.

- **Corruption** builds to the root: 317 acts, eight families, The Ballroom as its thread.
- **Press** builds to `press/`: 197 acts from `trump-press-chronology.md` (2015 to 2026, the
  2016 campaign as its first chapter), the ledger's nine labels as nine families, Shut Out (the
  White House press ban) as its first thread. Its prologue, "What Changed Around the Press", came
  from the same sweep run with press themes into `press/story/` (55 steps in seven sections, every
  one an act in the count), then the quote refute, a page review and the reader-cautions pass.

The story is the default path in every edition, and the readers' story flags are kept per edition.

## The prologue tools

Everything that builds a prologue (the themed sweep, the assembler that gates URLs and ids, the quote refute, the page review, the reader cautions and the one-step add and refresh) lives in `tools/`, reads `topics.cjs` and takes the topic key as its first argument; the sweep’s themes and rules for each topic sit in that topic’s `story.prologue` block. `tools/README.md` is the step-by-step for a third edition and for keeping a prologue right after an entry is corrected.

## Run it

```bash
cd prototypes/the-count && node build.cjs && python3 -m http.server 4341
```

Or start the `the-count` entry in `.claude/launch.json` (port 4341); the press edition is at
`/press/`. `build.cjs` must be rerun after any change to a ledger, to `topics.cjs` or to a page in
`src/`; it builds every topic, or one with `node build.cjs press`. Each page reads its folder's
`ledger.json` at load and computes every number on the page from it.

## What it does

1. **Hero.** The question, what the record shows, the rule, six stats. Every number is computed.
2. **The count.** A sticky stage on the left holds a wall of tally marks grouped by chapter and
   year (one row per chapter on a phone). The right column scrolls through 38 steps: a card for
   each chapter of the ledger (its own intro paragraph), then one step per year through the first
   term and the gap, and one step per month through the second term. Each step reveals its acts,
   ticks the counter, and lists the acts; a row opens the act in a drawer with its body, the
   ledger's label, its sources and its tracker link. Hovering a mark names the act.
3. **Zoom out.** The last step moves every mark into a per-month histogram (per quarter on a
   phone). Filters by family, tracker rating and period, a text search, and a click on any column
   narrow both the chart and the list. Filters live in the query string so a view can be sent.
4. **Threads.** A Deep Dives dive followed through the count. `build.cjs` reads the dive's data
   file as it is (The Ballroom so far) and records which ledger acts its tracker seed entries
   cover. In the count, a card appears in the month the thread begins, with the dive's question
   and answer and a "Follow this thread" button; Zoom out has a Threads chip; `?thread=<slug>`
   deep-links. Following a thread keeps the histogram in the top half of the stage with every
   mark dimmed except the seeded acts (lit white), opens a lens over the thread's months into a
   band below where the dive's moments land colored by actor, and joins each lit act to the
   moment that shares a source with it (or the nearest by date) with a dotted line. The right
   column becomes the dive's own chapters in its own order: Where it stands (question, answer,
   rule, status, its headline figures, what to watch), The ledger, The record month by month
   (each month lights its moments; a row opens the moment in the drawer), The claims and the
   record, Who objected and who defended it, The rules, Our take, Method with corrections.
   Leaving restores the count where you left it. The main count never changes: a thread's
   moments are finer than the ledger's acts and stay inside the thread.
5. **Totals.** Appendix B of the ledger as tiles, with its own warning that the figures are not
   added together.
6. **Method.** The ledger's own "how to read" text and label table, the color grouping used here,
   a note on reading the density, the set-aside list, and the ledger's method appendix.

## One at a time (`focus.html`)

A second reading of the same `ledger.json`, built after the user asked to see one corrupt act at
a time rather than a scrolling list. Every act gets a full screen (scroll-snapped; arrow keys,
swipe, or the ← → buttons move one at a time; Play advances every five seconds), with its date,
chapter, family, the tracker's rating as a stamp, the title, the ledger's own text, the ledger
label, and its sources. A chapter screen opens each era with the ledger's intro paragraph and its
count. The right-hand panel holds the whole wall of tally marks in ink: acts already read in full
ink, acts to come faint, the act on screen red with a halo and its year lit; a year rail jumps.
The hash (`#a-153`) addresses an act. It is deliberately not in the Deep Dives palette: paper,
ink and one red, Fraunces for display, Source Serif for text, Plex Mono for labels.

## Filters, on both pages

One filter (family, the tracker's rating, period) is shared by the count, Zoom out and the
one-at-a-time page, and travels in the query string (`?f=pardons,crypto&r=severe,none&t=second`)
so the links between the two pages keep it. "Not rated" is an explicit choice, with a note that
ratings are the tracker's and the 166 researched acts carry none. On the count, the acts a filter
drops stay on the wall as gray ghosts so the whole quantity is always in view, the steps are
rebuilt from the kept acts (empty months collapse, chapter cards say "6 of 72 acts match"), and
the counter counts the slice. The controls are deliberately loud: a Filter button in the top bar
of each page (filled red with the count while a filter is on) opens the chip panel anywhere; the
scroll page's stage carries an always-visible "Filter the count" block with family, rating and
period rows and a red status pill beside the counter; the one-at-a-time panel shows a red
"Filtered" line with a Clear button. On the one-at-a-time page the dropped screens
are hidden, so a filtered walk is shorter and Play plays only the slice; the panel reads
"12 of 32 · 317 in all", the chapter screens recount, and the end screen says "That is 32 of 317."
A thread ignores the filter while followed.

## The running breakdown and the time strip

Two borrowings from ChronoFlo's monarchs timeline, on both pages. **The breakdown** says what
kind of act, so far: on the scroll page a stacked bar by family under the counter, with counts,
that grows as the count does (and shows the filtered set in Zoom out); on the paper page a small
ink bar chart in the panel, with a one-line "So far" summary on phones. **The strip** is a time
map: the three eras, a per-month density sketch (all acts faint, kept acts strong under a filter),
each thread as a colored span (click it to follow the thread; on the paper page it opens the
thread on the count), year ticks, and a red playhead at the point in time you are reading. Click
or drag the strip to move: on the scroll page to the step for that month or year, on the paper
page to the first act on or after that date. The strip replaced the year rail on the paper page.

## What is editorial here, and what is not

Nothing on the page is written separately from the ledger except: the hero's framing lines, the
step and section labels, the sentence on reading the density (which quotes the ledger), and the
**family grouping**. A thread shows only its dive's data file; the one page-level choice there is
which ledger rows feed the thread's headline figures, set per thread in `build.cjs`. The ledger carries two label vocabularies: its ten canonical labels on the
researched items, and the tracker's corruption subcategories on tracker-derived items. The page
groups the lead phrase of each label into eight color families (table in `build.cjs`, shown under
Method) and keeps the ledger's full label on every act. Six acts whose lead label fits none of the
eight (the ledger's own "borderline" and pre-office entries) are drawn in gray.

The eight-family palette was validated with the dataviz palette validator on both Deep Dives
surfaces, in this order: self-dealing `#d03b3b`, foreign `#1fa8a8`, crypto `#b5820c`, access
`#9085e9`, pardons `#d4701f`, appointees `#3987e5`, trades `#0ca30c`, enforcement `#d45f9e`.

## Known limits of the prototype

- Fonts come from Google Fonts; a production page self-hosts them like the rest of Deep Dives.
- The marks are decoration for screen readers; the step lists are the accessible path.
- The density of the second term is partly the shape of the record: the tracker followed 2026
  day by day, earlier years were researched for the ledger after the fact. The page says so.
- It is a single HTML file, not an Astro page, and it is not wired into any site's integrity check.

## Open decisions

- **Where it lives.** A Deep Dives page (same design language, and the corruption section already
  has a smaller filterable timeline), or the front door of the flashier narrative site the roadmap
  imagines. The Deep Dives integrity check requires every source to trace to a tracker seed entry;
  the ledger's 166 researched items trace to agent `map.tsv` files instead, so that check would
  need a second seed type.
- **Label normalization.** Keep the eight families, or re-label the ledger itself so every item
  carries one of the ten canonical labels.
- **Pacing.** 38 steps is a long scroll. Per-quarter steps for the first term, or per-chapter,
  would shorten it; the length is also the point.
- **A take.** The page has no opinion block. Deep Dives allows one under "Our take."
- **The name.** "The Count" is a working title.
