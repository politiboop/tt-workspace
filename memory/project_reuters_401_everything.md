---
name: reuters-401-everything
description: "As of 2026-09-22 reuters.com answers 401 to every request, homepage included, so CLAUDE.md's \"Reuters 401 = fabricated\" rule no longer holds"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7f74d243-11b1-4c4f-879d-f09145b74f74
  modified: 2026-09-22T14:03:29.713Z
---

On 2026-09-22, `curl` with a full Chrome User-Agent got HTTP 401 from `https://www.reuters.com/` and `https://www.reuters.com/world/`, and from real, same-day Reuters article URLs. `fetch-article.js` (headless Chrome) returned "No article content found" for them. `verify-sources.js --live` still labels every Reuters 401 "fabrication signal".

**Why:** CLAUDE.md (Source URL Verification) says a Reuters 401 means the URL is almost certainly fabricated. That was true when written; it is now a blanket block, so the check can neither confirm nor refute a Reuters link, and older real Reuters citations in the corpus will also fail a full `--live` sweep.

**How to apply:** verify Reuters stories through syndicated copies with the same headline and byline (AOL, Yahoo News, US News, Detroit News, Local10/KPRC for AP-style reprints) and cite those. In the September 22 sweep the two reuters.com originals were dropped for that reason. Re-probe `https://www.reuters.com/` before trusting the old rule again, and suggest updating CLAUDE.md and `verify-sources.js` if the block persists.

Related: [[news-check-reddit-rss]]
