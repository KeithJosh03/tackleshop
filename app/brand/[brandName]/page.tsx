'use client';

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import BrandsCards from "./BrandsCards";
import {
  ProductFilterBar,
  BrandCategoryPaginationButton,
  SkeletonBrandCategoryCardRoutesSkeletonCard
} from "@/components/ui"


import { fetchSpecificBrandProducts } from "@/lib/api/brandService";
import { BrandProducts } from "@/types/dataprops";


export default function Brand() {
  const { brandName } = useParams<{ brandName: string }>();
  const displayName = brandName.replaceAll("-", " ").toUpperCase();

  const [products, setProducts] = useState<BrandProducts[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [budget, setBudget] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const fetchProducts = useCallback(async (page: number, search: string, bdgt: string, sort: string) => {
    setLoading(true);
    try {
      const data = await fetchSpecificBrandProducts(brandName, page, search, bdgt, sort);
      if (!data) return;

      setProducts(data.products);
      setCurrentPage(data.currentPage);
      setLastPage(data.lastPage);
      setHasMore(data.hasMore);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [brandName]);

  useEffect(() => {
    setInitialLoading(true);
    const handler = setTimeout(() => {
      setProducts([]);
      setCurrentPage(1);
      fetchProducts(1, searchQuery, budget, sortOption);
    }, 500);

    return () => clearTimeout(handler);
  }, [brandName, searchQuery, budget, sortOption, fetchProducts]);

  return (
    <div className="min-h-screen px-6 pb-16 pt-4 md:px-10 flex flex-col gap-2">
      <div className="flex flex-col gap-1 items-center justify-center pt-8 pb-4">
        <p className="text-xs font-bold text-[#a28d7e] uppercase tracking-widest">
          BROWSE <span className="mx-1">›</span> BRAND
        </p>
        <h1 className="text-[40px] sm:text-[72px] font-[900] text-[#e0e3e5] uppercase leading-none tracking-tight">
          {displayName}
        </h1>
      </div>

      {/* Reusable Filter Bar Component */}
      <ProductFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        budget={budget}
        onBudgetChange={setBudget}
        sortOption={sortOption}
        onSortChange={setSortOption}
        productCount={products.length}
        currentPage={currentPage}
        lastPage={lastPage}
        initialLoading={initialLoading}
      />

      {initialLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonBrandCategoryCardRoutesSkeletonCard key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {products.map((product, i) => (
                <BrandsCards key={product.productId} index={i} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>

          <BrandCategoryPaginationButton
            currentPage={currentPage}
            lastPage={lastPage}
            hasMore={hasMore}
            loading={loading}
            onPageChange={(newPage) => fetchProducts(newPage, searchQuery, budget, sortOption)}
          />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-24 border-t border-[#272a2c]">
          <div className="w-20 h-20 rounded-full flex items-center justify-center border border-[#323537] bg-[#1d2022]">
            <svg className="w-9 h-9 text-[#ffc49a]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black text-[#e0e3e5]">No Products Found</h3>
            <p className="text-sm text-[#a28d7e] mt-1">There are no items in <span className="text-[#ffc49a] font-semibold">{displayName}</span> yet.</p>
          </div>
          <Link href="/" className="px-6 py-2.5 bg-[#ffc49a] text-[#4f2500] font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:bg-[#ff9d4d]">
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}