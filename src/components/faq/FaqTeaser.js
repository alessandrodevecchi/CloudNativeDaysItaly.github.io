import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DecorLayer from '@/components/decor/DecorLayer';

// Banda FAQ + newsletter (wireframe: 12-faq-newsletter). Il blocco
// newsletter è configurabile: finché non esiste una lista, mostra il
// fallback Telegram.
export default function FaqTeaser({ questions = [], newsletter }) {
  if (questions.length === 0 && !newsletter) return null;

  const signup = newsletter?.active
    ? newsletter.CTA
    : newsletter?.fallback;

  return (
    <section className='relative overflow-hidden bg-brand-blue py-16 lg:py-24' id='faq-teaser'>
      <DecorLayer
        items={[
          { pattern: 'cluster-duo', position: 'bottom-right', size: 'md' },
          { pattern: 'halftone', position: 'top-left', size: 'lg', className: 'opacity-20 invert' },
        ]}
      />
      <div className='relative z-10 mx-auto max-w-[1200px] px-6'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24'>
          <div>
            <span className='eyebrow text-brand-yellow'>Questions?</span>
            <h2 className='mt-2 font-display text-section uppercase text-white'>
              Good to know
            </h2>
            <ul className='mt-8 space-y-4'>
              {questions.map((q) => (
                <li key={q.question}>
                  <Link
                    href='/faq'
                    className='group flex items-center gap-2 text-lg font-bold text-white transition-colors hover:text-brand-yellow'
                  >
                    <ArrowRight className='h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1' />
                    {q.question}
                  </Link>
                </li>
              ))}
            </ul>
            <div className='mt-8'>
              <Link href='/faq' className='btn-pop bg-white text-ink inline-flex items-center'>
                All the answers
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </div>
          </div>
          {newsletter && (
            <div className='card-pop h-fit self-center bg-brand-yellow p-8'>
              <h3 className='font-display text-2xl uppercase text-ink'>
                {newsletter.title}
              </h3>
              <p className='mt-3 text-ink'>{newsletter.description}</p>
              {signup && (
                <div className='mt-6'>
                  <Link
                    href={signup.url}
                    target={signup.url.startsWith('http') ? '_blank' : undefined}
                    rel={signup.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className='btn-pop btn-pop-primary group inline-flex items-center'
                  >
                    {signup.label}
                    <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
