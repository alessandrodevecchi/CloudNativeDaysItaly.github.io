/* Helpers di disegno dei template pro (porting 1:1 da
   cnd-generator/experiments/helpers.js, handoff 2026-08-11).
   Differenza dall'originale: FONT viene inizializzato a runtime dalle
   CSS variable di next/font via initProFonts() (swap Anton→Extenda
   trasparente); tutte le primitive sono esportate. */

export const C = {
  blue: '#3069DE',
  blueDark: '#2452B8',
  blueLight: '#5A8AE8',
  magenta: '#F91B71',
  magentaDark: '#C9145B',
  yellow: '#FBC430',
  yellowLight: '#FADD64',
  ink: '#111111',
  cream: '#FDF6E3',
  white: '#FFFFFF',
  orange: '#F9862B',
};

export const FONT = {
  display: '"Anton", sans-serif',
  sans: '"Poppins", sans-serif',
};

// Da chiamare prima del primo render coi font risolti da resolveFonts()
export function initProFonts(fonts) {
  FONT.display = fonts.display;
  FONT.sans = fonts.sans;
}

/* ── Sfondo a piani sfaccettati (linguaggio sponsor 2026) ─────────────
   Base piena + poligoni traslucidi che si incrociano. `angle` ruota
   l'intera composizione: stesso sfondo, infinite varianti. */
