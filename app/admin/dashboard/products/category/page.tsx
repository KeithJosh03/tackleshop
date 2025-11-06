import React from 'react'
import DashboardBrand from '@/app/admin/components/DashboardBrand';
import DashboardCategory from '@/app/admin/components/DashboardCategory';

export default function page() {
    return (
    <div className='flex flex-col'>
        <div className='flex text-right'>
        <h1 className='text-primaryColor text-2xl font-extrabold'>PRODUCT CATEGORIES</h1>
        </div>
        <div className='flex flex-row space-x-4'>
            <DashboardBrand />
            <DashboardCategory />
        </div>
    </div>      
    )
}

