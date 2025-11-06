import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'; 

export default function DashboardHeader() {
  const pathname = usePathname(); 

  return (
    <header className='basis-1/5 border border-greyColor rounded p-4 flex flex-col h-fit'>
      <div className='flex flex-row'>
        <h1 className='text-primaryColor font-extrabold text-2xl'>ADMIN</h1>
      </div>
      <div className='flex flex-col gap-y-1 font-extrabold text-base text-primaryColor bg-secondary rounded'>
        <Link href='/admin/dashboard/productcategory'>
          <div
            className={`hover:text-tertiaryColor p-2 rounded ${
              pathname === '/admin/dashboard/productcategory' ? 'bg-primaryColor text-white' : ''
            }`}
          >
            PRODUCT CATEGORIES
          </div>
        </Link>
        <Link href='/admin/dashboard/productadd/'>
        <div 
          className={`hover:text-tertiaryColor p-2 rounded ${
              pathname === '/admin/dashboard/products/addproduct' ? 'bg-primaryColor text-white' : ''
            }`}
        >PRODUCT ADD</div>
        </Link>
        <Link href='/admin/dashboard/productview/'>
          <div className={`hover:text-tertiaryColor p-2 rounded ${
                pathname === '/admin/dashboard/productview' ? 'bg-primaryColor text-white' : ''
              }`}
          >PRODUCT VIEW
          </div>
        </Link>
      </div>
    </header>
  )
}