export function facets(ctx, W, H, palette, angle = 0, alpha = 0.35) {
  ctx.save();
  ctx.fillStyle = palette[0];
  ctx.fillRect(0, 0, W, H);
  ctx.translate(W / 2, H / 2);
  ctx.rotate(angle);
  ctx.translate(-W / 2, -H / 2);
  const D = Math.max(W, H) * 1.6;
  const polys = [
    [[-0.2, -0.1], [0.55, -0.2], [0.4, 0.6], [-0.1, 0.75]],
    [[0.45, -0.15], [1.2, 0.05], [1.1, 0.8], [0.6, 0.55]],
    [[-0.15, 0.5], [0.5, 0.35], [0.75, 1.15], [0.05, 1.2]],
    [[0.3, -0.25], [0.85, -0.15], [0.6, 0.45]],
    [[0.55, 0.6], [1.25, 0.45], [1.15, 1.25], [0.5, 1.15]],
  ];
  polys.forEach((poly, i) => {
    ctx.beginPath();
    poly.forEach(([px, py], j) => {
      const x = (px - 0.5) * D + W / 2;
      const y = (py - 0.5) * D + H / 2;
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = palette[(i % (palette.length - 1)) + 1];
    ctx.fill();
    ctx.globalAlpha = 1;
  });
  ctx.restore();
}

/* ── Sunburst comic (linguaggio speaker 2026) ────────────────────────── */
export function sunburst(ctx, W, H, base, ray, cx = 0.5, cy = 0.5, rays = 36) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);
  const ox = W * cx;
  const oy = H * cy;
  const R = Math.hypot(W, H) * 1.2;
  ctx.save();
  ctx.fillStyle = ray;
  for (let i = 0; i < rays; i++) {
    if (i % 2 === 0) continue;
    const a0 = (i / rays) * Math.PI * 2;
    const a1 = ((i + 0.6) / rays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.arc(ox, oy, R, a0, a1);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/* ── Slab comic: banda bianca diagonale con bordo ink ────────────────── */
export function comicSlab(ctx, x0, y0, x1, y1, thickness, taper = 0.5) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const t0 = thickness;
  const t1 = thickness * taper;
  const pts = [
    [x0 + nx * t0, y0 + ny * t0],
    [x1 + nx * t1, y1 + ny * t1],
    [x1 - nx * t1, y1 - ny * t1],
    [x0 - nx * t0, y0 - ny * t0],
  ];
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = C.ink;
  ctx.save();
  ctx.translate(6, 6);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = C.white;
  ctx.fill();
}

/* ── Halftone patch: griglia di punti in dissolvenza ─────────────────── */
export function halftone(ctx, x, y, w, h, color, { step = 26, maxR = 7, fade = 'x' } = {}) {
  ctx.save();
  ctx.fillStyle = color;
  for (let py = 0; py < h; py += step) {
    for (let px = 0; px < w; px += step) {
      const t = fade === 'x' ? 1 - px / w : fade === 'y' ? 1 - py / h : 1;
      const r = maxR * Math.max(0.15, t);
      ctx.beginPath();
      ctx.arc(x + px + ((py / step) % 2) * (step / 2), y + py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/* ── Anello multibanda ───────────────────────────────────────────────── */
export function ring(ctx, cx, cy, r, bands, holeColor) {
  const band = r / (bands.length + 1);
  bands.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r - band * i, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
  ctx.beginPath();
  ctx.arc(cx, cy, r - band * bands.length, 0, Math.PI * 2);
  ctx.fillStyle = holeColor;
  ctx.fill();
}

/* ── Testo comic: fill + stroke spesso (con offset stile fumetto) ────── */
export function comicText(ctx, text, x, y, { size, font = FONT.sans, weight = 700, fill = C.white, stroke = C.ink, strokeW = 0.14, align = 'left' } = {}) {
  ctx.save();
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round';
  ctx.lineWidth = size * strokeW;
  ctx.strokeStyle = stroke;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/* ── Foto tonda con anelli concentrici (stile 2026) ──────────────────── */
export function roundPhoto(ctx, img, cx, cy, r, bands) {
  bands.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r + bands.slice(i).reduce((acc, _, j) => acc + bands[i + j].w, 0), 0, Math.PI * 2);
    ctx.fillStyle = color.c;
    ctx.fill();
  });
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  const s = Math.min(img.width, img.height);
  ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

/* ── Foto quadrata pop (design system 2027) ──────────────────────────── */
export function popPhoto(ctx, img, x, y, size, { frame = C.ink, shadow = 16, border = 8, zoom = 1, rot = 0, fx = 0.5, fy = 0.5 } = {}) {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate(rot);
  ctx.translate(-size / 2, -size / 2);
  ctx.fillStyle = frame;
  ctx.fillRect(shadow, shadow, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, size, size);
  ctx.clip();
  const s = Math.min(img.width, img.height) / zoom;
  ctx.drawImage(img, (img.width - s) * fx, (img.height - s) * fy, s, s, 0, 0, size, size);
  ctx.restore();
  ctx.strokeStyle = frame;
  ctx.lineWidth = border;
  ctx.strokeRect(border / 2, border / 2, size - border, size - border);
  ctx.restore();
}

/* ── Angolo bauhaus: griglia di celle geometriche (sponsor 2026) ─────── */
export function bauhausCorner(ctx, x, y, cols, rows, cell, palette, mirror = false) {
  const shapes = ['leaf', 'circle', 'quarter', 'star', 'ringcell', 'halfmoon'];
  ctx.save();
  ctx.translate(x, y);
  if (mirror) {
    ctx.scale(-1, -1);
    ctx.translate(-cols * cell, -rows * cell);
  }
  let k = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 3 === 2) { k++; continue; }
      const px = c * cell;
      const py = r * cell;
      const bg = palette[k % palette.length];
      const fg = palette[(k + 2) % palette.length];
      const shape = shapes[(k + r) % shapes.length];
      ctx.fillStyle = bg;
      ctx.fillRect(px, py, cell, cell);
      ctx.fillStyle = fg;
      const half = cell / 2;
      if (shape === 'leaf') {
        ctx.beginPath();
        ctx.arc(px + half, py, half, 0, Math.PI / 2);
        ctx.arc(px + half, py + cell, half, Math.PI, Math.PI * 1.5);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(px + half, py);
        ctx.arc(px + half, py, half, Math.PI / 2, Math.PI);
        ctx.arc(px + half, py + cell, half, Math.PI * 1.5, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      } else if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(px + half, py + half, half * 0.72, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === 'quarter') {
        ctx.beginPath();
        ctx.moveTo(px, py + cell);
        ctx.arc(px, py + cell, cell, -Math.PI / 2, 0);
        ctx.closePath();
        ctx.fill();
      } else if (shape === 'star') {
        const cx2 = px + half;
        const cy2 = py + half;
        const R = half * 0.85;
        const rr = R * 0.28;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4 - Math.PI / 2;
          const rad = i % 2 === 0 ? R : rr;
          const sx = cx2 + Math.cos(a) * rad;
          const sy = cy2 + Math.sin(a) * rad;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
      } else if (shape === 'ringcell') {
        ctx.beginPath();
        ctx.arc(px + half, py + half, half * 0.72, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(px + half, py + half, half * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(px + half, py + cell, half, Math.PI, Math.PI * 2);
        ctx.fill();
      }
      k++;
    }
  }
  ctx.restore();
}

/* ── Pizza slice sticker (richiamo al logo) ──────────────────────────── */
export function pizzaSlice(ctx, x, y, size, rot = -0.4) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.09;
  ctx.strokeStyle = C.ink;
  // punta
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, -size * 0.32);
  ctx.lineTo(size * 0.52, -size * 0.1);
  ctx.lineTo(-size * 0.22, size * 0.52);
  ctx.closePath();
  ctx.fillStyle = C.yellowLight;
  ctx.fill();
  ctx.stroke();
  // crosta
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, -size * 0.32);
  ctx.lineTo(size * 0.52, -size * 0.1);
  ctx.lineTo(size * 0.44, size * 0.05);
  ctx.lineTo(-size * 0.48, -size * 0.18);
  ctx.closePath();
  ctx.fillStyle = C.magenta;
  ctx.fill();
  ctx.stroke();
  // condimenti
  ctx.fillStyle = C.yellow;
  [[-0.15, 0.05], [0.1, 0.12], [-0.25, 0.25]].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(size * dx, size * dy, size * 0.07, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

/* ── Stamp (design system 2027): box bianco bordato, ombra, rotazione.
   Il testo è centrato verticalmente con le metriche reali del glifo
   (Anton ha ascent alto: textBaseline middle lo fa sedere troppo su). ── */
export function stamp(ctx, text, x, y, { size, rot = -0.04, fill = C.white, color = C.ink, pad = 0.5, padY = 0.25 } = {}) {
  ctx.save();
  ctx.font = `${size}px ${FONT.display}`;
  ctx.textBaseline = 'alphabetic'; // le metriche di measureText dipendono dalla baseline corrente
  const m = ctx.measureText(text);
  const w = m.width + size * pad * 2;
  const h = size * (1 + padY * 2);
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = C.ink;
  ctx.fillRect(10, 10, w, h);
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 5;
  ctx.strokeRect(2.5, 2.5, w - 5, h - 5);
  ctx.fillStyle = color;
  ctx.fillText(text, size * pad, h / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2);
  ctx.restore();
  return { w, h };
}

/* ── Larghezza di uno stamp senza disegnarlo (per posizionare stamp
   con testo PERSONALIZZABILE: mai stimare dalla lunghezza stringa) ──── */
export function stampWidth(ctx, text, size, pad = 0.5) {
  ctx.save();
  ctx.font = `${size}px ${FONT.display}`;
  const w = ctx.measureText(text).width + size * pad * 2;
  ctx.restore();
  return w;
}

/* ── Pizza slice: accompagna un testo, a fianco o puntandolo ─────────
   Uso 2026: sta accanto a un testo (data/luogo, tier sponsor) e la
   PUNTA (il vertice giallo opposto alla crosta magenta) guarda il
   testo. Asset: "pizza slice icon pointing right.svg", già orientato
   con la punta ESATTAMENTE a destra e centrato → nativeTip = 0. */
export function pizzaPoint(ctx, el, x, y, w, tx, ty) {
  const rot = Math.atan2(ty - y, tx - x);
  drawEl(ctx, el, x, y, w, rot);
}

/* ── Titolo display: wrap + shrink finché entra in maxW × maxLines.
   Ultima riga in colore accent. Ritorna la y sotto l'ultima riga. ───── */
export function fitDisplayLines(ctx, text, { maxW, size, maxLines = 2, minSize = 40, font = FONT.display, weight = '', caps = true } = {}) {
  const words = (caps ? text.toUpperCase() : text).split(/\s+/);
  let px = size;
  const wrap = () => {
    ctx.font = `${weight} ${px}px ${font}`.trim();
    const lines = [];
    let cur = '';
    for (const word of words) {
      const cand = cur ? `${cur} ${word}` : word;
      if (!cur || ctx.measureText(cand).width <= maxW) cur = cand;
      else { lines.push(cur); cur = word; }
    }
    lines.push(cur);
    return lines;
  };
  let lines = wrap();
  while (px > minSize && (lines.length > maxLines || lines.some((l) => ctx.measureText(l).width > maxW))) {
    px -= 2;
    lines = wrap();
  }
  return { lines, size: px };
}

export function drawDisplayTitle(ctx, text, x, y, { maxW, size, maxLines = 2, lineH = 1.05, colors = [C.white, C.yellow] } = {}) {
  const fit = fitDisplayLines(ctx, text, { maxW, size, maxLines });
  ctx.font = `${fit.size}px ${FONT.display}`;
  ctx.textBaseline = 'top';
  fit.lines.forEach((line, i) => {
    ctx.fillStyle = i === fit.lines.length - 1 ? colors[colors.length - 1] : colors[0];
    ctx.fillText(line, x, y + i * fit.size * lineH);
  });
  return y + fit.lines.length * fit.size * lineH;
}

/* ── Blocco speaker (1 o 2 relatori): nome + ruoli.
   layout 'columns': relatori affiancati; 'rows': impilati (più spazio
   per nomi lunghi). Nomi e ruoli hanno la STESSA size per tutti i
   relatori (il più lungo comanda). Ritorna la y sotto il blocco. ────── */
export function drawSpeakersBlock(ctx, speakers, x, y, { nameSize = 50, nameColor = C.magenta, roleColor = C.white, roleSize = 28, maxW, gap = 14, layout = 'columns' } = {}) {
  ctx.textBaseline = 'top';
  const cols = speakers.length > 1 && layout === 'columns';
  const colW = cols ? (maxW - 40) / speakers.length : maxW;
  // size uniformi tra TUTTI i relatori
  let namePx = nameSize;
  speakers.forEach((sp) => {
    ctx.font = `700 ${namePx}px ${FONT.sans}`;
    while (ctx.measureText(sp.name).width > colW && namePx > 26) {
      namePx -= 1;
      ctx.font = `700 ${namePx}px ${FONT.sans}`;
    }
  });
  let rolePx = roleSize;
  speakers.forEach((sp) => (sp.roles || []).forEach((role) => {
    ctx.font = `400 ${rolePx}px ${FONT.sans}`;
    while (ctx.measureText(role).width > colW && rolePx > 16) {
      rolePx -= 1;
      ctx.font = `400 ${rolePx}px ${FONT.sans}`;
    }
  }));
  let rowY = y;
  let maxBottom = y;
  speakers.forEach((sp, idx) => {
    const cx = x + (cols ? idx * (colW + 40) : 0);
    let cy = cols ? y : rowY;
    ctx.font = `700 ${namePx}px ${FONT.sans}`;
    ctx.fillStyle = nameColor;
    ctx.fillText(sp.name, cx, cy);
    cy += namePx * 1.3;
    ctx.font = `400 ${rolePx}px ${FONT.sans}`;
    ctx.fillStyle = roleColor;
    (sp.roles || []).forEach((role) => {
      ctx.fillText(role, cx, cy);
      cy += rolePx * 1.35;
    });
    rowY = cy + 12;
    maxBottom = Math.max(maxBottom, cy);
  });
  return (cols ? maxBottom : maxBottom) + gap;
}

/* ── Background SVG (facets vettoriali): carica con ricolorazione.
   `recolor` mappa hex → hex sul sorgente SVG prima del load, così lo
   stesso file genera più combinazioni di colori (nel generatore sarà
   un selettore). ─────────────────────────────────────────────────────── */
export async function loadBgSvg(src, recolor = {}) {
  const txt = await (await fetch(src)).text();
  let out = txt;
  Object.entries(recolor).forEach(([from, to]) => {
    out = out.split(from).join(to);
  });
  const url = URL.createObjectURL(new Blob([out], { type: 'image/svg+xml' }));
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/* ── Logo CND ────────────────────────────────────────────────────────── */
export function drawLogoWhite(ctx, img, x, y, w) {
  const h = w * (img.naturalHeight / img.naturalWidth || 0.32);
  ctx.drawImage(img, x, y, w, h);
  return h;
}

export function drawLogoStampBox(ctx, img, x, y, w) {
  const ratio = img.naturalHeight / img.naturalWidth || 0.32;
  const h = w * ratio;
  const pad = w * 0.09;
  ctx.fillStyle = C.ink;
  ctx.fillRect(x + 8, y + 8, w + pad * 2, h + pad * 2);
  ctx.fillStyle = C.white;
  ctx.fillRect(x, y, w + pad * 2, h + pad * 2);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 5;
  ctx.strokeRect(x + 2.5, y + 2.5, w + pad * 2 - 5, h + pad * 2 - 5);
  ctx.drawImage(img, x + pad, y + pad, w, h);
}

/* ── Asset SVG "veri" (elements/): carica, rasterizza una volta su canvas
   offscreen e calcola il bounding box del contenuto (gli SVG condividono
   la stessa artboard 375×383 con molto vuoto attorno). ─────────────────── */
export async function loadEl(src, rasterW = 900, recolor = null) {
  let url = src;
  if (recolor) {
    // ricolorazione hex→hex sul sorgente SVG (come loadBgSvg)
    const txt = await (await fetch(src)).text();
    let out = txt;
    Object.entries(recolor).forEach(([from, to]) => {
      out = out.split(from).join(to);
    });
    url = URL.createObjectURL(new Blob([out], { type: 'image/svg+xml' }));
  }
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = url;
  });
  const ratio = img.naturalHeight / img.naturalWidth;
  const cw = rasterW;
  const ch = Math.round(rasterW * ratio);
  const cv = document.createElement('canvas');
  cv.width = cw;
  cv.height = ch;
  const c2 = cv.getContext('2d');
  c2.drawImage(img, 0, 0, cw, ch);
  const data = c2.getImageData(0, 0, cw, ch).data;
  let minX = cw, minY = ch, maxX = -1, maxY = -1;
  for (let y = 0; y < ch; y += 2) {
    for (let x = 0; x < cw; x += 2) {
      if (data[(y * cw + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) { minX = 0; minY = 0; maxX = cw - 1; maxY = ch - 1; }
  return { cv, sx: minX, sy: minY, sw: maxX - minX + 2, sh: maxY - minY + 2 };
}

/* Disegna un asset trimmato centrato in (cx, cy), largo targetW. */
export function drawEl(ctx, el, cx, cy, targetW, rot = 0, alpha = 1) {
  const scale = targetW / el.sw;
  const w = targetW;
  const h = el.sh * scale;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.drawImage(el.cv, el.sx, el.sy, el.sw, el.sh, -w / 2, -h / 2, w, h);
  ctx.restore();
  return h;
}

/* ── Cover-crop: riempie W×H con un'immagine, focus regolabile.
   `inset` scarta un bordo percentuale dell'immagine prima del cover
   (serve per SVG con margini trasparenti attorno al contenuto). ─────── */
export function coverCrop(ctx, img, W, H, fx = 0.5, fy = 0.5, inset = 0) {
  const iw = img.naturalWidth * (1 - inset * 2);
  const ih = img.naturalHeight * (1 - inset * 2);
  const ox = img.naturalWidth * inset;
  const oy = img.naturalHeight * inset;
  const s = Math.max(W / iw, H / ih);
  const sw = W / s;
  const sh = H / s;
  const sx = ox + (iw - sw) * fx;
  const sy = oy + (ih - sh) * fy;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
}

/* ── Testo dentro una banda diagonale: centrato e ruotato con essa ───── */
export function bandText(ctx, text, x0, y0, x1, y1, { size = 40, color = C.ink, offset = 0 } = {}) {
  const angle = Math.atan2(y1 - y0, x1 - x0);
  ctx.save();
  ctx.translate((x0 + x1) / 2 + offset * Math.cos(angle), (y0 + y1) / 2 + offset * Math.sin(angle));
  ctx.rotate(angle);
  ctx.font = `700 ${size}px ${FONT.sans}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

/* ── Shrink-to-fit: riduce il font finché il testo entra in maxW ─────── */
export function shrinkText(ctx, text, x, y, { maxW, size, minSize = 16, weight = 500, font = FONT.sans, fill = C.white } = {}) {
  let px = size;
  ctx.font = `${weight} ${px}px ${font}`;
  while (ctx.measureText(text).width > maxW && px > minSize) {
    px -= 1;
    ctx.font = `${weight} ${px}px ${font}`;
  }
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
  return px;
}
