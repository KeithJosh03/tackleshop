'use client';
import React from 'react'

import Image from 'next/image'
import { useState } from 'react'

import { imagelogo } from '@/utils/image'

import { Inter } from 'next/font/google'
import Link from 'next/link';
 
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
 


function NavBar() {
  const [category, setCategory] = useState('');

  const chooseCategory = (cate) => setCategory(category === cate ? '' : cate);

  return (
  <nav className={`${inter.className} primaryTextColor border-b border-[#3A3C3C]`}>
    <div className="mx-auto container px-2">
      <div className="flex h-20 items-center justify-between">
        <div className="flex items-center">
          <div className="relative w-46 h-20">
            <Link href='/'>
              <Image 
              src={imagelogo.image}
              fill={true}
              alt='Logo'
              className='object-fill'
              />
            </Link>
          </div>
          <div className="ml-10 flex items-baseline space-x-4 relative">
              <Link href='/newarrival'>
                <span className="rounded-md px-3 py-2 text-sm font-extrabold hover:bg-[#E89347] hover:text-white cursor-pointer">
                New Arrivals
                </span>
              </Link>
              <div className='relative'>
                <span className="rounded-md px-3 py-2 text-sm font-extrabold hover:bg-[#E89347] hover:text-white cursor-pointer"
                onClick={() => chooseCategory('Brands')}
                >
                Brands
                </span>
                <ul className={`${'Brands' == category ? 'block' : 'hidden'} absolute left-0 mt-2 w-56 rounded-md bg-[#252728] shadow-lg ring-1 ring-black ring-opacity-5 z-50`}>
                  <Link href='/brands/Shimano'>
                    <li className="px-4 py-2 font-bold text-sm text-white hover:bg-[#E89347] cursor-pointer">
                      Shimano
                    </li>
                  </Link>
                  <Link href='/brands/Daiwa'>
                    <li className="px-4 py-2 font-bold text-sm text-white hover:bg-[#E89347] cursor-pointer">
                      Daiwa
                    </li>
                  </Link>
                  <Link href='/brands/AbuGarcia'>
                    <li className="px-4 py-2 font-bold text-sm text-white hover:bg-[#E89347] cursor-pointer">
                      Abu Garcia
                    </li>
                  </Link>
                  <Link href='/brands/Penn'>
                    <li className="px-4 py-2 font-bold text-sm text-white hover:bg-[#E89347] cursor-pointer">
                      Penn
                    </li>
                  </Link>
                  <Link href='/brands/Rapala'>
                    <li className="px-4 py-2 font-bold text-sm text-white hover:bg-[#E89347] cursor-pointer">
                      Rapala
                    </li>
                  </Link>
                </ul>
              </div>
              <div className="relative delay-150">
                <span className="rounded-md px-3 py-2 text-sm font-extrabold hover:bg-[#E89347] hover:text-white cursor-pointer"
                onClick={() => chooseCategory('Categories')}
                >
                Categories
                </span>
                <ul className={`${'Categories' == category ? 'block' : 'hidden'} absolute left-0 mt-2 w-56 rounded-md bg-[#252728] shadow-lg ring-1 ring-black ring-opacity-5 z-50`}>
                  <Link href='/product-category/FishingRod'>
                    <li className="px-4 py-2 font-bold text-sm text-white hover:bg-[#E89347] cursor-pointer">
                      Fishing Rod
                    </li>
                  </Link>
                  <Link href='/product-category/SoftBait'>
                  <li className="px-4 py-2 font-bold text-sm text-white hover:bg-[#E89347] cursor-pointer">
                    Soft Bait
                  </li>
                  </Link>
                  <Link href='/product-category/Reels'>
                    <li className="px-4 py-2 font-bold text-sm text-white hover:bg-[#E89347] cursor-pointer">
                      Reels
                    </li>
                  </Link>
                </ul>
              </div>
              <div className='relative'>
                <span className="rounded-md px-3 py-2 text-sm font-extrabold hover:bg-[#E89347] hover:text-white cursor-pointer"
                onClick={() => chooseCategory('Apparel')}
                >
                  Apparel
                </span>
              </div>
            </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <input
          placeholder='Search'
          type="text"
          className="block w-full rounded-md bg-[#E89347] px-3 py-1.5 text-base text-white placeholder:text-white outline-0"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeLinecap="1.5"stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>
      </div>
    </div>
  </nav>

  )
}

export default NavBar

