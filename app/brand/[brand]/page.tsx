'use client';
import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BrandsCards from "./BrandsCards";
import CardsLayoutBrands from "./CardsLayoutBrand";


import { BrandProducts } from "@/types/dataprops";

interface BrandProductsResponse {
  status:boolean;
  products: BrandProducts[];
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
}

export default function Brand(){
  const [brandProduct, setBrandProduct] = useState<BrandProducts[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);
  const { brand } = useParams<{ tag: string; brand: string }>();

  const fetchProducts = useCallback(async (page: number, isLoadMore: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await axios.get<BrandProductsResponse>(
        `/api/brands/specificbrand/${brand.replaceAll("-", " ").toLowerCase()}?page=${page}`
      );
      
      if (isLoadMore) {
        setBrandProduct(prev => [...prev, ...response.data.products]);
      } else {
        setBrandProduct(response.data.products);
      }
      
      setHasMore(response.data.hasMore);
      setCurrentPage(page);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [brand, loading]);

  useEffect(() => {
    fetchProducts(1);
  }, [brand]);

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
        <h4>{`${brand.replaceAll("-", " ").toUpperCase()}`}</h4>
      </div>
    </div>
    
    {initialLoading ? (
      <div className="h-96 text-center items-center justify-center text-primaryColor font-bold">
        <h3>Loading products...</h3>
      </div>
    ) : brandProduct?.length > 0 ? (
      <>
        <CardsLayoutBrands>
          {brandProduct?.map((product, index) => (
            <BrandsCards 
              key={`${product.productId}-${index}`}
              product={product}
              index={index}
            />
          ))}
        </CardsLayoutBrands>
        
        <div ref={observerRef} className="h-10 flex items-center justify-center">
          {loading && (
            <div className="text-primaryColor font-bold">
              Loading more products...
            </div>
          )}
          {!hasMore && brandProduct.length > 0 && (
            <div className="text-gray-500 font-medium">
              No more products to load
            </div>
          )}
        </div>
      </>
    ) : (
      <div className="h-96 text-center items-center justify-center text-primaryColor font-bold">
        <h3>{`No ${brand.replaceAll("-", " ")} Available`}</h3>
        <Link href={`/`}>
          <button className="bg-secondary text-md font-extrabold button-view mt-10">Go Back</button>
        </Link>
      </div>
    )}
    </>
  )
}