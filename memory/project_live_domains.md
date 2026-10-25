---
name: project-live-domains
description: "Live production domains and Vercel project names for each politiboop site; www.riggingelections.com is not attached to any project yet"
metadata:
  node_type: memory
  type: project
  originSessionId: 5ec53e84-8707-4f83-8c1f-4bfc02bdae17
  modified: 2026-10-22T14:31:08.445Z
---

Vercel team `brocks-projects-e75c0985` (user `politiboop`; CLI at /opt/homebrew/bin/vercel, logs in via device flow). Production URLs as of 2026-10-22:

- controversial-trump (tracker): https://thetrumptracker.com. Also answers 200 on https://trumpingtrump.com with no redirect; www 307s to the apex.
- controversial-trump-research: https://research.thetrumptracker.com
- the-civics-desk-politiboop: https://thecivicsdesk.com
- election-rigging: https://riggingelections.com. NOT riggedbeforethevote.com (never registered, no DNS). www.riggingelections.com resolves (the Vercel zone has a default wildcard ALIAS) but is not attached to any project, so https://www fails with a certificate-name mismatch. Fix, needs the user's go-ahead: `vercel domains add www.riggingelections.com election-rigging`, then set the redirect to the apex in Project Settings > Domains > Edit (the CLI adds no redirect).
- deep-dives: https://deep-dives-gamma.vercel.app. NOT deep-dives.vercel.app (not this site; it 504s). No custom domain yet.
- stand-against-trump: https://stand-against-trump.vercel.app


On the evening of October 25, 2026 thetrumptracker.com (and, for a while, trumpingtrump.com) answered `403` with `x-vercel-mitigated: challenge` (the Vercel Security Checkpoint) to every non-browser request: curl, fetch-article.js, verify-sources `--live`, deploy watches, link-preview bots and sibling sites' build-time fetches of `/api/stats.json`. Real browsers get a one-second interstitial, then the site. The raw `*.vercel.app` deployment URLs redirect to Vercel SSO. The setting lives in the project's Firewall settings in the Vercel dashboard and is the user's to change; it was flagged to them on October 25. By 23:30 UTC the same night both domains answered `200` again with no challenge header, so the checkpoint was either turned off or expired. If a `403` with `x-vercel-mitigated: challenge` comes back, verify tracker deploys with the in-app browser (`mcp__Claude_Browser__*`), not curl, and rely on the committed fallbacks in the sites that read the tracker's stats (the research site has `src/data/tracker-stats.fallback.json`).

**Why:** The `site:` values in election-rigging and deep-dives named dead hosts, which made both sites look down when they were fine and left both without a sitemap. Neither site had canonical or og:url tags until 2026-10-22, when `site:` was corrected and the tags and @astrojs/sitemap were added (election-rigging f0eb3ec, deep-dives 7b3854e, pushed to origin/main the same day).

**How to apply:** Check live sites at the URLs above, not the ones in astro.config. When a site's domain changes (for example a custom domain for deep-dives), change `site` in its astro.config.mjs and the Deployment note in its CLAUDE.md; confirm with the user before choosing a real domain for deep-dives. Related: [[project-tracker-overhaul]]
