import Image from 'next/image';
import { X } from 'lucide-react';
import { DsBlock, DsSection } from './DsKit';

/*
 * Regole visuali del logo. Esiste UNA sola versione, nuvola + wordmark:
 * niente variante solo simbolo, niente quadrata. Se servisse, è una
 * decisione di brand, non un ritaglio.
 * Asset: /images/logo.webp (colore) e /images/Logo_CND_W.svg (bianco).
 */

const BACKGROUNDS = [
  { label: 'On white: colour version', surface: 'bg-white', logo: 'colour' },
  { label: 'On cream: colour version', surface: 'bg-cream', logo: 'colour' },
  { label: 'On ink: white version', surface: 'bg-ink', logo: 'white' },
  { label: 'On blue: white version', surface: 'bg-brand-blue', logo: 'white' },
  { label: 'On magenta: white version', surface: 'bg-brand-magenta', logo: 'white' },
  { label: 'On yellow: colour version', surface: 'bg-brand-yellow', logo: 'colour' },
];

const ColourLogo = ({ width = 200 }) => (
  <Image
    src='/images/logo.webp'
    alt='Cloud Native Days Italy logo'
    width={width}
    height={Math.round((width * 698.93) / 1080)}
  />
);

const WhiteLogo = ({ width = 200 }) => (
  <Image
    src='/images/Logo_CND_W.svg'
    alt='Cloud Native Days Italy logo, white version'
    width={width}
    height={Math.round((width * 698.93) / 1080)}
  />
);

const DontCard = ({ note, children }) => (
  <div className='flex flex-col border-pop border-ink bg-white'>
    <p className='flex items-center gap-2 border-b-2 border-ink bg-brand-magenta px-4 py-2 text-sm font-bold uppercase tracking-widest text-white'>
      <X className='h-4 w-4' />
      Don&apos;t
    </p>
    <div className='flex flex-1 items-center justify-center overflow-hidden p-6'>{children}</div>
    <p className='border-t-2 border-ink px-4 py-3 text-sm text-ink-soft'>{note}</p>
  </div>
);

export default function LogoSection() {
  return (
    <DsSection
      id='logo'
      tone='cream'
      eyebrow='Foundations'
      title='Logo'
      lead='There is one logo, the cloud with the wordmark, in a colour and a white version. There is no symbol only mark and no square mark: do not build one.'
    >
      <DsBlock
        title='Clear space and minimum size'
        rule='Keep free space around the logo at least as tall as the cloud, on all four sides. Nothing enters that area: no text, no ring, no photo edge.'
      >
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='border-pop border-ink bg-brand-yellow-light p-10'>
            <div className='flex items-center justify-center bg-white p-6'>
              <ColourLogo width={220} />
            </div>
            <p className='mt-4 text-center text-xs font-bold uppercase tracking-widest text-ink'>
              The yellow field is the clear space
            </p>
          </div>
          <div className='flex flex-col justify-center border-pop border-ink bg-white p-10'>
            <ColourLogo width={140} />
            <p className='mt-6 text-sm text-ink-soft'>
              Minimum size on screen: 140px wide, the size rendered here. In print keep
              the whole lockup at least 25mm wide. Below that the wordmark closes up and
              the pizza slice turns into a smudge.
            </p>
          </div>
        </div>
      </DsBlock>

      <DsBlock
        title='Which version on which background'
        rule='The white version needs a dark or saturated surface underneath. On yellow and cream the colour version is the only one that holds.'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {BACKGROUNDS.map((item) => (
            <div key={item.label} className='border-pop border-ink'>
              <div className={`flex h-32 items-center justify-center p-6 ${item.surface}`}>
                {item.logo === 'white' ? <WhiteLogo width={170} /> : <ColourLogo width={170} />}
              </div>
              <p className='border-t-2 border-ink bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-ink-muted'>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title='What breaks the logo'
        rule='The lockup is fixed. Scale it, place it, and stop there.'
      >
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <DontCard note='Stretched or squeezed. Scale both sides together, always.'>
            <div className='scale-x-125'>
              <ColourLogo width={150} />
            </div>
          </DontCard>
          <DontCard note='Recoloured. Blue, black, white: those are the versions that exist.'>
            <div className='[filter:hue-rotate(150deg)_saturate(1.4)]'>
              <ColourLogo width={150} />
            </div>
          </DontCard>
          <DontCard note='Blurred shadow behind it. Our shadows are hard blocks, and the logo carries none.'>
            <div className='drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]'>
              <ColourLogo width={150} />
            </div>
          </DontCard>
          <DontCard note='White version on yellow: not enough contrast. Switch to the colour version or change the surface.'>
            <div className='flex h-full w-full items-center justify-center bg-brand-yellow p-4'>
              <WhiteLogo width={150} />
            </div>
          </DontCard>
        </div>
      </DsBlock>
    </DsSection>
  );
}
