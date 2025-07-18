import { inter } from "@/utils/fonts";

import Image from "next/image";
import { profile } from "@/public";


export default function ReviewCard() {
  return (
    <>
    <div className="shadow-md shadow-[#E89347] p-4 flex flex-col gap-y-4 rounded">
        <p className={`${inter.className} text-md`}>Had my PC built according to my Architecture needs and they were very patient with the specifics 👌</p>
        <div className="flex flex-row gap-x-4">
            <div className="rounded">
                <Image 
                src={profile}
                alt="profile"
                className="rounded-lg"
                width={30}
                height={30}
                />
            </div>
            <div className="flex justify-center items-center font-extrabold text-xl primaryTextColor">
                <h1>Juan De La Cruz</h1>
            </div>
        </div>
    </div>
    <div className="shadow-md shadow-[#E89347] p-4 flex flex-col gap-y-4 rounded">
        <p className={`${inter.className} text-md`}>Customer Service is Superb! Pricing is the best compared to all other shops here. Highly recommended!</p>
        <div className="flex flex-row gap-x-4">
            <div className="rounded">
                <Image 
                src={profile}
                alt="profile"
                className="rounded-lg"
                width={30}
                height={30}
                />
            </div>
            <div className="flex justify-center items-center font-extrabold text-xl primaryTextColor">
                <h1>Froggo Baggins</h1>
            </div>
        </div>
    </div>
    </>
  )
}
