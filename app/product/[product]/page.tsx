'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
  <div className="">Hello</div>
  <div className="">Hello</div>
  </>
  )
}
