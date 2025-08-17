import { worksans } from "@/types/fonts";
import CollectionCard from './CollectionCard';

import { CategoryCollectionProps } from "@/types/dataprops";

import Link from "next/link";


export default function CollectionComponent({
  category,
  children,
  }:{
  children:React.ReactNode,
  category: CategoryCollectionProps
  }
){
  return (
    <div className={`${worksans.className} h-hit w-full flex flex-col items-center justify-center px-40`}>
      <h1 className='text-primaryColor font-extrabold text-4xl'>{`${category.category_name} Collection`}</h1>
      <div className='w-full grid grid-cols-4 grid-flow-row gap-4 mt-10'>
          {children}
      </div>
      <Link href={`/category/${category.category_name}`}>
        <button className="button-view text-md font-extrabold mt-8">
          View All
        </button>
      </Link>
    </div>
  )
}
