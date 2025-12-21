'use client';

import { useState, useEffect } from "react";
import { fetchCategoryCollection } from "@/lib/api/categoryService";
import MainLayoutCollection from "./layout";
import CollectionComponent from './CollectionComponentLayout';
import CollectionCard from "./CollectionCard";
import Loading from "./Loading";

import { CategoryCollectionProps } from "@/lib/api/categoryService";

export default function Collection() {
  const [categoryProducts, setCategoryProducts] = useState<CategoryCollectionProps[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCategoryData = async () => {
      try {
        const result = await fetchCategoryCollection();
        console.log(result)
        if (result) {
          setCategoryProducts(result.categories);
        } else {
          setError('Failed to load category data');
        }
      } catch (err) {
        console.error("Error in fetchCategoryCollection:", err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    getCategoryData();
  }, []); 

  return (
    <MainLayoutCollection>
      {loading ? (
        <Loading />
      ) : (
        Array.isArray(categoryProducts) && categoryProducts.length > 0 && 
        categoryProducts.map(({ categoryName, categoryId, products }) => (
          <CollectionComponent key={categoryId} categoryName={categoryName}>
            {products.map((product) => (
              <CollectionCard 
              key={product.productId} 
              product={product} 
              />
            ))}
          </CollectionComponent>
        ))
      )}
    </MainLayoutCollection>
  );
}
