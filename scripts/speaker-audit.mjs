#!/usr/bin/env node
/*
 * Report sui dati di ruolo, azienda e credenziali degli speaker.
 *
 *   node scripts/speaker-audit.mjs            # scrive context/SPEAKER-DATA-CLEANUP.md
 *   node scripts/speaker-audit.mjs --out FILE
 *
 * Le regole di composizione qui dentro sono le stesse che usa il sito
 * (src/lib/speakerMeta.js): la colonna "come apparirebbe" dice quindi cosa il
 * codice sistema da sé e cosa resta da correggere nei dati.
 * Da rilanciare dopo ogni pulizia: le sezioni che si svuotano sono lavoro
 * finito.
 */

import matter from 'gray-matter';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { composeSpeakerMeta, looseName } from '../src/lib/speakerMeta.js';

const DIR = 'src/config/profiles';
const SPONSORS = 'src/config/sponsors';
const OUT = process.argv.includes('--out')
  ? process.argv[process.argv.indexOf('--out') + 1]
  : 'context/SPEAKER-DATA-CLEANUP.md';

const cell = (s) => String(s ?? '').replace(/\|/g, '\\|');
const CRED =
  /\b(kubestronaut|ambassador|tag |champion|comms lead|gde |mvp|cncf|dokc|organizer|co-?founder of)\b/i;
// due pezzi "ruolo presso organizzazione" nella stessa stringa
const MULTI = /(\bat\b|@)[^@|]+\s(&|and|\|)\s/i;

// URL proposti per le aziende senza companyUrl usabile. `src` dice da dove
// viene: repo (altro profilo o cartella sponsor), noto (dominio dell'azienda),
// da-confermare (serve una conferma umana).
const URL_PROPOSALS = {
  clastix: { url: 'https://clastix.io/', src: 'repo (sponsor)' },
  desotech: { url: 'https://deso.tech/', src: 'repo (sponsor)' },
  seacom: { url: 'https://seacom.it/', src: 'repo (sponsor)' },
  suse: { url: 'https://www.suse.com/', src: 'repo (sponsor)' },
  reevo: { url: 'https://www.reevo.it/', src: 'repo (sponsor)' },
  edb: { url: 'https://www.enterprisedb.com/', src: 'repo (sponsor)' },
  sparkfabrik: { url: 'https://www.sparkfabrik.com/', src: 'repo (sponsor)' },
  sysdig: { url: 'https://sysdig.com/', src: 'repo (altro profilo)' },
  arubacloud: { url: 'https://www.cloud.it', src: 'repo (sponsor), ma un profilo usa aruba.it: scegliere' },
  kundolabs: { url: 'https://kundolabs.com/', src: 'noto (verificato)' },
  fractalcloud: { url: 'https://fractal.cloud/', src: 'noto (verificato)' },
  dedalus: { url: 'https://www.dedalus.com/', src: 'noto (verificato). Oggi il profilo di Serena punta a theredcode.it, che è il suo blog' },
  ing: { url: 'https://www.ing.com/', src: 'noto' },
  visa: { url: 'https://www.visa.com/', src: 'noto' },
  essilorluxottica: { url: 'https://www.essilorluxottica.com/', src: 'noto' },
  adessoit: { url: 'https://www.adesso.it/', src: 'noto' },
  zextras: { url: 'https://www.zextras.com/', src: 'noto' },
  devoteamluxembourg: { url: 'https://www.devoteam.com/', src: 'noto, esiste anche devoteam.lu: scegliere' },
  imolainformatica: { url: 'https://www.imolainformatica.it/', src: 'da confermare' },
  vittoriaassicurazioni: { url: 'https://www.vittoriaassicurazioni.com/', src: 'da confermare' },
};

const profiles = [];
for (const file of (await readdir(DIR)).filter((f) => f.endsWith('.md')).sort()) {
  const { data } = matter(await readFile(path.join(DIR, file), 'utf8'));
  profiles.push({ file, ...data });
}

