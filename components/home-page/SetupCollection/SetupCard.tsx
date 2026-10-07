'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';
import { buildSetupDetailsPath } from '@/lib/api/setupService';
import { montserrat } from '@/types/fonts';
import { numericConverter } from '@/utils/priceUtils';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

interface SetupCardProps {
    setup: {
        setup_id: string | number;
        bundle_title?: string;
        slug?: string;
        description?: string;
        bundle_price: number;
        retail_price?: number;
        main_image?: {
            image_url?: string;
            url?: string;
        };
        items?: Array<{
            product?: {
                product_title?: string;
            };
        }>;
        inclusions?: Array<any>;
    };
    index?: number;
}

export default function SetupCard({ setup, index = 0 }: SetupCardProps) {
    const {
        bundle_title,
        slug,
        bundle_price,
        retail_price,
        main_image,
        items,
        inclusions
    } = setup;

    const imageUrl = main_image ? (main_image.image_url || main_image.url || '') : '';
    const price = bundle_price;
    const oldPrice = retail_price && retail_price > bundle_price ? retail_price : null;
    const savingsAmount = oldPrice ? oldPrice - price : 0;

    const resolvedImageUrl = imageUrl
        ? imageUrl.startsWith('http') || imageUrl.startsWith('blob:')
            ? imageUrl
            : `${baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
        : '';

    const detailHref = buildSetupDetailsPath(setup.setup_id as any, slug || bundle_title || '');

    const itemsList = items || [];
    const inclusionsList = inclusions || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
            className="h-full flex w-full"
        >
            <Link
                href={detailHref}
                className={`${montserrat.className} group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md cursor-pointer transition-all duration-300 hover:border-ma-primary/60 hover:bg-zinc-900/90 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-10px_rgba(232,147,71,0.25)] h-full w-full block`}
            >
                {/* Ambient glow on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ma-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />

                {/* Image Container */}
                <div className="relative w-full h-[260px] sm:h-[280px] overflow-hidden bg-black/50 flex items-center justify-center p-6">
                    <Image
                        src={resolvedImageUrl || '/logo.png'}
                        alt={bundle_title || 'Setup Bundle'}
                        fill
                        className="object-cover p-2 transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                        {index < 2 ? (
                            <span className="bg-ma-primary text-black text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                NEW
                            </span>
                        ) : (
                            <span />
                        )}

                        {oldPrice && savingsAmount > 0 && (
                            <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border border-red-500/30">
                                SAVE {numericConverter(String(savingsAmount))}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-5 sm:p-6 flex flex-col gap-3.5 flex-1 justify-between bg-gradient-to-t from-[#0B1015] to-transparent">
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-ma-primary text-xs font-bold uppercase tracking-[0.15em]">
                            <Layers className="w-4 h-4" />
                            <span>{itemsList.length} Essential Items Included</span>
                        </div>

                        <h3 className="text-white font-extrabold text-base sm:text-lg leading-snug uppercase tracking-wide group-hover:text-ma-primary transition-colors duration-200">
                            {bundle_title}
                        </h3>

                        {/* Items list preview */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {itemsList.map((item, idx: number) => (
                                <span key={idx} className="bg-white/5 border border-white/10 text-white/90 text-[11px] px-2.5 py-1 rounded-md font-medium">
                                    {item.product?.product_title || 'Item'}
                                </span>
                            ))}
                            {inclusionsList.length > 0 && (
                                <span className="inline-flex items-center gap-1.5 bg-ma-primary/15 border border-ma-primary/30 text-ma-primary text-[11px] px-2.5 py-1 rounded-md font-bold">
                                    <Sparkles className="w-3.5 h-3.5" /> Freebies Included
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Pricing & CTA Button */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-2">
                        <div>
                            <span className="text-[11px] text-white/60 uppercase font-bold tracking-wider block">Bundle Price</span>
                            <div className="flex items-baseline gap-2.5 mt-0.5">
                                <span className="text-ma-primary font-black text-lg sm:text-xl tracking-tight">
                                    {numericConverter(String(price))}
                                </span>
                                {oldPrice && (
                                    <span className="text-white/40 line-through text-xs font-semibold">
                                        {numericConverter(String(oldPrice))}
                                    </span>
                                )}
                            </div>
                        </div>

                        <span className="w-10 h-10 rounded-full bg-ma-primary text-black flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(232,147,71,0.4)]">
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}