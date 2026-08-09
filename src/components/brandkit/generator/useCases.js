// Registry degli use case del card generator. Un use case è SOLO dati:
// aggiungerne uno nuovo non richiede modifiche al motore di rendering.
// `visibility` separa gli use case pubblici da quelli della futura
// versione interna per il team ('internal').
export const USE_CASES = [
  {
    id: 'attendee-conference',
    label: 'Conference',
    visibility: 'public',
    // headline: righe di testo display; accentIndex = riga in colore accent
    headlines: [
      { id: 'see-you', lines: ['See you', 'there!'], accentIndex: 1 },
      { id: 'be-there', lines: ["I'll be", 'there!'], accentIndex: 1 },
      { id: 'joining', lines: ["I'm", 'joining!'], accentIndex: 1 },
    ],
    defaultHeadline: 'see-you',
    fields: [
      { id: 'name', label: 'Full name', placeholder: 'Ada Lovelace', max: 40 },
      { id: 'role', label: 'Role (optional)', placeholder: 'Platform Engineer', max: 40 },
    ],
    media: { type: 'photo', label: 'Your photo (optional)' },
    colorways: ['blue'],
    defaultColorway: 'blue',
  },
];

export const publicUseCases = () =>
  USE_CASES.filter((useCase) => useCase.visibility === 'public');

export const getUseCase = (id) => USE_CASES.find((useCase) => useCase.id === id);
