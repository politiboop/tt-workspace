---
name: Design and content preferences
description: User's preferences for site design, content presentation, and quality standards learned during the research site overhaul
type: feedback
---

**Design:**
- Avoid "dashboard of boxes" layout — mix prose narrative with card-based content
- Cards are good for catalog/reference items (parallel entries to scan); prose is good for arguments
- Use ProseSection to introduce and frame card sections, not just jump into grids
- NarrativeQuotes flow better than boxed VoiceCards for standalone quotes between sections
- PullStat for dramatic numbers that interrupt the narrative (limit to 1 per page)
- No emojis as icons — use numbered markers ("01", "02") for sequential items, em dashes ("—") for parallel items
- Break red monotony — alternate card variants (red/amber), use accentColor on StatCards
- Don't repeat the same stat too many times on one page (2-3 max, not 7)
- HighlightBar text should be one punchy line, not a paragraph
- Center section headers on prose-heavy pages to align with centered prose column
- Bold text (font-weight) should be subtle (500 not 600) to avoid spacing jumps in Crimson Pro

**Why:** The user feels the card-only approach makes pages read like PowerPoint, not journalism. The goal is an editorial/investigative feel like ProPublica or The Atlantic.

**How to apply:** When creating or modifying research pages, always mix prose narrative with cards. Introduce sections with 2-3 paragraphs before showing the evidence grid. Convert standalone VoiceCards to NarrativeQuotes.

**Content integrity:**
- Never fabricate data, quotes, or claims when restructuring pages
- Never remove existing data without explicit user approval
- When adding prose, synthesize from existing card content — don't invent new claims
- Flag any cases where modifying/adding/removing data would improve the page, and let the user decide

**Why:** Previous AI sessions created fabricated quotes, fake citations ("Pattern Analysis of..."), wrong dates, and invented statistics. The user was burned by this and wants collaborative decision-making on all content changes.

**How to apply:** Always preserve all data during restructuring. If you spot something that should change, raise it to the user rather than silently fixing it.
