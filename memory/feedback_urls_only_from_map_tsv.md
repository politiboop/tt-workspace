---
name: feedback-urls-only-from-map-tsv
description: "Every citation URL must come from an agent's map.tsv via the U() helper; a URL typed from a headline is a fabrication even when the outlet and date are right"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5ec53e84-8707-4f83-8c1f-4bfc02bdae17
  modified: 2026-10-22T14:20:38.106Z
---

When adding a source outside the batch write script (a correction, a late extra citation), still look the URL up in the batch's `map.tsv` with `grep` and paste it. Never compose a URL from the outlet, date and headline.

**Why:** On 2026-10-22 I added an Alaska Beacon source to `alaska-voter-rolls-doj-lawsuit` by typing the URL from the agent's headline. The real slug (`alaska-permits-federal-government-to-purge-...`) did not match the headline (`Federal government may seek removal...`), so the citation was fabricated. The rigging `verify-sources.js` passed because the card copied the entry's URL, so nothing automated would have caught it; I noticed only on a re-read of map.tsv.

**How to apply:** The `U(file)` helper in the write scripts is the only path for URLs. For a one-off edit, run `grep <file> <batch>/map.tsv | cut -f1` first. If the file is not in map.tsv, the source cannot be cited. Related: [[feedback-no-em-dashes-titles]], [[project-sweep-research-agents]]
