// Shared helpers for The Count's prologue tools. Every path comes from topics.cjs, so a tool runs for any topic.
'use strict';
const fs = require('fs');
const path = require('path');
const PROTO = path.resolve(__dirname, '..');
const WS = path.resolve(PROTO, '..', '..');
const TOPICS = require(path.join(PROTO, 'topics.cjs'));
const ENTRIES = path.join(WS, 'controversial-trump', 'data', 'controversies') + '/';

function topic(key) {
  const T = TOPICS[key];
  if (!T) throw new Error(`unknown topic "${key}"; topics.cjs has: ${Object.keys(TOPICS).join(', ')}`);
  const out = path.resolve(PROTO, T.out) + '/';
  return { key, T, out, story: out + 'story/', prologue: out + 'story/prologue.json', quotes: out + 'story/quotes-to-check.json', ledgerJson: out + 'ledger.json', ledgerMd: path.resolve(PROTO, T.ledger), entries: ENTRIES, proto: PROTO, ws: WS };
}
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const writeJson = (f, o, indent = 1) => fs.writeFileSync(f, JSON.stringify(o, null, indent));
// a workflow's saved output is {result: ...} in the task file, or the bare result
const loadResult = (f) => { const W = readJson(f); return W.result || W; };
const today = () => new Date().toISOString().slice(0, 10);
const hasEmDash = (...parts) => /—/.test(parts.flat().filter(Boolean).join(' '));
const runName = (f) => path.basename(f).replace(/\.(fixed\.)?output$|\.json$/, '');

// the corpus: every URL a tracker entry cites, every URL a ledger item cites, every markdown link in the ledger (its own gate admitted them)
function corpus(t) {
  const urls = new Set(), ids = new Set();
  for (const f of fs.readdirSync(t.entries)) { if (!f.endsWith('.json')) continue; ids.add(f.replace(/\.json$/, '')); for (const s of (readJson(t.entries + f).sources || [])) urls.add(s.url); }
  const L = readJson(t.ledgerJson);
  for (const it of L.items) for (const s of (it.sources || [])) urls.add(s.url);
  const md = fs.readFileSync(t.ledgerMd, 'utf8'); for (const m of md.matchAll(/\]\(([^)\s]+)\)/g)) urls.add(m[1]);
  return { urls, ids, ledger: L };
}
const trackerIdOf = (it) => it.tracker ? new URL(it.tracker).searchParams.get('id') : null;
// a step maps to a ledger act by tracker id, by "ledger:<date> <title prefix>", or by an explicit ledgerId fallback
function findItem(items, b) {
  if (b.id.startsWith('ledger:')) { const d = b.id.slice(7, 17), pre = b.id.slice(18).toLowerCase(); return items.find((it) => it.date === d && it.title.toLowerCase().startsWith(pre)) || null; }
  return items.find((it) => trackerIdOf(it) === b.id) || (b.ledgerId ? findItem(items, { id: b.ledgerId }) : null);
}
const idResolves = (c, id) => id.startsWith('ledger:') ? !!findItem(c.ledger.items, { id }) : c.ids.has(id);
// which term a date falls in, from the topic's chapters
function termFor(T, date) { for (const ch of T.chapters) if (date >= ch.from && (!ch.to || date < ch.to)) return ch.term; return T.chapters[T.chapters.length - 1].term; }
const beatsOf = (P) => P.sections.flatMap((s) => s.beats);

module.exports = { PROTO, WS, TOPICS, ENTRIES, topic, readJson, writeJson, loadResult, today, hasEmDash, runName, corpus, trackerIdOf, findItem, idResolves, termFor, beatsOf };
