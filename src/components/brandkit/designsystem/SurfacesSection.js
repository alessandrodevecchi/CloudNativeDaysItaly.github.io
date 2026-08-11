import { BORDER_WIDTH, SHADOWS } from './tokens';
import { DsBlock, DsSection, DsStage, DsToken } from './DsKit';

/*
 * Foundations: superfici, bordi, ombre. Le ombre sono rese con le classi
 * vere e la loro definizione arriva da tailwind.config.mjs.
 */

const SHADOW_STEPS = [
  { token: 'shadow-pop-sm', className: 'shadow-pop-sm', use: 'Stamps and small badges.' },
  { token: 'shadow-pop', className: 'shadow-pop', use: 'Buttons, dropdown panels, cards on hover.' },
  { token: 'shadow-pop-lg', className: 'shadow-pop-lg', use: 'Feature blocks and document covers.' },
];

const DARK_SHADOW_STEPS = [
  { token: 'shadow-pop-white-sm', className: 'shadow-pop-white-sm' },
  { token: 'shadow-pop-white', className: 'shadow-pop-white' },
];

export default function SurfacesSection() {
  return (
    <DsSection
      id='surfaces'
      tone='white'
      eyebrow='Foundations'
      title='Surfaces, borders, shadows'
      lead='Hard edges and hard shadows. No radius, no blur, no gradient: a shadow is a black block offset by a few pixels.'
    >
      <DsBlock
        title='Section rhythm'
        rule='Every section is a full width band with its own background; the content lives in a 1200px container. Two light bands touching each other are separated by a solid ink border.'
      >
        <div className='border-pop border-ink bg-cream p-4'>
          <div className='border-pop border-ink bg-white px-6 py-10 text-center'>
            <p className='font-display text-xl uppercase text-ink'>Content container</p>
            <p className='mt-2 text-sm text-ink-muted'>
              <DsToken>max-w-[1200px] mx-auto px-6</DsToken>
            </p>
          </div>
          <p className='mt-4 text-center text-xs font-bold uppercase tracking-widest text-ink-muted'>
            Band: full width background, <DsToken>py-16 md:py-24</DsToken>
          </p>
        </div>
      </DsBlock>

      <DsBlock
        title='The three shadows'
        rule='Same direction, three sizes. Against the ink band they turn white, and so do the borders: black on black is nothing. On blue and magenta the black shadow still reads and stays as it is.'
      >
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
          {SHADOW_STEPS.map((step) => (
            <div key={step.token}>
              <div className='p-2 pb-4 pr-4'>
                <div className={`border-pop border-ink bg-white p-6 ${step.className}`}>
                  <p className='font-display text-lg uppercase text-ink'>Aa</p>
                </div>
              </div>
              <p className='text-xs text-ink-muted'>
                <DsToken>{step.token}</DsToken> · {SHADOWS[step.token.replace('shadow-', '')]}
              </p>
              <p className='mt-1 text-sm text-ink-soft'>{step.use}</p>
            </div>
          ))}
        </div>

        <div className='mt-6 border-pop border-ink bg-ink p-8'>
          <div className='flex flex-wrap gap-8'>
            {DARK_SHADOW_STEPS.map((step) => (
              <div key={step.token}>
                <div className={`border-2 border-white bg-ink p-6 ${step.className}`}>
                  <p className='font-display text-lg uppercase text-white'>Aa</p>
                </div>
                <p className='mt-3 text-xs text-white/80'>
                  <DsToken>{step.token}</DsToken>
                </p>
              </div>
            ))}
          </div>
        </div>
      </DsBlock>

      <DsBlock
        title='Borders'
        rule='Ink on everything, magenta only to mark the one option that stands out.'
      >
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='card-pop p-6'>
            <p className='font-bold text-ink'>Default border</p>
            <p className='mt-2 text-xs text-ink-muted'>
              <DsToken>border-pop border-ink</DsToken> · {BORDER_WIDTH.pop} solid
            </p>
          </div>
          <div className='card-pop-accent p-6'>
            <p className='font-bold text-ink'>Highlighted card</p>
            <p className='mt-2 text-xs text-ink-muted'>
              <DsToken>card-pop-accent</DsToken> · {BORDER_WIDTH['pop-accent']} magenta
            </p>
          </div>
        </div>
      </DsBlock>

      <DsBlock
        title='Shadows: the three levels'
        rule='Always, only on hover, never. If a surface is dense and informative it carries no shadow at all.'
      >
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <DsStage label='Always: stamps, primary CTA, feature cards, open dropdowns'>
            <div className='flex flex-wrap items-center gap-4'>
              <span className='stamp'>The event</span>
              <span className='btn-pop btn-pop-primary !px-4 !py-2 text-sm'>Get tickets</span>
            </div>
          </DsStage>
          <DsStage label='Only on hover: interactive grid cards'>
            <div className='card-pop p-4 transition-all duration-100 hover:-translate-y-[2px] hover:shadow-pop'>
              <p className='font-bold text-ink'>Talk card</p>
              <p className='mt-1 text-sm text-ink-muted'>Hover me</p>
            </div>
          </DsStage>
          <DsStage label='Never: agenda rows, FAQ accordions, inputs, dense surfaces'>
            <div className='border-t-2 border-ink'>
              <div className='flex items-center gap-4 border-b-2 border-ink py-3'>
                <span className='chip-pop !px-2 !py-0.5 !text-xs'>09:30</span>
                <p className='text-sm font-bold text-ink'>Welcome</p>
              </div>
              <div className='flex items-center gap-4 border-b-2 border-ink py-3'>
                <span className='chip-pop !px-2 !py-0.5 !text-xs'>10:00</span>
                <p className='text-sm font-bold text-ink'>Opening keynote</p>
              </div>
            </div>
          </DsStage>
        </div>
      </DsBlock>
    </DsSection>
  );
}
