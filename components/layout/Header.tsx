'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import slugify from 'slugify';

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
      <nav className={`${worksans.className} overflow-visible text-primaryColor grid grid-cols-3 place-items-center content-between bg-mainBackgroundColor px-6 md:px-14`}>
        
        {/* Left column */}
        {isHome ? (
          <SearchBar />
        ) : (
          <div className="col-span-1"></div>
        )}

        {/* Logo & Nav */}
        <div className="col-span-1 flex flex-col items-center text-center">
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

          {/* Desktop Nav */}
          {isHome && (
            <div className="hidden md:grid grid-cols-4 text-md font-extrabold w-full container whitespace-nowrap">
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
                        href={`/category/${categoryName.toLowerCase()}`}
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

          {!isHome ? (
            <SearchBar />
          ) : (
            <div className="col-span-1"></div>
          )}
        </div>
      </nav>
    </header>
  );
}
