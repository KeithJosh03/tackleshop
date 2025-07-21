import CollectionCard from './Collectioncard';
import { monts } from "@/types/fonts"

export default function CollectionComponent() {
  return (
    <div className={`${monts.className} h-hit w-full flex flex-col items-center justify-center px-28`}>
        <h1 className='text-primaryColor font-extrabold text-4xl'>Reel Collections</h1>
        <div className='w-full grid grid-cols-4 grid-flow-row gap-4 mt-10'>
          <CollectionCard/>
        </div>
    </div>
  )
}
