# Politiboop Project Guide

## Project Overview

This workspace contains four repositories:

| Repository                      | Type                | Framework  | Purpose                                                                                |
|---------------------------------|---------------------|------------|----------------------------------------------------------------------------------------|
| `controversial-trump/`          | Data + Tracker Site | Docusaurus | Controversy database (JSON) + public-facing browsable tracker at thetrumptracker.com   |
| `controversial-trump-research/` | Research Site       | Astro      | Deep-dive research pages with original analysis, evidence synthesis, and expert voices |
| `the-civics-desk/`              | Explainer Site      | Astro 6    | Accessible, non-confrontational explainers for general audiences — "Sourced. Simple. Decide for yourself." |
| `stand-against-trump/`          | Personal Project    | Markdown   | Personal research essays — opinionated but factually sourced arguments against supporting Trump |

## Working Directory

The primary working directory is `/Users/brock/dev/politiboop/controversial-trump/website`. All four content repos live under
`/Users/brock/dev/politiboop/`.

## Scope: This Is a Trump Tracker

**Everything in this project must connect to Donald Trump.** This is not a general political controversy tracker. Every
controversy entry must be about Trump's actions, decisions, statements, or direct consequences of his policies.

**Included:**

- Trump's own actions, statements, and executive orders
- Actions by Trump appointees acting in their official capacity (e.g., Patel, Bondi, Gabbard, Musk/DOGE)
- Direct consequences of Trump policies (e.g., DOGE cuts causing agency failures during Iran war)
- Actions by Trump allies that Trump directed, endorsed, or enabled (e.g., Noem at DHS)

**Excluded:**

- General Republican Party controversies not tied to Trump
- State-level GOP actions unless Trump directed or endorsed them
- Democratic controversies or general political news
- International events unless Trump's actions are the central factor

**When in doubt:** Ask "Is Trump the actor, the decision-maker, or the direct cause?" If no, it doesn't belong.

---

## Part 1: The Tracker (`controversial-trump/`)

### Data Structure

Controversies live in `data/controversies/*.json`. Each file follows this schema:

```json
{
  "id": "kebab-case-unique-id",
  "title": "Full descriptive title",
  "primaryCategory": "one-of-the-valid-categories",
  "severity": "one-of-the-valid-severities",
  "timeline": "first-term | second-term | pre-presidency",
  "date": "YYYY-MM-DD",
  "summary": "Multi-paragraph summary using \\n\\n for breaks",
  "keyFacts": [
    "Fact 1",
    "Fact 2"
  ],
  "sources": [
    {
      "text": "Source Name: Article Title",
      "url": "https://...",
      "type": "news | investigation | court-document | government-record"
    }
  ],
  "specialTags": [
    "relevant",
    "tags"
  ]
}
```

### Valid Categories (STRICT)

Only these values are accepted in `primaryCategory`. Using anything else causes runtime errors:

`democracy` | `women` | `racism` | `corruption` | `abuse-of-power` | `character` | `narcissism` | `rewriting-history` |
`ice-enforcement` | `public-health` | `absurd`

**DO NOT** use `personal-conduct`, `foreign-policy`, `economy`, or any other made-up category.

### Valid Severities (STRICT)

Only these values are accepted in `severity`. Using anything else causes undefined `.color` lookup errors:

`catastrophic` | `severe` | `serious` | `moderate` | `concerning` | `disputed` | `absurd`

**DO NOT** use `minor`, `critical`, `major`, or any other made-up severity.

### Severity Rubric (USE THIS BEFORE ASSIGNING)

The 7-tier system exists so that genuinely catastrophic events (mass deaths, rule-of-law collapse, nuclear risk) are visually distinct from routine misconduct. If 40% of entries are "catastrophic," the label stops meaning anything. **Err downward, not upward.**

