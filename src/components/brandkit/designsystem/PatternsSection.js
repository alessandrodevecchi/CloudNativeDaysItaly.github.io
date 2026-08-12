import { ArrowRight, Download } from 'lucide-react';
import BrandRings from '@/components/decor/BrandRings';
import { DsBlock, DsSection, DsToken } from './DsKit';

/*
 * Pattern: le combinazioni ricorrenti. Il ritmo delle bande è la sequenza
 * vera della home, nell'ordine in cui i componenti stanno in
 * src/app/(home)/page.js.
 */

const HOME_BANDS = [
  { label: 'Hero', surface: 'bg-white', text: 'text-ink' },
  { label: 'Numbers', surface: 'bg-ink', text: 'text-white' },
  { label: 'About the event', surface: 'bg-white', text: 'text-ink' },
  { label: 'Photo strip, images only', surface: 'bg-brand-magenta', text: 'text-white' },
  { label: 'Theme, off in config', surface: 'bg-brand-yellow', text: 'text-ink', off: true },
  { label: 'What to expect', surface: 'bg-white', text: 'text-ink' },
  { label: 'Call for Papers', surface: 'bg-brand-blue', text: 'text-white' },
  { label: 'Agenda at a glance', surface: 'bg-white', text: 'text-ink' },
  { label: 'Tickets', surface: 'bg-cream', text: 'text-ink' },
  { label: 'Sponsors', surface: 'bg-white', text: 'text-ink' },
  { label: 'Venue', surface: 'bg-ink', text: 'text-white' },
  { label: 'Communities', surface: 'bg-white', text: 'text-ink' },
  { label: 'FAQ and newsletter', surface: 'bg-brand-blue', text: 'text-white' },
];

// Quattro pesi della stessa texture, registrati in DecorLayer. L'asset è
// grigio chiarissimo: su fondo chiaro resta appena percepibile, su banda
// colorata si aggiunge `invert` e diventa scuro.
const HALFTONES = [
  { name: 'halftone', file: '/images/pattern_halftone.svg', note: 'The brand book original. Diagonal blob, the biggest dots, the loudest of the four.' },
  { name: 'halftone-b', file: '/images/pattern_halftone_b.svg', note: 'Rectangular field, medium density fading to the bottom right.' },
  { name: 'halftone-c', file: '/images/pattern_halftone_c.svg', note: 'The sparsest. For dense sections where the texture must not compete.' },
  { name: 'halftone-d', file: '/images/pattern_halftone_d.svg', note: 'The densest, strong gradient from one corner. Holds tall bands.' },
];

const CLUSTERS = [
  { name: 'duo', note: 'The minimum accent. Two rings, never one.' },
  { name: 'a', note: 'Big tricolour ring with a satellite.' },
  { name: 'c', note: 'Large duotone pair.' },
  { name: 'd', note: 'Diagonal trio, small to large to small.' },
  { name: 'e', note: 'Giant ring with a close satellite.' },
  { name: 'dot', note: 'Single ring: only next to another cluster, never alone in a corner.' },
];

