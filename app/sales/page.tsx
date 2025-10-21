'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import SaleProductCards from "@/components/sales/SaleProductCards";
import { DiscountProductCollection } from "@/types/dataprops";

interface SalesResponse {
  status: boolean;
  products: DiscountProductCollection[];
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
}

export default function Sales() {
  const [salesProducts, setSalesProducts] = useState<DiscountProductCollection[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async (page: number, isLoadMore: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await axios.get<SalesResponse>(
        `/api/productDiscounted/discountedProducts?page=${page}`
      );
      
      if (isLoadMore) {
        setSalesProducts(prev => [...prev, ...response.data.products]);
      } else {
        setSalesProducts(response.data.products);
      }
      
      setHasMore(response.data.hasMore);
      setCurrentPage(page);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchProducts(1);
  }, []);

  // Intersection Observer for infinite scroll
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
          <h4>SALES</h4>
        </div>
      </div>
      
      {initialLoading ? (
        <div className="h-96 text-center items-center justify-center text-primaryColor font-bold">
          <h3>Loading sales products...</h3>
        </div>
      ) : salesProducts?.length > 0 ? (
        <>
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {salesProducts?.map((product, index) => (
                <SaleProductCards 
                  key={`${product.productId}-${product.variantId}-${index}`}
                  discountProduct={product}
                />
              ))}
            </div>
          </div>
          
          {/* Infinite scroll trigger */}
          <div ref={observerRef} className="h-10 flex items-center justify-center">
            {loading && (
              <div className="text-primaryColor font-bold">
                Loading more products...
              </div>
            )}
            {!hasMore && salesProducts.length > 0 && (
              <div className="text-gray-500 font-medium">
                No more products to load
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="h-96 text-center items-center justify-center text-primaryColor font-bold">
          <h3>No Sales Available</h3>
          <Link href={`/`}>
            <button className="bg-secondary text-md font-extrabold button-view mt-10">Go Back</button>
          </Link>
        </div>
      )}
    </>
  );
}
