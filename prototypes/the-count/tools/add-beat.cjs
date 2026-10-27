#!/usr/bin/env node
// Insert one newly verified step (from tools/workflows/beat.js in "add" mode) into a prologue section in date order,
// append an optional note to the gaps, re-gate its sources, update the counts.
// Usage: node tools/add-beat.cjs <topic> <beat-output.json> <section-key> ["<gap note to append>"]
'use strict';
const fs = require('fs');
const L = require('./lib.cjs');
const [KEY, OUT, SECTION, NOTE] = process.argv.slice(2);
if (!KEY || !OUT || !SECTION) { console.error('usage: node tools/add-beat.cjs <topic> <beat-output.json> <section-key> ["<gap note>"]'); process.exit(2); }
const t = L.topic(KEY);
const R = L.loadResult(OUT);
if (!R.beat || !R.verdict) throw new Error('no beat/verdict: ' + JSON.stringify(R).slice(0, 300));
const b = R.beat, v = R.verdict;
console.log('verdict', JSON.stringify(v, null, 1));
if (!v.sourcesOk || !v.dateOk) throw new Error('beat not usable: sources or date failed');
if (!v.supported && !v.fix) throw new Error('beat not supported and no fix offered');
const what = v.supported ? b.what : v.fix;
let quote = b.quote, quoteBy = b.quoteBy;
if (quote) { if (v.quoteOk) { /* keep */ } else if (v.quoteFix) quoteBy = v.quoteFix; else { quote = undefined; quoteBy = undefined; } }
if (quote && !quoteBy) quote = undefined;
if (L.hasEmDash(what, b.why, quote, quoteBy, b.dateNote, NOTE)) throw new Error('em dash');
const P = L.readJson(t.prologue);
const c = L.corpus(t);
if (L.beatsOf(P).some((x) => x.id === b.id)) throw new Error('beat already present: ' + b.id);
if (!L.idResolves(c, b.id)) throw new Error('entry or ledger item missing: ' + b.id);
const outside = (b.sources || []).filter((s) => !c.urls.has(s.url));
if (outside.length) throw new Error('URL outside corpus: ' + outside.map((s) => s.url).join(' '));
if (!b.sources.length) throw new Error('no sources');
const nb = { id: b.id, date: b.date };
if (b.dateNote) nb.dateNote = b.dateNote;
nb.line = what; nb.why = b.why; nb.whyBasis = b.whyBasis; nb.term = b.term || L.termFor(t.T, b.date); if (b.severity) nb.severity = b.severity;
if (quote && quoteBy) { nb.quote = quote; nb.quoteBy = quoteBy; }
nb.inCount = !!L.findItem(c.ledger.items, nb); nb.sources = b.sources;
const sec = P.sections.find((s) => s.key === SECTION); if (!sec) throw new Error(`no section ${SECTION}; sections: ${P.sections.map((s) => s.key).join(', ')}`);
let at = sec.beats.findIndex((x) => x.date > nb.date); if (at < 0) at = sec.beats.length;
sec.beats.splice(at, 0, nb);
if (!sec.thesisBasis.includes(nb.id)) sec.thesisBasis.push(nb.id);
if (NOTE) P.gaps.push(NOTE);
P.gates.beats = L.beatsOf(P).length;
P.gates.sourceLinks = L.beatsOf(P).reduce((a, x) => a + x.sources.length, 0);
P.pageFields.note += ` The ${b.id} step was added on ${L.today()} (${L.runName(OUT)}: one finder reading only the entry, one verifier) into the ${SECTION} section in date order; the section thesis was not rewritten.`;
L.writeJson(t.prologue, P);
const inCount = L.beatsOf(P).filter((x) => x.inCount).length;
console.log(JSON.stringify({ inserted: nb.id, at, date: nb.date, line: nb.line, why: nb.why, whyBasis: nb.whyBasis, quote: nb.quote || null, quoteBy: nb.quoteBy || null, sources: nb.sources.map((s) => s.text.slice(0, 70)), sectionBeats: sec.beats.length, beats: P.gates.beats, inCount, outside: P.gates.beats - inCount, sourceLinks: P.gates.sourceLinks, finderNotes: b.notes || '' }, null, 1));
console.log('now: node build.cjs ' + KEY + ' (the tracker-titles snapshot), then node tools/quotes.cjs extract ' + KEY + ' if the step carries a quote');
