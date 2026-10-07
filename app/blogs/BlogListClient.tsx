'use client';

import { useState, useEffect } from 'react';
import { Heart, MoreVertical, Edit3, Trash2, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchBlogs, toggleBlogLike, BlogPost } from '@/lib/api/blogService';
import { apiClient } from '@/lib/api/apiClient';
import { useSession } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function BlogListClient() {
    const { data: session } = useSession();
    const router = useRouter();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

    const [deleteModalBlogId, setDeleteModalBlogId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [hoveredProduct, setHoveredProduct] = useState<{ product: any; x: number; y: number } | null>(null);

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                const res = await fetchBlogs(page);
                if (res) {
                    setBlogs(prev => page === 1 ? res.blogs : [...prev, ...res.blogs]);
                    setHasMore(page < res.last_page);
                }
            } catch (error) {
                console.error('Error loading blogs feed:', error);
            } finally {
                setLoading(false);
            }
        };
        loadBlogs();
    }, [page]);

    const handleLike = async (id: number) => {
        if (!session) {
            alert('Please login to like this catch!');
            return;
        }

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

        try {
            const res = await toggleBlogLike(id);
            if (!res) {
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
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    const confirmDelete = async () => {
        if (!deleteModalBlogId) return;

        setIsDeleting(true);
        try {
            await apiClient(`/api/blogs/${deleteModalBlogId}`, { method: 'DELETE' });
            setBlogs(prev => prev.filter(b => b.id !== deleteModalBlogId));
            setDeleteModalBlogId(null);
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete the post. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading && blogs.length === 0) {
        return (
            <div className="flex flex-col gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-[#14181a] border border-[#303a47] rounded-xl h-[420px] animate-pulse" />
                ))}
            </div>
        );
    }

    console.log(blogs);
    return (
        <div className="flex flex-col gap-8 relative">
            {blogs.length === 0 && (
                <div className="text-center py-20 bg-[#14181a] rounded-xl border border-[#303a47] col-span-full">
                    <h3 className="text-lg font-bold text-[#e0e3e5] mb-2 uppercase tracking-wide">No catches shared yet</h3>
                    <p className="text-xs text-[#a28d7e]">Be the first angler to post your catch report!</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-start">
                {blogs.map(blog => {
                    // Strict Ownership Validation: Matching ID, Email, or Admin Role
                    const isOwner = session?.user && (
                        ((blog.user as any).email && session.user.email === (blog.user as any).email) ||
                        (Number(session.user.id) === Number(blog.user.id)) ||
                        (session.user as any).role === 'admin'
                    );

                    return (
                        <article key={blog.id} className="bg-[#14181a] border border-[#303a47] rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:border-[#ffc49a]/50 flex flex-col h-full">
                            {/* Author Header */}
                            <div className="p-4 flex items-center justify-between border-b border-[#22282f] bg-[#191e23] relative">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 relative bg-[#ffc49a]/20 border border-[#ffc49a]/40 rounded-full overflow-hidden flex items-center justify-center text-[#ffc49a] font-bold text-sm flex-shrink-0">
                                        {(blog.user as any).avatar ? (
                                            <Image
                                                src={(blog.user as any).avatar.startsWith('http') ? (blog.user as any).avatar : `${BASE_URL}${(blog.user as any).avatar}`}
                                                alt={blog.user.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            blog.user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <h2
                                            onClick={() => router.push(`/blogs/blog-details/${blog.id}`)}
                                            className="font-extrabold text-sm text-[#e0e3e5] uppercase tracking-wide cursor-pointer hover:text-[#ffc49a] transition-colors"
                                        >
                                            {blog.title}
                                        </h2>
                                        <p className="text-[11px] text-[#a28d7e] flex items-center gap-2 mt-0.5 flex-wrap">
                                            <span className="text-[#ffc49a] font-semibold">{blog.user.name}</span>
                                            <span>•</span>
                                            <span>{blog.created_at}</span>
                                            {blog.location && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-[#ffc49a] flex items-center gap-1 font-medium">
                                                        <MapPin className="w-3 h-3" /> {blog.location}
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Only Render Options Menu if User Owns the Post */}
                                {isOwner && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveMenuId(activeMenuId === blog.id ? null : blog.id)}
                                            className="p-1.5 text-[#a28d7e] hover:text-white transition-colors rounded-lg hover:bg-[#22282f]"
                                            aria-label="Post options"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {activeMenuId === blog.id && (
                                            <div className="absolute right-0 mt-1 w-36 bg-[#14181a] border border-[#303a47] rounded-lg shadow-2xl py-1 z-50">
                                                <button
                                                    onClick={() => {
                                                        setActiveMenuId(null);
                                                        router.push(`/blogs/edit/${blog.id}`);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#e0e3e5] hover:bg-[#1f262d] transition-colors text-left"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5 text-[#ffc49a]" />
                                                    <span>Edit Post</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActiveMenuId(null);
                                                        setDeleteModalBlogId(blog.id);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span>Delete Post</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Images Grid Layout */}
                            {blog.images.length > 0 && (
                                <div
                                    onClick={() => router.push(`/blogs/blog-details/${blog.id}`)}
                                    className={`grid gap-0.5 bg-[#0b0f10] cursor-pointer ${blog.images.length === 2 ? 'grid-cols-2' : ''} ${blog.images.length >= 3 ? 'grid-cols-2 grid-rows-2' : ''}`}
                                >
                                    {blog.images.slice(0, 4).map((img, idx) => (
                                        <div key={idx} className={`relative aspect-square bg-[#0b0f10] ${blog.images.length === 3 && idx === 0 ? 'row-span-2 col-span-1' : ''}`}>
                                            <Image src={`${BASE_URL}${img.url}`} alt="Catch photo" fill className="object-cover hover:opacity-95 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Content & Caption */}
                            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                                <div className="text-[#d9e3f4] text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: blog.caption_html.replace(
                                                /<strong class="text-\[#ffc49a\]">(.*?)<\/strong>/g,
                                                (_, gearName) => {
                                                    const matchedProduct = blog.tagged_products.find(p => p.title.toLowerCase() === gearName.replace('@', '').toLowerCase());
                                                    const productId = matchedProduct ? matchedProduct.id : '#';
                                                    return `<a href="/product-details/${productId}" class="text-[#ffc49a] font-bold hover:underline gear-mention" data-name="${gearName}">${gearName}</a>`;
                                                }
                                            )
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-5 py-3.5 bg-[#101317] border-t border-[#22282f] flex items-center justify-between mt-auto">
                                <button
                                    onClick={() => handleLike(blog.id)}
                                    className="flex items-center gap-2 group transition-colors"
                                >
                                    <Heart className={`w-5 h-5 transition-all ${blog.is_liked ? 'fill-[#ff4d4d] text-[#ff4d4d] scale-110' : 'text-[#a28d7e] group-hover:text-[#ff4d4d]'}`} />
                                    <span className={`text-xs font-bold ${blog.is_liked ? 'text-[#ff4d4d]' : 'text-[#a28d7e] group-hover:text-white'}`}>
                                        {blog.likes_count} Likes
                                    </span>
                                </button>

                                <button
                                    onClick={() => router.push(`/blogs/blog-details/${blog.id}`)}
                                    className="flex items-center gap-1.5 text-xs text-[#a28d7e] hover:text-[#ffc49a] transition-colors"
                                >
                                    <span>View Details</span>
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            {hasMore && (
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="w-full py-3.5 bg-[#14181a] text-[#ffc49a] font-bold text-xs uppercase tracking-widest rounded-xl border border-[#303a47] hover:bg-[#1c2229] hover:border-[#ffc49a] transition-all shadow-md mt-2"
                >
                    Load More Catches
                </button>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteModalBlogId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#14181a] border border-[#303a47] rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in duration-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white uppercase tracking-tight">Delete Catch Report</h3>
                                <p className="text-xs text-[#a28d7e]">This action cannot be undone. Are you sure you want to remove this post?</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#22282f]">
                            <button
                                type="button"
                                onClick={() => setDeleteModalBlogId(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-transparent border border-[#303a47] text-[#a28d7e] hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="px-5 py-2 bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-red-600 transition-all shadow-lg disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}