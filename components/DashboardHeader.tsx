'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'; 

export default function DashboardHeader() {
  const pathname = usePathname(); 

  return (
    <header className='flex-1 border border-greyColor rounded p-4 w-full flex flex-col bg-blackgroundColor'>
      <div className='flex flex-row'>
        <h1 className='text-primaryColor font-extrabold text-2xl'>ADMIN</h1>
      </div>
      <div className='flex flex-row items-center justify-items-center gap-y-2 font-extrabold text-base text-primaryColor bg-secondary rounded'>
        <Link 
        className='flex-1'
        href='/admin//dashboard/category'
        >
          <div
            className={`text-center hover:text-tertiaryColor p-2 rounded ${
              pathname === '/admin/dashboard/category' ? 'bg-primaryColor text-white' : ''
            }`}
          >
            PRODUCT CATEGORIES
          </div>
        </Link>
        <Link 
        href='/admin/dashboard/addproduct/'
        className='flex-1'
        >
        <div 
          className={`text-center hover:text-tertiaryColor p-2 rounded ${
              pathname === '/admin/dashboard/addproduct' ? 'bg-primaryColor text-white' : ''
            }`}
        >ADD PRODUCT</div>
        </Link>
        <Link 
        className='flex-1'
        href='/admin/dashboard/productlist/'
        >
          <div className={`text-center hover:text-tertiaryColor p-2 rounded ${
                pathname === '/admin/dashboard/productlist' ? 'bg-primaryColor text-white' : ''
              }`}
          >PRODUCT LIST
          </div>
        </Link>
      </div>
    </header>
  )
}
