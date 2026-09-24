import React from 'react';
import { CustomPrimaryButton, SearchTextAdmin } from '@/components/ui';

type DashboardSectionHeaderProps = {
    title: string;
    addButtonText: string;
    onAddClick: () => void;
    isCreating: boolean;
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchPlaceholder?: string;
};

export const DashboardBrandCategoryHeader = ({
    title,
    addButtonText,
    onAddClick,
    isCreating,
    searchTerm,
    onSearchChange,
    searchPlaceholder = 'Search...',
}: DashboardSectionHeaderProps) => {
    return (
        <>
            {/* Title & Add Button Header */}
            <div className="flex flex-row items-center justify-between mb-2">
                <div className="flex items-center">
                    <span className="text-primaryColor text-2xl font-bold">#</span>
                    <h2 className="text-white text-xl font-bold tracking-tight">{title}</h2>
                </div>
                <CustomPrimaryButton
                    isSelected
                    onClick={onAddClick}
                    className="py-2 px-4"
                >
                    <span>+</span> {addButtonText}
                </CustomPrimaryButton>
            </div>

            {/* Search Bar (Hidden when creating) */}
            {!isCreating && (
                <div className="flex items-center text-base w-full">
                    <SearchTextAdmin
                        placeholderText={searchPlaceholder}
                        value={searchTerm}
                        onChange={onSearchChange}
                    />
                </div>
            )}
        </>
    );
};