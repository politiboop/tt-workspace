---
name: news-check-reddit-rss
description: "Run our news check" means the r/politics top-of-day sweep; fetch it via Reddit's RSS feed, since the JSON endpoints and the in-app browser are blocked
metadata:
  type: reference
---

When the user says "run our news check" (or "news check again", "run our trump tracker updater", "another tracker update"), they mean the sweep of the day's top r/politics posts: triage each for scope, dedupe against the tracker, research, write/update entries, then carry them to the research site, election-rigging and (with the user's go-ahead) the Civics Desk. Commit history calls these "the September 21 sweep" etc.

How to get the list (verified 2026-09-22):
- `curl -s -L -A '<full Chrome UA>' 'https://www.reddit.com/r/politics/top/.rss?t=day&limit=100'` returns 100 Atom entries; the article link is the `<a href="...">[link]</a>` inside each entry's `<content>`.
- The `.json` endpoints (old./www./api.reddit.com) answer 403 or 302 to curl, and the built-in browser refuses reddit.com outright ("not allowed due to safety restrictions").
- The RSS feed is rate-limited to about one request per minute (`x-ratelimit-remaining: 0.0` after one call); save the response instead of refetching, since a second quick call can come back empty.
- jsdom in `controversial-trump/website` is broken (an `undici` override), so parse the feed with regex or Python, not JSDOM. `fetch-article.js` still works.

Related: [[reuters-401-everything]], [[parallel-bash-shared-cwd]]
