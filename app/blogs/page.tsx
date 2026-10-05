// Force TS Reload
import BlogListClient from './BlogListClient';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Catch Reports | SmoothCast',
    description: 'Explore the latest catches and fishing stories from the SmoothCast community. Tag your gear and share your adventure!',
};

export default function Page() {
    return (
        <main className="min-h-screen pt-20 pb-16 bg-[#0b0f10]">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-[#e0e3e5] uppercase tracking-tight">Catch Reports</h1>
                    <Link href="/blogs/create" className="px-5 py-2.5 bg-[#ffc49a] text-[#4f2500] font-bold text-sm uppercase tracking-wider rounded-md hover:bg-[#ff9d4d] transition-colors">
                        Post a Catch
                    </Link>
                </div>

                <BlogListClient />
            </div>
        </main>
    );
}
