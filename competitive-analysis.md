# Competitive Analysis — Tracker Ecosystem

*April 10, 2026 — Research conducted for The Trump Tracker (thetrumptracker.com) and Research Division (research.thetrumptracker.com)*

---

## Sites Analyzed

| Site | URL | Type |
|------|-----|------|
| Project 2025 Observer | project2025.observer | P2025 implementation tracker |
| Trump Action Tracker | trumpactiontracker.info | Authoritarianism action log |
| Housing Affordability Tracker | Google Sheets (public) | Raw economic data dashboard |

---

## 1. Project 2025 Observer

**URL:** https://www.project2025.observer/en

**What it is:** A community-driven tracker monitoring whether specific policy proposals from the Heritage Foundation's Project 2025 ("Mandate for Leadership 2025") are being implemented. Created by two Reddit users (`/u/rusticgorilla` and `/u/mollynaquafina`), it grew from a spreadsheet into a full Next.js web app.

**Positioning:** Claims neutrality — "objective monitoring" without "advocating for or against specific policies."

### Data Model

- **320 total objectives** extracted from the ~900-page P2025 document
- **~132 completed** (~41% implementation rate)
- Each objective tracks:
  - The specific P2025 recommendation (verbatim or summarized)
  - Federal agency it falls under
  - Implementation status (completed, in progress, not started)
  - Brief implementation note (1-2 sentences) — HOW it was accomplished (EO, reconciliation bill, agency action, etc.)
  - Subject tags for cross-cutting themes

### Structure

- **Homepage** — Dashboard with filterable objectives
- **Agency pages** — Objectives grouped by federal department (Agriculture, Energy, HHS, DHS, EPA, etc.)
- **Individual objective pages** — Each recommendation with its status and implementation note
- **Visualizations** — Cumulative completion over time, progress distribution, agency breakdown, tag cloud
- **AI Chat** — LLM chatbot (Helicone-powered) for conversational exploration
- **Multi-language support** — `/en/` prefix suggests i18n

### Tech Stack

- Next.js (Vercel-hosted)
- Clerk for authentication
- JavaScript-heavy SPA

### Sourcing Quality

**Weakest point.** No inline citations visible on objective pages. Implementation notes are 1-2 sentences with no source URLs, article links, or document references. The site appears to rely on editorial team research rather than exposing sources to users. This would not meet our evidence standards (minimum 3 sources per entry).

### How We Compare

| Dimension | Project 2025 Observer | Us |
|---|---|---|
| **Scope** | P2025 recommendations only (320) | All controversies (433+) across 11 categories |
| **P2025 coverage** | 320 objectives, 41% complete | 532 recommendations tracked, 53% acted on (5 research pages) |
| **Entry depth** | 1-2 sentence notes | Multi-paragraph summaries + deep-dive research pages |
| **Sourcing** | No visible sources | 3-7+ sources per entry with URLs and type classification |
| **Visualizations** | Charts, timeline, tag cloud, agency breakdowns | Currently minimal data visualization |
| **Navigation** | By agency, status, timeline, search, AI chat | By category, severity, timeline, search |
| **Licensing** | Not specified | Not specified |

### What They Do Well That We Could Adopt

1. **Per-objective granular tracking.** They broke P2025 into 320 discrete, trackable objectives with individual status. We cover P2025 thematically. Their approach lets users answer "has X specific thing happened?" instantly. **Actionable idea:** A "P2025 Checklist" research subpage — a sortable/filterable table of all objectives with status indicators.

2. **Agency-based organization.** Grouping objectives by federal agency ("What happened to the EPA?") is intuitive and we don't offer it. **Actionable idea:** Add an "affected agencies" tag or filter to our tracker entries.

3. **Data visualizations.** Cumulative completion charts, agency breakdowns, and tag clouds. We currently lack data-driven visual analysis. **Actionable idea:** A dedicated "By the Numbers" research page with charts showing implementation trends, deregulation timelines, and enforcement collapse data.

4. **AI Chat.** Novel feature for conversational exploration. Utility depends on accuracy and could be a liability if it hallucinates. **Lower priority** — interesting but risky for a credibility-first site.

5. **Timeline view.** A chronological scroll of completed objectives. We have date-based sorting but not a dedicated visual timeline. **Actionable idea:** Timeline view on the tracker homepage.

---

## 2. Trump Action Tracker

**URL:** https://www.trumpactiontracker.info/

**What it is:** An independent tracker documenting Trump administration actions through an authoritarianism lens. Created by **Professor Christina Pagel**, a UK-based health services researcher at University College London. Her German parents were born in 1937/1941 — the connection to how democracies fall is personal. Started in February 2025, received a professional redesign in March 2026 by Clearleft (a design agency), funded by an anonymous donor.

**Positioning:** Academic/analytical — frames every action through political science literature on authoritarianism.

### Data Model

- **2,934 total actions** (~7x our count)
- Each action is a single paragraph (1-3 sentences) with:
  - Date
  - One or more domain tags (from 10 authoritarianism domains)
  - A single source link
- Published under **CC BY-SA 4.0** (openly reusable data)

