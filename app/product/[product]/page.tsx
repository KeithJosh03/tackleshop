'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { worksans } from '@/types/fonts';

import { ProductProps } from '@/types/dataprops';

export default function Product() {
  const [productDetails, setProductDetail] = useState<ProductProps>();
  const  params  =  useParams<{ tag: string; product: string }>();
  let productname = params.product.replace(/-/g, ' ');

    useEffect(() => {
        axios.get(`/api/products/productdetail/${productname}`)
            .then(res => setProductDetail(res.data.productdetail[0]))
            .catch(err => console.log(err))
    },[])

  console.log(productDetails);

  return (
  <>
    <div className={`flex flex-col ${worksans.className} p-4 gap-y-2`}>
      <h3 className='text-secondary text-xl font-normal'>{`${productDetails?.brand.brand_name}`}</h3>
      <h3 className='text-primaryColor text-4xl font-extrabold'>{`${productDetails?.product_name}`}</h3>
      <h5 className='text-primaryColor text-2xl font-bold'>{`₱ ${productDetails?.base_price}`}</h5>
    </div>
    <div className={`bg-blue-300  p-4`}>
      
    </div>
  </>
  )
}
