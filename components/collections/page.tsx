'use client';

import MainLayoutCollection from "./layout";
import CollectionComponent from './CollectionComponent';
import CollectionCard from "./CollectionCard";

import { CategoryCollectionProps } from "@/types/dataprops";

import axios from "axios";
import { useState, useEffect } from "react";

export default function Collection() {
  const [categoryProducts, setcategoryProducts] = useState<CategoryCollectionProps[]>([]);

  
  useEffect(() => {
    axios.get('/api/categories/categorycollection')
        .then(res => setcategoryProducts(res.data))
        .catch(err => console.log(err));
  },[])

  return (
  <MainLayoutCollection>
    {categoryProducts.map((category) => (
    <CollectionComponent 
      key={category.category_id} 
      category={category}
    >
      {category.product.map((product) => (
      <CollectionCard 
        key={product.product_id}
        product={product}
      />
      ))}    
    </CollectionComponent>
    ))}
  </MainLayoutCollection>
  )
}
