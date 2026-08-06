'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const getYouTubeEmbedUrl = (videoId) => {
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

// Dot colorati in rotazione brand — vedi docs/design-system.md
const DOT_COLORS = ['bg-brand-magenta', 'bg-brand-blue', 'bg-brand-yellow', 'bg-brand-magenta'];

const FeatureCard = ({ dotColor, title, children }) => (
  <div className='card-pop flex items-start gap-4 p-6'>
    <span aria-hidden='true' className={`mt-1 h-5 w-5 flex-shrink-0 rounded-full ${dotColor}`} />
    <div>
      <h3 className='text-lg font-bold text-ink'>{title}</h3>
      <p className='mt-1 text-sm text-ink-muted'>{children}</p>
    </div>
  </div>
);

const DayCard = ({ data }) => (
  <div className='card-pop bg-brand-blue p-6 text-white lg:px-10 lg:py-6'>
    <span className='font-display text-stamp uppercase tracking-wider text-brand-yellow'>
      {data.label}
    </span>
    <ul className='mt-3 space-y-2'>
      {data.bullets.map((b, i) => (
        <li key={i} className='flex items-center gap-2 text-lg text-white'>
          <span className='h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-yellow' />
          {b.bold ? <strong>{b.text}</strong> : b.text}
        </li>
      ))}
    </ul>
  </div>
);

const Info = ({ data }) => {
  if (!data) return null;

  const videoEmbedUrl = getYouTubeEmbedUrl(data.video?.id);

  return (
    <section className='relative overflow-hidden border-t-2 border-ink bg-white py-16 lg:py-24'>
      <div className='relative mx-auto max-w-[1200px] px-6'>
        <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24'>
          <div>
            <span className='stamp rotate-2'>The Event</span>
            <h2 className='section-heading mt-6'>
              {data.title}
            </h2>
            <p className='mt-8 text-xl text-ink-soft'>{data.description}</p>
            <p className='mt-5 text-ink-muted'>{data.longDescription}</p>
            {data.CTA?.active && (
              <div className='mt-6'>
                <Link
                  href={data.CTA.url}
                  className='inline-flex items-center gap-2 text-lg font-bold text-brand-blue transition-colors hover:text-brand-magenta'
                >
                  {data.CTA.label} <ArrowRight className='h-5 w-5' />
                </Link>
              </div>
            )}
          </div>

          {videoEmbedUrl && (
            <div className='card-pop p-2 shadow-pop-lg'>
              <div className='aspect-video w-full'>
                <iframe
                  className='h-full w-full'
                  src={videoEmbedUrl}
                  title={data.video.title}
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {data.extra && (
          <div className='mt-20 lg:mt-28'>
            <h2 className='section-heading'>
              {data.extra.title}
            </h2>
            <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-2'>
              {['talks', 'networking', 'workshop', 'community'].map((key, i) => (
                <FeatureCard
                  key={key}
                  dotColor={DOT_COLORS[i]}
                  title={data.extra.boxes[key].title}
                >
                  {data.extra.boxes[key].description}
                </FeatureCard>
              ))}
            </div>
          </div>
        )}

        {data.glance && (
          <div className='mt-20 lg:mt-28'>
            <div className='mb-8'>
              <h3 className='section-heading'>
                {data.glance.label}
              </h3>
              <span className='mt-2 inline-block text-sm font-bold uppercase tracking-wider text-brand-blue'>
                2 days, 2 areas
              </span>
            </div>

            {/* Griglia cards + video — stessa altezza */}
            <div className='mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-stretch'>

              {/* Colonna sinistra — 2 days */}
              <div className='grid grid-cols-2 gap-4 lg:grid-cols-1'>
                <DayCard data={data.glance.days.day1} />
                <DayCard data={data.glance.days.day2} />
              </div>

              {/* Colonna destra — video */}
              <div className='card-pop relative aspect-square w-full overflow-hidden lg:aspect-auto'>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className='h-full w-full object-cover'
                >
                  <source src={data.glance.areas.image} type='video/webm' />
                </video>
              </div>

            </div>

            {/* CTA sotto la griglia */}
            <div className='mt-6'>
              <Link
                href={data.glance.agendaCTA.url}
                className='inline-flex items-center gap-2 text-lg font-bold text-brand-blue transition-colors hover:text-brand-magenta'
              >
                {data.glance.agendaCTA.label} <ArrowRight className='h-5 w-5' />
              </Link>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default Info;
