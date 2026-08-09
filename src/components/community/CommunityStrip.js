import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Strip communities & partners in home (wireframe: 11-community-partners).
// Teaser della pagina /partners: prima communities e progetti OS presenti
// all'evento, che sono un hook per i partecipanti.
export default function CommunityStrip({ partners = [] }) {
  if (partners.length === 0) return null;

  return (
    <section className='border-t-2 border-ink bg-white py-16 lg:py-24' id='communities'>
      <div className='mx-auto max-w-[1200px] px-6'>
        <span className='eyebrow text-brand-magenta'>Communities & Partners</span>
        <h2 className='section-heading mt-2'>Meet them at the event</h2>
        <p className='mt-6 max-w-2xl text-lg text-ink-muted'>
          Communities and open source projects will be there with their own
          space. Come say hi.
        </p>
        <div className='mt-10 flex flex-wrap gap-4'>
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex h-[80px] w-[160px] items-center justify-center border-pop border-ink bg-white transition-all duration-100 hover:shadow-pop-sm'
            >
              <img
                src={partner.logo}
                alt={partner.name}
                loading='lazy'
                style={{ maxHeight: '100%', maxWidth: '80%', objectFit: 'contain' }}
              />
            </a>
          ))}
        </div>
        <div className='mt-8'>
          <Link
            href='/partners'
            className='inline-flex items-center gap-2 text-lg font-bold text-brand-blue transition-colors hover:text-brand-magenta'
          >
            All communities & partners <ArrowRight className='h-5 w-5' />
          </Link>
        </div>
      </div>
    </section>
  );
}
