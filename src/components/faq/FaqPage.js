'use client';

import { useState } from 'react';
import {
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Car,
  Plane,
  Train,
  Bus,
  Cloud,
  Landmark,
  UtensilsCrossed,
  Star,
  Coffee,
  TriangleAlert,
} from 'lucide-react';
import DecorLayer from '@/components/decor/DecorLayer';

/* ── Alert Banner ────────────────────────────────────── */
function AlertBanner({ alert }) {
  // active: false = alert archiviato (es. sciopero trasporti 2026),
  // tenuto in config come reference per alert futuri
  if (!alert || alert.active === false) return null;

  return (
    <div className='mb-12 bg-brand-yellow-light border-pop border-ink p-6'>
      <div className='flex items-center gap-3 mb-3'>
        <TriangleAlert className='h-5 w-5 text-ink flex-shrink-0' />
        <h2 className='font-bold text-ink text-lg'>{alert.title}</h2>
      </div>
      <p className='text-ink-soft text-sm mb-4'>{renderRichText(alert.intro)}</p>
      {alert.sections.map((section, i) => (
        <div key={i} className='mb-3'>
          <p className='font-semibold text-ink text-sm mb-1'>{section.label}:</p>
          <ul className='space-y-1'>
            {section.items.map((item, j) => (
              <li key={j} className='text-ink-soft text-sm flex gap-2'>
                <span className='mt-0.5 text-ink'>-</span>
                <span>{renderRichText(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {alert.closing && (
        <p className='mt-4 text-ink-soft text-sm font-medium'>{alert.closing}</p>
      )}
    </div>
  );
}

/* ── FAQ section ─────────────────────────────────────── */
const transportIconMap = { Car, Plane, Train, Bus, MapPin };
const infoIconMap = { Cloud, Landmark, UtensilsCrossed };
const hotelIconMap = { Star, Coffee };

function renderRichText(text) {
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className='font-semibold text-ink'>
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isExternal = url.startsWith('http');
      return (
        <a
          key={i}
          href={url}
          className='text-brand-blue hover:underline font-semibold'
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

function AccordionItem({ title, iconSlot, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='border-pop border-ink overflow-hidden bg-white'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between p-5 bg-white hover:bg-brand-yellow-light transition-colors text-left'
      >
        <div className='flex items-center gap-3'>
          {iconSlot && (
            <div className='flex-shrink-0 h-8 min-w-[2rem] border border-ink bg-brand-magenta flex items-center justify-center gap-1 px-2'>
              {iconSlot}
            </div>
          )}
          <span className='font-semibold text-ink'>{title}</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-ink-faint flex-shrink-0 ml-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className='px-5 pb-5 pt-1 border-t-2 border-ink bg-white'>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── FAQ ─────────────────────────────────────────────── */
function FaqSection({ data }) {
  return (
    <section>
      {data.eyebrow && (
        <p className='eyebrow text-brand-magenta mb-2'>
          {data.eyebrow}
        </p>
      )}
      <h2 className='font-display text-2xl uppercase text-ink mb-6'>{data.label}</h2>
      <div className='space-y-3'>
        {data.items.filter((item) => !item.hidden).map((item, i) => (
          <AccordionItem key={i} title={item.question}>
            <p className='text-ink-muted leading-relaxed pt-3'>
              {item.answer.split('\n\n').map((part, j) => (
                <span key={j}>
                  {j > 0 && <><br /><br /></>}
                  {renderRichText(part)}
                </span>
              ))}
            </p>
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}

/* ── Transport content (varies by type) ─────────────── */
function TransportContent({ section }) {
  if (section.type === 'routes') {
    return (
      <div className='pt-3 space-y-5'>
        {section.routes.map((route, i) => (
          <div key={i}>
            <h4 className='font-semibold text-ink mb-2'>{route.label}</h4>
            <ol className='list-decimal list-inside space-y-1.5'>
              {route.steps.map((step, j) => (
                <li key={j} className='text-ink-muted text-sm leading-relaxed'>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'paragraphs') {
    return (
      <div className='pt-3 space-y-2'>
        {section.paragraphs.map((p, i) => (
          <p key={i} className='text-ink-muted text-sm leading-relaxed'>
            {p}
          </p>
        ))}
      </div>
    );
  }

  if (section.type === 'buses') {
    return (
      <div className='pt-3 space-y-5'>
        <p className='text-ink-muted text-sm'>{section.intro}</p>
        <div className='space-y-3'>
          {section.buses.map((bus, i) => (
            <div key={i} className='bg-cream border border-ink p-3'>
              <span className='font-semibold text-brand-blue text-sm'>
                {bus.line}
              </span>
              <p className='text-ink-muted text-sm mt-0.5'>{bus.description}</p>
              <p className='text-ink-muted text-xs mt-1'>Stop: {bus.stop}</p>
            </div>
          ))}
        </div>
        <div>
          <h4 className='font-semibold text-ink mb-2 text-sm'>
            Taxi &amp; Uber
          </h4>
          <div className='space-y-1.5'>
            {section.taxis.map((taxi, i) => (
              <div key={i} className='flex items-center gap-2 text-sm text-ink-muted'>
                <span className='font-medium'>{taxi.name}</span>
                {taxi.phone && (
                  <a
                    href={`tel:${taxi.phone.replace(/\s/g, '')}`}
                    className='text-brand-blue hover:underline font-semibold'
                  >
                    {taxi.phone}
                  </a>
                )}
                {taxi.note && (
                  <span className='text-ink-faint'>({taxi.note})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function HowToGetHereSection({ data }) {
  return (
    <section>
      {data.eyebrow && (
        <p className='eyebrow text-brand-magenta mb-2'>
          {data.eyebrow}
        </p>
      )}
      <h2 className='font-display text-2xl uppercase text-ink mb-6'>{data.label}</h2>
      <div className='space-y-3'>
        {data.sections.map((section, i) => {
          const Icon = transportIconMap[section.icon];
          return (
            <AccordionItem
              key={i}
              title={section.title}
              iconSlot={Icon ? <Icon className='h-4 w-4 text-white' /> : null}
            >
              <TransportContent section={section} />
            </AccordionItem>
          );
        })}
      </div>
    </section>
  );
}

/* ── Where to stay ───────────────────────────────────── */
function HotelCard({ hotel }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ', ' + hotel.address)}`;

  return (
    <div className='py-3 border-b border-ink/20 last:border-0'>
      <p className='font-semibold text-ink text-sm'>{hotel.name}</p>
      <div className='mt-1.5 flex flex-wrap gap-x-5 gap-y-1'>
        <a
          href={mapsUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-1 text-xs text-ink-muted hover:text-brand-blue transition-colors'
        >
          <MapPin className='h-3.5 w-3.5 flex-shrink-0' />
          <span>{hotel.address}</span>
        </a>
        {hotel.phone && (
          <a
            href={`tel:${hotel.phone.replace(/[\s/]/g, '')}`}
            className='flex items-center gap-1 text-xs text-ink-muted hover:text-brand-blue transition-colors'
          >
            <Phone className='h-3.5 w-3.5 flex-shrink-0' />
            <span>{hotel.phone}</span>
          </a>
        )}
        {hotel.email && (
          <a
            href={`mailto:${hotel.email}`}
            className='flex items-center gap-1 text-xs text-ink-muted hover:text-brand-blue transition-colors'
          >
            <Mail className='h-3.5 w-3.5 flex-shrink-0' />
            <span>{hotel.email}</span>
          </a>
        )}
      </div>
    </div>
  );
}

function WhereToStaySection({ data }) {
  return (
    <section>
      {data.eyebrow && (
        <p className='eyebrow text-brand-magenta mb-2'>
          {data.eyebrow}
        </p>
      )}
      <h2 className='font-display text-2xl uppercase text-ink mb-6'>{data.label}</h2>
      <div className='space-y-3'>
        {data.tiers.map((tier, i) => {
          const Icon = hotelIconMap[tier.icon];
          const iconSlot =
            tier.stars > 0 ? (
              <>
                <span className='text-xs font-bold text-white leading-none'>
                  {tier.stars}
                </span>
                <Star className='h-3.5 w-3.5 text-white fill-white' />
              </>
            ) : Icon ? (
              <Icon className='h-4 w-4 text-white' />
            ) : null;

          return (
            <AccordionItem key={i} title={tier.title} iconSlot={iconSlot}>
              <div className='pt-2'>
                {tier.hotels.map((hotel, j) => (
                  <HotelCard key={j} hotel={hotel} />
                ))}
              </div>
            </AccordionItem>
          );
        })}
      </div>
    </section>
  );
}

/* ── Useful info ─────────────────────────────────────── */
function UsefulInfoSection({ data }) {
  return (
    <section>
      {data.eyebrow && (
        <p className='eyebrow text-brand-magenta mb-2'>
          {data.eyebrow}
        </p>
      )}
      <h2 className='font-display text-2xl uppercase text-ink mb-6'>{data.label}</h2>
      <div className='space-y-6'>
        {data.cards.map((card, i) => {
          const Icon = infoIconMap[card.icon];
          return (
            <div
              key={i}
              className='card-pop p-6'
            >
              <div className='flex items-center gap-3 mb-4'>
                {Icon && (
                  <div className='w-10 h-10 border border-ink bg-brand-magenta flex items-center justify-center flex-shrink-0'>
                    <Icon className='h-5 w-5 text-white' />
                  </div>
                )}
                <h3 className='font-bold text-ink'>{card.title}</h3>
              </div>
              <div className='space-y-3'>
                {card.paragraphs.map((p, j) => (
                  <p key={j} className='text-ink-muted text-sm leading-relaxed'>
                    {renderRichText(p)}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Page root ───────────────────────────────────────── */
export default function FaqPage({ data }) {
  return (
    <div className='relative overflow-hidden bg-white'>
      <DecorLayer
        items={[
          { pattern: 'cluster-d', position: 'top-right', size: 'lg' },
          { pattern: 'cluster-duo', position: 'bottom-left', size: 'md' },
          { pattern: 'halftone-b', position: 'top-left', size: 'lg', className: 'opacity-25' },
        ]}
      />
      <div className='relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:py-24'>
        {/* Alert */}
        <AlertBanner alert={data.alert} />

        {/* Header */}
        <div className='max-w-3xl mb-16'>
          <span className='stamp'>{data.page.label}</span>
          <h1 className='section-heading mt-6'>
            {data.page.title}
          </h1>
          <p className='mt-4 text-lg text-ink-muted'>{data.page.description}</p>
        </div>

        {/* Sections — due colonne su desktop per riempire il container */}
        <div className='grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-16'>
          <div className='space-y-16'>
            <FaqSection data={data.faq} />
            <WhereToStaySection data={data.whereToStay} />
          </div>
          <div className='space-y-16'>
            <HowToGetHereSection data={data.howToGetHere} />
            <UsefulInfoSection data={data.usefulInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}
