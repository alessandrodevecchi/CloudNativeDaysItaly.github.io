import { COLORS } from './tokens';
import { DsBlock, DsSection, DsToken } from './DsKit';

/*
 * Foundations: colore. I valori arrivano da tailwind.config.mjs, qui
 * stanno solo le righe d'uso (le regole complete in docs/design-system.md).
 */

const PALETTE = [
  {
    token: 'brand-blue',
    name: 'Blue',
    use: 'Identity. Hero dates and titles, Call for Papers band, FAQ band, links.',
    avoid: 'Primary action in the content: that one is magenta.',
  },
  {
    token: 'brand-magenta',
    name: 'Magenta',
    use: 'Action and accent. Primary CTA, prices, highlighted cards, accents on dark bands.',
    avoid: 'Section background with text on it. Allowed as an image only band, like the photo strip in home.',
  },
  {
    token: 'brand-yellow',
    name: 'Yellow',
    use: 'Accents and blocks. Chips, agenda time cells, titles on dark surfaces, invite boxes, navbar primary CTA.',
    avoid: 'Section band. The theme band is the one declared exception, an editorial one off.',
  },
  {
    token: 'brand-yellow-light',
    name: 'Yellow Light',
    use: 'Soft surfaces where full yellow shouts too much: notes, quotes, callouts.',
    avoid: 'Text colour, and anything that has to look like an action.',
  },
  {
    token: 'ink',
    name: 'Ink',
    use: 'Body text, every pop border, dark bands like the numbers strip and the venue.',
    avoid: 'Buttons sitting on a yellow surface: there magenta wins.',
  },
  {
    token: 'cream',
    name: 'Cream',
    use: 'Warm alternative band, tickets and photo wall. Separates two light sections.',
    avoid: 'Text colour. It is a surface.',
  },
];

const TEXT_SCALE = [
  { token: 'ink', label: 'Body text' },
  { token: 'ink-soft', label: 'Strong secondary' },
  { token: 'ink-muted', label: 'Secondary' },
  { token: 'ink-faint', label: 'Micro copy and captions' },
];

const PAIRS = [
  { label: 'White on blue', bg: 'brand-blue', text: '#FFFFFF' },
  { label: 'White on magenta', bg: 'brand-magenta', text: '#FFFFFF' },
  { label: 'White on ink', bg: 'ink', text: '#FFFFFF' },
  { label: 'Yellow on ink', bg: 'ink', text: COLORS['brand-yellow'] },
  { label: 'Ink on yellow', bg: 'brand-yellow', text: COLORS.ink },
  { label: 'Ink on cream', bg: 'cream', text: COLORS.ink },
];

export default function ColourSection() {
  return (
    <DsSection
      id='colour'
      tone='white'
      eyebrow='Foundations'
      title='Colour'
      lead='Six colours, one job each. The palette is flat by design: no gradients, no tints beyond the ones listed here.'
    >
      <DsBlock
        title='Palette'
        rule='Colour goes in large surfaces, atoms stay neutral. One magenta per block, and magenta never becomes a text band.'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {PALETTE.map((color) => (
            <div key={color.token} className='flex flex-col border-pop border-ink bg-white'>
              <div className='h-24' style={{ backgroundColor: COLORS[color.token] }} />
              <div className='flex flex-1 flex-col border-t-2 border-ink p-4'>
                <p className='font-display text-lg uppercase text-ink'>{color.name}</p>
                <p className='mt-1 text-xs uppercase text-ink-muted'>
                  {COLORS[color.token]} · <DsToken>{color.token}</DsToken>
                </p>
                <p className='mt-3 text-sm text-ink-soft'>
                  <span className='font-bold text-ink'>Use for: </span>
                  {color.use}
                </p>
                <p className='mt-2 text-sm text-ink-soft'>
                  <span className='font-bold text-brand-magenta'>Not for: </span>
                  {color.avoid}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title='Text hierarchy'
        rule='Four levels, in decreasing order. Never the default Tailwind greys.'
      >
        <div className='border-pop border-ink bg-white'>
          {TEXT_SCALE.map((step, i) => (
            <div
              key={step.token}
              className={`flex flex-wrap items-baseline justify-between gap-2 px-6 py-4 ${
                i > 0 ? 'border-t-2 border-ink' : ''
              }`}
            >
              <p className='text-lg font-bold' style={{ color: COLORS[step.token] }}>
                {step.label}
              </p>
              <p className='text-xs uppercase text-ink-muted'>
                <DsToken>text-{step.token}</DsToken> · {COLORS[step.token]}
              </p>
            </div>
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title='Contrast pairs'
        rule='These are the combinations that hold. Magenta on white is fine from 18px bold or in display, never for small text.'
      >
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
          {PAIRS.map((pair) => (
            <div
              key={pair.label}
              className='border-pop border-ink p-6'
              style={{ backgroundColor: COLORS[pair.bg], color: pair.text }}
            >
              <p className='font-display text-lg uppercase'>Aa</p>
              <p className='mt-1 text-sm font-bold'>{pair.label}</p>
            </div>
          ))}
        </div>
      </DsBlock>
    </DsSection>
  );
}