| Severity | When to use | Target % | Examples |
|---|---|---|---|
| `catastrophic` | Irreversible mass harm — deaths at scale, war crimes, nuclear risk, rule-of-law collapse, destruction of a democratic institution that cannot be rebuilt quickly. | **<8%** | Family separation (5,500+ children); "whole civilization will die tonight"; 180+ killed in boat strikes; nuclear testing order; SPLC indictment freezing Hatewatch; US measles elimination lost. |
| `severe` | Major institutional damage OR lasting harm — reversible but only with sustained effort. Usually national-scale. | **15-20%** | Replimune rejection; judge voiding RFK vaccine overhaul; Patel weaponizing FBI against a reporter; Fed Chair criminal probe used as leverage; Iran war weapons-stockpile depletion. |
| `serious` | Real legal, ethical, or policy violation with contained scope. Individual agency or individual contract, not the whole institution. | **30-35%** | Most court losses against administration; individual appointee corruption (Kash Patel's jet trips); specific tariff policies; individual self-dealing contracts. |
| `moderate` | Ethics lapse, policy failure, or norm violation with material but limited impact. The fact matters, but the harm is bounded. | **20-25%** | Individual appointee scandals without indictment; rescinded rules; single ethical violations; minor contract conflicts. |
| `concerning` | Worth tracking — questionable conduct, minor norm violations, or notable rhetoric. Not itself a violation of law or policy. | **10-15%** | Tennis photo blocking women athletes; Barron's business ventures; symbolic incidents; off-color statements. |
| `disputed` | Alleged, contested, or single-sourced — awaiting independent confirmation. Flag `UNCONFIRMED` in summary. | **<2%** | Single-source Daily Mail stories; unverified anonymous-source claims; Trump denies and no primary document exists. |
| `absurd` | Bizarre theater without substantive harm. The story is the absurdity itself. | **<5%** | "Nuking hurricanes"; Revolutionary War airports; Windmills cause cancer; AI Jesus image. |

**Calibration checks before assigning `catastrophic`:**
1. Did someone die, or is there imminent risk of mass death?
2. Was a constitutional right eliminated rather than abridged?
3. Did a democratic institution cease functioning, not just get damaged?
4. Is the harm irreversible in this administration's lifetime?

If the answer to all four is no, it is not catastrophic. Move to `severe` or lower.

**Calibration check before assigning `severe`:**
- Would a reasonable national newspaper lead with this story on its own? If yes, `severe` or higher. If no, `serious` or lower.
- Does the harm extend beyond the individual actor to damage the institution? If yes, `severe` is defensible. If it's just one person's misconduct, `serious` or `moderate` fits.

**Never use `catastrophic` or `severe` for:**
- An appointee being embarrassing
- A tweet
- A policy position we disagree with
- A single court loss by the administration (that's often `serious` at most)
- Anything that was reversed within a week

### Avoiding Duplicates

Before creating any new controversy entry, **always check for existing entries** that cover the same story:

1. **Search by keyword:** `ls data/controversies/ | grep <keyword>` (e.g., `grep doge`, `grep iran`, `grep kennedy`)
2. **Search by content:** Use Grep to search inside existing JSON files for key names, events, or phrases
3. **Check for updates vs. new entries:** If a story is an update to an existing controversy (e.g., new developments in
   an ongoing scandal), **update the existing entry** rather than creating a new one — add to the summary, keyFacts, and
   sources
4. **Separate entries for genuinely distinct events:** If a story is a new, distinct action (even by the same person on
   the same topic), it warrants its own entry

**Example:** "DOGE promised $2T, delivered $215B" and "DOGE admits under oath deficit increased" are separate entries —
one is about the savings shortfall, the other is about lying under oath. But "DOGE cuts SNAP" should not be duplicated
if an existing DOGE entry already covers SNAP cuts.

### Formatting Rules

- **Every new entry must include `"updatedDate": "YYYY-MM-DD"`** set to today's date (the date the entry was created, not the controversy's historical date). This ensures new entries appear when sorting by "Recently Updated" — even if the controversy itself happened months ago.
- When **updating** an existing entry with new developments, update `"updatedDate"` to today's date
- The `updatedDate` field enables "Recently Updated" sorting on the tracker homepage
- Add optional `"dateTime": "YYYY-MM-DDTHH:MM:SS"` for precise sorting when multiple entries share the same date
- `dateTime` is used for sort ordering when present, falls back to `date` — no need to backport old entries
- Use `\n\n` for paragraph breaks in summaries (not `<br>`)
- Use escaped double quotes (`\"`) for quoted speech in JSON, with commas before attribution (e.g., `said, \"quote\"`)
- Never use single quotes for quoted speech in JSON strings
- Keep summaries readable with paragraph breaks every ~400 characters

### Title Writing Rules

Titles should read like a journalist wrote them, not like an AI generated them.

**Do NOT use em dashes (—) in titles. EVER.** They create a formulaic "Claim — Detail — Quote" pattern that makes
every entry feel the same. Instead, write titles as natural sentences or phrases.

**Self-check before saving any new entry's title:**
1. Open the title and search for `—`. If present, rewrite.
2. Read the title aloud. Does it sound like a Reuters or AP headline, or like an AI-generated chain of clauses?
3. If you used a colon, was it natural (`Cao: I Want a Hood With Slits`) or AI-formulaic (`Trump Did X: Pattern of Y: Quote`)? Colons are fine sparingly.

**Audit:** `node website/audit-em-dashes.js` lists every entry with em dashes in its title, sorted by recency.
The script exits non-zero so it can be wired into pre-commit checks. Treat any em-dash title as a bug — fix it
when you touch the entry, and refuse to add new ones.

**Common em-dash substitutes:**
- Comma + connector ("After Telling Congress She Pays Rent" → ", after testifying that...")
- Two sentences (period instead of em dash)
- Subordinate clause ("Because", "Even Though", "While")
- Restructured sentence with the strongest fact in the lead

**Bad (formulaic):**
- `Trump Calls Jackson 'Low IQ' — Pattern of Racism — Only Black Female Justice`
- `FBI Investigated Reporter — Recommended Stalking Charges — DOJ Called It Retaliation`

**Good (organic):**
- `Trump Calls the Only Black Female Supreme Court Justice a 'Low IQ Person'`
- `Patel's FBI Investigated a NYT Reporter for Writing About His Girlfriend, Then Tried to Charge Her With Stalking`

**Guidelines:**
- Write titles that could be newspaper headlines — clear, direct, human-sounding
- Lead with the most striking fact, not a label
- Use colons sparingly and only when natural (e.g., `Kerry: Three Presidents Refused Netanyahu`)
- Include the key quote or number that makes the story memorable
- Keep under ~120 characters when possible, but clarity beats brevity
- Avoid stacking multiple claims in one title — pick the strongest angle

### Controversy Detail Page — Editorial Article Layout

Each controversy renders as a **long-form news article** inspired by The Intercept's editorial design:

**Structure:** Header (severity badge, category, period) → Headline → Byline (date, source count, fact count, share)
→ Article body (summary as prose with pullquotes) → Key Facts (numbered list) → Sources (grouped by type) → Tags →
Prev/Next → Related Records

**Pullquotes** are auto-selected from `keyFacts` using a scoring system that prioritizes:
- Direct Trump speech (+50 points)
- Named person attribution like "Hakeem Jeffries: ..." (+30)
- Clean colon-separated format (+20)
- Punchy length between 40-200 chars (+15)
- High ratio of quoted text (+10)

1-3 pullquotes are rendered as **centered text with red top and bottom borders** (Intercept-style), inserted at natural
paragraph break points throughout the article body.

**Writing keyFacts for good pullquotes:**
- Include 1-3 facts with direct quoted speech that would make strong standalone pullquotes
- Use colon-separated format for attribution: `"Trump: 'quote here'"` or `"Hakeem Jeffries: 'quote here'"`
- The most damning or absurd quotes should be formatted this way so the scoring system picks them up
- Keep pullquote-worthy facts punchy (under 200 characters) — they display centered in large italic serif text

### Sync Workflow

After adding or modifying any controversy JSON files, you **must** complete the full pipeline:

```bash
# Step 1: Git track new files
cd controversial-trump && git add data/controversies/<new-file>.json

# Step 2: Sync data + generate social images
cd website && node sync-data.js && node generate-social.js

# Step 3: Check research pages for augmentation (MANDATORY — see Part 3)
# For EVERY new entry, consult the augmentation table and determine if it strengthens any research page.
# If yes, augment the page. If no, note it explicitly.
```

- `sync-data.js` copies from `data/controversies/` to `website/src/data/controversies/` and regenerates
  `controversyIndex.js`
- `generate-social.js` creates shareable PNG images for new/updated entries (skips existing). Output:
  `social/instagram/<category>/` (1080x1080) and `social/twitter/<category>/` (1200x630), named
  `YYYY-MM-DD_controversy-id.png`
- Use `--all` to regenerate everything, `--id <id>` for a specific entry
- **Research augmentation** is mandatory — see "Part 3: Working Together" for the augmentation table and process

### Social Media Carousel Suggestions

After creating a new controversy entry, **proactively assess whether it warrants an Instagram carousel** — a multi-slide
social media post that tells the story visually. Suggest a carousel when:

- The story has a **clear narrative arc** (timeline, escalation, cause → effect)
- There's a **dramatic quote** worth its own slide (Tucker Carlson nuclear codes, MTG "25th Amendment")
- There's a **shocking stat** that works as a standalone visual (52% impeachment, $580M in 60 seconds)
- The story involves **hypocrisy** that can be shown as before/after or claim/reality
- The story is **breaking news** worth sharing immediately on social media
- Multiple **named people** are reacting in quotable ways

**When suggesting a carousel, propose the slide-by-slide outline:**
1. What type each slide is (hook, story, quote, stat, timeline, receipts)
2. What content goes on each slide
3. Why that order tells the story effectively
4. Whether screenshots from Truth Social/X are needed (ask the user to provide them)

**Carousel generation:**
```bash
node generate-carousel.js --config carousels/<name>.json
```

Slide types available: `hook` (scroll-stopper title), `story` (headline + bullets), `quote` (centered dramatic quote),
`stat` (giant number + context), `timeline` (sequential events), `receipts` (sources + links).

Output: `social/carousels/<carousel-id>/01.png`, `02.png`, etc. — numbered slides ready to upload.

**Do NOT suggest carousels for every entry.** Most entries are adequately served by the auto-generated single social
image. Carousels are for stories that deserve the extra storytelling effort — maybe 1 in 10 entries.

### Git Tracking — New Files

**Always `git add` new files** that are required by either website. This applies to:

- New controversy JSON files: `git add data/controversies/<filename>.json`
- New or modified research pages: `git add controversial-trump-research/src/pages/<path>.astro`
- New components: `git add controversial-trump-research/src/components/<path>.astro`
- New or modified Civics Desk articles: `git add the-civics-desk/src/content/articles/<filename>.md`
- New scripts or config files required by any site

**Do NOT git add:**
- Generated files in `social/` (already in `.gitignore`)
- `node_modules/`, `build/`, `.docusaurus/`, `dist/` (already gitignored)

When creating multiple new controversy entries in a batch, `git add` them all at once:
```bash
cd controversial-trump && git add data/controversies/*.json
```

For the research site:
```bash
cd controversial-trump-research && git add -A src/pages/ src/components/
```

For the Civics Desk:
```bash
cd the-civics-desk && git add src/content/articles/ src/pages/
```

### Build

```bash
cd controversial-trump/website && npm run build
```

Dynamic import warnings are expected and harmless.

---

## Part 2: The Research Site (`controversial-trump-research/`)

### Architecture

The research site is a static Astro site with deep-dive investigations organized into sections:

```
src/pages/
  index.astro                          # Homepage
  critics/                             # Profiles of officials who spoke out
  corruption/                          # Hub + 7 subpages (The Grift — top-level section)
  fact-check/
    index.astro                        # Fact Check hub ("The Record vs. The Narrative")
    constitutional-violations/         # Hub + subpages
    lawfare-and-convictions/           # Hub + subpages
    project-2025/                      # Hub + subpages
    the-2020-election.astro            # Standalone
  attacking-democracy/                 # Series with tabs
  election-rigging/                    # Series with tabs
  epstein-files/                       # Hub + subpages
  fascism/                             # Hub + subpages
  dangerous-rhetoric/                  # Hub + subpages
  attacks-on-science.astro             # Standalone
  erasing-history.astro                # Standalone
  scapegoat-strategy.astro             # Standalone — cross-cutting analysis
  the-loyalty-purge/                   # Hub + 4 subpages (top-level section)
```

### Component Library

All research pages use a shared design system. Key components (all in `src/components/design/`):

| Component                       | Purpose                                                                                         |
|---------------------------------|-------------------------------------------------------------------------------------------------|
| `Masthead`                      | Page hero with eyebrow, title (supports `<span class='word-red'>` highlighting), subtitle, date |
| `Ticker`                        | Scrolling news ticker bar                                                                       |
| `IntroQuote`                    | Featured quote with citation                                                                    |
| `StatGrid` + `StatCard`         | Animated stat counters (target, prefix, suffix, label, accentColor)                             |
| `SectionDivider`                | Labeled horizontal rule between sections                                                        |
| `SectionHeader`                 | Section eyebrow, title (supports `<br>`), intro text                                            |
| `CategoryGrid` + `CategoryCard` | Evidence catalog cards — use ONLY for parallel reference items, not for people or comparisons   |
| `ProfileCard`                   | Horizontal person card with name/role on left, timeline events (service/crime/punishment), story on right |
| `VoicesSection` + `VoiceCard`   | Expert/official quotes with attribution (use for grouped quotes)                                |
| `ProseSection`                  | Max-width prose column for narrative paragraphs                                                  |
| `PullStat`                      | Dramatic standalone stat (value, context, source) — limit 1 per page                            |
| `NarrativeQuote`                | Inline blockquote with left border — flows with prose (use for standalone quotes)               |
| `SideBySide` + `SideBySideRow`  | Two-column comparison (claim/reality, before/after, then/now). Use for ANY paired content.      |
| `AlertBanner`                   | Warning/info banners (variants: red, blue, amber)                                               |
| `ColoredSection`                | Background color wrapper for AlertBanners                                                       |
| `HighlightBar`                  | Full-width text highlight strip — keep to ONE punchy line                                       |
| `CTASection`                    | Subtle "back to hub" link — NOT a primary action (PageNavigation handles that)                  |
| `NavigationGrid`                | Horizontal cards with colored CTA panels for section navigation                                 |

Navigation components (in `src/components/navigation/`):

- `Breadcrumbs` — breadcrumb trail
- `SeriesNav` — tabbed navigation for multi-page series
- `PageNavigation` — sticky bottom bar with prev/next links and scroll progress bar

**CSS-only patterns** (not components — inline HTML/CSS per page):

- **Bar charts** — horizontal bars for polling shifts, election results, implementation percentages. Copy pattern from `the-loyalty-purge/abandoned-principles.astro`
- **Profile grids** — flex column wrapper for ProfileCards: `.profile-grid { max-width: var(--container-max); margin: 0 auto; padding: 0 24px 48px; display: flex; flex-direction: column; gap: 10px; }`

### Page Patterns

**Hub pages** (e.g., `corruption/index.astro`):
`Breadcrumbs → Masthead → Ticker → IntroQuote → StatGrid → SectionHeader → NavigationGrid (subpage links) → HighlightBar → CTASection`

**Content pages — prose-first pattern** (preferred for all subpages):
`Masthead → Ticker → IntroQuote → StatGrid → [Chapters: SectionDivider → SectionHeader → ProseSection → NarrativeQuote → [content] → PullStat] → AlertBanner → HighlightBar → PageNavigation → CTASection`

The key principle: **match the component to the content type:**

| Content Type | Component |
| ------------ | --------- |
| Parallel evidence items (lists of examples) | `CategoryGrid` + `CategoryCard` |
| Individual people with arcs (loyalty, career, persecution) | `ProfileCard` with timeline events |
| Before/after, claim/reality, then/now comparisons | `SideBySide` + `SideBySideRow` |
| Polling data, election results, numerical shifts | CSS bar charts (inline HTML/CSS) |
| Narrative argument building | `ProseSection` |
| Key quotes from real, named sources | `NarrativeQuote` (standalone) or `VoiceCard` (in groups) |
| Single dramatic statistic | `PullStat` (limit 1 per page) |

**Never use CategoryCards for:** people (use ProfileCard), comparisons (use SideBySide), or polling data (use bar charts).

### Design Rules

- **No emojis** — use numbered markers (`"01"`, `"02"`) for sequential items, em dashes (`"—"`) for parallel items
- **Color variety** — alternate CategoryCard variants (`red`/`amber`), use `accentColor` on StatCards (red, amber, blue, green)
- **Real attributions only** — every IntroQuote and VoiceCard must cite a real, named source. No "Pattern Analysis of..." or "Evidence-Based Documentation" citations
- **Bold text** uses `font-weight: 500` (not 600) to avoid spacing jumps in Crimson Pro
- **HighlightBar** text should be one punchy line, not a paragraph
- **PullStat** — limit 1 per page for maximum impact
- **NarrativeQuote** vs **VoiceCard** — use NarrativeQuote for standalone quotes between prose sections; use VoiceCard only inside VoicesSection grids with multiple quotes
- **ProfileCard timelines** — use `service` type (green) for loyalty/appointments, `crime` type (amber) for the act of defiance, `punishment` type (red) for consequences
- **Bar charts** — use for polling data, election results, implementation percentages. Green for positive/before, red for negative/after, amber for intermediate. Copy CSS from `abandoned-principles.astro`
- **SideBySide** — use for ANY paired content (claim/evidence, before/after, historical/modern). Don't use CategoryCards for comparisons
- **NavigationGrid** — horizontal one-per-row cards with colored CTA panels. The "Read Investigation →" button should be unmistakable
- **PageNavigation** — sticky bottom bar with scroll progress. Should be the primary navigation action, not CTASection
- **CTASection** — subtle "back to hub" text link, NOT a primary action button. Keep it understated

### Import Paths

Pages are nested at different depths — import paths must match:

| Page depth | Example                                   | Import prefix |
|------------|-------------------------------------------|---------------|
| 1 level    | `pages/index.astro`                       | `../`         |
| 2 levels   | `pages/election-rigging/index.astro`      | `../../`      |
| 3 levels   | `pages/fact-check/constitutional-violations/index.astro` | `../../../`   |

### Keeping Hardcoded Values Updated

The research site is entirely static — **nothing is dynamic**. All numbers, facts, and ticker items are hardcoded. When controversies are added, research pages are updated, or new pages are created, the following must be checked and updated:

#### Controversy Count

Update in `src/pages/index.astro` — ticker item, StatCard target, and CTA description.

#### Homepage Stats (check when relevant totals change)

All in `src/pages/index.astro`:
- Controversy count StatCard — update when controversies are added
- Former officials StatCard — update when critics are added
- Research pages StatCard — update when pages are added

#### Tickers on Every Research Page

There are **56+ pages** with `const tickerItems = [...]` arrays. These are hardcoded headline facts that scroll across each page. When adding controversies or augmenting research pages:

- **Add ticker items** to relevant pages when new stories are headline-worthy
- **Update existing ticker items** if facts/numbers have changed (e.g., a count increased)
- **Check the homepage ticker** (`src/pages/index.astro`) — it should reflect the most impactful current facts
- **Check the fact-check hub ticker** (`src/pages/fact-check/index.astro`) — should highlight findings across all deep dives

To find all tickers: `grep -r "const tickerItems" src/pages/`

#### StatCards Throughout the Site

Many research pages have `StatCard` components with hardcoded numbers (e.g., dollar amounts, counts, dates). When augmenting a page with new evidence, check whether any existing stats need updating.

### Build

Requires **Node.js >= 22.12.0** (set in `.nvmrc` for Vercel):

```bash
cd controversial-trump-research && npm run build
```

### Tech Stack

- **Astro 4.x** with ViewTransitions for smooth page navigation
- **Self-hosted fonts** via @fontsource (Bebas Neue, Crimson Pro, DM Mono, Oswald) — no Google Fonts CDN
- **@astrojs/sitemap** for SEO
- **Vercel** for deployment (auto-deploys from `master` branch)
- **Link prefetching** on hover for instant navigation

---

## Part 2.5: The Civics Desk (`the-civics-desk/`)

The Civics Desk is a separate site with its own identity, tone, and audience. It has its own `CLAUDE.md` at
`the-civics-desk/CLAUDE.md` with strict editorial, tone, and sourcing rules — **always follow that file when working
on Civics Desk content.**

Key differences from the tracker/research site:
- **Audience:** People who haven't been following closely, including conservatives and Trump supporters
- **Tone:** Conversational, never condescending, never snarky — "Sourced. Simple. Decide for yourself."
- **No loaded adjectives** — no "shocking," "dangerous," "radical"
- **Lead with questions, not conclusions** — let evidence build
- **Address counter-arguments with their strongest version** — don't strawman

### Current Articles (in `src/content/articles/`)

- `iran-war-explained.md` — Iran War explainer (JCPOA, strikes, timeline, costs, "Where Things Stand Now")
- `tariffs-who-pays.md` — How tariffs work, who actually pays, Fed data vs Trump claims
- `public-schools-explained.md` — Dept of Education dismantling, special ed, civil rights
- `fake-electors-scheme.md` — Fake electors mechanics, legality, accountability

When new controversies relate to these topics, update the articles — particularly the "Where Things Stand Now" sections
with new timeline events. Follow the Civics Desk CLAUDE.md for tone and sourcing rules.

---

## Part 3: Working Together — Cross-Repository Workflow

### When Adding New Controversies

Every time new controversy JSON entries are created, you **must** complete all four steps:

1. **Sync the tracker + generate social images:** `cd controversial-trump/website && node sync-data.js && node generate-social.js`
2. **MANDATORY — Check research pages for augmentation:** For EVERY new controversy, consult the augmentation table
   below and determine whether it can strengthen, add evidence to, or update any existing research page. This is not
   optional — the research site's value is in synthesis, and every new data point should be woven into the narrative
   where it fits. If a controversy matches a research page topic, augment the page (add a ticker item, CategoryCard,
   NarrativeQuote, ProseSection content, SideBySideRow, or update a StatCard number). If it doesn't fit any existing
   page, note that explicitly.
3. **MANDATORY — Check Civics Desk for augmentation:** For EVERY new controversy, check whether any existing Civics
   Desk explainer (`the-civics-desk/src/content/articles/`) should be updated with the new information. Current
   articles: `iran-war-explained.md`, `tariffs-who-pays.md`, `public-schools-explained.md`,
   `fake-electors-scheme.md`. If a new controversy adds context, timeline events, or data to an existing explainer,
   update it. If unsure whether an update is justified, ask the user. The Civics Desk has its own CLAUDE.md with
   strict tone/sourcing rules — follow them when augmenting.
4. **Flag new research page candidates:** If 5+ controversies now share a theme not covered by an existing research
   page, proactively suggest a new page to the user.

### Research Page Augmentation Guide

When a new controversy connects to an existing research topic, it should be **added to the relevant research page** —
not just left as a standalone JSON entry. The research site's value is in synthesis, not just cataloging.

**How to identify augmentation candidates:**

| If the controversy involves...                   | Consider adding to...                                       |
|--------------------------------------------------|-------------------------------------------------------------|
| Press freedom, FCC threats, journalist targeting | `constitutional-violations/first-amendment.astro`           |
| Executive overreach, unconstitutional orders     | `constitutional-violations/` (relevant subpage)             |
| DOGE, Musk conflicts, appointee graft            | `corruption/self-dealing.astro`                             |
| Foreign gifts, bribes, pay-for-play              | `corruption/foreign-payments.astro`                         |
| Crypto schemes, $TRUMP coin                      | `corruption/the-crypto-empire.astro`                        |
| Renaming institutions, merchandise, branding     | `corruption/government-as-brand.astro`                      |
| Pardons, Epstein, cover-ups                      | `corruption/cover-ups-and-pardons.astro`                    |
| Insider trading, suspicious trades, market moves | `corruption/insider-trading.astro`                          |
| Classified docs, business motive, Saudi deals    | `corruption/classified-docs-for-profit.astro`               |
| Voter suppression, election interference         | `election-rigging/rigging-2026.astro` (or relevant subpage) |
| Surveillance, CIA/FBI abuse, targeting critics   | `attacking-democracy/weaponizing-government.astro`          |
| Firing IGs, removing oversight                   | `attacking-democracy/purging-oversight.astro`               |
| Loyalty tests, installing unqualified allies     | `attacking-democracy/installing-loyalists.astro`            |
| ICE raids, deportation abuses, detention         | Standalone or `attacking-democracy/`                        |
| Scientific integrity, health policy              | `attacks-on-science.astro` or related                       |
| Fascism indicators, authoritarian behavior       | `fascism/` (relevant subpage)                               |
| Scapegoating minorities, culture war deflection  | `scapegoat-strategy.astro`                                  |
| GOP turning on its own, loyalty enforcement      | `the-loyalty-purge/` (relevant subpage)                     |
| Principles abandoned, opinion flip-flops         | `the-loyalty-purge/abandoned-principles.astro`              |
| Attacks on institutions (FBI, media, etc.)       | `the-loyalty-purge/institutions-under-attack.astro`         |
| Death threats against officials, censure votes   | `the-loyalty-purge/the-machinery.astro`                     |
| Misogynistic attacks, appearance insults, women  | `dangerous-rhetoric/women.astro`                            |
| Journalist targeting, press attacks, media threats | `dangerous-rhetoric/press.astro`                           |
| Violent rhetoric, threats, dehumanizing language  | `dangerous-rhetoric/` (relevant subpage)                    |
| Racial targeting, firing Black officials, DEI    | `scapegoat-strategy.astro`                                  |
| FISA, surveillance, domestic spying              | `attacking-democracy/weaponizing-government.astro`          |
| Kushner conflicts, Saudi deals, foreign payments | `corruption/foreign-payments.astro`                         |

**How to augment a research page:**

- **Person with an arc** → add a `ProfileCard` with timeline events (service/crime/punishment)
- **Claim vs reality** → add a `SideBySideRow` inside an existing `SideBySide`
- **Polling/numerical data** → add a bar to an existing CSS bar chart, or create a new one
- **Evidence item** → add a `CategoryCard` to an existing `CategoryGrid` (use `"—"` icon, alternate red/amber)
- **Notable quote** → add a `NarrativeQuote` (not VoiceCard — use NarrativeQuote for inline quotes)
- **Narrative context** → add content to an existing `ProseSection`
- **Timeline event** → add a `TimelineItem` if the page uses a timeline
- Add a **ticker item** if it's headline-worthy
- Update **stat numbers** if the new data changes them

**When NOT to augment:**

- The controversy is tangentially related but doesn't strengthen the page's argument
- The page is already comprehensive and the new story is redundant
- The story is about someone adjacent to Trump but not his actions or decisions

### When to Suggest New Research Pages

As controversies accumulate, some topics will grow too large or complex for individual JSON entries to capture
adequately. **Proactively suggest creating a new research page** when:

- **5+ controversies share a theme** that isn't covered by an existing research page (e.g., if there were 5+ entries
  about attacks on education, suggest an education deep dive)
