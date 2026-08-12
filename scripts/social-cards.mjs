#!/usr/bin/env node
/*
 * Genera le card social senza passare dall'interfaccia.
 *
 * Il renderer delle card vive nel browser (canvas + font del sito), quindi lo
 * script apre la pagina di servizio /brand-kit/card in un browser headless,
 * le passa il CSV e scrive i PNG su disco. Nessun click, nessun upload:
 * l'unica cosa che serve è il sito in esecuzione (dev server o build servita).
 *
 * Uso:
 *   node scripts/social-cards.mjs --csv cards.csv [--photos ./foto] [--out DIR]
 *
 *   --csv     CSV delle card, stesse colonne del pannello batch (obbligatorio)
 *   --photos  cartella locale con foto e loghi citati nella colonna media.
 *             Serve solo per i file fuori dal sito: i percorsi che iniziano
 *             con / o con http vengono usati così come sono.
 *   --out     cartella di output. Senza, crea ~/Downloads/cnd-social-cards/batch-N
 *   --base    origine del sito (default http://localhost:3100)
 *   --keep    lascia il browser aperto alla fine (per guardare la pagina)
 *
 * Il CSV, i template e i nomi dei file sono documentati nella skill
 * .claude/skills/cnd-social-cards/SKILL.md
 */

import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright-core';

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

function parseArgs(argv) {
  const args = { base: 'http://localhost:3100' };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--keep') args.keep = true;
    else if (arg.startsWith('--')) args[arg.slice(2)] = argv[++i];
  }
  return args;
}

// Ogni run finisce in una sottocartella nuova: batch-1, batch-2, e così via.
async function nextBatchDir() {
  const root = path.join(homedir(), 'Downloads', 'cnd-social-cards');
  for (let n = 1; n < 10000; n++) {
    const candidate = path.join(root, `batch-${n}`);
    try {
      await stat(candidate);
    } catch {
      return candidate;
    }
  }
  throw new Error('too many batch folders in ~/Downloads/cnd-social-cards');
}

// Server statico temporaneo per la cartella delle foto: il browser non legge
// da file://, come nel resto del sito servono URL.
async function servePhotos(dir) {
  const root = path.resolve(dir);
  await stat(root);
  const server = createServer((req, res) => {
    // La pagina sta su un'altra origine (il sito): senza questo header il
    // browser blocca il fetch, e su una 404 senza header il messaggio che
    // arriva allo script è "Failed to fetch" invece del file mancante.
    const cors = { 'Access-Control-Allow-Origin': '*' };
    const name = decodeURIComponent((req.url || '').split('?')[0].replace(/^\//, ''));
    const target = path.resolve(root, name);
    if (!target.startsWith(root)) {
      res.writeHead(403, cors).end();
      return;
    }
    stat(target)
      .then(() => {
        res.writeHead(200, {
          ...cors,
          'Content-Type': MIME[path.extname(target).toLowerCase()] || 'application/octet-stream',
        });
        createReadStream(target).pipe(res);
      })
      .catch(() => {
        res.writeHead(404, cors).end();
      });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return { base: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(r)) };
}

// Lo slug viene dal soggetto (speaker o azienda): due talk dello stesso
// relatore genererebbero lo stesso nome e la seconda card cancellerebbe la
// prima. Alla collisione si aggiunge un numero.
async function freeFilename(dir, filename) {
  const ext = path.extname(filename);
  const stem = filename.slice(0, -ext.length);
  for (let n = 1; n < 1000; n++) {
    const candidate = n === 1 ? filename : `${stem}-${n}${ext}`;
    try {
      await stat(path.join(dir, candidate));
    } catch {
      return candidate;
    }
  }
  throw new Error(`cannot find a free name for ${filename}`);
}

async function launchBrowser() {
  // Chrome di sistema: playwright-core non scarica browser propri.
  try {
    return await chromium.launch({ channel: 'chrome' });
  } catch {
    return await chromium.launch();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.csv) {
    console.log(
      'Usage: node scripts/social-cards.mjs --csv cards.csv [--photos DIR] [--out DIR] [--base URL] [--keep]',
    );
    process.exit(args.help ? 0 : 1);
  }

  const csvText = await readFile(path.resolve(args.csv), 'utf8');
  const base = args.base.replace(/\/$/, '');

  // Meglio dirlo subito e chiaro che far morire il browser su una pagina vuota
  try {
    const probe = await fetch(`${base}/brand-kit/card`);
    if (!probe.ok) throw new Error(`status ${probe.status}`);
  } catch (error) {
    console.error(
      `The site is not answering at ${base} (${error.message}).\n` +
        'Start it with `npx next dev -p 3100` on a branch that has the generator, ' +
        'or point --base at a served build.',
    );
    process.exit(1);
  }

  const outDir = args.out ? path.resolve(args.out) : await nextBatchDir();
  await mkdir(outDir, { recursive: true });

  const photos = args.photos ? await servePhotos(args.photos) : null;
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const errors = [];
  const notices = [];
  let written = 0;

  try {
    await page.goto(`${base}/brand-kit/card`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction('window.__cndCardsReady === true', null, { timeout: 60000 });

    const rows = await page.evaluate((text) => window.__cndCards.rowsFromCsv(text), csvText);
    if (rows.length === 0) {
      console.error('The CSV has no rows.');
      process.exit(1);
    }
    console.log(`${rows.length} rows, output in ${outDir}`);

    for (let i = 0; i < rows.length; i++) {
      const label = `row ${i + 1}/${rows.length}`;
      const result = await page.evaluate(
        ([row, options]) => window.__cndCards.renderRow(row, options),
        [rows[i], { mediaBase: photos?.base || '' }],
      );
      if (result.error) {
        errors.push(`${label}: ${result.error}`);
        console.error(`  ${label}: ${result.error}`);
        continue;
      }
      for (const notice of result.notices) {
        notices.push(`${label}: ${notice}`);
        console.log(`  ${label}: ${notice}`);
      }
      for (const file of result.files) {
        const filename = await freeFilename(outDir, file.filename);
        if (filename !== file.filename) {
          const notice = `${file.filename} already existed, written as ${filename}`;
          notices.push(`${label}: ${notice}`);
          console.log(`  ${label}: ${notice}`);
        }
        await writeFile(
          path.join(outDir, filename),
          Buffer.from(file.dataUrl.split(',')[1], 'base64'),
        );
        written++;
        console.log(`  ${filename}`);
      }
    }
  } finally {
    if (!args.keep) await browser.close();
    if (photos) await photos.close();
  }

  console.log(`\n${written} PNG written to ${outDir}`);
  if (notices.length > 0) {
    console.log(`${notices.length} notices:`);
    notices.forEach((notice) => console.log(`  ${notice}`));
  }
  if (errors.length > 0) {
    console.log(`${errors.length} rows failed:`);
    errors.forEach((error) => console.log(`  ${error}`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
