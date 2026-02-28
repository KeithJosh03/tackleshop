import React from 'react'


import { showBrandListName } from "@/lib/api/brandService";
import { DashboardCategoryClient, DashboardBrandClient } from '@/components';
import { CategoryList } from '@/lib/api/categoryService';

export default async function page() {
    const brandslist = await showBrandListName();
    const categorylist = await CategoryList();

    return (
        <div className='flex flex-col space-y-6'>
            <div className='flex flex-col'>
                <h1 className='text-primaryColor text-2xl font-extrabold'>PRODUCT CATEGORIES</h1>
                <p className='text-secondary text-sm mt-1'>Manage your brands, categories, and subcategories here.</p>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
                <DashboardBrandClient
                    brandslist={brandslist}
                />
                <DashboardCategoryClient
                    categorylist={categorylist}
                />
            </div>
        </div>
    )
}

