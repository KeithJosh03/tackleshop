'use client';

import { useState, useEffect } from "react";

import axios from "axios";
import { worksans } from "@/types/fonts";
import { HighLightCards } from "@/components/index";


export default function HighLights() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  axios.get('/api/products/')
  .then(console.log(res))
  .catch(err => console.log(err))
  
  axios.get('/api/products/')
  .then(res => console.log(res))
  .catch(err => console.log(err));
  })

  return (
    <div className={`${worksans.className} h-hit w-full flex flex-col items-center justify-center px-28`}>
      <h1 className='text-primaryColor font-extrabold text-4xl'>HIGHLIGHT PRODUCTS</h1>
      <div className='w-full grid grid-cols-4 grid-flow-row gap-4 mt-10'>
        <HighLightCards />
      </div>
    </div>
  )
}
                                                                                                                            