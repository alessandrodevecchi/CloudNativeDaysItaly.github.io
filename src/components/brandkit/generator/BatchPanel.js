'use client';

// Pannello batch (solo studio): CSV + media → N card dalla stessa
// pipeline della preview. Output in una cartella scelta (File System
// Access API) o come download multipli.
import { useRef, useState } from 'react';
import { ArrowUpRight, Download, FileSpreadsheet, FolderOpen, Images, Play } from 'lucide-react';
import CopyButton from '@/components/brandkit/CopyButton';
import { renderCard } from './renderCard';
import { renderProCard } from './pro/renderProCard';
import { resolveFonts, ensureFontsLoaded } from './fonts';
import { cardFilename, parseCsv, rowToRenderState, shortSlug, slugify, CSV_TEMPLATE, CSV_TEMPLATE_PRO } from './batch';

// La strada consigliata è la skill di repo pilotata da un coding agent:
// questo pannello è la superficie che la skill guida, non l'interfaccia da
// usare a mano.
// Il link punta alla skill su main del repo dell'evento, come quello al
// design system in DsKit: risponde dal momento in cui questo codice è in main.
const SKILL_URL =
  'https://github.com/CloudNativeDaysItaly/CloudNativeDaysItaly.github.io/blob/main/.claude/skills/cnd-social-cards/SKILL.md';

const AGENT_PROMPTS = [
  {
    id: 'speakers',
    label: 'Speakers',
    text:
      'Generate the speaker social cards with the cnd-social-cards skill. Here is the list of accepted talks (paste the CSV, the Sessionize export or just the raw list), and the speaker photos are in <folder>. Pick a duo template when a talk has two speakers.',
  },
  {
    id: 'sponsors',
    label: 'Sponsors',
    text:
      'Generate the sponsor social cards with the cnd-social-cards skill. Logos are in <folder> and here are the badge labels per company (for example ACME: GOLD SPONSOR). Export every format.',
  },
];

async function loadMediaFile(file) {
  if (file.type === 'image/svg+xml') {
    const url = URL.createObjectURL(file);
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    return { source: img, width: img.naturalWidth || 300, height: img.naturalHeight || 300 };
  }
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  return { source: bitmap, width: bitmap.width, height: bitmap.height };
}

const toBlob = (canvas) =>
  new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

