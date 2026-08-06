# Figma Token Mapping — Redesign 2027

Fonte: [Figma CND-Italy](https://www.figma.com/design/GKrcNSd2oc0KoQdv7o8Amz/CND-Italy) (wireframe homepage 2027, node `2:3`) + Brand Book CND Italy v1.0 (Nov 2025).

Tabella di traduzione una tantum: valore Figma/brand book → token del progetto.
I valori canonici vivono in `tailwind.config.mjs` e `src/styles/globals.css`; questo file è solo il registro della derivazione.

## Colori

| Valore Figma / Brand Book | Origine | Token Tailwind | Uso |
|---|---|---|---|
| `#3069DE` | Brand book palette + hero date | `brand-blue` | Colore primario brand, bande sezione, date, link |
| `#F91B71` | Brand book palette + prezzi/CTA | `brand-magenta` | CTA primaria, prezzi, evidenziazioni |
| `#FBC430` | Brand book palette + chips/agenda | `brand-yellow` | Banda tema, chips, celle orario agenda |
| `#FADD64` | Brand book palette | `brand-yellow-light` | Variante chiara del giallo, sfondi soft |
| `#111111` | Wireframe (testi, bordi, banda numeri) | `ink` | Testo principale, bordi pop, banda scura. Il brand book indica `#000000`; il wireframe usa `#111` — adottato `#111111` |
| `#333333` | Wireframe (sottotitoli hero) | `ink-soft` | Testo secondario forte |
| `#555555` | Wireframe (note card ticket) | `ink-muted` | Testo secondario |
| `#666666` | Wireframe (micro-copy) | `ink-faint` | Micro-copy, caption |
| `#FDF6E3` | Wireframe (banda tickets) | `cream` | Banda sezione alternativa calda |
| `#FFFFFF` | Wireframe (bg base, card) | `white` (nativo) | Sfondo base pagina e card |

## Tipografia

| Figma / Brand Book | Token | Implementazione |
|---|---|---|
| Extenda 50 Mega (display, brand book) | `font-display` | **Fallback attivo: Anton** (Google Fonts) — stesso sostituto usato dal wireframe Figma. Swap a Extenda quando disponibili i woff2 licenziati |
| Poppins Bold / Poppins (brand book) | `font-sans` | Poppins via `next/font/google` (400/600/700). Il wireframe usa Inter come placeholder; il brand book prescrive Poppins → vince il brand book |

Scala osservata nel wireframe (desktop 1440px):

| Elemento | Figma | Token |
|---|---|---|
| Hero display date | 120px Anton | `text-display` (clamp fluido ~48→120px) |
| Titolo sezione | 46px Anton uppercase | `text-section` (clamp ~32→46px) |
| Prezzo ticket / numero countdown | 34–40px Anton | `text-stat` |
| Stamp badge | 15–20px Anton uppercase | `text-stamp` |
| Body | 14–20px Inter→Poppins | scala Tailwind standard |

## Bordi, ombre, forme

| Pattern Figma | Valore | Token/Utility |
|---|---|---|
| Bordo card/bottoni | `3px solid #111` (su 1440px ≈ 2px reali) | `border-pop` → `2px solid #111111` |
| Bordo card evidenziata | `5px solid #F91B71` | `border-pop-accent` → `3px solid #F91B71` |
| Hard shadow (stamp, CTA) | Blocco nero offsettato, no blur | `shadow-pop` → `4px 4px 0 0 #111111`; `shadow-pop-sm` → `3px 3px 0 0 #111111` |
| Border radius | 0 ovunque (spigoli vivi) | `rounded-none` — nessun radius nel design |
| Halftone dots | Pattern puntini angoli pagina | Asset/CSS decorativo, fase 2 |
| Anelli concentrici blu/giallo/magenta | Decorazione angoli sezione | Asset ufficiale da fornire, fase 2 (`<DecorLayer>`) |

## Bande sezione (ritmo verticale homepage)

| Sezione wireframe | Sfondo | Testo |
|---|---|---|
| Hero | `white` + deco | `ink` / `brand-blue` |
| Numbers strip | `ink` (#111) | valori `brand-yellow`/`brand-magenta`/`brand-blue`, label bianche |
| About/recap | `white` | `ink` |
| Theme (banda editoriale) | `brand-yellow` | `ink` |
| What to expect | `white` | `ink` |
| CFP "You could be on this stage" | `brand-blue` | bianco, chips `brand-yellow` |
| Agenda at a glance | `white` | `ink`, celle orario `brand-yellow`/`brand-magenta` |
| Tickets | `cream` | `ink`, prezzi `brand-magenta` |
| Sponsors | `white` | `ink` |
| Venue "Bologna" | `ink` | titolo `brand-yellow`, bullet colorati |
| Community partners | `white` | `ink` |
| FAQ + newsletter | `brand-blue` | bianco |
| Footer | `white` o `ink` | — |

Le sezioni sono separate da bordi netti neri orizzontali (`border-t-2 border-ink`) dove due bande chiare si toccano.

## Non risolti / rimandati

| Item | Stato |
|---|---|
| Extenda 50 Mega webfont | In attesa file licenziati — fallback Anton |
| Anelli decorativi ufficiali | Asset da fornire (versione wireframe approssimativa) |
| Pattern halftone dots | Da estrarre dal brand book o ricreare CSS |
| Foto/video hero e recap | Placeholder finché non forniti |
