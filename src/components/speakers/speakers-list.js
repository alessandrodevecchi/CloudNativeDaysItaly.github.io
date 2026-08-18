'use client';

import Link from 'next/link';
import {
  Linkedin,
  Globe,
  Github,
  Award,
  Mic,
  FileText,
  ArrowRight,
} from 'lucide-react';
import config from '@/config/website.json';
import C4P_Card from '@/components/actions/C4P_Card';
import TicketsCard from '@/components/actions/TicketsCard';
import DecorLayer from '@/components/decor/DecorLayer';
import { speakerMetaText } from '@/lib/speakerMeta';

const SpeakerCard = ({ speaker }) => (
  <div className='card-pop group relative text-center transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop flex flex-col'>
    <div className='p-8 flex-grow flex flex-col items-center'>
      <div className='relative'>
        <Link href={`/profile/${speaker.id}`} aria-label={`Profile of ${speaker.name}`}>
          <img
            src={speaker.image || '/images/team/profile.webp'}
            alt={speaker.name}
            className='w-32 h-32 rounded-full object-cover mx-auto border-2 border-ink'
          />
        </Link>
        {speaker.isMC && (
          <div
            className='absolute -top-1 -right-1 bg-brand-magenta text-white h-10 w-10 flex items-center justify-center rounded-full border-2 border-ink'
            title={`Master of Ceremony for ${speaker.mcDay}`}
          >
            <Mic size={20} />
          </div>
        )}
      </div>

      <h3 className='mt-6 text-xl font-bold text-ink'>
        <Link
          href={`/profile/${speaker.id}`}
          className='transition-colors hover:text-brand-blue'
        >
          {speaker.name}
        </Link>
      </h3>
      <p className='mt-1 text-sm text-ink-muted'>{speakerMetaText(speaker, { max: 2 })}</p>
      {/* Stessa scala delle card delle edizioni passate: nome, poi ruolo,
          poi il riconoscimento, un gradino più leggero. */}
      {speaker.communityRole && (
        <p className='mt-1 text-[0.8rem] text-ink-faint'>{speaker.communityRole}</p>
      )}

      <div className='mt-auto pt-6 flex justify-center gap-5'>
        {speaker.linkedin && (
          <a
            href={speaker.linkedin}
            target='_blank'
            rel='noopener noreferrer'
            className='text-ink-muted hover:text-brand-blue transition-colors'
            aria-label='LinkedIn'
          >
            <Linkedin size={20} />
          </a>
        )}
        {speaker.github && (
          <a
            href={speaker.github}
            target='_blank'
            rel='noopener noreferrer'
            className='text-ink-muted hover:text-ink transition-colors'
            aria-label='GitHub'
          >
            <Github size={20} />
          </a>
        )}
        {speaker.website && (
          <a
            href={speaker.website}
            target='_blank'
            rel='noopener noreferrer'
            className='text-ink-muted hover:text-brand-blue transition-colors'
            aria-label='Website'
          >
            <Globe size={20} />
          </a>
        )}
      </div>
    </div>
    <div className='border-t-2 border-ink bg-brand-blue transition-colors hover:bg-ink'>
      <Link
        href={`/profile/${speaker.id}`}
        className='block w-full p-4 text-center text-sm font-bold uppercase text-white'
      >
        View Profile
      </Link>
    </div>
  </div>
);

const SpeakersComingSoon = () => (
  <div className='mt-16'>
    <div className='card-pop max-w-3xl bg-brand-yellow-light p-8 shadow-pop-lg'>
      <h2 className='section-heading'>
        Our First Speakers Will Be Announced Soon!
      </h2>
      <p className='mt-4 text-lg text-ink-muted'>
        The Call for Papers is currently in progress, and we are curating a
        diverse and inspiring lineup from the amazing submissions. Stay tuned as
        we begin to reveal the brilliant minds joining us for this edition.
      </p>
    </div>
    <div className='mt-12'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
        <C4P_Card data={config.proposal} />
        <TicketsCard data={config.tickets} />
      </div>
    </div>
  </div>
);

export default function SpeakersList({ speakers }) {
  if (!speakers) return null;

  const displaySpeakers = speakers.filter(
    (speaker) => speaker.name && !speaker.name.includes('TBA'),
  );

  return (
    <div className='relative overflow-hidden bg-white py-16 lg:py-24'>
      <DecorLayer
        items={[
          { pattern: 'cluster-e', position: 'top-right', size: 'lg' },
          { pattern: 'cluster-duo', position: 'bottom-left', size: 'md' },
          { pattern: 'halftone-c', position: 'top-left', size: 'lg', className: 'opacity-25' },
        ]}
      />
      <div className='relative z-10 mx-auto max-w-[1200px] px-6'>
        <div className='max-w-3xl'>
          <span className='stamp'>Speakers {config.general.edition}</span>
          <h1 className='section-heading mt-6'>
            Meet the Experts
          </h1>
          <p className='mt-4 text-lg text-ink-muted'>
            A group of passionate leaders, innovators, and experts from the
            cloud native world, ready to share their knowledge and inspire the
            community.
          </p>
        </div>

        {displaySpeakers.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-16'>
            {displaySpeakers.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        ) : (
          <SpeakersComingSoon />
        )}
      </div>
    </div>
  );
}
