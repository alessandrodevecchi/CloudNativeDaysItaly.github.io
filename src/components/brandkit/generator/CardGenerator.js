'use client';

// UI del card generator (sezione #generator di /brand-kit).
// Principio: minima frizione — default già validi, export in un click,
// funziona anche senza foto e senza campi compilati.
// La foto non lascia mai il browser: tutto client-side.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, ShieldCheck, Upload, X } from 'lucide-react';
import { FORMATS, DEFAULT_FORMAT_ID } from './formats';
import { publicUseCases, getUseCase } from './useCases';
import { renderCard } from './renderCard';

// Risolve le family effettive dei font brand dalle CSS variable di next/font,
// così il canvas usa gli stessi font del sito (e lo swap Anton→Extenda
// resterà trasparente).
function resolveFonts() {
  const styles = getComputedStyle(document.documentElement);
  const display = styles.getPropertyValue('--font-display').trim() || 'Anton';
  const sans = styles.getPropertyValue('--font-poppins').trim() || 'Poppins';
  return { display: `${display}, Anton, sans-serif`, sans: `${sans}, Poppins, sans-serif` };
}

async function ensureFontsLoaded(fonts) {
  try {
    await Promise.all([
      document.fonts.load(`80px ${fonts.display}`),
      document.fonts.load(`700 40px ${fonts.sans}`),
      document.fonts.load(`400 40px ${fonts.sans}`),
      document.fonts.ready,
    ]);
  } catch {
    // senza font caricati si disegna coi fallback di sistema
  }
}

const OptionChip = ({ selected, onClick, children }) => (
  <button
    type='button'
    onClick={onClick}
    className={
      selected
        ? 'border-pop border-ink bg-ink px-3 py-1 text-sm font-bold text-white'
        : 'border-pop border-ink bg-white px-3 py-1 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white'
    }
  >
    {children}
  </button>
);

