---
name: feedback-no-visible-browser-windows
description: "Never launch puppeteer/Chrome with headless:false; visible \"Chrome for Testing\" windows interrupt the user"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 042d076b-c6fe-4fce-a5df-47ea05924914
  modified: 2026-10-15T19:32:35.559Z
---

Run puppeteer probes headless only (`headless: 'new'`), with low concurrency (1-2 browsers). Never use `headless: false`, even with an off-screen window position.

**Why:** On 2026-10-15 a citation-probe session opened headful Chrome to get past The Hill/NYT/Bloomberg bot walls. The "Chrome for Testing" windows kept popping up and interrupting the user's work, and the user complained.

**How to apply:** If a site loads only in a visible browser (The Hill's PerimeterX wall, Bloomberg "Are you a robot?"), list those URLs as unverified for the user instead of opening windows. Related: [[feedback-parallel-bash-shared-cwd]]
