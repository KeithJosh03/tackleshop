'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { inter } from '@/types/fonts';

export default function DashboardHeader() {
  const pathname = usePathname();

  // Basic breadcrumbs based on pathname
  const pathParts = pathname.split('/').filter(Boolean);

  return (
    <header className='w-full bg-[#0A0E0F] border-b border-greyColor/20 py-4 px-8 flex items-center justify-between sticky top-0 z-40'>
      {/* ── Left: Breadcrumbs ── */}
      <div className={`${inter.className} flex items-center gap-2 text-[13px]`}>
        {pathParts.map((part, index) => {
          const isLast = index === pathParts.length - 1;
          const name = part.charAt(0).toUpperCase() + part.slice(1);
          return (
            <React.Fragment key={part}>
              <span className={isLast ? 'text-primaryColor font-semibold' : 'text-[#d9e3f4]/70'}>
                {name}
              </span>
              {!isLast && <span className="text-[#d9e3f4]/40 mx-1">{'>'}</span>}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Right: Search & Icons ── */}
      <div className='flex items-center gap-x-6 shrink-0'>
        <div className="flex items-center gap-x-4">
          <button className='text-[#d9e3f4]/70 hover:text-white transition-colors' title='Notifications'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
            </svg>
          </button>

          <button className='text-[#d9e3f4]/70 hover:text-white transition-colors' title='Help'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
