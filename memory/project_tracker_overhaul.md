---
name: Tracker site overhaul plan
description: Planned design overhaul for thetrumptracker.com (Docusaurus site) — brand alignment, dark theme, detail page rewrite
type: project
---

Planned overhaul for the tracker site at G:/git/politiboop/controversial-trump/website:

1. **Brand alignment** — Match research site's dark palette (red accents, dark background). Kill the purple gradient.
2. **Dark mode** — Commit to dark theme (partially implemented in CSS variables already)
3. **Typography** — Bring over research site font stack (Bebas Neue display, Crimson Pro body) via @fontsource
4. **Self-host fonts** — Same approach as research site
5. **Controversy detail page rewrite** — Replace modal overlay with full page route. Better data flow: hero header, formatted prose summary, styled key facts, sources grouped by type, meaningful "Read Next"
6. **Timeline visualization** — vis-timeline is installed but unused. Activate it.
7. **Category/severity visual refinement** — Better badge design, more cohesive with research site

**Why:** User specifically called out that the detail page "data doesn't flow well." The sites need to feel like the same project. The tracker's light purple generic Docusaurus theme clashes with the research site's dark editorial aesthetic.

**How to apply:** Start with brand alignment (CSS/theming) as foundation, then tackle the detail page rewrite, then remaining items.
