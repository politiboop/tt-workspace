---
name: link-check
description: Verify all source URLs in a controversy JSON file or batch of files. Reports broken links, fabricated URLs, and bot-blocked sites.
user-invocable: true
---

Check all source URLs in the specified file(s) for broken links.

## Process

1. Read the JSON file(s) specified in the arguments
2. Extract all URLs from the `sources` array
3. Test each URL:

```bash
curl -s -o /dev/null -w "%{http_code}" -L --max-time 15 "URL"
```

4. Classify each result:

| Status | Meaning | Action |
|--------|---------|--------|
| **200** | Working | No action needed |
| **301/302** | Redirect | Note but usually fine |
| **403** | Forbidden | Check if it's a known bot-blocking site (WaPo, NYT, The Hill, NRDC, Fortune, CNBC, 19th News). If yes, probably fine. If not, investigate. |
| **401** | Unauthorized | If Reuters, almost certainly a fabricated URL. Research the real article. |
| **404** | Not Found | Broken or fabricated. Research the correct URL. |
| **000** | Timeout | May be bot-blocking (WaPo often hangs). Try with a user-agent header. |

5. Report results in a table:

```
| File | URL | Status | Verdict |
|------|-----|--------|---------|
```

6. For any broken URLs (404, fabricated 401), search the web for the correct article and suggest a replacement.

## Arguments

- Single file: `/link-check data/controversies/new-entry.json`
- Multiple files: `/link-check data/controversies/entry1.json data/controversies/entry2.json`
- Wildcard: `/link-check data/controversies/trump-*.json`
- Recent: `/link-check recent` — checks the 10 most recently modified controversy files
- All: `/link-check all` — spot-checks 20 random files from the entire collection
