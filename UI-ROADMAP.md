# UI roadmap and handoff

Written October 22, 2026 after a full walkthrough of all five live sites at desktop and phone width, axe-core contrast checks, and payload measurements. It is written for a session that has not seen that walkthrough. Read the workspace `CLAUDE.md` first, then this file, then the repo's own `CLAUDE.md` for whichever site you touch.

The reference design for the tracker front page is in this repo: `design/tracker-front-page.mockup.html` (open it in a browser; it is a self-contained page built from `design/tracker-front-page.data.json`, a snapshot of the live data). Every spec below that says "as in the mockup" means that file.

## 0. Ground rules that override everything below

These are credibility rules, not taste. They stay even where this document loosens the old design preferences.

- Never fabricate content. No invented entries, quotes, numbers, dates or URLs, not even placeholder copy in a mockup; use real entries from `controversial-trump/data/controversies/`. If a design needs a figure that does not exist, show the real one or leave the slot out.
- No em dashes in tracker titles (`node website/audit-em-dashes.js` must stay clean). The Civics Desk has its own tone and phrase rules in `the-civics-desk/CLAUDE.md` and a PostToolUse style hook; follow them for any Civics copy.
- Keep every existing check green after your change: tracker `node sync-data.js && node audit-em-dashes.js && node verify-sources.js`; rigging `node verify-sources.js && node verify-evidence.js`; dives `npm run verify`; each site's `npm run build`.
- Browsers: headless only, one or two at a time, never `headless: false`. The user was badly interrupted by visible "Chrome for Testing" windows once.
- Git: other sessions share these working trees. Use absolute paths, `git -C`, and pathspec commits (`git commit -- <files>`), `git pull --rebase` before every push. Civics Desk pushes need the user's explicit word; tracker, research, rigging and dives pushes are routine once checks pass.
- Models: Sonnet for mechanical work, Opus for anything with design or build-system judgment. Say which you are using in the session brief.
- Accessibility floor: WCAG AA contrast (4.5:1 for text under 24px) on every new surface. The contrast fixes landed on October 22 (`controversial-trump` commit `6e5d8b1`, `the-civics-desk` commit `da2c9ae`); do not reintroduce muted greys below the threshold. The tracker's muted tokens and `website/src/utils/colors.js` (which lifts failing category and severity hexes) are the reference.

## 1. State of play on October 22, 2026

### Sites and frameworks

| Site | Repo | Framework | Live URL |
|---|---|---|---|
| The Trump Tracker | `controversial-trump/website` | Docusaurus 2.4.1 (React) | https://thetrumptracker.com (also answers on trumpingtrump.com, no redirect yet) |
| Research | `controversial-trump-research` | Astro 4.16 | https://research.thetrumptracker.com |
| Deep Dives | `deep-dives` | Astro 6.1 | https://deep-dives-gamma.vercel.app (no custom domain) |
| Rigged Before the Vote | `election-rigging` | Astro 6.1, `output: 'server'` | https://riggingelections.com (www has no DNS yet) |
| The Civics Desk | `the-civics-desk` | Astro 6.1 | https://thecivicsdesk.com |

Vercel team `brocks-projects-e75c0985`, user `politiboop`. The CLI is at `/opt/homebrew/bin/vercel`. Running `vercel` commands from an unlinked folder creates projects; see the memory note "Vercel CLI pitfalls".

### Landed today

- Site URLs, sitemaps, canonical and `og:url` fixed on Rigged (`f0eb3ec`) and Deep Dives (`7b3854e`). Both live.
- Contrast: zero axe `color-contrast` failures on the tracker and the Civics Desk; the Civics wordmark stays on one line at phone width.
- Tracker front-page mockup (this repo, `design/`).

### Branches waiting to be merged (do this first)

Both are on `controversial-trump`, both pushed, neither merged. Merge order: `claude/prerendered-entry-pages`, then `claude/fix-day-early-card-dates` (the second was built on the first and merges cleanly). Nothing on `main` since conflicts with them; this was checked with `git diff --name-only` on both sides.

`claude/prerendered-entry-pages` (five commits):
- A Docusaurus plugin gives every entry its own prerendered page at `/controversy/<id>/` with title, description, canonical, Open Graph tags and a per-entry 1200×630 PNG share card drawn at build time by `website/lib/social-cards.js` (the renderer moved out of `generate-social.js`). Cards are cached between Vercel builds and never committed; `website/static/img/og-image.png` is the fallback.
- `website/vercel.json` sends old `/controversy?id=<id>` links to the new pages with a permanent redirect; `website/src/components/Detail/EntryRedirect.jsx` does the same in the browser. The old detail page became `website/src/components/Detail/ControversyPage.jsx`; `website/src/utils/entryUrls.js` builds entry URLs, so nothing should hand-write `controversy?id=` again.
- Sitemap: 34 URLs before, 1,294 after. JavaScript before an entry page renders: 1.51 MB before, 0.34 MB after. Warm Vercel deploy: 1:18 before, 2:17 after; first deploy after merge about 4:19; build output 18 MB to 208 MB (146 MB of cards).
- After merging, verify live: `curl -sI "https://thetrumptracker.com/controversy?id=muslim-ban"` should return a 308 to `/controversy/muslim-ban/`.
- It left four things alone, all listed under §6 Small fixes.

