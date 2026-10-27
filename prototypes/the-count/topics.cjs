// Per-topic configuration for The Count. Everything a page needs to know about a topic that is not in the
// ledger itself lives here and is written into ledger.json as `topic`, so the four pages in src/ stay
// topic-agnostic. Each topic is one ledger at the workspace root plus the Deep Dives data files it follows
// as threads. The only editorial layers are: the family grouping of the ledger's labels (with a palette
// validated on the paper surface in display order), the door's chip groups, and a few words of copy.
'use strict';

const corruption = {
  key: 'corruption',
  out: '.',                                        // the root of the prototype is the corruption edition
  ledger: '../../trump-corruption-chronology.md',
  name: 'The Count',
  edition: 'The corruption edition',
  kicker: 'a corruption ledger',                   // "A corruption ledger · 2017 to October 2026"
  unit: 'acts of corruption',                      // "317 acts of corruption in the ledger of Donald Trump ..."
  of: 'Donald Trump, his family and his administration',
  description: 'A count of documented acts of corruption by Donald Trump, his family and his administration, 2017 to 2026, one tally mark per act, from a sourced ledger.',
  start: '2017-01-01',                             // where the time strip begins
  // chapter keys are shared by every topic so the pages' layout rules hold; titles and bounds are the topic's
  chapters: [
    { key: 'before',   match: /^## Before the first term/, short: 'Before the first term', from: '2017-01-01', to: '2017-01-20', term: 'first', rowLabel: 'Before' },
    { key: 'first',    match: /^## First term/,            short: 'First term',            from: '2017-01-20', to: '2021-01-20', term: 'first' },
    { key: 'between',  match: /^## Between the terms/,     short: 'Between the terms',     from: '2021-01-20', to: '2025-01-20', term: 'between' },
    { key: 'second25', match: /^## Second term: 2025/,     short: 'Second term, 2025',     from: '2025-01-20', to: '2026-01-01', term: 'second' },
    { key: 'second26', match: /^## Second term: 2026/,     short: 'Second term, 2026',     from: '2026-01-01', to: null,         term: 'second' },
  ],
  terms: [
    { key: 'all',     t: null,      label: 'Both terms, since 2017' },
    { key: 'second',  t: 'second',  label: 'Only the second term' },
    { key: 'first',   t: 'first',   label: 'Only the first term and the record before it' },
    { key: 'between', t: 'between', label: 'Only the years between' },
  ],
  eras: [{ from: '2017-01-20', to: '2021-01-20', label: 'First term' }, { from: '2021-01-20', to: '2025-01-20', label: 'Between the terms' }, { from: '2025-01-20', to: null, label: 'Second term' }],
  // lead label phrase (lowercased, before any " · " or ":") -> family. Colors: the dataviz reference light theme,
  // validated on #f3eee4 in this order on 2026-10-26.
  families: {
    profit:      { label: 'Self-dealing, emoluments and public money', short: 'Self-dealing',             color: '#2a78d6', leads: ['self-dealing and emoluments', 'self-dealing', 'conflicts and self-dealing', 'gifts and emoluments', 'settlement with himself', 'public money, private benefit'] },
    foreign:     { label: 'Foreign money and family business',          short: 'Foreign and family',       color: '#eb6834', leads: ['foreign money', 'family business and foreign money', 'family business', 'nepotism with a money angle', 'nepotism'] },
    crypto:      { label: 'Crypto',                                     short: 'Crypto',                   color: '#1baf7a', leads: ['crypto'] },
    access:      { label: 'Pay-to-play, favors and contracts',          short: 'Favors and contracts',     color: '#6250d6', leads: ['pay-to-play', 'donors, settlements and the ballroom', 'donors and the ballroom', 'regulatory and prosecutorial favors', 'contracts and favors'] },
    pardons:     { label: 'Pardons and clemency',                       short: 'Pardons',                  color: '#e87ba4', leads: ['pardons and clemency'] },
    appointees:  { label: 'Appointee misconduct',                       short: 'Appointee misconduct',     color: '#008300', leads: ['appointee misconduct', 'musk and doge conflicts'] },
    trades:      { label: 'Trades and disclosures',                     short: 'Trades',                   color: '#eda100', leads: ['trades and disclosures'] },
    enforcement: { label: 'Dismantling enforcement and cover-up',       short: 'Dismantling enforcement',  color: '#9a4a1f', leads: ['dismantling enforcement', 'cover-up'] },
    other:       { label: 'Borderline and other',                       short: 'Other',                    color: '#857d70', leads: [] },
  },
  // the door's first question: groups of families in the reader's words; "Everything" is added by the page
  door: [
    { key: 'money',      label: 'Money flowing to him and his family', fams: ['profit', 'foreign', 'crypto'] },
    { key: 'access',     label: 'Favors, contracts and access',        fams: ['access'] },
    { key: 'pardons',    label: 'Pardons',                             fams: ['pardons'] },
    { key: 'appointees', label: 'His appointees’ conduct',        fams: ['appointees'] },
    { key: 'trades',     label: 'His trades and disclosures',          fams: ['trades'] },
    { key: 'watchdogs',  label: 'The watchdogs dismantled',            fams: ['enforcement'] },
  ],
  threads: [
    { slug: 'the-ballroom', family: 'access', stats: [
      { id: 'donors', field: 'count', label: 'Donors named; most amounts never disclosed' },
      { id: 'won', field: 'amount', money: true, suffix: '+', label: 'In new or expanded federal contracts to 14 donors in six months, per Public Citizen' },
      { id: 'released', field: 'amount', money: true, label: 'Released to the Secret Service for "White House Security Measures"' },
      { meta: 'vote', label: 'The Supreme Court vote letting construction continue, legality undecided' },
    ] },
  ],
  story: {
    // the hero's one hand-written clause naming what the prologue covers, and the intro's one-line gap; both are framing, not findings
    topicList: 'the watchdogs, the ethics rules, the Justice Department, loyalists in key posts, enforcement and clemency, and the law’s limits',
    introGap: 'One: the record does not show Trump keeping Congress from banning stock trading; it shows him backing a ban limited to Congress and attacking the one bill that also covered the president, so that sits in the last section among the law’s limits.',
    coldOpen: /crypto and memecoin income/i,          // which Appendix B row opens the story
    storybar: 'oversight and the law around Trump', // "What changed in <storybar>, then the count, era by era." on the other readings
    // the prologue sweep's configuration (tools/workflows/prologue-sweep.js reads it through tools/args.cjs)
    prologue: {
      title: 'How the Stage Was Set',
      // what the finders are told the prologue is about (one sentence, no thesis)
      intro: 'the acts that removed checks, weakened rules, or installed people so that self-dealing and favors could proceed, with emphasis on the second term (2025 to October 2026) and first-term precedents where they explain the second',
      // the standing instruction every agent in the sweep sees; written for the first run and kept as the record of what was asked
      framing: 'The reader asked for a prologue on how Trump set things up to allow this level of corruption, especially in his second term, naming four examples: firing inspectors general, keeping Congress from banning stock trading, surrounding himself with loyalists, and appointing his personal attorney as the head of the Justice Department. A research pass on October 26, 2026 found the second example is not what the record shows: the entry trump-backs-congress-only-stock-ban-attacked-hawley-bill-covering-president documents Trump backing a ban that covers Congress only and attacking the one bill that would also have covered the president. Present his position exactly as that entry states it, never as the reader framed it.',
      whyRule: 'says how the act removed a check, changed who holds a post, or made self-dealing or favors easier, or, for a court ruling or a vote, what limit it shows',
      termNote: 'first (2017 to January 2021), between (2021 to January 2025) or second',
      precedents: 'first-term and 2024 precedents where they explain the second',
      gapsRule: 'the reader\u2019s named examples the corpus does not support or supports differently, and any section resting on fewer than two entries',
      endSection: '',
      criticChecks: 'for each of the reader\u2019s four named examples (inspectors general fired; the stock-trading ban and Trump\u2019s position on it as the corpus records it; loyalists installed; the personal attorney as attorney general), is it covered in the outline with an entry, stated exactly as the entry states it? Also search for: Schedule F or the civil-service reclassification; the removal of the Office of Special Counsel head; the removal of the Office of Government Ethics director; the FEC losing its quorum; the inspector general purge; the Public Integrity Section cut; the FCPA pause; the crypto enforcement unit disbanded; the ethics pledge revoked; the refusal to divest; Bondi\u2019s appointment and her donation history; Blanche replacing her; Ed Martin; the state-bar rule; leaving GRECO; ending the shell-company registry; Cannon\u2019s dismissal; Smith dropping both cases; the election-allies pardon proclamation; the Slaughter ruling',
      subjectExample: 'the step on Kash Patel\u2019s appointment',
      themes: [
        { key: 'watchdogs', title: 'The watchdogs removed', look: 'inspectors general fired, sidelined or their reports altered (2020 and 2025 purges and individual removals); the Office of Government Ethics director removed; the Office of Special Counsel head removed; the Federal Election Commission, Merit Systems Protection Board, NLRB or privacy boards left without quorum or members; whistleblower retaliation; GAO or oversight findings ignored', keywords: '"inspector general" "inspectors general" "Office of Government Ethics" Huitema "Office of Special Counsel" Dellinger "Federal Election Commission" Weintraub quorum "Merit Systems" NLRB PCLOB whistleblower watchdog "GAO"', mustRead: ['inspectors-general-purge', 'trump-fires-office-of-special-counsel-dellinger', 'trump-removes-fec-commissioner-weintraub-fec-loses-quorum'] },
        { key: 'rules', title: 'The rules loosened', look: 'the executive-branch ethics pledge revoked; refusal to divest or use a blind trust in 2017 and 2025; financial disclosure delays or gaps; Hatch Act enforcement abandoned; emoluments questions left unresolved; nepotism rules bent; the shell-company ownership registry ended; leaving anti-corruption bodies; ethics agreements broken', keywords: '"ethics pledge" divest "blind trust" "financial disclosure" "Hatch Act" emoluments nepotism "Corporate Transparency" "shell compan" GRECO "anti-corruption" "conflict of interest" "ethics agreement"', mustRead: [] },
        { key: 'doj', title: 'The Justice Department turned', look: 'Pam Bondi named attorney general after acting as Trump\u2019s lawyer and the 2013 donation history; Todd Blanche replacing her; the Public Integrity Section gutted; the Foreign Corrupt Practices Act paused; FARA deprioritized; the crypto enforcement unit disbanded; cases dropped for allies, donors or business partners; the state-bar rule shielding government lawyers; the pardon attorney replaced; Ed Martin as D.C. U.S. attorney and the weaponization working group; Kash Patel\u2019s FBI', keywords: 'Bondi Blanche "Public Integrity" FCPA "Foreign Corrupt" FARA "foreign agent" "crypto enforcement" "National Cryptocurrency" Patel weaponization "Ed Martin" "pardon attorney" "dropped the case" dismiss Adams', mustRead: ['ed-martin-dc-us-attorney-weaponization-working-group', 'fbi-cr15-purge-ends-navatek-congress-bribery-probe-collins'] },
        { key: 'loyalists', title: 'Loyalists in every chair', look: 'Schedule F or Schedule Policy/Career reclassification; loyalty tests in hiring and questionnaires; mass firings of career officials and prosecutors; acting officials kept in place to avoid confirmation; unqualified allies confirmed; the purge of military lawyers or officers; retribution against officials who objected', keywords: '"Schedule F" loyalty loyalist "civil service" "career officials" acting purge retribution unqualified "Senate confirmed" "loyalty test"', mustRead: [] },
        { key: 'congress', title: 'Congress and the stock ban', look: 'Trump\u2019s position on a congressional stock-trading ban exactly as the corpus records it (which bills he backed, which he attacked, and whom each covered); H.R. 7008 and the HONEST Act; STOCK Act compliance; emoluments suits mooted or dismissed on standing; Congress declining oversight, subpoenas or GAO referrals; Republican members defending or funding specific acts (the ballroom, the IRS settlement)', keywords: '"STOCK Act" "stock trading" "stock ban" "insider trading" "HONEST Act" "H.R. 7008" Hawley Congress subpoena "Oversight Committee" Comer Johnson Thune GAO', mustRead: ['trump-backs-congress-only-stock-ban-attacked-hawley-bill-covering-president', 'trump-save-act-dhs-shutdown-hostage'] },
        { key: 'courts', title: 'The courts as shield', look: 'the presidential immunity ruling; the special counsel cases dismissed or dropped (Judge Cannon; Smith after the election); emoluments suits ended on standing or mootness; Supreme Court stays that let projects continue without deciding legality; the ruling that independent-agency members may be fired at will; injunctions that never took effect; appeals that ran out the clock', keywords: 'immunity "Supreme Court" stay dismissed mooted standing Cannon "special counsel" "Jack Smith" "appeals court" injunction emoluments "Trump v. United States" Slaughter', mustRead: ['supreme-court-trump-v-united-states-presidential-immunity', 'cannon-dismisses-trump-classified-documents-case', 'smith-drops-both-trump-prosecutions-after-election-win', 'scotus-trump-slaughter-overrules-humphreys-executor-fire-ftc'] },
        { key: 'pardons', title: 'The pardon as backstop', look: 'clemency for allies, donors and witnesses (Stone, Manafort, Bannon, Broidy, the 2020 elector scheme and the November 2025 proclamation, Santos); pardons that erased restitution owed to victims; the first corporate pardons; crypto figures pardoned; the pardon office bypassed; brokers selling access to clemency; the signal that accomplices will be protected', keywords: 'pardon commute clemency proclamation restitution Stone Manafort Bannon Broidy "corporate pardon" Binance Zhao Santos Ulbricht "pardon attorney" broker', mustRead: ['trump-pardons-giuliani-meadows-2020-election-allies-proclamation', 'pardon-brokers-60-minutes-hidden-camera-300000'] },
      ],
      // the page review's extra focus for this edition
      reviewFocus: 'the prologue row on the wall for the steps outside the count, the wall key, the "Context \u00b7 not in the count" badge, and the intro\u2019s one-line gap',
    },
  },
};

const press = {
  key: 'press',
  out: 'press',
  ledger: '../../trump-press-chronology.md',
  name: 'The Count',
  edition: 'The press edition',
  kicker: 'a ledger of actions against the press',
  unit: 'acts against the press and the public’s access to information',
  of: 'Donald Trump, his White House and his appointees',
  description: 'A count of documented actions by Donald Trump, his White House and his appointees against the press and the public’s access to information, 2015 to 2026, one tally mark per act, from a sourced ledger.',
  start: '2015-06-01',
  chapters: [
    { key: 'before',   match: /^## The 2016 campaign/,  short: 'The 2016 campaign',    from: '2015-06-16', to: '2017-01-20', term: 'first', rowLabel: 'Campaign' },
    { key: 'first',    match: /^## First term/,         short: 'First term',           from: '2017-01-20', to: '2021-01-20', term: 'first' },
    { key: 'between',  match: /^## Between the terms/,  short: 'Between the terms',    from: '2021-01-20', to: '2025-01-20', term: 'between' },
    { key: 'second25', match: /^## Second term: 2025/,  short: 'Second term, 2025',    from: '2025-01-20', to: '2026-01-01', term: 'second' },
    { key: 'second26', match: /^## Second term: 2026/,  short: 'Second term, 2026',    from: '2026-01-01', to: null,         term: 'second' },
  ],
  terms: [
    { key: 'all',     t: null,      label: 'Both terms and the 2016 campaign' },
    { key: 'second',  t: 'second',  label: 'Only the second term' },
    { key: 'first',   t: 'first',   label: 'Only the first term and the 2016 campaign' },
    { key: 'between', t: 'between', label: 'Only the years between' },
  ],
  eras: [{ from: '2015-06-16', to: '2017-01-20', label: 'Campaign' }, { from: '2017-01-20', to: '2021-01-20', label: 'First term' }, { from: '2021-01-20', to: '2025-01-20', label: 'Between the terms' }, { from: '2025-01-20', to: null, label: 'Second term' }],
  // the ledger's nine labels are the nine families, one to one; colors validated on #f3eee4 in this order on 2026-10-26 (order B: the brown of named-journalist actions sits between aqua and violet)
  families: {
    access:      { label: 'Access and the pool',               short: 'Access and the pool',       color: '#2a78d6', leads: ['access and the pool'] },
    bans:        { label: 'Bans and credentials',              short: 'Bans and credentials',      color: '#eb6834', leads: ['bans and credentials'] },
    suits:       { label: 'Lawsuits and settlements',          short: 'Lawsuits and settlements',  color: '#1baf7a', leads: ['lawsuits and settlements'] },
    journalists: { label: 'Action against named journalists', short: 'Action against journalists', color: '#9a4a1f', leads: ['action against named journalists'] },
    fcc:         { label: 'The FCC and licenses',              short: 'The FCC and licenses',      color: '#6250d6', leads: ['the fcc and licenses'] },
    publicmedia: { label: 'Public media and Voice of America', short: 'Public media and VOA',      color: '#e87ba4', leads: ['public media and voice of america'] },
    threats:     { label: 'Threats and rhetoric',              short: 'Threats and rhetoric',      color: '#008300', leads: ['threats and rhetoric'] },
    leaks:       { label: 'Leak investigations and subpoenas', short: 'Leak hunts and subpoenas',  color: '#eda100', leads: ['leak investigations and subpoenas'] },
    info:        { label: 'Information withheld',              short: 'Information withheld',      color: '#e34948', leads: ['information withheld'] },
    other:       { label: 'Other',                             short: 'Other',                     color: '#857d70', leads: [] },
  },
  door: [
    { key: 'shutout',  label: 'Bans, credentials and access',           fams: ['bans', 'access'] },
    { key: 'threats',  label: 'Threats and rhetoric',                   fams: ['threats'] },
    { key: 'suits',    label: 'Lawsuits and settlements',               fams: ['suits'] },
    { key: 'fcc',      label: 'The FCC and public media',               fams: ['fcc', 'publicmedia'] },
    { key: 'reporters', label: 'Reporters’ records and named journalists', fams: ['leaks', 'journalists'] },
    { key: 'info',     label: 'Information withheld',                   fams: ['info'] },
  ],
  threads: [
    { slug: 'press-ban', family: 'bans', actors: { press: { label: 'The press', c: '#857d70' }, court: { label: 'The court', c: '#1a1813' } }, stats: [
      { meta: 'outlets', countOf: true, label: 'Outlets banned by name' },
      { meta: 'bannedFrom', date: true, label: 'Banned, by a post naming no story' },
      { meta: 'restored', date: true, label: 'Passes ordered restored by a judge he appointed' },
    ] },
  ],
  story: {
    topicList: 'access and the pool, the FCC, public media, the lawsuits and settlements, reporters’ records, the information withheld, and the law’s limits',
    introGap: '',
    coldOpen: /media and defamation lawsuits/i,      // Axios' count of media and defamation suits involving Trump, his businesses or his administration, in either direction
    storybar: 'access, licenses, public media, lawsuits, reporters’ records and public data',
    prologue: {
      title: 'What Changed Around the Press',
      intro: 'the acts that changed who controls access to the president, who regulates broadcasters, who funds public media, what the Justice Department may do to reporters, and what the law stops, with emphasis on the second term (2025 to October 2026) and first-term or campaign precedents where they explain the second',
      framing: 'This is the press edition of a template whose corruption edition opens with a sourced prologue. The press prologue should do the same: list, in sourced steps, how access to the president, broadcast regulation, public media funding, the Justice Department\u2019s rules on reporters and the government\u2019s public data changed, placing those steps beside the acts without claiming that any step caused any act. The likely themes are who controls access to the president and the pool; the Federal Communications Commission and broadcast licenses; the defunding of public media and the dismantling of Voice of America and its sister networks; the lawsuits, settlements and threats; the Justice Department\u2019s rules on reporters\u2019 records and leak hunts; the removal of public data and briefings; and the law\u2019s limits, meaning the First Amendment rulings that blocked bans and the settlements that no court reviewed. The themes are a starting point, not a thesis: report what the corpus holds.',
      whyRule: 'says what access, check or protection the step changed for the press or the public, or, for a court ruling, what limit it shows',
      termNote: 'first (2017 to January 2021; the 2016 campaign counts as first), between (2021 to January 2025) or second',
      precedents: 'campaign, first-term and between-terms precedents where they explain the second',
      gapsRule: 'what the corpus does not support and any section resting on fewer than two entries',
      endSection: 'End with a section on the law\u2019s limits (rulings that blocked or restored, what no court reviewed).',
      criticChecks: 'is each likely theme covered with real entries: the pool takeover and the AP ban; the FCC chairman\u2019s license threats and the news-distortion and merger probes; the defunding of public media and the dismantling of Voice of America; the big settlements (ABC, Paramount, Meta) and the suits against the New York Times, the Wall Street Journal and the BBC; the rescission of the Justice Department\u2019s news-media subpoena guidelines; the removal of public data and the firing of the BLS commissioner; the CNN, MS NOW and Politico ban and the ruling that blocked it; the Pentagon press pledge',
      subjectExample: 'the step on the pool takeover',
      themes: [
        { key: 'access', title: 'Access and the pool', look: 'the White House taking over the press pool from the correspondents\u2019 association; new briefing-room seating; the AP barred over the Gulf naming; wire services removed from the pool; ended or rare briefings; press removed from workspaces; the Pentagon press pledge and the exodus of reporters; bans of named outlets (CNN, MS NOW, Politico) and the court rulings on them', keywords: '"press pool" pool "briefing room" "Associated Press" "Gulf of America" "wire service" "hard pass" credential "Pentagon" pledge "press corps" "correspondents" "Shut Out" ban banned', mustRead: ['trump-bans-cnn-ms-now-politico-white-house-hard-passes-confiscated', 'white-house-counsel-politico-48-hours-retract-wiles-stories-apologize'] },
        { key: 'fcc', title: 'The FCC and licenses', look: 'Brendan Carr\u2019s license threats and early renewal reviews; news distortion investigations of networks; merger reviews with conditions reaching coverage (Paramount and Skydance, the ombudsman, DEI); the equal-time and sponsorship probes; pressure on commissioners; Trump\u2019s calls to pull licenses; the FCC chairman warning broadcasters over polls', keywords: 'FCC Carr "broadcast license" license "news distortion" Paramount Skydance Comcast "equal time" "pull the license" "fake polls" ombudsman', mustRead: ['fcc-carr-warns-broadcasters-fake-polls-regulatory-obligations'] },
        { key: 'publicmedia', title: 'Public media and Voice of America', look: 'the executive order against NPR and PBS funding; the rescission that defunded the Corporation for Public Broadcasting and its shutdown; the dismantling of the U.S. Agency for Global Media, Voice of America, Radio Free Europe/Radio Liberty, Radio Free Asia; Kari Lake; the court rulings and the inspector general findings on the cuts', keywords: 'NPR PBS "Corporation for Public Broadcasting" CPB rescission "Voice of America" VOA USAGM "Global Media" "Radio Free" "Kari Lake" "Open Technology Fund"', mustRead: ['usagm-inspector-general-voa-cuts-skipped-key-steps-paying-staff-on-leave'] },
        { key: 'suits', title: 'Lawsuits, settlements and threats', look: 'Trump\u2019s suits against ABC, CBS and Paramount, Meta, X, the Des Moines Register and Selzer, the New York Times, the Wall Street Journal, the BBC; the settlements paid to his library and ballroom; the FCC and merger leverage behind the CBS settlement; demands to retract with deadlines; his government\u2019s suits to stop books; threats to prosecute or arrest the press', keywords: 'lawsuit sued defamation settlement "60 Minutes" Paramount "Des Moines Register" Selzer "New York Times" "Wall Street Journal" BBC retract library ballroom "arrested" prosecute', mustRead: ['trump-says-nyt-media-should-be-arrested-ohio-rally-empty-seats'] },
        { key: 'doj', title: 'Reporters\u2019 records and leak hunts', look: 'Bondi rescinding the Garland-era policy protecting reporters from subpoenas; seizures of reporters\u2019 records; leak investigations aimed at the press; subpoenas and gag orders; the FBI and reporters; the antitrust probe of the networks over the pool boycott; investigations or charges touching named journalists; visa and border actions against journalists', keywords: 'subpoena "news media guidelines" "reporters\u2019 records" leak "leak investigation" "gag order" antitrust "pool boycott" journalist detained deported visa "Press Freedom Tracker"', mustRead: ['doj-antitrust-probe-tv-networks-white-house-pool-boycott', 'trump-calls-reporter-feinberg-sick-person-oval-office'] },
        { key: 'info', title: 'Information withheld', look: 'datasets and web pages removed; the CDC and other health data stopped; the BLS commissioner fired over a jobs report; statistics or science officials overruled; the IRS withholding filing data; briefings stopped; records rules weakened; the Pentagon barring a senator from a war briefing; war reporting called treason', keywords: 'dataset data removed "taken offline" BLS "jobs report" statistics briefing withheld "records" FOIA "stopped updating" "treason" "war reporting"', mustRead: ['irs-withholds-filing-season-data-gop-tax-law-treasury-approval', 'hegseth-state-of-the-force-war-reporting-treason-no-fatties', 'pentagon-bars-sen-murphy-al-udeid-qatar-war-briefing-hegseth-travel-order'] },
        { key: 'limits', title: 'The law\u2019s limits', look: 'the First Amendment rulings that restored passes or blocked bans (the CNN v. Trump preliminary injunction, the AP case and its appeal), what the courts did not decide, settlements no court reviewed, the libel-law promise, the status of the reporter\u2019s privilege in federal law, and rulings or dismissals that left an action in place', keywords: '"First Amendment" "viewpoint discrimination" injunction appeal "libel laws" "reporter\u2019s privilege" "shield law" ruling dismissed "Press Freedom"', mustRead: ['trump-bans-cnn-ms-now-politico-white-house-hard-passes-confiscated'] },
      ],
      reviewFocus: 'the behavior when every prologue step is an act in the count (no prologue row on the wall, no wall key, the "One of the N acts" badge on every step, the intro\u2019s wording, the hero parenthetical) and the 2016 campaign chapter (its era screen, its stats, its walk link, the strip\u2019s start)',
    },
  },
};

module.exports = { corruption, press };
