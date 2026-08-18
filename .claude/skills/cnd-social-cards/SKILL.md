---
name: cnd-social-cards
description: Genera le card social di Cloud Native Days Italy (speaker, sponsor, partner, attendee) pilotando il card generator del sito: una sola card o un elenco intero. Usa questa skill quando l'utente chiede di produrre le immagini/post social per uno speaker o per gli speaker selezionati, per gli sponsor, per i partner o per una lista di persone, sia con un CSV o un export Sessionize o una cartella di foto e loghi, sia incollando i dati grezzi in chat. Trigger: "genera la card", "genera le card", "genera i post per gli speaker", "crea l'immagine social dello sponsor", "batch card", "social card generator", "card studio".
---

# Card social CND: generazione

Il sito ha un generatore di card che rende su canvas i template approvati.
Il renderer vive nel browser (canvas, font e asset del sito) e non esiste un
servizio esterno, ma **tu non devi usare nessuna interfaccia**: c'è uno
script che apre una pagina di servizio in un browser headless, le passa il
CSV e scrive i PNG su disco.

```bash
npx next dev -p 3100                                    # una volta
node scripts/social-cards.mjs --csv cards.csv --photos ./foto
```

Vale per **una card come per cento**: cambia solo quante righe ha il CSV.

## 1. Dove vive

- Repo: la copia locale di `CloudNativeDaysItaly.github.io`.
- Pagina pubblica `/brand-kit` (sezione `#generator`): solo card
  pubbliche (attendee conference/workshops, supporting partner).
- **Pagina interna `/brand-kit/studio`**: tutti gli use case, inclusi
  **speaker** e **sponsor** (template "pro" approvati), più il pannello
  **Batch generation**. Non è linkata dal sito, è l'interfaccia per le
  persone: serve a te solo se l'utente vuole provare varianti a occhio.
- **Pagina di servizio `/brand-kit/card`**: nessuna interfaccia, espone il
  renderer su `window.__cndCards`. La guida `scripts/social-cards.mjs`, che
  è la strada da usare.
- Script: `scripts/social-cards.mjs` (Node, usa `playwright-core` e il
  Chrome di sistema).
- Codice: `src/components/brandkit/generator/` (motore base) e
  `.../generator/pro/` (template speaker/sponsor: `templates.js` con i
  layout approvati, `registry.js` col catalogo, `assets.js` per gli SVG
  di `public/brand-kit/`).

## 2. Preparazione

```bash
cd <cartella del repo>
git branch --show-current   # serve un branch che contenga il generator
npx next dev -p 3100        # se la porta 3100 è occupata, riusa quel server
```

Il generator vive su `main`. Se il branch corrente non ha
`src/components/brandkit/generator/pro/`, passa a un branch che lo contenga
(chiedi conferma se ci sono modifiche pendenti).

Il dev server serve al renderer: le card si disegnano su canvas coi font e
gli asset del sito. Non serve nient'altro, in particolare **non serve
aprire nessuna pagina a mano**.

## 3. CSV

Una riga per card. Il pannello offre due template scaricabili; queste
sono le colonne.

**Speaker** (`usecase=speaker`):

```csv
usecase,template,formats,badge,talk,name,role,name2,role2,media,media2
speaker,pop-blue,all,KEYNOTE SPEAKER,The New Digital Nervous System,Serena Sensini,Innovation Leader at Dedalus,,,serena.jpg,
speaker,comic-panel,1-1|9-16,SPEAKER,AI e Sicurezza Cloud-Native,Giulio Puri,Sr Solutions Engineer at Sysdig,Andrea Vivaldi,Sr Customer Solution Architect at Sysdig,giulio.jpg,andrea.jpg
```

**Sponsor** (`usecase=sponsor`):

```csv
usecase,template,formats,org,tier,preset,bg,corner,media
sponsor,tier,all,Clastix,GOLD,gold,,,clastix.png
sponsor,tier,1-1,ACME Corp,PLATINUM,platinum,,,acme.svg
```

**Attendee/partner** (card pubbliche, colonne del CSV base):
`usecase,headline,colorway,formats,primary,secondary,tertiary,media,shape,zoom,offsetx,offsety,logostyle`.

Note sui campi:

- `formats`: `all` oppure lista `16-9|1-1|4-5|9-16`.
- `template` speaker: `comic-blue`, `pop-blue`, `pop-split`,
  `hybrid-round`, `hybrid-square`, `comic-panel`, `bauhaus-yellow`,
  `magenta-max`, `facets-blue`, `facets-magenta`.
  **Solo `pop-blue`, `pop-split` e `comic-panel` disegnano due
  relatori**: se una riga ha `name2`, usa uno di questi.
- `media2`: foto del secondo relatore, solo per le righe con `name2`. Se
  la lasci vuota entrambe le cornici usano `media` con due crop diversi,
  quindi la stessa faccia due volte: passala sempre quando ce l'hai.
- **Co-speaker: scegli tu un template duo** (`pop-blue`, `pop-split` o
  `comic-panel`) per le righe con `name2`. Se indichi un template che
  disegna un solo relatore, il batch passa da sé a uno dei tre e lo scrive
  nel riepilogo della riga: la card esce comunque, ma il template non è
  quello che avevi chiesto.
- `tier` sponsor: è l'etichetta **completa** del badge, non solo il
  livello. Si scrive `GOLD SPONSOR`, non `GOLD`, e proprio per questo serve
  anche per `MEDIA PARTNER`, `COMMUNITY PARTNER` o `HOST`. Oltre i 20
  caratteri il badge si rimpicciolisce da sé.
