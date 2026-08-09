import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import DecorLayer from '@/components/decor/DecorLayer';
import communityConfig from '@/config/community.json';
import generalConfig from '@/config/website.json';

const PARTNER_SIZE_CLASSES = {
  lg: {
    wrapper: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 p-3',
    card: 'h-28 p-4',
  },
  md: {
    wrapper: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 p-3',
    card: 'h-20 p-3',
  },
};

const CommunityCard = ({ partner, size = 'lg' }) => {
  const { wrapper, card } = PARTNER_SIZE_CLASSES[size] || PARTNER_SIZE_CLASSES.lg;
  return (
    <div className={`flex-grow-0 flex-shrink-0 ${wrapper}`}>
      <a
        href={partner.url}
        target='_blank'
        rel='noopener noreferrer'
        className='block group'
      >
        <div className={`flex items-center justify-center bg-white ${card} border-pop border-ink transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop`}>
          <img
            src={partner.logo}
            alt={partner.name}
            className='max-h-full max-w-full object-contain transition-all duration-300'
          />
        </div>
      </a>
    </div>
  );
};

const CommunityTierSection = ({
  tier,
  partners,
  config,
  uppercase = false,
  label,
  extraTopMargin = false,
}) => {
  if (!partners || partners.length === 0) return null;

  const size = config?.logoSize || 'lg';

  return (
    <div className={`mb-16 ${extraTopMargin ? 'mt-20' : ''}`}>
      {label && (
        <div className='mb-2'>
          <span className='eyebrow text-brand-magenta'>
            {label}
          </span>
        </div>
      )}
      <h2
        className={`font-display text-2xl text-ink border-b-2 border-ink pb-4 mb-6 ${uppercase ? 'uppercase' : 'capitalize'}`}
      >
        {config.title}
      </h2>
      {config.description && (
        <p className='text-ink-muted mb-8 max-w-2xl'>
          {config.description}
        </p>
      )}
      <div className='flex flex-wrap items-center -m-3'>
        {partners.map((partner, index) => (
          <CommunityCard key={`${tier}-${index}`} partner={partner} size={size} />
        ))}
      </div>
    </div>
  );
};

async function getCommunityData() {
  try {
    const currentYear = generalConfig.general.edition.toString();
    const editionConfigPath = path.join(
      process.cwd(),
      'src',
      'config',
      'editions',
      `${currentYear}.json`,
    );
    const editionConfig = JSON.parse(
      await fs.readFile(editionConfigPath, 'utf8'),
    );

    const communitiesByIds = editionConfig.communities || {};
    const hydratedCommunities = {};

    for (const tier in communitiesByIds) {
      const partnerIds = communitiesByIds[tier];
      let partnerDetails = await Promise.all(
        partnerIds.map(async (partnerId) => {
          const partnerPath = path.join(
            process.cwd(),
            'src',
            'config',
            'communities',
            `${partnerId}.md`,
          );
          try {
            const fileContents = await fs.readFile(partnerPath, 'utf8');
            return matter(fileContents).data;
          } catch (error) {
            return null;
          }
        }),
      );

      partnerDetails = partnerDetails.filter(Boolean);
      hydratedCommunities[tier] = partnerDetails;
    }
    return hydratedCommunities;
  } catch (error) {
    return {};
  }
}

export const metadata = {
  title: `Partners - ${generalConfig.general.event.name}`,
  description: communityConfig.page.description,
};

export default async function PartnersPage() {
  const communitiesByTier = await getCommunityData();
  const displayOrder = ['community', 'opensource', 'media'];

  return (
    <div className='relative overflow-hidden bg-white'>
      <DecorLayer
        items={[
          { pattern: 'cluster-b', position: 'top-right', size: 'lg' },
          { pattern: 'cluster-duo', position: 'bottom-left', size: 'md' },
          { pattern: 'halftone-c', position: 'bottom-right', size: 'lg', className: 'opacity-25' },
        ]}
      />
      <div className='relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:py-24'>
        <div className='max-w-3xl'>
          <span className='stamp'>{communityConfig.page.label}</span>
          <h1 className='section-heading mt-6'>
            {communityConfig.page.title}
          </h1>
          {Array.isArray(communityConfig.page.description) ? (
            communityConfig.page.description.map((p, i, arr) =>
              i === arr.length - 1 ? (
                <p key={i} className='mt-4 text-lg text-ink-muted font-semibold'>
                  {p}
                </p>
              ) : (
                <p key={i} className='mt-4 text-lg text-ink-muted'>
                  {p}
                </p>
              ),
            )
          ) : (
            <p className='mt-4 text-lg text-ink-muted'>
              {communityConfig.page.description}
            </p>
          )}
        </div>

        <div className='mt-20'>
          {displayOrder.map((tier, i) => (
            <CommunityTierSection
              key={tier}
              tier={tier}
              partners={communitiesByTier[tier]}
              config={communityConfig.tiers[tier]}
              uppercase={i < displayOrder.length - 1}
              label={
                tier === 'community'
                  ? 'Connect, live at the event!'
                  : tier === 'opensource'
                    ? 'Discover, live at the event!'
                    : tier === 'media'
                      ? 'Also supporting us'
                      : null
              }
              extraTopMargin={tier === 'media'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