- **A single controversy is so complex** it needs multi-paragraph analysis, timeline context, and expert quotes that
  don't fit in a JSON summary
- **A pattern emerges across entries** that would benefit from synthesis — connecting dots that individual entries
  can't (e.g., "all of these DOGE cuts share a pattern of targeting oversight agencies")
- **A topic has strong sourcing** from court documents, investigations, or expert analysis that deserves the full
  research page treatment

**How to suggest:** Flag it to the user with:

1. The proposed topic and title
2. Which existing controversy entries would feed into it
3. Where it fits in the site structure (new deep dive subpage, new standalone section, addition to existing section)
4. A rough outline of what the page would cover

The user will decide whether to proceed. Don't create research pages without explicit approval.

### Researching Articles — Fetching from Blocked Sites

Many reputable news sites (NYT, BBC, WaPo, Reuters, Independent, AP, etc.) block AI fetching tools. These are our
most important sources — we must always get the actual article content, not second-hand coverage. Follow this
fallback chain:

1. **Try `WebFetch` first** — it works for some sites and is the fastest option
2. **If WebFetch fails, use `fetch-article.js`** — a headless Chrome tool that bypasses bot detection:
   ```bash
   cd controversial-trump/website && node fetch-article.js "<url>"
   node fetch-article.js "<url>" --save article.txt
   ```
   This launches a real browser, loads the page like a human visitor, and extracts clean article text. Works on
   NYT, BBC, Independent, WaPo, Reuters, and most other major outlets. **Always use this as the primary
   fallback** — it gets the actual source article rather than relying on second-hand coverage.
