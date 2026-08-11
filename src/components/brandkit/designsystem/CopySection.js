import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DsDocsLink, DsSection } from './DsKit';

/*
 * Chiusura: regole di copy e rimando alle regole complete. La pagina porta
 * gli esempi, docs/design-system.md porta le regole.
 */

const COPY_RULES = [
  {
    title: 'No em dash, no en dash',
    text: 'A comma, a colon or a pair of brackets. It reads better and it survives every copy and paste.',
  },
  {
    title: 'Display is always uppercase',
    text: 'Titles, numbers and stamps in capitals. Never a paragraph, never a button label longer than a few words.',
  },
  {
    title: 'Short fields stay short',
    text: 'Card headlines are two lines and the generator enforces the limit. A title that has to be shrunk to fit is a title to rewrite.',
  },
  {
    title: 'Say what happens next',
    text: 'A call to action names the action: submit a talk, get your ticket, contact us. Not "click here", not "learn more".',
  },
  {
    title: 'Plain and warm',
    text: 'We are a community event, not a vendor keynote. No hype, no superlatives, no exclamation marks in a row.',
  },
  {
    title: 'One voice for numbers',
    text: 'Numbers come from a source we can point at, and we say which edition they belong to.',
  },
];

export default function CopySection() {
  return (
    <DsSection
      id='copy'
      tone='blue'
      eyebrow='Words'
      title='Copy'
      lead='The visual system holds only if the writing follows it. Six rules, and the last word goes to the rules file.'
    >
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {COPY_RULES.map((rule) => (
          <div key={rule.title} className='card-pop p-6'>
            <p className='font-display text-lg uppercase text-ink'>{rule.title}</p>
            <p className='mt-2 text-sm text-ink-soft'>{rule.text}</p>
          </div>
        ))}
      </div>

      <div className='card-pop bg-brand-yellow p-8 shadow-pop-lg'>
        <p className='font-display text-2xl uppercase text-ink'>
          The rules live in the repository
        </p>
        <p className='mt-3 max-w-2xl text-ink-soft'>
          This page shows what the system looks like. The rules behind it, the when and the
          why, are in docs/design-system.md, next to the code: that is the file to read
          before changing anything, and the file to update when a rule changes.
        </p>
        <div className='mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
          <DsDocsLink label='Read docs/design-system.md' className='!text-ink' />
          <Link href='/brand-kit' className='btn-pop btn-pop-primary inline-flex items-center'>
            Back to the brand kit
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </div>
      </div>
    </DsSection>
  );
}
