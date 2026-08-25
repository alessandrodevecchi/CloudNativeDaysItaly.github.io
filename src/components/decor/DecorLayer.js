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
  'halftone-b': '/images/pattern_halftone_b.svg',
  'halftone-c': '/images/pattern_halftone_c.svg',
  'halftone-d': '/images/pattern_halftone_d.svg',
};

// Preset di posizionamento: angoli parzialmente fuori viewport, come nel brand book.
// Su mobile l'offset è proporzionalmente più aggressivo: insieme alle SIZES
// ridotte tiene le decorazioni ai margini, mai sotto il testo.
const POSITIONS = {
  'top-right': '-right-10 -top-10 sm:-right-20 sm:-top-20',
  'top-left': '-left-10 -top-10 sm:-left-20 sm:-top-20',
  'bottom-right': '-right-10 -bottom-10 sm:-right-20 sm:-bottom-20',
  'bottom-left': '-left-10 -bottom-10 sm:-left-20 sm:-bottom-20',
  // Zone centrali: pensate per gli halftone a bassa opacità, non per i cluster.
  'mid-left': 'left-[8%] top-1/3',
  'mid-right': 'right-[8%] top-1/4',
  center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  'center-bottom': 'left-1/3 bottom-[5%]',
};

// Taglie mobile-first: sotto `md` i cluster restano contenuti, tra `md` e
// `xl` sono medi (il contenitore è ancora stretto e il testo hero arriva ai
// bordi), taglia piena solo da `xl` in su (xl: 128 / 256 / 416px).
const SIZES = {
  sm: 'w-20 md:w-28 xl:w-40',
  md: 'w-24 md:w-40 xl:w-64',
  lg: 'w-28 md:w-52 xl:w-80',
  xl: 'w-32 md:w-64 xl:w-[26rem]',
};

// Gli halftone non ostacolano la lettura (opacità bassa): scala maggiore
// e nessuna riduzione drastica su mobile.
const HALFTONE_SIZES = {
  sm: 'w-40 md:w-56',
  md: 'w-56 md:w-72',
  lg: 'w-64 md:w-96',
  xl: 'w-80 md:w-[34rem]',
};

/**
 * items: [{
 *   pattern: 'rings'
 *          | 'halftone' | 'halftone-b' | 'halftone-c' | 'halftone-d'
 *          | 'cluster-a' | 'cluster-b' | 'cluster-c' | 'cluster-d' | 'cluster-e'
 *          | 'cluster-duo' | 'cluster-dot',
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
        const isHalftone = item.pattern.startsWith('halftone');
        const sizes = isHalftone ? HALFTONE_SIZES : SIZES;
        const cls = `absolute ${POSITIONS[item.position]} ${sizes[item.size || 'md']} ${item.className || ''}`;
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
