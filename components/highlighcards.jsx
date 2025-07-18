import Image from "next/image";
import { products } from "@/utils/products";
import { inter } from "@/utils/fonts";

export default function Highlightscard() {
  return (
    <>
      <div className="h-fit basis-1/4 border px-4 py-2 flex flex-col items-center justify-between border-greyColor transition-all hover:gradientborder hover:shadow-md rounded-md">
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded">
          <Image
            src={products.shimano}
            alt="Shimano Rod 3000"
            fill
            // layout="fill"
            // objectFit="fit"
            className="object-cover" 
          />
        </div>
        <div className="flex flex-col p-2 w-full justify-center items-center text-center gap-y-2">
          <h3 className="font-bold text-center text-lg text-primaryColor">
            Shimano Rod FX 2500
          </h3>
          <div className="flex flex-col text-[#fafaf9] font-normal">
            <p>Length: 1.775 m (5’10”)</p>
            <p>Sections: 2 (put‑over ferrule)</p>
          </div>
        </div>
      </div>
      <div className="h-fit basis-1/4 border px-4 py-2 flex flex-col items-center justify-between border-gray-800 transition-all hover:gradientborder hover:shadow-md rounded-md">
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded">
          <Image
            src={products.graphiteleader}
            alt="Shimano Rod 3000"
            fill
            // layout="fill"
            // objectFit="fit"
            className="object-cover" 
          />
        </div>
        <div className="flex flex-col p-2 w-full justify-center items-center text-center gap-y-2">
          <h3 className="font-bold text-center text-lg text-primaryColor max-w-xl">
            GRAPHITELEADER FINEZZA 752L-T
          </h3>
          <div className="flex flex-col text-[#fafaf9] font-normal">
            <p>Length: 1.775 m (5’10”)</p>
            <p>Sections: 2 (put‑over ferrule)</p>
          </div>
        </div>
      </div>
    </>
  );
}
