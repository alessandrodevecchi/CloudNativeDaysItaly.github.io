'use client';

// UI del card generator (sezione #generator di /brand-kit).
// Principio: minima frizione — default già validi, export in un click,
// funziona anche senza foto e senza campi compilati.
// La foto non lascia mai il browser: tutto client-side.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, ShieldCheck, Upload, X } from 'lucide-react';
import { FORMATS, DEFAULT_FORMAT_ID, COLORWAYS, COLORWAY_LABELS } from './formats';
import { publicUseCases, allUseCases, getUseCase } from './useCases';
import { renderCard } from './renderCard';
import { renderProCard, toSpeakerData, toSponsorData } from './pro/renderProCard';
import {
  SPEAKER_TEMPLATES,
  SPONSOR_TEMPLATES,
  SPONSOR_TIER_PRESETS,
  SPONSOR_BACKGROUNDS,
  SPONSOR_CORNERS,
  getSponsorTemplate,
} from './pro/registry';
import { EVENT } from './event';
import CopyButton from '../CopyButton';

import { resolveFonts, ensureFontsLoaded } from './fonts';

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

export default function CardGenerator({ scope = 'public' }) {
  const useCases = scope === 'all' ? allUseCases() : publicUseCases();
  const [useCaseId, setUseCaseId] = useState(useCases[0].id);
  const useCase = getUseCase(useCaseId);

  const [headlineId, setHeadlineId] = useState(useCase.defaultHeadline);
  const [values, setValues] = useState({});
  const [formatId, setFormatId] = useState(DEFAULT_FORMAT_ID);
  const [photo, setPhoto] = useState(null);
  // Seconda foto: solo per i template speaker duo (secondo relatore)
  const [photo2, setPhoto2] = useState(null);
  const [photoShape, setPhotoShape] = useState('square');
  const [zoom, setZoom] = useState(1);
  const [photoOffset, setPhotoOffset] = useState({ x: 0, y: 0 });
  const [logoStyle, setLogoStyle] = useState('white');
  const [customLines, setCustomLines] = useState(['Your text', 'here!']);
  // stato dei template pro (speaker/sponsor)
  const [proTemplateId, setProTemplateId] = useState(SPEAKER_TEMPLATES[0].id);
  const [tierPresetId, setTierPresetId] = useState(SPONSOR_TIER_PRESETS[0].id);
  const [sponsorBg, setSponsorBg] = useState(null);
  const [sponsorCorner, setSponsorCorner] = useState(null);
  const [customAccent, setCustomAccent] = useState(1);
  const [mediaKind, setMediaKind] = useState('photo');
  const [uploadError, setUploadError] = useState(null);
  const [colorwayId, setColorwayId] = useState(useCase.defaultColorway);

  const canvasRef = useRef(null);
  const fontsRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileInput2Ref = useRef(null);

  // Preset use case da query param (?uc=...) per i link "Create yours"
  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get('uc');
    const presetCase = preset && getUseCase(preset);
    if (presetCase && (scope === 'all' || presetCase.visibility === 'public')) {
      setUseCaseId(preset);
    }
  }, [scope]);

  // Cambio use case: preserva i valori dei campi con lo stesso id
  const switchUseCase = (id) => {
    const next = getUseCase(id);
    setUseCaseId(id);
    setHeadlineId(next.defaultHeadline);
    setColorwayId((current) =>
      next.colorways?.includes(current) ? current : next.defaultColorway,
    );
    if (next.pro) {
      const list = next.pro === 'sponsor' ? SPONSOR_TEMPLATES : SPEAKER_TEMPLATES;
      setProTemplateId(list[0].id);
      setSponsorBg(null);
      setSponsorCorner(null);
    }
    if (next.media?.type !== useCase.media?.type) {
      setPhoto(null);
      setZoom(1);
      setPhotoOffset({ x: 0, y: 0 });
    }
    setPhoto2(null);
  };

  // La colorway decide quali varianti logo sono possibili (es. su giallo il
  // logo bianco sparisce: solo versione a colori)
  const colorwayDef = COLORWAYS[colorwayId] || COLORWAYS.blue;
  const logoOptions = colorwayDef.logoOptions || ['white'];
  const effectiveLogoStyle = logoOptions.includes(logoStyle)
    ? logoStyle
    : colorwayDef.logo;

  const format = FORMATS.find((f) => f.id === formatId);
  // Campi generici per il renderer: primo campo = testo primario (bold),
  // gli altri diventano righe extra con lo stile dichiarato dal campo
  // (text, chip, quote). Il motore non conosce gli id dei campi.
  const texts = useMemo(
    () => ({
      primary: values[useCase.fields[0]?.id] || '',
      secondary: values[useCase.fields[1]?.id] || '',
      tertiary: values[useCase.fields[2]?.id] || '',
    }),
    [values, useCase],
  );
  const textStyles = useMemo(
    () => ({
      secondary: useCase.fields[1]?.style || 'text',
      tertiary: useCase.fields[2]?.style || 'text',
    }),
    [useCase],
  );
  const effectiveMediaType =
    useCase.media?.type === 'choice' ? mediaKind : useCase.media?.type;

  // Template pro: lista e stato derivato per lo use case corrente
  const proKind = useCase.pro || null;
  const proTemplates = proKind === 'sponsor' ? SPONSOR_TEMPLATES : SPEAKER_TEMPLATES;
  const proTemplate = proTemplates.find((tpl) => tpl.id === proTemplateId) || proTemplates[0];
  const tierPreset =
    SPONSOR_TIER_PRESETS.find((preset) => preset.id === tierPresetId) || SPONSOR_TIER_PRESETS[0];
  const proOptions = useMemo(
    () =>
      proKind === 'sponsor' && getSponsorTemplate(proTemplate.id).options?.tierPresets
        ? { bg: sponsorBg || tierPreset.bg, corner: sponsorCorner || tierPreset.corner }
        : {},
    [proKind, proTemplate, sponsorBg, sponsorCorner, tierPreset],
  );
  // Il duo si accende quando il template lo supporta e il secondo nome c'è:
  // solo allora ha senso chiedere la seconda foto.
  const duoActive = proKind === 'speaker' && Boolean(proTemplate.duo) && Boolean(values.name2);
  // `role2` ha senso solo quando il secondo relatore esiste ed è disegnato:
  // il campo `name2` resta sempre visibile, così si scopre che il duo esiste.
  const visibleFields = useCase.fields.filter((field) =>
    field.id === 'role2' ? duoActive : true,
  );
  // Se il template non disegna due relatori, il secondo non arriva nemmeno
  // al renderer: i valori restano nel form, la card resta coerente.
  const speakerValues = proTemplate.duo ? values : { ...values, name2: '', role2: '' };
  const proData =
    proKind === 'speaker'
      ? toSpeakerData(speakerValues, EVENT)
      : proKind === 'sponsor'
        ? toSponsorData(
            { ...values, tier: values.tier || tierPreset.tier },
            EVENT,
          )
        : null;
  const headline = useMemo(() => {
    if (!useCase.headlines) return { id: 'none', lines: [], accentIndex: -1 };
    if (useCase.customHeadline) {
      const lines = customLines.filter(Boolean);
      return {
        id: 'custom',
        lines: lines.length > 0 ? lines : ['Your text', 'here!'],
        accentIndex: customAccent,
      };
    }
    return useCase.headlines.find((h) => h.id === headlineId) || useCase.headlines[0];
  }, [useCase, customLines, customAccent, headlineId]);

  // Ridisegno a ogni cambio stato: unica pipeline preview/export
  const redraw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!fontsRef.current) {
      fontsRef.current = resolveFonts();
      await ensureFontsLoaded(fontsRef.current);
    }
    if (proKind) {
      await renderProCard(canvas, {
        kind: proKind,
        templateId: proTemplate.id,
        data: proData,
        format,
        media: photo,
        media2: duoActive ? photo2 : null,
        fonts: fontsRef.current,
        options: proOptions,
      });
      return;
    }
    await renderCard(canvas, {
      format,
      headline,
      texts,
      photo,
      mediaType: effectiveMediaType,
      textStyles,
      photoShape,
      zoom,
      photoOffset,
      logoStyle: effectiveLogoStyle,
      colorway: colorwayId,
      fonts: fontsRef.current,
    });
  }, [format, headline, texts, textStyles, photo, photo2, duoActive, photoShape, zoom, photoOffset, effectiveLogoStyle, colorwayId, effectiveMediaType, proKind, proTemplate, proData, proOptions]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Lettura del file in un oggetto { source, width, height } pronto per il
  // renderer. Usata dall'upload principale e da quello del secondo speaker.
  const readImageFile = async (file) => {
    if (file.type === 'image/svg+xml') {
      // createImageBitmap su SVG non è affidabile ovunque: si passa da Image
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
  };

  const handleUploadTo = async (event, setTarget, { resetView = false } = {}) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image (JPEG, PNG or WebP).');
      return;
    }
    try {
      setTarget(await readImageFile(file));
      if (resetView) {
        setZoom(1);
        setPhotoOffset({ x: 0, y: 0 });
      }
      setUploadError(null);
    } catch {
      setUploadError('We could not read that image. Try another file.');
    }
  };

  const handleUpload = (event) => handleUploadTo(event, setPhoto, { resetView: true });
  const handleUpload2 = (event) => handleUploadTo(event, setPhoto2);

  const saveBlob = (canvas, filename) =>
    new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(url);
        }
        resolve();
      }, 'image/png');
    });

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const name = proKind
      ? `cnd2027-${useCaseId}-${proTemplate.id}-${format.id}.png`
      : `cnd2027-${useCaseId}-${format.id}.png`;
    saveBlob(canvasRef.current, name);
  };

  // Tutti i formati in un click, con le impostazioni correnti: ogni formato
  // viene renderizzato su un canvas offscreen con la stessa pipeline.
  const handleDownloadAll = async () => {
    for (const f of FORMATS) {
      const offscreen = document.createElement('canvas');
      if (proKind) {
        await renderProCard(offscreen, {
          kind: proKind,
          templateId: proTemplate.id,
          data: proData,
          format: f,
          media: photo,
          media2: duoActive ? photo2 : null,
          fonts: fontsRef.current || resolveFonts(),
          options: proOptions,
        });
        await saveBlob(offscreen, `cnd2027-${useCaseId}-${proTemplate.id}-${f.id}.png`);
        continue;
      }
      await renderCard(offscreen, {
        format: f,
        headline,
        texts,
        photo,
        mediaType: effectiveMediaType,
        textStyles,
        photoShape,
        zoom,
        photoOffset,
        logoStyle: effectiveLogoStyle,
        colorway: colorwayId,
        fonts: fontsRef.current || resolveFonts(),
      });
      await saveBlob(offscreen, `cnd2027-${useCaseId}-${f.id}.png`);
    }
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

        {proKind && (
          <div className='mb-6'>
            <p className='text-sm font-bold uppercase tracking-wide text-ink'>Template</p>
            <div className='mt-2 flex flex-wrap gap-2'>
              {proTemplates.map((tpl) => (
                <OptionChip
                  key={tpl.id}
                  selected={tpl.id === proTemplate.id}
                  onClick={() => setProTemplateId(tpl.id)}
                >
                  {tpl.label}
                </OptionChip>
              ))}
            </div>
            {proKind === 'speaker' && values.name2 && !proTemplate.duo && (
              <p className='mt-2 text-xs font-bold text-brand-magenta'>
                This template shows one speaker only: pick Pop blue, Pop split
                or Comic panel for two speakers.
              </p>
            )}
            {proKind === 'sponsor' && proTemplate.options?.tierPresets && (
              <div className='mt-4 space-y-4'>
                <div>
                  <p className='text-sm font-bold uppercase tracking-wide text-ink'>Tier preset</p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {SPONSOR_TIER_PRESETS.map((preset) => (
                      <OptionChip
                        key={preset.id}
                        selected={preset.id === tierPresetId}
                        onClick={() => {
                          setTierPresetId(preset.id);
                          setSponsorBg(null);
                          setSponsorCorner(null);
                          setValues((v) => ({ ...v, tier: preset.tier }));
                        }}
                      >
                        {preset.label}
                      </OptionChip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className='text-sm font-bold uppercase tracking-wide text-ink'>Background</p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {SPONSOR_BACKGROUNDS.map((bg) => (
                      <OptionChip
                        key={bg.id}
                        selected={(sponsorBg || tierPreset.bg) === bg.id}
                        onClick={() => setSponsorBg(bg.id)}
                      >
                        {bg.label}
                      </OptionChip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className='text-sm font-bold uppercase tracking-wide text-ink'>Corner elements</p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {SPONSOR_CORNERS.map((corner) => (
                      <OptionChip
                        key={corner.id}
                        selected={(sponsorCorner || tierPreset.corner) === corner.id}
                        onClick={() => setSponsorCorner(corner.id)}
                      >
                        {corner.label}
                      </OptionChip>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!proKind && (
        <div>
          <p className='text-sm font-bold uppercase tracking-wide text-ink'>Headline</p>
          {useCase.customHeadline ? (
            <div className='mt-2 space-y-2'>
              {[0, 1].map((i) => (
                <input
                  key={i}
                  type='text'
                  maxLength={40}
                  placeholder={i === 0 ? 'First line' : 'Second line'}
                  value={customLines[i] || ''}
                  onChange={(e) =>
                    setCustomLines((lines) => {
                      const next = [...lines];
                      next[i] = e.target.value;
                      return next;
                    })
                  }
                  className='w-full border-pop border-ink bg-white px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue'
                />
              ))}
              <div className='flex flex-wrap items-center gap-2'>
                <span className='text-xs font-bold uppercase text-ink-muted'>Accent on</span>
                <OptionChip selected={customAccent === 0} onClick={() => setCustomAccent(0)}>Line 1</OptionChip>
                <OptionChip selected={customAccent === 1} onClick={() => setCustomAccent(1)}>Line 2</OptionChip>
              </div>
            </div>
          ) : (
            <div className='mt-2 flex flex-wrap gap-2'>
              {useCase.headlines.map((h) => (
                <OptionChip key={h.id} selected={h.id === headline.id} onClick={() => setHeadlineId(h.id)}>
                  {h.lines.join(' ')}
                </OptionChip>
              ))}
            </div>
          )}
        </div>
        )}

        <div className='mt-6 space-y-4'>
          {visibleFields.map((field) => (
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

        {!proKind && useCase.colorways?.length > 1 && (
          <div className='mt-6'>
            <p className='text-sm font-bold uppercase tracking-wide text-ink'>Color</p>
            <div className='mt-2 flex flex-wrap gap-2'>
              {useCase.colorways.map((cw) => (
                <OptionChip key={cw} selected={cw === colorwayId} onClick={() => setColorwayId(cw)}>
                  {COLORWAY_LABELS[cw] || cw}
                </OptionChip>
              ))}
            </div>
          </div>
        )}

        {!proKind && logoOptions.length > 1 && (
          <div className='mt-6'>
            <p className='text-sm font-bold uppercase tracking-wide text-ink'>CND logo</p>
            <div className='mt-2 flex flex-wrap gap-2'>
              <OptionChip selected={effectiveLogoStyle === 'white'} onClick={() => setLogoStyle('white')}>
                White
              </OptionChip>
              <OptionChip selected={effectiveLogoStyle === 'color'} onClick={() => setLogoStyle('color')}>
                Color
              </OptionChip>
            </div>
          </div>
        )}

        {useCase.media && (
          <div className='mt-6'>
            <p className='text-sm font-bold uppercase tracking-wide text-ink'>{useCase.media.label}</p>
            {useCase.media.type === 'choice' && (
              <div className='mt-2 flex flex-wrap gap-2'>
                <OptionChip selected={mediaKind === 'photo'} onClick={() => setMediaKind('photo')}>Photo</OptionChip>
                <OptionChip selected={mediaKind === 'logo'} onClick={() => setMediaKind('logo')}>Logo</OptionChip>
              </div>
            )}
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
            {duoActive && (
              <div className='mt-4 border-t-2 border-ink pt-4'>
                <p className='text-sm font-bold uppercase tracking-wide text-ink'>
                  Second speaker photo
                </p>
                <div className='mt-2 flex flex-wrap items-center gap-3'>
                  <button
                    type='button'
                    onClick={() => fileInput2Ref.current?.click()}
                    className='btn-pop btn-pop-secondary inline-flex items-center !px-4 !py-1.5 text-sm'
                  >
                    <Upload className='mr-2 h-4 w-4' />
                    {photo2 ? 'Replace' : 'Upload'}
                  </button>
                  {photo2 && (
                    <button
                      type='button'
                      onClick={() => setPhoto2(null)}
                      className='inline-flex items-center gap-1 text-sm font-bold text-ink-muted hover:text-ink'
                    >
                      <X className='h-4 w-4' /> Remove
                    </button>
                  )}
                  <input
                    ref={fileInput2Ref}
                    type='file'
                    accept='image/*'
                    onChange={handleUpload2}
                    className='hidden'
                  />
                </div>
                {!photo2 && (
                  <p className='mt-2 text-sm text-ink-muted'>
                    Without it, the first photo is used for both, with two different crops.
                  </p>
                )}
              </div>
            )}
            {uploadError && (
              <p className='mt-2 text-sm font-bold text-brand-magenta'>{uploadError}</p>
            )}
            {photo && !proKind && effectiveMediaType !== 'logo' && (
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
                <label className='block'>
                  <span className='text-sm font-bold uppercase tracking-wide text-ink'>Horizontal position</span>
                  <input
                    type='range'
                    min='-1'
                    max='1'
                    step='0.02'
                    value={photoOffset.x}
                    onChange={(e) => setPhotoOffset((o) => ({ ...o, x: Number(e.target.value) }))}
                    className='mt-1 w-full accent-brand-blue'
                  />
                </label>
                <label className='block'>
                  <span className='text-sm font-bold uppercase tracking-wide text-ink'>Vertical position</span>
                  <input
                    type='range'
                    min='-1'
                    max='1'
                    step='0.02'
                    value={photoOffset.y}
                    onChange={(e) => setPhotoOffset((o) => ({ ...o, y: Number(e.target.value) }))}
                    className='mt-1 w-full accent-brand-blue'
                  />
                </label>
              </div>
            )}
            <p className='mt-4 flex items-start gap-2 text-xs text-ink-muted'>
              <ShieldCheck className='mt-0.5 h-4 w-4 flex-shrink-0 text-brand-blue' />
              Your {effectiveMediaType === 'logo' ? 'logo' : 'photo'} never
              leaves your device: the card is generated entirely in your
              browser.
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
            className='mx-auto block h-auto max-h-[62vh] w-auto max-w-full'
            aria-label='Card preview'
          />
        </div>
        <div className='mt-4 flex flex-wrap gap-3'>
          <button
            type='button'
            onClick={handleDownload}
            className='btn-pop btn-pop-primary group inline-flex items-center'
          >
            <Download className='mr-2 h-5 w-5' />
            Download PNG
          </button>
          <button
            type='button'
            onClick={handleDownloadAll}
            className='btn-pop btn-pop-secondary inline-flex items-center'
          >
            <Download className='mr-2 h-5 w-5' />
            All formats
          </button>
        </div>
        {useCase.caption && (
          <div className='mt-6 border-pop border-ink bg-white p-4'>
            <p className='text-sm font-bold uppercase tracking-wide text-ink'>Suggested caption</p>
            <p className='mt-2 text-sm text-ink-soft'>{useCase.caption}</p>
            <div className='mt-3'>
              <CopyButton text={useCase.caption} label='Copy caption' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
