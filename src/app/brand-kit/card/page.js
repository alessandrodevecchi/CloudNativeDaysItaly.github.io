import config from '@/config/website.json';
import CardBridge from '@/components/brandkit/generator/CardBridge';

/*
 * Pagina di servizio per la generazione da riga di comando: non è linkata,
 * è noindex e non serve a nessuna persona. Espone il renderer su
 * `window.__cndCards` e la guida `scripts/social-cards.mjs`, che apre questa
 * pagina in un browser headless, le passa il CSV e scrive i PNG su disco.
 * Aprendola a mano si vede l'ultima card resa: utile solo per capire perché
 * una riga non viene come si aspettava.
 */

export const metadata = {
  title: `Card renderer - ${config.general.event.name}`,
  robots: { index: false, follow: false },
};

export default function CardRendererPage() {
  return <CardBridge />;
}
