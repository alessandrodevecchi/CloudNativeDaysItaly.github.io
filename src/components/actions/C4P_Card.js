'use client';
import { useState, useEffect } from 'react';
import { Info, Calendar, Flag, CheckCircle, ArrowRight } from 'lucide-react';
import {
  format,
  differenceInDays,
  parseISO,
  isBefore,
  isAfter,
} from 'date-fns';
import Link from 'next/link';

export default function C4P_Card({ data }) {
  const [status, setStatus] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    if (!data) return;
    const now = new Date();
    const startDate = parseISO(data.startDate);
    const endDate = parseISO(data.endDate);

    let currentStatus = 'closed';
    if (isBefore(now, startDate)) currentStatus = 'comingsoon';
    if (isAfter(now, startDate) && isBefore(now, endDate))
      currentStatus = 'open';
    // Senza un link di submission la call non può essere aperta,
    // qualunque sia la finestra di date in config.
    if (!data.url) currentStatus = 'comingsoon';

    setStatus(currentStatus);
    setDaysLeft(differenceInDays(endDate, now));
  }, [data]);

  if (!data || !status) {
    return (
      <div className='card-pop h-full p-8 flex flex-col relative overflow-hidden transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 w-1/3'></div>
          <div className='h-6 bg-gray-200 w-full'></div>
          <div className='h-12 bg-gray-200 mt-auto'></div>
        </div>
      </div>
    );
  }

  const endDate = parseISO(data.endDate);

  const renderContent = () => {
    switch (status) {
      case 'open':
        return (
          <>
            <h3 className='text-2xl font-bold text-ink'>
              Share Your Expertise
            </h3>
            <p className='text-ink-muted mt-2'>
              We are looking for passionate speakers to share their knowledge
              with the community.
            </p>
            <div className='mt-6 space-y-3 text-sm'>
              <div className='flex items-center gap-3'>
                <Calendar className='h-5 w-5 text-brand-blue' />
                <p>
                  Submissions close on{' '}
                  <span className='font-bold'>
                    {format(endDate, 'MMMM do, yyyy')}
                  </span>
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <Flag className='h-5 w-5 text-brand-blue' />
                <p>
                  <span className='font-bold text-brand-magenta'>
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Last day!'}
                  </span>{' '}
                  to submit your proposal.
                </p>
              </div>
            </div>
            <div className='mt-6 p-4 bg-brand-yellow-light border-l-4 border-ink text-ink text-sm'>
              <div className='flex items-start gap-3'>
                <Info className='h-5 w-5 mt-0.5 flex-shrink-0' />
                <p>{data.rollingSelectionText}</p>
              </div>
            </div>
            <div className='mt-auto pt-6'>
              <Link
                href={data.url}
                target='_blank'
                className='btn-pop btn-pop-primary group w-full inline-flex items-center justify-center'
              >
                Submit Your Talk{' '}
                <ArrowRight className='h-5 w-5 ml-2 transition-transform group-hover:translate-x-1' />
              </Link>
            </div>
          </>
        );
      case 'closed':
        return (
          <>
            <h3 className='text-2xl font-bold text-ink'>
              Submissions Closed
            </h3>
            <p className='text-ink-muted mt-2'>
              Thank you to everyone who submitted. We are reviewing all
              proposals and will announce the final agenda soon.
            </p>
            <div className='mt-6 space-y-3 text-sm'>
              <div className='flex items-center gap-3'>
                <CheckCircle className='h-5 w-5 text-ink-muted' />
                <p>
                  Submissions closed on{' '}
                  <span className='font-bold'>
                    {format(endDate, 'MMMM do, yyyy')}
                  </span>
                </p>
              </div>
            </div>
            <div className='mt-auto pt-6'>
              <Link
                href={data.agendaUrl}
                className='btn-pop btn-pop-primary group w-full inline-flex items-center justify-center'
              >
                View Agenda
              </Link>
            </div>
          </>
        );
      case 'comingsoon':
      default:
        return (
          <>
            <h3 className='text-2xl font-bold text-ink'>
              Call for Papers Opens Soon
            </h3>
            <p className='text-ink-muted mt-2'>
              {data.url ? (
                <>
                  Get ready to share your ideas! Our Call for Papers will be
                  opening on{' '}
                  <span className='font-bold'>
                    {format(parseISO(data.startDate), 'MMMM do')}
                  </span>
                  .
                </>
              ) : (
                'Get ready to share your ideas! The Call for Papers is not open yet: follow our channels to know when it starts.'
              )}
            </p>
            <div className='mt-6 p-4 bg-brand-yellow-light border-l-4 border-ink text-ink text-sm'>
              <div className='flex items-start gap-3'>
                <Info className='h-5 w-5 mt-0.5 flex-shrink-0' />
                <p>{data.rollingSelectionText}</p>
              </div>
            </div>
            <div className='mt-auto pt-6'>
              <div
                aria-disabled='true'
                className='w-full text-center border-pop border-ink bg-gray-200 text-ink-muted font-bold uppercase px-6 py-3 cursor-not-allowed'
              >
                Coming soon
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className='card-pop h-full p-8 flex flex-col relative overflow-hidden transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop'>
      <div className='absolute top-0 right-0 font-display text-xs uppercase px-4 py-1.5 border-b-2 border-l-2 border-ink bg-brand-yellow text-ink'>
        C4P
      </div>
      {renderContent()}
    </div>
  );
}
