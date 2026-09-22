import React from 'react';
import { Search } from 'lucide-react';

export type PromotionStatusTab = 'ALL' | 'ACTIVE' | 'SCHEDULED' | 'EXPIRED';

export interface PromotionFilterBarProps {
    activeTab: PromotionStatusTab;
    setActiveTab: (tab: PromotionStatusTab) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const PromotionFilterBar: React.FC<PromotionFilterBarProps> = ({
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
}) => {
    const tabs: { label: string; value: PromotionStatusTab }[] = [
        { label: 'All Promotions', value: 'ALL' },
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Scheduled', value: 'SCHEDULED' },
        { label: 'Expired', value: 'EXPIRED' },
    ];

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0D1216] p-3 rounded-xl border border-greyColor/20">
            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scroller-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-3.5 py-2 text-xs font-semibold rounded-lg uppercase transition-all whitespace-nowrap ${activeTab === tab.value
                                ? 'bg-primaryColor text-black font-bold shadow-md'
                                : 'text-[#d9e3f4]/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-[#d9e3f4]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search by campaign title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#141A1F] border border-greyColor/20 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-primaryColor transition-all placeholder:text-[#d9e3f4]/40"
                />
            </div>
        </div>
    );
};