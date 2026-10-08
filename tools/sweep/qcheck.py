# usage: python3 qcheck.py -- new quotes (vs git HEAD) in changed/new entries, checked against all saved texts in this sweep;
# also reports any new source URL that no map.tsv in this sweep lists (i.e. not loaded by an agent).
import json,re,subprocess,glob,html,os
R='/Users/brock/dev/politiboop/controversial-trump'
D=os.path.dirname(os.path.abspath(__file__))
def norm(s):
    s=html.unescape(s)
    for a,b in [('’',"'"),('‘',"'"),('“','"'),('”','"'),('—','-'),('–','-'),('…','...'),('\xa0',' '),('​',''),('‌',''),('⁠',''),('‑','-')]: s=s.replace(a,b)
    s=re.sub(r'-\s+(?=[a-z])','',s); return re.sub(r'\s+',' ',s).lower()
texts=' || '.join(norm(open(f,errors='ignore').read()) for f in glob.glob(D+'/**/*.txt',recursive=True))
known=set()
for m in glob.glob(D+'/**/map.tsv',recursive=True):
    for l in open(m):
        p=l.split('\t')
        if p[0].startswith('http'): known.add(p[0].strip().rstrip('/'))
st=subprocess.run(['git','status','--porcelain','data/controversies'],cwd=R,capture_output=True,text=True).stdout.splitlines()
tot=miss=0
for line in st:
    code,f=line[:2].strip(),line[3:]
    j=json.load(open(f'{R}/{f}'))
    raw='' if code in ('??','A') else subprocess.run(['git','show',f'HEAD:{f}'],cwd=R,capture_output=True,text=True).stdout
    old=norm(raw.replace('\\"','"'))
    for s in j['sources']:
        if s['url'] not in raw and s['url'].rstrip('/') not in known: print('UNTRACED URL',j['id'][:45],'|',s['url'])
    t=j['title']+'\n'+j['summary']+'\n'+'\n'.join(j['keyFacts'])
    for q in re.findall(r'"([^"\n]{12,}?)"',t):
        qn=norm(q).strip(' .,;:')
        if qn in old: continue
        tot+=1
        if qn in texts: continue
        parts=[p.strip(' .,;:') for p in re.split(r'\.\.\.|\[[^\]]*\]',qn) if len(p.strip())>8]
        if parts and all(p in texts for p in parts): continue
        miss+=1; print('MISS',j['id'][:45],'|',q[:150])
print(f'{miss} of {tot} new quotes not found')