`claude/fix-day-early-card-dates`: list cards on the category, severity, timeline and search pages showed dates one day early for US readers (a UTC parse of `YYYY-MM-DD`). A small helper now builds the date from its parts. Merge it with the above.

### Measured facts the specs rely on

- 1,265 entries, 8,296 source links, about 43 new entries in a typical fourteen days.
- Severity: serious 558, moderate 230, severe 197, concerning 195, absurd 40, catastrophic 32, disputed 13.
- The tracker homepage ships `common.<hash>.js`: 3.8 MB raw, 1.4 MB compressed, which is `website/src/data/controversyIndex.js` (the whole corpus) for the in-browser fuzzy search. It is the heaviest asset on any of the five sites.
- The research site has 60+ pages, each with a hand-maintained `const tickerItems = [...]` and hand-edited counts on `src/pages/index.astro`. The count is bumped by hand after every sweep.

## 2. House style

Adopt the Deep Dives / Rigged Before the Vote system as the house style for the tracker and, later, Research. It is the newest, the cleanest, and it already encodes the editorial rules (facts and takes separated, every claim sourced, status chips, mono labels). The Civics Desk keeps its own light identity on purpose; do not port the dark system there.

### Tokens

From `deep-dives/src/styles/` and reproduced in the mockup's `:root`:

```css
--bg:#0b0d10; --surface:#101318; --raised:#171b21; --line:#232932; --line-soft:#1b2027;
--text:#e8eaed; --text-2:#a3acb6; --text-3:#8a939f;   /* text-2/3 are the AA-safe greys; the dives file still has #9aa3ad/#7f8894 */
--brand:#d03b3b; --brand-bright:#e5484d;
--st-active:#d03b3b; --st-court:#3987e5; --st-record:#9085e9; --st-threat:#b5820c; --st-blocked:#0ca30c;  /* rigging/dives status colors */
--sev-catastrophic:#ff4d4d; --sev-severe:#e5484d; --sev-serious:#f08a2e; --sev-moderate:#e0b23a; --sev-concerning:#a9b4c0; --sev-disputed:#7f8894; --sev-absurd:#9d93ef;
--font-display:"Barlow Condensed"; --font-body:"Barlow"; --font-mono:"IBM Plex Mono"; --font-serif:"Lora";
--container:1120px;
```

Severity colors are used as dots, rules and bars, and as text only at 12px mono uppercase labels; `--sev-concerning` and `--sev-disputed` are the only two that fail as text on `--surface`, so never set body copy in them.

Fonts: `@fontsource/barlow`, `@fontsource/barlow-condensed`, `@fontsource/ibm-plex-mono`, `@fontsource/lora` (all already in `deep-dives/package.json`). Self-host via fontsource in every repo; no Google Fonts CDN on the sites (the mockup uses the CDN only because artifacts cannot bundle fonts).

### Type scale

Display (Barlow Condensed 700/800, uppercase for mastheads and section heads): 72 / 46 / 28 / 24 / 21. Body (Barlow 400/500/600): 15.5 for list titles, 14 for card text, 17 Lora for ledes and deks at line-height 1.6. Mono (IBM Plex Mono 400/500) 11 to 12 with 0.04 to 0.08em tracking for labels, dates, counts. Running text never wider than about 68ch.

### Components (names used throughout this document)

- **Network strip**: 36px bar above the masthead; mono uppercase links; current site underlined in `--brand-bright`; countdown chip at the right while the midterms are ahead. Scrolls horizontally on phones.
- **Severity dot / label**: 10px circle in the severity color, plus the mono uppercase label where there is room. Replaces the outlined pills.
- **River row**: `grid: 10px 54px 1fr`; dot, mono date, 15.5px/600 title, mono category label under the title; hairline `--line-soft` rules; 11px vertical padding. On phones the date and title stack in one column.
- **Lead**: severity label, display title at `clamp(30px,4.2vw,46px)`, Lora dek, mono meta line.
- **Card**: `--surface` fill, 1px `--line` border, 3px top border in the severity color, 4px radius, 16px padding, display title 21px, dek clamped to four lines, mono meta pinned to the bottom. Use for parallel reference items only (the heaviest-of-the-month rail, the network panels, Dives questions), never for a feed.
- **Pace strip**: 14 columns, one per day, stacked segments by severity, 120px tall, mono day numbers. Built from counts, not decoration.
- **Severity bar**: one proportional stacked bar for a set of entries, with chips underneath that filter the adjacent list.
- **Index row**: category title (display 21), one-line description (13.5 muted), tabular count, 160px mini severity bar.

