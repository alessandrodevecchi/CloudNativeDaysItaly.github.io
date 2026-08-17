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
import { composeSpeakerMeta, looseName, speakerMetaText, speakerRoles } from '../src/lib/speakerMeta.js';

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

/*
 * Decisioni prese con Alessandro sul file annotato del 2026-08-17 e applicate
 * ai profili il 2026-08-18: la mappa è vuota perché non resta niente da fare.
 * Lo storico sta in context/SPEAKER-DATA-CLEANUP-annotato-2026-08-17.md e nel
 * commit che ha toccato i .md. Se nasce una nuova decisione da ricordare
 * finché il dato non è sistemato, si aggiunge qui.
 */
const DECISIONS = {};

/*
 * Credenziali che stanno nella bio e non nel campo `communityRole`. La bio
 * resta com'è: si tratta di copiare il riconoscimento nel campo, così compare
 * anche nelle card e nella pagina profilo.
 * Le certificazioni vendor (AWS, Azure, CKAD) NON sono qui: il campo si chiama
 * community role, e una certificazione è un'altra cosa. Kubestronaut fa
 * eccezione perché nell'ecosistema CNCF vale come badge di community.
 */
const BIO_PROPOSALS = {
  'artem-lajko.md': 'CNCF Kubestronaut | Platform Engineering Ambassador',
  'chiara-corrado.md': 'Women Techmakers Ambassador',
  'evangelista-tragni.md': 'CNCF Kubestronaut | KCD Italy Organizer | vExpert',
  'francesco-canovai.md': 'CloudNativePG Maintainer',
  'gabriele-bartolini.md': 'CloudNativePG Co-Founder & Maintainer',
  'jonathan-gonzalez-v.md': 'CloudNativePG Maintainer',
  'kevin-dubois.md': 'Java Champion',
  'mauricio-salatino.md': 'Java Champion | Cloud Native Ambassador',
  'monica-colangelo.md': 'AWS Hero',
  'stephane-montri.md': 'CDF Ambassador',
  'william-rizzo.md': 'CNCF Ambassador | Linkerd Ambassador',
  'paolo-carta.md': 'CKAD (certificazione, non community role: decidere se tenerla fuori)',
  'enrico-la-sala.md': 'nessuna: in bio solo certificazioni vendor (AWS, Azure)',
};

