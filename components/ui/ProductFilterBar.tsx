import React from "react";

interface ProductFilterBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    budget: string;
    onBudgetChange: (value: string) => void;
    sortOption: string;
    onSortChange: (value: string) => void;
    productCount: number;
    currentPage: number;
    lastPage: number;
    initialLoading: boolean;
}

export default function ProductFilterBar({
    searchQuery,
    onSearchChange,
    budget,
    onBudgetChange,
    sortOption,
    onSortChange,
    productCount,
    currentPage,
    lastPage,
    initialLoading,
}: ProductFilterBarProps) {
    return (
        <div className="flex flex-col gap-4 py-4 border-b border-[#272a2c]">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full bg-[#101415] border border-[#323537] rounded-md px-4 py-2 text-sm text-[#e0e3e5] focus:outline-none focus:border-[#ffc49a] transition-colors"
                        />
                    </div>
                    <div className="relative w-full sm:w-48 flex items-center">
                        <span className="absolute left-3 text-[#a28d7e] text-sm">₱</span>
                        <input
                            type="number"
                            placeholder="Max Budget"
                            value={budget}
                            onChange={(e) => onBudgetChange(e.target.value)}
                            className="w-full bg-[#101415] border border-[#323537] rounded-md pl-8 pr-4 py-2 text-sm text-[#e0e3e5] focus:outline-none focus:border-[#ffc49a] transition-colors"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#e0e3e5] font-bold w-full sm:w-auto justify-end">
                    <span className="text-[#a28d7e] uppercase text-xs tracking-wider">Sort by:</span>
                    <select
                        value={sortOption}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="bg-transparent border-none outline-none cursor-pointer uppercase tracking-wider text-[#e0e3e5]"
                    >
                        <option value="newest" className="bg-[#101415]">Newest Arrivals</option>
                        <option value="price_low" className="bg-[#101415]">Price: Low to High</option>
                        <option value="price_high" className="bg-[#101415]">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <p className="text-sm text-[#a28d7e] font-semibold">
                {!initialLoading ? `${productCount} products - Page ${currentPage} of ${lastPage}` : 'Loading...'}
            </p>
        </div>
    );
}