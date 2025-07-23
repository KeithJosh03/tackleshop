import { worksans,inter } from "@/types/fonts";
import Link from "next/link";
import Image from "next/image";
import { imagesAsset } from "@/types/image";

export default function Footer() {
  return (
    <div className={`${inter.className} text-white h-fit w-full flex flex-col items-center border-greyColor brandsBackGround`}>
      <div className="w-full flex flex-row justif justify-between py-4 px-72">
        <div className="flex flex-col items-center justify-items-center">
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
          <div>
            <h1></h1>
          </div>
        </div>
        <div className="flex flex-col text-tertiaryColor font-normal text-md gap-y-1">
          <h4 className={`${worksans.className} font-extrabold text-xl text-primaryColor mb-2`}>SMOOTH CASTING TACKLE SHOP</h4>
          <h5><span className="font-extrabold text-primaryColor">Location: </span>Falcata St, Buhangin, Davao City, 8000 Davao del Sur</h5>
          <h5><span className="font-extrabold text-primaryColor">Email: </span>joshuaengoc1@gmail.com</h5>
          <h5><span className="font-extrabold text-primaryColor">Store Hours: </span> Monday - Saturday (9:30 AM–5:30 PM)</h5>
        </div>
      </div>
      <div className="w-full flex items-center justify-center py-6">
        <p className="font-normal text-sm">© 2025,SmoothCastingTackleShop</p>
      </div>
    </div>
  )
}
