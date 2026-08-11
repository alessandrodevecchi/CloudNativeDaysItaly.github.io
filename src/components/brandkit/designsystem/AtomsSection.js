import { ArrowRight } from 'lucide-react';
import { SESSION_TYPE_ICONS, SessionTypeBadge } from '@/components/agenda/sessionTypes';
import { DsBlock, DsSection, DsStage, DsToken } from './DsKit';

/*
 * Atomi: bottoni, chip e tag, input. I tag di tipo sessione sono il vero
 * <SessionTypeBadge> con la mappa di src/components/agenda/sessionTypes.js,
 * non una replica: se cambia lì cambia qui.
 */

const BUTTONS = [
  { label: 'Get your ticket', className: 'btn-pop btn-pop-primary', token: 'btn-pop-primary', use: 'Primary action in the content. One per block.' },
  { label: 'Read the agenda', className: 'btn-pop btn-pop-secondary', token: 'btn-pop-secondary', use: 'Secondary action, next to a primary one. Documents and downloads use this one too, with a Download icon.' },
  { label: 'Submit a talk', className: 'btn-pop bg-brand-yellow text-ink', token: 'btn-pop bg-brand-yellow', use: 'Primary action in the navbar only.' },
  { label: 'Save your seat', className: 'btn-pop btn-pop-dark', token: 'btn-pop-dark', use: 'Ink button. Belongs on the ink band, where it takes the white companions below. Available, not in use anywhere yet.' },
];

// Stato hover reso staticamente: .btn-pop hover trasla di 2px e riduce
// l'ombra. Affiancato al riposo, altrimenti non si capisce cosa deve fare.
const HOVER_CLASSES = 'translate-x-[2px] translate-y-[2px] shadow-pop-sm';

// Badge di stato dei ticket. Le classi vivono in
// src/components/tickets/TicketsSection.js (componente client con le date):
// qui sono i tre stati messi in fila per confronto.
const TICKET_BADGES = [
  { label: 'On Sale', className: 'border border-ink bg-brand-yellow px-2 py-0.5 text-xs font-bold uppercase text-ink' },
  { label: 'Upcoming', className: 'border border-ink bg-white px-2 py-0.5 text-xs font-bold uppercase text-brand-blue' },
  { label: 'Not Available', className: 'border border-ink bg-gray-200 px-2 py-0.5 text-xs font-bold uppercase text-ink-muted' },
];

