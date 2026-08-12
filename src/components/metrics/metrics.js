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

        // Il nodo osservato si cattura ora: alla cleanup `ref.current` può
        // essere già cambiato (o null) e resterebbe un observer appeso.
        const node = ref.current;
        if (node) {
            observer.observe(node);
        }

        return () => {
            observer.disconnect();
        };
    }, [value, duration]);

    return (
        <div ref={ref} className="flex flex-col items-center p-4 md:p-8 text-center">
            <p className={`font-display text-5xl md:text-6xl tabular-nums ${accent}`}>
                {count}
                {String(value).endsWith('+') && '+'}
            </p>
            <p className="text-sm uppercase tracking-widest text-white/80 mt-2 font-semibold">{label}</p>
        </div>
    );
};

/*
 * Banda nera con statistiche (wireframe: 02-numbers-strip).
 * Due modalità:
 * - items: [{ value, label, accent }] — lista libera (homepage)
 * - data/teamCount/speakersCount/sponsorsCount — layout storico (past editions)
 */
const Metrics = ({ data, teamCount, speakersCount, sponsorsCount, items }) => {
    const entries = items || [
        { value: data.attendees, label: 'Attendees', accent: 'text-brand-yellow' },
        { value: speakersCount, label: 'Speakers', accent: 'text-brand-magenta' },
        { value: sponsorsCount, label: 'Sponsors', accent: 'text-brand-blue' },
        { value: teamCount, label: 'Organizers', accent: 'text-brand-yellow' },
    ];

    return (
        <div className="py-12 bg-ink">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className={`grid grid-cols-2 gap-4 md:gap-8 [&>:last-child:nth-child(odd)]:col-span-2 lg:[&>:last-child:nth-child(odd)]:col-span-1 ${{3:'lg:grid-cols-3',4:'lg:grid-cols-4',5:'lg:grid-cols-5'}[entries.length] || 'lg:grid-cols-4'}`}>
                    {entries.map((e, i) => (
                        <MetricItem key={i} accent={e.accent} value={e.value} label={e.label} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Metrics;
