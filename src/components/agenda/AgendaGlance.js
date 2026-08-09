import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Agenda at a glance (wireframe: 07-agenda-glance) — mostra la STRUTTURA
// dell'evento (giorni e aree), non i talk: funziona anche senza agenda
// definita. Il dettaglio vive su /agenda.
const DayCard = ({ day }) => (
  <div className='card-pop bg-brand-blue p-6 text-white lg:px-10 lg:py-8'>
    <span className='font-display text-stamp uppercase tracking-wider text-brand-yellow'>
      {day.label}
    </span>
    <ul className='mt-3 space-y-2'>
      {day.bullets.map((b, i) => (
        <li key={i} className='flex items-center gap-2 text-lg text-white'>
          <span className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-yellow' />
          {b.bold ? <strong>{b.text}</strong> : b.text}
        </li>
      ))}
    </ul>
  </div>
);

export default function AgendaGlance({ data }) {
  if (!data?.active) return null;

  return (
    <section className='border-t-2 border-ink bg-white py-16 lg:py-24' id='agenda-glance'>
      <div className='mx-auto max-w-[1200px] px-6'>
        <span className='eyebrow text-brand-magenta'>The program</span>
        <h2 className='section-heading mt-2'>Agenda at a glance</h2>
        <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-2'>
          {data.days.map((day) => (
            <DayCard key={day.label} day={day} />
          ))}
        </div>
        {data.disclaimer && (
          <p className='mt-6 max-w-2xl text-sm text-ink-muted'>{data.disclaimer}</p>
        )}
        {data.CTA && (
          <div className='mt-8'>
            <Link
              href={data.CTA.url}
              className='inline-flex items-center gap-2 text-lg font-bold text-brand-blue transition-colors hover:text-brand-magenta'
            >
              {data.CTA.label} <ArrowRight className='h-5 w-5' />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
