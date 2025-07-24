import { worksans,inter } from "@/types/fonts";
import Link from "next/link";
import Image from "next/image";
import { imagesAsset } from "@/types/image";

import { socials } from "@/types/socials";

export default function Footer() {
  return (
    <div className={`${inter.className} text-white h-fit w-full flex flex-col items-center border border-greyColor`}>
      <div className="w-full flex flex-col justify-items-center text-center items-center gap-y-2">
        <div className="flex flex-col items-center justify-items-center">
          <div className="relative w-60 h-24 self-center">
            <Link href='/'>
              <Image 
              src={imagesAsset.logo}
              fill={true}
              alt='Logo'
              className='object-fill'
              />
            </Link>
          </div>
        </div>
        <div className='flex flex-col text-tertiaryColor font-normal text-md'>
          <h5><span className={`${worksans.className} font-extrabold text-primaryColor`}>Location: </span>Falcata St, Buhangin, Davao City, 8000 Davao del Sur</h5>
          <h5><span className={`${worksans.className} font-extrabold text-primaryColor`}>Email: </span>joshuaengoc1@gmail.com</h5>
          <h5><span className={`${worksans.className} font-extrabold text-primaryColor`}>Contact Number: </span>0977 059 8624</h5>
          <h5><span className={`${worksans.className} font-extrabold text-primaryColor`}>Store Hours: </span> Monday - Saturday (9:30 AM–5:30 PM)</h5>
        </div>
        <div className="flex flex-row relative items-center justify-between gap-x-6">
          <div className="relative w-10 h-10 self-center">
              <Image 
              src={socials.facebook}
              fill={true}
              alt='Logo'
              className='object-fill'
              />
          </div>
          <div className="relative w-10 h-10 self-center">
              <Image 
              src={socials.googlemap}
              fill={true}
              alt='Logo'
              className='object-fill'
              />
          </div>
          <div className="relative w-10 h-10 self-center">
              <Image 
              src={socials.instagram}
              fill={true}
              alt='Logo'
              className='object-fill'
              />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center py-4 brandsBackGround">
        <p className="font-extrabold text-sm">©2025, SmoothCastingTackleShop</p>
      </div>
    </div>
  )
}
