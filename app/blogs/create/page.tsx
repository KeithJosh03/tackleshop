// Force TS Reload
import CreateBlogClient from './CreateBlogClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Post a Catch | SmoothCast',
    description: 'Share your latest fishing adventure with the community.',
};

export default function Page() {
    return (
        <main className="min-h-screen pt-20 pb-16 bg-[#0b0f10]">
            <div className="max-w-2xl mx-auto px-4">
                <CreateBlogClient />
            </div>
        </main>
    );
}
