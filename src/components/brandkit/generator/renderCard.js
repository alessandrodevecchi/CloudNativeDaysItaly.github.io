// Motore di rendering del card generator: un solo percorso canvas per
// preview ed export (la preview È il canvas, scalato via CSS).
// Nessuna dipendenza: anelli in arc() (dati da BrandRings), icone footer
// come Path2D con i tracciati lucide, testi con fit automatico.
import { COLORWAYS } from './formats';
import { LAYOUTS } from './layouts';
import { EVENT } from './event';

/* ── Asset cache (immagini decodificate una volta per sessione) ───── */
const imageCache = new Map();

function loadImage(src) {
  if (imageCache.has(src)) return imageCache.get(src);
  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
  imageCache.set(src, promise);
  return promise;
}

/* ── Logo a colori rifilato: il webp ha aria attorno, si ritaglia al
   bounding box dei pixel non trasparenti e non quasi-bianchi (in attesa
   di un SVG a colori rifilato da Alessandro) ─────────────────────────── */
let trimmedLogoPromise = null;

function loadTrimmedColorLogo() {
  if (trimmedLogoPromise) return trimmedLogoPromise;
  trimmedLogoPromise = loadImage('/images/logo.webp').then((img) => {
    const off = document.createElement('canvas');
    off.width = img.naturalWidth;
    off.height = img.naturalHeight;
    const octx = off.getContext('2d');
    octx.drawImage(img, 0, 0);
    const { data } = octx.getImageData(0, 0, off.width, off.height);
    let minX = off.width, minY = off.height, maxX = 0, maxY = 0;
    for (let y = 0; y < off.height; y++) {
      for (let x = 0; x < off.width; x++) {
        const i = (y * off.width + x) * 4;
        const solid = data[i + 3] > 16 &&
          !(data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245);
        if (solid) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX <= minX || maxY <= minY) return { source: img, width: img.naturalWidth, height: img.naturalHeight };
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const cropped = document.createElement('canvas');
    cropped.width = w;
    cropped.height = h;
    cropped.getContext('2d').drawImage(off, minX, minY, w, h, 0, 0, w, h);
    return { source: cropped, width: w, height: h };
  });
  return trimmedLogoPromise;
}

/* ── Anelli brand: composizione grande tricolore + satellite ─────────── */
const RING_COLORS = { blue: '#3069DE', magenta: '#F91B71', yellow: '#FBC430', white: '#FFFFFF' };

function ringAt(ctx, cx, cy, r, bands, bgColor) {
  const band = r / (bands.length + 1);
  bands.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r - band * i, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
  // foro centrale nel colore di sfondo
  ctx.beginPath();
  ctx.arc(cx, cy, r - band * bands.length, 0, Math.PI * 2);
  ctx.fillStyle = bgColor;
  ctx.fill();
}

// Con foto: anelli che sbucano da dietro (angolo basso-sinistra + alto-destra
// della foto). Senza foto: anello grande tagliato dal bordo destro + satellite,
// sempre sopra il footer. Le bande usano i colori brand della colorway
// (mai il colore di sfondo).
function drawRingsComposition(ctx, { W, unit, photoBox, footerTop, bg, ringColors }) {
  const [a, b] = ringColors || [RING_COLORS.yellow, RING_COLORS.magenta];
  const bigBands = [a, RING_COLORS.white, b, RING_COLORS.white, a];
  const smallBands = [b, RING_COLORS.white, a];

  if (photoBox) {
    const { x, y, size } = photoBox;
    const bigR = Math.round(unit * 0.13);
    let bigY = y + size * 0.94;
    if (bigY + bigR > footerTop - unit * 0.015) {
      bigY = footerTop - unit * 0.015 - bigR;
    }
    // centro spostato sotto la foto: l'anello non invade la colonna testo
    ringAt(ctx, x + size * 0.32, bigY, bigR, bigBands, bg);
    ringAt(ctx, x + size * 0.99, y + size * 0.05, Math.round(unit * 0.065), smallBands, bg);
  } else {
    const bigR = Math.round(unit * 0.19);
    const bigY = footerTop - bigR * 1.15;
    // quasi tutto oltre il bordo destro: resta fuori dalla zona testo
    ringAt(ctx, W + bigR * 0.05, bigY, bigR, bigBands, bg);
    ringAt(ctx, W - bigR * 0.75, bigY - bigR * 1.2, Math.round(unit * 0.07), smallBands, bg);
  }
}

/* ── Icone footer: tracciati lucide (viewBox 24, stroke 2, round) ───── */
const FOOTER_ICONS = {
  calendar: [
    { d: 'M8 2v4' },
    { d: 'M16 2v4' },
    { rect: [3, 4, 18, 18], rx: 2 },
    { d: 'M3 10h18' },
  ],
  pin: [
    { d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0' },
    { circle: [12, 10, 3] },
  ],
  globe: [
    { circle: [12, 12, 10] },
    { d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' },
    { d: 'M2 12h20' },
  ],
  linkedin: [
    { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' },
    { rect: [2, 9, 4, 12] },
    { circle: [4, 4, 2] },
  ],
};

function drawIcon(ctx, iconId, x, y, size, color) {
  const ops = FOOTER_ICONS[iconId];
  if (!ops) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const op of ops) {
    ctx.beginPath();
    if (op.d) {
      ctx.stroke(new Path2D(op.d));
    } else if (op.circle) {
      ctx.arc(op.circle[0], op.circle[1], op.circle[2], 0, Math.PI * 2);
      ctx.stroke();
    } else if (op.rect) {
      const [rx, ry, rw, rh] = op.rect;
      if (op.rx) ctx.roundRect(rx, ry, rw, rh, op.rx);
      else ctx.rect(rx, ry, rw, rh);
      ctx.stroke();
    }
  }
  ctx.restore();
}

/* ── Fit text ─────────────────────────────────────────────────────────
   Prima si riduce la size restando su una riga, fino al minimo che il
   formato dichiara (`headline.minScale`): il landscape ha poca altezza e
   scende molto, i verticali si fermano presto. Se non basta si concede una
   riga in più e si riparte dalla size piena, così sui formati alti il testo
   resta grande e va a capo. L'ellissi è l'ultima spiaggia: entro i limiti
   dei campi non deve mai servire. */
function fitText(ctx, text, { maxW, size, minSize, font, weight = '', maxLines = 2 }) {
  const setFont = (px) => { ctx.font = `${weight} ${px}px ${font}`.trim(); };
  const words = text.split(' ');

  // wrap greedy alla size data: righe prodotte e larghezza della peggiore
  const wrap = (px) => {
    setFont(px);
    const lines = [];
    let current = '';
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (!current || ctx.measureText(candidate).width <= maxW) current = candidate;
      else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    const widest = lines.reduce((max, line) => Math.max(max, ctx.measureText(line).width), 0);
    return { lines, widest };
  };

  // pavimento di size per ogni numero di righe consentito
  const floors = [minSize, Math.round(size * 0.55), Math.round(size * 0.42)];
  for (let allowed = 1; allowed <= maxLines; allowed++) {
    const floor = Math.max(floors[Math.min(allowed, floors.length) - 1], 12);
    let px = size;
    while (px >= floor) {
      const { lines, widest } = wrap(px);
      if (lines.length <= allowed && widest <= maxW) return { lines, px };
      px = Math.floor(px * 0.94);
    }
  }

  // ellissi sull'ultima riga consentita
  const floor = Math.max(floors[Math.min(maxLines, floors.length) - 1], 12);
  const { lines } = wrap(floor);
  setFont(floor);
  const kept = lines.slice(0, maxLines);
  let last = kept[kept.length - 1] || text;
  while (last.length > 1 && ctx.measureText(`${last}…`).width > maxW) last = last.slice(0, -1);
  kept[kept.length - 1] = `${last}…`;
  return { lines: kept, px: floor };
}

/* ── Footer: voci fisse icona+testo, a capo su due righe se non entra ── */
const FOOTER_ITEMS = [
  { icon: 'calendar', text: EVENT.date },
  { icon: 'pin', text: EVENT.city },
  { icon: 'globe', text: EVENT.website },
  { icon: 'linkedin', text: EVENT.social },
].filter((item) => item.text);

// Misura il footer prima del draw: anelli e blocco testo si ancorano
// sopra il suo bordo superiore per non collidere mai.
function measureFooter(ctx, W, layout, fonts) {
  const { size, icon, gap, y } = layout.footer;
  ctx.font = `600 ${size}px ${fonts.sans}`;
  const iconGap = Math.round(icon * 0.35);
  const widths = FOOTER_ITEMS.map(
    (item) => icon + iconGap + ctx.measureText(item.text).width,
  );
  const totalW = widths.reduce((a, b) => a + b, 0) + gap * (FOOTER_ITEMS.length - 1);
  const maxW = W - layout.pad * 2;
  const rows = totalW <= maxW ? [FOOTER_ITEMS] : [FOOTER_ITEMS.slice(0, 2), FOOTER_ITEMS.slice(2)];
  const rowH = Math.round(icon * 1.7);
  return { rows, rowH, iconGap, top: y - rows.length * rowH };
}

function drawFooter(ctx, layout, colors, fonts, metrics) {
  const { size, icon, gap, y } = layout.footer;
  const { rows, rowH, iconGap } = metrics;
  ctx.font = `600 ${size}px ${fonts.sans}`;
  rows.forEach((row, rowIndex) => {
    let x = layout.pad;
    const rowY = y - (rows.length - 1 - rowIndex) * rowH;
    for (const item of row) {
      const textW = ctx.measureText(item.text).width;
      drawIcon(ctx, item.icon, x, rowY - icon, icon, colors.icon || colors.text);
      ctx.fillStyle = colors.text;
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(item.text, x + icon + iconGap, rowY - icon * 0.18);
      x += icon + iconGap + textW + gap;
    }
  });
}

/* ── Media con cornice pop e hard shadow ─────────────────────────────
   Foto: crop cover con zoom, cornice quadrata o cerchio.
   Logo: contain su riquadro bianco bordato. `media` è normalizzato a
   { source, width, height } (bitmap o HTMLImageElement). */
function drawLogo(ctx, media, box, unit, frame) {
  const { x, y, size } = box;
  const border = Math.max(3, Math.round(unit * 0.006));
  const shadow = Math.round(unit * 0.014);
  const inner = Math.round(size * 0.12);

  ctx.fillStyle = frame;
  ctx.fillRect(x + shadow, y + shadow, size, size);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x, y, size, size);
  const scale = Math.min(
    (size - inner * 2) / media.width,
    (size - inner * 2) / media.height,
  );
  const w = media.width * scale;
  const h = media.height * scale;
  ctx.drawImage(media.source, x + (size - w) / 2, y + (size - h) / 2, w, h);
  ctx.strokeStyle = frame;
  ctx.lineWidth = border;
  ctx.strokeRect(x + border / 2, y + border / 2, size - border, size - border);
}

function drawPhoto(ctx, media, box, shape, zoom, offset, unit, frame) {
  const { x, y, size } = box;
  const photo = media.source;
  const border = Math.max(3, Math.round(unit * 0.006));
  const shadow = Math.round(unit * 0.014);

  // crop cover con zoom e pan: offset -1..1 sposta la finestra di ritaglio
  // dentro lo spazio disponibile (utile per centrare il soggetto,
  // soprattutto con foto verticali)
  const srcSize = Math.min(media.width, media.height) / Math.max(1, zoom);
  const ox = offset?.x || 0;
  const oy = offset?.y || 0;
  const sx = ((media.width - srcSize) / 2) * (1 + ox);
  const sy = ((media.height - srcSize) / 2) * (1 + oy);

  ctx.save();
  ctx.fillStyle = frame;
  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(x + size / 2 + shadow, y + size / 2 + shadow, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(photo, sx, sy, srcSize, srcSize, x, y, size, size);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2 - border / 2, 0, Math.PI * 2);
    ctx.strokeStyle = frame;
    ctx.lineWidth = border;
    ctx.stroke();
  } else {
    ctx.fillRect(x + shadow, y + shadow, size, size);
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.clip();
    ctx.drawImage(photo, sx, sy, srcSize, srcSize, x, y, size, size);
    ctx.restore();
    ctx.strokeStyle = frame;
    ctx.lineWidth = border;
    ctx.strokeRect(x + border / 2, y + border / 2, size - border, size - border);
  }
}

/* ── Render principale ───────────────────────────────────────────────── */
export async function renderCard(canvas, state) {
  const { format, headline, texts = {}, textStyles = {}, photo, mediaType = 'photo', photoShape, zoom, photoOffset, logoStyle, colorway, fonts, background } = state;
  const W = format.width;
  const H = format.height;
  const colors = COLORWAYS[colorway] || COLORWAYS.blue;
  const unit = Math.min(W, H);

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. sfondo: colorway piena; hook per i background del brand book (M3)
  if (background) {
    ctx.drawImage(background, 0, 0, W, H);
  } else {
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, W, H);
  }

  const layout = LAYOUTS[format.family](W, H, {
    hasPhoto: Boolean(photo),
    hasRole: Boolean(texts.secondary),
  });
  const footerMetrics = measureFooter(ctx, W, layout, fonts);

  // 2. decorazioni: anelli dietro la foto (se presente) o sul bordo destro,
  // sempre sopra il footer
  drawRingsComposition(ctx, {
    W,
    unit,
    photoBox: photo ? layout.photo : null,
    footerTop: footerMetrics.top,
    bg: colors.bg,
    ringColors: colors.rings,
  });

  // 3. logo CND: bianco, oppure a colori dentro un box effetto stamp
  // (bianco, bordo, hard shadow)
  const effectiveLogoStyle = logoStyle || (colors.logo === 'color' ? 'color' : 'white');
  try {
    if (effectiveLogoStyle === 'color') {
      const logo = await loadTrimmedColorLogo();
      const logoW = layout.logo.w;
      const logoH = logoW * (logo.height / logo.width || 0.32);
      const inner = Math.round(logoW * 0.07);
      const boxW = logoW + inner * 2;
      const boxH = logoH + inner * 2;
      const border = Math.max(3, Math.round(unit * 0.005));
      const shadow = Math.round(unit * 0.01);
      const frame = colors.frame || '#111111';
      ctx.fillStyle = frame === '#FFFFFF' ? '#111111' : frame;
      ctx.fillRect(layout.logo.x + shadow, layout.logo.y + shadow, boxW, boxH);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(layout.logo.x, layout.logo.y, boxW, boxH);
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = border;
      ctx.strokeRect(layout.logo.x + border / 2, layout.logo.y + border / 2, boxW - border, boxH - border);
      ctx.drawImage(logo.source, layout.logo.x + inner, layout.logo.y + inner, logoW, logoH);
    } else {
      const logo = await loadImage('/images/Logo_CND_W.svg');
      const logoW = layout.logo.w;
      const logoH = logoW * (logo.naturalHeight / logo.naturalWidth || 0.32);
      ctx.drawImage(logo, layout.logo.x, layout.logo.y, logoW, logoH);
    }
  } catch {
    // senza logo la card resta valida
  }

  // 4. media (opzionale: senza, il layout si è già adattato)
  if (photo && layout.photo) {
    if (mediaType === 'logo') {
      drawLogo(ctx, photo, layout.photo, unit, colors.frame || '#111111');
    } else {
      drawPhoto(ctx, photo, layout.photo, photoShape, zoom, photoOffset, unit, colors.frame || '#111111');
    }
  }

  // 5. blocco testo (headline + nome + ruolo): prima si misura tutto,
  // poi si disegna partendo da una Y che garantisce di restare sopra
  // il footer anche coi contenuti più lunghi
  const lineH = 1.02;
  ctx.textBaseline = 'top';

  const maxBottom = footerMetrics.top - Math.round(unit * 0.05);
  // Il blocco non sale oltre il logo e non scende sotto il footer: quello che
  // sta in mezzo è tutto lo spazio che ha.
  const logoBottom = layout.logo.y + Math.round(layout.logo.w * 0.4) + Math.round(unit * 0.05);
  // In 9:16 la foto sta sopra il testo, non a fianco: il blocco parte sotto
  // di lei, altrimenti un testo alto le finisce addosso.
  const photoBottom =
    photo && layout.photo && format.family === 'story'
      ? layout.photo.y + layout.photo.size + Math.round(unit * 0.04)
      : 0;
  const blockTopLimit = Math.max(logoBottom, photoBottom);
  const available = maxBottom - blockTopLimit;

  // Misura headline, nome ed extra a una data scala tipografica. Va rifatta
  // più volte: se il blocco non entra nello spazio disponibile si riduce la
  // scala e, come ultima spiaggia, il numero di righe concesse alla headline.
  const measureBlock = (scale, maxLines) => {
    const headlineSize = Math.max(Math.round(layout.headline.size * scale), 14);
    const nameSize = Math.max(Math.round(layout.name.size * scale), 12);
    const roleSize = Math.max(Math.round(layout.role.size * scale), 11);

    const headlineFits = headline.lines.map((line, i) => ({
      accent: i === headline.accentIndex,
      fit: fitText(ctx, line.toUpperCase(), {
        maxW: layout.headline.maxW,
        size: headlineSize,
        // Sotto questa soglia si va a capo invece di rimpicciolire ancora:
        // in landscape conviene ridurre, sui verticali c'è spazio per le righe.
        minSize: Math.round(headlineSize * (layout.headline.minScale ?? 0.5)),
        maxLines,
        font: fonts.display,
      }),
    }));
    const nameFit = texts.primary
      ? fitText(ctx, texts.primary, {
          maxW: layout.headline.maxW,
          size: nameSize,
          minSize: Math.round(nameSize * 0.6),
          font: fonts.sans,
          weight: '700',
        })
      : null;
    // Righe extra sotto il primario: testo semplice, chip bordata (es. tier
    // sponsor) o citazione in accent (es. titolo talk)
    const extras = [];
    for (const key of ['secondary', 'tertiary']) {
      const value = texts[key];
      if (!value) continue;
      const style = textStyles[key] || 'text';
      if (style === 'chip') {
        const chipPx = Math.round(roleSize * 0.85);
        ctx.font = `700 ${chipPx}px ${fonts.sans}`;
        extras.push({ style, value, px: chipPx, w: ctx.measureText(value.toUpperCase()).width, h: Math.round(chipPx * 2.1) });
      } else {
        const fit = fitText(ctx, style === 'quote' ? `“${value}”` : value, {
          maxW: layout.headline.maxW,
          size: roleSize,
          minSize: Math.round(roleSize * 0.6),
          font: fonts.sans,
          weight: style === 'quote' ? '600' : '400',
        });
        extras.push({ style, fit, h: fit.lines.length * Math.round(fit.px * 1.3) });
      }
    }

    const gap = Math.round(unit * 0.035 * scale);
    let blockH = 0;
    for (const { fit } of headlineFits) blockH += fit.lines.length * Math.round(fit.px * lineH);
    if (nameFit) blockH += gap + nameFit.lines.length * Math.round(nameFit.px * 1.25);
    for (const extra of extras) blockH += extra.h + Math.round(unit * 0.012);
    if (!nameFit && extras.length > 0) blockH += gap;
    return { headlineFits, nameFit, extras, blockH, gap };
  };

  let scale = 1;
  let maxLines = 3;
  let block = measureBlock(scale, maxLines);
  while (block.blockH > available) {
    if (scale > 0.62) scale = Math.round(scale * 940) / 1000;
    else if (maxLines > 1) {
      maxLines -= 1;
      scale = 1;
    } else break;
    block = measureBlock(scale, maxLines);
  }
  const { headlineFits, nameFit, extras, blockH, gap } = block;

  let cursorY;
  if (photo && layout.photo && format.family !== 'story') {
    // blocco testo centrato verticalmente rispetto al media
    const mediaCenter = layout.photo.y + layout.photo.size / 2;
    cursorY = Math.max(blockTopLimit, Math.min(mediaCenter - blockH / 2, maxBottom - blockH));
  } else {
    // Il blocco resta alla y del layout finché ci sta: più è alto, più sale,
    // e non passa mai sopra il limite (logo, o foto in 9:16). Il ciclo di
    // scala qui sopra garantisce che ci entri.
    cursorY = Math.max(blockTopLimit, Math.min(layout.headline.y, maxBottom - blockH));
  }

  for (const { accent, fit } of headlineFits) {
    ctx.font = `${fit.px}px ${fonts.display}`;
    ctx.fillStyle = accent ? colors.accent : colors.text;
    for (const l of fit.lines) {
      ctx.fillText(l, layout.headline.x, cursorY);
      cursorY += Math.round(fit.px * lineH);
    }
  }
  if (nameFit) {
    cursorY += gap;
    ctx.font = `700 ${nameFit.px}px ${fonts.sans}`;
    ctx.fillStyle = colors.text;
    for (const l of nameFit.lines) {
      ctx.fillText(l, layout.headline.x, cursorY);
      cursorY += Math.round(nameFit.px * 1.25);
    }
  }
  if (!nameFit && extras.length > 0) cursorY += gap;
  for (const extra of extras) {
    if (extra.style === 'chip') {
      const padX = Math.round(extra.px * 0.7);
      const chipW = extra.w + padX * 2;
      ctx.strokeStyle = colors.text;
      ctx.lineWidth = Math.max(2, Math.round(unit * 0.003));
      ctx.strokeRect(layout.headline.x, cursorY, chipW, extra.h);
      ctx.font = `700 ${extra.px}px ${fonts.sans}`;
      ctx.fillStyle = colors.text;
      ctx.fillText(extra.value.toUpperCase(), layout.headline.x + padX, cursorY + Math.round((extra.h - extra.px) / 2));
    } else {
      ctx.font = `${extra.style === 'quote' ? 'italic 600' : '400'} ${extra.fit.px}px ${fonts.sans}`;
      ctx.fillStyle = extra.style === 'quote' ? colors.accent : colors.text;
      let lineY = cursorY;
      for (const l of extra.fit.lines) {
        ctx.fillText(l, layout.headline.x, lineY);
        lineY += Math.round(extra.fit.px * 1.3);
      }
    }
    cursorY += extra.h + Math.round(unit * 0.012);
  }

  // 6. footer fisso con icone
  drawFooter(ctx, layout, colors, fonts, footerMetrics);
}
