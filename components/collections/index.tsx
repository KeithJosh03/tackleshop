'use client';

import axios from "axios";
import { useState, useEffect } from "react";

import MainLayoutCollection from "./layout";
import CollectionComponent from './CollectionComponentLayout';
import CollectionCard from "./CollectionCard";
import Loading from "./Loading";

import { CategoryCollectionProps } from "@/types/dataprops";

interface ProductCollectionResponse {
  status: boolean;
  collectioncategories: CategoryCollectionProps[];
}

export default function Collection() {
  const [categoryProducts, setCategoryProducts] = useState<CategoryCollectionProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    axios.get<ProductCollectionResponse>('/api/categories/categorycollection')
      .then(res => {
        setCategoryProducts(res.data.collectioncategories);
        setLoading(false); 
      })
      .catch(err => {
        console.error(err);
        setLoading(false); 
      });
  }, []);

  return (
    <MainLayoutCollection>
      {loading ? (
        <Loading />
      ) : (
        categoryProducts.map(({ categoryName, categoryId, products }) => (
          <CollectionComponent key={categoryId} categoryName={categoryName}>
            {products.map((product) => (
              <CollectionCard key={product.productId} product={product} />
            ))}
          </CollectionComponent>
        ))
      )}
    </MainLayoutCollection>
  );
}
