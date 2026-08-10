// Registry degli use case del card generator. Un use case è SOLO dati:
// aggiungerne uno nuovo non richiede modifiche al motore di rendering.
// `visibility` separa gli use case pubblici da quelli della futura
// versione interna per il team ('internal').
export const USE_CASES = [
  {
    id: 'attendee-conference',
    caption:
      'I\'ll be at Cloud Native Days Italy 2027 in Bologna on 20 May, two days of cloud native talks, workshops and community. Come say hi! cloudnativedaysitaly.org #CNDItaly #CloudNative',
    label: 'Attending Conference',
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
    colorways: ['blue', 'magenta', 'yellow', 'ink'],
    defaultColorway: 'blue',
  },
  {
    id: 'attendee-workshops',
    caption:
      'Hands-on day for me: I\'m joining the Cloud Native Days Italy 2027 workshops in Bologna on 20 May. cloudnativedaysitaly.org #CNDItaly #CloudNative',
    label: 'Attending Workshops',
    visibility: 'public',
    headlines: [
      { id: 'see-you-ws', lines: ['See you at', 'the workshops!'], accentIndex: 1 },
      { id: 'learning', lines: ['Learning at', 'the workshops!'], accentIndex: 1 },
      { id: 'joining-ws', lines: ["I'm joining", 'the workshops!'], accentIndex: 1 },
    ],
    defaultHeadline: 'see-you-ws',
    fields: [
      { id: 'name', label: 'Full name', placeholder: 'Ada Lovelace', max: 40 },
      { id: 'role', label: 'Role (optional)', placeholder: 'Platform Engineer', max: 40 },
    ],
    media: { type: 'photo', label: 'Your photo (optional)' },
    colorways: ['blue', 'magenta', 'yellow', 'ink'],
    defaultColorway: 'blue',
  },
  {
    id: 'partner',
    caption:
      'We\'re proud to support Cloud Native Days Italy 2027, the event of the Italian cloud native community. See you in Bologna on 20 May! cloudnativedaysitaly.org #CNDItaly',
    label: 'Supporting Partner',
    visibility: 'public',
    headlines: [
      { id: 'proud', lines: ['Proud', 'partner!'], accentIndex: 1 },
      { id: 'supporting', lines: ["We're", 'supporting!'], accentIndex: 1 },
    ],
    defaultHeadline: 'proud',
    fields: [
      { id: 'org', label: 'Organization name', placeholder: 'Awesome Community', max: 50 },
    ],
    media: { type: 'logo', label: 'Your logo (optional)' },
    colorways: ['blue', 'magenta', 'yellow', 'ink'],
    defaultColorway: 'blue',
  },

  /* ── Use case interni: visibili solo su /brand-kit/studio (team) ──── */
  {
    id: 'speaker',
    caption:
      'I\'m speaking at Cloud Native Days Italy 2027 in Bologna on 20 May! Join me and the Italian cloud native community. cloudnativedaysitaly.org #CNDItaly #CloudNative',
    label: 'Speaker',
    visibility: 'internal',
    headlines: [
      { id: 'speaking', lines: ["I'm", 'speaking!'], accentIndex: 1 },
      { id: 'meet', lines: ['Meet our', 'speaker!'], accentIndex: 1 },
      { id: 'on-stage', lines: ['On', 'stage!'], accentIndex: 1 },
    ],
    defaultHeadline: 'speaking',
    fields: [
      { id: 'name', label: 'Full name', placeholder: 'Ada Lovelace', max: 40 },
      { id: 'role', label: 'Role / company (optional)', placeholder: 'Platform Engineer @ ACME', max: 50 },
      { id: 'talk', label: 'Talk title (optional)', placeholder: 'Scaling Kubernetes the hard way', max: 80, style: 'quote' },
    ],
    media: { type: 'photo', label: 'Speaker photo (optional)' },
    colorways: ['blue', 'magenta', 'yellow', 'ink'],
    defaultColorway: 'blue',
  },
  {
    id: 'sponsor',
    caption:
      'We\'re a proud sponsor of Cloud Native Days Italy 2027, two days of cloud native talks, workshops and community in Bologna on 20 May. cloudnativedaysitaly.org #CNDItaly',
    label: 'Sponsor',
    visibility: 'internal',
    headlines: [
      { id: 'proud-sponsor', lines: ['Proud', 'sponsor!'], accentIndex: 1 },
      { id: 'sponsoring', lines: ["We're", 'sponsoring!'], accentIndex: 1 },
    ],
    defaultHeadline: 'proud-sponsor',
    fields: [
      { id: 'org', label: 'Company name', placeholder: 'ACME Corp', max: 50 },
      { id: 'tier', label: 'Tier (optional)', placeholder: 'Gold Sponsor', max: 30, style: 'chip' },
    ],
    media: { type: 'logo', label: 'Company logo (optional)' },
    colorways: ['blue', 'magenta', 'yellow', 'ink'],
    defaultColorway: 'blue',
  },
  {
    id: 'community',
    caption:
      'Meet us at Cloud Native Days Italy 2027! We\'ll be in the community and open source area in Bologna on 20 May. cloudnativedaysitaly.org #CNDItaly #OpenSource',
    label: 'Community / OS Project',
    visibility: 'internal',
    headlines: [
      { id: 'meet-us', lines: ['Meet us', 'there!'], accentIndex: 1 },
      { id: 'we-there', lines: ["We'll be", 'there!'], accentIndex: 1 },
      { id: 'find-us', lines: ['Find us at', 'the event!'], accentIndex: 1 },
    ],
    defaultHeadline: 'meet-us',
    fields: [
      { id: 'org', label: 'Community / project name', placeholder: 'Kubernetes Community Milano', max: 50 },
    ],
    media: { type: 'logo', label: 'Logo (optional)' },
    colorways: ['blue', 'magenta', 'yellow', 'ink'],
    defaultColorway: 'blue',
  },
  {
    id: 'custom',
    label: 'Custom',
    visibility: 'internal',
    customHeadline: true,
    headlines: [
      { id: 'custom', lines: ['Your text', 'here!'], accentIndex: 1 },
    ],
    defaultHeadline: 'custom',
    fields: [
      { id: 'primary', label: 'Primary text (optional)', placeholder: 'Bold line under the headline', max: 60 },
      { id: 'secondary', label: 'Secondary text (optional)', placeholder: 'Smaller line below', max: 80 },
    ],
    media: { type: 'choice', label: 'Photo or logo (optional)' },
    colorways: ['blue', 'magenta', 'yellow', 'ink'],
    defaultColorway: 'blue',
  },
];

export const publicUseCases = () =>
  USE_CASES.filter((useCase) => useCase.visibility === 'public');

export const allUseCases = () => USE_CASES;

export const getUseCase = (id) => USE_CASES.find((useCase) => useCase.id === id);