// URL già presenti nel repo, per azienda: servono a riempire i buchi senza inventare
const knownUrls = new Map();
for (const p of profiles) {
  const url = (p.companyUrl || '').trim();
  if (p.company && url && url !== '#') {
    const key = looseName(p.company);
    if (!knownUrls.has(key)) knownUrls.set(key, new Set());
    knownUrls.get(key).add(url);
  }
}
for (const file of (await readdir(SPONSORS)).filter((f) => f.endsWith('.md'))) {
  const { data } = matter(await readFile(path.join(SPONSORS, file), 'utf8'));
  const url = (data.url || '').trim();
  if (data.name && url && url !== '#') {
    const key = looseName(data.name);
    if (!knownUrls.has(key)) knownUrls.set(key, new Set());
    knownUrls.get(key).add(url);
  }
}

const b = { multi: [], A: [], B: [], C: [], D: [], E: [], F: [], H: [] };
for (const p of profiles) {
  const role = (p.role || '').trim();
  const company = (p.company || '').trim();
  const meta = composeSpeakerMeta(p);
  const shown = [meta.role, meta.company && `@${meta.company}`].filter(Boolean).join(' ');
  const line = `| \`${p.file}\` | ${cell(p.name)} | ${cell(role) || '_vuoto_'} | ${cell(company) || '_vuoto_'} | ${cell(shown) || '_vuoto_'} |`;

  if (MULTI.test(role)) b.multi.push(line);
  if (meta.rule.startsWith('R1') || meta.rule === 'R0-azienda-davanti') b.A.push(line);
  else if (meta.rule === 'R2-dentro') b.B.push(line);
  else if (meta.rule === 'R3-append' && /\bat\b|@|\|/i.test(role)) b.C.push(line);
  if (role && CRED.test(role)) {
    b.D.push(
      `| \`${p.file}\` | ${cell(p.name)} | ${cell(role)} | ${cell(p.communityRole) || '_vuoto_'} |`,
    );
  }
  if (!company || !role) b.E.push(line);
  const url = (p.companyUrl || '').trim();
  if (company && (!url || url === '#')) {
    const key = looseName(company);
    const fromRepo = knownUrls.has(key) ? [...knownUrls.get(key)].join(' , ') : '';
    const proposal = URL_PROPOSALS[key];
    // La tabella curata vince sul valore pescato dal repo: in un caso il repo
    // stesso ha un URL sbagliato (il blog personale al posto dell'azienda).
    const url = proposal?.url || fromRepo || '_da trovare_';
    const src = proposal?.src || (fromRepo ? 'repo' : 'da trovare');
    const extra = proposal && fromRepo && !fromRepo.includes(proposal.url) ? ` (nel repo: ${fromRepo})` : '';
    b.F.push(`| \`${p.file}\` | ${cell(company)} | ${cell(url)} | ${cell(src + extra)} |`);
  }
  if (shown.length > 60) b.H.push(`| \`${p.file}\` | ${shown.length} | ${cell(shown)} |`);
}

