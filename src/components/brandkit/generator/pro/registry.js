// Registry dei template pro esposti dal generator. Ogni voce è dati:
// id, label leggibile, tipo di dati richiesto (speaker | sponsor) e la
// funzione di render coi preset del template (photoShape, bgStyle,
// palette, corner, background).
import {
  speakerComicBlue,
  speakerPop2027,
  speakerPopSplit,
  speakerHybrid,
  speakerComicRealBg,
  speakerBauhausYellow,
  speakerPopMagentaMax,
  sponsorPopCream,
  sponsorPopBlue,
  sponsorFacetsRealBg,
  sponsorTier,
} from './templates';

// `duo`: il template gestisce due relatori affiancati. Gli altri
// disegnano solo il primo relatore (limite noto dell'handoff).
export const SPEAKER_TEMPLATES = [
  { id: 'comic-blue', label: 'Comic blue', duo: false, render: speakerComicBlue },
  { id: 'pop-blue', label: 'Pop blue', duo: true, render: speakerPop2027 },
  { id: 'pop-split', label: 'Pop split', duo: true, render: speakerPopSplit },
  { id: 'hybrid-round', label: 'Hybrid round', duo: false, render: (ctx, A, S, F) => speakerHybrid(ctx, A, S, F, 'round') },
  { id: 'hybrid-square', label: 'Hybrid square', duo: false, render: (ctx, A, S, F) => speakerHybrid(ctx, A, S, F, 'square') },
  { id: 'comic-panel', label: 'Comic panel', duo: true, render: speakerComicRealBg },
  { id: 'bauhaus-yellow', label: 'Bauhaus yellow', duo: false, render: speakerBauhausYellow },
  { id: 'magenta-max', label: 'Magenta max', duo: false, render: speakerPopMagentaMax },
  { id: 'facets-blue', label: 'Facets blue', duo: false, render: (ctx, A, S, F) => speakerHybrid(ctx, A, S, F, 'square', 'facets-blue') },
  { id: 'facets-magenta', label: 'Facets magenta', duo: false, render: (ctx, A, S, F) => speakerHybrid(ctx, A, S, F, 'round', 'facets-magenta') },
];

// Preset tier del template sponsor principale: precompilano la coppia
// background + cluster d'angolo. `custom` lascia libera la scelta.
export const SPONSOR_TIER_PRESETS = [
  { id: 'gold', label: 'Gold', tier: 'GOLD SPONSOR', bg: 'sponsorSoft', corner: 'bauhaus' },
  { id: 'platinum', label: 'Platinum', tier: 'PLATINUM SPONSOR', bg: 'softPlatinum', corner: 'diamonds' },
  { id: 'silver', label: 'Silver', tier: 'SILVER SPONSOR', bg: 'softSilver', corner: 'donuts' },
  { id: 'smart', label: 'Smart', tier: 'SMART SPONSOR', bg: 'softSmart', corner: 'rings' },
  { id: 'workshop', label: 'Workshop', tier: 'WORKSHOP SPONSOR', bg: 'softSky', corner: 'clouds' },
  { id: 'main', label: 'Main', tier: 'MAIN SPONSOR', bg: 'softMain', corner: 'brandrings' },
];

export const SPONSOR_BACKGROUNDS = [
  { id: 'sponsorSoft', label: 'Soft facets (PNG)' },
  { id: 'softPlatinum', label: 'Platinum' },
  { id: 'softSilver', label: 'Silver' },
  { id: 'softSmart', label: 'Smart' },
  { id: 'softSky', label: 'Sky' },
  { id: 'softMain', label: 'Main' },
  { id: 'facetsBlue', label: 'Facets blue' },
  { id: 'facetsMagenta', label: 'Facets magenta' },
];

export const SPONSOR_CORNERS = [
  { id: 'bauhaus', label: 'Bauhaus' },
  { id: 'diamonds', label: 'Diamonds' },
  { id: 'rings', label: 'Rings' },
  { id: 'donuts', label: 'Donuts' },
  { id: 'clouds', label: 'Clouds' },
  { id: 'brandrings', label: 'Brand rings' },
];

export const SPONSOR_TEMPLATES = [
  {
    id: 'tier',
    label: 'Tier card',
    // template principale: background e angolo selezionabili (default dal
    // preset tier scelto)
    options: { tierPresets: true },
    render: (ctx, A, S, F, opts = {}) => sponsorTier(ctx, A, S, F, opts),
  },
  { id: 'pop-cream', label: 'Pop cream', render: sponsorPopCream },
  { id: 'pop-blue', label: 'Pop blue', render: sponsorPopBlue },
  { id: 'facets-soft', label: 'Facets soft', render: sponsorFacetsRealBg },
];

export const getSpeakerTemplate = (id) =>
  SPEAKER_TEMPLATES.find((t) => t.id === id) || SPEAKER_TEMPLATES[0];

export const getSponsorTemplate = (id) =>
  SPONSOR_TEMPLATES.find((t) => t.id === id) || SPONSOR_TEMPLATES[0];
