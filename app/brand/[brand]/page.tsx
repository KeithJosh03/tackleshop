'use client';
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BrandsCards from "./BrandsCards";
import CardsLayoutBrands from "./CardsLayoutBrand";


// import { BrandProduct } from "@/types/dataprops";
import { BrandProducts } from "@/types/dataprops";

interface BrandProductsResponse {
  status:boolean;
  products: BrandProducts[];
}




export default function Brand(){
  let [brandProduct, setBrandProduct]= useState<BrandProducts[]>([]);
  const { brand } = useParams<{ tag: string; brand: string }>();

  useEffect(() => {
    axios.get<BrandProductsResponse>(`/api/brands/specificbrand/${brand.replaceAll("-", " ").toLowerCase()}`)
        .then(res => setBrandProduct(res.data.products))
        .catch(err => console.log(err));
  },[brand])

  return (
    <>
    <div className="w-auto flex flex-row">
      <div className="text-primaryColor font-extrabold text-5xl p-4">
        <h4>{`${brand.replaceAll("-", " ").toUpperCase()}`}</h4>
      </div>
    </div>
    {brandProduct?.length !== 0 ? (
      <CardsLayoutBrands>
        {brandProduct?.map((product, index) => (
          <BrandsCards 
            key={product.productId}
            product={product}
            index={index}
          />
        ))}
      </CardsLayoutBrands>
    )
    :
      (<div className="h-96 text-center text-primaryColor font-bold">
        <h3>{`No ${brand.replaceAll("-", " ")} Available`}</h3>
        <Link href={`/`}>
          <button className="bg-secondary text-md font-extrabold button-view mt-10">Go Back</button>
        </Link>
      </div>)
    }
    </>
  )
}