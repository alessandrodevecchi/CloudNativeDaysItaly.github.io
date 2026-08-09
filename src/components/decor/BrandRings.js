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
    { cx: 150, cy: 150, r: 148, colors: [C.blue, C.white, C.magenta, C.white, C.yellow] },
    { cx: 335, cy: 75, r: 55, colors: [C.blue, C.white, C.yellow] },
  ],
  // Composizione fitta di 4 anelli sovrapposti (angolo basso della cover)
  b: [
    { cx: 122, cy: 276, r: 120, colors: [C.blue, C.white, C.yellow, C.white, C.magenta] },
    { cx: 245, cy: 185, r: 55, colors: [C.blue, C.white, C.magenta] },
    { cx: 288, cy: 288, r: 110, colors: [C.blue, C.white, C.magenta, C.white, C.yellow] },
    { cx: 135, cy: 105, r: 45, colors: [C.magenta, C.white, C.yellow] },
  ],
  // Coppia grande duotone (angolo destro della cover)
  c: [
    { cx: 258, cy: 142, r: 140, colors: [C.magenta, C.white, C.yellow, C.white, C.blue] },
    { cx: 105, cy: 305, r: 90, colors: [C.blue, C.white, C.magenta] },
  ],
  // Anellino singolo duotone — MAI da solo in un angolo (sembra un errore):
  // usarlo solo accostato ad altri cluster; altrimenti preferire `duo`.
  dot: [
    { cx: 200, cy: 200, r: 70, colors: [C.yellow, C.white, C.blue] },
  ],
  // Coppia di anelli piccoli sovrapposti (accento minimo per gli angoli)
  duo: [
    { cx: 150, cy: 190, r: 95, colors: [C.blue, C.white, C.yellow] },
    { cx: 275, cy: 255, r: 65, colors: [C.magenta, C.white, C.blue] },
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
