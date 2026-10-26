---
name: vercel-cli-pitfalls
description: "Vercel CLI traps for the politiboop projects: commands run outside a linked folder create new projects; previews are behind Vercel Authentication; CLI redeploys skip the build cache"
metadata:
  node_type: memory
  type: project
  originSessionId: da4dad10-1303-42f8-a74c-061eaec0a6b5
  modified: 2026-10-22T14:37:33.655Z
---

Facts about the Vercel CLI (`/opt/homebrew/bin/vercel`, logged in as politiboop, team `brocks-projects-e75c0985`), learned 2026-10-22:

- `vercel curl` (and `vercel link`) run with `--yes` in a folder that is not linked to a project links it by **creating a new project** named after the folder. It created an empty "scratchpad" project that had to be removed with `vercel project remove`. Only run these from `controversial-trump/website` (the tracker's Vercel root directory) or pass explicit project flags.
- Preview deployments are behind Vercel Authentication. `vercel curl` gets past it by creating a protection-bypass secret on the project, which is a project setting change: ask before doing it. The built-in browser pane is not signed in to Vercel.
- `vercel redeploy <url>` from the CLI did not restore the build cache (full `npm install`, cold webpack), so it measures worst-case build time, not a normal deploy. A git push to the branch restores the cache.
- Read-only alternatives that change nothing: `vercel ls <project> -m githubCommitRef=<branch>`, `vercel inspect <url> --logs`, `vercel inspect <url> --wait`, `vercel api /v13/deployments/<id>` (shows buildCacheSummary and the build machine: basic, 2 cores, 8 GB).

**Why:** a stray project and a bypass secret are outward changes to the user's account; the redeploy timing would have overstated build cost.

**How to apply:** verify on production URLs or ask the user to sign in, rather than creating access. Related: [[project-live-domains]]
