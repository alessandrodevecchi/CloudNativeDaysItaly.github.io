import { ArrowUpRight } from 'lucide-react';
import { FONT_SIZE } from './tokens';
import { DsBlock, DsSection, DsToken } from './DsKit';

/*
 * Foundations: tipografia. Le scale sono rese davvero con le classi del
 * sito; i valori clamp arrivano da tailwind.config.mjs.
 */

const DISPLAY_SCALE = [
  { token: 'text-display', className: 'text-display', sample: '2027', use: 'Hero display, one per page.' },
  { token: 'text-section', className: 'text-section', sample: 'Be part of it', use: 'Section titles (h2).' },
  { token: 'text-stat', className: 'text-stat', sample: '285', use: 'Numbers, prices, timeline years.' },
  { token: 'text-stamp', className: 'text-stamp', sample: 'Save the date', use: 'Stamps and badges.' },
];

const BODY_SCALE = [
  { className: 'text-xl', label: 'Lead paragraph', weight: 'font-normal', note: 'text-xl' },
  { className: 'text-base font-bold', label: 'Bold body, CTA and labels', weight: '', note: 'font-bold' },
  { className: 'text-base', label: 'Body copy, the default', weight: '', note: 'text-base' },
  { className: 'text-sm', label: 'Secondary copy and notes', weight: '', note: 'text-sm' },
  { className: 'text-xs font-bold uppercase tracking-widest', label: 'Overline label', weight: '', note: 'text-xs uppercase' },
];

export default function TypographySection() {
  return (
    <DsSection
      id='typography'
      tone='cream'
      eyebrow='Foundations'
      title='Typography'
      lead='Two typefaces, one rule that never bends: the display font is always uppercase and never runs a paragraph.'
    >
      <DsBlock
        title='Display scale'
        rule='Anton (Extenda in the official version) for titles, numbers and stamps. Always uppercase, never for body or UI copy.'
      >
        <div className='border-pop border-ink bg-white'>
          {DISPLAY_SCALE.map((step, i) => (
            <div key={step.token} className={`px-6 py-6 ${i > 0 ? 'border-t-2 border-ink' : ''}`}>
              <p className={`font-display uppercase text-ink ${step.className}`}>{step.sample}</p>
              <p className='mt-3 text-xs text-ink-muted'>
                <DsToken>{step.token}</DsToken> · {FONT_SIZE[step.token.replace('text-', '')][0]} · {step.use}
              </p>
            </div>
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title='Body scale'
        rule='Poppins for everything else: bold for calls to action and leads, regular for reading.'
      >
        <div className='border-pop border-ink bg-white'>
          {BODY_SCALE.map((step, i) => (
            <div
              key={step.label}
              className={`flex flex-wrap items-baseline justify-between gap-3 px-6 py-4 ${
                i > 0 ? 'border-t-2 border-ink' : ''
              }`}
            >
              <p className={`text-ink ${step.className} ${step.weight}`}>{step.label}</p>
              <DsToken>{step.note}</DsToken>
            </div>
          ))}
        </div>
      </DsBlock>

      <DsBlock title='The two typefaces' rule='One display, one text. No third font, ever.'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='card-pop p-6'>
            <p className='font-display text-3xl uppercase text-ink'>Extenda / Anton</p>
            <p className='mt-2 text-sm text-ink-soft'>
              Extenda is the official display typeface. It is licensed, so we cannot
              redistribute it: it never travels inside a logo pack or a zip. The site
              renders Anton, the substitute we picked for the web, and swaps to Extenda
              where the licence allows it.
            </p>
            <a
              href='https://fonts.google.com/specimen/Anton'
              target='_blank'
              rel='noopener noreferrer'
              className='mt-4 inline-flex items-center gap-2 font-bold text-brand-blue transition-colors hover:text-brand-magenta'
            >
              Anton on Google Fonts
              <ArrowUpRight className='h-4 w-4' />
            </a>
          </div>
          <div className='card-pop p-6'>
            <p className='text-3xl font-bold text-ink'>Poppins</p>
            <p className='mt-2 text-sm text-ink-soft'>
              Body font for paragraphs, buttons, labels and every piece of interface
              copy. Regular for reading, bold for anything that has to be clicked or
              scanned. Free on Google Fonts, so it can travel with the assets.
            </p>
            <a
              href='https://fonts.google.com/specimen/Poppins'
              target='_blank'
              rel='noopener noreferrer'
              className='mt-4 inline-flex items-center gap-2 font-bold text-brand-blue transition-colors hover:text-brand-magenta'
            >
              Poppins on Google Fonts
              <ArrowUpRight className='h-4 w-4' />
            </a>
          </div>
        </div>
      </DsBlock>
    </DsSection>
  );
}
