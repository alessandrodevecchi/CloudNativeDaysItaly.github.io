import config from '@/config/website.json';

export const metadata = {
  title: `What is CND - ${config.general.event.name}`,
  description:
    'Cloud Native Days Italy is a community-driven event dedicated to cloud native and open source technologies.',
};

// Stub: la pagina completa (intro, timeline, pictures, made possible by)
// arriva nella fase 3 della ristrutturazione contenuti.
export default function AboutPage() {
  return (
    <section className='w-full bg-white'>
      <div className='mx-auto max-w-[1200px] px-6 py-16 md:py-24 pt-32 md:pt-40'>
        <span className='stamp'>What is CND</span>
        <h1 className='section-heading mt-6'>What is Cloud Native Days Italy</h1>
        <p className='mt-6 max-w-2xl text-ink-soft'>
          {config.general.event.description}
        </p>
        <p className='mt-4 max-w-2xl text-ink-muted'>
          The full story of the event is coming soon.
        </p>
      </div>
    </section>
  );
}
