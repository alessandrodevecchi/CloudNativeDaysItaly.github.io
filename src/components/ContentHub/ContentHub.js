'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Mic, ArrowRight, ArrowLeft } from 'lucide-react';
import DecorLayer from '@/components/decor/DecorLayer';
import { SessionTypeBadge } from '@/components/agenda/sessionTypes';

const TalkCard = ({ talk }) => {
  const defaultImage = '/images/placeholder.png';
  const imageUrl = talk.image ? talk.image : defaultImage;
  return (
    <div className='card-pop overflow-hidden transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop group h-full flex flex-col'>
      <Link
        href={`/talk/${talk.id}`}
        aria-label={`View session: ${talk.title}`}
        className='relative block w-full h-48 sm:h-56 overflow-hidden bg-ink border-b-2 border-ink'
      >
        <Image
          src={imageUrl ? imageUrl : defaultImage}
          alt={`Preview for ${talk.title}`}
          fill
          style={{ objectFit: 'contain' }}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          priority={false}
        />
      </Link>
      <div className='p-6 flex-grow flex flex-col'>
        <div className='flex justify-between items-center mb-3'>
          <span className='text-xs font-bold px-3 py-1 border border-ink bg-white text-ink uppercase'>
            Edition {talk.year}
          </span>
          {talk.type && <SessionTypeBadge type={talk.type} />}
        </div>
        <h3
          className='font-bold text-ink text-lg line-clamp-2'
          title={talk.title}
        >
          <Link href={`/talk/${talk.id}`} className='hover:text-brand-blue transition-colors'>
            {talk.title}
          </Link>
        </h3>
        {talk.speakers && talk.speakers.length > 0 && (
          <p className='text-sm text-ink-muted mt-2 flex items-center gap-2'>
            <Mic size={14} />
            <span className='truncate'>
              {talk.speakers.map((s) => s.name).join(', ')}
            </span>
          </p>
        )}
        <p className='text-sm text-ink-muted line-clamp-3 mt-3'>
          {talk.abstract}
        </p>
        <div className='mt-auto pt-4 border-t border-ink/20 mt-4'>
          <Link
            href={`/talk/${talk.id}`}
            className='inline-flex items-center gap-1 text-sm text-brand-blue font-bold hover:gap-2 transition-all'
          >
            View Session <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className='flex items-center justify-center gap-4 mt-12'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-4 py-2 bg-white border-pop border-ink font-bold text-ink hover:bg-brand-yellow-light'
      >
        <ArrowLeft size={16} /> Previous
      </button>
      <span className='font-medium text-ink-muted'>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-4 py-2 bg-white border-pop border-ink font-bold text-ink hover:bg-brand-yellow-light'
      >
        Next <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default function ContentHub({
  talks = [],
  eyebrow = null,
  title = 'Event Talks',
  description = 'Explore our schedule of talks, workshops, and networking opportunities.',
  showPagination = false,
  limit = null,
  hubLink = '/content-hub',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const TALKS_PER_PAGE = 9;

  const availableYears = useMemo(
    () => [...new Set(talks.map((t) => t.year).filter(Boolean))].sort((a, b) => b.localeCompare(a)),
    [talks],
  );

  const filteredTalks = useMemo(() => {
    const byYear =
      selectedYear === 'all' ? talks : talks.filter((t) => t.year === selectedYear);
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) return byYear;

    return byYear.filter(
      (talk) =>
        talk.title.toLowerCase().includes(lowercasedQuery) ||
        (talk.abstract &&
          talk.abstract.toLowerCase().includes(lowercasedQuery)) ||
        (talk.speakers &&
          talk.speakers.some((speaker) =>
            speaker.name.toLowerCase().includes(lowercasedQuery),
          )) ||
        (talk.tags &&
          talk.tags.some((tag) => tag.toLowerCase().includes(lowercasedQuery))),
    );
  }, [searchQuery, selectedYear, talks]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleYear = (year) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredTalks.length / TALKS_PER_PAGE);

  const talksToDisplay = useMemo(() => {
    if (limit) {
      return talks.slice(0, limit);
    }
    if (showPagination) {
      return filteredTalks.slice(
        (currentPage - 1) * TALKS_PER_PAGE,
        currentPage * TALKS_PER_PAGE,
      );
    }
    return filteredTalks;
  }, [
    limit,
    talks,
    showPagination,
    filteredTalks,
    currentPage,
    TALKS_PER_PAGE,
  ]);

  const showViewAllButton = limit && talks.length > limit;

  return (
    <section className='relative overflow-hidden bg-white min-h-[60vh] py-16 lg:py-24'>
      <DecorLayer
        items={[
          { pattern: 'cluster-a', position: 'top-right', size: 'lg' },
          { pattern: 'cluster-duo', position: 'bottom-left', size: 'md' },
          { pattern: 'halftone-d', position: 'bottom-left', size: 'lg', className: 'opacity-25' },
        ]}
      />
      <div className='relative z-10 mx-auto max-w-[1200px] px-6'>
        <div className='max-w-3xl mb-12'>
          {eyebrow && <span className='stamp'>{eyebrow}</span>}
          <h1 className={`section-heading ${eyebrow ? 'mt-6' : ''}`}>
            {title}
          </h1>
          <p className='mt-4 text-lg text-ink-muted'>{description}</p>
          {!limit && (
            <div className='relative mt-8 max-w-lg'>
              <input
                type='text'
                placeholder='Search sessions, speakers, tags...'
                value={searchQuery}
                onChange={handleSearch}
                className='w-full pl-12 pr-4 py-3 border-pop border-ink focus:outline-none focus:shadow-pop-sm transition-shadow'
              />
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-ink-muted' />
            </div>
          )}
          {!limit && availableYears.length > 1 && (
            <div className='mt-4 flex flex-wrap gap-2'>
              <button
                onClick={() => handleYear('all')}
                className={`border-pop border-ink px-3 py-1 text-sm font-bold uppercase transition-colors ${selectedYear === 'all' ? 'bg-brand-yellow text-ink' : 'bg-white text-ink-muted hover:bg-brand-yellow-light'}`}
              >
                All editions
              </button>
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYear(year)}
                  className={`border-pop border-ink px-3 py-1 text-sm font-bold uppercase transition-colors ${selectedYear === year ? 'bg-brand-yellow text-ink' : 'bg-white text-ink-muted hover:bg-brand-yellow-light'}`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {talksToDisplay.map((talk) => (
            <TalkCard key={talk.id} talk={talk} />
          ))}
        </div>

        {!limit && filteredTalks.length === 0 && (
          <div className='mt-16'>
            <h3 className='font-display text-2xl uppercase text-ink'>
              No results found
            </h3>
            <p className='text-ink-muted mt-2'>
              Try adjusting your search query.
            </p>
          </div>
        )}

        {showViewAllButton && (
          <div className='mt-12'>
            <Link
              href={hubLink}
              className='btn-pop btn-pop-primary inline-flex items-center gap-2'
            >
              Go to the Content Hub to see all available content
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {!limit && showPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </section>
  );
}
