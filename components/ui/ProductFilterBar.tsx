import React from "react";
import { Search, ChevronDown, PhilippinePeso, SlidersHorizontal, PackageSearch } from "lucide-react";

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
    // Optional Generic Dropdown for Brand/Category/Setup
    dropdownOptions?: { label: string; value: string }[];
    selectedDropdownValue?: string;
    onDropdownChange?: (value: string) => void;
    dropdownPlaceholder?: string;
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
    dropdownOptions,
    selectedDropdownValue,
    onDropdownChange,
    dropdownPlaceholder = "Select Option",
}: ProductFilterBarProps) {
    return (
        <div className="flex flex-col gap-4 py-4 sm:py-6 mb-4 border-y border-[#272a2c]/50 bg-gradient-to-b from-[#0b0f10]/30 to-transparent backdrop-blur-md rounded-2xl sm:rounded-3xl px-4 sm:px-8 shadow-sm">
            <div className="flex flex-col xl:flex-row justify-between gap-4 sm:gap-6">

                {/* Left Side: Search, Dropdown, Budget */}
                <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto flex-1">

                    {/* Search Input */}
                    <div className="relative group w-full md:flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5b6166] group-focus-within:text-[#ffc49a] transition-colors">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full bg-[#131718] border border-[#272a2c] hover:border-[#323537] rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#e0e3e5] focus:outline-none focus:ring-2 focus:ring-[#ffc49a]/20 focus:border-[#ffc49a] transition-all placeholder:text-[#5b6166]"
                        />
                    </div>

                    {/* Wrapper for Dropdown & Budget */}
                    <div className="flex flex-col md:flex-row gap-3 w-full md:flex-[2]">
                        {/* Conditional Dropdown */}
                        {dropdownOptions && dropdownOptions.length > 0 && onDropdownChange && (
                            <div className="relative group flex-1 w-full">
                                <select
                                    value={selectedDropdownValue || ""}
                                    onChange={(e) => onDropdownChange(e.target.value)}
                                    className="w-full appearance-none bg-[#131718] border border-[#272a2c] hover:border-[#323537] rounded-xl pl-3 sm:pl-4 pr-8 py-2.5 sm:py-3 text-[11px] sm:text-sm text-[#e0e3e5] uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#ffc49a]/20 focus:border-[#ffc49a] transition-all cursor-pointer font-medium text-ellipsis overflow-hidden"
                                >
                                    <option value="" disabled className="bg-[#101415] text-[#5b6166]">{dropdownPlaceholder}</option>
                                    {dropdownOptions.map((opt, idx) => (
                                        <option key={idx} value={opt.value} className="bg-[#101415]">
                                            {opt.label.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#5b6166] group-focus-within:text-[#ffc49a] transition-colors">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        )}

                        {/* Max Budget Input */}
                        <div className="relative group flex-1 w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5b6166] group-focus-within:text-[#ffc49a] transition-colors">
                                <PhilippinePeso className="w-4 h-4" />
                            </div>
                            <input
                                type="number"
                                placeholder="Max Budget"
                                value={budget}
                                onChange={(e) => onBudgetChange(e.target.value)}
                                className="w-full bg-[#131718] border border-[#272a2c] hover:border-[#323537] rounded-xl pl-9 pr-3 py-2.5 sm:py-3 text-[11px] sm:text-sm text-[#e0e3e5] focus:outline-none focus:ring-2 focus:ring-[#ffc49a]/20 focus:border-[#ffc49a] transition-all placeholder:text-[#5b6166]"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: Sort By */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between xl:justify-end gap-3 w-full xl:w-auto border-t xl:border-t-0 border-[#272a2c]/50 pt-4 xl:pt-0">
                    <div className="flex items-center gap-2 text-[#a28d7e]">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="uppercase text-[11px] font-bold tracking-widest">Sort by:</span>
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <select
                            value={sortOption}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="w-full sm:w-auto appearance-none bg-[#131718] sm:bg-transparent hover:bg-[#131718] border border-[#272a2c] sm:border-transparent hover:border-[#272a2c] rounded-lg pl-3 pr-8 py-2.5 sm:py-2 outline-none cursor-pointer uppercase tracking-wider text-[#e0e3e5] text-[11px] sm:text-sm font-semibold transition-all focus:ring-2 focus:ring-[#ffc49a]/20"
                        >
                            <option value="newest" className="bg-[#101415]">Newest Arrivals</option>
                            <option value="price_low" className="bg-[#101415]">Price: Low to High</option>
                            <option value="price_high" className="bg-[#101415]">Price: High to Low</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#5b6166]">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Count Badge */}
            <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto">
                <div className="inline-flex items-center justify-center w-full sm:w-auto gap-2 bg-[#ffc49a]/10 border border-[#ffc49a]/20 px-4 py-2 rounded-lg text-[#ffc49a] text-[10px] sm:text-xs font-bold tracking-wider">
                    <PackageSearch className="w-3.5 h-3.5" />
                    {!initialLoading ? `${productCount} ITEMS FOUND (PAGE ${currentPage}/${lastPage})` : 'LOADING...'}
                </div>
            </div>
        </div>
    );
}