'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Heart, User, ShoppingBag, ChevronRight } from "lucide-react";
import { fetchBlogs, BlogPost } from "@/lib/api/blogService";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function HomeBlogsSection() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                const response = await fetchBlogs(1);
                if (response && response.blogs) {
                    setBlogs(response.blogs);
                }
            } catch (err) {
                console.error("Failed to load homepage blogs:", err);
            } finally {
                setLoading(false);
            }
        };

        loadBlogs();
    }, []);

    if (!loading && blogs.length === 0) return null;

    const getImageUrl = (url?: string) => {
        if (!url) return '/logo.png';
        if (url.startsWith('http')) return url;
        const cleanBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        return `${cleanBase}${cleanPath}`;
    };

    return (
        <section className="w-full py-24 px-6 md:px-10 border-t border-[#272a2c] bg-[#0b0f10] relative overflow-hidden">

            {/* Ambient background glow matching your copper aesthetic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#ffc49a]/5 blur-[150px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto flex flex-col gap-14 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#272a2c] pb-8">
                    <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc49a]/10 border border-[#ffc49a]/20 w-fit">
                            <Sparkles className="w-3.5 h-3.5 text-[#ffc49a]" />
                            <span className="text-[#ffc49a] text-xs font-bold uppercase tracking-widest">
                                Community Feed
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-[900] text-[#e0e3e5] uppercase tracking-tight">
                            ANGLER <span className="text-[#ffc49a]">STORIES & CATCHES</span>
                        </h2>
                        <p className="text-sm text-[#a28d7e] max-w-xl">
                            Real catches, expert tips, and shop-the-look gear setups shared directly by our community.
                        </p>
                    </div>

                    <Link
                        href="/blogs"
                        className="group inline-flex items-center gap-2 text-sm font-bold text-[#ffc49a] uppercase tracking-wider hover:text-white transition-colors"
                    >
                        <span>Explore All Posts</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>
                </div>

                {/* Loading Grid Skeleton */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-lg border border-[#323537] bg-[#1d2022] overflow-hidden animate-pulse h-[460px]" />
                        ))}
                    </div>
                ) : (
                    /* Social-Card Style Grid matching your /blogs route aesthetic */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {blogs.slice(0, 3).map((blog, index) => {
                            const mainImage = blog.images?.find(img => img.is_main)?.url || blog.images?.[0]?.url;

                            return (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="h-full"
                                >
                                    <Link
                                        href={`/blogs/blog-details/${blog.id}`}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-[#323537] bg-[#14181a] cursor-pointer transition-all duration-300 hover:border-[#ffc49a] hover:shadow-[0_0_25px_-5px_rgba(255,196,154,0.15)] h-full"
                                    >
                                        <div>
                                            {/* Author Header */}
                                            <div className="p-4 flex items-center justify-between border-b border-[#222729] bg-[#191d20]">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#ffc49a]/20 border border-[#ffc49a]/40 flex items-center justify-center text-[#ffc49a] font-bold text-xs">
                                                        {blog.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-[#e0e3e5] uppercase">{blog.user.name}</span>
                                                        <span className="text-[10px] text-[#a28d7e]">{blog.created_at}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#ffc49a] bg-black/40 px-2.5 py-1 rounded-full border border-white/5">
                                                    <Heart className="w-3.5 h-3.5 fill-[#ffc49a]" />
                                                    <span>{blog.likes_count}</span>
                                                </div>
                                            </div>

                                            {/* Post Media Preview */}
                                            <div className="relative w-full h-64 overflow-hidden bg-[#0b0f10]">
                                                <Image
                                                    src={getImageUrl(mainImage)}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                {blog.images && blog.images.length > 1 && (
                                                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                                                        +{blog.images.length - 1} More Photos
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content / Title Snippet */}
                                            <div className="p-5 flex flex-col gap-3">
                                                <h3 className="text-[#e0e3e5] font-extrabold text-base uppercase leading-snug line-clamp-1 group-hover:text-[#ffc49a] transition-colors">
                                                    {blog.title}
                                                </h3>

                                                {/* Tagged Products Preview Count */}
                                                {blog.tagged_products && blog.tagged_products.length > 0 && (
                                                    <div className="flex items-center gap-1.5 text-xs text-[#a28d7e] bg-[#1d2022] px-3 py-1.5 rounded-md border border-[#323537] w-fit">
                                                        <ShoppingBag className="w-3.5 h-3.5 text-[#ffc49a]" />
                                                        <span>{blog.tagged_products.length} Gear Tagged</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Footer Action */}
                                        <div className="px-5 py-4 border-t border-[#222729] flex items-center justify-between text-xs font-bold text-[#ffc49a] uppercase tracking-wider bg-[#171b1e]">
                                            <span>View Full Catch Log</span>
                                            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

            </div>
        </section>
    );
}