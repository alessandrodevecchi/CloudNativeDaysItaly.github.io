#!/usr/bin/env node
/*
 * Costruisce il CSV delle card speaker dai dati del repo: un talk per riga,
 * con relatori, ruoli e foto già risolti.
 *
 *   node scripts/talks-csv.mjs 2026 > talks.csv
 *   node scripts/talks-csv.mjs 2026 --template random --formats all > talks.csv
 *
 *   <anno>        cartella sotto src/config/talks (default 2026)
 *   --template    `auto` (default: pop-blue per un relatore, pop-split per due)
 *                 `random` (un template diverso per ogni talk, duo garantito
 *                 dove serve) oppure il nome di un template preciso
 *   --formats     come la colonna del CSV (default `1-1|9-16`, oppure `all`)
 *   --out FILE    invece di stdout
 *
 * Legge i frontmatter con gray-matter e non a mano: i titoli usano scalari
 * YAML a blocco (`title: >-`) e una regex leggerebbe `>-` come titolo.
 * Poi: node scripts/social-cards.mjs --csv talks.csv
 */

import matter from 'gray-matter';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Id dei template speaker, come in generator/pro/registry.js. Sono ripetuti
// qui perché quel modulo importa il renderer del browser e non si carica in
// Node; se ne aggiungi uno, aggiungilo anche qui. Un id sconosciuto viene
// comunque respinto dal batch, quindi il rischio è solo perdersi le novità.
const SPEAKER_TEMPLATES = [
  { id: 'comic-blue' },
  { id: 'pop-blue', duo: true },
  { id: 'pop-split', duo: true },
  { id: 'hybrid-round' },
  { id: 'hybrid-square' },
  { id: 'comic-panel', duo: true },
  { id: 'bauhaus-yellow' },
  { id: 'magenta-max' },
  { id: 'facets-blue' },
  { id: 'facets-magenta' },
];

const BADGE = {
  keynote: 'KEYNOTE SPEAKER',
  workshop: 'WORKSHOP',
  'lightning-talk': 'LIGHTNING TALK',
  talk: 'SPEAKER',
};

function parseArgs(argv) {
  const args = { year: '2026', template: 'auto', formats: '1-1|9-16' };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[++i];
    else rest.push(argv[i]);
  }
  if (rest[0]) args.year = rest[0];
  return args;
}

const args = parseArgs(process.argv.slice(2));
const duoTemplates = SPEAKER_TEMPLATES.filter((tpl) => tpl.duo);

function pickTemplate(isDuo) {
  if (args.template === 'auto') return isDuo ? 'pop-split' : 'pop-blue';
  if (args.template === 'random') {
    const list = isDuo ? duoTemplates : SPEAKER_TEMPLATES;
    return list[Math.floor(Math.random() * list.length)].id;
  }
  return args.template;
}

const profiles = new Map();
for (const file of await readdir('src/config/profiles')) {
  if (!file.endsWith('.md')) continue;
  const { data } = matter(await readFile(path.join('src/config/profiles', file), 'utf8'));
  profiles.set(data.id || file.replace(/\.md$/, ''), data);
}

const dir = path.join('src/config/talks', args.year);
const rows = [];
for (const file of (await readdir(dir)).filter((f) => f.endsWith('.md')).sort()) {
  const { data } = matter(await readFile(path.join(dir, file), 'utf8'));
  const speakers = (data.speakerIds || []).map((id) => profiles.get(id)).filter(Boolean);
  if (speakers.length === 0) {
    console.error(`skipped ${file}: no speaker profile`);
    continue;
  }
  if (speakers.length > 2) {
    console.error(`${file}: ${speakers.length} speakers, the card shows the first two`);
  }
  const [first, second] = speakers;
  rows.push({
    usecase: 'speaker',
    template: pickTemplate(Boolean(second)),
    formats: args.formats,
    badge: BADGE[data.type] || 'SPEAKER',
    talk: String(data.title || '').replace(/\s+/g, ' ').trim(),
    name: first.name,
    role: first.role || '',
    name2: second?.name || '',
    role2: second?.role || '',
    media: first.image || '',
    media2: second?.image || '',
  });
}

if (rows.length === 0) {
  console.error(`no talks found in ${dir}`);
  process.exit(1);
}

const escape = (value) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
const header = Object.keys(rows[0]);
const csv = [header.join(','), ...rows.map((r) => header.map((k) => escape(r[k])).join(','))].join('\n');

if (args.out) {
  await writeFile(args.out, `${csv}\n`);
  console.error(`${rows.length} rows in ${args.out}`);
} else {
  process.stdout.write(`${csv}\n`);
}
