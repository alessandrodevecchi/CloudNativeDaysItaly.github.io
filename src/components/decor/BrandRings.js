/*
 * Cluster di anelli concentrici brand (composizioni stile cover del brand book):
 * anelli sovrapposti multi-colore, dimensioni diverse, pensati per gli angoli
 * delle sezioni, parzialmente tagliati fuori dal viewport.
 * Vedi docs/design-system.md — sezione Decorazioni.
 */

const C = {
  blue: '#3069DE',
  magenta: '#F91B71',
  yellow: '#FBC430',
  white: '#FFFFFF',
};

/*
 * Ogni cluster è una lista di anelli: { cx, cy, r, colors }.
 * `colors` va dall'esterno verso l'interno; ogni banda ha lo stesso spessore.
 * viewBox 400x400.
 */
const CLUSTERS = {
  // Anello grande tricolore + satellite piccolo (angolo alto della cover)
  a: [
    { cx: 120, cy: 120, r: 150, colors: [C.blue, C.white, C.magenta, C.white, C.yellow] },
    { cx: 320, cy: 90, r: 55, colors: [C.blue, C.white, C.yellow] },
  ],
  // Composizione fitta di 4 anelli sovrapposti (angolo basso della cover)
  b: [
    { cx: 90, cy: 300, r: 120, colors: [C.blue, C.white, C.yellow, C.white, C.magenta] },
    { cx: 230, cy: 210, r: 55, colors: [C.blue, C.white, C.magenta] },
    { cx: 290, cy: 350, r: 110, colors: [C.blue, C.white, C.magenta, C.white, C.yellow] },
    { cx: 130, cy: 140, r: 45, colors: [C.magenta, C.white, C.yellow] },
  ],
  // Coppia grande duotone (angolo destro della cover)
  c: [
    { cx: 280, cy: 130, r: 140, colors: [C.magenta, C.white, C.yellow, C.white, C.blue] },
    { cx: 110, cy: 300, r: 90, colors: [C.blue, C.white, C.magenta] },
  ],
  // Anellino singolo duotone (accento sparso)
  dot: [
    { cx: 200, cy: 200, r: 70, colors: [C.yellow, C.white, C.blue] },
  ],
  // Trio in diagonale (piccolo-grande-piccolo)
  d: [
    { cx: 90, cy: 90, r: 60, colors: [C.magenta, C.white, C.blue] },
    { cx: 210, cy: 210, r: 110, colors: [C.yellow, C.white, C.magenta, C.white, C.blue] },
    { cx: 330, cy: 330, r: 55, colors: [C.blue, C.white, C.yellow] },
  ],
  // Anello gigante tricolore con satellite ravvicinato
  e: [
    { cx: 170, cy: 230, r: 170, colors: [C.blue, C.white, C.yellow, C.white, C.magenta] },
    { cx: 340, cy: 90, r: 60, colors: [C.magenta, C.white, C.yellow] },
  ],
};

const Ring = ({ cx, cy, r, colors }) => {
  const band = r / (colors.length + 1); // +1: il foro centrale bianco
  return (
    <>
      {colors.map((color, i) => (
        <circle key={i} cx={cx} cy={cy} r={r - band * i} fill={color} />
      ))}
      <circle cx={cx} cy={cy} r={r - band * colors.length} fill={C.white} />
    </>
  );
};

export default function BrandRings({ cluster = 'a', className = '' }) {
  const rings = CLUSTERS[cluster] || CLUSTERS.a;
  return (
    <svg
      viewBox='0 0 400 400'
      aria-hidden='true'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      {rings.map((ring, i) => (
        <Ring key={i} {...ring} />
      ))}
    </svg>
  );
}
