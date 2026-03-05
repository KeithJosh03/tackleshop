'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

export default function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className='w-full bg-blackgroundColor border border-greyColor rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-y-4 font-sans'>
      <div className='flex items-center'>
        <h1 className='text-primaryColor font-bold tracking-tight text-xl'>ADMIN DASHBOARD</h1>
      </div>
      <nav className='flex flex-row items-center gap-2 p-1 bg-secondary/10 border border-greyColor/30 rounded-lg overflow-x-auto scroller-hide'>
        <Link
          href='/admin/dashboard/category'
          className={`flex-1 min-w-[160px] text-center px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${pathname.includes('/category')
            ? 'bg-primaryColor text-white shadow-md'
            : 'text-secondary hover:text-primaryColor hover:bg-secondary/5'
            }`}
        >
          PRODUCT CATEGORIES
        </Link>
        <Link
          href='/admin/dashboard/addproduct/'
          className={`flex-1 min-w-[160px] text-center px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${pathname.includes('/addproduct')
            ? 'bg-primaryColor text-white shadow-md'
            : 'text-secondary hover:text-primaryColor hover:bg-secondary/5'
            }`}
        >
          ADD PRODUCT
        </Link>
        <Link
          href='/admin/dashboard/productlist/'
          className={`flex-1 min-w-[160px] text-center px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${pathname.includes('/productlist')
            ? 'bg-primaryColor text-white shadow-md'
            : 'text-secondary hover:text-primaryColor hover:bg-secondary/5'
            }`}
        >
          PRODUCT LIST
        </Link>
        <Link
          href='/admin/dashboard/addsetup/'
          className={`flex-1 min-w-[160px] text-center px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${pathname.includes('/addsetup')
            ? 'bg-primaryColor text-white shadow-md'
            : 'text-secondary hover:text-primaryColor hover:bg-secondary/5'
            }`}
        >
          ADD SETUP
        </Link>
      </nav>
    </header>
  )
}