export default function AtomsSection() {
  return (
    <DsSection
      id='atoms'
      tone='white'
      eyebrow='Building blocks'
      title='Atoms'
      lead='Buttons, chips, inputs. Small pieces stay neutral: the colour lives in the surface around them, except where it carries a meaning.'
    >
      <DsBlock
        title='Buttons'
        rule='Every button is uppercase, bold, square, with an ink border and a hard shadow. On hover it moves two pixels down and right and the shadow shrinks: it looks pressed.'
      >
        <div className='space-y-4'>
          {BUTTONS.map((button) => (
            <div
              key={button.token}
              className='grid grid-cols-1 items-center gap-4 border-pop border-ink bg-white p-6 md:grid-cols-[1fr_1fr_1.2fr]'
            >
              <div>
                <span className={button.className}>{button.label}</span>
                <p className='mt-3 text-xs font-bold uppercase tracking-widest text-ink-muted'>
                  Resting
                </p>
              </div>
              <div>
                <span className={`${button.className} ${HOVER_CLASSES}`}>{button.label}</span>
                <p className='mt-3 text-xs font-bold uppercase tracking-widest text-ink-muted'>
                  Hover
                </p>
              </div>
              <div>
                <DsToken>{button.token}</DsToken>
                <p className='mt-2 text-sm text-ink-soft'>{button.use}</p>
              </div>
            </div>
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title='Buttons on the ink band'
        rule='Against ink, a black border and a black shadow disappear into the background. The modifier turns both white and it goes next to a variant, it does not replace it. On blue and magenta nothing changes: there the black shadow still reads.'
      >
        <div className='border-pop border-ink bg-ink p-8'>
          <div className='flex flex-wrap items-center gap-6'>
            <span className='btn-pop btn-pop-secondary btn-pop-on-ink'>Get your ticket</span>
            <span className='btn-pop btn-pop-dark btn-pop-on-ink'>Save your seat</span>
            <a
              href='#atoms'
              className='group inline-flex items-center gap-2 text-lg font-bold text-brand-yellow transition-colors hover:text-white'
            >
              Get directions
              <ArrowRight className='h-5 w-5 transition-transform group-hover:translate-x-1' />
            </a>
          </div>
          <p className='mt-6 text-sm text-white/70'>
            White filled is the loud one, ink with a white outline is the quiet one, and
            the yellow bold link is what the venue band uses today: a button here is for
            an action worth stopping for, not for every link.
          </p>
        </div>
        <p className='mt-3 text-sm text-ink-muted'>
          <DsToken>btn-pop btn-pop-secondary btn-pop-on-ink</DsToken> ·{' '}
          <DsToken>btn-pop btn-pop-dark btn-pop-on-ink</DsToken>
        </p>
      </DsBlock>

      <DsBlock
        title='Chips and tags'
        rule='Colour in a tag is allowed only when it means something. A tag that just decorates is white with an ink border.'
      >
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <DsStage label='Generic chip: chip-pop'>
            <div className='flex flex-wrap gap-2'>
              <span className='chip-pop'>Kubernetes</span>
              <span className='chip-pop'>Platform engineering</span>
            </div>
          </DsStage>
          <DsStage label='Session types: the colour follows the type'>
            <div className='flex flex-wrap gap-2'>
              {Object.keys(SESSION_TYPE_ICONS).map((type) => (
                <SessionTypeBadge key={type} type={type} />
              ))}
            </div>
          </DsStage>
          <DsStage label='Ticket status: yellow live, white upcoming, grey closed'>
            <div className='flex flex-wrap items-center gap-2'>
              {TICKET_BADGES.map((badge) => (
                <span key={badge.label} className={badge.className}>
                  {badge.label}
                </span>
              ))}
            </div>
          </DsStage>
        </div>
      </DsBlock>

      <DsBlock
        title='Anchor chips'
        rule='In page navigation: bordered chips on the hero, hover inverts to ink and white.'
      >
        <div className='flex flex-wrap gap-2'>
          {['Colour', 'Typography', 'Atoms'].map((label) => (
            <span
              key={label}
              className='border-pop border-ink bg-white px-3 py-1 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white'
            >
              {label}
            </span>
          ))}
        </div>
      </DsBlock>

      <DsBlock
        title='Inputs'
        rule='Square, ink border, no shadow. The focus ring is blue: it is the only place where blue behaves like a system colour.'
      >
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='card-pop p-6'>
            <label
              htmlFor='ds-input-sample'
              className='text-sm font-bold uppercase tracking-wide text-ink'
            >
              Your name
            </label>
            <input
              id='ds-input-sample'
              type='text'
              placeholder='Ada Lovelace'
              className='mt-2 w-full border-pop border-ink bg-white px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue'
            />
            <p className='mt-3 text-xs text-ink-muted'>
              Label above, bold and uppercase. Helper text below in{' '}
              <DsToken>text-ink-muted</DsToken>.
            </p>
          </div>
          <div className='card-pop flex flex-col justify-center p-6'>
            <p className='text-sm text-ink-soft'>
              A form ends with one action, and that action is a button, not a link.
            </p>
            <span className='btn-pop btn-pop-primary mt-4 inline-flex w-fit items-center'>
              Send
              <ArrowRight className='ml-2 h-4 w-4' />
            </span>
          </div>
        </div>
      </DsBlock>
    </DsSection>
  );
}