### What the old preferences still forbid, and why they still matter

Keep: no emoji as icons (credibility), numbered markers only for real sequences, one PullStat per research page, no "dashboard of boxes" (a feed is a list, not a grid of cards), bold at weight 500/600 not 700 in Crimson Pro on the research site. Drop as hard rules: the ban on alternating red/amber card variants (the severity scale replaces that), the preference for centered section headers (left-align in the new system).

## 3. Work packages

Each package lists: goal, files, steps, done-when, pitfalls, model, dependencies. Keep each in its own branch and session. Order: WP1 → WP2 and WP3 together → WP4 → WP5 → the rest in any order.

### WP1. Merge the two pending branches

Status: done. Merged into `main` as 94343e5 and a101c7a on October 25, 2026; deployed (Vercel build 3m); checks passed from a browser session: canonical tag present on `/controversy/muslim-ban/`, `?id=` route answers 308 to the new path, sitemap lists 1,304 URLs, `/og/<id>.png` serves. Note: thetrumptracker.com was found to be behind the Vercel Security Checkpoint (`x-vercel-mitigated: challenge`), which returns 403 to every non-browser request, including link-preview bots, RSS readers and sibling-site build-time fetches; trumpingtrump.com (same project) is not challenged. The user controls that setting in the Vercel dashboard; WP4's build-time fetch of `/api/stats.json` must keep its committed fallback.

Model: Sonnet. Depends on: nothing. Steps: in `controversial-trump`, `git fetch`, `git merge origin/claude/prerendered-entry-pages` (clean), `git merge origin/claude/fix-day-early-card-dates` (clean), `cd website && npm run build` (expect about 30s cold), push `main`, wait for Vercel (first deploy about 4 to 5 minutes), then run the three `curl` checks: the 308 redirect above; `curl -s https://thetrumptracker.com/controversy/muslim-ban/ | grep -o '<link rel="canonical"[^>]*>'`; `curl -s https://thetrumptracker.com/sitemap.xml | grep -c '<loc>'` (expect about 1,294). Done when all three pass. Pitfall: Vercel preview URLs are behind login; test production only.

### WP2. Tracker front page (the mockup, made real)

Status: done. Built with WP3 and the tracker half of WP4 on branch `claude/wp2-wp3-front-page-search` (e8e8c62) and merged to `main` on October 25, 2026. Open item: `main.js` is 250 KB gzipped, over the 150 KB budget, because Docusaurus 2 embeds the route list for all 1,276 entry pages in every page's main chunk; the branch added only 6.6 KB. The budget is unreachable without leaving Docusaurus (see section 4, item 1). The homepage no longer loads the 1.36 MB corpus; `/timeline`, `/categories` and `/tags` still do until WP7.

Goal: replace `website/src/pages/index.jsx` (694 lines: hero, research callout, red stats box, search panel, sort chips, collapsible filters, Fuse search over the full index, grid/list of cards) with the front page in `design/tracker-front-page.mockup.html`.

Model: Opus. Depends on: WP1 (entry URLs) and WP3 (search), which can be built in parallel on the same branch.

