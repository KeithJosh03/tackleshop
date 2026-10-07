'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, MapPin, ArrowLeft, Trash2, Edit3, MoreVertical, Share2, Tag, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { fetchBlogById, toggleBlogLike, BlogPost } from '@/lib/api/blogService';
import { apiClient } from '@/lib/api/apiClient';
import { numericConverter } from '@/utils/priceUtils';
import { montserrat } from '@/types/fonts';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function BlogDetailClient() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const blogId = params?.id;

    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeMenuId, setActiveMenuId] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        if (!blogId) return;

        const fetchBlogDetail = async () => {
            try {
                const idString = Array.isArray(blogId) ? blogId[0] : blogId;
                const res = await fetchBlogById(idString);
                if (res && res.blog) {
                    setBlog(res.blog);
                }
            } catch (error) {
                console.error('Failed to fetch blog details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetail();
    }, [blogId]);

    const handleLike = async () => {
        if (!session) {
            alert('Please login to like this catch!');
            return;
        }
        if (!blog) return;

        setBlog(prev => prev ? {
            ...prev,
            is_liked: !prev.is_liked,
            likes_count: prev.is_liked ? prev.likes_count - 1 : prev.likes_count + 1
        } : null);

        const res = await toggleBlogLike(blog.id);
        if (!res) {
            setBlog(prev => prev ? {
                ...prev,
                is_liked: !prev.is_liked,
                likes_count: prev.is_liked ? prev.likes_count - 1 : prev.likes_count + 1
            } : null);
        }
    };

    const confirmDelete = async () => {
        if (!blog) return;
        setIsDeleting(true);
        try {
            await apiClient(`/api/blogs/${blog.id}`, { method: 'DELETE' });
            router.push('/blogs');
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete the post. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
                <div className="bg-zinc-900/60 border border-white/10 rounded-2xl h-[500px] animate-pulse" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className={`${montserrat.className} max-w-3xl mx-auto px-4 pt-28 pb-20 text-center`}>
                <h2 className="text-xl font-extrabold text-white mb-2 uppercase tracking-wide">Catch Report Not Found</h2>
                <p className="text-xs text-white/60 mb-6">The post you are looking for might have been removed or doesn't exist.</p>
                <button
                    onClick={() => router.push('/blogs')}
                    className="px-6 py-3 bg-ma-primary text-black font-bold text-xs uppercase rounded-xl tracking-widest hover:bg-white transition-colors cursor-pointer"
                >
                    Back to All Catches
                </button>
            </div>
        );
    }

    const isOwner = session?.user && (
        ((blog.user as any).email && session.user.email === (blog.user as any).email) ||
        (Number(session.user.id) === Number(blog.user.id)) ||
        (session.user as any).role === 'admin'
    );

    const mainImage = blog.images && blog.images.length > 0 ? blog.images[selectedImageIndex]?.url : null;

    return (
        <div className={`${montserrat.className} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 flex flex-col gap-5 mt-4`}>

            {/* Top Navigation & Controls Bar */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.push('/blogs')}
                    className="flex items-center gap-2 text-xs font-bold text-white/70 hover:text-ma-primary transition-colors bg-zinc-900/60 border border-white/10 px-3.5 py-2 rounded-xl shadow-md hover:border-ma-primary/40 cursor-pointer backdrop-blur-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Catch Feed</span>
                </button>

                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setActiveMenuId(!activeMenuId)}
                            className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900/60 border border-white/10 text-white hover:text-ma-primary transition-colors rounded-xl text-xs font-bold shadow-md hover:border-ma-primary/40 cursor-pointer backdrop-blur-md"
                        >
                            <span>Manage Post</span>
                            <MoreVertical className="w-4 h-4 text-ma-primary" />
                        </button>

                        {activeMenuId && (
                            <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl">
                                <button
                                    onClick={() => {
                                        setActiveMenuId(false);
                                        router.push(`/blogs/edit/${blog.id}`);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
                                >
                                    <Edit3 className="w-4 h-4 text-ma-primary" />
                                    <span>Edit Report</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveMenuId(false);
                                        setDeleteModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete Report</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Main Article Container Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Main Content Column (Left Side) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-zinc-950/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col">

                        {/* Author Header Banner */}
                        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/5 bg-zinc-900/40">
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div className="w-10 h-10 bg-ma-primary/15 border border-ma-primary/30 rounded-full flex items-center justify-center text-ma-primary font-black text-sm shadow-inner flex-shrink-0">
                                    {blog.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <h1 className="font-black text-sm sm:text-base md:text-lg text-white uppercase tracking-tight truncate">{blog.title}</h1>
                                    <p className="text-[11px] sm:text-xs text-white/60 flex items-center gap-2 mt-0.5 flex-wrap">
                                        <span className="text-ma-primary font-bold">{blog.user.name}</span>
                                        <span>•</span>
                                        <span>{blog.created_at}</span>
                                        {blog.location && (
                                            <>
                                                <span>•</span>
                                                <span className="text-ma-primary flex items-center gap-1 font-semibold bg-ma-primary/10 px-2 py-0.5 rounded-full border border-ma-primary/20">
                                                    <MapPin className="w-3 h-3" /> {blog.location}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Compact Cinematic Main Photo Viewer (Fits Above the Fold) */}
                        {mainImage && (
                            <div className="relative w-full h-[280px] sm:h-[360px] bg-black">
                                <Image
                                    src={`${BASE_URL}${mainImage}`}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* Thumbnail Gallery Strip */}
                        {blog.images && blog.images.length > 1 && (
                            <div className="flex items-center gap-2.5 px-4 py-3 bg-zinc-900/50 border-t border-white/5 overflow-x-auto">
                                {blog.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${selectedImageIndex === idx ? 'border-ma-primary scale-105 shadow-md ring-2 ring-ma-primary/30' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                                    >
                                        <Image src={`${BASE_URL}${img.url}`} alt="Thumbnail" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Story Content / Caption */}
                        <div className="p-5 sm:p-6 flex flex-col gap-5">
                            <div className="text-white/90 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: blog.caption_html.replace(
                                            /<strong class="text-\[#ffc49a\]">(.*?)<\/strong>/g,
                                            (_, gearName) => {
                                                const matchedProduct = blog.tagged_products.find(p => p.title.toLowerCase() === gearName.replace('@', '').toLowerCase());
                                                const productId = matchedProduct ? matchedProduct.id : '#';
                                                return `<a href="/product-details/${productId}" class="text-ma-primary font-bold hover:underline">${gearName}</a>`;
                                            }
                                        )
                                    }}
                                />
                            </div>

                            {/* Engagement Footer Bar */}
                            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <button
                                    onClick={handleLike}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl group transition-all hover:border-red-500/50 cursor-pointer"
                                >
                                    <Heart className={`w-4 h-4 transition-transform ${blog.is_liked ? 'fill-red-500 text-red-500 scale-125' : 'text-white/60 group-hover:text-red-500'}`} />
                                    <span className={`text-xs font-extrabold ${blog.is_liked ? 'text-red-500' : 'text-white'}`}>
                                        {blog.likes_count} Anglers Liked This
                                    </span>
                                </button>

                                {/* <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Link copied to clipboard!');
                                    }}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-xs font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
                                >
                                    <Share2 className="w-4 h-4 text-ma-primary" />
                                    <span>Share Report</span>
                                </button> */}
                            </div>


                        </div>

                    </div>
                </div>

                {/* Tagged Gear Sidebar (Right Side) */}
                <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
                    <div className="bg-zinc-950/60 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col gap-3.5">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                            <Tag className="w-4 h-4 text-ma-primary" />
                            <h3 className="font-black text-xs uppercase tracking-widest text-white">Tagged Tackle & Gear</h3>
                        </div>

                        {blog.tagged_products && blog.tagged_products.length > 0 ? (
                            <div className="flex flex-col gap-2.5">
                                {blog.tagged_products.map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => router.push(`/product-details/${product.id}`)}
                                        className="group bg-zinc-900/60 border border-white/10 hover:border-ma-primary rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all shadow-md hover:bg-zinc-900"
                                    >
                                        {/* <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                                            {product.image ? (
                                                <Image src={product.image} alt={product.title} fill className="object-contain p-1 group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[10px] text-white/50">Gear</div>
                                            )}
                                        </div> */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-extrabold text-white leading-tight truncate group-hover:text-ma-primary transition-colors">{product.title}</h4>
                                            <p className="text-xs font-black text-ma-primary mt-0.5">{numericConverter(product.price)}</p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-ma-primary flex-shrink-0 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-white/50 italic py-4 text-center">No specific equipment tagged for this catch report.</p>
                        )}
                    </div>
                </div>

            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Delete Catch Report</h3>
                                <p className="text-xs text-white/60 mt-0.5">This action cannot be undone. Are you sure you want to remove this post?</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(false)}
                                disabled={isDeleting}
                                className="px-5 py-2.5 bg-transparent border border-white/10 text-white/70 hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="px-6 py-2.5 bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
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