export default function CardGenerator() {
  const useCases = publicUseCases();
  const [useCaseId, setUseCaseId] = useState(useCases[0].id);
  const useCase = getUseCase(useCaseId);

  const [headlineId, setHeadlineId] = useState(useCase.defaultHeadline);
  const [values, setValues] = useState({});
  const [formatId, setFormatId] = useState(DEFAULT_FORMAT_ID);
  const [photo, setPhoto] = useState(null);
  const [photoShape, setPhotoShape] = useState('square');
  const [zoom, setZoom] = useState(1);
  const [uploadError, setUploadError] = useState(null);
  const [colorwayId, setColorwayId] = useState(useCase.defaultColorway);

  const canvasRef = useRef(null);
  const fontsRef = useRef(null);
  const fileInputRef = useRef(null);

  // Preset use case da query param (?uc=...) per i link "Create yours"
  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get('uc');
    if (preset && getUseCase(preset)?.visibility === 'public') {
      setUseCaseId(preset);
    }
  }, []);

  // Cambio use case: preserva i valori dei campi con lo stesso id
  const switchUseCase = (id) => {
    const next = getUseCase(id);
    setUseCaseId(id);
    setHeadlineId(next.defaultHeadline);
    setColorwayId(next.defaultColorway);
    if (next.media?.type !== useCase.media?.type) {
      setPhoto(null);
      setZoom(1);
    }
  };

  const format = FORMATS.find((f) => f.id === formatId);
  const headline =
    useCase.headlines.find((h) => h.id === headlineId) || useCase.headlines[0];

  // Ridisegno a ogni cambio stato: unica pipeline preview/export
  const redraw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!fontsRef.current) {
      fontsRef.current = resolveFonts();
      await ensureFontsLoaded(fontsRef.current);
    }
    await renderCard(canvas, {
      format,
      headline,
      values,
      photo,
      photoShape,
      zoom,
      colorway: colorwayId,
      fonts: fontsRef.current,
    });
  }, [format, headline, values, photo, photoShape, zoom, colorwayId]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image (JPEG, PNG or WebP).');
      return;
    }
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      setPhoto(bitmap);
      setZoom(1);
      setUploadError(null);
    } catch {
      setUploadError('We could not read that image. Try another file.');
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cnd2027-${useCaseId}-${format.id}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className='mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start'>
      {/* Controlli */}
      <div className='card-pop bg-white p-6 md:p-8'>
        {useCases.length > 1 && (
          <div className='mb-6'>
            <p className='text-sm font-bold uppercase tracking-wide text-ink'>Card type</p>
            <div className='mt-2 flex flex-wrap gap-2'>
              {useCases.map((uc) => (
                <OptionChip key={uc.id} selected={uc.id === useCaseId} onClick={() => switchUseCase(uc.id)}>
                  {uc.label}
                </OptionChip>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className='text-sm font-bold uppercase tracking-wide text-ink'>Headline</p>
          <div className='mt-2 flex flex-wrap gap-2'>
            {useCase.headlines.map((h) => (
              <OptionChip key={h.id} selected={h.id === headline.id} onClick={() => setHeadlineId(h.id)}>
                {h.lines.join(' ')}
              </OptionChip>
            ))}
          </div>
        </div>

        <div className='mt-6 space-y-4'>
          {useCase.fields.map((field) => (
            <label key={field.id} className='block'>
              <span className='text-sm font-bold uppercase tracking-wide text-ink'>{field.label}</span>
              <input
                type='text'
                maxLength={field.max}
                placeholder={field.placeholder}
                value={values[field.id] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                className='mt-1 w-full border-pop border-ink bg-white px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue'
              />
            </label>
          ))}
        </div>

        {useCase.media && (
          <div className='mt-6'>
            <p className='text-sm font-bold uppercase tracking-wide text-ink'>{useCase.media.label}</p>
            <div className='mt-2 flex flex-wrap items-center gap-3'>
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                className='btn-pop btn-pop-secondary inline-flex items-center !px-4 !py-1.5 text-sm'
              >
                <Upload className='mr-2 h-4 w-4' />
                {photo ? 'Replace' : 'Upload'}
              </button>
              {photo && (
                <button
                  type='button'
                  onClick={() => setPhoto(null)}
                  className='inline-flex items-center gap-1 text-sm font-bold text-ink-muted hover:text-ink'
                >
                  <X className='h-4 w-4' /> Remove
                </button>
              )}
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleUpload}
                className='hidden'
              />
            </div>
            {uploadError && (
              <p className='mt-2 text-sm font-bold text-brand-magenta'>{uploadError}</p>
            )}
            {photo && (
              <div className='mt-4 space-y-3'>
                <div className='flex flex-wrap gap-2'>
                  <OptionChip selected={photoShape === 'square'} onClick={() => setPhotoShape('square')}>
                    Square
                  </OptionChip>
                  <OptionChip selected={photoShape === 'circle'} onClick={() => setPhotoShape('circle')}>
                    Circle
                  </OptionChip>
                </div>
                <label className='block'>
                  <span className='text-sm font-bold uppercase tracking-wide text-ink'>Zoom</span>
                  <input
                    type='range'
                    min='1'
                    max='2.5'
                    step='0.05'
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className='mt-1 w-full accent-brand-blue'
                  />
                </label>
              </div>
            )}
            <p className='mt-4 flex items-start gap-2 text-xs text-ink-muted'>
              <ShieldCheck className='mt-0.5 h-4 w-4 flex-shrink-0 text-brand-blue' />
              Your photo never leaves your device: the card is generated
              entirely in your browser.
            </p>
          </div>
        )}
      </div>

      {/* Preview + export */}
      <div>
        <div className='flex flex-wrap gap-2'>
          {FORMATS.map((f) => (
            <OptionChip key={f.id} selected={f.id === formatId} onClick={() => setFormatId(f.id)}>
              {f.label} {f.name}
            </OptionChip>
          ))}
        </div>
        <div className='card-pop mt-4 bg-white p-2'>
          <canvas
            ref={canvasRef}
            className='block h-auto w-full'
            aria-label='Card preview'
          />
        </div>
        <div className='mt-4'>
          <button
            type='button'
            onClick={handleDownload}
            className='btn-pop btn-pop-primary group inline-flex items-center'
          >
            <Download className='mr-2 h-5 w-5' />
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
