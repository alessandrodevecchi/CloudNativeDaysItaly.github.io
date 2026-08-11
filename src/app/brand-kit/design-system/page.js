import config from '@/config/website.json';
import DecorLayer from '@/components/decor/DecorLayer';
import { DsDocsLink } from '@/components/brandkit/designsystem/DsKit';
import ColourSection from '@/components/brandkit/designsystem/ColourSection';
import TypographySection from '@/components/brandkit/designsystem/TypographySection';
import SurfacesSection from '@/components/brandkit/designsystem/SurfacesSection';
import LogoSection from '@/components/brandkit/designsystem/LogoSection';
import AtomsSection from '@/components/brandkit/designsystem/AtomsSection';
import StampsSection from '@/components/brandkit/designsystem/StampsSection';
import ComponentsSection from '@/components/brandkit/designsystem/ComponentsSection';
import PatternsSection from '@/components/brandkit/designsystem/PatternsSection';
import DoDontSection from '@/components/brandkit/designsystem/DoDontSection';
import CopySection from '@/components/brandkit/designsystem/CopySection';

/*
 * Documentazione visuale del design system, pubblica e indicizzabile.
 * Ogni esempio è reso con le classi e i componenti veri del sito: niente
 * screenshot, niente valori ricopiati a mano (palette e scale arrivano da
 * tailwind.config.mjs, i tipi di sessione da sessionTypes.js).
 * Le regole restano in docs/design-system.md: la pagina rimanda là.
 */

const siteUrl = config.general.event.website;

export const metadata = {
  title: `Design system - ${config.general.event.name}`,
  description:
    'Colours, typography, components and patterns of Cloud Native Days Italy, rendered with the real code of the website: the visual reference for anyone designing or writing for the event.',
  alternates: {
    canonical: `${siteUrl}/brand-kit/design-system`,
  },
  openGraph: {
    title: `Design system - ${config.general.event.name}`,
    description:
      'Colours, typography, components and patterns of Cloud Native Days Italy, rendered with the real code of the website.',
    url: `${siteUrl}/brand-kit/design-system`,
    type: 'article',
  },
};

const ANCHORS = [
  { label: 'Colour', target: '#colour' },
  { label: 'Typography', target: '#typography' },
  { label: 'Surfaces', target: '#surfaces' },
  { label: 'Logo', target: '#logo' },
  { label: 'Atoms', target: '#atoms' },
  { label: 'Stamp or eyebrow', target: '#stamps' },
  { label: 'Components', target: '#components' },
  { label: 'Patterns', target: '#patterns' },
  { label: "Do and don't", target: '#do-dont' },
  { label: 'Copy', target: '#copy' },
];

export default function DesignSystemPage() {
  return (
    <>
      {/* Hero: banda blu piena, come su /brand-kit */}
      <section className='relative overflow-hidden bg-brand-blue'>
        <DecorLayer
          items={[
            { pattern: 'cluster-d', position: 'top-right', size: 'lg' },
            {
              pattern: 'halftone-b',
              position: 'mid-right',
              size: 'lg',
              className: 'opacity-20 invert',
            },
          ]}
        />
        <div className='relative z-10 mx-auto max-w-[1200px] px-6 py-16 pt-32 md:py-24 md:pt-40'>
          <span className='stamp'>Design system</span>
          <h1 className='mt-6 font-display text-section uppercase text-white'>
            How Cloud Native Days Italy looks
          </h1>
          <p className='mt-8 max-w-3xl text-xl text-white'>
            Pop and neo brutalist: hard edges, black borders, flat colour bands, hard
            shadows. Every example on this page is rendered with the components and the
            tokens of this website, so it cannot drift from what you see everywhere else.
          </p>
          <div className='mt-6'>
            <DsDocsLink
              label='The rules behind it: docs/design-system.md'
              className='!text-brand-yellow'
            />
          </div>
          <nav className='mt-8 flex flex-wrap gap-2' aria-label='Design system sections'>
            {ANCHORS.map((anchor) => (
              <a
                key={anchor.target}
                href={anchor.target}
                className='border-pop border-ink bg-white px-3 py-1 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white'
              >
                {anchor.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <ColourSection />
      <TypographySection />
      <SurfacesSection />
      <LogoSection />
      <AtomsSection />
      <StampsSection />
      <ComponentsSection />
      <PatternsSection />
      <DoDontSection />
      <CopySection />
    </>
  );
}
