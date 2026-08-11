import { Download } from 'lucide-react';

// Bottone download: con url scarica, senza url stato "coming soon"
// disabilitato — gli asset arrivano man mano che vengono prodotti.
// Condiviso da /brand-kit e dalla pagina design system, che lo mostra
// come esempio del pattern (mai una copia: il componente è questo).
export function DownloadButton({ item }) {
  if (!item.url) {
    return (
      <span className='inline-flex cursor-not-allowed items-center border-pop border-ink bg-gray-100 px-4 py-2 text-sm font-bold uppercase tracking-wide text-ink-muted'>
        <Download className='mr-2 h-4 w-4' />
        {item.label}
        <span className='ml-3 border border-ink bg-white px-2 py-0.5 text-xs text-brand-blue'>
          Soon
        </span>
      </span>
    );
  }
  return (
    <a
      href={item.url}
      download
      className='btn-pop btn-pop-secondary inline-flex items-center !px-4 !py-2 text-sm'
    >
      <Download className='mr-2 h-4 w-4' />
      {item.label}
    </a>
  );
}

export function DownloadList({ items }) {
  return (
    <div className='flex flex-wrap gap-3'>
      {items.map((item) => (
        <DownloadButton key={item.label} item={item} />
      ))}
    </div>
  );
}
