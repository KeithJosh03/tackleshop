import React from 'react'


import { showBrand } from "@/lib/api/brandService";
import { DashboardCategoryClient,DashboardBrandClient } from '@/components';
import { CategoryHeader } from '@/lib/api/categoryService';

export default async function page() {
    const brandslist = await showBrand();
    const categorylist = await CategoryHeader();

    return (
    <div className='flex flex-col'>
        <div className='flex text-right'>
            <h1 className='text-primaryColor text-2xl font-extrabold'>PRODUCT CATEGORIES</h1>
        </div>
        <div className='flex flex-row space-x-4'>
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