- `template` sponsor: `tier` (principale), `pop-cream`, `pop-blue`,
  `facets-soft`.
- `preset` sponsor: `gold`, `platinum`, `silver`, `smart`, `workshop`,
  `main`. Precompila background e cluster d'angolo; `bg` e `corner`
  espliciti lo sovrascrivono.
- `badge` speaker è testo libero (default `SPEAKER`).
- `talk` è il titolo del talk, `name`/`role` il relatore.
- Data, città e venue arrivano dalla config del sito: non vanno nel CSV.
- Zero em/en dash nei testi (regola editoriale del progetto).

Se l'utente fornisce un export Sessionize o un altro formato, converti
tu in questo CSV (nel dubbio sul template, chiedi o usa `pop-blue` per
gli speaker e `tier` per gli sponsor).

### Se i dati sono già nel repo

Non costruire il CSV a mano: ci sono due script che lo fanno leggendo i
frontmatter con gray-matter.

```bash
node scripts/talks-csv.mjs 2026 --out talks.csv          # un talk per riga
node scripts/sponsors-csv.mjs 2026 --out sponsors.csv    # un tier per riga
```

- `talks-csv.mjs`: `--template auto` (default: `pop-blue` per un relatore,
  `pop-split` per due), `random` (un template diverso per ogni talk, duo
  garantito dove serve) o un template preciso; `--formats` come la colonna.
- `sponsors-csv.mjs`: badge completo per tier (`MAIN SPONSOR`, `GOLD
  SPONSOR`, `TECH PARTNER` per i tech partner) e preset visivo abbinato.

**Perché non a regex**: i titoli dei talk usano scalari YAML a blocco
(`title: >-` con il testo nelle righe seguenti). Una regex legge `>-` come
titolo e le card escono col titolo sbagliato senza che nulla vada in
errore. Se devi leggere quei file per altro, usa gray-matter.

## 4. Esecuzione

Un comando solo. Lo script apre la pagina di servizio `/brand-kit/card` in
un browser headless, le passa il CSV riga per riga e **scrive i PNG**:
niente interfaccia, niente upload, niente click.

```bash
node scripts/social-cards.mjs --csv /path/to/cards.csv --photos /path/to/foto
```

- `--csv` è l'unico argomento obbligatorio.
- `--photos` serve solo per le immagini fuori dal sito. I valori della
  colonna `media` che iniziano con `/` o con `http` sono già URL e
  funzionano senza: le foto degli speaker stanno in
  `public/images/profiles/`, quindi per loro basta scrivere
  `/images/profiles/nome.webp`.
- `--out DIR` per scegliere la cartella. Senza, lo script crea
  `~/Downloads/cnd-social-cards/batch-N`, con N nuovo a ogni run.
- `--base URL` se il sito non è su `http://localhost:3100`. Funziona anche
  contro una build servita (`npm run build && npx serve out -l 4321`, poi
  `--base http://localhost:4321`): il dev server non è obbligatorio.
- `--keep` lascia il browser aperto, utile solo per guardare la pagina di
  servizio mentre lavora.

Lo script stampa una riga per ogni file scritto, una per ogni notice e una
per ogni riga fallita, e chiude con il conto dei PNG e la cartella.

I nomi di default sono
`cnd2027-<usecase>-<template>-<soggetto>-<extra>-<formato>.png`, dove
l'extra è il talk per gli speaker e il badge per gli sponsor: così un
relatore con due talk e uno sponsor in due tier producono file distinti e
riconoscibili. Se per caso due nomi coincidono comunque, al secondo viene
aggiunto un numero e la cosa è scritta nel riepilogo. Se serve un altro
schema (per esempio solo nome e formato), rinomina i file dopo.

Il **pannello batch** nella pagina studio fa la stessa cosa dall'interfaccia
ed esiste per le persone: non serve a te.

## 5. Verifica prima di consegnare

- Leggi l'output dello script: elenca i file scritti, le **notice** (per
  esempio il template cambiato perché la riga aveva due relatori) e **una
  riga per ogni errore** (media mancante, template inesistente, preset
  sconosciuto). Le righe con errore vengono saltate e lo script esce con
  codice 1: non dare per riuscito un batch senza aver letto l'output.
- Apri con Read almeno 2-3 PNG e controlla: nome e ruolo leggibili e non
  troncati male, titolo che non sfonda, foto ritagliata sul viso, logo
  sponsor dentro il pannello, badge/tier corretti.
- Conta i file: righe valide × formati richiesti.
- Riporta all'utente quante card, quali formati, dove sono e cosa è
  fallito.

## 6. Card singole

Stesso comando con un CSV di una riga: è la strada più rapida e lascia
traccia di cosa è stato generato. La UI dello studio resta utile quando
l'utente vuole provare varianti a occhio, e lì ogni use case mostra anche
una **caption suggerita** con bottone di copia: passala all'utente insieme
all'immagine.

## 7. Limiti noti

- I template speaker non-duo mostrano solo il primo relatore.
- Le foto vanno inquadrate sul soggetto: i template pro ritagliano al
  centro senza pan (il pan manuale esiste solo per le card attendee).
- Badge o tier molto lunghi possono stringere i layout più fitti
  (`bauhaus-yellow` in 1:1): verifica visivamente.
- Loghi sponsor: il logo viene ridotto per stare dentro il pannello, quindi
  uno logo quadrato o verticale esce più piccolo di uno orizzontale. Non
  sborda più, ma su proporzioni estreme vale un'occhiata.
- Il logo CND a colori è un PNG dentro un SVG: in attesa del vettoriale
  vero non ingrandirlo oltre le dimensioni dei template.
