import Image from 'next/image';
import { Mic, Star } from 'lucide-react';
import BrandRings from '@/components/decor/BrandRings';
import { SessionTypeBadge } from '@/components/agenda/sessionTypes';
import { DsCase, DsCompare, DsSection } from './DsKit';

/*
 * Do e Don't. Sono errori fatti davvero durante il redesign e poi
 * corretti, non teoria: ognuno è reso coi componenti e le classi vere.
 */

export default function DoDontSection() {
  return (
    <DsSection
      id='do-dont'
      tone='white'
      eyebrow='Learn from us'
      title="Do and don't"
      lead='Ten mistakes we made while building this design system, next to the fix. If you are in doubt about something, it is probably one of these.'
    >
      <div className='space-y-6'>
        <DsCompare title='1. Eyebrow on an action section'>
          <DsCase
            kind='dont'
            note='The magenta eyebrow makes a section that asks for something read like a paragraph of information.'
          >
            <div className='w-full bg-white p-4'>
              <span className='eyebrow text-brand-magenta'>Call for papers</span>
              <p className='mt-2 font-display text-2xl uppercase text-ink'>
                You could be on this stage
              </p>
            </div>
          </DsCase>
          <DsCase kind='do' note='The stamp marks it as an action section, like Tickets and Become a Sponsor.'>
            <div className='w-full bg-white p-4'>
              <span className='stamp'>Call for papers</span>
              <p className='mt-4 font-display text-2xl uppercase text-ink'>
                You could be on this stage
              </p>
            </div>
          </DsCase>
        </DsCompare>

        <DsCompare title='2. A single ring in a corner'>
          <DsCase kind='dont' note='One lonely ring reads as a mistake in the layout, not as a decoration.'>
            <div className='relative h-32 w-full overflow-hidden border-pop border-ink bg-white'>
              <BrandRings cluster='dot' className='absolute -right-6 -top-6 w-20' />
            </div>
          </DsCase>
          <DsCase kind='do' note='At least two elements, so it reads as a composition. The duo cluster is the minimum.'>
            <div className='relative h-32 w-full overflow-hidden border-pop border-ink bg-white'>
              <BrandRings cluster='duo' className='absolute -right-8 -top-8 w-28' />
            </div>
          </DsCase>
        </DsCompare>

        <DsCompare title='3. Two white bands touching'>
          <DsCase kind='dont' note='Two white sections in a row collapse into one long section: the reader loses the rhythm.'>
            <div className='w-full'>
              <div className='bg-white px-4 py-6 text-center text-sm font-bold text-ink'>
                White section
              </div>
              <div className='bg-white px-4 py-6 text-center text-sm font-bold text-ink'>
                White section
              </div>
            </div>
          </DsCase>
          <DsCase kind='do' note='Cream in between, or an ink border where the two light bands meet.'>
            <div className='w-full'>
              <div className='bg-white px-4 py-6 text-center text-sm font-bold text-ink'>
                White section
              </div>
              <div className='border-t-2 border-ink bg-cream px-4 py-6 text-center text-sm font-bold text-ink'>
                Cream section
              </div>
            </div>
          </DsCase>
        </DsCompare>

        <DsCompare title='4. Soft shadows'>
          <DsCase kind='dont' note='A blurred shadow belongs to another design language. It looks like a bug next to a hard one.'>
            <div className='border-2 border-ink bg-white p-6 shadow-lg'>
              <p className='font-bold text-ink'>shadow-lg</p>
            </div>
          </DsCase>
          <DsCase kind='do' note='A hard block, offset, no blur. Three sizes, same direction.'>
            <div className='border-pop border-ink bg-white p-6 shadow-pop'>
              <p className='font-bold text-ink'>shadow-pop</p>
            </div>
          </DsCase>
        </DsCompare>

        <DsCompare title='5. Display font in lowercase'>
          <DsCase kind='dont' note='The display face was drawn for capitals. In lowercase it loses the weight that makes it work.'>
            <p className='font-display text-2xl normal-case text-ink'>Be part of it</p>
          </DsCase>
          <DsCase kind='do' note='Always uppercase, and only for titles, numbers and stamps.'>
            <p className='font-display text-2xl uppercase text-ink'>Be part of it</p>
          </DsCase>
        </DsCompare>

        <DsCompare title='6. Em dash and en dash'>
          <DsCase kind='dont' note='Dashes as punctuation are not part of our voice, and they break when copy travels through other systems.'>
            <p className='text-ink-soft'>
              Two days of talks{' '}
              <span className='bg-brand-magenta px-2 text-lg font-bold leading-none text-white'>&#8212;</span> and one
              long evening{' '}
              <span className='bg-brand-magenta px-2 text-lg font-bold leading-none text-white'>&#8211;</span> in
              Bologna.
            </p>
          </DsCase>
          <DsCase kind='do' note='A comma, a colon or a pair of brackets. Shorter sentences work even better.'>
            <p className='text-ink-soft'>
              Two days of talks, and one long evening, in Bologna.
            </p>
          </DsCase>
        </DsCompare>

        <DsCompare title='7. Black shadow on the ink band'>
          <DsCase kind='dont' note='Border and shadow are ink and so is the band: they disappear, and with them the shape of the button and the press effect on hover.'>
            <div className='flex w-full items-center justify-center bg-ink p-8'>
              <span className='btn-pop btn-pop-secondary !px-4 !py-2 text-sm'>
                Get your ticket
              </span>
            </div>
          </DsCase>
          <DsCase kind='do' note='On the ink band border and shadow turn white, with btn-pop-on-ink. The venue photo frame already works this way.'>
            <div className='flex w-full items-center justify-center bg-ink p-8'>
              <span className='btn-pop btn-pop-secondary btn-pop-on-ink !px-4 !py-2 text-sm'>
                Get your ticket
              </span>
            </div>
          </DsCase>
        </DsCompare>

        <DsCompare title='8. White logo on yellow'>
          <DsCase kind='dont' note='Not enough contrast: the cloud disappears and the wordmark goes grey.'>
            <div className='flex w-full items-center justify-center bg-brand-yellow p-6'>
              <Image
                src='/images/Logo_CND_W.svg'
                alt='Cloud Native Days Italy logo, white version, on yellow'
                width={170}
                height={110}
              />
            </div>
          </DsCase>
          <DsCase kind='do' note='On yellow the ink version is the safest, and the colour one works too. Keep the white version for blue, magenta and ink.'>
            <div className='flex w-full items-center justify-center bg-brand-yellow p-6'>
              <Image
                src='/images/logo-ink.webp'
                alt='Cloud Native Days Italy logo, ink version, on yellow'
                width={170}
                height={110}
              />
            </div>
          </DsCase>
        </DsCompare>

        <DsCompare title='9. Rounded corners'>
          <DsCase kind='dont' note='A radius softens everything the borders and the shadows are trying to say.'>
            <div className='rounded-xl border-2 border-ink bg-white p-6'>
              <p className='font-bold text-ink'>Rounded card</p>
              <span className='mt-3 inline-block rounded-lg bg-brand-magenta px-4 py-2 text-sm font-bold uppercase text-white'>
                Button
              </span>
            </div>
          </DsCase>
          <DsCase kind='do' note='Sharp corners everywhere. The only round shapes are the decorative rings.'>
            <div className='card-pop p-6'>
              <p className='font-bold text-ink'>Square card</p>
              <span className='btn-pop btn-pop-primary mt-3 inline-block !px-4 !py-2 text-sm'>
                Button
              </span>
            </div>
          </DsCase>
        </DsCompare>

        <DsCompare title='10. Tag colours picked by taste'>
          <DsCase kind='dont' note='If the colour does not carry a meaning, the reader learns nothing from it and stops trusting the tags.'>
            <div className='flex flex-wrap gap-2'>
              <span className='inline-flex items-center gap-1.5 border border-ink bg-brand-yellow px-2 py-1 text-xs font-bold uppercase text-ink'>
                <Star className='h-3.5 w-3.5' />
                keynote
              </span>
              <span className='inline-flex items-center gap-1.5 border border-ink bg-brand-magenta px-2 py-1 text-xs font-bold uppercase text-white'>
                <Mic className='h-3.5 w-3.5' />
                talk
              </span>
            </div>
          </DsCase>
          <DsCase kind='do' note='The colour and the icon follow the type, from the shared map in sessionTypes.js.'>
            <div className='flex flex-wrap gap-2'>
              <SessionTypeBadge type='keynote' />
              <SessionTypeBadge type='talk' />
            </div>
          </DsCase>
        </DsCompare>
      </div>
    </DsSection>
  );
}
