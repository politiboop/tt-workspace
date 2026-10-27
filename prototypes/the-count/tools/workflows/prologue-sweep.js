// The prologue sweep for any topic of The Count. Run with the Workflow tool:
//   Workflow({ scriptPath: 'prototypes/the-count/tools/workflows/prologue-sweep.js', args: <output of node tools/args.cjs <topic> sweep> })
// args: { topic, dir (tracker entries), ledger (markdown), prior (this topic's existing prologue, for a regenerate) or example
//         (another topic's prologue, for the shape), prologue: { title, intro, framing, whyRule, termNote, precedents, gapsRule,
//         endSection, criticChecks, subjectExample, themes: [{ key, title, look, keywords, mustRead }] } }
// Then: node tools/assemble-prologue.cjs <topic> <this run's output file> --write
export const meta = {
  name: 'count-prologue-sweep',
  description: 'Sourced sweep of the tracker corpus and a topic ledger for a prologue outline in the shape The Count story page reads: themed finders, a verifier per theme, synthesis, a completeness critic, one gap-fill round, final outline',
  phases: [
    { title: 'Find', detail: 'one Sonnet finder per theme over the tracker corpus and the ledger', model: 'sonnet' },
    { title: 'Verify', detail: 'one Sonnet verifier per theme checks every beat, quote and speaker against its entry', model: 'sonnet' },
    { title: 'Synthesize', detail: 'Opus outline, completeness critic, one gap-fill round, final outline', model: 'opus' },
  ],
}
const A = args
if (!A || !A.dir || !A.ledger || !A.prologue || !A.prologue.themes) throw new Error('args missing; generate them with node tools/args.cjs <topic> sweep')
const DIR = A.dir, LEDGER = A.ledger, P = A.prologue, THEMES = P.themes, USER_FRAMING = P.framing, TITLE = P.title || 'How the Stage Was Set'

const SRC = { type: 'object', properties: { text: { type: 'string' }, url: { type: 'string' } }, required: ['text', 'url'] }
const BEATS = { type: 'object', properties: {
  theme: { type: 'string' },
  beats: { type: 'array', items: { type: 'object', properties: {
    id: { type: 'string' }, date: { type: 'string' }, dateNote: { type: 'string' }, title: { type: 'string' }, what: { type: 'string' }, why: { type: 'string' },
    whyBasis: { type: 'string', enum: ['stated', 'inferred'] }, term: { type: 'string', enum: ['first', 'between', 'second'] },
    severity: { type: 'string' }, sources: { type: 'array', items: SRC }, quote: { type: 'string' }, quoteBy: { type: 'string' } },
    required: ['id', 'date', 'title', 'what', 'why', 'whyBasis', 'term', 'sources'] } },
  gaps: { type: 'array', items: { type: 'string' } }, notes: { type: 'string' } }, required: ['theme', 'beats', 'gaps'] }
const VERDICTS = { type: 'object', properties: { theme: { type: 'string' }, verdicts: { type: 'array', items: { type: 'object', properties: {
  id: { type: 'string' }, supported: { type: 'boolean' }, whyOk: { type: 'boolean' }, sourcesOk: { type: 'boolean' }, quoteOk: { type: 'boolean' }, issues: { type: 'string' }, fix: { type: 'string' }, quoteFix: { type: 'string' } },
  required: ['id', 'supported', 'whyOk', 'sourcesOk', 'quoteOk', 'issues'] } } }, required: ['theme', 'verdicts'] }
const OUTLINE = { type: 'object', properties: {
  title: { type: 'string' }, framing: { type: 'string' },
  sections: { type: 'array', items: { type: 'object', properties: {
    key: { type: 'string' }, title: { type: 'string' }, thesis: { type: 'string' }, thesisBasis: { type: 'array', items: { type: 'string' } }, thesisInferred: { type: 'boolean' },
    beats: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, date: { type: 'string' }, dateNote: { type: 'string' }, line: { type: 'string' }, why: { type: 'string' }, whyBasis: { type: 'string', enum: ['stated', 'inferred'] }, term: { type: 'string' }, severity: { type: 'string' }, quote: { type: 'string' }, quoteBy: { type: 'string' }, sources: { type: 'array', items: SRC } }, required: ['id', 'date', 'line', 'why', 'whyBasis', 'sources'] } } },
    required: ['key', 'title', 'thesis', 'thesisBasis', 'thesisInferred', 'beats'] } },
  gaps: { type: 'array', items: { type: 'string' } }, cautions: { type: 'array', items: { type: 'string' } } }, required: ['title', 'framing', 'sections', 'gaps', 'cautions'] }
