'use client';


import Image from 'next/image'
import Link from 'next/link';         

import { useEffect, useState } from 'react';
import axios from 'axios';

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
  },[])

  console.log(brands);
  console.log(categories);


  return (
  <header className='top-0 fixed w-full z-50'>
    <nav className={`${worksans.className} text-primaryColor flex flex-col items-center bg-mainBackgroundColor`}>
      <div className='flex flex-col items-center text-center w-2/4'>
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
        <div className='flex relative text-md font-extrabold'>
          <span className="nav-link">
            <Link href='/newarrival'>
            NEW ARRIVALS
            </Link>
          </span>
          <span className="nav-link relative group">
            <p>BRANDS</p>
          </span>
          <span className="nav-link relative group">
            CATEGORIES
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

