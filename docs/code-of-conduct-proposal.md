# Code of Conduct: proposta da discutere col team

Documento di lavoro degli organizzatori: **non è il code of conduct
dell'evento** e non è pubblicato sul sito. Serve a portare al team un testo
concreto su cui discutere. Quando è approvato, si pubblica la pagina
`/code-of-conduct` e questo file diventa la traccia della decisione, oppure si
cancella.

## Stato attuale

- Il footer linka `/code-of-conduct`. La pagina non esiste: 404 anche in
  produzione, verificato su `cloudnativedaysitaly.org`.
- Nella sitemap l'indirizzo era dichiarato, quindi Search Console lo segnala
  come errore.
- Nelle FAQ non c'è una sola riga su comportamento, molestie, sicurezza,
  inclusività o accessibilità.

Quindi il buco non è solo una pagina mancante: oggi un partecipante che si
chiede "a chi mi rivolgo se succede qualcosa" non trova risposta da nessuna
parte del sito.

## Come procederei

1. **Chiudere subito il link rotto** (fatto nella PR 2027): il link nel footer
   e la voce nella sitemap vengono rimossi. Un link a un 404 in fondo a ogni
   pagina è peggio dell'assenza del link.
2. **Non pubblicare un CoC in bozza.** Una policy o è adottata o non c'è. Una
   pagina che dice "draft" verrebbe letta come impegno dall'esterno, mentre
   internamente non ci sarebbe nessuno incaricato di leggere le segnalazioni.
   Il rischio non è estetico: è promettere un canale che non risponde.
3. **Questo file è la proposta** da portare al team. Quando il testo e i
   riferimenti sono approvati, si pubblica la pagina in una PR sua, piccola e
   leggibile: sorgente markdown in `src/config/`, pagina `/code-of-conduct`,
   link nel footer, voce in sitemap, rimando nelle FAQ e nella mail di
   conferma del biglietto.

## Decisioni che spettano al team

Sono i punti che bloccano la pubblicazione, non il testo:

- **Indirizzo di segnalazione.** Proposta: `conduct@cloudnativedaysitaly.org`,
  alias dedicato, non la casella `org@`. Cloud Native Days France usa
  `conduct@cloudnativedays.fr`.
- **Chi lo legge.** Almeno due persone, meglio non dello stesso genere, con
  nome e cognome pubblicati sulla pagina. Un indirizzo senza nomi non
  rassicura nessuno.
- **Tempi di risposta dichiarati.** Proposta: presa in carico entro 24 ore
  durante l'evento, entro 5 giorni lavorativi fuori dall'evento.
- **Conseguenze.** Fino all'allontanamento immediato senza rimborso: va
  scritto esplicitamente, altrimenti non è applicabile.
- **Ambito.** Solo l'evento fisico, o anche il gruppo Telegram, i canali
  social e gli spazi degli sponsor? Proposta: tutti, dichiarati uno per uno.
- **In loco.** Chi è riconoscibile come referente durante l'evento (il badge
  ORGANIZER esiste già) e dove si trova il punto di riferimento fisico.
- **Dati delle segnalazioni.** Chi li conserva, dove e per quanto.
- **Traduzione.** Il sito è in inglese: pubblichiamo solo in inglese o anche
  in italiano? Il pubblico è prevalentemente italiano.

## Licenze delle fonti

Da tenere presente prima di copiare testo:

- **Contributor Covenant 2.1**: CC BY 4.0. Basta l'attribuzione, nessun
  obbligo di rilasciare il derivato con la stessa licenza. È la base usata da
  Cloud Native Days France.
- **Berlin Code of Conduct**: CC BY-SA 4.0, ed è quello dietro le pagine di
  molti eventi cloud native. Lo share-alike si trasmette: se copiamo il suo
  testo, il nostro CoC va rilasciato con la stessa licenza.

**Proposta:** partire dal Contributor Covenant per la struttura e riscrivere
con parole nostre le parti buone del Berlin CoC (elenco esplicito dei
comportamenti inaccettabili, conseguenze, gestione dei ricorsi, ambito). Così
restiamo su CC BY, con attribuzione a entrambi come ispirazione.

