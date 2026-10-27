#!/usr/bin/env node
// Assemble <out>/story/prologue.json for a topic from a prologue-sweep workflow output (tools/workflows/prologue-sweep.js).
// Gates every URL against the corpus and every id against the entries and the ledger; computes inCount per step.
// Usage: node tools/assemble-prologue.cjs <topic> <sweep-output.json> [--write]
'use strict';
const fs = require('fs');
const L = require('./lib.cjs');
const [KEY, OUT] = process.argv.slice(2);
const WRITE = process.argv.includes('--write');
if (!KEY || !OUT) { console.error('usage: node tools/assemble-prologue.cjs <topic> <sweep-output.json> [--write]'); process.exit(2); }
const t = L.topic(KEY);
const R = L.loadResult(OUT);
if (!R || !R.outline) throw new Error('no outline in the workflow result');
const O = R.outline;
const c = L.corpus(t);
const problems = [], notes = [];
let sourceLinks = 0, outsideCorpus = 0, unknownIds = 0, nBeats = 0;
const claimed = new Map();
const sections = O.sections.map((s) => ({
  key: s.key, title: s.title, thesis: s.thesis, thesisBasis: s.thesisBasis || [], thesisInferred: !!s.thesisInferred,
  beats: (s.beats || []).map((b) => {
    nBeats++;
    if (!L.idResolves(c, b.id)) { unknownIds++; problems.push(`unknown id: ${b.id}`); }
    const sources = (b.sources || []).filter((src) => { sourceLinks++; if (c.urls.has(src.url)) return true; outsideCorpus++; problems.push(`URL outside the corpus on ${b.id}: ${src.url}`); return false; });
    if (!sources.length) problems.push(`no sources left on ${b.id}`);
    const item = L.findItem(c.ledger.items, b);
    if (item) { if (claimed.has(item.i)) problems.push(`${b.id} and ${claimed.get(item.i)} both map to act #${item.i + 1}`); claimed.set(item.i, b.id); }
    if (b.quote && !b.quoteBy) notes.push(`quote without quoteBy dropped on ${b.id}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date)) problems.push(`bad date on ${b.id}: ${b.date}`);
    if (L.hasEmDash(b.line, b.why, b.quote, b.quoteBy, b.dateNote)) problems.push(`em dash on ${b.id}`);
    const beat = { id: b.id, date: b.date };
    if (b.dateNote) beat.dateNote = b.dateNote;
    beat.line = b.line; beat.why = b.why || ''; beat.whyBasis = b.whyBasis || 'inferred';
    beat.term = b.term || L.termFor(t.T, b.date); if (b.severity) beat.severity = b.severity;
    if (b.quote && b.quoteBy) { beat.quote = b.quote; beat.quoteBy = b.quoteBy; }
    beat.inCount = !!item; beat.sources = sources;
    return beat;
  }),
}));
if (L.hasEmDash(O.title, O.framing, O.gaps, O.cautions, sections.map((s) => s.thesis + s.title))) problems.push('em dash in title, framing, theses, gaps or cautions');
const all = sections.flatMap((s) => s.beats), inCount = all.filter((b) => b.inCount).length;
console.log(JSON.stringify({ topic: KEY, title: O.title, sections: sections.map((s) => `${s.key} (${s.beats.length}${s.thesisInferred ? ', inferred thesis' : ''})`), beats: nBeats, inCount, outside: nBeats - inCount, sourceLinks, outsideCorpus, unknownIds, gaps: (O.gaps || []).length, cautions: (O.cautions || []).length, quotes: all.filter((b) => b.quote).length, dateNotes: all.filter((b) => b.dateNote).map((b) => `${b.id}: ${b.dateNote}`), problems, notes }, null, 1));
if (WRITE) {
  if (problems.length) throw new Error('refusing to write with problems');
  fs.mkdirSync(t.story, { recursive: true });
  const themes = (R.themes || []).length || 'several';
  const P = {
    title: O.title, framing: O.framing, generated: L.today(), run: L.runName(OUT),
    method: `${themes} themed finders read the Trump Tracker corpus and the ${KEY} ledger; a verifier per theme checked every beat against its entry (facts, verbatim sources, dates, quotes and who the entry attributes them to); a synthesis wrote the outline; a critic checked it for completeness and overreach; one gap-fill round followed. Every URL below appears in a tracker entry or the ledger; the gate ran after the sweep with zero misses.`,
    gates: { beats: nBeats, sourceLinks, outsideCorpus, unknownIds },
    sections, gaps: O.gaps || [], cautions: O.cautions || [], critic: R.critic || null,
    pageFields: { note: 'Fields the story page reads besides the outline’s own: quoteBy (the speaker the entry attributes a quote to, produced by the finders, checked by the verifiers and by a refuter per quote; a quote with no quoteBy is not rendered), dateNote (a placeholder or entry date that is not the event’s date), thesisInferred, inCount (computed against ledger.json when the file is assembled), ledgerId (a ledger act a step describes when its entry has no ledger link), flag and sourceGap (cautions shown on a step), readerNotes (the reader-facing form of the gaps and cautions, written from them and verified).' },
  };
  L.writeJson(t.prologue, P);
  L.writeJson(t.story + 'beats.json', { generated: P.generated, run: P.run, themes: R.themes || [], beats: R.beats || [] });
  console.log(`wrote ${t.prologue} and beats.json`);
}
