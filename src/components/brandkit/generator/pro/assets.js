// Caricamento e cache degli asset dei template pro. Gli SVG di
// public/brand-kit condividono un'artboard quasi vuota: loadEl li
// rasterizza una volta e ne calcola il bounding box (vedi helpers).
// Tutto è dietro una cache di modulo: gli SVG pesanti (star, bomb,
// donut, cloud) si rasterizzano una sola volta per sessione.
import { loadEl, loadBgSvg } from './helpers';

const BASE = '/brand-kit';

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

// Ricolorazioni dei background SVG: lo stesso file genera le varianti
// tenui per i tier sponsor (mappa hex → hex applicata al sorgente).
export const BG_RECOLORS = {
  facetsBlue: [`${BASE}/bg-facets-blue.svg`, null],
  facetsMagenta: [`${BASE}/bg-facets-magenta.svg`, null],
  softPlatinum: [`${BASE}/bg-facets-blue.svg`, { '#3069de': '#b9c6da', '#fbc430': '#e8ecf2' }],
  softSilver: [`${BASE}/bg-facets-blue.svg`, { '#3069de': '#aeb6c2', '#fbc430': '#f0e0ac' }],
  softSmart: [`${BASE}/bg-facets-blue.svg`, { '#3069de': '#efb3c9', '#fbc430': '#f9e4bd' }],
  softSky: [`${BASE}/bg-facets-blue.svg`, { '#3069de': '#a9c6f0', '#fbc430': '#e7effc' }],
  softMain: [`${BASE}/bg-facets-magenta.svg`, { '#f91a71': '#f487b0', '#fbc430': '#f5d685' }],
};

const EL_SOURCES = {
  pizza: [`${BASE}/pizza-slice-right.svg`],
  bauhaus1: [`${BASE}/bauhaus-1.svg`],
  bauhaus2: [`${BASE}/bauhaus-2.svg`],
  bauhaus3: [`${BASE}/bauhaus-3.svg`],
  donut3rings: [`${BASE}/donut-3rings.svg`],
  donutStripes: [`${BASE}/donut-stripes.svg`],
  donutBitten: [`${BASE}/donut-bitten-1.svg`],
  donutGlaze: [`${BASE}/donut-glaze.svg`],
  star3: [`${BASE}/star-3.svg`],
  star4: [`${BASE}/star-4.svg`],
  explosion: [`${BASE}/explosion-pop.svg`],
  bomb: [`${BASE}/bomb-pop-1.svg`],
  bomb2: [`${BASE}/bomb-pop-2.svg`],
  cloud: [`${BASE}/cloud-pop-2.svg`],
  cloud1: [`${BASE}/cloud-pop-1.svg`],
  cloud1Tint: [`${BASE}/cloud-pop-1.svg`, 900, { '#dbd7d9': '#dceaf7' }],
  cloud3: [`${BASE}/cloud-pop-3.svg`],
  cloudComp3: [`${BASE}/cloud-comp-3.svg`, 1100, { '#fafafa': '#e6f2fb' }],
  cloudComp4: [`${BASE}/cloud-comp-4.svg`, 1100, { '#fafafa': '#e6f2fb' }],
  diamond: [`${BASE}/diamond.svg`],
  diamondSilver: [`${BASE}/diamond.svg`, 900, { '#3069de': '#9fb0c4', '#f51a6f': '#6d7c90' }],
};

let assetsPromise = null;

// Carica tutto in parallelo una volta sola; `media` (foto/logo caricati
// dall'utente) arriva dal generator e non viene cache-ato qui.
export function loadProAssets() {
  if (assetsPromise) return assetsPromise;

  assetsPromise = (async () => {
    const elEntries = await Promise.all(
      Object.entries(EL_SOURCES).map(async ([key, [src, rasterW, recolor]]) => [
        key,
        await loadEl(src, rasterW || 900, recolor || null),
      ]),
    );
    const bgEntries = await Promise.all(
      Object.entries(BG_RECOLORS).map(async ([key, [src, recolor]]) => [
        key,
        await loadBgSvg(src, recolor || {}),
      ]),
    );

    const [logoWhite, logoColor, speakerBlue, sponsorSoft] = await Promise.all([
      loadImage(`${BASE}/logo-white.svg`),
      loadImage(`${BASE}/logo-color.svg`),
      loadImage(`${BASE}/bg-speaker-comic.png`),
      loadImage(`${BASE}/bg-sponsor-soft.png`),
    ]);

    return {
      logoWhite,
      logoColor,
      bg: { speakerBlue, sponsorSoft, ...Object.fromEntries(bgEntries) },
      el: Object.fromEntries(elEntries),
    };
  })();

  return assetsPromise;
}
