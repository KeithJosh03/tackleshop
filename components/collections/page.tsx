'use client';

import MainLayoutCollection from "./layout";
import CollectionComponent from './CollectionComponent';
import CollectionCard from "./CollectionCard";
import { worksans,inter } from "@/types/fonts";
import { products } from "@/types/products";
import Image from "next/image";


import axios from "axios";
import { useState, useEffect } from "react";

export default function Collection() {
  const [categoryProducts, setcategoryProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/categories/categoryproduct')
        .then(res => setcategoryProducts(res.data))
        .catch(err => console.log(err));
  },[])

  console.log(products);
  return (
  <MainLayoutCollection>
    {
    categoryProducts.map(categoryproduct => (
    <CollectionComponent
      key={categoryproduct.category_id}
      categoryname={categoryproduct.category_name}
    >
      <h1>Hello</h1>
    </CollectionComponent>
    ))
    }
    
    <CollectionComponent>
      <h1>Hello</h1>
    </CollectionComponent>
  </MainLayoutCollection>
  )
}
