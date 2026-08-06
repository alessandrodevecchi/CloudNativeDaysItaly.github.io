'use client';
import { useEffect, useRef, useState } from 'react';

const MetricItem = ({ accent, value, label, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    let start = 0;
                    const end = parseInt(value.toString().replace(/,/g, ''));
                    if (start === end) return;

                    const totalMilSecDur = duration;
                    const incrementTime = (totalMilSecDur / end) * 0.1;

                    const timer = setInterval(() => {
                        start += 1;
                        setCount(start);
                        if (start === end) clearInterval(timer);
                    }, incrementTime);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, value, duration]);

    return (
        <div ref={ref} className="flex flex-col items-center p-8 text-center">
            <p className={`font-display text-6xl tabular-nums ${accent}`}>{count}</p>
            <p className="text-sm uppercase tracking-widest text-white/80 mt-2 font-semibold">{label}</p>
        </div>
    );
};

const Metrics = ({ data, teamCount, speakersCount, sponsorsCount }) => (
    <div className="py-12 bg-ink">
        <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricItem accent="text-brand-yellow" value={data.attendees} label="Attendees" />
                <MetricItem accent="text-brand-magenta" value={speakersCount} label="Speakers" />
                <MetricItem accent="text-brand-blue" value={sponsorsCount} label="Sponsors" />
                <MetricItem accent="text-brand-yellow" value={teamCount} label="Organizers" />
            </div>
        </div>
    </div>
);

export default Metrics;
