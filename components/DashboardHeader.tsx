'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin/dashboard/categories', label: 'Categories' },
  { href: '/admin/dashboard/products/add', label: 'Add Product' },
  { href: '/admin/dashboard/products', label: 'Product List' },
  { href: '/admin/dashboard/setups', label: 'Setups' },
  { href: '/admin/dashboard/reviews', label: 'Reviews' },
];

export default function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className='w-full bg-blackgroundColor border border-greyColor rounded-xl shadow-sm p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-y-4 font-sans'>
      <div className='flex items-center'>
        <h1 className='text-primaryColor font-bold tracking-tight text-xl'>ADMIN DASHBOARD</h1>
      </div>
      <nav className='flex flex-row items-center gap-1.5 p-1 bg-secondary/10 border border-greyColor/30 rounded-lg overflow-x-auto scroller-hide'>
        {navItems.map((item) => {
          // Exact match for products list to avoid bleeding into /products/add or /products/[id]
          const isActive = item.href === '/admin/dashboard/products'
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 min-w-[130px] text-center px-4 py-2.5 rounded-md text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${isActive
                  ? 'bg-primaryColor text-white shadow-md scale-[1.02]'
                  : 'text-secondary hover:text-primaryColor hover:bg-secondary/5 hover:scale-[1.02]'
                }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
