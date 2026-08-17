import Link from 'next/link';
import './PersonCard.css';
import { speakerMetaText } from '@/lib/speakerMeta';

const PersonCard = ({ person, link }) => (
  <Link href={link} className='person-card-link group'>
    <div className='person-card'>
      <div className='person-card-background'></div>
      <div className='person-card-content'>
        <div className='person-card-image-wrapper **relative**'>
          <img
            src={person.image}
            alt={person.name}
            className='person-card-image'
          />

          {person.level && (
            <div
              className={`absolute top-2 left-2 border border-ink px-3 py-1 text-xs font-bold uppercase ${
                person.level === 'core'
                  ? 'bg-brand-magenta text-white'
                  : 'bg-brand-yellow text-ink'
              }`}
            >
              {person.level === 'core' ? 'Core Organizer' : 'Organizer'}
            </div>
          )}
        </div>

        <div className='person-card-info'>
          <h3 className='person-card-name'>{person.name}</h3>
          {/* Ruolo e azienda dalla composizione condivisa: qui due incarichi
              stanno in fila, il terzo non entrerebbe nella card. */}
          <p className='person-card-role'>{speakerMetaText(person, { max: 2 })}</p>
          {person.communityRole && (
            <p className='person-card-community-role'>{person.communityRole}</p>
          )}
        </div>
      </div>
    </div>
  </Link>
);

export default PersonCard;
