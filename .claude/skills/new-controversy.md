---
name: new-controversy
description: Full pipeline for creating a new controversy entry — validate, check duplicates, write JSON, sync, generate social images, check research augmentation, and git add. Ensures no steps are skipped.
user-invocable: true
---

Create a new controversy entry following the complete pipeline. Do not skip any step.

## Step 1: Get the Source

If the user provided a URL, fetch the article using fetch-article.js or WebFetch:
```bash
cd G:/git/politiboop/controversial-trump/website && node fetch-article.js "URL"
```
If the article fails to fetch, try WebFetch. If both fail, ask the user to provide the article text.

If the user provided text directly, use that.

## Step 2: Validate (Run Fact-Check Protocol)

Before writing anything, verify:
- Is this reported by at least 2 independent outlets? If single-source, flag it.
- Has it been debunked? Search for corrections.
- Does it connect to Trump? (Per CLAUDE.md: "Is Trump the actor, the decision-maker, or the direct cause?")

If validation fails, tell the user and stop. Do not create an entry for unverified claims.

## Step 3: Check for Duplicates

Search existing entries:
```bash
ls G:/git/politiboop/controversial-trump/data/controversies/ | grep <keyword>
```
Also grep inside files for key names, events, or phrases. If a similar entry exists, recommend UPDATING the existing entry rather than creating a new one.

## Step 4: Write the JSON Entry

Create the file at `G:/git/politiboop/controversial-trump/data/controversies/<kebab-case-id>.json` following the schema:

Required fields:
- `id`: kebab-case unique identifier
- `title`: Full descriptive title
- `primaryCategory`: MUST be one of: democracy, women, racism, corruption, abuse-of-power, character, narcissism, rewriting-history, ice-enforcement, public-health, absurd
- `severity`: MUST be one of: catastrophic, serious, concerning, disputed, absurd
- `timeline`: first-term, second-term, or pre-presidency
- `date`: YYYY-MM-DD (when the controversy happened)
- `updatedDate`: YYYY-MM-DD (today's date — ALWAYS include this)
- `summary`: Multi-paragraph summary using \n\n for breaks
- `keyFacts`: Array of key facts (include 1-3 with direct quoted speech for pullquotes)
- `sources`: Array of objects with text, url, type. MINIMUM 3 sources. NEVER fabricate URLs — use `[NEEDS SOURCE]` if a URL can't be verified.
- `specialTags`: Array of relevant tags

## Step 5: Verify Source URLs

For each source URL in the entry, verify it works:
```bash
curl -s -o /dev/null -w "%{http_code}" -L --max-time 15 "URL"
```
- 200 = good
- 403 from WaPo/NYT/The Hill = probably fine (bot blocking)
- 404 = broken — find the correct URL or replace the source
- 401 from Reuters = almost certainly fabricated — research the real URL

## Step 6: Git Add the Entry

```bash
cd G:/git/politiboop/controversial-trump && git add data/controversies/<filename>.json
```

## Step 7: Sync and Generate Social Images

```bash
cd G:/git/politiboop/controversial-trump/website && node sync-data.js && node generate-social.js
```

## Step 8: Check Research Page Augmentation (MANDATORY)

Consult the augmentation table in CLAUDE.md. For EVERY new entry, determine if it strengthens any existing research page:

| If the controversy involves... | Consider adding to... |
|---|---|
| Press freedom, journalist targeting | constitutional-violations/first-amendment.astro |
| DOGE, Musk conflicts, appointee graft | corruption/self-dealing.astro |
| Foreign gifts, bribes | corruption/foreign-payments.astro |
| Pardons, cover-ups | corruption/cover-ups-and-pardons.astro |
| Voter suppression | election-rigging/ |
| Firing IGs, removing oversight | attacking-democracy/purging-oversight.astro |
| Scientific integrity, health policy | attacks-on-science.astro |
| Deregulation, rollbacks | the-rollback/ |

If augmentation is warranted, add ticker items and/or content to the relevant research page(s). If not, note explicitly that no augmentation is needed.

## Step 9: Also Check Civics Desk Augmentation

Does this controversy add new evidence to any existing Civics Desk explainer? If so, note what could be added (but don't add it without user approval — the Civics Desk has stricter editorial standards).

## Step 10: Summary

Report:
- Entry created: filename, title, category, severity
- Sources: count and verification status
- Social images: generated or not
- Research augmentation: what was augmented or why nothing was
- Civics Desk: any potential augmentation noted

## Arguments

The user can provide:
- A URL: `/new-controversy https://example.com/article`
- Multiple URLs: `/new-controversy` then paste URLs
- Article text: `/new-controversy` then paste content
- A topic to research: `/new-controversy "Trump fires EPA administrator"`
