import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import config from '@/config/website.json';
import aboutConfig from '@/config/about.json';
import DecorLayer from '@/components/decor/DecorLayer';

export const metadata = {
  title: `What is CND - ${config.general.event.name}`,
  description:
    'Cloud Native Days Italy is a community-driven event dedicated to cloud native and open source technologies. Born in 2021 as KCD Italy, it has grown into the meeting point of the Italian cloud native community.',
};

// Card colorate "made possible by" — superfici colorate, testo a contrasto
// secondo le regole del design system.
const CARD_COLORS = {
  blue: { bg: 'bg-brand-blue', text: 'text-white', link: 'text-brand-yellow' },
  magenta: { bg: 'bg-brand-magenta', text: 'text-white', link: 'text-white' },
  yellow: { bg: 'bg-brand-yellow', text: 'text-ink', link: 'text-ink' },
  ink: { bg: 'bg-ink', text: 'text-white', link: 'text-brand-yellow' },
};

const StoryStep = ({ step, isLast }) => {
  const isExternal = step.link?.url.startsWith('http');
  return (
    <li className='relative pl-10 sm:pl-14'>
      {/* Linea verticale + nodo della timeline */}
      {!isLast && (
        <span aria-hidden='true' className='absolute left-[7px] top-6 h-full w-0.5 bg-ink sm:left-[11px]' />
      )}
      {/* Il nodo dell'anno in arrivo lampeggia blu/magenta, i passati sono gialli */}
      <span
        aria-hidden='true'
        className={`absolute left-0 top-1.5 h-4 w-4 border-pop border-ink sm:h-6 sm:w-6 ${isLast ? 'timeline-node-live' : 'bg-brand-yellow'}`}
      />
      <div className='pb-12'>
        <span className='font-display text-stat uppercase leading-none text-brand-blue'>
          {step.year}
        </span>
        <h3 className='mt-2 text-xl font-bold text-ink'>{step.title}</h3>
        <p className='mt-2 max-w-xl text-ink-muted'>{step.text}</p>
        {step.link && (
          <Link
            href={step.link.url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className='mt-3 inline-flex items-center gap-2 font-bold text-brand-blue transition-colors hover:text-brand-magenta'
          >
            {step.link.label}
            {isExternal ? <ExternalLink className='h-4 w-4' /> : <ArrowRight className='h-4 w-4' />}
          </Link>
        )}
      </div>
    </li>
  );
};

export default function AboutPage() {
  const { intro, story, pictures, community } = aboutConfig;
  // Il photo wall ha una lista propria (target: almeno 9 foto, 3 righe da 3);
  // finché non c'è, riusa le foto della photo strip di home.
  const photos = pictures.images?.length
    ? pictures.images
    : config.info.photoStrip?.images || [];

  return (
    <>
      {/* Intro */}
      <section className='relative overflow-hidden bg-white'>
        <DecorLayer
          items={[
            { pattern: 'cluster-duo', position: 'top-right', size: 'md' },
            { pattern: 'halftone', position: 'mid-right', size: 'lg', className: 'opacity-20' },
          ]}
        />
        <div className='relative z-10 mx-auto max-w-[1200px] px-6 py-16 pt-32 md:py-24 md:pt-40'>
          <span className='stamp'>What is CND</span>
          <h1 className='section-heading mt-6'>{intro.title}</h1>
          <p className='mt-8 max-w-3xl text-xl text-ink-soft'>{intro.lead}</p>
          <p className='mt-5 max-w-3xl text-ink-muted'>{intro.description}</p>
        </div>
      </section>

      {/* Timeline */}
      <section className='border-t-2 border-ink bg-cream py-16 lg:py-24' id='story'>
        <div className='mx-auto max-w-[1200px] px-6'>
          <span className='eyebrow text-brand-magenta'>From KCD to CND</span>
          <h2 className='section-heading mt-2'>{story.title}</h2>
          <ol className='mt-12'>
            {story.steps.map((step, i) => (
              <StoryStep key={step.year} step={step} isLast={i === story.steps.length - 1} />
            ))}
          </ol>
        </div>
      </section>

      {/* Made possible by the community */}
      <section className='border-t-2 border-ink bg-white py-16 lg:py-24' id='community'>
        <div className='mx-auto max-w-[1200px] px-6'>
          <span className='eyebrow text-brand-magenta'>No company behind, just people</span>
          <h2 className='section-heading mt-2'>{community.title}</h2>
          <p className='mt-6 max-w-2xl text-lg text-ink-muted'>{community.description}</p>
          <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-2'>
            {community.cards.map((card) => {
              const colors = CARD_COLORS[card.color] || CARD_COLORS.blue;
              return (
                <Link
                  key={card.title}
                  href={card.url}
                  className={`card-pop group flex flex-col p-8 transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop ${colors.bg}`}
                >
                  <h3 className={`font-display text-2xl uppercase ${colors.text}`}>
                    {card.title}
                  </h3>
                  <p className={`mt-3 flex-1 ${colors.text} opacity-90`}>{card.text}</p>
                  <span className={`mt-6 inline-flex items-center gap-2 font-bold ${colors.link}`}>
                    {card.label}
                    <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photo wall: ultima sezione; griglia 3 colonne pensata per almeno
          9 foto (le altre arrivano dall'archivio 2026) */}
      {photos.length > 0 && (
        <section className='border-t-2 border-ink bg-cream py-16 lg:py-24' id='pictures'>
          <div className='mx-auto max-w-[1200px] px-6'>
            <span className='eyebrow text-brand-magenta'>Live moments</span>
            <h2 className='section-heading mt-2'>{pictures.title}</h2>
            <div className='mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3'>
              {photos.map((image, i) => (
                <div key={`${image.src}-${i}`} className={`card-pop overflow-hidden p-2 ${i % 2 ? '-rotate-1' : 'rotate-1'}`}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading='lazy'
                    className='aspect-[4/3] w-full object-cover'
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
