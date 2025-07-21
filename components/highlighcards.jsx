import Image from "next/image";
import { products } from "@/types/products";
import { inter } from "@/types/fonts";

export default function Highlightscard() {
  return (
    <>
      <div className="h-fit basis-1/4 border px-4 py-2 flex flex-col gap-y-2 items-center justify-between border-greyColor transition-all hover:gradientborder">
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
        <div className="flex flex-col w-full justify-center items-center text-center gap-y-1">
          <h3 className="font-bold text-center text-lg text-primaryColor max-w-xl">
            Shimano Rod FX 2500
          </h3>
          <div className="flex flex-col text-tertiaryColor font-normal">
            <p>Length: 1.775 m (5’10”)</p>
            <p>Sections: 2 (put‑over ferrule)</p>
          </div>
        </div>
      </div>
      <div className="h-fit basis-1/4 border px-4 py-2 flex flex-col gap-y-2 items-center justify-between border-greyColor transition-all hover:gradientborder">
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
        <div className="flex flex-col w-full justify-center items-center text-center gap-y-1">
          <h3 className="font-bold text-center text-lg text-primaryColor max-w-xl">
            GraphiteLeader Finezza 752L-T
          </h3>
          <div className="flex flex-col text-tertiaryColor font-normal">
            <p>Length: 1.775 m (5’10”)</p>
            <p>Sections: 2 (put‑over ferrule)</p>
          </div>
        </div>
      </div>
      <div className="h-fit basis-1/4 border px-4 py-2 flex flex-col gap-y-2 items-center justify-between border-greyColor transition-all hover:gradientborder">
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
        <div className="flex flex-col w-full justify-center items-center text-center gap-y-1">
          <h3 className="font-bold text-center text-lg text-primaryColor max-w-xl">
            Shimano Rod FX 2500
          </h3>
          <div className="flex flex-col text-tertiaryColor font-normal">
            <p>Length: 1.775 m (5’10”)</p>
            <p>Sections: 2 (put‑over ferrule)</p>
          </div>
        </div>
      </div>
      <div className="h-fit basis-1/4 border px-4 py-2 flex flex-col gap-y-2 items-center justify-between border-greyColor transition-all hover:gradientborder">
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
        <div className="flex flex-col w-full justify-center items-center text-center gap-y-1">
          <h3 className="font-bold text-center text-lg text-primaryColor max-w-xl">
            GraphiteLeader Finezza 752L-T
          </h3>
          <div className="flex flex-col text-tertiaryColor font-normal">
            <p>Length: 1.775 m (5’10”)</p>
            <p>Sections: 2 (put‑over ferrule)</p>
          </div>
        </div>
      </div>
      
    </>
  );
}