const profiles = [];
for (const file of (await readdir(DIR)).filter((f) => f.endsWith('.md')).sort()) {
  const { data, content } = matter(await readFile(path.join(DIR, file), 'utf8'));
  profiles.push({ file, ...data, bio: content });
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

const b = { multi: [], A: [], B: [], C: [], D: [], E: [], F: [], H: [], I: [], J: [], K: [], Z: [] };

// frase della bio attorno al riconoscimento, per capire da dove viene la proposta
const CREDENTIAL = /(kubestronaut|cncf ambassador|[a-z ]*ambassador|community builder|aws hero|google developer expert|java champion|champion|maintainer of [^.,;]*|co-?founder [^.,;]*|organizer|certified [^.,;]*|vexpert)/i;

// Grafie sbagliate o incoerenti nelle credenziali, viste nei dati
const SPELLING = [{ wrong: /kubeastronaut/i, right: 'Kubestronaut' }];

// Obiettivo per i profili con una decisione presa: serve alla colonna "da fare"
const targetOf = (file) => {
  const d = DECISIONS[file];
  if (!d) return '';
  const roles = (d.roles || [])
    .map((r) => `${r.role} @${r.company}${r.url ? ` (${r.url})` : ''}`)
    .join(' + ');
  const parts = [];
  if (roles) parts.push(`role: ${roles}`);
  parts.push(`community: ${d.community || '_nessuno_'}`);
  if (d.note) parts.push(`nota: ${d.note}`);
  return parts.join('. ');
};
for (const p of profiles) {
  // chi ha più incarichi usa `roles`: il ruolo singolo non esiste ed è giusto così
  const multi = Array.isArray(p.roles) && p.roles.length > 0;
  const role = multi ? p.roles.map((r) => r.role).join(' + ') : (p.role || '').trim();
  const company = multi ? p.roles.map((r) => r.company).join(' + ') : (p.company || '').trim();
  const meta = composeSpeakerMeta(p);
  const shown = speakerMetaText(p);
  const line = `| \`${p.file}\` | ${cell(p.name)} | ${cell(role) || '_vuoto_'} | ${cell(company) || '_vuoto_'} | ${cell(shown) || '_vuoto_'} |`;

  if (!multi && MULTI.test(role)) b.multi.push(line);
  if (meta.rule.startsWith('R1') || meta.rule === 'R0-azienda-davanti') b.A.push(line);
  else if (meta.rule === 'R2-dentro') b.B.push(line);
  else if (meta.rule === 'R3-append' && /\bat\b|@|\|/i.test(role)) b.C.push(line);
  if (role && CRED.test(role)) {
    b.D.push(
      `| \`${p.file}\` | ${cell(p.name)} | ${cell(role)} | ${cell(p.communityRole) || '_vuoto_'} |`,
    );
  }
  if (!multi && (!company || !role)) b.E.push(line);
  const url = multi ? 'multi' : (p.companyUrl || '').trim();
  if (!multi && company && (!url || url === '#')) {
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

  const community = (p.communityRole || '').trim();
  if (community) {
    const wrong = SPELLING.find((rule) => rule.wrong.test(community));
    b.I.push(
      `| \`${p.file}\` | ${cell(p.name)} | ${cell(community)} | ${wrong ? `grafia: **${wrong.right}**` : ''} |`,
    );
  }

  const bio = String(p.bio || '').replace(/\s+/g, ' ').trim();
  if (!bio) b.K.push(`| \`${p.file}\` | ${cell(p.name)} | ${community ? 'sì' : 'no'} |`);
  const proposal = BIO_PROPOSALS[p.file];
  if (proposal && !community) {
    const found = bio.match(CREDENTIAL);
    const around = found
      ? bio.slice(Math.max(0, found.index - 60), found.index + found[0].length + 60).trim()
      : '';
    b.J.push(
      `| \`${p.file}\` | ${cell(p.name)} | ${cell(around ? `...${around}...` : '')} | ${cell(proposal)} |`,
    );
  }

  const target = targetOf(p.file);
  b.Z.push(
    `| \`${p.file}\` | ${cell(p.name)} | ${cell(role) || '_vuoto_'} | ${cell(p.communityRole) || '_vuoto_'} | ${cell(company) || '_vuoto_'} | ${cell(shown) || '_vuoto_'} | ${cell(p.communityRole) || '_nessuno_'} | ${cell(target)} |`,
  );
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

Decisioni del 2026-08-17: la lista è approvata così, con **Visa a
\`https://www.visa.com/en-us\`** per non finire sul redirect italiano. Restano
accettate le proposte su Aruba (\`cloud.it\`), Devoteam (\`devoteam.com\`),
Imola Informatica e Vittoria Assicurazioni.

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

Dopo la pulizia decisa in sezione 0 questa lista si svuota quasi da sola:
Graziano passa da 95 a 38 caratteri, Nurudeen da 92 a 34, Eleni da 79 a 40,
Alberto si divide in due ruoli.

| file | lunghezza | testo |
|---|---|---|
${b.H.join('\n') || '| _nessuno_ | | |'}

## I. Community role già presenti

Dodici profili su ${profiles.length}. Utile come vocabolario: le credenziali
nuove dovrebbero usare la stessa forma di quelle già scritte.

| file | nome | communityRole | nota |
|---|---|---|---|
${b.I.join('\n') || '| _nessuno_ | | | |'}

## J. Credenziali che stanno nella bio e non nel campo

Trovate leggendo le bio. La bio non si tocca: si copia il riconoscimento in
\`communityRole\`, così compare anche nelle card. Le certificazioni vendor
restano fuori: il campo è "community role".

| file | nome | dalla bio | proposta per communityRole |
|---|---|---|---|
${b.J.join('\n') || '| _nessuno_ | | | |'}

## K. Profili senza bio

Il file ha solo il frontmatter e nessun testo: la bio non è mai stata
scritta, non è un errore di resa. La pagina profilo funziona lo stesso.

| file | nome | ha un community role |
|---|---|---|
${b.K.join('\n') || '| _nessuno_ | | |'}

## Z. Tutti i profili, in una vista

Come si vedrà ogni profilo con le regole attuali, e cosa resta da fare nei
dati. La colonna **da fare** è vuota quando il profilo è a posto.

| file | nome | role nel file | communityRole nel file | company | role reso | community role reso | da fare |
|---|---|---|---|---|---|---|---|
${b.Z.join('\n')}
`;

await writeFile(OUT, md);
console.log(`scritto ${OUT}`);
console.log(
  Object.entries(b)
    .map(([k, v]) => `${k}:${v.length}`)
    .join('  '),
);
