import { worksans } from "@/types/fonts";
import CollectionCard from './CollectionCard';

import { Category } from "@/types/data";


export default function CollectionComponent({
  categoryname,
  children,
}:{
    children:React.ReactNode,
    categoryname: Category
}) {
  return (
    <div className={`${worksans.className} h-hit w-full flex flex-col items-center justify-center px-40`}>
        <h1 className='text-primaryColor font-extrabold text-4xl'>Reel Collections</h1>
        <div className='w-full grid grid-cols-4 grid-flow-row gap-4 mt-10'>
            {children}
        </div>
    </div>
  )
}
