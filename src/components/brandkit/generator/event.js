import config from '@/config/website.json';

// Dati fissi dell'evento usati dalle card (footer, banda data, venue).
// Derivati dalla config del sito: cambiando edizione cambiano le card.
export const EVENT = {
  date: config.hero.badgeDate,
  city: config.hero.city.split(',')[0].trim(),
  venue: 'Savoia Hotel Regency, Bologna',
};
