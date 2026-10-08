import json, os
DIR = '/Users/brock/dev/politiboop/controversial-trump/data/controversies'
TODAY = '2026-10-08'
BAD_TITLE = ('—', ' - ', ' – ')
def load(i): return json.load(open(os.path.join(DIR, i + '.json')))
def save(j):
    with open(os.path.join(DIR, j['id'] + '.json'), 'w') as f: f.write(json.dumps(j, indent=2, ensure_ascii=False) + '\n')
def update(i, paras=(), facts=(), sources=(), replace=(), title=None, severity=None):
    j = load(i)
    for old, new in replace:
        n = 0
        for k in ('summary', 'title'):
            if old in j[k]: j[k] = j[k].replace(old, new); n += 1
        for idx, kf in enumerate(j['keyFacts']):
            if old in kf: j['keyFacts'][idx] = kf.replace(old, new); n += 1
        assert n, f'{i}: text not found: {old[:60]}'
    if paras: j['summary'] = j['summary'].rstrip() + '\n\n' + '\n\n'.join(paras)
    j['keyFacts'] = list(j['keyFacts']) + list(facts)
    have = {s['url'].rstrip('/') for s in j['sources']}
    for text, url, typ in sources:
        assert url.rstrip('/') not in have, f'{i}: duplicate source {url}'
        assert typ in ('news','investigation','court-document','government-record'), typ
        j['sources'].append({'text': text, 'url': url, 'type': typ}); have.add(url.rstrip('/'))
    if title: assert not any(x in title for x in BAD_TITLE), 'dash in title'; j['title'] = title
    if severity: j['severity'] = severity
    j['updatedDate'] = TODAY
    save(j); print('updated', i, '|', len(j['keyFacts']), 'facts,', len(j['sources']), 'sources')
def create(j):
    p = os.path.join(DIR, j['id'] + '.json'); assert not os.path.exists(p), 'exists: ' + j['id']
    assert not any(x in j['title'] for x in BAD_TITLE), 'dash in title'
    for s in j['sources']: assert s['type'] in ('news','investigation','court-document','government-record'), s
    j.setdefault('updatedDate', TODAY); save(j); print('created', j['id'])
