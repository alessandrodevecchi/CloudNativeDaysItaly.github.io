'use client';
import clsx from 'clsx';
import React from 'react';
import Link from 'next/link';
import styles from './sponsor.css';

const CARD_STYLES = 'w-[200px] h-[100px]';

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
      {isCurrent && sectionsContent.become && (
        <section className='mx-auto max-w-[1200px] px-6 py-8'>
          <div className='text-center mb-8'>
            <h2 className='section-heading mb-4'>
              {sectionsContent.become.title}
            </h2>
            <p className='mb-6 text-lg text-ink-muted'>
              {sectionsContent.become.description}
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Link
                type='button'
                className='btn-pop btn-pop-primary'
                href={`mailto:${sectionsContent.contactEmail}`}
              >
                Contact Us
              </Link>

              {sectionsContent.become.active &&
                sectionsContent.prospectus?.active !== false && (
                  <a
                    href={sectionsContent.prospectus.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='btn-pop btn-pop-secondary'
                  >
                    {sectionsContent.prospectus.label}
                  </a>
                )}
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
        </section>
      )}

      <section className='mx-auto max-w-[1200px] px-6 py-8'>
        <div className='text-center'>
          <h2 className='section-heading mb-8 text-center'>
            {sectionsContent.active.title}
          </h2>
          {hasActiveSponsors ? (
            <p className='mb-6 text-lg text-ink-muted'>
              {sectionsContent.active.description}
            </p>
          ) : (
            <div className='text-center'>
              <p className='text-lg text-ink-muted'>
                The announcement of sponsors is coming soon! ...
              </p>
            </div>
          )}
        </div>

        {displayOrder.map((tier) => {
          const config = tiersConfig[tier];
          const tierSponsors = sponsorsByTier[tier] || [];

          if (!config || tierSponsors.length === 0) return null;

          return (
            <div key={tier} className='mb-12'>
              <div className='mb-6 flex items-center justify-center gap-2'>
                <h3 className='font-display text-stamp uppercase text-ink'>
                  {config.title}
                </h3>
                <span
                  className={clsx(
                    'border border-ink bg-brand-yellow px-2 py-0.5 text-xs font-bold text-ink',
                    config.badgeClass,
                  )}
                >
                  {tierSponsors.length}
                </span>
              </div>
              <div className='flex flex-wrap justify-center gap-4'>
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
                        CARD_STYLES,
                        config.class,
                        !isCurrent && 'pastSponsor',
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
      </section>
    </div>
  );
};

export default Sponsors;