3. **If fetch-article.js also fails** (rare — paywall, login required, etc.), fall back to a **research agent** to
   search the web for the story by headline keywords, quotes, and key terms
4. **Search multiple angles** — try the exact headline, key names, key quotes, and the topic broadly
5. **Cross-reference across outlets** — most major stories are covered by 5+ outlets
6. **When the URL gives no clues** (e.g., `bbc.com/news/articles/cn8d63v058zo`), search for the URL string itself
   or search for recent headlines from that outlet on the relevant topic
7. **Never skip a story because fetching failed** — between fetch-article.js and research agents, we can always get
   the content

The goal: always get data from the **original source** rather than relying on aggregation or second-hand
reporting. Direct sourcing from NYT, BBC, WaPo, AP, Reuters strengthens our credibility. Even right-leaning sources
(Fox News, National Review, Daily Caller) are valuable for cross-spectrum sourcing when they confirm a story.

### Evidence Standards

Both sites follow the same sourcing standards:

- **Minimum 3 sources per controversy entry, prefer 5 or more.** More sources = stronger credibility.
- **Ideological diversity:** Where possible, include sources from across the political spectrum — left-leaning (e.g.,
  MSNBC, ProPublica), right-leaning (e.g., Daily Caller, Fox News, National Review), and moderate/neutral (e.g., AP,
  Reuters, BBC). This is not a hard blocker — some stories only get covered by one side — but cross-spectrum sourcing
  strengthens claims and preempts accusations of bias.
