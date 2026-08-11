'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const getYouTubeEmbedUrl = (videoId) => {
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

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
            <div className='card-pop p-2 shadow-pop-lg transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_#111111]'>
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

      </div>
    </section>
  );
};

export default Info;
