'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

import CardsLayoutCategory from "./CardsLayout";
import CategoryCards from "./CategoryCards";

import { ProductProps } from "@/types/dataprops";


export default function Category(){
  let [categorizeProduct, setcategorizeProduct]= useState<ProductProps[]>([]);
  const { category } : any = useParams();

  useEffect(() => {
    axios.get(`/api/categories/specificCategory/${category.replaceAll('_', ' ')}`)
        .then(res => setcategorizeProduct(res.data.products))
        .catch(err => console.log(err));
  },[])

  return (
    <>
    <div className="w-auto flex flex-row">
      <div className="text-primaryColor font-extrabold text-5xl p-4">
        <h4>{`${category.replaceAll('_', ' ').toUpperCase()}`}</h4>
      </div>
    </div>
    <CardsLayoutCategory>
      {categorizeProduct.map((product, index) => (
        <CategoryCards 
          key={product.product_id}
          product={product}
          index={index}
        />
      ))}
    </CardsLayoutCategory>

    </>
  )
}

