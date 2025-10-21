'use client';
import { useEffect, useState, useRef, useCallback } from 'react';


import { SetupCollection } from '@/types/dataprops'
import SetupsCards from '@/components/setups/SetupsCards';
import axios from 'axios';

import Link from 'next/link';


interface SetupsShowCaseResponse {
    status: boolean;
    setups: SetupCollection[];
    currentPage: number;
    lastPage: number;
    hasMore: boolean;
} 

export default function Setups() {
  const [setUpsProduct, setSetupsProduct] = useState<SetupCollection[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async (page: number, isLoadMore: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await axios.get<SetupsShowCaseResponse>(
        `/api/setups/setupShowcase?page=${page}`
      );
      
      if (isLoadMore) {
        setSetupsProduct(prev => [...prev, ...response.data.setups]);
      } else {
        setSetupsProduct(response.data.setups);
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
          <h4>Setups</h4>
        </div>
      </div>
      
      {initialLoading ? (
        <div className="h-96 text-center items-center justify-center text-primaryColor font-bold">
          <h3>Loading sales products...</h3>
        </div>
      ) : setUpsProduct?.length > 0 ? (
        <>
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {setUpsProduct?.map((setup, index) => (
                <SetupsCards 
                  key={`${setup.setupId}-${setup.codeName}-${index}`}
                  setupProduct={setup}
                />
              ))}
            </div>
          </div>
          
          <div ref={observerRef} className="h-10 flex items-center justify-center">
            {loading && (
              <div className="text-primaryColor font-bold">
                Loading more products...
              </div>
            )}
            {!hasMore && setUpsProduct.length > 0 && (
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
  )
}