### 10 Domains of Authoritarianism (their category system)

1. **Undermining democracy** — Violating norms, weakening checks and balances, attacking courts
2. **Hollowing state** — Weakening institutions, mass firings, dismantling agencies
3. **Suppressing dissent** — Intimidating opponents, loyalty tests, weaponizing state power
4. **Controlling information** — Propaganda, misinformation, restricting evidence
5. **Attacking science** — Climate, vaccines, environmental protections
6. **Attacking education** — Universities, K-12, arts, museums, national parks
7. **Weakening civil rights** — LGBTQ+, immigrant, women's protections; attacking DEI
8. **Corruption** — Self-enrichment, pay-for-play, self-aggrandizement
9. **Foreign policy** — Threats to allies, destabilizing world order
10. **Nationalism** — Anti-immigrant rhetoric, militarized enforcement

Actions can belong to **multiple domains** (~50% are tagged with 2+).

### Structure

- **Homepage** — Filterable/searchable table of all actions
- **RSS feed** — 50 most recent actions
- **About/Glossary/Resources** — Context and links to other trackers
- Social presence on Bluesky, Substack, YouTube

### Sourcing Quality

**Significantly weaker than ours.** Each action has one source link from a reputable outlet (Reuters, Guardian, NYT, AP, BBC, etc.), but there is:
- No minimum source count
- No cross-spectrum sourcing
- No source type classification
- No debunking/validation protocol
- No tiered sourcing system

Their approach: one credible news article = one entry.

### How We Compare

| Dimension | Trump Action Tracker | Us |
|---|---|---|
| **Total entries** | 2,934 | 433 |
| **Entry depth** | 1-3 sentences, 1 source | Multi-paragraph, 3-7+ sources |
| **Categories** | 10 authoritarianism domains | 11 controversy categories |
| **Multi-tagging** | Yes — actions can belong to multiple domains | Single `primaryCategory` + `specialTags` |
| **Source quality** | Single source per entry | Multi-source with type classification |
| **Detail pages** | No — table/list only | Full editorial article layout with pullquotes |
| **Research layer** | No | 56+ deep-dive research pages |
| **Social assets** | No | Auto-generated social images + carousels |
| **Data export** | CSV download | Not available |
| **License** | CC BY-SA 4.0 (open) | Not specified |
| **Update frequency** | ~5-15 entries per day | Variable |

### What They Do Well That We Could Adopt

1. **Authoritarianism framing.** Their 10-domain system is anchored in political science. Our categories are journalistic. Their framing provides an analytical spine — it answers "why does this matter?" structurally. **Actionable idea:** Consider adding a secondary "authoritarianism domain" tag to our entries, or creating a research page that maps our data to their framework.

2. **Multi-domain tagging.** Each action can belong to multiple domains. Our `primaryCategory` limits entries to one category, even when they cross multiple. **Actionable idea:** Add a `secondaryCategories` array to our JSON schema, or use `specialTags` more systematically for cross-cutting themes.

3. **CSV/data export.** Downloadable data for journalists, researchers, and academics. We don't offer this. **Actionable idea:** Add a data export feature or a public API endpoint.

4. **RSS feed.** Standard syndication format we don't currently offer. **Actionable idea:** Low-effort, high-value addition.

5. **Resources page.** They acknowledge the ecosystem — linking to the Anti-Autocracy Handbook, deportation data trackers, press freedom trackers, litigation trackers, and the UCSD Trump Tracker list. **Actionable idea:** Create a resources/ecosystem page linking to complementary trackers. This builds credibility and community.

6. **Open licensing (CC BY-SA 4.0).** Encourages reuse and builds trust with the research community. **Actionable idea:** Consider adopting an open license for our data.

7. **Volume as a feature.** 2,934 entries communicates overwhelming scale. Even shallow entries, in aggregate, make a powerful argument. **Insight:** Their tracker could serve as a source for identifying stories we may have missed — they cover ~7x more individual actions.

---

## 3. Housing Affordability Tracker

**URL:** Google Sheets (public spreadsheet, downloaded as `HOUSING AFFORDABILITY TRACKER.xlsx`)

**What it is:** A raw economic data dashboard tracking 75+ indicators daily from FRED (Federal Reserve Economic Data). Self-described as "unbiased, raw housing data. Updated every morning at 9:15 EST." Maintained by an anonymous data analyst.

### Data Model

- **75+ economic indicators** tracked monthly/daily
- **Historical data** going back years (FRED source)
- **Composite scores:**
  - Housing Health Score: 52/100 — "Affordability Crisis"
  - Supply Score: 43.9/100 — "Critical Shortage"
  - Affordability Score: 52.4/100 — "Very Strained"
  - Crash Likelihood: 46.8/100 — "Nowhere Close"

### Key Indicators Tracked

**Housing:**
- Median home prices (resale, new construction, affordable)
- Mortgage rates, Fed rate, 10-year Treasury yield
- Housing affordability indexes (first-time buyer, national)
- Inventory, building permits, foreclosure rates

**Building Materials:**
- Lumber, steel, shingles, plumbing, concrete

