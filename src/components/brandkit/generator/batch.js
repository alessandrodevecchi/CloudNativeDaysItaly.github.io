// Logica batch: parsing CSV e costruzione dello stato di rendering per
// riga. Pura (niente DOM tranne il canvas creato dal chiamante), così è
// testabile e riusabile.
import { FORMATS, COLORWAYS } from './formats';
import { getUseCase } from './useCases';
import { toSpeakerData, toSponsorData } from './pro/renderProCard';
import { SPEAKER_TEMPLATES, SPONSOR_TEMPLATES, SPONSOR_TIER_PRESETS } from './pro/registry';
import { EVENT } from './event';

// Parser CSV minimale con supporto ai campi quotati ("a, b").
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((cell) => cell.trim() !== '')) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some((cell) => cell.trim() !== '')) rows.push(row);

  const [header, ...records] = rows;
  if (!header) return [];
  const keys = header.map((k) => k.trim().toLowerCase());
  return records.map((record) => {
    const entry = {};
    keys.forEach((key, i) => {
      entry[key] = (record[i] || '').trim();
    });
    return entry;
  });
}

// Colonne dei template pro (speaker/sponsor): il CSV dichiara template,
// campi e, per lo sponsor, il preset tier o background+corner espliciti.
export const CSV_TEMPLATE_PRO = [
  'usecase,template,formats,badge,talk,name,role,name2,role2,media,media2',
  'speaker,pop-blue,all,KEYNOTE SPEAKER,The New Digital Nervous System,Serena Sensini,Innovation Leader at Dedalus,,,serena.jpg,',
  'speaker,comic-panel,1-1|9-16,SPEAKER,AI e Sicurezza Cloud-Native,Giulio Puri,Sr Solutions Engineer at Sysdig,Andrea Vivaldi,Sr Customer Solution Architect at Sysdig,giulio.jpg,andrea.jpg',
  '',
  'usecase,template,formats,org,tier,preset,bg,corner,media',
  'sponsor,tier,all,Clastix,GOLD SPONSOR,gold,,,clastix.png',
  'sponsor,tier,1-1,ACME Corp,PLATINUM SPONSOR,platinum,,,acme.svg',
  'sponsor,pop-cream,4-5,ACME Corp,MEDIA PARTNER,,,,acme.svg',
].join('\n');

export const CSV_TEMPLATE = [
  'usecase,headline,colorway,formats,primary,secondary,tertiary,media,shape,zoom,offsetx,offsety,logostyle',
  'speaker,speaking,blue,1-1|9-16,Ada Lovelace,Platform Engineer @ ACME,Scaling Kubernetes the hard way,ada.jpg,square,1.2,0,-0.3,white',
  'sponsor,proud-sponsor,magenta,all,ACME Corp,Gold Sponsor,,acme-logo.png,,,,,color',
  'custom,Tickets on|sale now!,yellow,1-1,,,,,,,,,',
].join('\n');

