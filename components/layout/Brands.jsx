import { worksans,inter } from "@/types/fonts";

import { brands } from '@/types/brands';

import Image from "next/image";

export default function Brands() {
  return (
    <div className={`${worksans.className} h-fit w-full flex flex-col items-center justify-center text-tertiaryColor py-2 gap-y-2 brandsBackGround`}>
      <h1 className="text-primaryColor font-extrabold text-4xl">BRANDS</h1>
      <p className={`${inter.className} font-bold text-xl`}>🎣 Only at Smooth Tackles Shop — where your next catch begins.</p>
      <div className="flex flex-row items-center self-center gap-x-14 mt-2">
        <div className="relative rounded h-20 w-36">
          <Image
          src={brands.Shimano}
          alt='Brand'
          fill={true}
          className='object-fill'
          />
        </div>
        <div className="relative rounded h-20 w-36">
          <Image
          src={brands.svgg}
          alt='Brand'
          fill={true}
          className='object-fill'
          />
        </div>
      </div>
    </div>
  )
}
