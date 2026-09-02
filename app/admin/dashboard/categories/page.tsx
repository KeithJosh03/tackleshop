import React from 'react'


import { BrandLogos } from "@/lib/api/brandService";
import { DashboardBrandClient, DashboardCategoryClient } from '@/components';
import { categoryList } from '@/lib/api/categoryService';

export default async function page() {
    const [brandslist, categorylist] = await Promise.all([
        BrandLogos(),
        categoryList()
    ]);

    return (
        <div className='flex flex-col space-y-6'>
            <div className='flex flex-col'>
                <h1 className='text-primaryColor text-2xl font-extrabold'>PRODUCT CATEGORIES</h1>
                <p className='text-secondary text-sm mt-1'>Manage your brands, categories, and subcategories here.</p>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
                <div className="w-full h-full">
                    <DashboardBrandClient
                        brandslist={brandslist}
                    />
                </div>
                <div className="lg:col-span-2 w-full h-full">
                    <DashboardCategoryClient
                        categorylist={categorylist}
                    />
                </div>
            </div>
        </div>
    )
}

