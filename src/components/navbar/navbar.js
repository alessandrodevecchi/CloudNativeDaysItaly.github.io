'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { ArrowRight, ChevronDown, X, Menu as MenuIcon } from 'lucide-react';
import './navbar.css';

export default function Navbar({ data, editions = [] }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentEdition = data.general.edition.toString();
    const pastEditions = editions.filter(e => e !== currentEdition).sort((a, b) => b.localeCompare(a));
    const navLinks = data.navbar.links.header;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
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
        setDropdownOpen(false);
    };

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
                            <Image src={data.navbar.logo} alt="logo" width={150} height={40} priority />
                        </Link>

                        {/* Item raggruppati a destra come da wireframe Figma (00-nav) */}
                        <nav className="navbar-desktop-links hidden lg:flex items-center gap-6 ml-auto mr-6">
                            {navLinks.map((link) => (
                                <Link key={link.to} href={link.to} target={link.target ? link.target : "_self"} className="text-sm font-bold text-ink hover:text-brand-blue transition-colors">
                                    {link.text}
                                </Link>
                            ))}
                            {pastEditions.length > 0 && (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-1 text-sm font-bold text-ink hover:text-brand-blue transition-colors"
                                    >
                                        Past Editions
                                        <ChevronDown className={clsx("h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")} />
                                    </button>
                                    <div
                                        className={clsx(
                                            "absolute top-full right-0 mt-3 w-48 bg-white rounded-none shadow-pop border-pop border-ink py-2 transition-all duration-200 ease-out origin-top",
                                            isDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                                        )}
                                    >
                                        {pastEditions.map(year => (
                                            <Link key={year} href={`/${year}`} onClick={closeAllMenus} className="block px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-yellow-light hover:text-ink">
                                                Edition {year}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </nav>

                        <div className="hidden lg:flex items-center">
                            <Link href={data.navbar.CTA.url} target={data.navbar.CTA.url.startsWith('http') ? '_blank' : undefined} rel={data.navbar.CTA.url.startsWith('http') ? 'noopener noreferrer' : undefined} className="btn-pop group inline-flex items-center justify-center bg-brand-yellow text-ink !px-4 !py-1.5 text-sm">
                                {data.navbar.CTA.label}
                                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
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
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute inset-0 bg-black/50"
                />
                <nav
                    className={clsx(
                        "absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white border-l-2 border-ink p-6 flex flex-col transition-transform duration-300 ease-in-out",
                        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    <div className="flex items-center justify-between pb-6 border-b-2 border-ink">
                        <Link href="/" onClick={closeAllMenus}>
                            <Image src={data.navbar.logo} alt="logo" width={120} height={32} />
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} className="text-ink-muted hover:text-ink" aria-label="Close menu">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-8 flex-1 flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link key={link.to} href={link.to} target={link.target ? link.target : "_blank"} onClick={closeAllMenus} className="text-xl font-semibold text-ink hover:text-brand-blue">
                                {link.text}
                            </Link>
                        ))}
                        {pastEditions.length > 0 && (
                            <div className="pt-6 border-t-2 border-ink">
                                <h3 className="font-display text-sm text-ink uppercase mb-2">Past Editions</h3>
                                {pastEditions.map((year) => (
                                    <Link key={year} href={`/${year}`} onClick={closeAllMenus} className="block py-1 text-lg font-medium text-ink-muted hover:text-brand-blue">
                                        Edition {year}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="pt-8 mt-auto border-t-2 border-ink">
                        <Link href={data.navbar.CTA.url} target={data.navbar.CTA.url.startsWith('http') ? '_blank' : undefined} rel={data.navbar.CTA.url.startsWith('http') ? 'noopener noreferrer' : undefined} onClick={closeAllMenus} className="btn-pop btn-pop-primary w-full inline-flex items-center justify-center">
                            {data.navbar.CTA.label}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    );
}
