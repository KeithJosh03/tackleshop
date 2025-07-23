import { ReviewCard } from "../index";

import { worksans } from "@/types/fonts";

export default function Reviews() {
  return (
    <div className={`${worksans.className} h-fit w-full flex flex-col items-center justify-center text-white px-28`}>
        <h1 className="primaryTextColor font-extrabold text-4xl">REVIEWS</h1>
        <div className="grid grid-cols-3 grid-flow-row gap-x-4">
            <ReviewCard />
        </div>
    </div>
  )
}