const CRITIC = { type: 'object', properties: {
  missing: { type: 'array', items: { type: 'object', properties: { what: { type: 'string' }, found: { type: 'boolean' }, id: { type: 'string' } }, required: ['what', 'found'] } },
  overreach: { type: 'array', items: { type: 'string' } }, verdict: { type: 'string' } }, required: ['missing', 'overreach', 'verdict'] }

const RULES = `Corpus (the ONLY allowed sources): the Trump Tracker entries, one JSON file per entry, in ${DIR} (fields: id, title, date, summary, keyFacts, sources[{text,url}], severity, primaryCategory), and the ${A.topic} ledger ${LEDGER} (one act per bullet line: "- **DATE · Title.** body *[Label · tracker rating: X]* Sources: links [Tracker entry](url)"; its label table and appendices at top and bottom). Hard rules: every beat comes from one entry file or one ledger bullet. "what" is one plain sentence of at most 45 words restating what the entry documents, using only facts in that entry and no outside knowledge. "why" (at most 30 words) ${P.whyRule}; set whyBasis "stated" only when the entry or the ledger says so in substance, otherwise "inferred". Copy up to three sources verbatim (text and url) from the entry; never type a URL from memory; a ledger bullet's sources are the markdown links at its end. "date" is the date of the event the beat describes, as the entry states it (YYYY-MM-DD); when the entry gives no date for that event, use the entry's date and put a short dateNote saying what it stands for. "term" is ${P.termNote}. Include a verbatim "quote" under 25 words only when the entry carries a quotation worth keeping, copied exactly, and then "quoteBy" must name who the entry says said or wrote it, as the entry names them (a person with role, a court, a document, or an outlet when the words are the outlet's own); no quote without a quoteBy. No em dashes anywhere. Understate rather than overstate; the most precise language the evidence supports.`

const finderPrompt = (t) => `You are compiling sourced material for a prologue, "${TITLE}": ${P.intro}. ${USER_FRAMING}

Your theme: ${t.title}. Look for: ${t.look}.

${RULES}

Method: first read these entry files in full, since each belongs to this theme: ${t.mustRead.length ? t.mustRead.map((id) => DIR + id + '.json').join(' ') : '(none assigned)'}. Then run grep -li over the JSON files for each of these keywords, separately: ${t.keywords}. Union the hits, read at least 15 candidate entries in full (cat the file), and grep the ledger for the same keywords and read the matching bullets (the ledger holds material the tracker lacks). Be exhaustive within the theme: return 6 to 20 beats, strongest first, and do not pad; a theme thin in the corpus returns few beats and says so in notes. In gaps, list what a reader would expect under this theme that the corpus does not contain, as plain phrases. The id of a beat is the entry's id field (its filename without .json); for a ledger-only bullet use "ledger:" followed by its date and the first four words of its bold title.`

const verifierPrompt = (t, found) => `You are the verifier for the theme "${t.title}". Below are beats a finder produced from the corpus. For each beat, open its source: ${DIR}<id>.json when the id is a filename, or grep ${LEDGER} for the title when the id starts with "ledger:". Check, strictly: (1) the entry exists and the beat's date is the date of the event the beat describes as the entry states it (an entry-date placeholder is acceptable only with a dateNote); (2) every fact in "what" appears in the entry's title, summary or keyFacts (or the ledger bullet), with nothing added; (3) each listed source's text and url appear verbatim in the entry's sources (or in the ledger bullet's links); (4) "why" is faithful: if whyBasis is "stated", the entry or ledger says so in substance; if "inferred", the inference is modest and would survive a hostile fact-checker; (5) any quote is verbatim and quoteBy names the speaker or document the entry attributes it to, not someone else mentioned nearby (watch for "X quoted Y as saying", a judge quoting a party, an article quoting an official); a cut quotation must not read as a stronger claim than the full sentence. Default to supported=false when uncertain, and quoteOk=false when the attribution is not clearly the entry's. When a small rewrite of "what" would make the beat supported, put it in "fix" (one sentence, at most 45 words, only facts from the entry); when a different quoteBy is the correct one, put it in "quoteFix"; otherwise leave them empty. Return one verdict per beat, same ids, same order.

Beats:
${JSON.stringify(found.beats, null, 1)}`

