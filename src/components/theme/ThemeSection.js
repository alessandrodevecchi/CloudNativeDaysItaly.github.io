// Banda tema editoriale (wireframe: 04-theme-optional). Nasce spenta:
// si attiva da config quando il tema 2027 è definito.
export default function ThemeSection({ data }) {
  if (!data?.active) return null;

  return (
    <section className='bg-brand-yellow py-16 lg:py-20' id='theme'>
      <div className='mx-auto max-w-[1200px] px-6'>
        <span className='eyebrow text-ink'>{data.eyebrow}</span>
        <h2 className='section-heading mt-2'>{data.title}</h2>
        {data.description && (
          <p className='mt-6 max-w-3xl text-lg text-ink'>{data.description}</p>
        )}
      </div>
    </section>
  );
}
