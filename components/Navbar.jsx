'use client';

import Image from 'next/image'
import Link from 'next/link';         

import { imagesAsset } from '@/types/image'

import { monts } from '@/types/fonts';


function NavBar() {
  return (
  <header className='top-0 fixed w-full z-50'>
    <nav className={`${monts.className} text-primaryColor flex flex-col items-center bg-mainBackgroundColor`}>
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
        <div className='flex relative text-sm font-extrabold'>
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

export default NavBar;

