'use client';

import { useEffect, useState } from "react";
import axios from 'axios';
import CollectionCard from './Collectioncard';
import { worksans } from "@/types/fonts"



export default function CollectionComponent() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/categories/categoryproduct')
        .then(res => setProducts(res.data))
        .catch(err => console.log(err));
  },[])

  console.log(products);

  return (
    <div className={`${worksans.className} h-hit w-full flex flex-col items-center justify-center px-40`}>
        <h1 className='text-primaryColor font-extrabold text-4xl'>Reel Collections</h1>
        <div className='w-full grid grid-cols-4 grid-flow-row gap-4 mt-10'>
          <CollectionCard/>
        </div>
    </div>
  )
}