- Every claim must link to at least one source
- Prefer: court documents, government records, official filings, investigative journalism
- Acceptable: major news outlets (AP, Reuters, NYT, WaPo, NBC, CNN, BBC, ProPublica)
- Never fabricate or assume URLs — use only verified, real source links

### Validation Protocol — Before Creating Any Entry

**Every story must be validated before it becomes an entry.** The tracker's credibility depends on never publishing
something that is single-sourced speculation, unverified, or debunked. Follow this checklist:

1. **Independent confirmation required:** The core claim must be reported by at least **2 independent outlets** (not
   just one outlet and aggregators citing it). If only one outlet has the story, flag it to the user and wait for
   independent confirmation before creating an entry.

2. **Check for debunking/corrections:** Before creating an entry, search for `"[key claim] debunked"`,
   `"[key claim] false"`, `"[key claim] correction"`. If major fact-checkers (PolitiFact, Snopes, AP Fact Check,
   FactCheck.org) have debunked the claim, do NOT create the entry. If the story has been partially debunked or
   corrected, note the correction in the entry.

3. **Source quality tiers:**
   - **Tier 1 (strongest):** Court documents, government records, official filings, signed legislation, video/audio
     recordings, financial disclosures. These are self-validating — the document IS the evidence.
   - **Tier 2 (strong):** Investigative journalism from major outlets (NYT, WaPo, ProPublica, AP, Reuters, BBC)
     with named sources or documentary evidence. These are reliable but should be cross-referenced.
   - **Tier 3 (acceptable with caution):** Reporting based on anonymous sources. Include but note the sourcing
     quality. If the ONLY sources are anonymous, flag this to the user and recommend waiting for confirmation.
   - **Tier 4 (use sparingly):** Opinion pieces, editorial analysis, partisan commentary. These can provide
     context and quotes but should never be the sole basis for a factual claim.

