'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';
import Image from 'next/image';
import { fetchBlogs, toggleBlogLike, BlogPost } from '@/lib/api/blogService';
import { numericConverter } from '@/utils/priceUtils';
import { useSession } from 'next-auth/react';

export default function BlogListClient() {
    const { data: session } = useSession();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const loadBlogs = async () => {
            const res = await fetchBlogs(page);
            if (res) {
                setBlogs(prev => page === 1 ? res.blogs : [...prev, ...res.blogs]);
                setHasMore(page < res.last_page);
            }
            setLoading(false);
        };
        loadBlogs();
    }, [page]);

    const handleLike = async (id: number) => {
        if (!session) {
            alert('Please login to like this catch!');
            return;
        }

        // Optimistic UI update
        setBlogs(prev => prev.map(b => {
            if (b.id === id) {
                return {
                    ...b,
                    is_liked: !b.is_liked,
                    likes_count: b.is_liked ? b.likes_count - 1 : b.likes_count + 1
                };
            }
            return b;
        }));

        const res = await toggleBlogLike(id);
        if (!res) {
            // Revert on failure (simplified)
            setBlogs(prev => prev.map(b => {
                if (b.id === id) {
                    return {
                        ...b,
                        is_liked: !b.is_liked,
                        likes_count: b.is_liked ? b.likes_count - 1 : b.likes_count + 1
                    };
                }
                return b;
            }));
        }
    };

    if (loading && blogs.length === 0) {
        return <div className="text-center text-[#a28d7e] py-12 animate-pulse">Loading catches...</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            {blogs.length === 0 && (
                <div className="text-center py-16 bg-[#12171e] rounded-xl border border-[#212b37]">
                    <h3 className="text-xl font-bold text-[#e0e3e5] mb-2">No catches yet!</h3>
                    <p className="text-[#a28d7e]">Be the first to share your fishing adventure.</p>
                </div>
            )}

            {blogs.map(blog => (
                <article key={blog.id} className="bg-[#12171e] border border-[#212b37] rounded-xl overflow-hidden shadow-xl">
                    {/* Header */}
                    <div className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#212b37] rounded-full flex items-center justify-center text-[#ffc49a] font-bold">
                            {blog.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="font-bold text-[#e0e3e5] leading-tight">{blog.title}</h2>
                            <p className="text-xs text-[#a28d7e]">By {blog.user.name} • {blog.created_at}</p>
                        </div>
                    </div>

                    {/* Images (Simplified grid for up to 3) */}
                    {blog.images.length > 0 && (
                        <div className={`grid gap-0.5 bg-[#0b0f10] ${blog.images.length === 2 ? 'grid-cols-2' : ''} ${blog.images.length === 3 ? 'grid-cols-2 grid-rows-2' : ''}`}>
                            {blog.images.slice(0, 3).map((img, idx) => (
                                <div key={idx} className={`relative aspect-square ${blog.images.length === 3 && idx === 0 ? 'row-span-2 col-span-1' : ''}`}>
                                    <Image src={img.url} alt="Catch" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Content & Shoppable Tags */}
                    <div className="p-4">
                        <div className="text-[#d9e3f4] text-sm mb-4 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: blog.caption_html }} />

                        {blog.tagged_products.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-[#212b37]">
                                <p className="text-xs font-bold text-[#a28d7e] uppercase tracking-wider mb-3">Gear Used in this Catch</p>
                                <div className="flex flex-col gap-2">
                                    {blog.tagged_products.map(product => (
                                        <a href={`/product-details/${product.id}`} key={product.id} className="flex items-center gap-3 bg-[#1d2430] hover:bg-[#262f3f] p-2 rounded-lg transition-colors group">
                                            <div className="w-12 h-12 relative rounded-md overflow-hidden bg-white">
                                                {product.image && <Image src={product.image} alt={product.title} fill className="object-contain p-1" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#ffc49a] transition-colors">{product.title}</h4>
                                                <p className="text-xs font-bold text-[#44e1a0]">{numericConverter(product.price)}</p>
                                            </div>
                                            <div className="px-3">
                                                <div className="w-8 h-8 rounded-full bg-[#303a47] flex items-center justify-center group-hover:bg-[#ffc49a] transition-colors">
                                                    <svg className="w-4 h-4 text-white group-hover:text-[#4f2500] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="px-4 py-3 bg-[#0d1218] border-t border-[#212b37] flex items-center gap-6">
                        <button
                            onClick={() => handleLike(blog.id)}
                            className="flex items-center gap-2 group transition-colors"
                        >
                            <Heart className={`w-5 h-5 transition-all ${blog.is_liked ? 'fill-red-500 text-red-500 scale-110' : 'text-[#a28d7e] group-hover:text-red-400'}`} />
                            <span className={`text-sm font-medium ${blog.is_liked ? 'text-red-500' : 'text-[#a28d7e] group-hover:text-red-400'}`}>
                                {blog.likes_count}
                            </span>
                        </button>
                        <button className="flex items-center gap-2 text-[#a28d7e] hover:text-white transition-colors">
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Comment</span>
                        </button>
                        <button className="flex items-center gap-2 text-[#a28d7e] hover:text-white transition-colors ml-auto">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </article>
            ))}

            {hasMore && (
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="w-full py-3 bg-[#12171e] text-[#a28d7e] font-bold text-sm uppercase tracking-wider rounded-xl border border-[#212b37] hover:bg-[#1d2430] hover:text-white transition-all"
                >
                    Load More Catches
                </button>
            )}
        </div>
    );
}
