/*
 * Layer decorativo brand (anelli concentrici + halftone dots).
 * Immagini assolute, non interattive, nascoste agli screen reader.
 * Il contenitore padre deve avere `relative` e `overflow-hidden`.
 * Vedi docs/design-system.md — sezione Decorazioni.
 */

const PATTERNS = {
  rings: '/images/pattern_rings.svg',
  halftone: '/images/pattern_halftone.svg',
};

// Preset di posizionamento: angoli parzialmente fuori viewport, come nel wireframe.
const POSITIONS = {
  'top-right': '-right-16 -top-16 sm:-right-20 sm:-top-20',
  'top-left': '-left-16 -top-16 sm:-left-20 sm:-top-20',
  'bottom-right': '-right-16 -bottom-16 sm:-right-20 sm:-bottom-20',
  'bottom-left': '-left-16 -bottom-16 sm:-left-20 sm:-bottom-20',
};

const SIZES = {
  sm: 'w-28 sm:w-36',
  md: 'w-40 sm:w-56',
  lg: 'w-56 sm:w-72',
};

/**
 * items: [{ pattern: 'rings'|'halftone', position: keyof POSITIONS, size?: 'sm'|'md'|'lg', className?: string }]
 */
export default function DecorLayer({ items = [] }) {
  if (!items.length) return null;

  return (
    <div aria-hidden='true' className='pointer-events-none absolute inset-0 z-0'>
      {items.map((item, i) => (
        <img
          key={i}
          src={PATTERNS[item.pattern]}
          alt=''
          loading='lazy'
          className={`absolute ${POSITIONS[item.position]} ${SIZES[item.size || 'md']} ${item.className || ''}`}
        />
      ))}
    </div>
  );
}
