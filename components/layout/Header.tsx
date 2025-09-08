'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BrandProps, CategoryProps, ProductProps } from '@/types/dataprops';
import { imagesAsset } from '@/types/image';
import { worksans } from '@/types/fonts';

export default function Header() {
  const [productSearched, setproductSearch] = useState<ProductProps[]>([]);
  const [search, setSearch] = useState<string>('');
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);

  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) {
    return;
    }
  }, [isHome]);

  useEffect(() => {
    axios.get('/api/brands')
      .then(res => setBrands(res.data.brands))
      .catch(err => console.log(err));

    axios.get('/api/categories')
      .then(res => setCategories(res.data.categories))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (!search || search.length === 0) {
      setproductSearch([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      axios.get(`/api/products/productsearch/${search}`)
        .then(res => setproductSearch(res.data.products))
        .catch(err => console.error(err));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <header className="top-0 sticky w-full z-999">
      <nav className={`${worksans.className} overflow-visible text-primaryColor grid grid-cols-3 place-items-center content-between bg-mainBackgroundColor px-14`}>
        {isHome ? (
          <div className="col-span-1 relative max-w-md self-center text-primaryColor flex flex-col text-base font-bold">
            <div>
              <label className="absolute -top-3 left-3 px-1 text-sm bg-mainBackgroundColor">
                Search
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="w-full rounded-md border border-katulo bg-transparent px-3 py-2 placeholder-katulo focus:border-primaryColor focus:outline-none"
              />
            </div>
            <div className="relative bg-secondary overflow-visible z-10">
              {productSearched.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-katulo text-tertiaryColor rounded-b-md text-sm z-20 px-2">
                  {productSearched.map((productsearch) => (
                    <h1 key={productsearch.product_id} className="p-2 hover:text-primaryColor">
                      <Link href={`/product/${productsearch.product_name.replace(/ /g, '-').toLowerCase()}`}>
                        {productsearch.product_name}
                      </Link>
                    </h1>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="col-span-1"></div>
        )}

        <div className="col-span-1 flex flex-col items-center text-center">
          <div className="relative w-72 h-36 self-center">
            <Link href="/">
              <Image
                src={imagesAsset.logo}
                fill={true}
                alt="Logo"
                className="object-fill"
              />
            </Link>
          </div>

          {isHome && (
            <div className="grid grid-cols-4 text-md font-extrabold w-full container whitespace-nowrap">
              <span className="nav-link">
                <Link href="/newarrival">
                  NEW ARRIVALS
                </Link>
              </span>
              <span className="nav-link relative group cursor-pointer">
                <button>BRANDS</button>
                <div className="nav-drop">
                  <ul className="flex flex-col items-center gap-y-1 px-4 py-2">
                    {brands.map((brand) => (
                      <Link
                        className="hover:text-primaryColor"
                        href={`/brands/${brand.brand_name}`}
                        key={brand.brand_id}
                      >
                        <li>{brand.brand_name}</li>
                      </Link>
                    ))}
                  </ul>
                </div>
              </span>
              <span className="nav-link relative group">
                <button>CATEGORIES</button>
                <div className="nav-drop">
                  <ul className="flex flex-col items-center gap-y-1 px-4 py-2">
                    {categories.map((category) => (
                      <Link
                        className="hover:text-primaryColor"
                        href={`/category/${category.category_name.toLowerCase()}`}
                        key={category.category_id}
                      >
                        <li>{category.category_name}</li>
                      </Link>
                    ))}
                  </ul>
                </div>
              </span>
              <span className="nav-link relative group">
                <Link href="/category/apparel">
                  APPAREL
                </Link>
              </span>
            </div>
          )}
        </div>

        <div className="col-span-1 flex items-center text-center self-center"></div>
      </nav>
    </header>
  );
}
