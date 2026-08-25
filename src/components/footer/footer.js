'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SocialIcons from '@/components/social/SocialIcons';

export default function Footer({ data, editions = [] }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (!data) return null;

  const { footer, general } = data;
  const currentEdition = general.edition.toString();
  const pastEditions = editions
    .filter((e) => e !== currentEdition)
    .sort((a, b) => b.localeCompare(a));
  // La config navbar ha voci singole e gruppi (items): qui serve la lista piatta.
  const navLinks = data.navbar.links.header.flatMap((entry) =>
    entry.items ? entry.items : [entry],
  );

  return (
    <footer className='bg-ink text-white'>
      {/* Separatore tricolore brand — stacca il footer dalla sezione precedente */}
      <div aria-hidden='true' className='flex h-1.5'>
        <div className='flex-1 bg-brand-blue' />
        <div className='flex-1 bg-brand-magenta' />
        <div className='flex-1 bg-brand-yellow' />
      </div>
      <div className='mx-auto max-w-[1200px] px-6'>
        <div className='py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
            <div className='lg:col-span-1'>
              <Image src={footer.image} alt='Logo' width={225} height={60} style={{ height: 'auto' }} />
              <p className='mt-4 text-gray-400 text-sm'>
                {general.event.description}
              </p>
            </div>

            <div className='md:col-start-2'>
              <h3 className='font-display text-sm uppercase tracking-wider text-brand-yellow'>
                Navigation
              </h3>
              <ul className='mt-4 space-y-3'>
                {navLinks.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.to}
                      className='text-gray-400 hover:text-brand-yellow transition-colors'
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='font-display text-sm uppercase tracking-wider text-brand-yellow'>
                Past Editions
              </h3>
              <ul className='mt-4 space-y-3'>
                {pastEditions.map((year) => (
                  <li key={year}>
                    <Link
                      href={`/${year}`}
                      className='text-gray-400 hover:text-brand-yellow transition-colors'
                    >
                      Edition {year}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='font-display text-sm uppercase tracking-wider text-brand-yellow'>
                Connect
              </h3>
              <ul className='mt-4 space-y-3'>
                <li>
                  <a
                    href={`mailto:${general.contact.email}`}
                    className='text-gray-400 hover:text-brand-yellow transition-colors'
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <Link
                    href='/sponsors'
                    className='text-gray-400 hover:text-brand-yellow transition-colors'
                  >
                    Sponsorship
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='mt-12 border-t border-white/20 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='text-sm text-gray-500 text-center sm:text-left max-w-md sm:max-w-lg space-y-1.5'>
              <p className='text-gray-400'>
                {currentYear} {general.event.name}
              </p>
              <p className='leading-relaxed'>
                Unless otherwise noted, content is licensed under{' '}
                <a
                  href={footer.license.deedUrl}
                  target='_blank'
                  rel='license noopener noreferrer'
                  title='Creative Commons Attribution-ShareAlike 4.0 International'
                  className='text-gray-400 hover:text-brand-yellow underline underline-offset-2'
                >
                  {footer.license.shortName}
                </a>
                .
              </p>
            </div>
            <SocialIcons
              items={footer.icons}
              className='flex justify-center gap-4 flex-wrap'
              linkClassName='text-gray-400 hover:text-brand-yellow transition-colors'
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
