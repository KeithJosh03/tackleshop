import { products } from "@/types/products";
import Image from "next/image";

import { worksans,inter } from "@/types/fonts";

export default function CollectionCard() {
  return (
    <>
    <div className={`${worksans.className} h-fit basis-1/4 border-2 px-4 py-2 flex flex-col gap-y-2 items-center border-greyColor transition-all rounded-xl hover:border-primaryColor`}>
        <div className="relative w-full aspect-[4/4] overflow-hidden rounded">
            <Image
            src={products.shimano}
            alt="Shimano Rod 3000"
            fill
            layout="fill"
            objectFit="fit"
            className="object-cover" 
            />
        </div>
        <div className={`${worksans.className} flex flex-col text-lg w-full justify-center items-center text-center text-tertiaryColor`}>
            <h3 className='font-bold text-lg text-primaryColor'>
            Shimano Rod FX 2500
            </h3>
            <p className="font-normal">Shimano</p>
            <p className={`${inter.className} font-bold`}>₱ 12,500</p>
        </div>
    </div>
    <div className={`${worksans.className} h-fit basis-1/4 border-2 px-4 py-2 flex flex-col gap-y-2 items-center border-greyColor transition-all rounded-xl hover:border-primaryColor`}>
        <div className="relative w-full aspect-[4/4] overflow-hidden rounded">
            <Image
            src={products.graphiteleader}
            alt="Shimano Rod 3000"
            fill
            layout="fill"
            objectFit="fit"
            className="object-cover" 
            />
        </div>
        <div className={`${worksans.className} flex flex-col text-lg w-full justify-center items-center text-center text-tertiaryColor`}>
            <h3 className="font-bold text-lg text-primaryColor">
            GraphiteLeader Finezza 752L-T
            </h3>
            <p className="font-normal">Graphite Leader</p>
            <p className={`${inter.className} font-bold`}>₱ 9,500</p>
        </div>
    </div>
    </>
  )
}
