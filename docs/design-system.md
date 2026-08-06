# Design System — CND Italy (redesign 2027)

Stile: **pop / neo-brutalist**. Spigoli vivi, bordi neri netti, hard shadow senza blur, bande di colore piatte, display font condensed uppercase. Nessun gradiente, nessun radius, nessuna ombra sfumata.

I valori dei token vivono in `tailwind.config.mjs` e `src/styles/globals.css`. Questo documento dice **quando** usarli. La derivazione dai file sorgente è in `figma-token-mapping.md`.

## Colori — regole d'uso

- **`brand-blue`**: colore identitario. Date/titoli hero, banda CFP, banda FAQ/newsletter, link.
- **`brand-magenta`**: solo per ciò che deve spingere all'azione o colpire: CTA primaria, prezzi, evidenziazione card, accento nella banda numeri. Mai come sfondo di sezione intera.
- **`brand-yellow`**: banda tema, chips/tag, celle orario agenda, titoli su sfondo scuro.
- **`brand-yellow-light`**: sfondi soft dove il giallo pieno è troppo.
- **`ink` (#111)**: testo di default, tutti i bordi pop, bande scure (numeri, venue).
- **`cream` (#FDF6E3)**: banda alternativa calda (tickets). Alternativa al bianco quando servono due sezioni chiare adiacenti.
- Testo secondario: `ink-soft` → `ink-muted` → `ink-faint` in ordine di gerarchia decrescente.

Contrasto: su `brand-yellow` e `cream` solo testo `ink`. Su `brand-blue` e `ink` solo testo bianco o `brand-yellow`. Magenta su bianco ok per testi ≥18px bold o display.

## Tipografia

- **`font-display`** (Anton → Extenda): SOLO titoli sezione, display hero, stat/prezzi, stamp. Sempre `uppercase`. Mai per body o UI copy.
- **`font-sans`** (Poppins): tutto il resto. Bold per CTA e lead, regular per body.
- Scale fluide: `text-display` (hero), `text-section` (H2 sezione), `text-stat` (numeri/prezzi), `text-stamp` (badge).

## Pattern componenti (utility in globals.css)

- **`.btn-pop`**: base bottone — `border-pop`, `shadow-pop`, uppercase bold, `rounded-none`. Hover: trasla di 2px verso il basso-destra e riduce l'ombra (effetto "pressione"). Varianti: `.btn-pop-primary` (bg magenta, testo bianco), `.btn-pop-secondary` (bg bianco, testo ink), `.btn-pop-dark` (bg ink, testo bianco).
- **`.card-pop`**: card — bg bianco, `border-pop`, spigoli vivi. Variante evidenziata: `.card-pop-accent` con `border-pop-accent`.
- **`.stamp`**: badge "timbro" — bg bianco, `border-pop`, `shadow-pop-sm`, `font-display` uppercase, leggera rotazione (−2°/+2° alternata).
- **`.chip-pop`**: tag piccolo — bg `brand-yellow`, `border-pop`, testo ink bold, no shadow.
- **`.section-heading`**: H2 in `font-display text-section uppercase text-ink` (nome distinto dal legacy `.section-title` ancora usato dalle pagine di dettaglio).

## Layout sezioni

- Container: `max-w-[1200px] mx-auto px-6` (wireframe: contenuto a 120px su 1440 → 1200 utile).
- Padding verticale sezione: `py-16 md:py-24`.
- Ogni sezione è una banda a tutta larghezza (`w-full`) col proprio sfondo; il contenuto sta nel container.
- Due bande chiare adiacenti si separano con `border-t-2 border-ink`.
- Ritmo colori homepage: vedi tabella in `figma-token-mapping.md`. Regola generale: mai due bande colorate forti adiacenti — interporre bianco.

## Decorazioni (fase 2)

- Anelli concentrici e halftone dots: layer assoluti `pointer-events-none aria-hidden`, gestiti da un componente unico, non dentro le singole sezioni. Asset ufficiali in arrivo.

## Cosa NON fare

- Niente `rounded-*` (salvo cerchi decorativi pieni: `rounded-full`).
- Niente `shadow-md/lg/xl` sfumate — solo `shadow-pop*`.
- Niente gradienti.
- Niente grigi Tailwind di default per testo (`text-gray-*`) — usare la scala `ink*`.
- Il display font non va mai in lowercase né su paragrafi.