const head = '| file | nome | role attuale | company | come apparirebbe |\n|---|---|---|---|---|';
const empty = '| _nessuno_ | | | | |';
const md = `# Speaker: ruolo, azienda, credenziali. Cose da controllare

Rigenerabile con \`node scripts/speaker-audit.mjs\`. ${profiles.length} profili in
\`src/config/profiles\`. La colonna "come apparirebbe" applica le regole del
sito, quindi dice cosa il codice sistema da sé e cosa resta da correggere nei
dati. Le sezioni che si svuotano sono lavoro finito.

## Convenzione

- \`role\`: il titolo. Si può scrivere anche "Ruolo @ Azienda" o "Azienda |
  Ruolo": la resa se ne accorge e non duplica.
- \`company\`: solo l'azienda, nella forma che vogliamo vedere sul sito.
- \`companyUrl\`: sito dell'azienda, cliccabile **solo** nella pagina profilo.
  \`#\` e vuoto contano come assente.
- \`communityRole\`: credenziali e ruoli di community (Kubestronaut,
  ambassador, TAG lead, comms lead), non dentro \`role\`.

## Regole di resa

1. **R0** L'azienda sta davanti al ruolo con un separatore ("Liquid Reply |
   Senior Platform Engineer"): si toglie da davanti e si appende in coda.
2. **R1** Il ruolo finisce con un connettore (\`at\`, \`@\`, \`|\`, \`,\`) più
   l'azienda: la coda si taglia. Se la coda è l'azienda o una sua sigla si
   appende la forma canonica del campo; se la coda è **più specifica** e sta in
   45 caratteri si tiene la coda ("Chair, CERN Open Source Program Office" →
   "Chair @CERN Open Source Program Office").
3. **R2** L'azienda compare nel ruolo ma non in coda e non in testa: si mostra
   il ruolo intero, senza appendere niente.
4. **R3** Altrimenti \`ruolo @azienda\`.

Separatore: per ora \`@\` come oggi, in una costante di
\`src/lib/speakerMeta.js\`. Passare a \` · \` è una riga.

Colori: nelle **card** tutto grigio, ruolo e credenziali. Nella **pagina
profilo** ruolo blu, azienda cliccabile se c'è l'URL, credenziali magenta.

## 0. Più ruoli o più aziende nella stessa stringa

Il caso che le regole non possono risolvere: la persona ha due incarichi, a
volte in due organizzazioni diverse, e il modello dati ne prevede uno.
Serve decidere se aggiungere un secondo ruolo strutturato.

${head}
${b.multi.join('\n') || empty}

## A. L'azienda è in testa o in coda al ruolo: la regola la sposta

Da verificare solo che il taglio sia quello giusto.

${head}
${b.A.join('\n') || empty}

## B. L'azienda è dentro il ruolo, non agli estremi: si mostra il ruolo intero

${head}
${b.B.join('\n') || empty}

## C. L'azienda è scritta in due modi diversi: il codice non può indovinare

Il ruolo nomina un'organizzazione che non combacia col campo \`company\`,
quindi escono entrambe. Spesso è una credenziale travestita da ruolo.

${head}
${b.C.join('\n') || empty}

## D. Credenziali dentro il ruolo: da spostare in \`communityRole\`

| file | nome | role attuale | communityRole attuale |
|---|---|---|---|
${b.D.join('\n') || '| _nessuno_ | | | |'}

## E. Ruolo o azienda mancanti

Per il team interno l'azienda assente è normale: sono i ruoli
nell'organizzazione, non un impiego.

${head}
${b.E.join('\n') || empty}

## F. \`companyUrl\` assente o segnaposto, con l'URL proposto

Fonte \`repo\` significa che l'URL è già nel repository (altro profilo con la
stessa azienda, o la cartella sponsor): quelli si possono applicare senza
pensarci. \`noto\` sono domini aziendali, \`da confermare\` vanno guardati.

| file | company | URL proposto | fonte |
|---|---|---|---|
${b.F.join('\n') || '| _nessuno_ | | | |'}

## G. Stessa azienda scritta in modi diversi tra profili

Uniformate il 2026-08-17: \`SparkFabrik\`, \`Liquid Reply GmbH\`,
\`Zucchetti SPA\`. Se ricompare un doppione, questa sezione lo ripesca.

${(() => {
  const byCompany = new Map();
  for (const p of profiles) {
    const company = (p.company || '').trim();
    if (!company) continue;
    const key = looseName(company);
    if (!byCompany.has(key)) byCompany.set(key, new Set());
    byCompany.get(key).add(company);
  }
  const dup = [...byCompany.values()]
    .filter((set) => set.size > 1)
    .map((set) => `- ${[...set].map((s) => `\`${s}\``).join(' , ')}`);
  return dup.join('\n') || '- _nessuna_';
})()}

## H. Testo composto oltre i 60 caratteri

Solo informativo: riguarda le card social, dove il testo va accorciato caso
per caso scegliendo cosa dire. **Non** è un motivo per accorciare quello che
si vede sul sito.

| file | lunghezza | testo |
|---|---|---|
${b.H.join('\n') || '| _nessuno_ | | |'}
`;

await writeFile(OUT, md);
console.log(`scritto ${OUT}`);
console.log(
  Object.entries(b)
    .map(([k, v]) => `${k}:${v.length}`)
    .join('  '),
);