const shapeText = A.prior
  ? `A prior outline exists at ${A.prior}, produced by the same method earlier and then reviewed and corrected (its pageFields note lists the corrections). Read it first. Keep its structure, titles, theses and the "line" and "why" wording of every beat whose id appears in both the prior outline and the verified beats below, unless a verified beat contradicts them; keep its dateNote and quoteBy values where the beat and quote are unchanged. Add the new beats where they belong, which may mean a new section or new beats in existing ones.`
  : (A.example ? `For the shape and tone, read another edition's outline at ${A.example} (its sections, theses, lines, whys, gaps, cautions and the way it marks inference, placeholder dates and cut quotations); match that shape exactly, with this topic's themes.` : '')

const synthPrompt = (beats, extra) => `Write the outline of a prologue, "${TITLE}", for the ${A.topic} edition of a reader-facing count (${A.unit || 'acts'}). ${USER_FRAMING} You have verified, sourced beats from the corpus (below). ${extra || ''}

${shapeText}

Produce: a title (plain, no em dashes; "${TITLE}" unless a truer plain title exists); a two-sentence framing that is clearly framing, not a factual claim beyond the beats, and that says the prologue places steps beside the acts without claiming any step caused any act (if every step turns out to be an act in the count, say instead that the prologue orders the count's own acts by subject and claims no cause between any two); 4 to 7 sections, each with a key, a plain title, a one-sentence thesis grounded in its beats (thesisBasis lists the beat ids that carry it; thesisInferred is true when the thesis goes beyond what those entries state), and 3 to 8 beats in chronological order. Each beat keeps its id, date, dateNote, term, severity, quote, quoteBy and sources, and gets a "line" of at most 40 words taken from the verified "what" and lightly edited for flow with no new facts, and a "why" of at most 25 words with its whyBasis. Prefer second-term beats; include ${P.precedents}. Where the same act appears under two themes, use it once. ${P.endSection || ''} In gaps, list ${P.gapsRule}. In cautions, list every "why" or thesis that is inferred rather than stated, every beat whose date is a placeholder or differs from its entry's date, any cut quotation, and any beat whose entry calls the matter alleged or disputed. House rules: no em dashes; the most precise language the evidence supports; understate rather than overstate; never add a fact that is not in a beat; a section title asserts no purpose or motive the beats do not state.

Verified beats (JSON):
${JSON.stringify(beats, null, 1)}`

const criticPrompt = (outline) => `You are the completeness critic for a prologue outline, "${TITLE}", the ${A.topic} edition. ${USER_FRAMING}

Check three things against the corpus in ${DIR} (grep -li, then read) and the ledger ${LEDGER}: (a) ${P.criticChecks}. If one is absent, search the corpus for it and report the entry id if one exists, found=false if none does. (b) Search for obvious setup acts in the corpus but absent from the outline and report each with found and id. (c) Overreach: list any section title, thesis, beat "why", gap or caution that goes beyond what the entries state, and any beat whose quote has no quoteBy or whose quoteBy is not the entry's attribution. Give a one-paragraph verdict.

Outline (JSON):
${JSON.stringify(outline, null, 1)}`

