#!/usr/bin/env node
// The quote refute, two halves. "extract" lists every quote in a prologue for tools/workflows/quote-refute.js;
// "apply" reads that workflow's verdicts and drops or re-attributes quotes, with a dated working caution.
// Usage: node tools/quotes.cjs extract <topic>
//        node tools/quotes.cjs apply <topic> <refute-output.json> [--write]
'use strict';
const L = require('./lib.cjs');
const [MODE, KEY, OUT] = process.argv.slice(2);
const WRITE = process.argv.includes('--write');
if (!MODE || !KEY) { console.error('usage: node tools/quotes.cjs extract <topic> | apply <topic> <refute-output.json> [--write]'); process.exit(2); }
const t = L.topic(KEY);
const P = L.readJson(t.prologue);
const list = []; for (const s of P.sections) for (const b of s.beats) if (b.quote) list.push({ index: list.length, id: b.id, section: s.key, quote: b.quote, quoteBy: b.quoteBy || '' });
if (MODE === 'extract') { L.writeJson(t.quotes, list); console.log(`${list.length} quotes written to ${t.quotes}; run the quote-refute workflow with: node tools/args.cjs ${KEY} refute`); process.exit(0); }
if (MODE !== 'apply' || !OUT) throw new Error('apply needs the refute output file');
const V = L.loadResult(OUT); const verdicts = Array.isArray(V) ? V : (V.results || V.verdicts || []);
const byIndex = new Map(verdicts.filter(Boolean).map((v) => [v.index, v]));
const changes = [];
for (const q of list) {
  const v = byIndex.get(q.index); if (!v) { changes.push({ id: q.id, action: 'no verdict; kept', reason: '' }); continue; }
  if (v.id && v.id !== q.id) { changes.push({ id: q.id, action: 'verdict id mismatch; kept', reason: v.id }); continue; }
  if (!v.quoteVerbatim) changes.push({ id: q.id, action: 'drop quote', reason: 'not verbatim: ' + v.reason });
  else if (v.betterSpeaker && (v.betterSpeaker.length > 90 || /[()]/.test(v.betterSpeaker))) changes.push({ id: q.id, action: 'review', to: v.betterSpeaker, reason: 'betterSpeaker reads as an explanation, not a name; set quoteBy by hand: ' + v.reason });
  else if (v.refuted && v.betterSpeaker) changes.push({ id: q.id, action: 'quoteBy', to: v.betterSpeaker, reason: v.reason });
  else if (v.refuted) changes.push({ id: q.id, action: 'drop quote', reason: v.reason });
  else if (v.betterSpeaker && v.betterSpeaker !== q.quoteBy) changes.push({ id: q.id, action: 'quoteBy', to: v.betterSpeaker, reason: 'more precise: ' + v.reason });
  else changes.push({ id: q.id, action: 'kept', reason: '' });
}
const drops = changes.filter((x) => x.action === 'drop quote'), renames = changes.filter((x) => x.action === 'quoteBy');
console.log(JSON.stringify({ quotes: list.length, verdicts: verdicts.length, kept: changes.filter((x) => x.action === 'kept').length, dropped: drops.length, reattributed: renames.length, forHandReview: changes.filter((x) => x.action === 'review').length, changes: changes.filter((x) => x.action !== 'kept') }, null, 1));
if (!WRITE) process.exit(0);
if (L.hasEmDash(renames.map((x) => x.to))) throw new Error('em dash in a betterSpeaker');
for (const s of P.sections) for (const b of s.beats) {
  const ch = changes.find((x) => x.id === b.id && x.action !== 'kept' && !x.applied); if (!ch) continue; ch.applied = true;
  if (ch.action === 'drop quote') { delete b.quote; delete b.quoteBy; } else if (ch.action === 'quoteBy') b.quoteBy = ch.to;
}
P.cautions = P.cautions || [];
P.cautions.push(`[Update, ${L.today()}: a refuter per quote (${L.runName(OUT)}) checked each attribution against its entry; ${drops.length} quote${drops.length === 1 ? ' was' : 's were'} dropped${drops.length ? ' (' + drops.map((x) => x.id).join(', ') + ')' : ''} and ${renames.length} speaker${renames.length === 1 ? '' : 's'} made more precise.]`);
L.writeJson(t.prologue, P);
console.log(`wrote ${t.prologue}`);