export default function BatchPanel() {
  const [rows, setRows] = useState([]);
  const [csvName, setCsvName] = useState(null);
  const [mediaByName, setMediaByName] = useState(new Map());
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [summary, setSummary] = useState(null);
  const csvInputRef = useRef(null);
  const mediaInputRef = useRef(null);

  const handleCsv = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setRows(parseCsv(await file.text()));
    setCsvName(file.name);
    setSummary(null);
  };

  const handleMedia = async (event) => {
    const files = [...(event.target.files || [])];
    event.target.value = '';
    const next = new Map(mediaByName);
    for (const file of files) {
      try {
        next.set(file.name, await loadMediaFile(file));
      } catch {
        // file illeggibile: verrà segnalato dalla riga che lo referenzia
      }
    }
    setMediaByName(next);
  };

  const downloadTemplate = (kind) => {
    const body = kind === 'pro' ? CSV_TEMPLATE_PRO : CSV_TEMPLATE;
    const url = URL.createObjectURL(new Blob([body], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = kind === 'pro' ? 'cnd-cards-template-pro.csv' : 'cnd-cards-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const run = async () => {
    if (rows.length === 0 || running) return;
    setRunning(true);
    setSummary(null);

    // cartella di output dove supportato, altrimenti download multipli
    let dirHandle = null;
    if (window.showDirectoryPicker) {
      try {
        dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
      } catch {
        setRunning(false);
        return; // picker annullato: non partire coi download a sorpresa
      }
    }

    const saveBlob = async (blob, filename) => {
      if (dirHandle) {
        const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      }
    };

    const fonts = resolveFonts();
    await ensureFontsLoaded(fonts);

    const errors = [];
    const notices = [];
    let generated = 0;
    const totalRows = rows.length;

    for (let i = 0; i < totalRows; i++) {
      setProgress(`Row ${i + 1}/${totalRows}…`);
      try {
        const { useCaseId, formats, state, pro, slugSource, slugExtra, notices: rowNotices = [] } = rowToRenderState(rows[i], mediaByName);
        rowNotices.forEach((notice) => notices.push(`Row ${i + 1}: ${notice}`));
        const slug = slugify(pro ? slugSource : state.texts.primary, `row-${i + 1}`);
        const extra = pro ? shortSlug(slugExtra) : '';
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
              fonts,
              options: pro.options,
            });
          } else {
            await renderCard(canvas, { ...state, format, fonts });
          }
          const blob = await toBlob(canvas);
          if (!blob) throw new Error('PNG encoding failed');
          const name = cardFilename({
            useCaseId,
            templateId: pro?.templateId,
            slug,
            extra,
            formatId: format.id,
          });
          await saveBlob(blob, name);
          generated++;
        }
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    setProgress(null);
    setRunning(false);
    setSummary({ generated, errors, notices, saved: dirHandle ? 'folder' : 'downloads' });
  };

  return (
    <div className='card-pop mt-16 bg-brand-yellow-light p-6 md:p-8'>
      <h2 className='font-display text-2xl uppercase text-ink'>Batch generation</h2>
      <p className='mt-2 max-w-2xl text-sm text-ink-muted'>
        Generate many cards at once from a CSV (one row per card) and the
        referenced photos or logos. Same rendering engine as the preview
        above.
      </p>

      {/* La strada consigliata, prima dei bottoni: comporre il CSV a mano è
          il fallback manuale */}
      <div className='mt-6 border-pop border-ink bg-white p-5'>
        <p className='font-display text-lg uppercase text-ink'>
          Quicker: ask a coding agent
        </p>
        <p className='mt-2 max-w-3xl text-sm text-ink-soft'>
          Writing the CSV by hand is the manual fallback, not the recommended
          way. This repository ships a skill and a command line script: hand
          your coding agent the raw list of talks or sponsors and the folder
          with the photos, and it prepares the CSV, renders every card without
          touching this panel and leaves the PNG files in a folder. It works
          for a single card too.
        </p>
        <div className='mt-4 flex flex-wrap items-center gap-3'>
          <a
            href={SKILL_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 text-sm font-bold text-brand-blue transition-colors hover:text-brand-magenta'
          >
            The cnd-social-cards skill
            <ArrowUpRight className='h-4 w-4' />
          </a>
          <span className='text-sm text-ink-muted'>
            To install it, ask your agent to read that file and add it to its
            skills.
          </span>
        </div>
        <div className='mt-4 space-y-3'>
          {AGENT_PROMPTS.map((prompt) => (
            <div key={prompt.id} className='border-2 border-ink bg-cream p-3'>
              <p className='text-xs font-bold uppercase tracking-widest text-ink-muted'>
                Prompt: {prompt.label}
              </p>
              <p className='mt-1 text-sm text-ink-soft'>{prompt.text}</p>
              <div className='mt-2'>
                <CopyButton text={prompt.text} label='Copy prompt' />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-6 flex flex-wrap items-center gap-3'>
        <button type='button' onClick={() => downloadTemplate('base')} className='btn-pop btn-pop-secondary inline-flex items-center !px-4 !py-1.5 text-sm'>
          <Download className='mr-2 h-4 w-4' /> CSV template
        </button>
        <button type='button' onClick={() => downloadTemplate('pro')} className='btn-pop btn-pop-secondary inline-flex items-center !px-4 !py-1.5 text-sm'>
          <Download className='mr-2 h-4 w-4' /> CSV template (speaker/sponsor)
        </button>
        <button type='button' onClick={() => csvInputRef.current?.click()} className='btn-pop btn-pop-secondary inline-flex items-center !px-4 !py-1.5 text-sm'>
          <FileSpreadsheet className='mr-2 h-4 w-4' />
          {csvName ? `${csvName} (${rows.length} rows)` : 'Upload CSV'}
        </button>
        <button type='button' onClick={() => mediaInputRef.current?.click()} className='btn-pop btn-pop-secondary inline-flex items-center !px-4 !py-1.5 text-sm'>
          <Images className='mr-2 h-4 w-4' />
          {mediaByName.size > 0 ? `${mediaByName.size} media files` : 'Upload photos / logos'}
        </button>
        <input ref={csvInputRef} type='file' accept='.csv,text/csv' onChange={handleCsv} className='hidden' />
        <input ref={mediaInputRef} type='file' accept='image/*' multiple onChange={handleMedia} className='hidden' />
      </div>

      <div className='mt-6'>
        <button
          type='button'
          onClick={run}
          disabled={rows.length === 0 || running}
          className='btn-pop btn-pop-primary inline-flex items-center disabled:cursor-not-allowed disabled:opacity-50'
        >
          {running ? (
            progress || 'Generating…'
          ) : (
            <>
              <Play className='mr-2 h-5 w-5' />
              Generate {rows.length > 0 ? `${rows.length} rows` : ''}
            </>
          )}
        </button>
        {typeof window !== 'undefined' && !window.showDirectoryPicker && rows.length > 0 && (
          <p className='mt-2 text-xs text-ink-muted'>
            <FolderOpen className='mr-1 inline h-3.5 w-3.5' />
            This browser cannot write to a folder: files will arrive as
            multiple downloads.
          </p>
        )}
      </div>

      {summary && (
        <div className='mt-6 border-pop border-ink bg-white p-4 text-sm'>
          <p className='font-bold text-ink'>
            {summary.generated} PNG generated ({summary.saved === 'folder' ? 'written to the chosen folder' : 'as downloads'}).
          </p>
          {summary.errors.length > 0 && (
            <ul className='mt-2 space-y-1 text-brand-magenta'>
              {summary.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
          {summary.notices?.length > 0 && (
            <ul className='mt-2 space-y-1 text-brand-blue'>
              {summary.notices.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
