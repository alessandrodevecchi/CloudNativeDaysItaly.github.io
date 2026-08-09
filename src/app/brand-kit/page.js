import config from '@/config/website.json';

export const metadata = {
  title: `Brand Kit - ${config.general.event.name}`,
  description:
    'Logos, colors, templates and ready-made assets to share Cloud Native Days Italy.',
};

// Stub: la pagina completa (brand basics, media partners, attendees,
// speakers, usage rules) arriva nella fase 3 della ristrutturazione contenuti.
export default function BrandKitPage() {
  return (
    <section className='w-full bg-white'>
      <div className='mx-auto max-w-[1200px] px-6 py-16 md:py-24 pt-32 md:pt-40'>
        <span className='stamp'>Brand Kit</span>
        <h1 className='section-heading mt-6'>Share Cloud Native Days Italy</h1>
        <p className='mt-6 max-w-2xl text-ink-soft'>
          Logos, colors, templates and ready-made assets for attendees, media
          partners and speakers.
        </p>
        <p className='mt-4 max-w-2xl text-ink-muted'>
          The full kit is coming soon.
        </p>
      </div>
    </section>
  );
}
