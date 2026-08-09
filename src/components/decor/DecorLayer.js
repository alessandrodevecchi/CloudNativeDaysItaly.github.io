/*
 * Layer decorativo brand (cluster di anelli + halftone dots).
 * Immagini assolute, non interattive, nascoste agli screen reader.
 * Il contenitore padre deve avere `relative` e `overflow-hidden`.
 * Vedi docs/design-system.md — sezione Decorazioni.
 */
import BrandRings from './BrandRings';

const PATTERNS = {
  rings: '/images/pattern_rings.svg',
  halftone: '/images/pattern_halftone.svg',
};

// Preset di posizionamento: angoli parzialmente fuori viewport, come nel brand book.
// Su mobile l'offset è proporzionalmente più aggressivo: insieme alle SIZES
// ridotte tiene le decorazioni ai margini, mai sotto il testo.
const POSITIONS = {
  'top-right': '-right-10 -top-10 sm:-right-20 sm:-top-20',
  'top-left': '-left-10 -top-10 sm:-left-20 sm:-top-20',
  'bottom-right': '-right-10 -bottom-10 sm:-right-20 sm:-bottom-20',
  'bottom-left': '-left-10 -bottom-10 sm:-left-20 sm:-bottom-20',
};

// Taglie mobile-first: sotto `md` le decorazioni restano contenute per non
// coprire i contenuti (xl: 128px su mobile, 416px da md in su).
const SIZES = {
  sm: 'w-20 md:w-40',
  md: 'w-24 md:w-64',
  lg: 'w-28 md:w-80',
  xl: 'w-32 md:w-[26rem]',
};

/**
 * items: [{
 *   pattern: 'rings' | 'halftone' | 'cluster-a' | 'cluster-b' | 'cluster-c' | 'cluster-dot',
 *   position: keyof POSITIONS,
 *   size?: 'sm' | 'md' | 'lg' | 'xl',
 *   className?: string,
 * }]
 */
export default function DecorLayer({ items = [] }) {
  if (!items.length) return null;

  return (
    <div aria-hidden='true' className='pointer-events-none absolute inset-0 z-0'>
      {items.map((item, i) => {
        const cls = `absolute ${POSITIONS[item.position]} ${SIZES[item.size || 'md']} ${item.className || ''}`;
        if (item.pattern.startsWith('cluster-')) {
          return <BrandRings key={i} cluster={item.pattern.slice(8)} className={cls} />;
        }
        return (
          <img
            key={i}
            src={PATTERNS[item.pattern]}
            alt=''
            loading='lazy'
            className={cls}
          />
        );
      })}
    </div>
  );
}
