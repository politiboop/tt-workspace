---
name: feedback-severity-accuracy-over-targets
description: "Rate each tracker entry on the rubric's criteria; the target percentages are a sanity check, never a reason to change a rating"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5ec53e84-8707-4f83-8c1f-4bfc02bdae17
  modified: 2026-10-02T18:07:17.064Z
---

Severity is rated per entry against the rubric's criteria (the catastrophic and severe checks in CLAUDE.md). The "Target %" column is only a smell test: a distribution far off it means "audit for inflation," not "move entries until it fits." Never propose or apply downgrades whose only justification is hitting a percentage.

**Why:** The user (2026-10-02) said accuracy matters more than an arbitrary metric, and reporting the actual severity is the journalistic choice. A curated tracker selects for significant stories, so its distribution needn't match a fixed target. I had called the 94 "contained scope" downgrades (calibration group G) "the main lever left" to bring serious down to target; that was the wrong framing.

**How to apply:** When reviewing severity, cite the criterion each change rests on. Report the distribution if useful, but don't present a gap to target as a problem to fix. Related: [[feedback-design-preferences]].
