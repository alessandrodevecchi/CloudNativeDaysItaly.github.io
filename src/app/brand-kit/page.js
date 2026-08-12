import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Check, X } from 'lucide-react';
import config from '@/config/website.json';
import brandKit from '@/config/brand-kit.json';
import CopyButton from '@/components/brandkit/CopyButton';
import PressFacts from '@/components/brandkit/PressFacts';
import { DownloadList } from '@/components/brandkit/DownloadButtons';
import CardGenerator from '@/components/brandkit/generator/CardGenerator';
import DecorLayer from '@/components/decor/DecorLayer';
import BrandRings from '@/components/decor/BrandRings';

export const metadata = {
  title: `Brand & Media Kit - ${config.general.event.name}`,
  description:
    'Logos, colors, templates and ready-made assets to share Cloud Native Days Italy: for attendees, media partners and speakers.',
};

const SectionHeading = ({ eyebrow, title, dark = false }) => (
  <>
    <span className={`eyebrow ${dark ? 'text-brand-yellow' : 'text-brand-magenta'}`}>
      {eyebrow}
    </span>
    <h2 className={`mt-2 font-display text-section uppercase ${dark ? 'text-white' : 'text-ink'}`}>
      {title}
    </h2>
  </>
);

export default function BrandKitPage() {
  const { hero, basics, mediaPartners, attendees, speakers, usage } = brandKit;

  return (
    <>
      {/* Hero + anchor links: banda blu piena, evita due sezioni bianche
          adiacenti con brand basics */}
      <section className='relative overflow-hidden bg-brand-blue'>
        <DecorLayer
          items={[
            { pattern: 'cluster-c', position: 'top-right', size: 'lg' },
            { pattern: 'halftone', position: 'mid-right', size: 'lg', className: 'opacity-20 invert' },
          ]}
        />
        <div className='relative z-10 mx-auto max-w-[1200px] px-6 py-16 pt-32 md:py-24 md:pt-40'>
          <span className='stamp'>Brand & Media Kit</span>
          <h1 className='mt-6 font-display text-section uppercase text-white'>{hero.title}</h1>
          <p className='mt-8 max-w-3xl text-xl text-white'>{hero.lead}</p>
          <nav className='mt-8 flex flex-wrap gap-2' aria-label='Brand kit sections'>
            {hero.anchors.map((anchor) => (
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

      {/* Brand basics */}
      <section className='border-t-2 border-ink bg-white py-16 lg:py-24' id='basics'>
        <div className='mx-auto max-w-[1200px] px-6'>
          <SectionHeading eyebrow='For everyone' title={basics.title} />
          <p className='mt-6 max-w-2xl text-lg text-ink-muted'>{basics.description}</p>

          <div className='mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2'>
            {/* Logo box: versione positiva e negativa */}
            <div className='grid grid-rows-2 gap-4'>
              <div className='card-pop flex items-center justify-center bg-white p-10'>
                <Image src='/images/logo.webp' alt='Cloud Native Days Italy logo' width={280} height={181} style={{ height: 'auto' }} />
              </div>
              <div className='card-pop flex items-center justify-center bg-ink p-10'>
                <Image src='/images/Logo_CND_W.svg' alt='Cloud Native Days Italy logo, white version' width={280} height={181} style={{ height: 'auto' }} />
              </div>
            </div>

            {/* Palette + type */}
            <div>
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                {basics.palette.map((color) => (
                  <div key={color.hex} className='border-pop border-ink'>
                    <div className='h-16' style={{ backgroundColor: color.hex }} />
                    <div className='border-t-2 border-ink bg-white px-3 py-2'>
                      <p className='text-sm font-bold text-ink'>{color.name}</p>
                      <p className='text-xs uppercase text-ink-muted'>{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='card-pop mt-4 p-6'>
                <p className='font-display text-3xl uppercase text-ink'>Extenda / Anton</p>
                <p className='mt-1 text-sm text-ink-muted'>Display font: headings, always uppercase</p>
                <p className='mt-4 text-2xl font-bold text-ink'>Poppins</p>
                <p className='mt-1 text-sm text-ink-muted'>Body font: everything else</p>
              </div>
            </div>
          </div>

          <div className='mt-10'>
            <DownloadList items={basics.downloads} />
            {/* Gli elementi decorativi delle card (donut, diamanti, stelle,
                nuvole) non sono nostri da redistribuire: nessun download,
                si passa dal generator. */}
            <p className='mt-4 max-w-2xl text-sm text-ink-muted'>{basics.decorNote}</p>
          </div>

          {/* Ingresso alla pagina design system: è un link, non un
              download, quindi freccia e nessun chip "Soon" */}
          <div className='card-pop mt-10 grid grid-cols-1 gap-6 bg-white p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center'>
            <div>
              <h3 className='font-display text-xl uppercase text-ink'>
                {basics.designSystem.title}
              </h3>
              <p className='mt-4 max-w-2xl text-ink-soft'>{basics.designSystem.description}</p>
            </div>
            <div className='lg:justify-self-end'>
              <Link
                href='/brand-kit/design-system'
                className='btn-pop btn-pop-primary group inline-flex items-center'
              >
                {basics.designSystem.cta}
                <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
              </Link>
            </div>
          </div>

          {/* Boilerplate: breve descrizione ufficiale dell'evento, per tutti */}
          <div className='card-pop mt-10 bg-white p-8'>
            <h3 className='font-display text-xl uppercase text-ink'>Boilerplate</h3>
            <p className='mt-4 max-w-3xl text-ink-soft'>{basics.boilerplate}</p>
            <div className='mt-6'>
              <CopyButton text={basics.boilerplate} label='Copy boilerplate' />
            </div>
          </div>
        </div>
      </section>

      {/* Media partners */}
      <section className='border-t-2 border-ink bg-cream py-16 lg:py-24' id='media-partners'>
        <div className='mx-auto max-w-[1200px] px-6'>
          <SectionHeading eyebrow='Spread the word' title={mediaPartners.title} />
          <p className='mt-6 max-w-2xl text-lg text-ink-muted'>{mediaPartners.description}</p>

          <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='card-pop bg-white p-8'>
              <h3 className='font-display text-xl uppercase text-ink'>What you get</h3>
              <ul className='mt-4 space-y-3'>
                {mediaPartners.offer.map((item) => (
                  <li key={item} className='flex gap-3 text-ink-soft'>
                    <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-brand-blue' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className='card-pop bg-white p-8'>
              <h3 className='font-display text-xl uppercase text-ink'>What we ask</h3>
              <ul className='mt-4 space-y-3'>
                {mediaPartners.ask.map((item) => (
                  <li key={item} className='flex gap-3 text-ink-soft'>
                    <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-brand-magenta' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Anteprima card partner (resa in CSS) + link al generator */}
          <div className='mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
            <div className='card-pop relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden bg-brand-magenta p-8 shadow-pop-lg transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_#111111]'>
              <BrandRings cluster='a' className='pointer-events-none absolute -right-[18%] -top-[20%] w-[80%] opacity-95' aria-hidden />
              <div className='relative z-10 flex h-full flex-col'>
                <Image src='/images/Logo_CND_W.svg' alt='' width={140} height={91} style={{ height: 'auto' }} aria-hidden />
                <p className='mt-auto font-display text-5xl uppercase leading-none text-white'>
                  Proud
                  <br />
                  <span className='text-brand-yellow'>partner!</span>
                </p>
                <div className='mt-4 inline-flex w-fit items-center border-pop border-ink bg-white px-4 py-2'>
                  <span className='text-sm font-bold text-ink'>Your logo here</span>
                </div>
              </div>
            </div>
            <div>
              <a href='?uc=partner#generator' className='btn-pop btn-pop-primary group inline-flex items-center'>
                Create your partner card
                <ArrowDown className='ml-2 h-5 w-5 transition-transform group-hover:translate-y-1' />
              </a>
              <p className='mt-6 max-w-md text-sm text-ink-muted'>
                Add your organization name and logo in the generator below,
                pick a format and post it with the boilerplate above.
              </p>
            </div>
          </div>

          {/* Press facts: chi cerca i numeri è lo stesso lettore che cerca
              il boilerplate, quindi stanno qui e non in fondo alla pagina */}
          <PressFacts />
        </div>
      </section>

      {/* Attendees */}
      <section className='border-t-2 border-ink bg-white py-16 lg:py-24' id='attendees'>
        <div className='mx-auto max-w-[1200px] px-6'>
          <SectionHeading eyebrow='Coming to the event?' title={attendees.title} />
          <p className='mt-6 max-w-2xl text-lg text-ink-muted'>{attendees.description}</p>

          <div className='mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
            {/* Anteprima card "I'll be there" resa in CSS col design system */}
            <div className='card-pop relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden bg-brand-blue p-8 shadow-pop-lg transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_#111111]'>
              {/* Trio di anelli in alto a destra: dimensione fissa relativa
                  alla card, ben visibile anche su mobile */}
              <BrandRings cluster='d' className='pointer-events-none absolute -right-[12%] -top-[12%] w-[65%] opacity-95' aria-hidden />
              <div className='relative z-10 flex h-full flex-col'>
                <Image src='/images/Logo_CND_W.svg' alt='' width={140} height={91} style={{ height: 'auto' }} aria-hidden />
                <p className='mt-auto font-display text-5xl uppercase leading-none text-white'>
                  I&apos;ll be
                  <br />
                  <span className='text-brand-yellow'>there</span>
                </p>
                <p className='mt-4 text-sm font-bold text-white'>
                  {config.hero.city.split(',')[0].trim()}, {config.hero.badgeDate} ·{' '}
                  {config.general.event.website.replace(/^https?:\/\//, '')}
                </p>
              </div>
            </div>

            <div>
              <a href='#generator' className='btn-pop btn-pop-primary group inline-flex items-center'>
                Create yours
                <ArrowDown className='ml-2 h-5 w-5 transition-transform group-hover:translate-y-1' />
              </a>
              <p className='mt-6 max-w-md text-sm text-ink-muted'>
                Personalize your card with the generator below: name, photo
                and format, ready to post.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section className='border-t-2 border-ink bg-cream py-16 lg:py-24' id='speakers'>
        <div className='mx-auto max-w-[1200px] px-6'>
          <SectionHeading eyebrow='On stage' title={speakers.title} />
          <p className='mt-6 max-w-2xl text-lg text-ink-muted'>{speakers.description}</p>

          <div className='mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2'>
            {/* Anteprima slide template resa in CSS */}
            <div className='card-pop relative aspect-video w-full overflow-hidden bg-white p-8 shadow-pop-lg transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_#111111]'>
              {/* Anelli anche qui, cluster diverso dalle altre preview */}
              <BrandRings cluster='e' className='pointer-events-none absolute -right-[10%] -top-[28%] w-[45%] opacity-90' aria-hidden />
              <div className='relative z-10 flex h-full flex-col'>
                <Image src='/images/logo_xs.webp' alt='' width={120} height={78} style={{ height: 'auto' }} aria-hidden />
                <p className='mt-auto font-display text-3xl uppercase leading-tight text-ink'>
                  Your talk title here
                </p>
                <p className='mt-2 text-sm font-bold text-brand-magenta'>
                  Your Name · @yourhandle
                </p>
              </div>
            </div>

            <div>
              <DownloadList items={speakers.downloads} />
              <ul className='mt-8 space-y-3'>
                {speakers.guidelines.map((item) => (
                  <li key={item} className='flex gap-3 text-ink-soft'>
                    <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-brand-blue' />
                    {item}
                  </li>
                ))}
              </ul>
              <p className='mt-8 max-w-md border-pop border-ink bg-brand-yellow-light p-4 text-sm font-medium text-ink'>
                {speakers.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Card generator */}
      <section className='border-t-2 border-ink bg-white py-16 lg:py-24' id='generator'>
        <div className='mx-auto max-w-[1200px] px-6'>
          <SectionHeading eyebrow='Make it yours' title='Card generator' />
          <p className='mt-6 max-w-2xl text-lg text-ink-muted'>
            Pick a format, add your details and download your card. Everything
            happens in your browser.
          </p>
          <CardGenerator />
        </div>
      </section>

      {/* The only rules: banda cream compatta come da wireframe Figma
          (06-usage-rules), niente colonne do/don't */}
      <section className='border-t-2 border-ink bg-cream py-16 lg:py-20' id='usage'>
        <div className='mx-auto max-w-[1200px] px-6'>
          <h2 className='font-display text-section uppercase text-ink'>{usage.title}</h2>
          <ul className='mt-8 flex flex-wrap gap-x-10 gap-y-4'>
            {usage.rules.map((rule) => (
              <li key={rule.text} className='flex items-start gap-2 text-ink-soft'>
                {rule.ok ? (
                  <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-brand-blue' />
                ) : (
                  <X className='mt-0.5 h-5 w-5 flex-shrink-0 text-brand-magenta' />
                )}
                {rule.text}
              </li>
            ))}
          </ul>
          <p className='mt-8 font-medium text-ink-muted'>{usage.contact}</p>
        </div>
      </section>
    </>
  );
}
