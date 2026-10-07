import { fetchBlogById } from '@/lib/api/blogService';
import CreateBlogClient from '../../create/CreateBlogClient';
import { notFound } from 'next/navigation';

interface EditBlogPageProps {
    params: { id: string };
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
    const res = await fetchBlogById(params.id);

    if (!res || !res.blog) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <CreateBlogClient initialData={res.blog} blogId={params.id} />
        </div>
    );
}