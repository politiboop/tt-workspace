// One skeptic per quote in a prologue. Before: node tools/quotes.cjs extract <topic>; args from node tools/args.cjs <topic> refute.
// After: node tools/quotes.cjs apply <topic> <this run's output file> --write
export const meta = {
  name: 'count-quote-refute',
  description: 'For every quote in a prologue of The Count, a skeptic opens the entry or ledger item and tries to refute the attribution the sweep gave it',
  phases: [{ title: 'Refute', detail: 'one Sonnet skeptic per quote, defaulting to refuted', model: 'sonnet' }],
}
const A = args
if (!A || !A.file || !A.n) throw new Error('args missing; generate them with node tools/args.cjs <topic> refute')
const VERDICT = { type: 'object', properties: { index: { type: 'number' }, id: { type: 'string' }, quoteVerbatim: { type: 'boolean' }, refuted: { type: 'boolean' }, reason: { type: 'string' }, betterSpeaker: { type: 'string' }, evidence: { type: 'string' } }, required: ['index', 'id', 'quoteVerbatim', 'refuted', 'reason', 'betterSpeaker', 'evidence'] }
const idx = Array.from({ length: A.n }, (_, i) => i)
phase('Refute')
const out = await parallel(idx.map((i) => () => agent(`Read item ${i} (zero-based) of the JSON array in ${A.file}: it has an id, a quote, and a proposed speaker (quoteBy). A page will print the quote with that speaker's name beside it, so a wrong name is a published error. Try to refute the attribution. Default to refuted=true if the source does not clearly attribute these words to that speaker.

Open the source yourself: when the id is a tracker id, read ${A.dir}<id>.json (summary, keyFacts, sources); when it starts with "ledger:", find the item in ${A.ledgerJson} (array "items": the item whose "date" is the id's date and whose "title" starts with the id's title words; read its "title" and "body") and the same bullet in ${A.ledgerMd}. Check: (1) the quote appears in the source verbatim or near it (set quoteVerbatim); (2) the passage attributes these words to the proposed speaker and not to someone else mentioned nearby (watch for "X quoted Y as saying", "as Y put it", a judge quoting a party, an article quoting an official, an outlet's own words versus a person's, a headline versus a statement); (3) the speaker is named the way the source names them, with no role the source does not give; (4) a cut quotation does not read as a stronger claim than the full sentence. Copy the attributing passage verbatim into evidence. Return the item's index and id unchanged. Set betterSpeaker to the correct attribution if the source supports a different or more precise one, else empty: a name and role only, as the source gives them, under 12 words, with no explanation (the explanation goes in reason); the page prints betterSpeaker beside the quote exactly as written.`, { label: `refute:${i}`, phase: 'Refute', schema: VERDICT, model: 'sonnet', effort: 'high' })))
return out.filter(Boolean)
