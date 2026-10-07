'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import SetupCard from '@/components/home-page/SetupCollection/SetupCard';
import { ProductFilterBar, BrandCategoryPaginationButton } from '@/components/ui';
import {
    fetchGroupedSetups,
    filterAndSortSetups,
    paginateSetups,
    SetupListItem,
} from '@/lib/api/setupService';

function SkeletonSetupCard() {
    return (
        <div className="rounded-2xl border border-[#323537] bg-[#1d2022] overflow-hidden animate-pulse min-h-[320px] flex flex-col">
            <div className="w-full aspect-video bg-[#0b0f10]" />
            <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="h-4 w-3/4 rounded bg-[#363a3b]" />
                <div className="h-3 w-full rounded bg-[#323537]" />
                <div className="h-8 w-1/2 rounded bg-[#363a3b] mt-auto" />
            </div>
        </div>
    );
}

export default function SetupsClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get('category');

    const [allSetups, setAllSetups] = useState<SetupListItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [budget, setBudget] = useState('');
    const [sortOption, setSortOption] = useState('newest');

    const displayTitle = useMemo(() => {
        if (!categorySlug) return 'SETUPS & BUNDLES';
        const match = allSetups.find(
            (s) => s.categorySlug?.toLowerCase() === categorySlug.toLowerCase()
        );
        return (match?.categoryName || categorySlug.replaceAll('-', ' ')).toUpperCase();
    }, [categorySlug, allSetups]);

    const filteredSetups = useMemo(
        () =>
            filterAndSortSetups(allSetups, {
                search: searchQuery,
                maxBudget: budget,
                sort: sortOption,
                categorySlug,
            }),
        [allSetups, searchQuery, budget, sortOption, categorySlug]
    );

    const { items: pageSetups, lastPage, hasMore, currentPage: safePage, total } = useMemo(
        () => paginateSetups(filteredSetups, currentPage),
        [filteredSetups, currentPage]
    );

    const availableCategories = useMemo(() => {
        const map = new Map<string, string>();
        allSetups.forEach(s => {
            if (s.categorySlug && s.categoryName) {
                map.set(s.categorySlug, s.categoryName);
            }
        });
        return Array.from(map.entries()).map(([value, label]) => ({ label, value }));
    }, [allSetups]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setInitialLoading(true);
            const setups = await fetchGroupedSetups();
            if (!cancelled) {
                setAllSetups(setups ?? []);
                setInitialLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, budget, sortOption, categorySlug]);

    useEffect(() => {
        if (currentPage > lastPage) {
            setCurrentPage(lastPage);
        }
    }, [currentPage, lastPage]);

    const handlePageChange = useCallback((newPage: number) => {
        setLoading(true);
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setLoading(false), 200);
    }, []);

    return (
        <div className="min-h-screen px-4 sm:px-6 md:px-10 pb-16 pt-4 flex flex-col gap-2">
            <div className="flex flex-col gap-3 items-center justify-center pt-10 pb-8">
                <div className="px-4 py-1.5 rounded-full bg-[#131718] border border-[#272a2c] flex items-center gap-2 shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffc49a] animate-pulse"></div>
                    <p className="text-[10px] sm:text-xs font-bold text-[#a28d7e] uppercase tracking-widest">
                        BROWSE <span className="mx-1 text-[#5b6166]">/</span> {categorySlug ? 'SETUP CATEGORY' : 'SETUPS'}
                    </p>
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#ffffff] via-[#e0e3e5] to-[#a28d7e] uppercase leading-none tracking-tight text-center">
                    {displayTitle}
                </h1>
                {categorySlug && (
                    <Link
                        href="/setups"
                        className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#ffc49a] hover:text-[#ff9d4d] transition-colors border-b border-[#ffc49a]/30 hover:border-[#ff9d4d] pb-0.5"
                    >
                        View all setups
                    </Link>
                )}
            </div>

            <ProductFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                budget={budget}
                onBudgetChange={setBudget}
                sortOption={sortOption}
                onSortChange={setSortOption}
                productCount={total}
                currentPage={safePage}
                lastPage={lastPage}
                initialLoading={initialLoading}
                selectedDropdownValue={categorySlug || ""}
                onDropdownChange={(newCat) => {
                    if (newCat) {
                        router.push(`/setups?category=${newCat}`);
                    }
                }}
                dropdownOptions={availableCategories}
                dropdownPlaceholder="Select Setup Category"
            />

            {initialLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonSetupCard key={i} />
                    ))}
                </div>
            ) : pageSetups.length > 0 ? (
                <>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={safePage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {pageSetups.map((setup) => (
                                <SetupCard key={setup.setup_id} setup={setup} />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    <BrandCategoryPaginationButton
                        currentPage={safePage}
                        lastPage={lastPage}
                        hasMore={hasMore}
                        loading={loading}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-6 py-24 border-t border-[#272a2c]">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center border border-[#323537] bg-[#1d2022]">
                        <svg
                            className="w-9 h-9 text-[#ffc49a]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-black text-[#e0e3e5]">No Setups Found</h3>
                        <p className="text-sm text-[#a28d7e] mt-1">
                            Try adjusting your filters or check back later for new bundles.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="px-6 py-2.5 bg-[#ffc49a] text-[#4f2500] font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:bg-[#ff9d4d]"
                    >
                        Back to Home
                    </Link>
                </div>
            )}
        </div>
    );
}
