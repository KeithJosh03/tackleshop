'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";

import CardsLayoutCategory from "./CardsLayout";
import CategoryCards from "./CategoryCards";


import { CategoryProducts, CategorizeProduct } from "@/types/dataprops";


interface CategoryProductResponse  {
  status:boolean;
  categoryproducts:CategoryProducts;
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
}

export default function Category(){
  const [categorizeProduct, setcategorizeProduct] = useState<CategorizeProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);
  const { category } = useParams<{ tag: string; category: string }>();

  const fetchProducts = useCallback(async (page: number, isLoadMore: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await axios.get<CategoryProductResponse>(
        `/api/categories/specificCategory/${category.replaceAll('-',' ')}?page=${page}`
      );
      
      if (isLoadMore) {
        setcategorizeProduct(prev => [...prev, ...response.data.categoryproducts.products]);
      } else {
        setcategorizeProduct(response.data.categoryproducts.products);
      }
      
      setHasMore(response.data.hasMore);
      setCurrentPage(page);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [category, loading]);

  useEffect(() => {
    fetchProducts(1);
  }, [category]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchProducts(currentPage + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, currentPage, fetchProducts]);

  return (
    <>
    <div className="w-auto flex flex-row">
      <div className="text-primaryColor font-extrabold text-5xl p-4">
        <h4>{`${category.replaceAll('-', ' ').toUpperCase()}`}</h4>
      </div>
    </div>
    
    {initialLoading ? (
      <div className="h-96 text-center items-center justify-center text-primaryColor font-bold">
        <h3>Loading products...</h3>
      </div>
    ) : categorizeProduct?.length > 0 ? (
      <>
        <CardsLayoutCategory>
          {categorizeProduct?.map((products, index) => (
            <CategoryCards 
              key={`${products.productId}-${index}`}
              product={products}
              index={index}
            />
          ))}
        </CardsLayoutCategory>
        
        <div ref={observerRef} className="h-10 flex items-center justify-center">
          {loading && (
            <div className="text-primaryColor font-bold">
              Loading more products...
            </div>
          )}
          {!hasMore && categorizeProduct.length > 0 && (
            <div className="text-gray-500 font-medium">
              No more products to load
            </div>
          )}
        </div>
      </>
    ) : (
      <div className="h-96 text-center text-primaryColor font-bold">
        <h3>{`No ${category.toUpperCase()} Available`}</h3>
        <Link href={`/`}>
          <button className="bg-secondary text-md font-extrabold button-view mt-10">Go Back</button>
        </Link>
      </div>
    )}
    </>
  )
}

