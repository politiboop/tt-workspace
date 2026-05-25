---
name: fact-check
description: Validate a claim or story against our evidence standards before creating a controversy entry or including it in an explainer. Checks sourcing, debunking, and flags gaps.
user-invocable: true
---

Run the full validation protocol on the claim or story provided. Follow each step in order. Do not skip steps.

## Step 1: Identify the Core Claim

State the specific factual claim being evaluated in one sentence. If the user provided an article URL, fetch and read it first. If they provided a claim in text, use that.

## Step 2: Independent Confirmation (Minimum 2 Sources)

Search the web for independent coverage of this claim from at least 2 separate outlets (not aggregators citing the same original source).

- If 2+ independent outlets confirm: note the sources and proceed.
- If only 1 outlet has the story: FLAG — "Single-source story. Recommend waiting for independent confirmation before creating an entry."
- If 0 outlets confirm: FLAG — "Cannot verify. This claim does not meet our sourcing standards."

## Step 3: Debunking Check

Search for: "[key claim] debunked", "[key claim] false", "[key claim] correction"

Check PolitiFact, Snopes, AP Fact Check, and FactCheck.org.

- If debunked: STOP — "This claim has been debunked by [source]. Do not create an entry."
- If partially debunked/corrected: note the correction and recommend including it.
- If no debunking found: proceed.

## Step 4: Source Quality Assessment

Classify each source using our tiers:
- **Tier 1 (strongest):** Court documents, government records, official filings, video/audio, financial disclosures
- **Tier 2 (strong):** Investigative journalism from major outlets (NYT, WaPo, ProPublica, AP, Reuters, BBC) with named sources
- **Tier 3 (acceptable with caution):** Reporting based on anonymous sources — note sourcing quality
- **Tier 4 (use sparingly):** Opinion pieces, editorial analysis — should not be the sole basis for factual claims

## Step 5: Precision Check

For each specific number, date, or quote in the claim:
- Can it be verified against a primary source?
- Is it the most precise version? (Not the high end of a range presented as a single number. Not "killed" when "weakened" is more accurate.)
- Flag any claims that go beyond what the evidence supports: `[NEEDS PRECISION]`

## Step 6: Counter-Argument Check

What is the strongest defense or counter-argument for the other side? Search for it. Note it. If we can't address the counter-argument, the entry should acknowledge it.

## Step 7: Verdict

Provide one of:
- **PUBLISH** — Meets all standards. Provide recommended category, severity, and key facts.
- **PUBLISH WITH CAVEATS** — Publishable but needs specific qualifications noted. List them.
- **HOLD** — Insufficient sourcing. Specify what's needed before it meets our standards.
- **DO NOT PUBLISH** — Debunked, single-sourced speculation, or doesn't meet evidence threshold.

## Arguments

If the user provides a URL: fetch the article, then run the protocol on its claims.
If the user provides text: run the protocol on the stated claim.
If the user provides a file path: read the file and validate its claims.

Example: `/fact-check https://example.com/article-about-trump`
Example: `/fact-check "Trump banned all immigration from Europe"`
Example: `/fact-check data/controversies/new-entry.json`
