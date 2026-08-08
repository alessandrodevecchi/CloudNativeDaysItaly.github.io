'use client';

import Link from "next/link";
import { ArrowRight, Award, Linkedin, Github, Globe } from "lucide-react";
import config from '@/config/website.json';
import DecorLayer from '@/components/decor/DecorLayer';

const PersonCard = ({ person }) => (
    <div className="group relative border-pop border-ink bg-white transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop">
        <div className="relative aspect-square overflow-hidden">
            <img
                src={person.image || "/images/placeholder.png"}
                alt={person.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

            {person.level && (
                <div className={`absolute top-4 left-4 border border-ink px-3 py-1 text-xs font-bold uppercase ${
                    person.level === "core"
                        ? "bg-brand-magenta text-white" 
                        : "bg-brand-yellow text-ink"
                }`}>
                    {person.level === "core" ? "Core Organizer" : "Organizer"}
                </div>
            )}

        </div>
        <div className="absolute bottom-0 left-0 p-5">
            <h3 className="text-xl font-bold text-white">{person.name}</h3>
            <p className="text-brand-yellow font-semibold text-sm">{person.role}</p>
        </div>
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {person.linkedin && <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/40"><Linkedin size={18} /></a>}
            {person.github && <a href={person.github} target="_blank" rel="noopener noreferrer" className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/40"><Github size={18} /></a>}
            {person.website && <a href={person.website} target="_blank" rel="noopener noreferrer" className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/40"><Globe size={18} /></a>}
        </div>
        <Link href={`/profile/${person.id || person.slug}`} className="absolute inset-0" aria-label={`View profile for ${person.name}`}></Link>
    </div>
);

export default function TeamList({team}) {
    return (
        <div className="bg-white">
            <div className="relative bg-ink">
                <div className="mx-auto max-w-[1200px] px-6 py-16 lg:py-20 relative z-10">
                    <span className="stamp">The Team</span>
                    <h1 className="mt-6 font-display text-section uppercase text-white">
                        The Driving Force
                    </h1>
                    <p className="mt-6 text-lg lg:text-xl text-white/80 max-w-3xl">
                        Cloud Native Days Italy is organized by a passionate group of volunteers from the Italian tech community, dedicated to creating an inclusive and valuable experience for everyone.
                    </p>
                </div>
            </div>

            <div className="py-16 lg:py-24">
                <div className="mx-auto max-w-[1200px] px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map((member) => (
                            <PersonCard key={member.id || member.slug} person={member} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-cream border-t-2 border-ink">
                <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
                    <h2 className="section-heading">Want to join the team?</h2>
                    <p className="mt-4 max-w-2xl text-lg text-ink-muted">
                        We are always looking for passionate people to help us shape the future of this event. If you want to contribute to the community, this is a great opportunity.
                    </p>
                    <div className="mt-8">
                        <a href={`mailto:${config.general.contact.email}`} className="btn-pop btn-pop-primary group inline-flex items-center justify-center">
                            Get in Touch <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
