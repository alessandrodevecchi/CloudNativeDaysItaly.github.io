// Motore di rendering del card generator: un solo percorso canvas per
// preview ed export (la preview È il canvas, scalato via CSS).
// Nessuna dipendenza: anelli in arc() (dati da BrandRings), icone footer
// come Path2D con i tracciati lucide, testi con fit automatico.
import { COLORWAYS } from './formats';
import { LAYOUTS } from './layouts';

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

/* ── Fit text: riduci a step → wrap (max 2 righe) → ellissi ─────────── */
function fitText(ctx, text, { maxW, size, minSize, font, weight = '' }) {
  const setFont = (px) => { ctx.font = `${weight} ${px}px ${font}`.trim(); };
  let px = size;
  setFont(px);
  while (ctx.measureText(text).width > maxW && px > minSize) {
    px = Math.floor(px * 0.94);
    setFont(px);
  }
  if (ctx.measureText(text).width <= maxW) return { lines: [text], px };

  // wrap su due righe al px minimo
  const words = text.split(' ');
  if (words.length > 1) {
    let best = null;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(' ');
      const b = words.slice(i).join(' ');
      const w = Math.max(ctx.measureText(a).width, ctx.measureText(b).width);
      if (!best || w < best.w) best = { lines: [a, b], w };
    }
    if (best && best.w <= maxW) return { lines: best.lines, px };
  }

  // ellissi
  let cut = text;
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > maxW) {
    cut = cut.slice(0, -1);
  }
  return { lines: [`${cut}…`], px };
}

/* ── Footer: voci fisse icona+testo, a capo su due righe se non entra ── */
const FOOTER_ITEMS = [
  { icon: 'calendar', text: '20 May 2027' },
  { icon: 'pin', text: 'Bologna' },
  { icon: 'globe', text: 'cloudnativedaysitaly.org' },
  { icon: 'linkedin', text: '@cloudnativedaysitaly' },
];

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

function drawPhoto(ctx, media, box, shape, zoom, unit, frame) {
  const { x, y, size } = box;
  const photo = media.source;
  const border = Math.max(3, Math.round(unit * 0.006));
  const shadow = Math.round(unit * 0.014);

  // crop cover centrato con zoom
  const srcSize = Math.min(media.width, media.height) / Math.max(1, zoom);
  const sx = (media.width - srcSize) / 2;
  const sy = (media.height - srcSize) / 2;

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
  const { format, headline, texts = {}, photo, mediaType = 'photo', photoShape, zoom, colorway, fonts, background } = state;
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

  // 3. logo CND (variante bianca o a colori a seconda della colorway)
  try {
    const logo = await loadImage(
      colors.logo === 'color' ? '/images/logo.webp' : '/images/Logo_CND_W.svg',
    );
    const logoW = layout.logo.w;
    const logoH = logoW * (logo.naturalHeight / logo.naturalWidth || 0.32);
    ctx.drawImage(logo, layout.logo.x, layout.logo.y, logoW, logoH);
  } catch {
    // senza logo la card resta valida
  }

  // 4. media (opzionale: senza, il layout si è già adattato)
  if (photo && layout.photo) {
    if (mediaType === 'logo') {
      drawLogo(ctx, photo, layout.photo, unit, colors.frame || '#111111');
    } else {
      drawPhoto(ctx, photo, layout.photo, photoShape, zoom, unit, colors.frame || '#111111');
    }
  }

  // 5. blocco testo (headline + nome + ruolo): prima si misura tutto,
  // poi si disegna partendo da una Y che garantisce di restare sopra
  // il footer anche coi contenuti più lunghi
  const lineH = 1.02;
  ctx.textBaseline = 'top';

  const headlineFits = headline.lines.map((line, i) => ({
    accent: i === headline.accentIndex,
    fit: fitText(ctx, line.toUpperCase(), {
      maxW: layout.headline.maxW,
      size: layout.headline.size,
      minSize: Math.round(layout.headline.size * 0.5),
      font: fonts.display,
    }),
  }));
  const nameFit = texts.primary
    ? fitText(ctx, texts.primary, {
        maxW: layout.headline.maxW,
        size: layout.name.size,
        minSize: Math.round(layout.name.size * 0.6),
        font: fonts.sans,
        weight: '700',
      })
    : null;
  const roleFit =
    texts.primary && texts.secondary
      ? fitText(ctx, texts.secondary, {
          maxW: layout.headline.maxW,
          size: layout.role.size,
          minSize: Math.round(layout.role.size * 0.6),
          font: fonts.sans,
          weight: '400',
        })
      : null;

  let blockH = 0;
  for (const { fit } of headlineFits) blockH += fit.lines.length * Math.round(fit.px * lineH);
  if (nameFit) blockH += Math.round(unit * 0.035) + nameFit.lines.length * Math.round(nameFit.px * 1.25);
  if (roleFit) blockH += roleFit.lines.length * Math.round(roleFit.px * 1.3);

  const maxBottom = footerMetrics.top - Math.round(unit * 0.05);
  let cursorY = Math.min(layout.headline.y, maxBottom - blockH);
  if (photo && layout.photo && format.family !== 'story') {
    // blocco testo centrato verticalmente rispetto al media
    const mediaCenter = layout.photo.y + layout.photo.size / 2;
    const minTop = layout.logo.y + Math.round(layout.logo.w * 0.4) + Math.round(unit * 0.05);
    cursorY = Math.max(minTop, Math.min(mediaCenter - blockH / 2, maxBottom - blockH));
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
    cursorY += Math.round(unit * 0.035);
    ctx.font = `700 ${nameFit.px}px ${fonts.sans}`;
    ctx.fillStyle = colors.text;
    for (const l of nameFit.lines) {
      ctx.fillText(l, layout.headline.x, cursorY);
      cursorY += Math.round(nameFit.px * 1.25);
    }
  }
  if (roleFit) {
    ctx.font = `400 ${roleFit.px}px ${fonts.sans}`;
    ctx.fillStyle = colors.text;
    for (const l of roleFit.lines) {
      ctx.fillText(l, layout.headline.x, cursorY);
      cursorY += Math.round(roleFit.px * 1.3);
    }
  }

  // 6. footer fisso con icone
  drawFooter(ctx, layout, colors, fonts, footerMetrics);
}
