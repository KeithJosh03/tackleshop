'use client';
import { useEffect, useState } from "react"
import NewArrivalLayout from "./NewArrivalLayout";
import ProductCards from "@/components/layout/ProductCards";

import axios from "axios";

import { NewArrivalProduct } from "@/types/dataprops";
import { worksans } from "@/types/fonts"
import Link from "next/link"

interface NewArrivalResponse {
  status: boolean;
  products: NewArrivalProduct[]; 
}

function NewArrival() {
  const [newArriveProducts, setNewArriveProducts] = useState<NewArrivalProduct[]>([]);

  useEffect(() => {
    axios.get<NewArrivalResponse>('/api/products/newarrival/')
      .then(res => {
        setNewArriveProducts(res.data.products); 
      })
      .catch(err => {
        console.error(err);
      });
  }, [])

  return (
    <>
      <div className="w-auto flex flex-row">
        <div className="text-primaryColor font-extrabold text-5xl p-4">
          <h4>NEW ARRIVALS</h4>
        </div>
      </div>
      <NewArrivalLayout>
        {newArriveProducts?.map((product, index) => (
          <ProductCards 
            key={`${product.productId}-${index}`}
            product={product}
            index={index}
          />
        ))}
      </NewArrivalLayout>
    </>
  )
}

export default NewArrival;