Files: `website/src/pages/index.jsx`, `website/src/pages/browse.module.css` (the homepage's styles live here; `index.jsx` imports them), `website/src/css/custom.css` (Infima overrides; the `--ifm-*` tokens), `website/docusaurus.config.js` (navbar), new components under `website/src/components/FrontPage/`, a build-time data plugin under `website/plugins/` (the entry-pages branch adds one; extend it rather than add a second).

Data at build time, never in the browser bundle: a plugin computes and `createData`s a `front-page.json` with: the 40 newest entries (id, title, date, severity, category, source count, first two sentences of the summary), the lead (newest severe or catastrophic in the last seven days, else the newest entry), the 14-day per-day severity counts, the severity totals, the category totals with per-category severity mix, the four heaviest entries of the last 30 days (severe or catastrophic, then newest serious), the total entry and source counts, and the "updated" date. The homepage reads that JSON through `usePluginData`. Nothing on the homepage imports `controversyIndex.js`.

Sections and behavior, in order, exactly as the mockup:
1. Network strip (see WP4; until WP4 lands, render it from a constant in this repo).
2. Masthead: wordmark "THE **TRUMP** TRACKER" (Barlow Condensed 800, "Trump" in `--brand-bright`), one mono line "1,265 documented entries · 8,296 sources · updated October 22, 2026", search box at the right (WP3), `/` focuses it.
3. Lede: one Lora paragraph (the mockup's text is acceptable; keep it factual).
4. Lead + river: 7/5 grid; river shows 8 rows, "Show the rest" reveals the other 31; "Full timeline →" link. Rows link to `/controversy/<id>/` via `entryUrls.js`.
5. Pace strip + severity bar with chips; chips filter the river by severity (client-side, over the 40 loaded rows only).
6. The heaviest entries this month: four cards.
7. Elsewhere in the network: three panels (Rigged with its live action count and the countdown, Deep Dives, The Civics Desk with its explainer count). Counts come from `stats.json` (WP4) or constants until then.
8. By category: index rows linking to `/category/<id>`.
9. Footer: methods link, RSS.

Remove: the "Research Division" callout, the red "N Controversies Found" box, "Browse by Category / Severity" buttons, the Quick Sort chips, the grid/list toggle, the collapsible filter selects. Filtering by category, severity and period lives on `/timeline`, `/categories` and `/severity`; the front page is for reading.

Mobile: the mockup's breakpoints (860px: single column; 520px: river rows stack). No horizontal scroll anywhere except the network strip.

Done when: `npm run build` passes; the homepage loads no chunk over 150 KB compressed (check with `curl --compressed -o /dev/null -w '%{size_download}'` on every script the HTML references); the rendered page at 375 and 1280 matches the mockup section for section (screenshot both with headless Chrome and keep them in the PR); axe reports no contrast failures; every link on the page resolves (run `node verify-sources.js --live --id` is not relevant here; use a quick script that fetches every `href` on the built homepage and reports non-200s).

Pitfalls: Docusaurus 2.4 (not 3); `@theme/Layout` wraps the page in the navbar, so hide or restyle the Infima navbar via `custom.css` rather than fight it; the existing `categories.json` holds emoji icons in `icon` fields, do not render them; `readableOnDark()` in `utils/colors.js` must still be applied anywhere a category color is used as text.

### WP3. Search with Pagefind; retire the corpus download

Status: done with WP2 (same branch and merge). "Omar" returns in 190 ms on a 20 Mbps / 40 ms connection; Vercel must keep `npm run build` as its build command so Pagefind runs after Docusaurus.

Goal: instant search over all entries without shipping the corpus.

Model: Sonnet. Depends on: WP1.

Steps: add `pagefind` as a dev dependency; after `docusaurus build`, run `npx pagefind --site build --glob "controversy/**/*.html"` (package.json `build` script: `docusaurus build && npx pagefind --site build ...`); the entry pages from WP1 are the indexed documents, so give each entry page `data-pagefind-body` on the article and `data-pagefind-meta="severity:…, category:…, date:…"` attributes so results carry badges. A `Search` component (replace `website/src/components/Search/`) lazy-loads `/pagefind/pagefind.js` on first focus, renders the top 10 results as river rows with severity dots, supports `/` to focus and arrow keys to move. Keep `/search` as a full-page version. Then delete the Fuse dependency and every import of `controversyIndex.js` from pages that only need slices (the plugin from WP2 gives them data); `controversyIndex.js` may remain for the few pages that truly need everything (timeline, categories) until WP7 moves those to build-time data too.

Done when: searching "Omar" from the homepage returns the Omar entries in under 200 ms on a throttled connection, the homepage ships no `common.*` chunk over 150 KB compressed, and the build still completes in under 60 s locally.

Pitfall: Pagefind indexes built HTML, so it runs after the Docusaurus build, and Vercel's build command must include it. Vercel caches `build/`? No; it caches `node_modules` and the Docusaurus cache; Pagefind runs every deploy (about 10 s for 1,300 pages).

### WP4. The network strip and `stats.json`

Status: tracker side done with WP2 (strip component, `/api/stats.json`, `/api/entries-slim.json`); Rigged and Deep Dives done and merged October 25, 2026 (branches `claude/wp4-strip-stats`: Astro `NetworkStrip` and `AlsoFromTeam` components, `/stats.json` as a prerendered endpoint, `src/lib/network.js` site list); the research side (strip, footer line, counts from `stats.json` with the committed fallback `src/data/tracker-stats.fallback.json`, `npm run check:network`) merged to `master` the same night (54f320e). Sweeps now bump the fallback file instead of the three homepage spots; `README.md` and `public/og-image.svg` still say "290+" and the footer says "compiled through March 2026" (cleanup). Still open: the tracker's "Elsewhere" panels still use constants for the Rigged and Dives counts; switch them to the two sites' `/stats.json` with fallbacks. Day-count rule: Rigged and Dives count New York calendar days, the tracker's chip counts the reader's local days; make the tracker match New York days. At 375px the Rigged strip's own link starts off-screen; hide the "The network" label below 480px in all four copies together.

Goal: one shared navigation line across the four dark sites, and one source of truth for counts.

Model: Sonnet. Depends on: nothing (can run alongside WP2).

Part A, `stats.json`: the tracker build writes `website/static/api/stats.json` (entry count, source count, per-severity and per-category counts, newest entry date, generated-at timestamp) and `website/static/api/entries-slim.json` (every entry: id, title, date, severity, category; about 150 KB). Both deploy with the site at `https://thetrumptracker.com/api/stats.json` and `/api/entries-slim.json`. Rigged already exposes its count implicitly; add `public/stats.json` there too (`actions` count, `lastUpdated`) and in Deep Dives (dive count, last updated).

Part B, the strip: one HTML+CSS snippet (36px, `--surface` background, mono uppercase links: Tracker · Research · Deep Dives · Rigged Before the Vote; the current site underlined in `--brand-bright`; a countdown chip "N days to the midterms" computed from November 3, 2026 until then, after which it shows nothing). Implement it four times, as a React component in the tracker (`docusaurus.config.js` `navbar` cannot hold it; render it from `Layout`'s `navbarItems` or a swizzled `Navbar/Content`), and as an Astro component in Research, Dives and Rigged. Footers on all four plus the Civics Desk get a one-line "Also from this team" list with all five.

Part C, consume the stats: Research's `src/pages/index.astro` fetches `https://thetrumptracker.com/api/stats.json` at build time (Astro frontmatter `await fetch(...)`) and falls back to the committed number if the fetch fails; replace the three hand-edited "1,265+" spots and the `target={1265}` StatCard. The tracker's "Elsewhere" panels read Rigged's and Dives' `stats.json` the same way.

Done when: all four dark sites show the strip; the research homepage count matches the tracker's without a hand edit after a sweep; `grep -rn "1,2[0-9][0-9]+" controversial-trump-research/src/pages/index.astro` finds nothing hard-coded.

Pitfall: build-time fetch of a sibling site means a Rigged deploy can see a stale tracker count by a few minutes. Acceptable; say so in a code comment.

### WP5. "Also covered in" cross-links from `trackerIds`

Status: Rigged and Deep Dives done and merged October 25, 2026 (branches `claude/wp5-crosslinks`): `/crosslinks.json` on each site (107 entries / 125 rows on Rigged, 32 / 61 on Dives), "Tracker entry" links on cards, heard items and dive events, titles from a committed snapshot refreshed by `node sync-tracker-titles.js` and checked by `verify-sources.js`. Open: the tracker half, the "Also covered in" block on entry pages reading both files at build time with an empty fallback.

Goal: every tracker entry that appears in a Rigged card or a Deep Dive links to it, and vice versa, generated from data.

Model: Sonnet. Depends on: WP1, WP4 part A.

Rigged: `src/data/actions.json` cards carry `trackerIds`. At build, write `public/crosslinks.json`: `{ "<entryId>": [{ "site": "rigged", "title": "<card title>", "url": "https://riggingelections.com/#<card id>" }] }`. Deep Dives: each dive's `src/data/*.json` has top-level `trackerIds` and items may carry their own; write the same shape to `public/crosslinks.json` with the dive's URL and, where an item has an anchor, the anchor. Tracker: the entry-page plugin fetches both files at build time (fallback: none), and `ControversyPage.jsx` renders an "Also covered in" block under Key Facts: one row per link with the site's mono label and the card or dive title. Rigged and Dives already link back to the tracker per source; add an explicit "Tracker entry →" link on each card and dive event using `entryUrls`-style `/controversy/<id>/` URLs.

Done when: `trump-dismantles-foreign-election-interference-units-cisa-hack-request` on the tracker shows its Rigged card, and `trump-bans-cnn-ms-now-politico-white-house-hard-passes-confiscated` shows the Shut Out dive; a card on Rigged shows a "Tracker entry" link for each of its `trackerIds`.

### WP6. Entry page polish

Status: done. Branch `claude/wp6-entry-page-polish` (80d9bb8) merged to `main` on October 25, 2026: progress bar on the navbar edge, desktop contents rail and "What changed" log for entries over 1,200 words with dated updates (`LONG_ENTRY_WORDS` in `website/src/utils/entryChanges.js`), paragraph permalinks (`#p-N`), share row with the card image and Copy link, Key Facts badge hidden at 1, related entries ordered by shared tags. Open: the site stylesheet embeds 57 font files (688 KB raw, about 420 KB gzipped on every page); serve the fonts as files instead (final tracker pass).

Model: Opus for the diff feature, Sonnet for the rest. Depends on: WP1.

- Reading progress bar (2px, `--brand-bright`) under the network strip on entry pages.
- A right-rail table of contents on desktop for entries longer than 1,200 words, built from the summary's paragraph structure (Updates and Corrections are headed paragraphs: they start with `Update (Month D, YYYY):` or `Correction (Month D, YYYY):`).
- "What changed": parse those `Update (date):` paragraphs into a change log shown as a collapsed timeline at the top of long entries ("Updated 6 times since Oct 12; latest Oct 22"), each item jumping to its paragraph. This is the single most useful reading feature for an entry like the Omar one, which has eight updates.
- Paragraph permalinks: each paragraph gets an `id` (`p-3`) and a hover anchor, so a reader can cite one paragraph.
- Sticky share row with the per-entry card image (from WP1) and a "Copy link" button.
- Hide the count badge next to "Key Facts" when the count is 1.
- Related entries: keep the existing six, but order by shared tags then date, and show the severity dot.

Done when: the Omar entry shows a change log with every update dated correctly, the TOC tracks scroll, and no layout shift occurs when the progress bar mounts.

### WP7. Timeline scrubber

Status: done. Branch `claude/wp7-timeline-scrubber` (b3fb9cf) merged to `main` on October 25, 2026: canvas density strips (weekly since January 2025, yearly before), brush-select and keyboard selection written to the URL, severity chips, build-time `weeks.json` and `timeline-rows.json` from the plugin; the page no longer downloads the corpus (1,657 KB to 399 KB gzipped, of which `main.js` is 256 KB). Behaviour changes: the title filter no longer matches tags (links to full search instead); filters live in the URL.

Model: Opus. Depends on: WP1 (entry URLs), WP3 (to drop the corpus import from the timeline page).

Goal: `/timeline` gets a density strip above the list: one column per week since January 2025 (about 95 columns) plus a coarser pre-2025 strip, stacked by severity, drawn on a `<canvas>` (not vis-timeline; it is installed but unused and heavier than needed), with brush-select to filter the list below and hover tooltips with the week's count. Data from the build-time plugin (`weeks.json`: week start, per-severity counts). The year chips stay; the month groups stay.

Done when: dragging across October 2026 filters the list to those weeks, the canvas redraws under 16 ms on resize, and keyboard users can step weeks with arrow keys.

### WP8. Research site: de-template

Status: done except the `stats.json` counts (WP4 Part C). Branch `claude/wp8-detemplate` (3f9acda) merged to `master` on October 25, 2026: hero-only reveal, static "Key findings" strip from the first three `tickerItems`, `Masthead` `lead` prop set per page (28 stat, 21 quote, 25 title), eyebrow fix, posts linking `/controversy/<id>/`, plus 1,293 pre-existing contrast failures fixed with bright text variants and a `--faint-fill` token. Follow-ups: the workspace CLAUDE.md Part 2 still describes the marquee Ticker and lacks the `lead` prop; about a dozen pages lead their `tickerItems` with 200-330 character items, so the strip runs tall on phones until those arrays are reordered.

Model: Sonnet. Depends on: WP4 (stats).

- Reveal-on-scroll: keep it on the hero only. Everything else renders visible. Add `@media (prefers-reduced-motion: reduce)` that disables the remaining transition. (The pages currently animate about 60 elements each; fast scrollers see dim sections.)
- Tickers: replace the marquee component with a static strip of two or three key findings per page, or a single fact that rotates every 8 s with a pause control. Keep the `tickerItems` arrays as the data source so nothing is lost; render the first three.
- Hero variety: `Masthead` gets a `lead` prop: `"title"` (today's stack), `"stat"` (opens on the PullStat), `"quote"` (opens on the IntroQuote). Set it per page so no two adjacent pages in a series open the same way.
- Mobile: the boxed eyebrow wraps; let it break out of the border below 480px.
- Posts page: `src/pages/posts` links entries with `?id=`; switch to `/controversy/<id>/`.
- Counts from `stats.json` (WP4).

Done when: a page screenshot taken immediately after a scroll shows no element under opacity 1; no marquee exists; the homepage count is not hand-coded.

### WP9. Rigged Before the Vote: after November 3

Status: done. Built on branch `claude/wp9-after-the-vote` (6ea9542) and merged to `main` on October 25, 2026, with the clock logic in `src/lib/election-clock.js` (`npm run check:clock`), the "Jump to" select at 900px and below, build-time hero numbers, the `AFTER_STATUS` placeholder block (user fills it; nothing renders while empty) and 70 pre-existing contrast failures fixed with text-only status tokens. Remaining for the user: `www.riggingelections.com` in the Vercel dashboard. Pre-existing dead card sources noted by the session (AP via WSOC-TV on `dhs-unlawful-voter-initiative`, AP via OPB on `alabama-districts`) belong to the next sweep's live check.

Model: Sonnet. Depends on: nothing. Do this before November 3.

- Countdown chip: when the date passes, it becomes "Election Day was November 3" for a week, then disappears.
- Hero counters: render the final numbers in the HTML and let JS animate only when `prefers-reduced-motion` is not set; today the page claims "6 documented actions" for a moment on load.
- Section nav (nine items) clips at 900px; collapse to a sticky "Jump to" select below that width.
- Add a top-of-page "After the vote" status block the user will fill: certification deadlines by state, pending suits (there is already an "After the Vote" section; promote it to the top once the vote is over).
- `www.riggingelections.com`: the user runs `vercel domains add www.riggingelections.com election-rigging` and sets the redirect in Project Settings → Domains; do not run it yourself.

### WP10. Deep Dives: domain and nav

Model: Sonnet. Give it `dives.thetrumptracker.com` (matches `research.thetrumptracker.com`): the user adds the domain in Vercel; you change `site:` in `astro.config.mjs`, the Deployment note in its `CLAUDE.md`, the memory note "Live domains", and every link to `deep-dives-gamma.vercel.app` in the other repos (grep all five). Add Deep Dives to the tracker navbar (WP4 does the strip; the Infima navbar should also get it).

### WP11. The Civics Desk

Model: Sonnet. Follow `the-civics-desk/CLAUDE.md` and run the style hook as that file describes; pushes need the user's word.

- Homepage cards: show each article's "The One-Sentence Version" paragraph (every article has that section) as the card's dek instead of the summary; hide the tag chips below 480px (they wrap into three rows).
- Reading-time line: replace "144 MIN READ" with "15 sections" (count `##` headings) and keep the sources count; readers bounce off a two-hour number.
- Sticky table of contents on desktop (from `##` headings) and a thin progress bar.
- Footnote popovers: the `[n]` superscripts link to `#src-n`; add a hover/tap popover that shows the source's text (outlet and headline) from the matching `<span id="src-n">` line, with the link, so readers can check a claim without losing their place. Pure CSS/JS, no library.
- "Where Things Stand Now" sections are long date-bullet lists; render them as a vertical timeline (date in mono on the left, text right) via a small Markdown post-processor on list items that start with `**Month D:`.

### WP12. Tracker odds and ends

Model: Sonnet.

- `trumpingtrump.com` should 301 to `thetrumptracker.com` (Vercel domain redirect; the user sets it in the dashboard, or `vercel.json` `redirects` with `has: [{type: 'host', value: 'trumpingtrump.com'}]`).
- "50 Reasons" and "The Case" each link one entry deleted in commit `0764a8c`; find the replacement entry or drop the link.
- The generic share image still says "290+ entries"; regenerate `static/img/og-image.png` with the live count from `stats.json` at build.
- Categories page: replace the stacked colored counts with the index-row mini severity bar.
- Timeline page year chips: keep; add the severity bar for the selected year.

**Status (2026-10-25): done, on `main` at `9cae325`, Sonnet.** The two dead links (one each in 50 Reasons and The Case, entries deleted in `0764a8c`) had no replacement entry and were dropped with their sentences kept; `npm run build` now runs `npm run check:pages` first, so a link to a missing or merged-away id fails the build before Docusaurus starts. The site share card is drawn at build from the same stats as `/api/stats.json` (`lib/site-card.js` → `build/img/og-image.png`); the committed `static/img/og-image.png` is the figure-free fallback. `/categories` renders the front page's `CategoryIndex` rows (shared component, ordered by count, no corpus load: 1,617 → 294 KB gzip). Timeline year chips set the brush to that year and show its severity bar (`YearBar.jsx`). The `trumpingtrump.com` 301 is the user's, in the Vercel dashboard. Loose ends: `static/img/og-image.svg` ("290+") and the workspace `og-image-instructions.md` can be retired; the 50 Reasons intro still says "nearly a thousand documented entries".

## 4. Fresh eyes: what would make these sites stand out

Written without the old design preferences as a constraint. Each item is a spec a Sonnet or Opus session can build; none needs new content.

1. **One front door.** Readers meet four domains and four designs. The long-term move is one Astro 6 site at `thetrumptracker.com` with sections `/`, `/dives`, `/rigged`, `/research`, sharing one token set and one build, with the Civics Desk kept separate on purpose. Migration path: tracker first (its data layer is JSON; Docusaurus adds nothing the pages use except Infima), then fold Rigged and Dives in as sections (they are already Astro 6 with the same tokens), then Research last (Astro 4 → 6, 60 pages). Do not start this before WP1 to WP5 land; they are the pieces the migration reuses.

2. **Source rail.** On entry pages, show the sources beside the paragraphs that cite them, not only in a list at the end: a right rail that follows scroll, highlighting the outlets quoted in the paragraph in view (match on the outlet names that appear in the paragraph text, e.g. "CBS News reported"). This turns "every claim is sourced" from a footer into something a reader sees while reading.

3. **Sources by lean, honestly.** Each source has a `type` (news, investigation, court-document, government-record). Add a curated `outlets.json` (domain → outlet name, lean: left/center/right from a stated public rating, and a `primary: true` flag for courts, agencies and official records). Entry pages then show "17 sources: 5 primary documents · 7 center · 3 left · 2 right". Only outlets in the file get a lean; unknown domains show no lean. The file must be built by hand from a named rating source and reviewed by the user; never guess a lean.

4. **Change logs as a first-class view.** Entries accumulate `Update (date):` paragraphs. A `/changes` page lists every update in reverse order across all entries (date, entry title, first sentence of the update), which is the "what's new today" readers and journalists actually want. The RSS feed should carry updates as items too (`<guid>` per entry+date).

5. **Public data.** Publish `/api/entries-slim.json` and `/api/stats.json` (WP4) plus `/api/entries/<id>.json`, with a `/data` page that documents them and the JSON schema. A tracker that journalists can query is a different class of site from one they can only read. Add a `Last-Modified` header and a weekly `entries.zip`.

6. **Keyboard and permalinks.** `/` focuses search, `j`/`k` move through a river, `Enter` opens, `Esc` returns; every paragraph and key fact has a permalink; the share image for an entry can be downloaded from the page. Cheap, and it signals a tool built by people who use it.

7. **A light theme for the dark sites.** The dark sites are dark-only. Readers coming from a newspaper link in daylight get a wall of black. Offer a light theme with the same tokens (the mockup's `:root` block shows the shape; light values: bg #f6f5f2, surface #ffffff, raised #f0eeea, line #d9d6d0, text #15181d, text-2 #4b5158, text-3 #6b727a; severity and brand colors unchanged, which already pass on white). Respect `prefers-color-scheme` and remember a manual choice in `localStorage`.

8. **Motion: one moment.** On the front page, the pace strip and severity bar draw in once over 600 ms on first paint (height from 0, left to right), then nothing else moves except hover underlines. Remove scroll-reveal everywhere else. Honor `prefers-reduced-motion`.

9. **Research as a magazine, not a template.** Give each deep dive a distinct opener (WP8's `lead` prop), a table of contents, and a "What this page claims, and what it rests on" box up top: three bullets of the strongest findings each with its primary document. The NavigationGrid hubs are good; the per-page sameness is the problem.

10. **Rigged as a live wire until November 3, then a record.** Before: add a "Latest" strip at the top with the three newest cards and a "What changed today" line computed from `date` fields. After: freeze the countdown, add the outcome of every pending suit as it lands, and keep the page as the record of record. The design already supports this; it is a data and copy job.

11. **Civics Desk: make it the calmest page on the internet.** It is close. Finish with: a reading progress bar, the one-sentence version on every card, footnote popovers (WP11), and a "Read this if you only have five minutes" cut of each explainer (the One-Sentence Version plus "Where Things Stand Now" summarized to five bullets, written by a person, not generated).

12. **Performance budget, written down.** Every page: under 200 KB of JavaScript compressed, no blocking third-party scripts, fonts self-hosted and `font-display: swap`, LCP under 2.5 s on a throttled 4G run of headless Chrome. Put a script in each repo (`npm run perf`) that builds, serves, and reports these numbers with Lighthouse in headless mode, so a PR can quote them.

What to avoid, still: emoji icons; marquee tickers; a hero that fills the viewport; cards for feeds; reveal-on-scroll on body text; stacking three promo boxes above the content; counts that animate from zero in server-rendered HTML; any text below AA contrast.

## 5. Verification checklist for every UI pull request

1. `npm run build` passes in the repo (and the tracker's `node sync-data.js && node audit-em-dashes.js && node verify-sources.js` stays clean).
2. Two headless screenshots per changed page, 375 and 1280 wide, attached to the PR or saved under the session's scratchpad and linked.
3. axe-core (`wcag2a`, `wcag2aa`) on each changed page: zero `color-contrast` violations; list any other violation with a reason.
4. No horizontal scroll at 375px (`document.documentElement.scrollWidth === clientWidth`).
5. Every `href` on the changed page returns 200 or 30x (one script; `thehill.com` and other bot-blockers answer 403 and are fine).
6. JavaScript per page under the budget in §4.12; quote the compressed sizes.
7. No new hard-coded counts; anything that is a count comes from `stats.json` or build-time data.
8. The commit message says what changed and why; attribution line as the workspace rules require.

## 6. Session briefs (paste as the first message of a new session)

Each brief assumes the session reads this file first.

- **WP1:** "In controversial-trump, merge origin/claude/prerendered-entry-pages then origin/claude/fix-day-early-card-dates into main, build, push, and run the three live checks in UI-ROADMAP.md §3 WP1. Report the results. Sonnet."
- **WP2+WP3:** "Implement UI-ROADMAP.md WP2 (front page from design/tracker-front-page.mockup.html) and WP3 (Pagefind search) on one branch in controversial-trump/website. Build-time data via the existing plugin, no corpus import on the homepage. Done-when criteria and pitfalls are in the file. Opus."
- **WP4:** "Implement UI-ROADMAP.md WP4: stats.json in the tracker, Rigged and Dives; the network strip in all four dark sites; the research homepage count from stats.json. One branch per repo. Sonnet."
- **WP5:** "Implement UI-ROADMAP.md WP5 cross-links from trackerIds: crosslinks.json in election-rigging and deep-dives, the 'Also covered in' block on tracker entry pages, and 'Tracker entry' links on cards and dive events. Sonnet."
- **WP8:** "Implement UI-ROADMAP.md WP8 on controversial-trump-research: hero-only reveal, static key-findings strip instead of the marquee, the Masthead lead prop, posts-page URLs, counts from stats.json. Sonnet."
- **WP9:** "Implement UI-ROADMAP.md WP9 on election-rigging before November 3. Sonnet."
- **WP11:** "Implement UI-ROADMAP.md WP11 on the-civics-desk; follow its CLAUDE.md and style hook; commit but do not push. Sonnet."
- **§4.2 source rail / §4.4 change logs / §4.7 light theme:** one session each, Opus for the rail, Sonnet for the other two.
