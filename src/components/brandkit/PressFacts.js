import CopyButton from './CopyButton';
import pressFacts from '@/config/press-facts.json';

/*
 * Press facts per la stampa e i media partner.
 * Fonte unica: il transparency report dell'edizione dichiarata, i numeri
 * stanno in src/config/press-facts.json (vedi la nota `_source`: contano
 * anche chi non ha una pagina sul sito, quindi differiscono dai conteggi
 * di editions/*.json che alimentano la banda numeri in home. I due non
 * vanno allineati).
 * Intento documentale, non celebrativo: card bianca statica, nessun
 * count-up animato come nella banda <Metrics> della home.
 */

const Fact = ({ value, label, delta }) => (
  <div>
    <p className='flex items-baseline gap-2'>
      <span className='font-display text-stat leading-none text-ink'>{value}</span>
      {delta && <span className='text-sm font-bold text-brand-magenta'>{delta}</span>}
    </p>
    <p className='mt-1 text-xs font-bold uppercase tracking-widest text-ink-muted'>
      {label}
    </p>
  </div>
);

const InlineFacts = ({ title, items }) => (
  <div>
    <p className='text-xs font-bold uppercase tracking-widest text-ink-muted'>{title}</p>
    <ul className='mt-3 flex flex-wrap gap-x-8 gap-y-3'>
      {items.map((item) => (
        <li key={item.label} className='flex items-baseline gap-2'>
          <span className='font-display text-xl leading-none text-ink'>{item.value}</span>
          <span className='text-sm text-ink-soft'>{item.label}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function PressFacts() {
  const { edition, intro, facts, seniority, satisfaction, copyText, report } = pressFacts;

  return (
    <div id='press-facts' className='card-pop mt-10 bg-white p-8 lg:p-10'>
      <div className='flex flex-wrap items-center gap-4'>
        <h3 className='font-display text-2xl uppercase text-ink'>Press facts</h3>
        <span className='chip-pop'>{edition} edition</span>
      </div>
      <p className='mt-4 max-w-2xl text-ink-soft'>{intro}</p>

      <div className='mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start'>
        <div>
          <div className='grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3'>
            {facts.map((fact) => (
              <Fact key={fact.label} {...fact} />
            ))}
          </div>

          <div className='mt-8 space-y-6 border-t-2 border-ink pt-6'>
            <InlineFacts title='Audience seniority' items={seniority} />
            <InlineFacts title='Satisfaction, out of 5' items={satisfaction} />
          </div>

          <p className='mt-6 text-sm text-ink-faint'>
            Percentages in magenta are the growth over the previous edition.
            Everything comes from the {edition} transparency report.
          </p>

          <div className='mt-6'>
            <CopyButton text={copyText} label='Copy the facts' />
          </div>
        </div>

        {/* Cover del report cliccabile verso il PDF: stesso trattamento
            della cover del prospectus in BecomeSponsorBox */}
        <div className='justify-self-center lg:justify-self-end'>
          <a
            href={report.url}
            target='_blank'
            rel='noopener noreferrer'
            className='card-pop group block max-w-[320px] overflow-hidden p-2 shadow-pop-lg transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_#111111]'
          >
            <img
              src={report.cover}
              alt={`Cloud Native Days Italy ${edition} transparency report cover`}
              className='block w-full'
            />
            <span className='mt-2 flex items-center justify-center py-1 text-center text-sm font-bold uppercase tracking-wide text-ink'>
              {report.label}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
