'use client';

import axios from "axios";
import { useState, useEffect } from "react";

import MainLayoutCollection from "./layout";
import CollectionComponent from './CollectionComponentLayout';
import CollectionCard from "./CollectionCard";

import { CategoryCollectionProps } from "@/types/dataprops";

interface ProductCollectionResponse {
  status:boolean;
  collectioncategories:CategoryCollectionProps[];
}

export default function Collection() {
  const [categoryProducts, setCategoryProducts] = useState<CategoryCollectionProps[]>([]);

  useEffect(() => {
    axios.get<ProductCollectionResponse>('/api/categories/categorycollection')
      .then(res => setCategoryProducts(res.data.collectioncategories))
      .catch(err => console.error(err));
  }, []);

  return (
    <MainLayoutCollection>
      {categoryProducts.map(({categoryName,categoryId,products}) => (
        <CollectionComponent 
          key={categoryId} 
          categoryName={categoryName}
        >
          {products.map((product) => (
            <CollectionCard 
              key={product.productId}
              product={product}
            />
          ))}    
        </CollectionComponent>
      ))}
    </MainLayoutCollection>
  );
}
