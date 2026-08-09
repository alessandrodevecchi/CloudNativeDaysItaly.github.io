import config from '@/config/website.json';
import CardGenerator from '@/components/brandkit/generator/CardGenerator';
import BatchPanel from '@/components/brandkit/generator/BatchPanel';

// Versione interna del card generator per il team: include anche gli use
// case 'internal' (speaker, sponsor, community/OS, custom). Pagina non
// linkata dal sito, noindex, esclusa dalla sitemap (lista statica in
// scripts/generate-sitemap.js).
export const metadata = {
  title: `Card Studio - ${config.general.event.name}`,
  robots: { index: false, follow: false },
};

export default function CardStudioPage() {
  return (
    <section className='w-full bg-white'>
      <div className='mx-auto max-w-[1200px] px-6 py-16 pt-32 md:pt-40' id='generator'>
        <span className='stamp'>Team only</span>
        <h1 className='section-heading mt-6'>Card Studio</h1>
        <p className='mt-6 max-w-2xl text-ink-muted'>
          Internal version of the card generator, with every use case:
          speakers, sponsors, communities and a free custom card.
        </p>
        <CardGenerator scope='all' />
        <BatchPanel />
      </div>
    </section>
  );
}
