import { worksans } from '@/types/fonts';

export function SectionCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
    return (
        <div className={`${worksans.className} bg-ma-surface-container/50 border-2 border-greyColor/20 rounded-2xl shadow-sm overflow-hidden flex flex-col`}>
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-greyColor/30 bg-white/[0.02]">
                <span className="text-primaryColor text-2xl font-bold">#{step}</span>
                <h2 className="text-white text-xl font-bold tracking-tight uppercase">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}