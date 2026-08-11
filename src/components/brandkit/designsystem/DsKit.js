import { ArrowUpRight, Check, X } from 'lucide-react';

/*
 * Primitive della pagina /brand-kit/design-system.
 * La pagina mostra il design system usando le classi e i componenti veri
 * del sito: queste primitive impaginano gli esempi, non li ridefiniscono.
 * Le REGOLE vivono in docs/design-system.md, la pagina rimanda là.
 */

// docs/design-system.md nel repo pubblico: la pagina cita e rimanda, non
// duplica le regole.
export const DOCS_URL =
  'https://github.com/CloudNativeDaysItaly/CloudNativeDaysItaly.github.io/blob/main/docs/design-system.md';

const TONES = {
  white: { section: 'border-t-2 border-ink bg-white', eyebrow: 'text-brand-magenta', title: 'text-ink', lead: 'text-ink-muted' },
  cream: { section: 'border-t-2 border-ink bg-cream', eyebrow: 'text-brand-magenta', title: 'text-ink', lead: 'text-ink-muted' },
  blue: { section: 'bg-brand-blue', eyebrow: 'text-brand-yellow', title: 'text-white', lead: 'text-white' },
};

// Banda di sezione. Il ritmo della pagina alterna bianco e cream (mai due
// bande colorate forti adiacenti, bordo netto tra due bande chiare).
export function DsSection({ id, eyebrow, title, lead, tone = 'white', children }) {
  const t = TONES[tone] || TONES.white;
  return (
    <section id={id} className={`${t.section} py-16 lg:py-24`}>
      <div className='mx-auto max-w-[1200px] px-6'>
        <span className={`eyebrow ${t.eyebrow}`}>{eyebrow}</span>
        <h2 className={`mt-2 font-display text-section uppercase ${t.title}`}>{title}</h2>
        {lead && <p className={`mt-4 max-w-3xl text-lg ${t.lead}`}>{lead}</p>}
        <div className='mt-12 space-y-12'>{children}</div>
      </div>
    </section>
  );
}

// Blocco di esempio: titolo corto, la regola in una riga, gli esempi sotto.
export function DsBlock({ title, rule, children }) {
  return (
    <div>
      <h3 className='font-display text-xl uppercase text-ink'>{title}</h3>
      {rule && <p className='mt-2 max-w-3xl text-sm text-ink-soft'>{rule}</p>}
      <div className='mt-6'>{children}</div>
    </div>
  );
}

// Palco neutro per un esempio: superficie bianca bordata, niente ombra
// (l'ombra la mette l'esempio se la regola lo prevede).
export function DsStage({ label, className = '', children, surface = 'bg-white' }) {
  return (
    <div className='border-pop border-ink'>
      <div className={`${surface} p-6 ${className}`}>{children}</div>
      {label && (
        <p className='border-t-2 border-ink bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-ink-muted'>
          {label}
        </p>
      )}
    </div>
  );
}

// Riga di codice: nome di classe o token, mai riscritto a mano nel testo.
export function DsToken({ children }) {
  return (
    <code className='border border-ink bg-cream px-1.5 py-0.5 text-xs font-bold normal-case text-ink'>
      {children}
    </code>
  );
}

// Coppia sbagliato/corretto. I due casi stanno affiancati e ognuno porta
// l'esempio reso, non la descrizione dell'esempio.
export function DsCompare({ title, children }) {
  return (
    <div className='border-pop border-ink bg-white'>
      <p className='border-b-2 border-ink px-6 py-3 font-display text-lg uppercase text-ink'>
        {title}
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2'>{children}</div>
    </div>
  );
}

export function DsCase({ kind = 'do', note, children }) {
  const bad = kind === 'dont';
  return (
    <div className={`flex flex-col ${bad ? 'border-b-2 border-ink md:border-b-0 md:border-r-2' : ''}`}>
      <p
        className={`flex items-center gap-2 px-6 py-2 text-sm font-bold uppercase tracking-widest text-white ${
          bad ? 'bg-brand-magenta' : 'bg-brand-blue'
        }`}
      >
        {bad ? <X className='h-4 w-4' /> : <Check className='h-4 w-4' />}
        {bad ? "Don't" : 'Do'}
      </p>
      <div className='flex flex-1 items-center justify-center bg-white p-6'>{children}</div>
      {note && <p className='border-t-2 border-ink px-6 py-3 text-sm text-ink-soft'>{note}</p>}
    </div>
  );
}

// Link alle regole: la pagina porta gli esempi, il markdown porta le regole.
export function DsDocsLink({ label = 'Read the rules', className = '' }) {
  return (
    <a
      href={DOCS_URL}
      target='_blank'
      rel='noopener noreferrer'
      className={`inline-flex items-center gap-2 font-bold text-brand-blue transition-colors hover:text-brand-magenta ${className}`}
    >
      {label}
      <ArrowUpRight className='h-4 w-4' />
    </a>
  );
}
