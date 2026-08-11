// Entry point dei template pro: prepara canvas, font e asset, poi
// delega al template scelto. Stessa pipeline della preview e
// dell'export (anche batch), come per le card base.
import { initProFonts } from './helpers';
import { loadProAssets } from './assets';
import { getSpeakerTemplate, getSponsorTemplate } from './registry';

// Il generator lavora con dati piatti; i template vogliono lo shape
// dell'handoff. La traduzione vive qui, in un punto solo.
export function toSpeakerData(values, { date, city }) {
  const speakers = [
    { name: values.name || 'Speaker Name', roles: [values.role].filter(Boolean) },
  ];
  if (values.name2) {
    speakers.push({ name: values.name2, roles: [values.role2].filter(Boolean) });
  }
  return {
    badge: values.badge || 'SPEAKER',
    title: values.talk || 'Talk title',
    speakers,
    date,
    city,
  };
}

export function toSponsorData(values, { date, venue }) {
  return {
    tier: values.tier || 'GOLD',
    company: values.org || '',
    date,
    venue,
  };
}

// I template leggono sia width/height sia naturalWidth/naturalHeight
// (scritti per gli <img>); l'upload dell'utente arriva come ImageBitmap.
// Lo si normalizza su un canvas con entrambe le coppie di proprietà.
function toDrawable(media) {
  if (!media?.source) return null;
  if (media.source.naturalWidth) return media.source;
  const canvas = document.createElement('canvas');
  canvas.width = media.width;
  canvas.height = media.height;
  canvas.getContext('2d').drawImage(media.source, 0, 0);
  canvas.naturalWidth = media.width;
  canvas.naturalHeight = media.height;
  return canvas;
}

export async function renderProCard(canvas, state) {
  const { kind, templateId, data, format, media, fonts, options = {} } = state;

  canvas.width = format.width;
  canvas.height = format.height;
  const ctx = canvas.getContext('2d');

  initProFonts(fonts);
  const assets = await loadProAssets();

  // media utente: foto speaker o logo sponsor (fallback: logo CND, così
  // la preview è sempre valida anche senza upload)
  const drawable = toDrawable(media);
  const A = {
    ...assets,
    photo: drawable || assets.logoWhite,
    sponsorLogo: drawable || assets.logoColor,
  };

  const F = { W: format.width, H: format.height, fmt: format.family };

  if (kind === 'sponsor') {
    const template = getSponsorTemplate(templateId);
    template.render(ctx, A, data, F, options);
    return;
  }

  const template = getSpeakerTemplate(templateId);
  template.render(ctx, A, data, F);
}
