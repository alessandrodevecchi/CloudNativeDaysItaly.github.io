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
 * Le stesse regole girano in `scripts/speaker-audit.mjs`, che elenca i casi
 * che il codice non può sistemare da sé.
 */

// Separatore tra ruolo e azienda. Per ora `@` come è sempre stato sul sito;
// cambiarlo in ' · ' si fa qui e vale per tutte le pagine.
export const COMPANY_SEPARATOR = '@';

const LEGAL = /\b(gmbh|srl|spa|inc|ltd|llc|bv|sa|ag|group|italia|italy)\b/gi;

// "Azienda" che non è un'azienda: appenderla ("Cloud Engineer @Freelancer")
// suona sbagliato, e spostarla via dal ruolo perderebbe l'informazione. Si
// lascia il ruolo come è scritto.
const GENERIC_COMPANY = /^(freelance|freelancer|independent|self.?employed|libero professionista)$/i;

// Confronto "morbido" tra nomi: ignora maiuscole, accenti, punteggiatura e le
// forme societarie, così "Liquid Reply" e "Liquid Reply GmbH" combaciano.
export function looseName(value) {
  return String(value || '')
    .replace(LEGAL, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]/g, '');
}

/*
 * Ritorna { role, company, rule }: `company` è vuota quando va mostrato solo
 * il ruolo (perché l'azienda è già dentro, o perché non c'è).
 */
export function composeSpeakerMeta(profile = {}) {
  const role = String(profile.role || '').trim();
  const company = String(profile.company || '').trim();

  if (!company) return { role, company: '', rule: 'solo-role' };
  if (!role) return { role: '', company, rule: 'solo-company' };
  if (GENERIC_COMPANY.test(company)) {
    // se il ruolo non lo dice già, l'etichetta generica resta l'unica cosa da
    // mostrare accanto: meglio "Freelance" dentro il ruolo, vedi la convenzione
    return looseName(role).includes(looseName(company))
      ? { role, company: '', rule: 'generica-dentro' }
      : { role, company, rule: 'generica-append' };
  }

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

// Testo piatto, per i posti che non possono usare due nodi (schema.org, card
// social, alt text).
export function speakerMetaText(profile) {
  const { role, company } = composeSpeakerMeta(profile);
  return [role, company && `${COMPANY_SEPARATOR}${company}`].filter(Boolean).join(' ');
}

// L'URL dell'azienda è cliccabile solo se esiste davvero: nei profili storici
// `#` è usato come segnaposto.
export function companyHref(profile = {}) {
  const url = String(profile.companyUrl || '').trim();
  return url && url !== '#' ? url : null;
}
