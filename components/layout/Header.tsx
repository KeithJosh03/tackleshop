'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import slugify from 'slugify';
import CustomButton from '@/components/CustomButton';

import {
  BrandProps,
  CategoryProps
} from '@/types/dataprops';

import { imagesAsset } from '@/types/image';
import { worksans } from '@/types/fonts';
import SearchBar from './SearchBar';

interface HeaderBrandTest {
  status: boolean;
  brands: BrandProps[];
}

interface HeaderCategoryTest {
  status: boolean;
  categories: CategoryProps[];
}

export default function Header() {
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) return;
  }, [isHome]);

  useEffect(() => {
    axios.get<HeaderBrandTest>('/api/brands/headerbrand/')
      .then(res => setBrands(res.data.brands))
      .catch(err => console.log(err));

    axios.get<HeaderCategoryTest>('/api/categories')
      .then(res => setCategories(res.data.categories))
      .catch(err => console.log(err));
  }, []);

  return (
    <header className="top-0 sticky w-full z-[999]">
      <nav className={`${worksans.className} overflow-visible text-primaryColor bg-blackgroundColor border-b border-greyColor px-4 md:px-14`}>
        {/* Top bar */}
        <div className="grid grid-cols-3 items-center">
          {/* Burger (mobile only) */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-md hover:bg-primaryColor/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Search (left on xl, full row below on mobile when home) */}
          {isHome ? (
            <div className="hidden md:block">
              <SearchBar />
            </div>
          ) : (
            <div className="hidden md:block"></div>
          )}

          {/* Logo center */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-40 h-20 md:w-72 md:h-36 self-center">
              <Link href="/">
                <Image
                  src={imagesAsset.logo}
                  fill={true}
                  alt="Logo"
                  className="object-fill"
                />
              </Link>
            </div>
          </div>

          {/* Message button right */}
          <div className="flex justify-end items-center">
            <CustomButton
            text='MESSAGE US'
            onClick={() => console.log('Message US')}
            />
          </div>
        </div>

        {/* Search full-width below top bar on mobile and when not home on desktop */}
        <div className="md:hidden mt-2">
          {isHome ? <SearchBar /> : null}
        </div>

        {/* Desktop Nav */}
        {isHome && (
          <div className="hidden md:flex items-center justify-center gap-4 text-md font-extrabold w-full whitespace-nowrap mt-2">
            <span className="nav-link">
              <Link href="/newarrival">NEW ARRIVALS</Link>
            </span>

            <span className="nav-link relative group cursor-pointer">
              <button>BRANDS</button>
              <div className="nav-drop">
                <ul className="flex flex-col items-start gap-y-1 px-4 py-2 bg-blackgroundColor">
                  {brands?.map(({ brandName, brandId }) => (
                    <Link
                      className="nav-drop-list"
                      href={`/brand/${slugify(brandName).toLowerCase()}`}
                      key={brandId}
                    >
                      <li>{brandName}</li>
                    </Link>
                  ))}
                </ul>
              </div>
            </span>

            <span className="nav-link relative group">
              <button>CATEGORIES</button>
              <div className="nav-drop">
                <ul className="flex flex-col items-start gap-y-1 px-4 py-2 bg-blackgroundColor">
                  {categories.map(({ categoryName, categoryId }) => (
                    <Link
                      className="nav-drop-list flex-1"
                      href={`/category/${slugify(categoryName).toLowerCase()}`}
                      key={categoryId}
                    >
                      <li>{categoryName}</li>
                    </Link>
                  ))}
                </ul>
              </div>
            </span>

            <span className="nav-link relative group">
              <Link href="/category/apparel">APPAREL</Link>
            </span>
          </div>
        )}

        {/* Mobile Drawer */}
        <div className={`${menuOpen ? 'fixed' : 'hidden'} inset-0 z-[1000]`}> 
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className={`absolute left-0 top-0 h-full w-72 bg-mainBackgroundColor text-primaryColor p-4 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold">Menu</span>
              <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="p-2 rounded-md hover:bg-primaryColor/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-2 text-md font-extrabold">
              <Link href="/newarrival" onClick={() => setMenuOpen(false)} className="nav-link">NEW ARRIVALS</Link>
              <div>
                <div className="px-3 py-2 font-bold">BRANDS</div>
                <ul className="max-h-56 overflow-y-auto">
                  {brands?.map(({ brandName, brandId }) => (
                    <Link
                      className="nav-drop-list"
                      href={`/brand/${slugify(brandName).toLowerCase()}`}
                      key={brandId}
                      onClick={() => setMenuOpen(false)}
                    >
                      <li>{brandName}</li>
                    </Link>
                  ))}
                </ul>
              </div>
              <div>
                <div className="px-3 py-2 font-bold">CATEGORIES</div>
                <ul className="max-h-56 overflow-y-auto">
                  {categories.map(({ categoryName, categoryId }) => (
                    <Link
                      className="nav-drop-list"
                      href={`/category/${slugify(categoryName).toLowerCase()}`}
                      key={categoryId}
                      onClick={() => setMenuOpen(false)}
                    >
                      <li>{categoryName}</li>
                    </Link>
                  ))}
                </ul>
              </div>
              <Link href="/category/apparel" onClick={() => setMenuOpen(false)} className="nav-link">APPAREL</Link>
            </nav>
          </div>
        </div>
      </nav>
    </header>
  );
}
