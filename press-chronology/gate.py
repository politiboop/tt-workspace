#!/usr/bin/env python3
"""URL gate for trump-press-chronology.md.

Every link in the ledger must be one somebody actually loaded: a source of a Trump Tracker entry,
a Civics Desk or Deep Dives source, or a page a research agent saved and listed in its map.tsv
(press-chronology/research/*/map.tsv). Tracker-entry links must name an entry that exists.
A URL typed from memory fails here. Exits 1 on any miss.

    python3 press-chronology/gate.py [ledger.md]
"""
import glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LEDGER = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'trump-press-chronology.md')
TRACKER = os.path.join(ROOT, 'controversial-trump/data/controversies')
TRACKER_LINK = 'https://thetrumptracker.com/controversy?id='


def norm(u):
    u = u.strip().replace('http://', 'https://', 1)
    m = re.match(r'(https://)([^/?#]+)(.*)', u)
    if m:
        u = m.group(1) + m.group(2).lower() + m.group(3)
    return u.rstrip('/')


def walk_urls(node, out):
    if isinstance(node, dict):
        for k, v in node.items():
            if k == 'url' and isinstance(v, str) and v.startswith('http'):
                out.add(norm(v))
            else:
                walk_urls(v, out)
    elif isinstance(node, list):
        for v in node:
            walk_urls(v, out)


allowed, origin = set(), {}
tracker_ids = set()
for f in glob.glob(os.path.join(TRACKER, '*.json')):
    j = json.load(open(f))
    tracker_ids.add(j['id'])
    for s in j.get('sources', []):
        allowed.add(norm(s['url']))
n_tracker = len(allowed)

dives = set()
for f in glob.glob(os.path.join(ROOT, 'deep-dives/src/data/*.json')):
    walk_urls(json.load(open(f)), dives)
civics = set()
for f in glob.glob(os.path.join(ROOT, 'the-civics-desk/src/content/articles/*.md')):
    for u in re.findall(r'https?://[^\s)\]>"]+', open(f).read()):
        civics.add(norm(u.rstrip('.,;')))
maps = set()
for m in glob.glob(os.path.join(HERE, 'research/*/map.tsv')):
    for line in open(m):
        p = line.rstrip('\n').split('\t')
        if p and p[0].startswith('http'):
            maps.add(norm(p[0]))
allowed |= dives | civics | maps

text = open(LEDGER).read()
links = re.findall(r'\]\((https?://[^)\s]+)\)', text)
bad, bad_ids, seen = [], [], set()
for u in links:
    if u.startswith(TRACKER_LINK):
        i = u[len(TRACKER_LINK):]
        if i not in tracker_ids:
            bad_ids.append(i)
        continue
    seen.add(norm(u))
    if norm(u) not in allowed:
        bad.append(u)

# Titles: no em dashes inside the bold title of any item.
dash_titles = [t for t in re.findall(r'^- \*\*(.+?)\*\*', text, re.M) if '—' in t]

for u in bad:
    print('NOT IN ANY VERIFIED SOURCE SET:', u)
for i in bad_ids:
    print('NO SUCH TRACKER ENTRY:', i)
for t in dash_titles:
    print('EM DASH IN TITLE:', t)
print(f'{len(links)} links checked ({len(seen)} distinct source URLs); '
      f'allowed set: {n_tracker} tracker, {len(dives)} dives, {len(civics)} civics, {len(maps)} map.tsv; '
      f'{len(bad)} unverified, {len(bad_ids)} bad tracker ids, {len(dash_titles)} em-dash titles')
sys.exit(1 if bad or bad_ids or dash_titles else 0)
