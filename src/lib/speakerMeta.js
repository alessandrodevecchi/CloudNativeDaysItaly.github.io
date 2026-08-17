/*
 * Ruolo, azienda e credenziali di uno speaker: una composizione sola per tutto
 * il sito (agenda, dettaglio talk, griglie, pagina profilo, card social).
 *
 * I dati arrivano da `src/config/profiles/*.md` e non sono uniformi: c'è chi
 * scrive l'azienda dentro `role` ("Director of Community at Multiplayer"), chi
 * la mette davanti ("Liquid Reply | Senior Platform Engineer"), chi la lascia
 * solo nel campo `company`. Chi compila i profili può continuare a scrivere
 * come preferisce: le regole qui sotto evitano la ripetizione.
 *
 * Chi ha due incarichi usa `roles`, una lista di { role, company, companyUrl }.
 * Gli altri restano sui campi singoli e non cambia niente per loro.
 *
 * Il ruolo è lo scatto al momento della call for papers: si aggiorna quando la
 * persona ripropone un talk, non si insegue.
 *
 * Le stesse regole girano in `scripts/speaker-audit.mjs`, che elenca i casi
 * che il codice non può sistemare da sé.
 */

// Separatore tra ruolo e azienda. Per ora `@` come è sempre stato sul sito;
// cambiarlo in ' · ' si fa qui e vale per tutte le pagine.
export const COMPANY_SEPARATOR = '@';

// Separatore tra due incarichi diversi della stessa persona
export const ROLE_SEPARATOR = ' · ';

const LEGAL = /\b(gmbh|srl|spa|inc|ltd|llc|bv|sa|ag|group|italia|italy)\b/gi;

// Confronto "morbido" tra nomi: ignora maiuscole, accenti, punteggiatura e le
// forme societarie, così "Liquid Reply" e "Liquid Reply GmbH" combaciano.
export function looseName(value) {
  return String(value || '')
    .replace(LEGAL, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]/g, '');
}

// L'URL dell'azienda è cliccabile solo se esiste davvero: nei profili storici
// `#` è usato come segnaposto.
function href(value) {
  const url = String(value || '').trim();
  return url && url !== '#' ? url : null;
}

/*
 * Un incarico: { role, company, rule }. `company` è vuota quando va mostrato
 * solo il ruolo, perché l'azienda è già dentro o perché non c'è.
 */
export function composeSpeakerMeta(entry = {}) {
  const role = String(entry.role || '').trim();
  const company = String(entry.company || '').trim();

  if (!company) return { role, company: '', rule: 'solo-role' };
  if (!role) return { role: '', company, rule: 'solo-company' };

  const looseCompany = looseName(company);

  // R0: azienda davanti al ruolo, con un separatore esplicito
  const front = role.match(/^([^|\-–]+?)\s*[|\-–]\s*(.+)$/);
  if (front) {
    const head = front[1].trim();
    const tail = front[2].trim();
    const looseHead = looseName(head);
    if (looseHead && (looseHead === looseCompany || looseCompany.includes(looseHead))) {
      return { role: tail, company, rule: 'R0-azienda-davanti' };
    }
  }

  // R1: azienda in coda dopo un connettore
  const back = role.match(/^(.*?)\s*(?:\bat\b|@|\||,)\s*([^|@]+)$/i);
  if (back) {
    const head = back[1].trim().replace(/[,|-]$/, '').trim();
    const tail = back[2].trim();
    const looseTail = looseName(tail);
    if (head && looseTail) {
      // la coda è l'azienda, o una sua sigla: si tiene la forma del campo
      if (looseTail === looseCompany || looseCompany.includes(looseTail)) {
        return { role: head, company, rule: 'R1-coda' };
      }
      // la coda è più specifica del campo (lo contiene) e resta corta: si
      // tiene la coda, che dice di più ("CERN Open Source Program Office")
      if (looseTail.includes(looseCompany) && tail.length <= 45) {
        return { role: head, company: tail, rule: 'R1-coda-specifica' };
      }
    }
  }

  // R2: azienda già citata nel mezzo del ruolo: non si ripete
  if (looseName(role).includes(looseCompany)) {
    return { role, company: '', rule: 'R2-dentro' };
  }

  return { role, company, rule: 'R3-append' };
}

/*
 * Tutti gli incarichi di una persona, già composti:
 * [{ role, company, href, rule }]. Chi ha un solo incarico ne ha uno.
 */
export function speakerRoles(profile = {}) {
  const entries =
    Array.isArray(profile.roles) && profile.roles.length > 0
      ? profile.roles
      : [{ role: profile.role, company: profile.company, companyUrl: profile.companyUrl }];

  return entries
    .map((entry) => ({ ...composeSpeakerMeta(entry), href: href(entry.companyUrl) }))
    .filter((entry) => entry.role || entry.company);
}

/*
 * Testo piatto, per i posti che non possono usare due nodi (schema.org, card
 * social, alt text). `max` limita quanti incarichi mostrare: in agenda e nel
 * dettaglio talk due bastano, sulle card social ne entra uno.
 */
export function speakerMetaText(profile, { max = Infinity } = {}) {
  return speakerRoles(profile)
    .slice(0, max)
    .map(({ role, company }) =>
      [role, company && `${COMPANY_SEPARATOR}${company}`].filter(Boolean).join(' '),
    )
    .join(ROLE_SEPARATOR);
}
