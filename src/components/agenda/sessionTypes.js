import { Mic, Star, Wrench, Zap } from 'lucide-react';

// Colori e icone semantiche per tipo di sessione, condivisi da agenda,
// content hub e ovunque compaia un tag di tipo — vedi docs/design-system.md.
export const SESSION_TYPE_STYLES = {
  keynote: 'bg-brand-magenta text-white',
  talk: 'bg-brand-yellow text-ink',
  workshop: 'bg-brand-blue text-white',
  'lightning-talk': 'bg-brand-yellow text-ink',
};

export const SESSION_TYPE_ICONS = {
  keynote: Star,
  talk: Mic,
  workshop: Wrench,
  'lightning-talk': Zap,
};

// Chip di tipo sessione pronta all'uso (icona + label).
export function SessionTypeBadge({ type, className = '' }) {
  if (!type) return null;
  const Icon = SESSION_TYPE_ICONS[type] || Mic;
  const style = SESSION_TYPE_STYLES[type] || SESSION_TYPE_STYLES.talk;
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-ink px-2 py-1 text-xs font-bold uppercase ${style} ${className}`}
    >
      <Icon className='h-3.5 w-3.5' />
      {type}
    </span>
  );
}
