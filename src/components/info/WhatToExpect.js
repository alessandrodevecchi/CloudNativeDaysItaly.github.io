// Sezione "What to Expect" (wireframe: 05-what-to-expect) — scorporata da
// Info per fare spazio alla banda tema (04) tra recap ed experience.
const DOT_COLORS = ['bg-brand-magenta', 'bg-brand-blue', 'bg-brand-yellow', 'bg-brand-magenta'];

const FeatureCard = ({ dotColor, title, children }) => (
  <div className='card-pop flex items-start gap-4 p-6 transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-pop'>
    <span aria-hidden='true' className={`mt-1 h-5 w-5 flex-shrink-0 rounded-full ${dotColor}`} />
    <div>
      <h3 className='text-lg font-bold text-ink'>{title}</h3>
      <p className='mt-1 text-sm text-ink-muted'>{children}</p>
    </div>
  </div>
);

export default function WhatToExpect({ data }) {
  if (!data) return null;

  return (
    <section className='border-t-2 border-ink bg-white py-16 lg:py-24' id='what-to-expect'>
      <div className='mx-auto max-w-[1200px] px-6'>
        {/* Occhiello da config: stesso testo ovunque la sezione compare */}
        <span className='eyebrow text-brand-magenta'>{data.eyebrow || 'The experience'}</span>
        <h2 className='section-heading mt-2'>{data.title}</h2>
        <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-2'>
          {['talks', 'networking', 'workshop', 'community'].map((key, i) => (
            <FeatureCard key={key} dotColor={DOT_COLORS[i]} title={data.boxes[key].title}>
              {data.boxes[key].description}
            </FeatureCard>
          ))}
        </div>
        <p className='mt-10 max-w-3xl text-lg text-ink-soft'>
          For developers, architects, engineers, DevOps and IT professionals,
          and anyone excited about cloud native and open source.
        </p>
      </div>
    </section>
  );
}
