'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

import CardsLayoutCategory from "./cardslayout";
import CategoryCards from "./categorycards";
import MainCategoryLayout from "./layout";

import { ProductProps } from "@/types/dataprops";


export default function Category(){
  let [categorizeProduct, setcategorizeProduct]= useState<ProductProps[]>([]);
  const { category } : any = useParams();

  useEffect(() => {
    axios.get(`/api/categories/specificCategory/${category}`)
        .then(res => setcategorizeProduct(res.data.products))
        .catch(err => console.log(err));
  },[])

  return (
    <>
    <div className="w-auto border flex flex-row">
      <div className="text-primaryColor font-extrabold text-5xl p-4">
        <h4>{`${category.toUpperCase()}`}</h4>
      </div>
    </div>
    <CardsLayoutCategory>
      {categorizeProduct.map((product) => (
        <CategoryCards 
        key={product.product_id}
        product={product}
        />
      ))

      }

    </CardsLayoutCategory>
    </>
  )
}

