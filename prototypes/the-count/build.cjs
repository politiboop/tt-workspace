#!/usr/bin/env node
// Builds each topic's edition of The Count: parses the topic's ledger (a markdown chronology at the
// workspace root that carries its own URL gate) into <out>/ledger.json, folds in the Deep Dives data
// files the topic follows as threads, snapshots the tracker titles its prologue cites, and copies the
// four topic-agnostic pages from src/ into <out>/. Nothing here is written by hand: every item, label,
// source and paragraph comes from the ledger; the editorial layer per topic (families, door chips, a
// few words of copy) lives in topics.cjs and is written into ledger.json as `topic`.
//   node build.cjs            builds every topic
//   node build.cjs press      builds one
'use strict';
const fs = require('fs');
const path = require('path');
const TOPICS = require('./topics.cjs');

const PAGES = ['index.html', 'story.html', 'count.html', 'focus.html'];
const DIVES = path.resolve(__dirname, '../../deep-dives/src/data');
const ENTRIES = path.resolve(__dirname, '../../controversial-trump/data/controversies');
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const longDate = (d) => { const [y, m, day] = d.split('-').map(Number); return `${MONTHS_LONG[m - 1]} ${day}, ${y}`; };
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const links = (s) => { const out = []; let m; LINK.lastIndex = 0; while ((m = LINK.exec(s))) out.push({ text: m[1].trim(), url: m[2] }); return out; };
const money = (n, short) => { if (!short) return '$' + Math.floor(n).toLocaleString('en-US'); if (n >= 1e9) return '$' + +(n / 1e9).toFixed(2) + 'B'; if (n >= 1e6) return '$' + +(n / 1e6).toFixed(n >= 1e8 ? 1 : 2) + 'M'; return '$' + Math.floor(n).toLocaleString('en-US'); };
const idOf = (u) => { const m = u && u.match(/[?&]id=([^&]+)/); return m ? m[1] : null; };

