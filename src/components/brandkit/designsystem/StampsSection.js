import { DsBlock, DsSection, DsToken } from './DsKit';

/*
 * Stamp e occhielli: il dubbio più frequente. La regola è il livello del
 * titolo e il tipo di sezione, non il gusto del momento.
 */

const STAMP_VARIANTS = [
  { label: 'Save the date', className: 'stamp', note: 'White, the default. Works on any surface.' },
  { label: 'We need you', className: 'stamp bg-brand-yellow', note: 'Yellow, when the section is already an invitation.' },
  { label: 'Last call', className: 'stamp bg-brand-magenta text-white', note: 'Magenta with white text, for urgency. Rare, on purpose.' },
];

export default function StampsSection() {
  return (
    <DsSection
      id='stamps'
      tone='cream'
      eyebrow='Building blocks'
      title='Stamp or eyebrow'
      lead='Both sit above a title. The stamp says "act here", the eyebrow says "read here". Picking the wrong one changes the meaning of the whole section.'
    >
      <DsBlock
        title='The two cases, side by side'
        rule='Stamp on page titles, in hero moments and on the action sections: Call for Papers, Tickets, Become a Sponsor. Eyebrow on informative section titles, magenta on light surfaces, yellow on blue or ink.'
      >
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <div className='flex flex-col border-pop border-ink bg-white'>
            <div className='flex-1 bg-brand-blue p-8'>
              <span className='stamp'>Call for papers</span>
              <p className='mt-6 font-display text-3xl uppercase text-white'>
                You could be on this stage
              </p>
              <p className='mt-3 text-white'>
                Submissions are open until the end of February.
              </p>
              <span className='btn-pop btn-pop-primary mt-6 inline-block !px-4 !py-2 text-sm'>
                Submit a talk
              </span>
            </div>
            <p className='border-t-2 border-ink bg-white px-6 py-3 text-sm text-ink-soft'>
              Action section: it asks for something, so it gets a{' '}
              <DsToken>.stamp</DsToken>.
            </p>
          </div>

          <div className='flex flex-col border-pop border-ink bg-white'>
            <div className='flex-1 bg-white p-8'>
              <span className='eyebrow text-brand-magenta'>What to expect</span>
              <p className='mt-2 font-display text-3xl uppercase text-ink'>
                Two days, one community
              </p>
              <p className='mt-3 text-ink-soft'>
                Talks, workshops and the corridor track, which is where the good
                conversations happen anyway.
              </p>
            </div>
            <p className='border-t-2 border-ink bg-white px-6 py-3 text-sm text-ink-soft'>
              Informative section: it tells something, so it gets an{' '}
              <DsToken>.eyebrow</DsToken>.
            </p>
          </div>
        </div>
        <p className='mt-4 text-sm font-bold text-ink'>
          Never two stamps in the same view: a second one makes both look decorative.
        </p>
        <p className='mt-2 text-sm text-ink-soft'>
          On the ink band use the eyebrow, never the stamp: a stamp there would need a
          white border and a white shadow, and it would end up looking like a button.
          The venue band and the numbers band already work this way.
        </p>
      </DsBlock>

      <DsBlock
        title='Stamp variants'
        rule='Same shape, same rotation, three surfaces. The rotation alternates between minus and plus two degrees when stamps repeat down a page.'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {STAMP_VARIANTS.map((variant) => (
            <div key={variant.label} className='border-pop border-ink bg-white'>
              <div className='flex h-24 items-center justify-center bg-cream px-6'>
                <span className={variant.className}>{variant.label}</span>
              </div>
              <p className='border-t-2 border-ink px-4 py-3 text-sm text-ink-soft'>
                {variant.note}
              </p>
            </div>
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title='Eyebrow colours'
        rule='The eyebrow takes the colour that survives on its background.'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <div className='border-pop border-ink bg-white p-6'>
            <span className='eyebrow text-brand-magenta'>On white and cream</span>
            <p className='mt-2 font-display text-xl uppercase text-ink'>Magenta</p>
          </div>
          <div className='border-pop border-ink bg-brand-blue p-6'>
            <span className='eyebrow text-brand-yellow'>On blue and ink</span>
            <p className='mt-2 font-display text-xl uppercase text-white'>Yellow</p>
          </div>
          <div className='border-pop border-ink bg-brand-yellow p-6'>
            <span className='eyebrow text-ink'>On yellow</span>
            <p className='mt-2 font-display text-xl uppercase text-ink'>Ink</p>
          </div>
        </div>
      </DsBlock>
    </DsSection>
  );
}
