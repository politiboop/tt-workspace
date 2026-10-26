---
name: tracker-site-overhaul-plan
description: The UI roadmap for all five sites lives in the workspace repo at UI-ROADMAP.md (written 2026-10-22); the tracker front-page mockup is in design/
metadata:
  node_type: memory
  type: project
  originSessionId: 5ec53e84-8707-4f83-8c1f-4bfc02bdae17
  modified: 2026-10-22T15:25:51.615Z
---

The full plan is `/Users/brock/dev/politiboop/UI-ROADMAP.md` (tt-workspace repo), with the reference mockup at `design/tracker-front-page.mockup.html`. Read that file before any UI work; this note only points at it.

Status on 2026-10-22: contrast fixes and site-URL fixes are live; `controversial-trump` has two unmerged branches (`claude/prerendered-entry-pages`, then `claude/fix-day-early-card-dates`) that must merge first (WP1). The house style is the Deep Dives / Rigged token set (Barlow Condensed, Barlow, IBM Plex Mono, Lora; `--bg:#0b0d10`). Work packages WP2 (front page) and WP3 (Pagefind) come next, then WP4 (network strip + stats.json) and WP5 (cross-links from trackerIds).

**Why:** The user is handing implementation to Sonnet/Opus sessions and wants them to start from one document rather than this conversation. The user's earlier preferences (editorial feel, no emojis, prose plus cards, no fabricated data) are folded into the roadmap's §0 and §2; the credibility rules stay hard, the taste rules were loosened on purpose.

**How to apply:** Point any UI session at UI-ROADMAP.md and the brief for its work package (§6). Keep the roadmap updated when a package lands (mark it done with the commit). Related: [[feedback-design-preferences]], [[project-live-domains]], [[feedback-side-session-models]]
