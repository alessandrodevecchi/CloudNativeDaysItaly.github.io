'use client';
import { useState, useEffect } from 'react';
import { Ticket, ArrowRight, Calendar } from 'lucide-react';
import { format, isBefore, isAfter, parseISO } from 'date-fns';
import Link from 'next/link';
import clsx from 'clsx';

const TicketItem = ({ ticket }) => {
  const [isLive, setIsLive] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const now = new Date();
    const startDate = parseISO(ticket.salesStartDate);
    const endDate = parseISO(ticket.salesEndDate);
    setIsLive(isAfter(now, startDate) && isBefore(now, endDate));
    setIsExpired(isAfter(now, endDate));
  }, [ticket]);

  if (!ticket) return null;

  const startDate = parseISO(ticket.salesStartDate);
  const endDate = parseISO(ticket.salesEndDate);

  const getStatusBadge = () => {
    if (isLive)
      return (
        <span className='text-xs font-bold px-2 py-0.5 border border-ink bg-brand-yellow text-ink uppercase'>
          On Sale
        </span>
      );
    if (isExpired)
      return (
        <span className='text-xs font-bold px-2 py-0.5 border border-ink bg-gray-200 text-ink-muted uppercase'>
          Not Available
        </span>
      );
    return (
      <span className='text-xs font-bold px-2 py-0.5 border border-ink bg-white text-brand-blue uppercase'>
        Upcoming
      </span>
    );
  };

  return (
    <div
      className={clsx('p-4 border-pop transition-all', {
        'border-brand-magenta bg-white shadow-pop-sm': isLive,
        'border-ink': !isLive,
        'opacity-60': isExpired,
      })}
    >
      <div className='flex justify-between items-start'>
        <p className='font-bold text-ink pr-2'>{ticket.name}</p>
        {getStatusBadge()}
      </div>
      <p className='text-sm text-ink-muted mt-1'>{ticket.description}</p>
      <div className='flex justify-between items-end mt-3'>
        <div className='flex items-center gap-2 text-xs text-ink-muted'>
          <Calendar className='h-4 w-4 flex-shrink-0' />
          <span>
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d')}
          </span>
        </div>
        <p
          className={clsx(
            'font-display text-lg',
            isExpired ? 'text-gray-400 line-through' : 'text-brand-magenta'
          )}
        >
          {ticket.price}
        </p>
      </div>
    </div>
  );
};

export default function TicketsCard({ data }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!data) return null;

  const now = new Date();
  const firstSaleDate =
    data.type.length > 0 ? parseISO(data.type[0].salesStartDate) : null;
  const isComingSoon = firstSaleDate && isBefore(now, firstSaleDate);

  const renderContent = () => {
    if (!isClient) {
      return (
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 w-1/3'></div>
          <div className='h-6 bg-gray-200 w-full'></div>
          <div className='h-12 bg-gray-200 mt-auto'></div>
        </div>
      );
    }

    if (isComingSoon) {
      return (
        <>
          <h3 className='text-2xl font-bold text-ink'>
            Tickets Coming Soon!
          </h3>
          <p className='text-ink-muted mt-2'>{data.comingSoonText}</p>
          <div className='mt-auto pt-6'>
            <div className='mt-auto pt-6'>
              <Link
                href={data.link}
                target='_blank'
                className='btn-pop btn-pop-primary group w-full inline-flex items-center justify-center'
              >
                Join our Telegram{' '}
                <ArrowRight className='h-5 w-5 ml-2 transition-transform group-hover:translate-x-1' />
              </Link>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <h3 className='text-2xl font-bold text-ink'>Secure Your Spot</h3>
        <p className='text-ink-muted mt-2'>
          Choose your ticket below. Early tiers have limited availability.
        </p>
        <div className='mt-6 space-y-3'>
          {data.type
            .sort(
              (a, b) => new Date(a.salesStartDate) - new Date(b.salesStartDate)
            )
            .map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
        </div>
        <div className='mt-auto pt-6'>
          <Link
            href={data.link}
            target='_blank'
            className='btn-pop btn-pop-primary group w-full inline-flex items-center justify-center'
          >
            Buy Tickets Now{' '}
            <ArrowRight className='h-5 w-5 ml-2 transition-transform group-hover:translate-x-1' />
          </Link>
        </div>
      </>
    );
  };

  return (
    <div className='card-pop h-full p-8 flex flex-col relative overflow-hidden transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop'>
      <div className='absolute top-0 right-0 font-display text-xs uppercase px-4 py-1.5 border-b-2 border-l-2 border-ink bg-brand-yellow text-ink'>
        TICKETS
      </div>
      {renderContent()}
    </div>
  );
}