function build(T) {
  const SRC = path.resolve(__dirname, T.ledger);
  const OUTDIR = path.resolve(__dirname, T.out);
  fs.mkdirSync(OUTDIR, { recursive: true });
  const leadToFamily = {};
  for (const [k, f] of Object.entries(T.families)) for (const l of f.leads) leadToFamily[l] = k;

  const md = fs.readFileSync(SRC, 'utf8');
  const lines = md.split('\n');
  const items = [], chapters = [], intro = [], labelDefs = [], setAside = [], totals = [];
  let chapter = null, year = null, section = 'head', method = '', title = '', subtitle = '';

  for (let n = 0; n < lines.length; n++) {
    const line = lines[n];
    if (n === 0 && line.startsWith('# ')) { title = line.slice(2).trim(); continue; }
    if (/^## How to read/.test(line)) { section = 'intro'; continue; }
    if (/^## Appendix A/.test(line)) { section = 'setaside'; chapter = null; continue; }
    if (/^## Appendix B/.test(line)) { section = 'totals'; continue; }
    if (/^## Appendix C/.test(line)) { section = 'method'; continue; }
    const ch = T.chapters.find((c) => c.match.test(line));
    if (ch) { section = 'items'; chapter = { key: ch.key, title: line.replace(/^## /, '').trim(), short: ch.short, prose: [], count: 0 }; chapters.push(chapter); year = null; continue; }
    if (section === 'head' && line.trim() && !title) { title = line.trim(); continue; }
    if (section === 'head' && line.trim() && !subtitle) { subtitle = line.trim(); continue; }
    if (section === 'intro') {
      if (/^\|/.test(line)) { const cells = line.split('|').slice(1, -1).map((c) => c.trim()); if (cells.length === 2 && cells[0] !== 'Label' && !/^-+$/.test(cells[0])) labelDefs.push({ label: cells[0], meaning: cells[1] }); }
      else if (line.trim()) intro.push(line.trim());
      continue;
    }
    if (section === 'setaside') { const m = line.match(/^\*\*(.+?)\*\*\s*(.*)$/); if (m) setAside.push({ head: m[1].trim(), text: m[2].trim() }); else if (line.trim() && !setAside.length) setAside.push({ head: '', text: line.trim() }); continue; }
    if (section === 'totals') {
      if (/^\|/.test(line)) { const cells = line.split('|').slice(1, -1).map((c) => c.trim()); if (cells.length === 3 && cells[0] !== 'Figure' && !/^-+$/.test(cells[0])) totals.push({ figure: cells[0], measure: cells[1], sources: links(cells[2]) }); }
      else if (line.trim() && !totals.length) totals.push({ figure: '', measure: line.trim(), sources: [] });
      continue;
    }
    if (section === 'method') { if (line.trim()) method += (method ? '\n\n' : '') + line.trim(); continue; }
    if (section !== 'items') continue;
    const h3 = line.match(/^### (\d{4})/);
    if (h3) { year = h3[1]; continue; }
    const it = line.match(/^- \*\*(\d{4}(?:-\d{2}){0,2}) · (.+?)\*\* (.*)$/);
    if (it) {
      const [, date, ttl, rest] = it;
      const lm = rest.match(/\*\[([^\]]+)\]\*/);
      if (!lm) throw new Error(`${T.key}: no label on line ${n + 1}: ${ttl}`);
      const label = lm[1].trim();
      const body = rest.slice(0, lm.index).trim();
      let tail = rest.slice(lm.index + lm[0].length);
      const si = tail.indexOf('Sources: ');
      if (si < 0) throw new Error(`${T.key}: no sources on line ${n + 1}: ${ttl}`);
      tail = tail.slice(si + 'Sources: '.length);
      const tm = tail.match(/\[Tracker entry\]\(([^)\s]+)\)/);
      const tracker = tm ? tm[1] : null;
      if (tm) tail = tail.slice(0, tm.index) + tail.slice(tm.index + tm[0].length);
      const sources = links(tail);
      if (!sources.length) throw new Error(`${T.key}: no source links on line ${n + 1}: ${ttl}`);
      const lead = label.split(' · ')[0].split(':')[0].trim().toLowerCase();
      const family = leadToFamily[lead] || 'other';
      const rm = label.match(/tracker rating: (\w+)/);
      const grain = date.length === 10 ? 'day' : date.length === 7 ? 'month' : 'year';
      items.push({ i: items.length, date, grain, month: grain === 'year' ? `${date}-01` : date.slice(0, 7), chapter: chapter.key, year: year || date.slice(0, 4), title: ttl.trim(), body, label, lead, family, rating: rm ? rm[1] : null, borderline: /borderline/i.test(label), alleged: /alleged/i.test(label), sources, tracker });
      chapter.count++;
      continue;
    }
    if (line.trim() && chapter && !year) chapter.prose.push(line.trim());
  }
  const expected = (md.match(/^- \*\*\d{4}/gm) || []).length;
  if (items.length !== expected) throw new Error(`${T.key}: parsed ${items.length} items, file has ${expected}`);
  for (const c of chapters) if (!c.count) throw new Error(`${T.key}: empty chapter ${c.key}`);
  const urls = new Set(); for (const it of items) for (const s of it.sources) urls.add(s.url);
  const by = (key) => items.reduce((m, it) => ((m[it[key]] = (m[it[key]] || 0) + 1), m), {});
  const sorted = items.slice().sort((a, b) => a.date.localeCompare(b.date));

  // threads: the topic's Deep Dives data files, read as they are
  const threads = [];
  for (const cfg of T.threads) {
    const f = path.join(DIVES, cfg.slug + '.json');
    if (!fs.existsSync(f)) { console.warn(`${T.key}: thread skipped, no data file: ${f}`); continue; }
    const x = JSON.parse(fs.readFileSync(f, 'utf8'));
    const events = x.days.flatMap((d) => d.events.map((e) => ({ date: d.date, monthOnly: !!d.month, actor: e.actor, kind: e.kind || null, title: e.title, body: e.body || [], sources: e.sources || [], trackerIds: e.trackerIds || [] }))).sort((a, b) => a.date.localeCompare(b.date));
    const seeds = [...new Set((x.trackerIds || []).concat(events.flatMap((e) => e.trackerIds)))];
    const seedSet = new Set(seeds);
    const acts = items.filter((it) => it.tracker && seedSet.has(idOf(it.tracker))).map((it) => it.i);
    const turls = new Set(); (function walk(o) { if (Array.isArray(o)) return o.forEach(walk); if (o && typeof o === 'object') { if (Array.isArray(o.sources)) o.sources.forEach((s) => turls.add(s.url)); Object.values(o).forEach(walk); } })(x);
    const row = (id) => (x.ledger || []).find((r) => r.id === id);
    const stats = cfg.stats.map((s) => {
      if (s.meta) { const v = x.meta[s.meta]; if (v == null) return null; const n = s.countOf && Array.isArray(v) ? String(v.length) : s.date ? longDate(v) : String(v); return { n, l: s.label }; }
      const r = row(s.id); if (!r || r[s.field] == null) return null;
      return { n: (s.money ? money(r[s.field], true) : String(r[s.field])) + (s.suffix || ''), l: s.label };
    }).filter(Boolean);
    const hero = x.hero || {};
    threads.push({
      slug: x.slug, family: cfg.family, actors: cfg.actors || null, kicker: x.meta.kicker, title: x.meta.title, dek: x.meta.dek, status: x.meta.status, statusText: x.meta.statusText, vote: x.meta.vote || null, updated: x.updated,
      question: hero.question || x.meta.dek, answer: hero.answer || (hero.deck ? hero.deck[0] : ''), rule: hero.rule || '', ruleSources: hero.ruleSources || [],
      first: events[0].date, last: events[events.length - 1].date, months: new Set(events.map((e) => e.date.slice(0, 7))).size,
      events, acts, seeds: seeds.length, sources: turls.size, stats,
      ledger: x.ledger || [], claims: x.claims || [], voices: x.voices || { objected: [], defended: [] }, rules: x.rules || [], watch: x.watch || [], take: x.take || [], corrections: x.corrections || [],
    });
    console.log(`${T.key}: thread ${x.slug}: ${events.length} events in ${threads[threads.length - 1].months} months, ${acts.length} ledger acts, ${turls.size} sources, ${seeds.length} seeds`);
  }

  const hasPrologue = fs.existsSync(path.join(OUTDIR, 'story', 'prologue.json'));
  const topic = {
    key: T.key, name: T.name, edition: T.edition, kicker: T.kicker, unit: T.unit, of: T.of, description: T.description, start: T.start,
    chapters: T.chapters.map((c) => ({ key: c.key, short: c.short, from: c.from, to: c.to, term: c.term, rowLabel: c.rowLabel || null })),
    terms: T.terms, eras: T.eras,
    families: Object.fromEntries(Object.entries(T.families).map(([k, f]) => [k, { label: f.label, short: f.short, color: f.color }])),
    familyOrder: Object.keys(T.families),
    door: T.door,
    story: { topicList: T.story.topicList, introGap: T.story.introGap || '', coldOpen: T.story.coldOpen ? T.story.coldOpen.source : null, storybar: T.story.storybar || '', hasPrologue },
  };
  const out = {
    title, subtitle, topic, threads,
    built: new Date().toISOString().slice(0, 10),
    families: Object.fromEntries(Object.entries(T.families).map(([k, f]) => [k, { label: f.label, short: f.short, color: f.color, leads: f.leads, count: items.filter((it) => it.family === k).length }])),
    chapters, intro, labelDefs, setAside, totals, method,
    stats: { items: items.length, sources: urls.size, rated: items.filter((it) => it.rating).length, borderline: items.filter((it) => it.borderline).length, first: sorted[0].date, last: sorted[sorted.length - 1].date, byChapter: by('chapter'), byFamily: by('family'), byYear: by('year'), byMonth: by('month'), byRating: by('rating') },
    items,
  };
  fs.writeFileSync(path.join(OUTDIR, 'ledger.json'), JSON.stringify(out, null, 1));
  console.log(`${T.key}: wrote ${path.relative(__dirname, path.join(OUTDIR, 'ledger.json'))}: ${items.length} items, ${urls.size} source URLs, ${chapters.length} chapters, ${labelDefs.length} label definitions, ${setAside.length} set-aside notes, ${totals.length} totals`);
  console.log(`${T.key}: by family:`, out.stats.byFamily, '| by chapter:', out.stats.byChapter);
  const other = items.filter((it) => it.family === 'other');
  if (other.length) console.log(`${T.key}: other:`, other.map((it) => `${it.date} ${it.title.slice(0, 50)} [${it.label.slice(0, 40)}]`));

  // the pages, copied from src/ (edit the masters there, never the copies)
  // each copy is stamped with its edition, so scripts that run before ledger.json loads (the story offer, storage keys) know it
  for (const p of PAGES) { const html = fs.readFileSync(path.join(__dirname, 'src', p), 'utf8').replace('<html lang="en">', `<html lang="en" data-topic="${T.key}" data-prologue="${hasPrologue ? 1 : 0}">`); fs.writeFileSync(path.join(OUTDIR, p), html); }
  // the prologue's real tracker titles, if this edition has a prologue yet
  const pro = path.join(OUTDIR, 'story', 'prologue.json');
  if (hasPrologue) {
    const P = JSON.parse(fs.readFileSync(pro, 'utf8')); const tt = {};
    for (const bt of P.sections.flatMap((s) => s.beats)) { if (bt.id.startsWith('ledger:')) continue; const f = path.join(ENTRIES, bt.id + '.json'); if (fs.existsSync(f)) tt[bt.id] = JSON.parse(fs.readFileSync(f, 'utf8')).title; else console.warn(`${T.key}: no tracker entry file for ${bt.id}`); }
    fs.writeFileSync(path.join(OUTDIR, 'story', 'tracker-titles.json'), JSON.stringify(tt, null, 1));
    console.log(`${T.key}: wrote story/tracker-titles.json: ${Object.keys(tt).length} titles`);
  } else console.log(`${T.key}: no story/prologue.json yet; the story page will say so`);
}

const only = process.argv[2];
for (const [key, T] of Object.entries(TOPICS)) { if (only && only !== key) continue; build(T); }
