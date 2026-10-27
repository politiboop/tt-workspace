#!/usr/bin/env node
// List every step of a topic's prologue with the ledger act it lights, for a quick read after any change.
// Usage: node tools/dump-beats.cjs <topic>
'use strict';
const L = require('./lib.cjs');
const KEY = process.argv[2]; if (!KEY) { console.error('usage: node tools/dump-beats.cjs <topic>'); process.exit(2); }
const t = L.topic(KEY);
const P = L.readJson(t.prologue), items = L.readJson(t.ledgerJson).items;
let n = 0, inCount = 0;
for (const s of P.sections) {
  console.log(`\n=== ${s.key}: ${s.title}${s.thesisInferred ? ' (thesis inferred)' : ''}\n    ${s.thesis}`);
  for (const b of s.beats) { n++; const it = L.findItem(items, b); if (it) inCount++;
    console.log(`\n[${n}] ${b.id} | ${b.date}${b.dateNote ? ' (' + b.dateNote + ')' : ''} | ${it ? `act #${it.i + 1} ${it.date} ${it.family} :: ${it.title.slice(0, 80)}` : 'NOT IN THE COUNT'}\n    ${b.line}\n    why (${b.whyBasis}): ${b.why}${b.quote ? `\n    "${b.quote}" (${b.quoteBy})` : ''}`); }
}
console.log(`\n${n} steps, ${inCount} in the count, ${n - inCount} outside; ${P.gaps.length} gaps, ${P.cautions.length} cautions${P.readerNotes ? `; reader notes: ${P.readerNotes.items.length} items, ${P.readerNotes.stepNotes.length} step notes` : '; no reader notes yet'}`);