// Traduce una riga CSV nello stato per renderCard. Lancia con messaggio
// chiaro se la riga non è valida; il chiamante raccoglie gli errori.
export function rowToRenderState(row, mediaByName) {
  const useCase = getUseCase(row.usecase || 'attendee-conference');
  if (!useCase) throw new Error(`unknown use case "${row.usecase}"`);

  const formatsFor = (spec) => {
    if (!spec || spec === 'all') return FORMATS;
    const list = spec
      .split('|')
      .map((id) => FORMATS.find((f) => f.id === id.trim()))
      .filter(Boolean);
    if (list.length === 0) throw new Error(`no valid formats in "${spec}"`);
    return list;
  };

  const mediaFor = (name) => {
    if (!name) return null;
    const found = mediaByName.get(name);
    if (!found) throw new Error(`media file "${name}" not uploaded`);
    return found;
  };

  // Template pro: layout approvati per speaker e sponsor
  const notices = [];
  if (useCase.pro) {
    const kind = useCase.pro;
    const list = kind === 'sponsor' ? SPONSOR_TEMPLATES : SPEAKER_TEMPLATES;
    let template = list.find((tpl) => tpl.id === row.template) || list[0];
    if (row.template && !list.some((tpl) => tpl.id === row.template)) {
      throw new Error(`unknown ${kind} template "${row.template}"`);
    }
    let options = {};
    let data;
    if (kind === 'sponsor') {
      const preset =
        SPONSOR_TIER_PRESETS.find((p) => p.id === (row.preset || '').toLowerCase()) || null;
      if (row.preset && !preset) throw new Error(`unknown tier preset "${row.preset}"`);
      options = {
        bg: row.bg || preset?.bg || 'sponsorSoft',
        corner: row.corner || preset?.corner || 'bauhaus',
      };
      data = toSponsorData(
        { org: row.org, tier: row.tier || preset?.tier },
        EVENT,
      );
    } else {
      // Riga con due relatori su un template che ne disegna uno solo: si
      // passa a un template duo invece di perdere il secondo nome. La riga
      // lo dichiara nel riepilogo, non è un errore.
      if (row.name2 && !template.duo) {
        const duoTemplates = list.filter((tpl) => tpl.duo);
        const picked = duoTemplates[Math.floor(Math.random() * duoTemplates.length)];
        notices.push(
          `template "${template.id}" draws one speaker only: switched to "${picked.id}" for the two speakers`,
        );
        template = picked;
      }
      data = toSpeakerData(
        {
          badge: row.badge,
          talk: row.talk,
          name: row.name,
          role: row.role,
          name2: row.name2,
          role2: row.role2,
        },
        EVENT,
      );
    }
    return {
      useCaseId: useCase.id,
      formats: formatsFor(row.formats),
      pro: { kind, templateId: template.id, data, options },
      slugSource: kind === 'sponsor' ? row.org : row.name,
      // Secondo pezzo del nome file: il talk per gli speaker, il badge per
      // gli sponsor. Serve perché un relatore può avere due talk e uno
      // sponsor può stare in due tier, e i due file devono distinguersi.
      slugExtra: kind === 'sponsor' ? row.tier : row.talk,
      // media2: foto del secondo speaker nei template duo. Se manca, il
      // renderer ricade sulla prima foto con due crop diversi.
      state: { photo: mediaFor(row.media), photo2: mediaFor(row.media2) },
      notices,
    };
  }

  let headline;
  if (row.headline?.includes('|')) {
    const lines = row.headline.split('|').map((line) => line.trim()).filter(Boolean);
    headline = { id: 'custom', lines, accentIndex: lines.length - 1 };
  } else {
    headline =
      useCase.headlines.find((h) => h.id === row.headline) ||
      useCase.headlines.find((h) => h.id === useCase.defaultHeadline) ||
      useCase.headlines[0];
  }

  const colorway = row.colorway && COLORWAYS[row.colorway] ? row.colorway : useCase.defaultColorway;

  let formats;
  if (!row.formats || row.formats === 'all') {
    formats = FORMATS;
  } else {
    formats = row.formats
      .split('|')
      .map((id) => FORMATS.find((f) => f.id === id.trim()))
      .filter(Boolean);
    if (formats.length === 0) throw new Error(`no valid formats in "${row.formats}"`);
  }

  let photo = null;
  if (row.media) {
    photo = mediaByName.get(row.media);
    if (!photo) throw new Error(`media file "${row.media}" not uploaded`);
  }

  const colorwayDef = COLORWAYS[colorway];
  const logoOptions = colorwayDef.logoOptions || ['white'];
  const logoStyle = logoOptions.includes(row.logostyle) ? row.logostyle : colorwayDef.logo;

  return {
    useCaseId: useCase.id,
    formats,
    state: {
      headline,
      texts: {
        primary: row.primary || '',
        secondary: row.secondary || '',
        tertiary: row.tertiary || '',
      },
      textStyles: {
        secondary: useCase.fields[1]?.style || 'text',
        tertiary: useCase.fields[2]?.style || 'text',
      },
      photo,
      mediaType: useCase.media?.type === 'choice'
        ? (row.media && /logo/i.test(row.media) ? 'logo' : 'photo')
        : useCase.media?.type,
      photoShape: row.shape === 'circle' ? 'circle' : 'square',
      zoom: Number(row.zoom) || 1,
      photoOffset: { x: Number(row.offsetx) || 0, y: Number(row.offsety) || 0 },
      logoStyle,
      colorway,
    },
  };
}

// Nome del PNG, uguale per il pannello batch e per lo script da riga di
// comando: `cnd2027-<usecase>[-<template>]-<soggetto>[-<extra>]-<formato>.png`
export function cardFilename({ useCaseId, templateId, slug, extra, formatId }) {
  const parts = ['cnd2027', useCaseId, templateId, slug, extra, formatId].filter(Boolean);
  return `${parts.join('-')}.png`;
}

// Slug corto: taglia sull'ultimo trattino utile per non spezzare una parola
export function shortSlug(text, maxLength = 34) {
  const slug = slugify(text, '');
  if (!slug || slug.length <= maxLength) return slug;
  const cut = slug.slice(0, maxLength);
  const lastDash = cut.lastIndexOf('-');
  return lastDash > maxLength * 0.5 ? cut.slice(0, lastDash) : cut;
}

export function slugify(text, fallback) {
  const slug = (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
}
