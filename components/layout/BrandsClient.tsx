'use client';

import Link from "next/link";
import { inter } from "@/types/fonts";
import { BrandLogosProps } from "@/lib/api/brandService";
import Image from "next/image";
import slugify from "slugify";



const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function BrandLogoClient(
  { brandlogos } : 
  { brandlogos : BrandLogosProps[]}
) {
  return (
    <section className='h-fit w-full flex flex-col items-center brandsBackGround border-t border-b border-greyColor  justify-center text-tertiaryColor py-6 gap-y-4'>
      <h1 className="text-primaryColor font-extrabold text-4xl">BRANDS</h1>
      <p className={`${inter.className} font-bold text-xl text-center px-4`}>
        🎣 Only at Smooth Casting Tackles Shop — where your next catch begins.
      </p>
      <div className="overflow-hidden w-full">
        <div className="flex animate-marquee space-x-8 sm:space-x-12 md:space-x-16 w-max hover:[animation-play-state]">
          {brandlogos?.map(({ brandId, brandName, imageUrl }) => (
            <Link 
            href={`/brand/${slugify(brandName.toLowerCase())}`} 
            key={`dup-${brandId}`}
            >
              <div
              className="group relative flex items-center justify-center h-14 w-28 sm:h-16 sm:w-32 md:h-20 md:w-36 p-2"
              >
                <Image
                src={`${baseURL}${imageUrl}`} 
                alt={brandName}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div className="brand-logo-text">
                  {brandName}
                </div>
              </div>
            </Link>
          ))}

          {brandlogos?.map(({ brandId, brandName, imageUrl }) => (
            <Link 
            href={`/brand/${slugify(brandName.toLowerCase())}`} 
            key={`dup-${brandId}`}
            >
              <div
              className="group relative flex items-center justify-center h-14 w-28 sm:h-16 sm:w-32 md:h-20 md:w-36 p-2"
              >
                <Image
                src={`${baseURL}${imageUrl}`} 
                alt={brandName}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div className="brand-logo-text">
                  {brandName}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  )
}
