'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { inter } from '@/types/fonts';
import { SessionProps } from '@/types/sessionType';
import { logo } from '@/public';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const mainMenuItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { href: '/admin/dashboard/categories', label: 'Categories', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { href: '/admin/dashboard/products/product-add', label: 'Add Product', icon: 'M12 4v16m8-8H4' },
  { href: '/admin/dashboard/products', label: 'Inventory', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
  { href: '/admin/dashboard/setups/build-setup', label: 'Setups & Bundles', icon: 'M14.121 14.121L19 19m-7-7l-7-7m0 0l2.828-2.828M5 5l-2.828 2.828m0 0l7 7' },
];

const managementItems = [
  { href: '/admin/dashboard/orders', label: 'Orders', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
  { href: '/admin/dashboard/promotions-sales', label: 'Promotions & Sales', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 13C10.832 21 2 13.5 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 5-8.832 12.5-10 12.5z' },
  { href: '/admin/dashboard/reviews', label: 'Reviews', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { href: '/admin/dashboard/analytics', label: 'Analytics', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const renderLink = (item: any) => {
    const isActive =
      item.href === '/admin/dashboard'
        ? pathname === '/admin/dashboard'
        : item.href === '/admin/dashboard/products'
          ? pathname === item.href
          : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${isActive
          ? 'bg-primaryColor/20 text-primaryColor'
          : 'text-[#d9e3f4]/70 hover:text-white hover:bg-white/5'
          }`}
      >
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
        </svg>
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col z-50 bg-ma-surface-container/50 border-2 border-greyColor/20 ">
      {/* Logo */}
      <div className="px-3 py-4 border-b border-greyColor/20">
        <Link href="/" className="block">
          <div className="relative w-full aspect-[632/395]">
            <Image
              src={logo}
              alt="Smooth Casting Tackle Shop"
              fill
              sizes="232px"
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 scroller-hide flex flex-col gap-y-6 pt-4">
        {/* Core Operations */}
        <div>
          <h3 className={`${inter.className} text-xs font-semibold text-[#d9e3f4]/40 uppercase tracking-wider mb-3 px-4`}>
            Core Operations
          </h3>
          <nav className="flex flex-col gap-y-1">
            {mainMenuItems.map(renderLink)}
          </nav>
        </div>

        {/* Management */}
        <div>
          <h3 className={`${inter.className} text-xs font-semibold text-[#d9e3f4]/40 uppercase tracking-wider mb-3 px-4`}>
            Management
          </h3>
          <nav className="flex flex-col gap-y-1">
            {managementItems.map(renderLink)}
          </nav>
        </div>
      </div>

      {/* Bottom User Info */}
      <div className="p-4 mt-auto shrink-0 border-t border-greyColor/20 flex flex-col gap-y-4">
        <div className="flex items-center gap-x-3 px-2 py-2">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-gray-800 border border-white/10">
            {session?.user?.image ? (
              <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
            ) : (
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name || 'User'}&style=circle`} alt="User" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className={`${inter.className} text-sm font-semibold text-white truncate`}>
              {session?.user?.name || 'Loading...'}
            </span>
            <span className={`${inter.className} text-xs text-[#d9e3f4]/50 truncate capitalize`}>
              {session?.user?.role || (typeof session?.user?.role === 'string' ? session.user.role : 'Admin')}
            </span>
          </div>
          <button className="text-[#d9e3f4]/50 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}