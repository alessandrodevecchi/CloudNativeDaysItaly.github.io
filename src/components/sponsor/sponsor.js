'use client';
import clsx from 'clsx';
import React from 'react';
import Link from 'next/link';
import styles from './sponsor.css';

const MAJOR_TIERS = ['main', 'platinum', 'gold'];

const Sponsors = ({
  sponsorsByTier,
  tiersConfig,
  sectionsContent,
  order,
  isCurrent = true,
}) => {
  if (!sponsorsByTier || !tiersConfig) return null;

  const displayOrder = order || Object.keys(tiersConfig);
  const hasActiveSponsors = Object.values(sponsorsByTier).some(
    (tier) => tier.length > 0,
  );

  return (
    <div id='sponsors'>
      <section className='border-t-2 border-ink bg-white'>
        <div className='mx-auto max-w-[1200px] px-6 py-16'>
        <div>
          <span className='stamp rotate-2 mb-6'>They make it possible</span>
          <h2 className='section-heading mb-8 mt-6'>
            {sectionsContent.active.title}
          </h2>
          {hasActiveSponsors ? (
            <p className='mb-6 max-w-2xl text-lg text-ink-muted'>
              {sectionsContent.active.description}
            </p>
          ) : (
            <p className='text-lg text-ink-muted'>
              The announcement of sponsors is coming soon! ...
            </p>
          )}
        </div>

        {displayOrder.map((tier) => {
          const config = tiersConfig[tier];
          const tierSponsors = sponsorsByTier[tier] || [];

          if (!config || tierSponsors.length === 0) return null;

          return (
            <div key={tier} className='mb-12'>
              <div className='mb-6 flex items-center justify-center gap-2 sm:justify-start'>
                <h3 className='font-display text-stamp uppercase text-ink'>
                  {config.title}
                </h3>
                <span
                  className={clsx(
                    'border border-ink bg-white px-2 py-0.5 text-xs font-bold text-ink',
                    config.badgeClass,
                  )}
                >
                  {tierSponsors.length}
                </span>
              </div>
              <div
                className={clsx(
                  MAJOR_TIERS.includes(tier)
                    ? 'flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-start'
                    : 'grid grid-cols-2 gap-3 [&>:only-child]:col-span-2 [&>:only-child]:justify-self-center [&>:only-child]:w-[200px] sm:flex sm:flex-wrap sm:gap-4 sm:[&>:only-child]:w-[200px]',
                )}
              >
                {tierSponsors
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((sponsor, index) => (
                    <a
                      key={index}
                      href={sponsor.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={clsx(
                        'flex items-center justify-center border-pop border-ink bg-white transition-all duration-100',
                        'hover:shadow-pop-sm',
                        MAJOR_TIERS.includes(tier)
                          ? 'h-[100px] w-[200px]'
                          : 'h-[80px] w-full sm:h-[100px] sm:w-[200px]',
                        config.class,
                      )}
                    >
                      <div className='relative flex h-full w-full items-center justify-center'>
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          loading='lazy'
                          style={{
                            maxHeight: '100%',
                            maxWidth: '80%',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          );
        })}

        {/* Testimonial sponsor (wireframe: 09-sponsor-testimonial) — si
            attiva da config quando c'è una quote reale. */}
        {isCurrent && sectionsContent.testimonial?.active && (
          <blockquote className='card-pop mt-4 bg-brand-yellow-light p-8'>
            <p className='max-w-3xl text-xl font-bold text-ink'>
              “{sectionsContent.testimonial.quote}”
            </p>
            <footer className='mt-4 text-sm text-ink-muted'>
              {sectionsContent.testimonial.author}
              {sectionsContent.testimonial.role && `, ${sectionsContent.testimonial.role}`}
            </footer>
          </blockquote>
        )}

        {isCurrent && sectionsContent.become && (
          <div
            id='become-a-sponsor'
            className='card-pop mt-16 grid grid-cols-1 gap-8 bg-brand-yellow p-8 shadow-pop-lg lg:grid-cols-[1.1fr_1fr] lg:items-center lg:p-12'
          >
            <div>
              <span className='stamp'>We need you</span>
              <h2 className='section-heading mt-6'>
                {sectionsContent.become.title}
              </h2>
              <p className='mt-4 max-w-2xl text-ink-soft'>
                {sectionsContent.become.description}
              </p>
              <div className='mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
                <Link
                  type='button'
                  className='btn-pop btn-pop-primary'
                  href={`mailto:${sectionsContent.contactEmail}`}
                >
                  Contact Us
                </Link>
                <a
                  href={sectionsContent.transparency.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn-pop btn-pop-secondary'
                >
                  {sectionsContent.transparency.label}
                </a>
              </div>
            </div>

            {/* Cover del prospectus: scaricabile quando è pronto,
                altrimenti anteprima con chip "Soon" (pattern brand kit) */}
            {sectionsContent.prospectus?.cover && (
              <div className='justify-self-center lg:justify-self-end'>
                {sectionsContent.prospectus.active ? (
                  <a
                    href={sectionsContent.prospectus.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='card-pop group block max-w-[420px] overflow-hidden p-2 transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop'
                  >
                    <img src={sectionsContent.prospectus.cover} alt={sectionsContent.prospectus.label} className='block w-full' />
                    <span className='mt-2 flex items-center justify-center gap-2 py-1 text-sm font-bold uppercase tracking-wide text-ink'>
                      {sectionsContent.prospectus.label}
                    </span>
                  </a>
                ) : (
                  <div className='card-pop relative max-w-[420px] overflow-hidden p-2'>
                    <img src={sectionsContent.prospectus.cover} alt='Sponsorship prospectus' className='block w-full opacity-90' />
                    <span className='absolute right-4 top-4 border-pop border-ink bg-white px-2 py-0.5 text-xs font-bold uppercase text-brand-blue'>
                      Soon
                    </span>
                    <span className='mt-2 flex items-center justify-center py-1 text-sm font-bold uppercase tracking-wide text-ink-muted'>
                      Sponsorship prospectus
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        </div>
      </section>

      {/* Invito alla sponsorship: box giallo DENTRO la sezione vetrina
          (stesso pattern di /sponsors). Il giallo è la superficie
          d'invito, i bottoni restano magenta/bianco: rompe l'alternanza
          delle bande senza aggiungere una sezione. */}
    </div>
  );
};

export default Sponsors;