4. **Single-source stories:** If a major story comes from only one outlet (even a reputable one), be transparent:
   - Note it in the entry: "First reported by [outlet], not yet independently confirmed"
   - Or recommend waiting for confirmation before creating the entry
   - Exception: if the single source IS the primary document (e.g., a court filing, an official DOJ memo, a
     recorded statement), it is self-validating

5. **Unconfirmed allegations:** When including claims from anonymous sources (e.g., the Daily Mail's Miller "force
   confrontations" story), **always flag the sourcing quality explicitly** in the entry. Use language like:
   "UNCONFIRMED (Daily Mail, 2 unnamed DHS sources) — not independently confirmed by any major outlet"

6. **Honest assessment:** When researching a story for the user, always provide an honest assessment of whether it
   meets our standards. Say "this doesn't have enough sourcing yet" or "this has been partially debunked" rather
   than creating an entry that could undermine the tracker's credibility. **Our credibility IS the product.**

### Bias Prevention — Push Back When Necessary

**Claude must push back when the user presents a claim that is unverified, debunked, exaggerated, or lacks sufficient
evidence.** Do not agree with a claim just because it fits the narrative. Do not include a claim in an entry just
because the user wants it there. The user has explicitly requested this.

**When to push back:**

- **Debunked claims:** Say so directly — "This has been debunked by [source]. Including it would undermine our
  credibility."
- **Single-source / unconfirmed stories:** Flag it — "This is single-sourced. I'd recommend waiting for
  independent confirmation."
- **Exaggerated framing:** We learned this the hard way. The ghost gun rule was "upheld 7-2 by the Supreme
  Court," not "rescinded." The ADA rule was "being weakened," not "killed." The overtime rule was "struck down
  by a judge" — Trump declined to appeal, he didn't actively kill it. **Use the most precise language the
  evidence supports.**
- **Misleading causation:** "This happened under Trump" is not the same as "Trump caused this." Be precise.
- **Unverified numbers:** Don't use a stat because it sounds dramatic. Verify it. Use ranges when the source
  provides a range. Note when a figure is outdated.

**The 4-question test before any claim is published:**

1. Is it verified by at least 2 independent sources?
2. Am I using the most precise language the evidence supports?
3. Would it survive a hostile fact-checker?
4. If the evidence changed tomorrow, would this language still be defensible?

**What we'd rather do:**

- Publish nothing rather than publish something wrong
- Understate rather than overstate
- Say "we don't know" rather than guess
- Correct publicly rather than quietly edit
- Lose a dramatic headline rather than lose credibility

### Anti-Leakage Protocol — Flag Gaps, Don't Fill Them

When creating controversy entries or updating research pages, Claude must construct claims from provided articles,
research agent output, or verified web searches — not from parametric memory.

**Rules:**

1. **Every factual claim must be traceable to a provided source.** If writing from a user-provided article, the
   claim must appear in that article. If writing from research agent output, the claim must appear in the output
   with a cited source.
2. **If the source material doesn't cover a needed detail, flag it as `[NEEDS SOURCE]` rather than filling from
   memory.** The ghost gun rule "rescinded" claim, the ADA rule "killed" claim, and 35+ fabricated URLs all came
   from writing claims from memory. A gap is better than a fabrication.
3. **Never generate source URLs from memory.** URLs from memory are wrong more often than right. If a URL wasn't
   provided in research output or verified via web search, don't include it. Use "according to [outlet]" and note
   the URL needs verification.
4. **When batch-creating entries, slow down.** The risk of fabrication increases with speed. Verify each entry's
   claims individually rather than writing 16 entries from memory in one pass.

**`[NEEDS SOURCE]` handling:** The user can provide the source, ask Claude to research it, or decide to cut the
claim. A flagged gap is the system working correctly.

### Source URL Verification — Check Before Syncing

After creating or updating controversy entries, verify source URLs before syncing:

```bash
# For each URL in a JSON file's sources array:
curl -s -o /dev/null -w "%{http_code}" -L --max-time 15 "URL"
# 200 = working | 403 = likely bot-blocking (WaPo, NYT, The Hill) | 404 = broken/fabricated
# 401 from Reuters = almost certainly fabricated (Reuters returns 401 for non-existent URLs)
```

For batch-created entries, spot-check at least 5 random entries per batch. For single entries created from
user-provided articles, all URLs should be verified since they came from a known source.

---

## Git Configuration

All three repos use the `politiboop` GitHub account:

- **SSH alias:** `github-politiboop` (configured in `~/.ssh/config`)
- **User:** `politiboop`
- **Email:** `basketball469@msn.com`
- **Remote URLs must use** `github-politiboop` as the host, not `github.com`

If a push fails with "Permission denied to broxgit," the remote URL is wrong:

```bash
# Fix:
git remote set-url origin git@github-politiboop:politiboop/REPO_NAME.git
```

---

## Workspace Layout and New-Machine Setup

This file lives at the workspace root `/Users/brock/dev/politiboop/CLAUDE.md` and is tracked in a **fifth** repo, `tt-workspace`, which holds only workspace-level orchestration files (this CLAUDE.md, TODO/notes docs, and a legacy Windows-only `run-all.ps1`). The four content repos are cloned as subdirectories and are NOT tracked by tt-workspace (see `.gitignore`).

The five repos (all on the `politiboop` account, all using the `github-politiboop` SSH host):

| Repo | Path | Holds |
|------|------|-------|
| `tt-workspace` | `/Users/brock/dev/politiboop/` (root) | This CLAUDE.md, workspace notes (legacy `run-all.ps1` is Windows-only) |
| `controversial-trump` | `controversial-trump/` | The tracker: controversy JSON, website (Docusaurus) |
| `controversial-trump-research` | `controversial-trump-research/` | The research deep-dives (Astro) |
| `the-civics-desk` | `the-civics-desk/` | The accessible explainers (Astro 6) |
| `stand-against-trump` | `stand-against-trump/` | Personal essays |

### Setting up a new machine

1. Configure the `github-politiboop` SSH host in `~/.ssh/config` and add the SSH key to the politiboop GitHub account.
2. Clone all five repos into your chosen workspace directory (e.g. `/Users/brock/dev/politiboop/` on macOS, `G:/git/politiboop/` on Windows). Clone `tt-workspace` into the root itself, or clone it elsewhere and copy its files to the root:
   ```bash
   git clone git@github-politiboop:politiboop/tt-workspace.git
   git clone git@github-politiboop:politiboop/controversial-trump.git
   git clone git@github-politiboop:politiboop/controversial-trump-research.git
   git clone git@github-politiboop:politiboop/the-civics-desk.git
   git clone git@github-politiboop:politiboop/stand-against-trump.git
   ```
3. `npm install` in each of the four content repos (`node_modules` is not committed).
4. Install Node.js >= 22.12.0 (required by the research site; set in its `.nvmrc`).
5. `fetch-article.js` (in `controversial-trump/website/`) uses a headless Chrome browser to bypass bot detection on blocked news sites. Install the browser binary on the new machine (e.g., `npx playwright install chromium`) or it will fail on NYT/WaPo/Politico/Independent/Esquire fetches.
6. **Restore auto-memory.** Auto-memory lives per-machine under Claude's data directory at `~/.claude/projects/<encoded-workspace-path>/memory/` (the encoded path replaces `/`, `:`, and `\` with `-`; e.g. `/Users/brock/dev/politiboop` → `-Users-brock-dev-politiboop`, `G:/git/politiboop` → `G--git-politiboop`). It does not sync through Claude Code. A backup copy is kept in this repo at `memory/`. On the new machine, copy `memory/*.md` (from the freshly cloned tt-workspace working tree at the workspace root) into that directory (create the folder if needed) so preferences and project context are present from the first conversation. Keep the repo copy in sync if memory changes meaningfully.

### Recurring workflow: processing `research.txt`

The user periodically drops a list of article URLs into `research.txt` at the workspace root (e.g. `/Users/brock/dev/politiboop/research.txt`), or pastes them inline, and says some variation of "new stuff in research.txt." The established workflow:

1. **Fetch each URL.** Try `WebFetch` first; on failure (NYT, WaPo, Politico, Independent, Esquire, BBC, The Hill, CNBC, MSNBC commonly block it) fall back to `node fetch-article.js "<url>"`. For AP live blogs and other un-fetchable pages, `WebSearch` the headline.
2. **Dedupe-check** against existing entries (`ls data/controversies/ | grep <keyword>` and Grep inside JSON) before creating anything. Updates to an ongoing story go into the existing entry; genuinely distinct events get new entries.
3. **Validate before publishing** per the Validation/Bias-Prevention/Anti-Leakage protocols above (2+ independent sources, most-precise language, no fabricated URLs, flag `[NEEDS SOURCE]` gaps rather than filling from memory).
4. **Scope discipline.** Skip items that aren't a Trump action/decision/direct consequence: pure Democratic controversies, society/personal news (e.g., family weddings), and opinion/commentary columns are out of scope. Note skips explicitly with the reason.
5. **Run the pipeline** after writing/updating JSON: `cd controversial-trump/website && node sync-data.js && node generate-social.js && node audit-em-dashes.js`. The em-dash audit must come back clean (no em dashes in titles).
6. **Cross-repo augmentation (mandatory check).** For each new/updated entry, determine whether it strengthens a Civics Desk explainer or research page; augment where it fits, note explicitly where it doesn't. Then ask the user before pushing a batch of Civics Desk edits — they direct which articles to update.

### The Civics Desk article roster and architecture

The Civics Desk (`the-civics-desk/`) has its own strict CLAUDE.md (tone, sourcing, banned phrases) — always follow it. Architecture notes accumulated in practice:

- Long topics use a **hub-plus-subpieces** structure: a top-level explainer that frames the question and cross-links to focused deep-dives, rather than one megapost. Example: the corruption hub links to the IRS-settlement explainer.
- Current major explainers include: `iran-war-explained`, `tariffs-who-pays`, `trump-corruption-explained` (hub), `irs-settlement-explained`, `checks-and-balances-explained`, `midterm-elections-2026`, `authoritarian-frameworks`, `january-6-explained`, `voting-rights-act`, `gerrymandering-explained`, plus others. New articles must be added to the card array in `src/pages/index.astro`.
- **Em-dash standard.** A PostToolUse `style-check.sh` hook flags banned phrases and excessive em dashes (fail threshold ~1 per 80 words; human-writing target 1 per 150-200). The proven cleanup is a **two-pass method**: (1) convert date-bullet/header em dashes to colons or periods mechanically (regex find-replace via sed/perl/editor), then (2) spot-fix prose appositives/asides to commas/parentheses, keeping em dashes only inside direct quotes, source-list titles, and the occasional deliberate rhetorical pivot.
- `the-civics-desk/ideas.txt` holds the article backlog.

### Forward-looking ideas (not yet built)

- A flashier, narrative, **interactive** site about Trump's consolidation of power, intended to eventually become the front door and **demote (not delete)** the research site, which readers find too daunting. The `checks-and-balances-explained` article was written as the content spine for this, with each oversight check as a self-contained module that can lift into scrollytelling panels or a "dashboard of checks" (use a non-partisan status palette — no red/blue — per Civics Desk design rules).
- Astro supports interactive islands, so this can be prototyped without leaving the existing stack.