---

# Testo proposto (inglese, pronto da pubblicare)

I segnaposto `<<...>>` sono le decisioni del punto precedente.

## Our commitment

Cloud Native Days Italy is a community event, run by volunteers, for people who
want to learn and share. We want everyone to take part without being harassed,
belittled or made to feel unwelcome, whatever their gender, gender identity and
expression, sexual orientation, disability, physical appearance, body size,
ethnicity, nationality, age, religion, level of experience or employer.

This code of conduct applies to everyone who takes part: attendees, speakers,
sponsors, exhibitors, volunteers and organisers.

## Where it applies

- the venue, for the whole duration of the event, including sponsor booths, the
  community area and social moments around the conference
- our online spaces: the Telegram community, the social accounts of the event
  and any chat we open for an edition
- one to one conversations that start in any of those places

## Expected behaviour

- Be respectful and considerate. Disagree on ideas, not on people.
- Take part authentically. Contribute to the health of the community and the
  quality of the conversations.
- Mind your impact. What is a joke to you can be a barrier for someone else.
- If you see something that looks like a violation, say something to the
  organisers, even if you are not the person affected.
- Follow the instructions of the venue staff and of the organisers, especially
  on safety.

## Unacceptable behaviour

- intimidation, stalking or following someone
- harassing photography or recording, including of the screens or badges of
  other people
- unwelcome sexual attention, comments or images
- discriminatory jokes and language, including in slides and demos
- sustained disruption of talks, workshops or other activities
- inappropriate physical contact
- advocating for, or encouraging, any of the above

Sexual language and imagery are not appropriate anywhere at the event,
including in talks, slides, booths and swag.

## Reporting

If you are harassed, if you notice someone else being harassed, or if anything
makes you uncomfortable, tell us.

- write to **<<conduct@cloudnativedaysitaly.org>>**
- during the event, speak to any person wearing an ORGANIZER badge, or go to
  the registration desk and ask for <<nome referente 1>> or <<nome referente 2>>
- in an emergency, or if you are in danger, call 112 first

Reports are read by <<nome referente 1>> and <<nome referente 2>>. We treat what
you tell us as confidential: we do not share your name with the person you are
reporting, or with anyone outside the people handling the report, unless you ask
us to or the law requires it.

## What happens after a report

We take it in charge within <<24 ore durante l'evento, 5 giorni lavorativi
fuori dall'evento>>. We listen, we do not ask you to confront anyone, and we
tell you what we decide to do. If you need it, we can help you contact venue
security or local law enforcement, arrange an escort, or simply stay with you
while you decide what you want to do.

## Consequences

Depending on what happened, we may give a warning, ask someone to stop a
specific behaviour, ask them to leave a room, or remove them from the event
without a refund and without a warning. Sponsors and speakers are held to the
same standard as everyone else: a sponsor can be asked to close a booth, a
speaker can be taken off the programme.

## If you think we got it wrong

If you are told you violated this code of conduct and you disagree, write to
<<conduct@cloudnativedaysitaly.org>> with your side of the story. A person who
was not involved in the original decision will look at it.

## Attribution

This code of conduct is inspired by the
[Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/),
version 2.1, and by the [Berlin Code of Conduct](https://berlincodeofconduct.org/).

---

## Note tecniche per quando si pubblica

- Sorgente in `src/config/code-of-conduct.md`, con frontmatter per titolo e
  data di ultimo aggiornamento, così il testo si aggiorna senza toccare il
  codice, come per il resto dei contenuti.
- Pagina `/code-of-conduct`, `metadata` con titolo dalla config, aggiunta alla
  lista statica in `scripts/generate-sitemap.js` e link ripristinato nel
  footer.
- Aggiungere una FAQ che rimanda alla pagina, perché la FAQ è dove la gente
  cerca "cosa faccio se".
- Data di ultima revisione visibile in pagina: un CoC senza data sembra
  abbandonato.
- Zero em dash ed en dash, come per il resto dei testi del sito.
