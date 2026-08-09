/*
 * Set curato di composizioni decorative per il hero della homepage.
 * A ogni page load ne viene scelta una a caso lato client (vedi hero.js);
 * la variante 0 è quella pre-renderizzata staticamente.
 * Regole: cluster grandi solo negli angoli alti, halftone max 2 per variante,
 * nessun elemento oltre size xl. Vedi docs/design-system.md — Decorazioni.
 */

export const HERO_VARIANTS = [
  // 0 — composizione di default (SSR)
  [
    { pattern: 'cluster-a', position: 'top-left', size: 'xl' },
    { pattern: 'cluster-c', position: 'top-right', size: 'xl' },
    { pattern: 'cluster-b', position: 'bottom-left', size: 'lg' },
    { pattern: 'cluster-duo', position: 'bottom-right', size: 'md' },
    { pattern: 'halftone', position: 'top-left', size: 'xl', className: 'opacity-30 !-left-4 !top-32' },
    { pattern: 'halftone', position: 'bottom-right', size: 'xl', className: 'opacity-30' },
    { pattern: 'halftone-c', position: 'center', size: 'xl', className: 'opacity-20' },
    { pattern: 'halftone-b', position: 'mid-left', size: 'lg', className: 'opacity-20' },
  ],
  // 1 — specchiata: pesi invertiti
  [
    { pattern: 'cluster-c', position: 'top-left', size: 'xl' },
    { pattern: 'cluster-a', position: 'top-right', size: 'xl' },
    { pattern: 'cluster-duo', position: 'bottom-left', size: 'md' },
    { pattern: 'cluster-b', position: 'bottom-right', size: 'lg' },
    { pattern: 'halftone-c', position: 'bottom-left', size: 'xl', className: 'opacity-30' },
    { pattern: 'halftone-b', position: 'mid-right', size: 'xl', className: 'opacity-20' },
    { pattern: 'halftone-d', position: 'center-bottom', size: 'lg', className: 'opacity-20' },
  ],
  // 2 — trio diagonale a sinistra, gigante a destra
  [
    { pattern: 'cluster-d', position: 'top-left', size: 'xl' },
    { pattern: 'cluster-e', position: 'top-right', size: 'lg' },
    { pattern: 'cluster-duo', position: 'bottom-left', size: 'md' },
    { pattern: 'halftone-d', position: 'bottom-right', size: 'xl', className: 'opacity-30' },
    { pattern: 'halftone-c', position: 'mid-left', size: 'xl', className: 'opacity-20' },
    { pattern: 'halftone', position: 'center-bottom', size: 'lg', className: 'opacity-20' },
  ],
  // 3 — gigante a sinistra, fitto in basso
  [
    { pattern: 'cluster-e', position: 'top-left', size: 'xl' },
    { pattern: 'cluster-duo', position: 'top-right', size: 'md' },
    { pattern: 'cluster-b', position: 'bottom-right', size: 'lg' },
    { pattern: 'halftone', position: 'top-right', size: 'xl', className: 'opacity-30 !-right-4 !top-32' },
    { pattern: 'halftone-b', position: 'center-bottom', size: 'xl', className: 'opacity-20' },
    { pattern: 'halftone-c', position: 'mid-right', size: 'lg', className: 'opacity-20' },
  ],
  // 4 — angoli bassi protagonisti
  [
    { pattern: 'cluster-duo', position: 'top-left', size: 'md' },
    { pattern: 'cluster-a', position: 'top-right', size: 'lg' },
    { pattern: 'cluster-c', position: 'bottom-left', size: 'xl' },
    { pattern: 'cluster-d', position: 'bottom-right', size: 'lg' },
    { pattern: 'halftone', position: 'top-left', size: 'xl', className: 'opacity-30 !-left-4 !top-32' },
    { pattern: 'halftone-c', position: 'mid-right', size: 'xl', className: 'opacity-20' },
    { pattern: 'halftone-b', position: 'center-bottom', size: 'lg', className: 'opacity-20' },
  ],
  // 5 — asimmetrica: tutto il peso a destra
  [
    { pattern: 'cluster-duo', position: 'top-left', size: 'md' },
    { pattern: 'cluster-b', position: 'top-right', size: 'xl' },
    { pattern: 'cluster-e', position: 'bottom-right', size: 'lg' },
    { pattern: 'halftone-b', position: 'bottom-left', size: 'xl', className: 'opacity-30' },
    { pattern: 'halftone-d', position: 'center', size: 'xl', className: 'opacity-20' },
    { pattern: 'halftone-c', position: 'mid-left', size: 'lg', className: 'opacity-20' },
  ],
  // 6 — asimmetrica: tutto il peso a sinistra
  [
    { pattern: 'cluster-b', position: 'top-left', size: 'xl' },
    { pattern: 'cluster-duo', position: 'top-right', size: 'md' },
    { pattern: 'cluster-a', position: 'bottom-left', size: 'lg' },
    { pattern: 'halftone-c', position: 'bottom-right', size: 'xl', className: 'opacity-30' },
    { pattern: 'halftone', position: 'mid-right', size: 'xl', className: 'opacity-20' },
    { pattern: 'halftone-b', position: 'center-bottom', size: 'lg', className: 'opacity-20' },
  ],
  // 7 — trio diagonale doppio
  [
    { pattern: 'cluster-d', position: 'top-left', size: 'lg' },
    { pattern: 'cluster-duo', position: 'top-right', size: 'md' },
    { pattern: 'cluster-d', position: 'bottom-right', size: 'lg', className: 'rotate-180' },
    { pattern: 'halftone', position: 'top-right', size: 'xl', className: 'opacity-30 !-right-4 !top-32' },
    { pattern: 'halftone', position: 'bottom-left', size: 'xl', className: 'opacity-30' },
  ],
  // 8 — due giganti contrapposti
  [
    { pattern: 'cluster-e', position: 'top-left', size: 'xl' },
    { pattern: 'cluster-e', position: 'bottom-right', size: 'xl', className: 'rotate-180' },
    { pattern: 'cluster-duo', position: 'top-right', size: 'md' },
    { pattern: 'halftone-d', position: 'bottom-left', size: 'xl', className: 'opacity-30' },
    { pattern: 'halftone-c', position: 'mid-right', size: 'xl', className: 'opacity-20' },
    { pattern: 'halftone-d', position: 'mid-left', size: 'lg', className: 'opacity-20' },
  ],
  // 9 — classica del brand book: tricolore + satellite su entrambi i lati alti
  [
    { pattern: 'cluster-a', position: 'top-left', size: 'lg' },
    { pattern: 'cluster-a', position: 'top-right', size: 'lg', className: '-scale-x-100' },
    { pattern: 'cluster-duo', position: 'bottom-left', size: 'md' },
    { pattern: 'cluster-duo', position: 'bottom-right', size: 'md', className: '-scale-x-100' },
    { pattern: 'halftone', position: 'top-left', size: 'xl', className: 'opacity-30 !-left-4 !top-32' },
    { pattern: 'halftone-b', position: 'center', size: 'xl', className: 'opacity-20' },
    { pattern: 'halftone-c', position: 'mid-left', size: 'lg', className: 'opacity-20' },
  ],
];
