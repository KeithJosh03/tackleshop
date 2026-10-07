import BlogListClient from './BlogListClient';
import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Plus } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Catch Reports & Stories | SmoothCast',
    description: 'Explore the latest catches and fishing stories from the SmoothCast community. Tag your gear and share your adventure!',
};

export default function Page() {
    return (
        <main className="min-h-screen pt-28 pb-20 bg-[#0b0f10] relative overflow-hidden">
            {/* Ambient copper lighting */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#ffc49a]/5 blur-[160px] pointer-events-none rounded-full" />

            {/* Changed from max-w-2xl to max-w-7xl for a wider layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-8">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#22282f]">
                    <div className="flex flex-col gap-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc49a]/10 border border-[#ffc49a]/20 w-fit">
                            <Sparkles className="w-3.5 h-3.5 text-[#ffc49a]" />
                            <span className="text-[#ffc49a] text-[10px] font-bold uppercase tracking-widest">
                                Community Stream
                            </span>
                        </div>
                        <h1 className="text-3xl font-[900] text-[#e0e3e5] uppercase tracking-tight">Catch Reports</h1>
                    </div>

                    <Link
                        href="/blogs/create"
                        className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ffc49a] text-[#4f2500] font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#ffb47c] transition-all shadow-[0_0_20px_-5px_rgba(255,196,154,0.3)] flex-shrink-0"
                    >
                        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
                        <span>Post a Catch</span>
                    </Link>
                </div>

                <BlogListClient />
            </div>
        </main>
    );
}