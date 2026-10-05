'use client';

import React, { useEffect, useState } from 'react';
import SetupCard from './SetupCard';
import { Layers, Loader2 } from 'lucide-react';

export default function SetupCollection() {
    const [categories, setCategories] = useState<any[]>([]);
    const [uncategorized, setUncategorized] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSetups = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/setups-grouped`);
                const json = await res.json();
                if (json.status && json.data) {
                    setCategories(json.data.categories || []);
                    setUncategorized(json.data.uncategorized || []);
                }
            } catch (err) {
                console.error("Failed to fetch setups", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSetups();
    }, []);

    if (isLoading) {
        return (
            <section className="w-full py-16 bg-[#0d131a] flex justify-center">
                <Loader2 className="w-8 h-8 text-primaryColor animate-spin" />
            </section>
        );
    }

    // Filter out categories that have no setups
    const activeCategories = categories.filter(c => c.setups && c.setups.length > 0);
    const hasAnySetups = activeCategories.length > 0 || uncategorized.length > 0;

    if (!hasAnySetups) {
        return null; // Hide the section completely if no setups exist
    }

    return (
        <section className="w-full py-16 bg-[#0d131a] border-t border-greyColor/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <div className="flex flex-col items-center justify-center text-center mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <Layers className="w-6 h-6 text-primaryColor" />
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                            Curated <span className="text-primaryColor">Setups</span>
                        </h2>
                    </div>
                    <p className="text-sm md:text-base text-[#788ca5] max-w-2xl">
                        Expertly assembled bundles to give you the perfect balance and performance for your next fishing trip, completely hassle-free.
                    </p>
                </div>

                <div className="space-y-16">
                    {activeCategories.map(category => (
                        <div key={category.id}>
                            <h3 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-3">
                                {category.name}
                                <div className="h-[1px] bg-greyColor/20 flex-1"></div>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {category.setups.map((setup: any) => (
                                    <SetupCard key={setup.setup_id} setup={setup} />
                                ))}
                            </div>
                        </div>
                    ))}

                    {uncategorized.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-3">
                                Special Bundles
                                <div className="h-[1px] bg-greyColor/20 flex-1"></div>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {uncategorized.map((setup: any) => (
                                    <SetupCard key={setup.setup_id} setup={setup} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
