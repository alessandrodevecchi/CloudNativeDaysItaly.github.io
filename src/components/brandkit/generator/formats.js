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
export const COLORWAYS = {
  blue: {
    bg: '#3069DE',
    text: '#FFFFFF',
    accent: '#FBC430',
    icon: '#F91B71',
    rings: ['#FBC430', '#F91B71'],
    logo: 'white',
  },
  magenta: {
    bg: '#F91B71',
    text: '#FFFFFF',
    accent: '#FBC430',
    icon: '#3069DE',
    rings: ['#FBC430', '#3069DE'],
    logo: 'white',
  },
};

export const COLORWAY_LABELS = { blue: 'Blue', magenta: 'Magenta' };
