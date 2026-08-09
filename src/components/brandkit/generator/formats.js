// Formati di export del card generator. `family` seleziona la funzione di
// layout in layouts.js. Le dimensioni sono la risoluzione piena del PNG.
export const FORMATS = [
  { id: '16-9', label: '16:9', name: 'Landscape', width: 1920, height: 1080, family: 'landscape' },
  { id: '1-1', label: '1:1', name: 'Square', width: 1080, height: 1080, family: 'square' },
  { id: '4-5', label: '4:5', name: 'Portrait', width: 1080, height: 1350, family: 'portrait' },
  { id: '9-16', label: '9:16', name: 'Story', width: 1080, height: 1920, family: 'story' },
];

export const DEFAULT_FORMAT_ID = '1-1';

// Colorway = superficie piena + colori a contrasto (regole design system:
// testo bianco su blue/magenta/ink, testo ink su giallo).
// `icon` = colore brand a contrasto per le icone footer (deciso da
// Alessandro): blu→magenta, magenta→blu, giallo→ink.
// `rings` = i due colori brand usati nelle bande degli anelli decorativi
// (mai il colore di sfondo, che le renderebbe invisibili).
// `icon` = colore icone footer a contrasto (regola di Alessandro).
// `frame` = bordo/ombra della cornice media (ink di default, bianco su ink).
// `logo` = variante logo CND: 'white' o 'color'.
export const COLORWAYS = {
  blue: {
    bg: '#3069DE',
    text: '#FFFFFF',
    accent: '#FBC430',
    icon: '#F91B71',
    rings: ['#FBC430', '#F91B71'],
    frame: '#111111',
    logo: 'white',
    logoOptions: ['white', 'color'],
  },
  magenta: {
    bg: '#F91B71',
    text: '#FFFFFF',
    accent: '#FBC430',
    icon: '#3069DE',
    rings: ['#FBC430', '#3069DE'],
    frame: '#111111',
    logo: 'white',
    logoOptions: ['white', 'color'],
  },
  yellow: {
    bg: '#FBC430',
    text: '#111111',
    accent: '#F91B71',
    icon: '#111111',
    rings: ['#3069DE', '#F91B71'],
    frame: '#111111',
    logo: 'color',
    logoOptions: ['color'],
  },
  ink: {
    bg: '#111111',
    text: '#FFFFFF',
    accent: '#FBC430',
    icon: '#F91B71',
    rings: ['#FBC430', '#F91B71'],
    frame: '#FFFFFF',
    logo: 'white',
    logoOptions: ['white', 'color'],
  },
};

export const COLORWAY_LABELS = { blue: 'Blue', magenta: 'Magenta', yellow: 'Yellow', ink: 'Black' };
