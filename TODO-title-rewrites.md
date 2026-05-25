# Title Rewrite Progress

92 entries still have em dashes in their titles out of 533 total.
441 entries (83%) have been converted to organic, newspaper-style headlines.

## Next session: finish the remaining 92

Run this to find them:
```bash
cd controversial-trump && node -e "
const fs = require('fs');
const dir = 'data/controversies';
fs.readdirSync(dir).filter(f => f.endsWith('.json')).forEach(f => {
  try {
    const d = JSON.parse(fs.readFileSync(dir+'/'+f,'utf8'));
    if (d.title && d.title.includes('—')) console.log(f.replace('.json','') + ' ||| ' + d.title);
  } catch(e) {}
});
"
```

Then use the same batch script pattern (rewrite-titles.js) to process them.
