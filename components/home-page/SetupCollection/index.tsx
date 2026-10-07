'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SetupCard from './SetupCard';
import { Layers, Loader2, ArrowRight } from 'lucide-react';
import { montserrat } from '@/types/fonts';

export default function SetupCollection() {
    const [categories, setCategories] = useState<any[]>([]);
    const [uncategorized, setUncategorized] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(
                    `${(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')}/api/setups-grouped`
                );
                const json = await res.json();
                if (json.status && json.data) {
                    setCategories(json.data.categories || []);
                    setUncategorized(json.data.uncategorized || []);
                }
            } catch (err) {
                console.error('Failed to fetch setups', err);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, []);

    if (isLoading) {
        return (
            <section className="w-full py-20 bg-ma-background flex justify-center items-center">
                <Loader2 className="w-8 h-8 text-ma-primary animate-spin" />
            </section>
        );
    }

    const activeCategories = categories.filter(c => c.setups && c.setups.length > 0);
    const hasAnySetups = activeCategories.length > 0 || uncategorized.length > 0;

    if (!hasAnySetups) {
        return null;
    }

    return (
        <section className={`${montserrat.className} w-full py-16 lg:py-24 border-t border-white/5 bg-ma-background relative overflow-hidden`}>

            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-ma-primary/10 blur-[140px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ma-primary/15 border border-ma-primary/30 mb-3 shadow-sm">
                        <Layers className="w-4 h-4 text-ma-primary" />
                        <span className="text-ma-primary text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em]">
                            Bundle Packages
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
                        CURATED <span className="text-ma-primary">SETUPS</span>
                    </h2>
                    <div className="mt-3 h-[2px] w-12 bg-ma-primary/70 rounded-full" />
                    <p className="text-xs sm:text-sm text-white/80 max-w-xl mt-3 leading-relaxed font-medium">
                        Expertly assembled bundles to give you the perfect balance and performance for your next fishing trip, completely hassle-free.
                    </p>
                </div>

                {/* Categories & Setups Lists */}
                <div className="space-y-16">
                    {activeCategories.map(category => (
                        <div key={category.id} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-base md:text-lg font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-ma-primary shadow-[0_0_8px_rgba(232,147,71,0.6)]"></span>
                                    <span className="text-white font-bold">{category.name}</span>
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-ma-primary/30 via-white/10 to-transparent"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.setups.slice(0, 6).map((setup: any, idx: number) => (
                                    <SetupCard key={setup.setup_id || idx} setup={setup} index={idx} />
                                ))}
                            </div>
                        </div>
                    ))}

                    {uncategorized.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-base md:text-lg font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-ma-primary shadow-[0_0_8px_rgba(232,147,71,0.6)]"></span>
                                    <span className="text-white font-bold">Special Bundles</span>
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-ma-primary/30 via-white/10 to-transparent"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {uncategorized.slice(0, 6).map((setup: any, idx: number) => (
                                    <SetupCard key={setup.setup_id || idx} setup={setup} index={idx} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-16 flex justify-center">
                    <Link
                        href="/setups"
                        className="group inline-flex items-center gap-x-3 rounded-full border border-ma-primary/30 bg-black/50 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-ma-primary backdrop-blur-md transition-all duration-300 hover:border-ma-primary hover:bg-ma-primary hover:text-black hover:shadow-[0_0_25px_-4px_rgba(232,147,71,0.5)] cursor-pointer"
                    >
                        <span>SHOW ALL SETUPS</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>
                </div>

            </div>
        </section>
    );
}