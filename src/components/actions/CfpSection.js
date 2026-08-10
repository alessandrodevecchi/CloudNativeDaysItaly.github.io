import C4P_Card from './C4P_Card';
import DecorLayer from '@/components/decor/DecorLayer';

// Sezione CFP standalone (wireframe: 06-speakers-cfp) — scorporata dalla
// vecchia ActionsSection che teneva insieme CFP e tickets.
export default function CfpSection({ data }) {
    if (!data) return null;

    return (
        <section className="relative overflow-hidden bg-brand-blue py-16 lg:py-24" id="cfp">
            <DecorLayer
                items={[
                    { pattern: 'cluster-c', position: 'top-right', size: 'lg' },
                    { pattern: 'cluster-duo', position: 'bottom-left', size: 'md' },
                    { pattern: 'halftone', position: 'top-left', size: 'xl', className: 'opacity-20 invert' },
                ]}
            />
            <div className="relative z-10 mx-auto max-w-[1200px] px-6">
                {/* Sezione-azione chiave: stamp, non eyebrow (regola occhielli) */}
                <span className="stamp">Call for Papers</span>
                <h2 className="mt-6 font-display text-section uppercase text-white">
                    You could be on this stage
                </h2>
                <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 lg:items-start">
                    <div>
                        <p className="text-lg text-white">
                            Share what you build, break and learn. We welcome first-time
                            speakers as much as seasoned ones.
                        </p>
                        {data.topics?.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {data.topics.map((topic) => (
                                    <span key={topic} className="border-pop border-ink bg-white px-3 py-1 text-sm font-bold text-ink">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <C4P_Card data={data} />
                </div>
            </div>
        </section>
    );
}
