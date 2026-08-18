import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DecorLayer from '@/components/decor/DecorLayer';
import SocialIcons from '@/components/social/SocialIcons';

/*
 * Pagina 404. Nell'export statico diventa `out/404.html`, che è il file che
 * GitHub Pages serve per ogni indirizzo inesistente.
 *
 * In sviluppo un indirizzo di primo livello che non esiste (per esempio
 * /qualcosa) non arriva qui: la rotta dinamica /[year] lo intercetta e, con
 * `output: export`, Next segnala che il parametro non è tra quelli generati.
 * È un limite del dev server, in produzione il file 404.html risponde.
 *
 * Per vederla in locale come la serve GitHub Pages: `npm run preview` (build
 * più server statico sulla 4040) e poi un indirizzo qualsiasi che non esiste,
 * per esempio http://localhost:4040/qualcosa.
 */

// Dove finisce di solito chi cerca qualcosa che non trova
const LINKS = [
  { href: '/agenda', label: 'Agenda' },
  { href: '/speakers', label: 'Speakers' },
  { href: '/content-hub', label: 'Content hub' },
  { href: '/faq', label: 'FAQ' },
];

export default function NotFound() {
  return (
    <div className='relative overflow-hidden bg-white'>
      <DecorLayer
        items={[
          { pattern: 'cluster-duo', position: 'top-right', size: 'lg' },
          { pattern: 'halftone-c', position: 'bottom-left', size: 'lg', className: 'opacity-25' },
        ]}
      />
      <div className='relative z-10 mx-auto max-w-[1200px] px-6 py-16 pt-32 md:py-24 md:pt-40'>
        <div className='max-w-3xl'>
          <span className='stamp'>Error 404</span>
          <h1 className='section-heading mt-6'>This page is not on the programme</h1>
          <p className='mt-6 text-lg text-ink-soft'>
            The address does not exist, or the page has moved since the link was
            written. Nothing is broken on your side.
          </p>

          <div className='mt-10 flex flex-wrap items-center gap-4'>
            <Link href='/' className='btn-pop btn-pop-primary inline-flex items-center gap-2'>
              Back to the homepage
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <p className='mt-12 text-xs font-bold uppercase tracking-widest text-ink-muted'>
            Or jump to
          </p>
          <ul className='mt-4 flex flex-wrap gap-x-8 gap-y-3'>
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className='inline-flex items-center gap-2 font-bold text-brand-blue transition-colors hover:text-brand-magenta'
                >
                  {link.label}
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </li>
            ))}
          </ul>

          <p className='mt-12 text-xs font-bold uppercase tracking-widest text-ink-muted'>
            Follow us
          </p>
          <SocialIcons className='mt-4 flex flex-wrap gap-5' />
        </div>
      </div>
    </div>
  );
}
