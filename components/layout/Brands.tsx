'use client';

import { useEffect, useState } from "react";
import { worksans, inter } from "@/types/fonts";
import axios from "axios";
import { BrandProps } from '@/types/dataprops';
import Image from "next/image";

import Link from "next/link";

export default function Brands() {
  const [brandLogos, setBrandLogo] = useState<BrandProps[]>();

  useEffect(() => {
    axios.get(`/api/brands/brandlogo/`)
      .then(res => setBrandLogo(res.data.brandLogo))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className={`${worksans.className} h-fit w-full flex flex-col items-center justify-center text-tertiaryColor py-6 gap-y-4 brandsBackGround`}>
      <h1 className="text-primaryColor font-extrabold text-4xl">BRANDS</h1>
      <p className={`${inter.className} font-bold text-xl text-center px-4`}>
        🎣 Only at Smooth Tackles Shop — where your next catch begins.
      </p>

      <div className="overflow-hidden w-full">
        <div className="flex animate-marquee space-x-8 sm:space-x-12 md:space-x-16 w-max hover:[animation-play-state:paused]">
          {brandLogos?.map(({ brand_id, brand_name, imageUrl }) => (
            <Link href={`/brand/${brand_name.replace(/ /g, "_").toLowerCase()}`} key={`dup-${brand_id}`}>
              <div
                className="group relative flex items-center justify-center h-14 w-28 sm:h-16 sm:w-32 md:h-20 md:w-36 p-2"
              >
                <Image
                  src={`/brands/${imageUrl}`}
                  alt={brand_name}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />

                <div className="absolute inset-0 flex items-center justify-center rounded-md bg-secondary text-tertiaryColor text-lg sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {brand_name}
                </div>
              </div>
            </Link>
          ))}

          {brandLogos?.map(({ brand_id, brand_name, imageUrl }) => (
            <Link href={`/brand/${brand_name.replace(/ /g, "_").toLowerCase()}`} key={`dup-${brand_id}`}>
              <div
                className="group relative flex items-center justify-center h-14 w-28 sm:h-16 sm:w-32 md:h-20 md:w-36 p-2"
              >
                <Image
                  src={`/brands/${imageUrl}`}
                  alt={brand_name}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />

                <div className="absolute inset-0 flex items-center justify-center rounded-md bg-secondary text-tertiaryColor text-lg sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {brand_name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
