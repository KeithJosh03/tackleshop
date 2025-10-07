'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";

import CardsLayoutCategory from "./CardsLayout";
import CategoryCards from "./CategoryCards";


import { CategoryProducts, CategorizeProduct } from "@/types/dataprops";


interface CategoryProductResponse  {
  status:boolean;
  categoryproducts:CategoryProducts;
}



export default function Category(){
  let [categorizeProduct, setcategorizeProduct]= useState<CategorizeProduct[]>([]);
  const { category } = useParams<{ tag: string; category: string }>()

  useEffect(() => {
    axios.get<CategoryProductResponse>(`/api/categories/specificCategory/${category.replaceAll('-',' ')}`)
        .then(res => setcategorizeProduct(res.data.categoryproducts.products))
        .catch(err => console.log(err));
  },[category])

  console.log(categorizeProduct);

  return (
    <>
    <div className="w-auto flex flex-row">
      <div className="text-primaryColor font-extrabold text-5xl p-4">
        <h4>{`${category.replaceAll('-', ' ').toUpperCase()}`}</h4>
      </div>
    </div>
    {categorizeProduct?.length !== 0 ? (
      <CardsLayoutCategory>
        {categorizeProduct.map((products, index) => (
          <CategoryCards 
            key={products.productId}
            product={products}
            index={index}
          />
        ))}
      </CardsLayoutCategory>
    )
    :
      (<div className="h-96 text-center text-primaryColor font-bold">
        <h3>{`No ${category.toUpperCase()} Available`}</h3>
        <Link href={`/`}>
          <button className="bg-secondary text-md font-extrabold button-view mt-10">Go Back</button>
        </Link>
      </div>)
    }
    </>
  )
}

