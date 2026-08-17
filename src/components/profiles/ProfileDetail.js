'use client';

import { useState } from 'react';
import Link from 'next/link';
import { speakerRoles, COMPANY_SEPARATOR } from '@/lib/speakerMeta';
import {
  Award,
  Mic,
  Star,
  Zap,
  Linkedin,
  Github,
  Globe,
  ArrowRight,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Wrench,
  Youtube,
  FileText,
} from 'lucide-react';

const TalkTimelineCard = ({ talk }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const typeDetails = {
    keynote: {
      icon: <Star className='h-4 w-4' />,
      label: 'Keynote',
      style: 'bg-brand-magenta text-white border border-ink',
    },
    'lightning-talk': {
      icon: <Zap className='h-4 w-4' />,
      label: 'Lightning Talk',
      style: 'bg-brand-yellow text-ink border border-ink',
    },
    talk: {
      icon: <Mic className='h-4 w-4' />,
      label: 'Talk',
      style: 'bg-brand-yellow text-ink border border-ink',
    },
    workshop: {
      icon: <Wrench className='h-4 w-4' />,
      label: 'Workshop',
      style: 'bg-brand-blue text-white border border-ink',
    },
  };

  const currentType = typeDetails[talk.type] || typeDetails.talk;

  const tagColorMap = {
    ENG: 'bg-brand-blue text-white border border-ink',
    ITA: 'bg-brand-yellow text-ink border border-ink',
    SPONSORED: 'bg-brand-magenta text-white border border-ink',
    default: 'bg-white text-ink border border-ink',
  };

  return (
    <div className='card-pop p-5'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4'>
        <span
          className={`inline-flex items-center gap-2 text-sm font-bold px-3 py-1 uppercase ${currentType.style}`}
        >
          {currentType.icon}
          {currentType.label}
        </span>
        <div className='flex items-center gap-2 flex-wrap'>
          {talk.tags?.map((tag) => (
            <span
              key={tag}
              className={`text-xs font-bold px-2 py-0.5 uppercase ${tagColorMap[tag] || tagColorMap.default}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <h4 className='font-bold text-lg text-ink'>{talk.title}</h4>

      <p
        className={`text-sm text-ink-muted mt-2 transition-all duration-300 whitespace-pre-line ${!isExpanded && 'line-clamp-3'}`}
      >
        {talk.abstract}
      </p>

      <div className='flex items-center justify-between mt-4 pt-4 border-t border-ink/20'>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='inline-flex items-center gap-1 text-sm text-ink-muted font-semibold hover:text-ink'
        >
          {isExpanded ? 'Show less' : 'Show more'}
          {isExpanded ? (
            <ChevronUp className='h-4 w-4' />
          ) : (
            <ChevronDown className='h-4 w-4' />
          )}
        </button>
        <Link
          href={`/talk/${talk.id}`}
          className='flex items-center gap-3 sm:gap-4 text-sm text-brand-blue font-bold group'
        >
          {talk.video && (
            <Youtube
              className='h-5 w-5 text-ink-faint group-hover:text-brand-magenta transition-colors'
              title='Video available'
            />
          )}
          {talk.slide && (
            <FileText
              className='h-5 w-5 text-ink-faint group-hover:text-brand-blue transition-colors'
              title='Slides available'
            />
          )}
          <span className='inline-flex items-center gap-1 group-hover:gap-2 transition-all'>
            View Session <ArrowRight className='h-4 w-4' />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default function ProfileDetail({ profile }) {
  const roles = speakerRoles(profile);
  const roleColors = {
    'Core Organizer': 'bg-brand-magenta text-white border border-ink',
    Organizer: 'bg-brand-yellow text-ink border border-ink',
    Speaker: 'bg-brand-blue text-white border border-ink',
  };

  return (
    <div className='bg-white min-h-screen'>
      <div className='mx-auto max-w-[1200px] px-6 py-12 lg:py-20'>
        <div className='lg:flex lg:gap-12'>
          <aside className='lg:w-1/3 lg:sticky lg:top-24 self-start mb-12 lg:mb-0'>
            <div className='card-pop p-6 sm:p-8 text-center'>
              <img
                src={profile.image}
                alt={profile.name}
                className='w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto mb-6 border-2 border-ink object-cover'
              />
              <h1 className='text-2xl sm:text-3xl font-bold text-ink'>
                {profile.name}
              </h1>
              {/* Ruolo e azienda passano da una composizione sola (vedi
                  src/lib/speakerMeta.js): chi scrive i profili può mettere
                  l'azienda dentro `role`, qui non viene ripetuta. L'azienda è
                  cliccabile solo dove c'è spazio per un link, cioè qui.
                  Le etichette dicono perché ci sono due righe: il ruolo è
                  quello che la persona fa, il community role è ciò per cui è
                  riconosciuta nella community. */}
              {roles.length > 0 && (
                <p className='mt-5 text-xs font-bold uppercase tracking-widest text-ink-muted'>
                  {roles.length > 1 ? 'Roles' : 'Role'}
                </p>
              )}
              {roles.map((entry) => (
                <p
                  key={`${entry.role}-${entry.company}`}
                  className='text-base sm:text-lg text-brand-blue font-semibold mt-1'
                >
                  {entry.role}
                  {entry.company && (
                    <>
                      {entry.role ? ' ' : ''}
                      {entry.href ? (
                        <a
                          href={entry.href}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='underline decoration-brand-blue/30 decoration-2 underline-offset-4 transition-colors hover:text-brand-magenta hover:decoration-brand-magenta/40'
                        >
                          {COMPANY_SEPARATOR}
                          {entry.company}
                        </a>
                      ) : (
                        `${COMPANY_SEPARATOR}${entry.company}`
                      )}
                    </>
                  )}
                </p>
              ))}
              {profile.communityRole && (
                <div className='mt-4'>
                  <p className='text-xs font-bold uppercase tracking-widest text-ink-muted'>
                    Community role
                  </p>
                  <p className='mt-1 text-sm font-semibold text-brand-magenta'>
                    {profile.communityRole}
                  </p>
                </div>
              )}
              <div className='flex justify-center gap-5 mt-6'>
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-ink-muted hover:text-brand-blue transition-colors'
                  >
                    <Linkedin />
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-ink-muted hover:text-ink transition-colors'
                  >
                    <Github />
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-ink-muted hover:text-brand-blue transition-colors'
                  >
                    <Globe />
                  </a>
                )}
              </div>
              <p className='text-sm sm:text-base text-ink-muted mt-6 pt-6 border-t-2 border-ink text-left whitespace-pre-line'>
                {profile.bio}
              </p>
            </div>
          </aside>

          <main className='lg:w-2/3'>
            <h2 className='section-heading mb-8'>
              Community Contributions
            </h2>
            {profile.history.length > 0 ? (
              <div className='space-y-12'>
                {profile.history.map((yearEntry) => (
                  <div
                    key={yearEntry.year}
                    className='relative pl-6 sm:pl-8 border-l-2 border-ink'
                  >
                    <div className='absolute -left-[11px] top-1 w-5 h-5 bg-brand-magenta rounded-full border-2 border-ink'></div>
                    <Link
                      href={`/${yearEntry.year}`}
                      className='group inline-flex items-center gap-2'
                    >
                      <h3 className='font-display text-xl sm:text-2xl uppercase text-ink group-hover:text-brand-blue transition-colors'>
                        Edition {yearEntry.year}
                      </h3>
                      <LinkIcon className='h-4 w-4 text-ink-faint group-hover:text-brand-blue transition-colors' />
                    </Link>
                    <div className='flex flex-wrap gap-2 my-4'>
                      {yearEntry.roles.map((role) => (
                        <span
                          key={role}
                          className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 ${roleColors[role]}`}
                        >
                          <Award className='h-4 w-4' /> {role}
                        </span>
                      ))}
                    </div>
                    {yearEntry.talks.length > 0 && (
                      <div className='space-y-4 mt-6'>
                        {yearEntry.talks.map((talk) => (
                          <TalkTimelineCard key={talk.id} talk={talk} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className='card-pop p-8 text-center'>
                <p className='text-ink-muted'>
                  No community contributions found for this person yet.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
