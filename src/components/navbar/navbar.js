'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { ArrowRight, ArrowLeft, ChevronDown, ChevronRight, X, Menu as MenuIcon } from 'lucide-react';
import BrandRings from '@/components/decor/BrandRings';
import './navbar.css';

// Pannelli dropdown = superfici colorate (design-system: "colore in blocchi
// grandi"); su blu/magenta testo bianco, su giallo testo ink.
const PANEL_COLORS = {
    blue: { bg: 'bg-brand-blue', text: 'text-white', ring: 'duo' },
    magenta: { bg: 'bg-brand-magenta', text: 'text-white', ring: 'duo' },
    yellow: { bg: 'bg-brand-yellow', text: 'text-ink', ring: 'duo' },
};

export default function Navbar({ data, editions = [] }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openPanel, setOpenPanel] = useState(null); // desktop: testo del gruppo aperto
    const [mobilePanel, setMobilePanel] = useState(null); // mobile drill-down: gruppo attivo
    const navRef = useRef(null);

    const currentEdition = data.general.edition.toString();
    const pastEditions = editions.filter(e => e !== currentEdition).sort((a, b) => b.localeCompare(a));
    const navEntries = data.navbar.links.header;

    // Max 2 CTA visibili: la prima attiva in ordine di config è la primaria.
    const activeCtas = (data.navbar.ctas || []).filter(cta => cta.active).slice(0, 2);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setOpenPanel(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isMobileMenuOpen]);

    const closeAllMenus = () => {
        setMobileMenuOpen(false);
        setOpenPanel(null);
        setMobilePanel(null);
    };

    const groupItems = (entry) => {
        const items = (entry.items || []).map(item => ({ ...item }));
        return items;
    };

    const CtaButton = ({ cta, primary, className }) => (
        <Link
            href={cta.url}
            target={cta.url.startsWith('http') ? '_blank' : undefined}
            rel={cta.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            onClick={closeAllMenus}
            className={clsx(
                'btn-pop group inline-flex items-center justify-center text-sm',
                primary ? 'bg-brand-yellow text-ink' : 'bg-white text-ink',
                className,
            )}
        >
            {cta.label}
            {primary && <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />}
        </Link>
    );

    return (
        <>
            <header
                className={clsx(
                    'fixed top-0 left-0 w-full z-40 transition-all duration-300',
                    isScrolled ? 'h-16 bg-white border-b-2 border-ink' : 'h-20 bg-white border-b-2 border-ink'
                )}
            >
                <div className="mx-auto max-w-[1200px] px-6 h-full">
                    <div className="flex items-center justify-between h-full">
                        <Link href="/" onClick={closeAllMenus}>
                            <Image src={data.navbar.logo} alt="logo" width={150} height={97} style={{ height: 'auto' }} priority />
                        </Link>

                        {/* Item raggruppati a destra come da wireframe Figma (00-nav) */}
                        <nav ref={navRef} className="navbar-desktop-links hidden lg:flex items-center gap-6 ml-auto mr-6">
                            {navEntries.map((entry) => {
                                if (!entry.items) {
                                    return (
                                        <Link
                                            key={entry.to}
                                            href={entry.to}
                                            target={entry.target ? entry.target : "_self"}
                                            className={clsx(
                                                "text-sm font-bold text-ink hover:text-brand-blue transition-colors",
                                                // highlight 'marker': evidenziatore giallo, per le voci
                                                // che ospitano anche un invito all'azione (Sponsors)
                                                entry.highlight === 'marker' && "nav-marker",
                                            )}
                                        >
                                            {entry.text}
                                        </Link>
                                    );
                                }
                                const colors = PANEL_COLORS[entry.color] || PANEL_COLORS.blue;
                                const isOpen = openPanel === entry.text;
                                return (
                                    <div key={entry.text} className="relative">
                                        <button
                                            onClick={() => setOpenPanel(isOpen ? null : entry.text)}
                                            className="flex items-center gap-1 text-sm font-bold text-ink hover:text-brand-blue transition-colors"
                                            aria-expanded={isOpen}
                                        >
                                            {entry.text}
                                            <ChevronDown className={clsx("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                        </button>
                                        <div
                                            className={clsx(
                                                "absolute top-full right-0 mt-3 w-56 rounded-none shadow-pop border-pop border-ink pt-2 pb-14 transition-all duration-200 ease-out origin-top overflow-hidden",
                                                colors.bg,
                                                isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                                            )}
                                        >
                                            {groupItems(entry).map(item => (
                                                <Link key={item.to} href={item.to} onClick={closeAllMenus} className={clsx("relative z-10 block px-4 py-2 text-sm font-bold hover:bg-ink hover:text-white", colors.text)}>
                                                    {item.text}
                                                </Link>
                                            ))}
                                            {entry.pastEditions && pastEditions.length > 0 && (
                                                <div className="mt-2 pt-2 border-t-2 border-ink">
                                                    <p className={clsx("px-4 py-1 font-display text-xs uppercase tracking-widest", colors.text)}>Past Editions</p>
                                                    {pastEditions.map(year => (
                                                        <Link key={year} href={`/${year}`} onClick={closeAllMenus} className={clsx("relative z-10 block px-4 py-2 text-sm font-bold hover:bg-ink hover:text-white", colors.text)}>
                                                            Edition {year}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                            {/* Sticker decorativo in fondo al pannello (reference Gumroad) */}
                                            <BrandRings cluster={colors.ring} className="pointer-events-none absolute -bottom-6 -right-6 w-24 h-24 opacity-80" aria-hidden />
                                        </div>
                                    </div>
                                );
                            })}
                        </nav>

                        <div className="hidden lg:flex items-center gap-3">
                            {activeCtas.map((cta, i) => (
                                <CtaButton key={cta.id} cta={cta} primary={i === 0} className="!px-4 !py-1.5" />
                            ))}
                        </div>

                        <div className="lg:hidden">
                            <button onClick={() => setMobileMenuOpen(true)} className="text-ink" aria-label="Open menu">
                                <MenuIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div
                className={clsx(
                    "fixed inset-0 z-50 transition-all duration-300 lg:hidden",
                    isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                )}
            >
                <div
                    onClick={closeAllMenus}
                    className="absolute inset-0 bg-black/50"
                />
                {(() => {
                    const activeEntry = navEntries.find(e => e.items && e.text === mobilePanel);
                    const colors = activeEntry ? (PANEL_COLORS[activeEntry.color] || PANEL_COLORS.blue) : null;
                    return (
                        <nav
                            className={clsx(
                                "absolute top-0 right-0 h-full w-4/5 max-w-sm border-l-2 border-ink p-6 flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
                                activeEntry ? colors.bg : 'bg-white',
                                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                            )}
                        >
                            {/* Sticker decorativo del panel drill-down, come sui panel desktop */}
                            {activeEntry && (
                                <BrandRings cluster={colors.ring} className="pointer-events-none absolute bottom-28 -right-10 w-44 h-44 opacity-80" aria-hidden />
                            )}
                            <div className={clsx("flex items-center justify-between pb-6 border-b-2 border-ink")}>
                                {activeEntry ? (
                                    // Drill-down attivo: "back" al posto del logo (reference Gumroad mobile)
                                    <button onClick={() => setMobilePanel(null)} className={clsx("flex items-center gap-2 font-bold", colors.text)} aria-label="Back to main menu">
                                        <ArrowLeft className="h-5 w-5" />
                                        Back
                                    </button>
                                ) : (
                                    <Link href="/" onClick={closeAllMenus}>
                                        <Image src={data.navbar.logo} alt="logo" width={120} height={32} />
                                    </Link>
                                )}
                                <button onClick={closeAllMenus} className={clsx(activeEntry ? colors.text : "text-ink-muted hover:text-ink")} aria-label="Close menu">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* overflow-y-auto: con molte voci il menu deve scrollare, le CTA sotto restano visibili */}
                            <div className="mt-8 flex-1 flex flex-col gap-6 overflow-y-auto min-h-0">
                                {!activeEntry && navEntries.map((entry) => {
                                    if (!entry.items) {
                                        return (
                                            <Link
                                                key={entry.to}
                                                href={entry.to}
                                                target={entry.target ? entry.target : "_self"}
                                                onClick={closeAllMenus}
                                                className={clsx(
                                                    "self-start text-xl font-semibold text-ink hover:text-brand-blue",
                                                    entry.highlight === 'marker' && "nav-marker",
                                                )}
                                            >
                                                {entry.text}
                                            </Link>
                                        );
                                    }
                                    return (
                                        <button key={entry.text} onClick={() => setMobilePanel(entry.text)} className="flex items-center justify-between text-xl font-semibold text-ink hover:text-brand-blue" aria-expanded={false}>
                                            {entry.text}
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    );
                                })}
                                {activeEntry && (
                                    <>
                                        <p className={clsx("font-display text-sm uppercase tracking-widest", colors.text)}>{activeEntry.text}</p>
                                        {groupItems(activeEntry).map(item => (
                                            <Link key={item.to} href={item.to} onClick={closeAllMenus} className={clsx("text-xl font-semibold hover:opacity-80", colors.text)}>
                                                {item.text}
                                            </Link>
                                        ))}
                                        {activeEntry.pastEditions && pastEditions.length > 0 && (
                                            <div className="pt-6 border-t-2 border-ink">
                                                <p className={clsx("font-display text-sm uppercase mb-2", colors.text)}>Past Editions</p>
                                                {pastEditions.map((year) => (
                                                    <Link key={year} href={`/${year}`} onClick={closeAllMenus} className={clsx("block py-1 text-lg font-medium hover:opacity-80", colors.text)}>
                                                        Edition {year}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className={clsx("pt-8 mt-auto border-t-2 border-ink flex flex-col gap-3")}>
                                {activeCtas.map((cta, i) => (
                                    <CtaButton key={cta.id} cta={cta} primary={i === 0} className="w-full" />
                                ))}
                            </div>
                        </nav>
                    );
                })()}
            </div>
        </>
    );
}
