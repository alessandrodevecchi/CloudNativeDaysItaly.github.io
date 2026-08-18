import config from '@/config/website.json';

// Dati dell'evento usati dalle card (footer, banda data, venue, caption).
// Tutto dalla config del sito: cambiando edizione cambiano le card.
const CITY = config.hero.city.split(',')[0].trim();
const LINKEDIN = (config.footer.icons.find((icon) => icon.iconName === 'linkedin') || {}).url || '';

export const EVENT = {
  name: config.general.event.name,
  year: config.general.edition,
  date: config.hero.badgeDate,
  // "20 May": nelle caption l'anno è già nel nome dell'evento
  dayMonth: config.hero.badgeDate.replace(/\s+\d{4}$/, ''),
  city: CITY,
  venue: [config.hero.venue, CITY].filter(Boolean).join(', '),
  // "cloudnativedaysitaly.org", senza protocollo: sulle card si legge meglio
  website: config.general.event.website.replace(/^https?:\/\//, '').replace(/\/$/, ''),
  // "@cloudnativedaysitaly", dall'url della pagina LinkedIn in config
  social: LINKEDIN ? `@${LINKEDIN.replace(/\/$/, '').split('/').pop()}` : '',
};
