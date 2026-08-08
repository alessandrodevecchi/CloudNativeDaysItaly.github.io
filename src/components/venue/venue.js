'use client';

import { MapPin } from 'lucide-react';
import Image from 'next/image';
import OpenStreetMapEmbed from '@/components/maps/OpenStreetMapEmbed';

const Venue = ({ data }) => {
    if (!data) return null;

    return (
        <section className="relative bg-ink text-white py-16 lg:py-24">
            <div className="mx-auto max-w-[1200px] px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div>
                        <span className="eyebrow text-brand-yellow">
                            Location
                        </span>
                        <h2 className="mt-4 font-display text-section uppercase text-brand-yellow">
                            {data.name}
                        </h2>
                        <div className="mt-6 flex items-start gap-4">
                            <MapPin className="h-8 w-8 text-brand-magenta mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-xl text-white/90 font-semibold">{data.street}</p>
                                <p className="text-lg text-white/70">{data.city}</p>
                            </div>
                        </div>

                        <OpenStreetMapEmbed
                            mapLink={data.mapLink}
                            mapDirectionsUrl={data.mapDirectionsUrl}
                            rootClassName="mt-8"
                        />
                    </div>

                    <div className="relative h-[500px] hidden lg:block transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop-white">
                        <Image
                            src={data.image}
                            alt={data.name}
                            fill
                            className="object-cover border-pop border-white transition-all duration-100"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Venue;
