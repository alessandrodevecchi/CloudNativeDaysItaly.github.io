// Funzioni di layout per famiglia di formato. Ricevono dimensioni canvas e
// flag sui contenuti presenti, restituiscono posizioni e scale tipografiche.
// I layout si adattano ai contenuti assenti (foto/ruolo): minima frizione,
// l'export funziona anche con i soli default.

const base = (W, H) => {
  const unit = Math.min(W, H);
  return { unit, pad: Math.round(unit * 0.07) };
};

// Footer condiviso: una riga di voci icona+testo in basso.
const footer = (H, pad, unit) => ({
  y: H - pad,
  size: Math.round(unit * 0.028),
  icon: Math.round(unit * 0.034),
  gap: Math.round(unit * 0.045),
});

const logoBox = (pad, unit, scale = 0.24) => ({
  x: pad,
  y: pad,
  w: Math.round(unit * scale),
});

export const LAYOUTS = {
  landscape(W, H, { hasPhoto }) {
    const { unit, pad } = base(W, H);
    const photoSize = Math.round(H * 0.52);
    return {
      pad,
      logo: logoBox(pad, unit, 0.26),
      photo: hasPhoto
        ? { x: W - pad - photoSize, y: Math.round((H - photoSize) / 2), size: photoSize }
        : null,
      headline: {
        x: pad,
        y: Math.round(H * 0.36),
        maxW: hasPhoto
          ? W - photoSize - pad * 3
          : W - pad * 2 - Math.round(unit * 0.16),
        size: Math.round(unit * (hasPhoto ? 0.17 : 0.2)),
        minScale: 0.45,
      },
      name: { size: Math.round(unit * 0.052) },
      role: { size: Math.round(unit * 0.036) },
      footer: footer(H, pad, unit),
    };
  },

  square(W, H, { hasPhoto }) {
    const { unit, pad } = base(W, H);
    const photoSize = Math.round(W * 0.36);
    return {
      pad,
      logo: logoBox(pad, unit),
      photo: hasPhoto
        ? { x: W - pad - photoSize, y: Math.round(H * 0.3), size: photoSize }
        : null,
      headline: {
        x: pad,
        y: Math.round(H * (hasPhoto ? 0.38 : 0.42)),
        maxW: hasPhoto
          ? W - photoSize - Math.round(pad * 2.4)
          : W - pad * 2 - Math.round(unit * 0.16),
        size: Math.round(unit * 0.15),
        minScale: 0.66,
      },
      name: { size: Math.round(unit * 0.048) },
      role: { size: Math.round(unit * 0.034) },
      footer: footer(H, pad, unit),
    };
  },

  portrait(W, H, { hasPhoto }) {
    const { unit, pad } = base(W, H);
    const photoSize = Math.round(W * 0.4);
    return {
      pad,
      logo: logoBox(pad, unit),
      photo: hasPhoto
        ? { x: W - pad - photoSize, y: Math.round(H * 0.34), size: photoSize }
        : null,
      headline: {
        x: pad,
        y: Math.round(H * (hasPhoto ? 0.46 : 0.44)),
        maxW: hasPhoto
          ? W - photoSize - Math.round(pad * 2.4)
          : W - pad * 2 - Math.round(unit * 0.16),
        size: Math.round(unit * 0.155),
        minScale: 0.66,
      },
      name: { size: Math.round(unit * 0.05) },
      role: { size: Math.round(unit * 0.035) },
      footer: footer(H, pad, unit),
    };
  },

  story(W, H, { hasPhoto }) {
    const { unit, pad } = base(W, H);
    const photoSize = Math.round(W * 0.46);
    return {
      pad,
      logo: logoBox(pad, unit, 0.3),
      photo: hasPhoto
        ? {
            x: Math.round((W - photoSize) / 2 - unit * 0.04),
            y: Math.round(H * 0.2),
            size: photoSize,
          }
        : null,
      headline: {
        x: pad,
        y: Math.round(H * (hasPhoto ? 0.55 : 0.4)),
        maxW: W - pad * 2 - (hasPhoto ? 0 : Math.round(unit * 0.16)),
        size: Math.round(unit * 0.17),
        minScale: 0.66,
      },
      name: { size: Math.round(unit * 0.052) },
      role: { size: Math.round(unit * 0.037) },
      footer: footer(H, pad, unit),
    };
  },
};
