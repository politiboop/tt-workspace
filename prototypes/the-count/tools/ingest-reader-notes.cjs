#!/usr/bin/env node
// Validate the reader notes the reader-cautions workflow produced and write them into the prologue as readerNotes.
// Usage: node tools/ingest-reader-notes.cjs <topic> <cautions-output.json> [--write] [--force]
//   --force writes although the verifier's pass is false (use after applying its fixes to the output file by hand).
'use strict';
const L = require('./lib.cjs');
const [KEY, OUT] = process.argv.slice(2);
const WRITE = process.argv.includes('--write'), FORCE = process.argv.includes('--force');
if (!KEY || !OUT) { console.error('usage: node tools/ingest-reader-notes.cjs <topic> <cautions-output.json> [--write] [--force]'); process.exit(2); }
const t = L.topic(KEY);
const R = L.loadResult(OUT);
if (!R.notes || !R.verdict) throw new Error('no notes/verdict: ' + JSON.stringify(R).slice(0, 300));
const P = L.readJson(t.prologue);
const ids = new Set(L.beatsOf(P).map((b) => b.id));
const N = R.notes, V = R.verdict;
const banned = /\b(beat|beats|verifier|critic|sweep|synthesis|prior outline|the reader|entry id|whyBasis|thesisBasis|corpus|gate|round)\b/i;
const problems = [];
const checkRef = (r, where) => { const m = r.match(/^(gap|caution):(\d+)$/); if (!m) return problems.push(`${where}: bad ref ${r}`); const arr = m[1] === 'gap' ? P.gaps : P.cautions; if (+m[2] >= arr.length) problems.push(`${where}: ref out of range ${r}`); };
const checkText = (x, where, max) => { if (/—/.test(x)) problems.push(`${where}: em dash`); if (banned.test(x)) problems.push(`${where}: process word in "${x.slice(0, 60)}"`); if (/\b[a-z0-9]+(-[a-z0-9]+){2,}\b/.test(x)) problems.push(`${where}: kebab id in "${x.slice(0, 60)}"`); const w = x.split(/\s+/).length; if (w > max) problems.push(`${where}: ${w} words`); };
checkText(N.intro, 'intro', 60);
N.items.forEach((it, i) => { checkText(it.text, `item ${i}`, 40); if (!it.from.length) problems.push(`item ${i}: no from`); it.from.forEach((r) => checkRef(r, `item ${i}`)); it.steps.forEach((id) => { if (!ids.has(id)) problems.push(`item ${i}: unknown step ${id}`); }); });
N.stepNotes.forEach((n, i) => { checkText(n.text, `stepNote ${i}`, 25); if (!ids.has(n.id)) problems.push(`stepNote ${i}: unknown id ${n.id}`); n.from.forEach((r) => checkRef(r, `stepNote ${i}`)); });
console.log(JSON.stringify({ verifierPass: V.pass, verifierProblems: V.problems, verifierMissing: V.missing, verifierSummary: V.summary, items: N.items.length, stepNotes: N.stepNotes.length, stepsCovered: [...new Set(N.stepNotes.map((n) => n.id))].length, omitted: N.omitted.length, mechanicalProblems: problems }, null, 1));
console.log('\nINTRO:', N.intro); N.items.forEach((it, i) => console.log(`\n${i + 1}. ${it.text}\n   from ${it.from.join(', ')}${it.steps.length ? ' · steps ' + it.steps.join(', ') : ''}`));
console.log('\nSTEP NOTES:'); N.stepNotes.forEach((n) => console.log(` - [${n.id}] ${n.text}`));
console.log('\nOMITTED:'); N.omitted.forEach((o) => console.log(` - ${o.ref}: ${o.why}`));
if (WRITE) {
  if (problems.length) throw new Error('mechanical problems; not writing');
  if (!V.pass && !FORCE) throw new Error('the verifier did not pass; apply its fixes to the output file and rerun, or pass --force');
  P.readerNotes = { generated: L.today(), run: L.runName(OUT), method: 'Written from the gaps and cautions above by one agent under a no-new-claims rule, then checked line by line against them by another; each item names the notes it draws on.', intro: N.intro, items: N.items, stepNotes: N.stepNotes, omitted: N.omitted };
  if (!/readerNotes \(/.test(P.pageFields.note)) P.pageFields.note += ` readerNotes (${P.readerNotes.generated}) is the reader-facing form of the gaps and cautions, with per-step lines; the working notes themselves are unchanged and the page folds them behind a disclosure.`;
  L.writeJson(t.prologue, P);
  console.log(`\nwrote readerNotes into ${t.prologue}`);
}
