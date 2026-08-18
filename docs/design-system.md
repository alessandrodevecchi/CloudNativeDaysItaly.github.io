# Design System — CND Italy (redesign 2027)

Stile: **pop / neo-brutalist**. Spigoli vivi, bordi neri netti, hard shadow senza blur, bande di colore piatte, display font condensed uppercase. Nessun gradiente, nessun radius, nessuna ombra sfumata.

I valori dei token vivono in `tailwind.config.mjs` e `src/styles/globals.css`. Questo documento dice **quando** usarli. La derivazione dai file sorgente è in `figma-token-mapping.md`.

Gli **esempi resi** stanno su `/brand-kit/design-system` (pagina pubblica, componenti e classi veri, niente screenshot). Qui le regole, là il riscontro visivo: se una regola cambia si aggiorna questo file e la pagina la mostra.

## Colori — regole d'uso

- **`brand-blue`**: colore identitario. Date/titoli hero, banda CFP, banda FAQ/newsletter, link.
- **`brand-magenta`**: solo per ciò che deve spingere all'azione o colpire: CTA primaria, prezzi, evidenziazione card, accento nella banda numeri. Mai come sfondo di sezione con testo; ammesso come banda solo-immagini (photo strip in home).
- **`brand-yellow`**: **accenti e blocchi, mai banda di sezione**. Chips/tag, celle orario agenda, titoli su sfondo scuro, box invito (Become a Sponsor), CTA primaria della navbar. Unica eccezione dichiarata: la banda tema (`ThemeSection`), momento editoriale unico e non ricorrente, spenta in config.
- **`brand-yellow-light`**: sfondi soft dove il giallo pieno è troppo.
- **`ink` (#111)**: testo di default, tutti i bordi pop, bande scure (numeri, venue).
- **`cream` (#FDF6E3)**: banda alternativa calda (tickets). Alternativa al bianco quando servono due sezioni chiare adiacenti.
- Testo secondario: `ink-soft` → `ink-muted` → `ink-faint` in ordine di gerarchia decrescente.

Contrasto: su `brand-yellow` e `cream` solo testo `ink`. Su `brand-blue` e `ink` solo testo bianco o `brand-yellow`. Magenta su bianco ok per testi ≥18px bold o display.

## Tipografia

- **`font-display`** (Anton → Extenda): SOLO titoli sezione, display hero, stat/prezzi, stamp. Sempre `uppercase`. Mai per body o UI copy.
- **`font-sans`** (Poppins): tutto il resto. Bold per CTA e lead, regular per body.
- Scale fluide: `text-display` (hero), `text-section` (H2 sezione), `text-stat` (numeri/prezzi), `text-stamp` (badge).

## Logo

Esiste **un solo lockup**: nuvola + wordmark. Niente variante solo-simbolo, niente quadrata: se servissero è una decisione di brand, non un ritaglio. Tre versioni cromatiche dello stesso lockup:

| Versione | File | Note |
|---|---|---|
| Colore | `/images/logo.webp` | Quella che il sito usa quasi ovunque |
| Bianca | `/images/Logo_CND_W.svg` | Unica vettoriale vera |
| Ink | `/images/logo-ink.webp` | Monocromatica `#1D1D1B`, nata per il giallo. Disponibile, oggi non usata |

- **Clear space**: spazio libero su tutti i lati almeno pari all'altezza della nuvola. Dentro quell'area non entra niente (testo, anelli, bordo di una foto).
- **Dimensione minima**: 140px di larghezza a schermo, 25mm in stampa. Sotto, il wordmark si chiude e la fetta di pizza diventa una macchia.
- **Fondo**: colore su bianco e cream; bianca su `ink`, `brand-blue` e `brand-magenta`; su `brand-yellow` funzionano sia colore sia ink, e la bianca no (niente contrasto).
- **Il caso giallo**: nella versione a colori la fetta di pizza ha il ripieno giallo, che su fondo giallo si perde, e il wordmark blu tiene un contrasto debole. La versione ink risolve entrambe le cose, la fetta diventa una silhouette col fondo che passa dai buchi. Il sito continua a usare la colore: la ink è un'opzione dichiarata, non un obbligo.
- **Non fare**: stirarlo o comprimerlo, ricolorarlo, metterci un'ombra sfumata, appoggiarlo su una foto senza una superficie piena sotto.

## Pattern componenti (utility in globals.css)

- **`.btn-pop`**: base bottone — `border-pop`, `shadow-pop`, uppercase bold, `rounded-none`. Hover: trasla di 2px verso il basso-destra e riduce l'ombra (effetto "pressione"). Varianti: `.btn-pop-primary` (bg magenta, testo bianco), `.btn-pop-secondary` (bg bianco, testo ink), `.btn-pop-dark` (bg ink, testo bianco). Modificatore `.btn-pop-on-ink`: porta bordo e ombra a bianco per la banda ink, si accosta a una variante.
- **`.card-pop`**: card — bg bianco, `border-pop`, spigoli vivi. Variante evidenziata: `.card-pop-accent` con `border-pop-accent`.
- **`.stamp`**: badge "timbro" — bg bianco, `border-pop`, `shadow-pop-sm`, `font-display` uppercase, leggera rotazione (−2°/+2° alternata).
- **`.chip-pop`**: tag piccolo — bg `brand-yellow`, `border-pop`, testo ink bold, no shadow.
- **`.section-heading`**: H2 in `font-display text-section uppercase text-ink` (nome distinto dal legacy `.section-title` ancora usato dalle pagine di dettaglio).
- **`.eyebrow`**: occhiello di sezione — `font-display text-base uppercase tracking-widest` + colore contestuale.

## Occhielli — regola dei livelli

Il livello del titolo decide lo stile:
- **`.stamp`** sopra ogni titolo di pagina (h1), nei momenti hero ("Save
  the date", "The Event") e sulle **sezioni-azione chiave** della home:
  Call for Papers, Tickets, Become a Sponsor ("We need you"). Mai due
  stamp adiacenti nella stessa vista.
- **`.eyebrow`** sopra i titoli di sezione (h2) informativi. Colore contestuale: `text-brand-magenta` su bianco/cream, `text-brand-yellow` su blu/nero, `text-ink` su giallo.
- Sulla **banda ink** si usa l'occhiello, non lo stamp: lo stamp lì avrebbe bisogno di bordo e ombra bianchi e diventerebbe indistinguibile da un bottone `.btn-pop-on-ink` (venue e banda numeri fanno già così).

## CTA — colori e gerarchia

Il colore di una CTA dipende dal **contesto**, non dall'azione: la stessa
azione può avere colori diversi in navbar e nel corpo, ed è voluto.

- **Navbar** (barra bianca, sempre visibile): primaria **gialla** con
  freccia, secondaria **bianca** bordata. Massimo 2 bottoni, gestiti da
  `navbar.ctas` (vedi Navigazione). Il giallo tiene la barra leggibile
  senza competere coi magenta del contenuto che le scorre sotto.
- **Nel contenuto**: primaria **magenta** (`.btn-pop-primary`),
  secondaria **bianca** (`.btn-pop-secondary`). Un solo magenta per blocco.
- **Documenti e download**: bottone **bianco** con icona `Download`.
  Quello che segnala il download è l'icona, insieme al chip "Soon" e alla
  cover cliccabile, non un colore dedicato (transparency report, download
  del brand kit, template CSV del batch).
- **Superfici gialle**: il giallo pieno segna un *invito* quando la
  sezione non ha già una banda propria (box "Become a Sponsor" dentro la
  vetrina sponsor, banda tema). Dentro una superficie gialla **il bottone
  che agisce è magenta**: il giallo è il contenitore, non il bottone. Le
  sezioni-azione con banda propria (CFP su blu, Tickets su cream) non
  hanno bisogno del giallo.
- **Banda ink**: bordi e ombre nere spariscono nel fondo, quindi vanno a
  bianco (`.btn-pop-on-ink`, da accostare a una variante). L'azione
  secondaria della banda ink oggi è un **link giallo bold con freccia**,
  hover bianco (venue, "Get Directions"): il bottone si usa quando serve
  un'azione forte, non per ogni link. `.btn-pop-dark` (bg ink) esiste per
  questo contesto ed è la variante quieta accanto al bottone bianco;
  al momento non è usata da nessuna parte, ed è una scelta, non un buco.
- **Marker giallo su voce di menu** (`highlight: 'marker'` in config,
  classe `.nav-marker`): evidenziatore sotto il testo per le voci che
  ospitano anche un invito e non solo informazione (Sponsors = vetrina +
  diventa sponsor). Mai più di una voce marcata per volta.
- **Anteprime scaricabili**: documento non ancora pronto → cover con chip
  "Soon" (pattern del brand kit); quando è pronto la stessa cover diventa
  un link con hover lift.

## Ombre — regola dei 3 livelli

- **Sempre** (e crescono in hover): stamp, CTA primarie, card feature colorate, dropdown aperti.
- **Solo hover** (lift: trasla −2px, ombra appare): card di griglia interattive — talk, speaker, team, loghi sponsor.
- **Mai**: righe/break agenda, accordion FAQ, input, footer, superfici informative dense.
- Su fondo scuro: `shadow-pop-white` / `shadow-pop-white-sm`. La regola vale contro `ink`, dove nero su nero sparisce: su blu e magenta l'ombra nera si vede e resta quella standard (bottone bianco della banda FAQ). Sulla banda ink vanno a bianco anche i bordi (foto della venue: `border-pop border-white` + `hover:shadow-pop-white`).

## Hover — due pattern canonici

- **Lift** per le card (translate + shadow).
- **Invert** (bg `ink`, testo bianco) per voci di menu/dropdown e footer di card colorate.

## Colore nei componenti

Regola "superfici colorate, atomi neutri": colore in blocchi grandi (bande, card feature, pannelli dropdown, footer di card), tag/chip neutri bianchi bordati. Colore nei tag SOLO semantico:
- keynote → magenta/bianco (icona `Star`), talk → giallo (`Mic`), lightning-talk → giallo (`Zap`), workshop → blu/bianco (`Wrench`).
- Break agenda: cream con icona magenta (`Rocket` welcome, `Sunset` closing, `Pizza` aperitivo, `Gem` platinum keynote, `Coffee`/`Utensils`/`Clock` standard).
- Badge stato: giallo = attivo/on sale, bianco+blu = upcoming, grigio = chiuso.

## Speaker: ruolo, azienda, credenziali

Composizione unica in `src/lib/speakerMeta.js`, usata da agenda, dettaglio
talk, griglie, pagina profilo e card social: chi compila i profili può
scrivere l'azienda dentro `role`, la resa non la ripete. Chi ha due
incarichi usa la lista `roles`.

- **Card e liste** (`PersonCard`, griglia speaker, agenda, dettaglio talk):
  ruolo, azienda e credenziali tutti in `ink-muted`. Nessun colore: sono
  superfici dense, il colore andrebbe a competere con i tag di sessione.
  Al massimo due incarichi, separati da ` · `; sulle card social solo il primo.
- **Pagina profilo**: ruolo in `brand-blue`, azienda cliccabile quando il
  profilo ha un `companyUrl` vero (`#` conta come assente), credenziali in
  **`brand-magenta`**. È l'unico posto del sito dove il magenta non segna
  un'azione ma un **riconoscimento della persona** (Kubestronaut, ambassador,
  TAG lead): eccezione dichiarata, non un precedente per altri usi.
- **Etichette**: sopra ogni blocco un occhiello minuscolo in `ink-muted`
  (`text-xs uppercase tracking-widest`), "Role" o "Roles" e "Community role".
  Servono a dire perché ci sono due righe diverse, e compaiono solo quando il
  campo c'è.

Il ruolo è lo scatto al momento della call for papers: si aggiorna quando la
persona ripropone un talk, non si insegue.

### Come si scrive `communityRole`

Il campo raccoglie i riconoscimenti che arrivano dalla community, non le
certificazioni vendor: AWS, Azure e CKAD restano nella bio.

- Più credenziali sulla stessa riga, separate da ` | `, dalla più riconoscibile
  alla più di nicchia. "Java Champion" non apre la riga se la persona ha anche
  un ruolo cloud native.
- Una forma sola per ogni programma: si scrive `Kubestronaut`, non "CNCF
  Kubestronaut", perché è lo stesso riconoscimento. Dove la sigla dice poco si
  scrive per esteso, come "Continuous Delivery Foundation Ambassador".
- Se dietro la credenziale c'è un'organizzazione si usa `@` senza spazio, come
  per il ruolo: `Community Manager @GDG Pescara`.
- Chi organizza l'evento chiude la riga con `CND Italy Organizer`. Le prime
  edizioni si chiamavano KCD Italy, ma l'etichetta vecchia non si usa più.

## Layout sezioni

- Container: `max-w-[1200px] mx-auto px-6` (wireframe: contenuto a 120px su 1440 → 1200 utile).
- Padding verticale sezione: `py-16 md:py-24`.
- Ogni sezione è una banda a tutta larghezza (`w-full`) col proprio sfondo; il contenuto sta nel container.
- Due bande chiare adiacenti si separano con `border-t-2 border-ink`.
- Ritmo colori homepage: vedi tabella in `figma-token-mapping.md`. Regola generale: mai due bande colorate forti adiacenti — interporre bianco.

## Navigazione (ristrutturazione contenuti 2027)

- **Menu desktop**: 4 voci piatte (Agenda, Speakers, Sponsors, Partners) + 2
  dropdown a pannello colorato (Hub = `brand-blue`, About = `brand-magenta`).
  Config in `website.json > navbar.links.header`: una voce con `items` è un
  gruppo; `pastEditions: true` inietta le edizioni passate nel pannello.
- **Pannelli dropdown** (reference Gumroad): superficie piena colorata,
  `border-pop` + `shadow-pop`, voci bold con hover invert (`hover:bg-ink
  hover:text-white`), sticker `BrandRings` in basso a destra, sezioni interne
  separate da `border-t-2 border-ink` con label `font-display` uppercase.
- **Menu mobile**: drill-down. Livello principale bianco (voci + gruppi con
  `ChevronRight`); tap su un gruppo → il drawer assume il colore del pannello,
  header con "Back", CTA sticky in fondo sempre visibili. L'area voci ha
  `overflow-y-auto min-h-0`.
- **CTA navbar a fasi**: `website.json > navbar.ctas` in ordine di priorità;
  si mostrano le prime 2 con `active: true`, la prima è primaria (gialla),
  la seconda secondaria (bianca). Cambio fase = flip di `active`, no deploy
  di codice.

## Pattern contenuto (pagine 2027)

- **Sezioni configurabili spente**: componenti come ThemeSection, testimonial
  sponsor e newsletter rendono `null` con `active: false` e si accendono da
  config quando il contenuto esiste. Mai placeholder finti in produzione.
- **Download "Soon"**: asset scaricabili con `url: null` rendono un bottone
  disabilitato con chip "Soon" (vedi `/brand-kit`); valorizzare `url` li
  attiva.
- **Anchor chips**: nav interna di pagina con chip bordati hover invert
  (hero di `/brand-kit`).
- **Timeline**: lista verticale con nodo quadrato giallo `border-pop`, linea
  `bg-ink`, anno in `font-display text-stat text-brand-blue` (pagina
  `/about`).
- **Anteprime asset in CSS**: le preview del brand kit (card "I'll be
  there", slide template) sono rese coi token del design system, non
  immagini da produrre.
- **Pagina 404** (`src/app/not-found.js`): stesso impianto delle altre
  pagine (stamp, `section-heading`, testo), poi bottone primario magenta
  verso la home, una riga di link blu alle pagine più cercate e le icone
  social sotto l'occhiello "Follow us". Il testo dice che l'indirizzo non
  esiste e che non è colpa di chi naviga. Nell'export statico diventa
  `out/404.html`, il file che GitHub Pages serve per ogni indirizzo
  mancante: si prova con `npm run preview`, non col dev server, perché in
  sviluppo la rotta `/[year]` intercetta gli indirizzi di primo livello.
- **Icone social**: una sola lista, `website.json → footer.icons`, resa da
  `src/components/social/SocialIcons.js`. Il colore lo decide il fondo:
  grigio con hover giallo sulla banda ink del footer, grigio con hover blu
  su fondo bianco.

## Decorazioni

Gestite da `src/components/decor/DecorLayer.js` (layer assoluto `pointer-events-none aria-hidden`; il padre deve essere `relative overflow-hidden`).

- **Cluster di anelli** (`BrandRings.js`): preset `a`–`e`, `dot`, `duo` — SVG inline parametrici nei colori brand. Regole: mai un anello singolo solo in un angolo (usare `duo`); ogni sezione decorata ha almeno 2 elementi; densità proporzionale all'altezza della sezione; taglie ridotte sotto `md` per non coprire i contenuti.
- **Halftone**: quattro pesi della stessa texture, si scelgono per densità come i cluster di anelli.
  - `halftone` — originale del brand book (`pattern_halftone.svg`, 53KB, path): blob diagonale a punti grossi, il più marcato.
  - `halftone-b` — campo rettangolare medio, punti fitti al centro che sfumano in basso a destra.
  - `halftone-c` — il più rado e leggero, per le sezioni dense dove la texture non deve competere.
  - `halftone-d` — il più fitto, gradiente forte da un angolo: regge le bande alte.

  L'asset è grigio chiarissimo (`#e4e4e4`), quindi ha **due ricette**: su banda colorata o scura si aggiunge `invert`, che lo rende scuro e visibile; su bianco e cream si lascia com'è e resta una texture appena percepibile. Opacità 20–30% in entrambi i casi; scala dedicata più grande, non ridotta su mobile; possono vivere anche nelle zone centrali (`mid-left`, `mid-right`, `center`, `center-bottom`).
- **Redistribuzione**: halftone e anelli sono asset nostri, offerti come download nel brand kit. Gli elementi decorativi delle card social (donut, diamanti, stelle, nuvole, bauhaus) sono materiale licenziato: nessun download e nessun rimando a dove vivono, per le grafiche pronte c'è il card generator. Il font **Extenda** è licenziato e non entra mai in un logo pack o in uno zip.
- **Varianti hero** (`heroVariants.js`): 10 composizioni curate; uno script inline in `layout.js` ne sceglie una prima del primo paint via `html[data-decor]` (niente switch visibile, niente hydration mismatch). La variante 0 è il fallback senza JS.

## Cosa NON fare

- Niente `rounded-*` (salvo cerchi decorativi pieni: `rounded-full`).
- Niente `shadow-md/lg/xl` sfumate — solo `shadow-pop*`.
- Niente gradienti.
- Niente grigi Tailwind di default per testo (`text-gray-*`) — usare la scala `ink*`.
- Il display font non va mai in lowercase né su paragrafi.
