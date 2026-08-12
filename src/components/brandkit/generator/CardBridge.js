'use client';

/*
 * Ponte tra il renderer delle card e la riga di comando.
 * Monta `window.__cndCards` e non fa nient'altro: nessun form, nessun click.
 * Chi lo usa è `scripts/social-cards.mjs`, che apre /brand-kit/card in un
 * browser headless, chiama questi metodi e scrive i PNG. Stesso motore della
 * preview, del download singolo e del pannello batch: un solo rendering da
 * mantenere.
 */

import { useEffect, useState } from 'react';
import { cardFilename, parseCsv, rowToRenderState, shortSlug, slugify } from './batch';
import { renderCard } from './renderCard';
import { renderProCard } from './pro/renderProCard';
import { resolveFonts, ensureFontsLoaded } from './fonts';

// Le foto arrivano come URL: quelle del sito sono già servite qui, quelle in
// una cartella locale le serve lo script su una porta temporanea.
async function loadMedia(name, mediaBase) {
  const url = /^(https?:|\/)/.test(name)
    ? name
    : `${mediaBase.replace(/\/$/, '')}/${encodeURIComponent(name)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`media "${name}" not found at ${url} (${response.status})`);
  const blob = await response.blob();
  if (blob.type === 'image/svg+xml') {
    // createImageBitmap su SVG non è affidabile ovunque: si passa da Image
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = objectUrl;
    });
    return { source: image, width: image.naturalWidth || 300, height: image.naturalHeight || 300 };
  }
  const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
  return { source: bitmap, width: bitmap.width, height: bitmap.height };
}

export default function CardBridge() {
  const [status, setStatus] = useState('loading fonts');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let fonts = null;

    const withFonts = async () => {
      if (!fonts) {
        fonts = resolveFonts();
        await ensureFontsLoaded(fonts);
      }
      return fonts;
    };

    const api = {
      version: 1,

      // Righe grezze del CSV, con le stesse regole del pannello batch
      rowsFromCsv(text) {
        return parseCsv(text);
      },

      // Una riga, tutti i formati che dichiara: PNG come data URL, il file lo
      // scrive lo script. Gli errori tornano come messaggio, non come throw
      // opaco attraverso il boundary del browser.
      async renderRow(row, options = {}) {
        const { mediaBase = '' } = options;
        try {
          const loadedFonts = await withFonts();
          const mediaByName = new Map();
          for (const name of [row.media, row.media2].filter(Boolean)) {
            if (mediaByName.has(name)) continue;
            mediaByName.set(name, await loadMedia(name, mediaBase));
          }

          const { useCaseId, formats, state, pro, slugSource, slugExtra, notices = [] } =
            rowToRenderState(row, mediaByName);
          const slug = slugify(pro ? slugSource : state.texts?.primary, 'card');
          const extra = pro ? shortSlug(slugExtra) : '';

          const files = [];
          for (const format of formats) {
            const canvas = document.createElement('canvas');
            if (pro) {
              await renderProCard(canvas, {
                kind: pro.kind,
                templateId: pro.templateId,
                data: pro.data,
                format,
                media: state.photo,
                media2: state.photo2,
                fonts: loadedFonts,
                options: pro.options,
              });
            } else {
              await renderCard(canvas, { ...state, format, fonts: loadedFonts });
            }
            files.push({
              filename: cardFilename({
                useCaseId,
                templateId: pro?.templateId,
                slug,
                extra,
                formatId: format.id,
              }),
              dataUrl: canvas.toDataURL('image/png'),
            });
            setPreview(canvas.toDataURL('image/png'));
          }
          return { files, notices };
        } catch (error) {
          return { files: [], notices: [], error: error?.message || String(error) };
        }
      },
    };

    withFonts()
      .then(() => {
        window.__cndCards = api;
        window.__cndCardsReady = true;
        setStatus('ready');
      })
      .catch((error) => {
        setStatus(`font loading failed: ${error?.message || error}`);
      });

    return () => {
      delete window.__cndCards;
      delete window.__cndCardsReady;
    };
  }, []);

  return (
    <div className='mx-auto max-w-[1200px] px-6 py-16'>
      <span className='stamp'>Machine only</span>
      <h1 className='section-heading mt-6'>Card renderer</h1>
      <p className='mt-4 max-w-2xl text-ink-muted'>
        This page has no interface on purpose: it exposes the card renderer to{' '}
        <code className='border border-ink bg-cream px-1.5 py-0.5 text-sm'>
          scripts/social-cards.mjs
        </code>
        , which drives it from the command line and writes the PNG files. Status:{' '}
        <span className='font-bold text-ink'>{status}</span>.
      </p>
      {preview && (
        <div className='card-pop mt-8 inline-block p-2'>
          {/* Ultima card resa, solo per capire a occhio cosa è uscito */}
          <img src={preview} alt='Last rendered card' className='block max-w-[420px]' />
        </div>
      )}
    </div>
  );
}
