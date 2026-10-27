#!/usr/bin/env node
// Replace one step with its regenerated version (tools/workflows/beat.js in "refresh" mode) after its entry was corrected.
// The sweep's working cautions that named the old step get a dated note rather than a silent rewrite.
// Usage: node tools/refresh-beat.cjs <topic> <beat-output.json> [--match "<regex over cautions>"] ["<what changed, one sentence>"]
'use strict';
const L = require('./lib.cjs');
const argv = process.argv.slice(2);
const mi = argv.indexOf('--match'); const MATCH = mi >= 0 ? new RegExp(argv.splice(mi, 2)[1]) : null;
const [KEY, OUT, WHY] = argv;
if (!KEY || !OUT) { console.error('usage: node tools/refresh-beat.cjs <topic> <beat-output.json> [--match "<regex>"] ["<what changed>"]'); process.exit(2); }
const t = L.topic(KEY);
const R = L.loadResult(OUT);
if (!R.beat || !R.verdict) throw new Error('no beat/verdict in result: ' + JSON.stringify(R).slice(0, 300));
const b = R.beat, v = R.verdict, ID = b.id;
console.log('verdict', JSON.stringify(v, null, 1));
if (!v.sourcesOk || !v.dateOk) throw new Error('beat not usable: sources or date failed');
if (!v.supported && !v.fix) throw new Error('beat not supported and no fix offered');
const what = v.supported ? b.what : v.fix;
let quote = b.quote, quoteBy = b.quoteBy;
if (quote) { if (v.quoteOk) { /* keep */ } else if (v.quoteFix) quoteBy = v.quoteFix; else { quote = undefined; quoteBy = undefined; } }
if (quote && !quoteBy) quote = undefined;
if (L.hasEmDash(what, b.why, quote, quoteBy, b.dateNote, WHY)) throw new Error('em dash in the beat');
const P = L.readJson(t.prologue);
const c = L.corpus(t);
let spliced = null;
for (const s of P.sections) for (let i = 0; i < s.beats.length; i++) if (s.beats[i].id === ID) {
  const old = s.beats[i];
  const nb = { id: ID, date: b.date };
  if (b.dateNote) nb.dateNote = b.dateNote;
  nb.line = what; nb.why = b.why; nb.whyBasis = b.whyBasis; nb.term = b.term || L.termFor(t.T, b.date); if (b.severity) nb.severity = b.severity;
  if (quote && quoteBy) { nb.quote = quote; nb.quoteBy = quoteBy; }
  if (old.ledgerId) nb.ledgerId = old.ledgerId;
  nb.inCount = !!L.findItem(c.ledger.items, nb); nb.sources = b.sources;
  s.beats[i] = nb; spliced = { old, nb };
}
if (!spliced) throw new Error('beat not found in prologue: ' + ID);
const outside = spliced.nb.sources.filter((s) => !c.urls.has(s.url));
if (outside.length) throw new Error('URL outside corpus: ' + outside.map((s) => s.url).join(' '));
if (!L.idResolves(c, ID)) throw new Error('entry missing');
P.gates.sourceLinks = L.beatsOf(P).reduce((n, x) => n + x.sources.length, 0);
const stamp = ` [Update, ${L.today()}: ${WHY || 'the entry behind this step was corrected'}; the step was regenerated from it by the same finder-and-verifier method (${L.runName(OUT)}).]`;
let stamped = 0;
if (MATCH) P.cautions = P.cautions.map((x) => MATCH.test(x) && !x.includes(stamp) ? (stamped++, x + stamp) : x);
if (!stamped) { P.cautions.push(`[Update, ${L.today()}: the step on ${ID} was regenerated from its corrected entry by the same finder-and-verifier method (${L.runName(OUT)}).${WHY ? ' ' + WHY + '.' : ''}]`); stamped = 1; }
if (P.readerNotes) { const stale = P.readerNotes.stepNotes.filter((n) => n.id === ID); if (stale.length) console.log(`NOTE: ${stale.length} reader step note(s) on ${ID} may now be stale; reread them: ${stale.map((n) => JSON.stringify(n.text)).join(' | ')}`); }
P.pageFields.note += ` The ${ID} step was regenerated on ${L.today()} from its corrected entry (${L.runName(OUT)}).`;
L.writeJson(t.prologue, P);
console.log(JSON.stringify({ oldLine: spliced.old.line, newLine: spliced.nb.line, oldDate: spliced.old.date, newDate: spliced.nb.date, dateNote: spliced.nb.dateNote || null, why: spliced.nb.why, whyBasis: spliced.nb.whyBasis, quote: spliced.nb.quote || null, quoteBy: spliced.nb.quoteBy || null, sources: spliced.nb.sources.map((s) => s.text.slice(0, 70)), inCount: spliced.nb.inCount, sourceLinks: P.gates.sourceLinks, cautionsStamped: stamped, finderNotes: b.notes || '' }, null, 1));
