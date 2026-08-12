#!/usr/bin/env node
/*
 * Costruisce il CSV delle card sponsor dai dati del repo: legge i tier
 * dell'edizione e risolve nome e logo di ogni sponsor.
 *
 *   node scripts/sponsors-csv.mjs 2026 > sponsors.csv
 *   node scripts/sponsors-csv.mjs 2026 --formats all --out sponsors.csv
 *
 *   <anno>        file sotto src/config/editions (default 2026)
 *   --formats     come la colonna del CSV (default `1-1|9-16`, oppure `all`)
 *   --template    template sponsor (default `tier`)
 *   --out FILE    invece di stdout
 *
 * Poi: node scripts/social-cards.mjs --csv sponsors.csv
 */

import matter from 'gray-matter';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// tier del sito → etichetta completa del badge + preset visivo del template
const TIERS = {
  main: ['MAIN SPONSOR', 'main'],
  platinum: ['PLATINUM SPONSOR', 'platinum'],
  gold: ['GOLD SPONSOR', 'gold'],
  silver: ['SILVER SPONSOR', 'silver'],
  smart: ['SMART SPONSOR', 'smart'],
  workshop: ['WORKSHOP SPONSOR', 'workshop'],
  techPartner: ['TECH PARTNER', 'silver'],
  partner: ['COMMUNITY PARTNER', 'smart'],
};

function parseArgs(argv) {
  const args = { year: '2026', formats: '1-1|9-16', template: 'tier' };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[++i];
    else rest.push(argv[i]);
  }
  if (rest[0]) args.year = rest[0];
  return args;
}

const args = parseArgs(process.argv.slice(2));
const edition = JSON.parse(
  await readFile(path.join('src/config/editions', `${args.year}.json`), 'utf8'),
);

const rows = [];
for (const [tier, ids] of Object.entries(edition.sponsors || {})) {
  const [badge, preset] = TIERS[tier] || [tier.replace(/([A-Z])/g, ' $1').toUpperCase(), 'gold'];
  for (const id of ids) {
    let data = {};
    try {
      ({ data } = matter(await readFile(path.join('src/config/sponsors', `${id}.md`), 'utf8')));
    } catch {
      console.error(`skipped ${id}: no file in src/config/sponsors`);
      continue;
    }
    rows.push({
      usecase: 'sponsor',
      template: args.template,
      formats: args.formats,
      org: data.name || id,
      tier: badge,
      preset,
      bg: '',
      corner: '',
      media: data.logo || '',
    });
  }
}

if (rows.length === 0) {
  console.error(`no sponsors in src/config/editions/${args.year}.json`);
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
