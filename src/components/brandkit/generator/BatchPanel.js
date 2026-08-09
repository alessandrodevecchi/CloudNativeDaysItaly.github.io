'use client';

// Pannello batch (solo studio): CSV + media → N card dalla stessa
// pipeline della preview. Output in una cartella scelta (File System
// Access API) o come download multipli.
import { useRef, useState } from 'react';
import { Download, FileSpreadsheet, FolderOpen, Images, Play } from 'lucide-react';
import { renderCard } from './renderCard';
import { resolveFonts, ensureFontsLoaded } from './fonts';
import { parseCsv, rowToRenderState, slugify, CSV_TEMPLATE } from './batch';

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

  const downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob([CSV_TEMPLATE], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cnd-cards-template.csv';
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
    let generated = 0;
    const totalRows = rows.length;

    for (let i = 0; i < totalRows; i++) {
      setProgress(`Row ${i + 1}/${totalRows}…`);
      try {
        const { useCaseId, formats, state } = rowToRenderState(rows[i], mediaByName);
        const slug = slugify(state.texts.primary, `row-${i + 1}`);
        for (const format of formats) {
          const canvas = document.createElement('canvas');
          await renderCard(canvas, { ...state, format, fonts });
          const blob = await toBlob(canvas);
          if (!blob) throw new Error('PNG encoding failed');
          await saveBlob(blob, `cnd2027-${useCaseId}-${slug}-${format.id}.png`);
          generated++;
        }
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    setProgress(null);
    setRunning(false);
    setSummary({ generated, errors, saved: dirHandle ? 'folder' : 'downloads' });
  };

  return (
    <div className='card-pop mt-16 bg-brand-yellow-light p-6 md:p-8'>
      <h2 className='font-display text-2xl uppercase text-ink'>Batch generation</h2>
      <p className='mt-2 max-w-2xl text-sm text-ink-muted'>
        Generate many cards at once from a CSV (one row per card) and the
        referenced photos or logos. Same rendering engine as the preview
        above.
      </p>

      <div className='mt-6 flex flex-wrap items-center gap-3'>
        <button type='button' onClick={downloadTemplate} className='btn-pop btn-pop-secondary inline-flex items-center !px-4 !py-1.5 text-sm'>
          <Download className='mr-2 h-4 w-4' /> CSV template
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
        </div>
      )}
    </div>
  );
}
