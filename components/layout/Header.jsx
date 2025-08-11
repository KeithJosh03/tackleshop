'use client';
import axios from 'axios';
import Image from 'next/image'
import Link from 'next/link';

import { useEffect, useState } from 'react';

import { imagesAsset } from '@/types/image'
import { worksans } from '@/types/fonts';

export default function Header() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/brands')
    .then(res => setBrands(res.data.brands))
    .catch(err => console.log(err));
    
    axios.get('/api/categories')
    .then(res => setCategories(res.data.categories))
    .catch(err => console.log(err));

     axios.get('/api/categories/getapparel')
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
    
  },[])


  return (
  <header className='top-0 fixed w-full z-50'>
    <nav className={`${worksans.className} text-primaryColor flex flex-col items-center bg-mainBackgroundColor`}>
      <div className='flex flex-col items-center text-center'>
        <div className="relative w-72 h-36 self-center">
          <Link href='/'>
            <Image 
            src={imagesAsset.logo}
            fill={true}
            alt='Logo'
            className='object-fill'
            />
          </Link>
        </div>
        <div className='grid grid-cols-4 text-md font-extrabold w-full container whitespace-nowrap'>
          <span className="nav-link">
            <Link href='/newarrival'>
            NEW ARRIVALS
            </Link>
          </span>
          <span className="nav-link relative group">
            <p className='cursor-pointer'>BRANDS</p>
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 hidden group-hover:block text-md py-2 px-4 rounded-b-md text-tertiaryColor bg-katulo'>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-katulo"></div>
              {brands.map((brand) => (
              <Link 
              className='hover:text-primaryColor' 
              href={`brands/${brand.brand_name}`}
              key={brand.brand_id}
              >
              <h4>{brand.brand_name}</h4>
              </Link>
              ))}
            </div>
          </span>
          <span className="nav-link relative group">
            <p className='cursor-pointer'>CATEGORIES</p>
            <div className='absolute w-full top-full left-0 right-0 hidden group-hover:block text-md gap-y-2 rounded-b-md py-2 px-4 text-tertiaryColor bg-katulo'>
              <div className="absolute -top-2 left-1/2 tran22222222222sform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-katulo"></div>
              {categories.map((category) => (
              <Link 
                className='hover:text-primaryColor' 
                href={`category/${category.category_name}`}
                key={category.category_id}
              >
              <p>{category.category_name}</p>
              </Link>
              ))}
            </div>
          </span>
          <span className="nav-link relative group">
            APPAREL
          </span>
        </div>
      </div>
    </nav>
  </header>

  )
}

