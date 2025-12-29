'use client';

import { useEffect, useState } from "react";
import { worksans, inter } from "@/types/fonts";
import axios from "axios";
import Image from "next/image";
import slugify from "slugify";

import Link from "next/link";

import { BrandProps } from "@/types/dataprops";

interface BrandsResponse {
  status:boolean;
  brandlogo:BrandProps[];
}
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';


export default function Brands() {
  const [brandLogos, setBrandLogos] = useState<BrandProps[]>();

  useEffect(() => {
    axios.get<BrandsResponse>(`/api/brands/brandlogo/`)
      .then((res) => {
        setBrandLogos(res.data.brandlogo);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className={`${worksans.className} h-fit w-full flex flex-col items-center brandsBackGround border-t border-b border-greyColor  justify-center text-tertiaryColor py-6 gap-y-4`}>
      <h1 className="text-primaryColor font-extrabold text-4xl">BRANDS</h1>
      <p className={`${inter.className} font-bold text-xl text-center px-4`}>
        🎣 Only at Smooth Tackles Shop — where your next catch begins.
      </p>

      <div className="overflow-hidden w-full">
        <div className="flex animate-marquee space-x-8 sm:space-x-12 md:space-x-16 w-max hover:[animation-play-state:paused]">
          {brandLogos?.map(({ brandId, brandName, imageUrl }) => (
            <Link href={`/brand/${slugify(brandName.toLowerCase())}`} key={`dup-${brandId}`}>
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

          {brandLogos?.map(({ brandId, brandName, imageUrl }) => (
            <Link href={`/brand/${slugify(brandName.toLowerCase())}`} key={`dup-${brandId}`}>
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
