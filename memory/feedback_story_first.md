---
name: feedback-story-first
description: "The Count (and every topic built on its template) always puts the story in the reader's path; a reader leaves it out only by choosing to, never by a default or a link"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 8c3f05ae-7b85-4370-b8e4-6aa2b436fd95
  modified: 2026-10-26T20:10:16.215Z
---

On 2026-10-26, asked how a reader reaches The Count once deployed, the user set one rule for it and for every topic that reuses the template: the story is always part of the experience, unless the reader skips it intentionally.

**Why:** The story carries the sourced prologue, the gaps and cautions and the order the user wants readers to meet the record in; the count and one-at-a-time readings are views of the same data without that framing. A default or a shared link that lands past the story would quietly drop what the user considers the point.

**How to apply:** The door's "Skip" skips the questions, never the story (it leads to the story with everything). The other readings sit on the door under "or skip the story", and choosing one marks the skip (`story=skipped` in the link, `thecount.story.skipped` in storage). `count.html` and `focus.html` show a slim "This count opens with a story" bar with Read and Skip to any reader who has neither opened the story (`thecount.story.seen`, set when story.html loads) nor skipped it; a deep link to an act or a thread still shows the thing linked, with the bar above it. Carry the same rule into the press edition and any other topic. Related: [[the-count-prototype]], [[feedback-design-preferences]].
