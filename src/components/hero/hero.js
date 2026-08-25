'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import DecorLayer from '@/components/decor/DecorLayer';
import { HERO_VARIANTS } from '@/components/decor/heroVariants';

const CountdownUnit = ({ value, label }) => (
    <div className="card-pop flex min-w-[80px] flex-col items-center px-4 py-2">
        <p className="font-display text-stat text-brand-magenta tabular-nums">
            {value.toString().padStart(2, '0')}
        </p>
        <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink">
            {label}
        </span>
    </div>
);

const Hero = ({ data }) => {
    // Gli hook stanno prima di qualsiasi uscita anticipata: `data` mancante
    // si gestisce dopo, altrimenti l'ordine degli hook cambia tra i render.
    const targetDate = data?.countDown ? new Date(`${data.countDown}+02:00`).getTime() : null;

    const [timeLeft, setTimeLeft] = useState(null);

    // Il calcolo vive dentro l'effect: dipende solo da targetDate, che è già
    // nelle dipendenze, e così non serve una funzione ricreata a ogni render.
    useEffect(() => {
        if (!targetDate) return;
        const calculateTimeLeft = () => {
            const difference = targetDate - new Date().getTime();
            if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        };
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => { setTimeLeft(calculateTimeLeft()); }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const isCountdownActive = targetDate && timeLeft && (timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0);

    if (!data) {
        return null;
    }

    return (
        <section className="relative overflow-hidden bg-white">
            {/* Tutte le varianti sono nel markup; lo script inline in layout.js
                sceglie quale mostrare via html[data-decor] prima del paint. */}
            {HERO_VARIANTS.map((items, i) => (
                <div key={i} className={`decor-variant decor-variant-${i}`}>
                    <DecorLayer items={items} />
                </div>
            ))}
            <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 text-center lg:py-20">
                <span className="stamp">Save the date</span>

                <h1 className="mx-auto mt-6 max-w-[13ch] font-display text-display uppercase text-brand-blue">
                    {data.title}
                </h1>

                <h2 className="mt-4 font-display text-section uppercase text-ink">
                    <span aria-hidden="true" className="mr-3 inline-block h-3 w-3 rounded-full bg-brand-magenta align-middle" />
                    {data.badgeDate}
                </h2>

                <p className="mt-3 text-lg font-bold text-ink sm:text-xl">
                    <span aria-hidden="true" className="mr-2 inline-block h-3 w-3 rounded-full bg-brand-magenta align-middle" />
                    {data.city}
                </p>

                <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft sm:text-lg">
                    {data.description}
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href={data.CTA.tickets.url}
                        target={data.CTA.tickets.url.startsWith('http') ? '_blank' : undefined}
                        rel={data.CTA.tickets.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="btn-pop btn-pop-primary w-full sm:w-auto"
                    >
                        {data.CTA.tickets.label}
                    </Link>
                    {data.CTA.sponsor?.active !== false && (
                        <Link href={data.CTA.sponsor.url} className="btn-pop btn-pop-secondary w-full sm:w-auto">
                            {data.CTA.sponsor.label}
                        </Link>
                    )}
                </div>

                {isCountdownActive && timeLeft && (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <CountdownUnit value={timeLeft.days} label="Days" />
                        <CountdownUnit value={timeLeft.hours} label="Hrs" />
                        <CountdownUnit value={timeLeft.minutes} label="Min" />
                        <CountdownUnit value={timeLeft.seconds} label="Sec" />
                    </div>
                )}

                {data.image && (
                    <div className="mx-auto mt-12 max-w-3xl">
                        <Image
                            src={data.image}
                            alt="Cloud Native Days Italy Team"
                            width={900}
                            height={600}
                            priority
                            className="card-pop w-full shadow-pop-lg transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_#111111]"
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;
