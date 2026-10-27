#!/usr/bin/env node
// Print the `args` JSON for one of the workflow scripts in tools/workflows/, derived from topics.cjs, so the
// scripts themselves hold no paths. Paste the output into Workflow({scriptPath, args}).
// Usage: node tools/args.cjs <topic> sweep
//        node tools/args.cjs <topic> refute            (after node tools/quotes.cjs extract <topic>)
//        node tools/args.cjs <topic> cautions
//        node tools/args.cjs <topic> review [port]
//        node tools/args.cjs <topic> beat add|refresh <entry-id-or-ledger-id> "<section or theme context>" ["<extra rules>"]
'use strict';
const fs = require('fs');
const L = require('./lib.cjs');
const [KEY, WHAT, ...rest] = process.argv.slice(2);
if (!KEY || !WHAT) { console.error('usage: node tools/args.cjs <topic> sweep|refute|cautions|review|beat ...'); process.exit(2); }
const t = L.topic(KEY);
const others = Object.keys(L.TOPICS).filter((k) => k !== KEY).map((k) => L.topic(k)).filter((o) => fs.existsSync(o.prologue));
const example = others[0] ? others[0].prologue : '';
const pro = t.T.story.prologue; if (!pro && (WHAT === 'sweep')) throw new Error(`topics.cjs ${KEY}.story.prologue is missing (title, intro, framing, whyRule, termNote, precedents, gapsRule, endSection, criticChecks, subjectExample, themes)`);
let out;
if (WHAT === 'sweep') out = { topic: KEY, name: t.T.name, unit: t.T.unit, dir: t.entries, ledger: t.ledgerMd, out: t.out, prior: fs.existsSync(t.prologue) ? t.prologue : '', example: fs.existsSync(t.prologue) ? '' : example, prologue: pro };
else if (WHAT === 'refute') { if (!fs.existsSync(t.quotes)) throw new Error('run node tools/quotes.cjs extract ' + KEY + ' first'); out = { topic: KEY, file: t.quotes, n: L.readJson(t.quotes).length, dir: t.entries, ledgerJson: t.ledgerJson, ledgerMd: t.ledgerMd }; }
else if (WHAT === 'cautions') out = { topic: KEY, file: t.prologue, example: others.find((o) => L.readJson(o.prologue).readerNotes) ? others.find((o) => L.readJson(o.prologue).readerNotes).prologue : '', subjectExample: (pro && pro.subjectExample) || 'the step on the first act in the prologue' };
else if (WHAT === 'review') { const P = fs.existsSync(t.prologue) ? L.readJson(t.prologue) : null; const Lg = L.readJson(t.ledgerJson); const steps = P ? L.beatsOf(P).length : 0, inC = P ? L.beatsOf(P).filter((b) => b.inCount).length : 0; const port = rest[0] || '4341'; const sub = t.T.out === '.' ? '' : t.T.out + '/'; out = { topic: KEY, proto: t.proto, out: t.out, ledgerMd: t.ledgerMd, dir: t.entries, url: `http://localhost:${port}/${sub}story.html`, serveFrom: t.proto, port, acts: Lg.items.length, steps, outside: steps - inC, focus: (pro && pro.reviewFocus) || '', otherEdition: others[0] ? `${others[0].out}story.html with ${others[0].prologue}` : '' }; }
else if (WHAT === 'beat') { const [mode, id, context, rules] = rest; if (!['add', 'refresh'].includes(mode) || !id || !context) throw new Error('beat needs: add|refresh <id> "<context>" ["<rules>"]'); out = { topic: KEY, dir: t.entries, ledgerJson: t.ledgerJson, ledgerMd: t.ledgerMd, id, mode, context, rules: rules || '', termNote: (pro && pro.termNote) || 'first, between or second', whyRule: (pro && pro.whyRule) || 'says what check, access or protection the step changed' }; }
else throw new Error('unknown workflow ' + WHAT);
console.log(JSON.stringify(out, null, 1));