export default function PatternsSection() {
  return (
    <DsSection
      id='patterns'
      tone='cream'
      eyebrow='Put together'
      title='Patterns'
      lead='How the pieces behave next to each other: which button in which context, what happens on hover, where decorations go, and the order of the bands down a page.'
    >
      <DsBlock
        title='Calls to action by context'
        rule='The colour of a call to action depends on the surface it sits on, not on the kind of action. The same action can be yellow in the navbar and magenta in the content, and that is on purpose. The fourth context is the ink band, where borders and shadows turn white: it is in the atoms section.'
      >
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='border-pop border-ink bg-white'>
            <div className='flex items-center justify-between gap-3 border-b-2 border-ink bg-white px-4 py-3'>
              <span className='font-display text-sm uppercase text-ink'>CND Italy</span>
              <span className='flex items-center gap-2'>
                <span className='btn-pop bg-brand-yellow text-ink inline-flex items-center !px-3 !py-1.5 !text-xs'>
                  Tickets
                  <ArrowRight className='ml-1 h-3 w-3' />
                </span>
                <span className='btn-pop btn-pop-secondary !px-3 !py-1.5 !text-xs'>CFP</span>
              </span>
            </div>
            <p className='px-4 py-3 text-sm text-ink-soft'>
              Navbar: yellow primary, white secondary. Yellow keeps the bar readable over
              the magenta scrolling underneath.
            </p>
          </div>

          <div className='border-pop border-ink bg-white'>
            <div className='flex flex-wrap items-center gap-3 border-b-2 border-ink p-4'>
              <span className='btn-pop btn-pop-primary !px-3 !py-1.5 !text-xs'>Get tickets</span>
              <span className='btn-pop btn-pop-secondary !px-3 !py-1.5 !text-xs'>Agenda</span>
              <span className='btn-pop btn-pop-secondary inline-flex items-center !px-3 !py-1.5 !text-xs'>
                <Download className='mr-1 h-3 w-3' />
                Report
              </span>
            </div>
            <p className='px-4 py-3 text-sm text-ink-soft'>
              Content: magenta primary, white secondary. One magenta per block. A document
              is a white button with the Download icon: the icon carries the meaning, not a
              colour of its own.
            </p>
          </div>

          <div className='border-pop border-ink bg-white'>
            <div className='border-b-2 border-ink bg-brand-yellow p-4'>
              <p className='font-display text-lg uppercase text-ink'>Become a sponsor</p>
              <span className='btn-pop btn-pop-primary mt-3 inline-block !px-3 !py-1.5 !text-xs'>
                Contact us
              </span>
            </div>
            <p className='px-4 py-3 text-sm text-ink-soft'>
              Yellow surface: the yellow is the container of the invitation, the button
              inside stays magenta.
            </p>
          </div>
        </div>
      </DsBlock>

      <DsBlock
        title='Hover: two patterns and nothing else'
        rule='Cards lift. Menu items and coloured card footers invert. Anything else stays still.'
      >
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='border-pop border-ink bg-white p-6'>
            <div className='card-pop p-6 transition-all duration-100 hover:-translate-y-[2px] hover:shadow-pop'>
              <p className='font-bold text-ink'>Lift</p>
              <p className='mt-1 text-sm text-ink-muted'>
                Translate up two pixels, the shadow appears.
              </p>
            </div>
          </div>
          <div className='border-pop border-ink bg-white p-6'>
            <div className='border-pop border-ink'>
              {['Speakers', 'Sponsors'].map((item) => (
                <span
                  key={item}
                  className='block border-b-2 border-ink px-4 py-3 font-bold text-ink transition-colors last:border-b-0 hover:bg-ink hover:text-white'
                >
                  {item}
                </span>
              ))}
            </div>
            <p className='mt-3 text-sm text-ink-muted'>
              Invert: ink background, white text. Hover one of the two rows.
            </p>
          </div>
        </div>
      </DsBlock>

      <DsBlock
        title='Ring clusters'
        rule='At least two elements in a decorated section, never a lonely ring in a corner, smaller sizes below the md breakpoint.'
      >
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
          {CLUSTERS.map((cluster) => (
            <div key={cluster.name} className='flex flex-col border-pop border-ink bg-white'>
              <div className='flex items-center justify-center p-4'>
                <BrandRings cluster={cluster.name} className='w-full' />
              </div>
              <p className='border-t-2 border-ink px-3 py-2 text-xs text-ink-soft'>
                <span className='font-bold text-ink'>{cluster.name}</span> · {cluster.note}
              </p>
            </div>
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title='Halftone'
        rule='Four weights of the same texture, picked by density exactly like the ring clusters. They live at 20 to 30 percent opacity, keep a larger scale that is not reduced on mobile, and can sit in the middle of a band.'
      >
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          {HALFTONES.map((pattern) => (
            <div key={pattern.name} className='flex flex-col border-pop border-ink bg-white'>
              <div className='flex items-center justify-center bg-brand-blue p-4'>
                <img
                  src={pattern.file}
                  alt=''
                  aria-hidden='true'
                  className='w-full invert'
                />
              </div>
              <p className='border-t-2 border-ink px-3 py-2 text-xs text-ink-soft'>
                <span className='font-bold text-ink'>{pattern.name}</span> · {pattern.note}
              </p>
            </div>
          ))}
        </div>
        <p className='mt-3 text-sm text-ink-muted'>
          Shown at full strength to compare the four. In a page they never go above 30
          percent.
        </p>

        <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='relative overflow-hidden border-pop border-ink bg-brand-blue p-8'>
            <img
              src='/images/pattern_halftone.svg'
              alt=''
              aria-hidden='true'
              className='pointer-events-none absolute -right-10 -top-10 w-64 opacity-20 invert'
            />
            <p className='relative z-10 font-display text-xl uppercase text-white'>
              On a colour band
            </p>
            <p className='relative z-10 mt-2 text-sm text-white'>
              The asset is a very light grey, so on blue, magenta or ink it takes{' '}
              <span className='font-bold'>invert</span>: it turns dark and appears. Kept at{' '}
              <span className='font-bold'>opacity-20</span> so the text stays first.
            </p>
          </div>
          <div className='relative overflow-hidden border-pop border-ink bg-white p-8'>
            <img
              src='/images/pattern_halftone_c.svg'
              alt=''
              aria-hidden='true'
              className='pointer-events-none absolute -right-10 -top-10 w-64 opacity-25'
            />
            <p className='relative z-10 font-display text-xl uppercase text-ink'>
              On white and cream
            </p>
            <p className='relative z-10 mt-2 text-sm text-ink-soft'>
              No invert here: the grey stays light and the texture is barely there, which is
              the point. If you can read it as a shape, it is too strong.
            </p>
          </div>
        </div>
      </DsBlock>

      <DsBlock
        title='Where they live'
        rule='What is ours travels, what is licensed does not.'
      >
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='border-pop border-ink bg-white p-8'>
            <p className='font-display text-xl uppercase text-ink'>Ours</p>
            <p className='mt-2 text-sm text-ink-soft'>
              Rings and halftone are ours: the two base patterns are downloadable in the
              brand kit, the four halftone weights and the ring clusters live in the code
              and are documented here.
            </p>
            <p className='mt-3 text-sm text-ink-muted'>
              Layer: <DsToken>src/components/decor/DecorLayer.js</DsToken>, ten curated hero
              compositions in <DsToken>heroVariants.js</DsToken>.
            </p>
          </div>
          <div className='border-pop border-ink bg-white p-8'>
            <p className='font-display text-xl uppercase text-ink'>Not ours</p>
            <p className='mt-2 text-sm text-ink-soft'>
              The decorative elements on the social cards (donuts, diamonds, stars, clouds)
              are licensed material we cannot redistribute: the card generator is the way to
              get graphics that use them.
            </p>
          </div>
        </div>
      </DsBlock>

      <DsBlock
        title='Band rhythm'
        rule='Never two strong colours touching. Two light bands are separated by an ink border, and yellow is an accent, not a band: the theme band is the one declared exception and it is off in config.'
      >
        <div className='border-pop border-ink'>
          {HOME_BANDS.map((band, i) => (
            <div
              key={band.label}
              className={`flex items-center justify-between gap-4 px-6 py-3 ${band.surface} ${
                i > 0 ? 'border-t-2 border-ink' : ''
              }`}
            >
              <p className={`text-sm font-bold uppercase tracking-widest ${band.text}`}>
                {band.label}
              </p>
              {band.off && (
                <span className='border border-ink bg-white px-2 py-0.5 text-xs font-bold uppercase text-brand-blue'>
                  Off
                </span>
              )}
            </div>
          ))}
        </div>
        <p className='mt-3 text-sm text-ink-muted'>
          This is the home page from top to bottom, in the order the components sit in{' '}
          <DsToken>src/app/(home)/page.js</DsToken>.
        </p>
      </DsBlock>
    </DsSection>
  );
}