**Cost of Living:**
- Food (eggs, milk, bread, beef, coffee, chicken — individual items)
- Energy (power per kWh, natural gas, gas per gallon)
- Housing (rent, home insurance, water/sewer/trash)
- Healthcare (medical care, health insurance)
- Consumer goods (clothing, car parts, used cars, furniture)
- Services (childcare/education, cable/streaming, internet)

### Price Changes Since Trump Inauguration (January 2025)

**Biggest increases:**

| Item | Change | Status |
|------|--------|--------|
| Coffee | +34.9% | MAJOR Rise |
| Gas (per gallon) | +24.0% | MAJOR Rise |
| Beef | +21.6% | MAJOR Rise |
| Plumbing supplies | +17.0% | MAJOR Rise |
| Steel | +12.2% | MAJOR Rise |
| Doors/Windows | +11.2% | MAJOR Rise |
| Water heaters | +9.5% | Rise |
| Clothing | +7.1% | Rise |
| Power (per kWh) | +5.6% | Rise |
| HVAC systems | +4.9% | Rise |
| Home insurance | +6.7% | Rise |
| Childcare/education | +3.1% | Rise |

**Decreases:**
| Item | Change |
|------|--------|
| Eggs | -49.5% (from pandemic spike) |
| New construction prices | -6.4% |
| Used cars | -2.6% |

**Housing metrics:**
| Metric | Start (Jan 2025) | Current | Change |
|--------|-------------------|---------|--------|
| Median resale home | $393,400 | $398,000 | +1.2% |
| Mortgage rate | 7.07% | 6.46% | -8.6% |
| FTHB Affordability Index | 66.8 | 72.3 | +8.2% (improving) |
| Housing Health Score | — | 52/100 | "Affordability Crisis" |

### How We Could Use This Data

This is **source data**, not editorial content. But it's powerful for building evidence-based entries and research pages:

1. **Cost-of-living research page.** The tariff-driven price increases (steel +12%, plumbing +17%, doors/windows +11%) combined with SNAP cuts and wage suppression data could make a devastating "Your Wallet" or "The Price Tag" research page. **Actionable idea:** New research section showing the real cost of Trump policies on everyday Americans — sourced to FRED data.

2. **StatCards with real data.** We could pull specific numbers for research pages: coffee +35%, beef +22%, gas +24%. These are grabby, verifiable stats from government data.

3. **Tariff impact analysis.** Building materials (steel, lumber, plumbing, doors/windows) are all up significantly — likely tariff-driven. Cross-reference with our existing tariff controversy entries for a research synthesis.

4. **Affordability score as a recurring metric.** The "52/100 — Affordability Crisis" score is a powerful, citable number that could appear in tickers and StatCards.

---

## Summary: Competitive Landscape

| | P2025 Observer | Trump Action Tracker | Housing Tracker | **Us** |
|---|---|---|---|---|
| **Entries** | 320 objectives | 2,934 actions | 75+ indicators | 433 controversies |
| **Depth per entry** | 1-2 sentences | 1-3 sentences | Raw data points | Multi-paragraph + research |
| **Sources per entry** | 0 visible | 1 | FRED (govt data) | 3-7+ verified |
| **Research layer** | No | No | No | **56+ deep-dive pages** |
| **Social assets** | No | No | No | **Auto-generated images + carousels** |
| **Data export** | No | CSV | Spreadsheet | Not yet |
| **Unique strength** | Granular P2025 checklist | Sheer volume + academic framing | Real-time economic data | Editorial depth + synthesis |

**Bottom line:** Nobody else is combining sourced depth, editorial analysis, research synthesis, and social media assets. These sites are potential **data sources and inspiration** — not competitors.

---

## Prioritized Action Items

### High Impact, Low Effort
1. **CSV/data export** — Let researchers download our controversy data
2. **RSS feed** — Standard syndication, trivial to implement in Docusaurus
3. **Resources page** — Link to the tracker ecosystem (these 3 sites + others)

### High Impact, Medium Effort
4. **Multi-category tagging** — Add `secondaryCategories` to our JSON schema
5. **Cost-of-living research page** — "The Price Tag" using Housing Tracker data (coffee +35%, beef +22%, gas +24%, steel +12%)
6. **P2025 checklist subpage** — Sortable table of all 320+ objectives with status

### Medium Impact, Higher Effort
7. **Data visualization page** — Charts showing implementation trends, enforcement collapse, deregulation timeline
8. **Agency-based browsing** — Filter controversies by affected federal agency
9. **Open license** — CC BY-SA 4.0 for our data layer
10. **Timeline view** — Visual chronological browse mode on the tracker

### Worth Monitoring
11. **AI Chat** — Interesting but risky for credibility. Monitor how P2025 Observer's performs before considering.
12. **Authoritarianism domain mapping** — Map our data to their 10-domain framework as a research exercise (could become a research page)

---

*This analysis was conducted by reviewing live site content, fetching subpages, and analyzing the Housing Affordability Tracker spreadsheet data. All comparisons are based on publicly available information as of April 10, 2026.*