const applyVerdicts = (found, verdicts, themeKey) => {
  const kept = []; let dropped = 0
  found.beats.forEach((b, i) => {
    const d = verdicts.find((x) => x.id === b.id) || verdicts[i]
    if (!d || !d.sourcesOk) { dropped++; return }
    let beat = { ...b, theme: themeKey, whyOk: d.whyOk, issues: d.issues || '' }
    if (!d.supported) { if (d.fix) beat = { ...beat, what: d.fix, fixed: true }; else { dropped++; return } }
    if (beat.quote) { if (d.quoteOk) { /* keep */ } else if (d.quoteFix) beat.quoteBy = d.quoteFix; else { delete beat.quote; delete beat.quoteBy; beat.quoteDropped = true } }
    if (beat.quote && !beat.quoteBy) { delete beat.quote; beat.quoteDropped = true }
    kept.push(beat)
  })
  return { kept, dropped }
}

phase('Find')
const perTheme = await pipeline(THEMES,
  (t) => agent(finderPrompt(t), { label: `find:${t.key}`, phase: 'Find', schema: BEATS, model: 'sonnet' }),
  async (found, t) => {
    if (!found || !found.beats || !found.beats.length) { log(`${t.key}: nothing found`); return { theme: t, beats: [], gaps: (found && found.gaps) || [], dropped: 0 } }
    const v = await agent(verifierPrompt(t, found), { label: `verify:${t.key}`, phase: 'Verify', schema: VERDICTS, model: 'sonnet' })
    const { kept, dropped } = applyVerdicts(found, (v && v.verdicts) || [], t.key)
    log(`${t.key}: ${found.beats.length} found, ${kept.length} kept, ${dropped} dropped`)
    return { theme: t, beats: kept, gaps: found.gaps || [], dropped, notes: found.notes || '' }
  })
const themed = perTheme.filter(Boolean)
const allBeats = themed.flatMap((r) => r.beats)
const seen = new Set()
const beats = allBeats.filter((b) => { if (seen.has(b.id)) return false; seen.add(b.id); return true })
log(`${allBeats.length} verified beats, ${beats.length} after de-duplicating ids across themes`)

phase('Synthesize')
const first = await agent(synthPrompt(beats), { label: 'outline:first', phase: 'Synthesize', schema: OUTLINE, model: 'opus', effort: 'high' })
const critic = await agent(criticPrompt(first), { label: 'critic', phase: 'Synthesize', schema: CRITIC, model: 'opus' })
const missingIds = ((critic && critic.missing) || []).filter((m) => m.found && m.id && !seen.has(m.id)).map((m) => m.id)
log(`critic: ${((critic && critic.missing) || []).length} items checked, ${missingIds.length} present in the corpus but absent from the outline`)
let finalBeats = beats
if (missingIds.length) {
  const gapTheme = { key: 'gaps', title: 'Acts the critic found missing', look: 'exactly these entries: ' + missingIds.join(', '), keywords: missingIds.map((id) => '"' + id + '"').join(' '), mustRead: missingIds }
  const found = await agent(`${finderPrompt(gapTheme)}\n\nRead ONLY these entry files and produce one beat for each that fits the prologue: ${missingIds.map((id) => DIR + id + '.json').join(' ')}`, { label: 'find:gaps', phase: 'Synthesize', schema: BEATS, model: 'sonnet' })
  if (found && found.beats && found.beats.length) {
    const v = await agent(verifierPrompt(gapTheme, found), { label: 'verify:gaps', phase: 'Synthesize', schema: VERDICTS, model: 'sonnet' })
    const { kept } = applyVerdicts(found, (v && v.verdicts) || [], 'gaps')
    log(`gap fill: ${found.beats.length} found, ${kept.length} kept`)
    finalBeats = beats.concat(kept.filter((b) => !seen.has(b.id)))
  }
}
const final = await agent(synthPrompt(finalBeats, `A completeness critic reviewed a first outline. Overreach it flagged, to avoid this time: ${JSON.stringify((critic && critic.overreach) || [])}. Its verdict: ${(critic && critic.verdict) || ''}`), { label: 'outline:final', phase: 'Synthesize', schema: OUTLINE, model: 'opus', effort: 'high' })
return { outline: final, beats: finalBeats, themes: themed.map((r) => ({ key: r.theme.key, found: r.beats.length + r.dropped, kept: r.beats.length, dropped: r.dropped, gaps: r.gaps, notes: r.notes })), critic }
