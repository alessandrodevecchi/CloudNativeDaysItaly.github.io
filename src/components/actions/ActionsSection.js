import C4P_Card from './C4P_Card';
import TicketsCard from './TicketsCard';
import DecorLayer from '@/components/decor/DecorLayer';

export default function ActionsSection({ data }) {
    if (!data) return null;

    return (
        <section className="relative overflow-hidden bg-brand-blue py-16 lg:py-24" id={"tickets"}>
            <DecorLayer items={[{ pattern: 'cluster-dot', position: 'top-right', size: 'md' }]} />
            <div className="relative z-10 mx-auto max-w-[1200px] px-6">
                <h2 className="font-display text-section uppercase text-white">
                    You could be on this stage
                </h2>
                <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    <C4P_Card data={data.c4p} />
                    <TicketsCard data={data.tickets} />
                </div>
            </div>
        </section>
    );
}
