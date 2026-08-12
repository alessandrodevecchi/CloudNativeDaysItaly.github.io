---
name: cnd-social-cards
description: Genera le card social di Cloud Native Days Italy (speaker, sponsor, partner, attendee) pilotando il card generator del sito: una sola card o un elenco intero. Usa questa skill quando l'utente chiede di produrre le immagini/post social per uno speaker o per gli speaker selezionati, per gli sponsor, per i partner o per una lista di persone, sia con un CSV o un export Sessionize o una cartella di foto e loghi, sia incollando i dati grezzi in chat. Trigger: "genera la card", "genera le card", "genera i post per gli speaker", "crea l'immagine social dello sponsor", "batch card", "social card generator", "card studio".
---

# Card social CND: generazione

Il sito ha un generatore di card che rende su canvas i template approvati.
Non esiste (e non serve) un servizio esterno: si pilota il generatore nel
browser e i PNG finiscono in una cartella.

Vale per **una card come per cento**: per una sola compila il form della
pagina studio e scarica, per un elenco usa il pannello batch con un CSV.

## 1. Dove vive

- Repo: `~/webdev/CloudNativeDaysItaly.github.io`.
- Pagina pubblica `/brand-kit` (sezione `#generator`): solo card
  pubbliche (attendee conference/workshops, supporting partner).
- **Pagina interna `/brand-kit/studio`**: tutti gli use case, inclusi
  **speaker** e **sponsor** (template "pro" approvati), più il pannello
  **Batch generation**. Non è linkata dal sito e va usata per il lavoro
  massivo.
- Codice: `src/components/brandkit/generator/` (motore base) e
  `.../generator/pro/` (template speaker/sponsor: `templates.js` con i
  layout approvati, `registry.js` col catalogo, `assets.js` per gli SVG
  di `public/brand-kit/`).

## 2. Preparazione

```bash
cd ~/webdev/CloudNativeDaysItaly.github.io
git branch --show-current   # serve un branch che contenga il generator
npx next dev -p 3100        # se la porta 3100 è occupata, riusa quel server
```

Il generator vive sui branch `feat/card-generator` e
`feat/content-2027-preview-data`. Se il branch corrente non ha
`src/components/brandkit/generator/pro/`, fai checkout di
`feat/card-generator` (chiedi conferma se ci sono modifiche pendenti).

Le foto degli speaker e i loghi degli sponsor devono stare in una
cartella locale: si caricano nel pannello batch e **il nome del file nel
CSV deve combaciare esattamente** con quello caricato.

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

## 4. Esecuzione

Il pannello scrive in una cartella scelta via File System Access API;
pilotandolo da playwright conviene disabilitarla e raccogliere i
download, che finiscono in `.playwright-cli/`.

```bash
playwright-cli open http://localhost:3100/brand-kit/studio
playwright-cli run-code "async page => {
  await page.waitForTimeout(2500);
  await page.evaluate(() => { delete window.showDirectoryPicker; });
  const files = [];
  page.on('download', d => files.push(d.suggestedFilename()));
  await page.locator('input[accept=\".csv,text/csv\"]').setInputFiles('/path/to/cards.csv');
  await page.locator('input[accept=\"image/*\"][multiple]').setInputFiles([
    '/path/to/photos/serena.jpg',
    '/path/to/photos/duo.jpg',
  ]);
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: /Generate/ }).click();
  await page.waitForTimeout(20000);   // ~1-2s per card per formato
  const summary = await page.locator('div.border-pop.bg-white.p-4').innerText().catch(() => 'nessun riepilogo');
  return JSON.stringify({ files, summary });
}"
```

Poi sposta i PNG dove serve e chiudi il browser:

```bash
mkdir -p out/social-cards && mv .playwright-cli/cnd2027-*.png out/social-cards/
playwright-cli close
```

Alza il timeout in proporzione: N righe × N formati × ~1,5s.

## 5. Verifica prima di consegnare

- Leggi il riepilogo del pannello: riporta i PNG generati e **una riga
  per ogni errore** (media mancante, template inesistente, preset
  sconosciuto). Le righe con errore vengono saltate, le altre completate:
  non dare per riuscito un batch senza aver letto il riepilogo.
- Apri con Read almeno 2-3 PNG e controlla: nome e ruolo leggibili e non
  troncati male, titolo che non sfonda, foto ritagliata sul viso, logo
  sponsor dentro il pannello, badge/tier corretti.
- Conta i file: righe valide × formati richiesti.
- Riporta all'utente quante card, quali formati, dove sono e cosa è
  fallito.

## 6. Card singole

Per una card sola conviene la UI: apri lo studio, scegli card type e
template, compila i campi, carica la foto, poi "Download PNG" (formato
corrente) o "All formats". Ogni use case mostra anche una **caption
suggerita** con bottone di copia: passala all'utente insieme
all'immagine.

## 7. Limiti noti

- I template speaker non-duo mostrano solo il primo relatore.
- Le foto vanno inquadrate sul soggetto: i template pro ritagliano al
  centro senza pan (il pan manuale esiste solo per le card attendee).
- Badge o tier molto lunghi possono stringere i layout più fitti
  (`bauhaus-yellow` in 1:1): verifica visivamente.
- Loghi sponsor con proporzioni estreme (molto verticali) sono da
  controllare a occhio.
- Il logo CND a colori è un PNG dentro un SVG: in attesa del vettoriale
  vero non ingrandirlo oltre le dimensioni dei template.
