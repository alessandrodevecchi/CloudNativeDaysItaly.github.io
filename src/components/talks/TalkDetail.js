'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Youtube, FileText, Tag, ChevronLeft, Calendar, PlayCircle } from 'lucide-react';
import { speakerMetaText } from '@/lib/speakerMeta';

const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch {
        return null;
    }
};

export default function TalkDetail({ talk }) {
    const videoEmbedUrl = getYouTubeEmbedUrl(talk.video);
    const videoRef = useRef(null);

    const handleScrollToVideo = () => {
        videoRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    };

    const tagColorMap = {
        'ENG': 'bg-brand-blue text-white',
        'ITA': 'bg-brand-yellow text-ink',
        'SPONSORED': 'bg-brand-magenta text-white',
        'default': 'bg-white text-ink',
    };

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 lg:py-20">
                <div className="mb-8">
                    <Link href={`/${talk.year}`} className="inline-flex items-center gap-2 text-brand-blue font-bold hover:text-brand-magenta">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Edition {talk.year}
                    </Link>
                </div>

                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    <main className="lg:col-span-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                {talk.tags?.map(tag => (
                                    <span key={tag}
                                          className={`text-xs font-bold px-2.5 py-1 border border-ink uppercase ${tagColorMap[tag] || tagColorMap.default}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="section-heading">{talk.title}</h1>
                        </div>

                        {videoEmbedUrl && (
                            <button
                                onClick={handleScrollToVideo}
                                className="btn-pop btn-pop-secondary mt-6 inline-flex items-center gap-2 !px-4 !py-2 text-sm"
                            >
                                <PlayCircle className="h-5 w-5" />
                                Watch Video
                            </button>
                        )}

                        <article className="prose prose-lg max-w-none mt-8 text-ink-muted whitespace-pre-line">
                            {talk.abstract}
                        </article>

                        {videoEmbedUrl && (
                            <div ref={videoRef} className="mt-8 scroll-mt-24">
                                <div className="aspect-video w-full">
                                    <iframe
                                        className="w-full h-full border-pop border-ink"
                                        src={videoEmbedUrl}
                                        title={`YouTube video player for ${talk.title}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </main>

                    <aside className="lg:sticky lg:top-24 self-start mt-12 lg:mt-0">
                        <div className="card-pop p-6 space-y-6">
                            <div>
                                <h3 className="font-display text-sm text-ink uppercase tracking-wider">Speakers</h3>
                                <div className="space-y-4 mt-4">
                                    {talk.speakers.map(speaker => (
                                        <Link key={speaker.id} href={`/profile/${speaker.id}`} className="flex items-center gap-4 group">
                                            <img src={speaker.image} alt={speaker.name} className="w-14 h-14 rounded-full object-cover border border-ink"/>
                                            <div>
                                                <p className="font-bold text-ink group-hover:text-brand-blue transition-colors">{speaker.name}</p>
                                                <p className="text-sm text-ink-muted">{speakerMetaText(speaker, { max: 2 })}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {(talk.slide || talk.video) && (
                                <div className="pt-6 border-t-2 border-ink">
                                    <h3 className="font-display text-sm text-ink uppercase tracking-wider">Resources</h3>
                                    <div className="space-y-3 mt-4">
                                        {talk.video && (
                                            <a href={talk.video} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-ink hover:text-brand-magenta transition-colors font-semibold">
                                                <Youtube className="h-5 w-5"/> Watch on YouTube
                                            </a>
                                        )}
                                        {talk.slide && (
                                            <a href={talk.slide} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-ink hover:text-brand-blue transition-colors font-semibold">
                                                <FileText className="h-5 w-5"/> Download Slides
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t-2 border-ink">
                                <h3 className="font-display text-sm text-ink uppercase tracking-wider">Details</h3>
                                <div className="space-y-3 mt-4 text-ink font-medium">
                                    <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-brand-magenta"/> Edition {talk.year}</div>
                                    <div className="flex items-center gap-3"><Tag className="h-5 w-5 text-brand-magenta"/> Level: {talk.level || 'All'}</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
