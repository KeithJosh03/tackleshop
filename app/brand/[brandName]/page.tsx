'use client';

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { fetchSpecificBrandProducts } from "@/lib/api/brandService";
import BrandsCards from "./BrandsCards";
import { BrandProducts } from "@/types/dataprops";

/* ─── Skeleton card ────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-md border border-[#323537] bg-[#1d2022] overflow-hidden animate-pulse min-h-[360px] flex flex-col">
      <div className="w-full flex-1 bg-[#0b0f10]" style={{ minHeight: '240px' }} />
      <div className="px-5 py-4 flex flex-col gap-2 flex-1 justify-end">
        <div className="h-2 w-1/3 rounded bg-[#323537]" />
        <div className="h-3 w-3/4 rounded bg-[#363a3b]" />
        <div className="h-4 w-1/2 rounded bg-[#363a3b] mt-1" />
      </div>
    </div>
  );
}

/* ─── Pagination button ────────────────────────────────────────────────── */
function PaginationBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 border
        ${disabled
          ? 'border-[#323537] text-[#544338] cursor-not-allowed opacity-50'
          : 'border-[#a28d7e] text-[#e0e3e5] hover:border-[#ffc49a] hover:text-[#ffc49a]'
        }
      `}
    >
      {children}
    </button>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */
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

  // Debounced fetch for filters
  useEffect(() => {
    setInitialLoading(true);
    const handler = setTimeout(() => {
      setProducts([]);
      setCurrentPage(1);
      fetchProducts(1, searchQuery, budget, sortOption);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [brandName, searchQuery, budget, sortOption, fetchProducts]);

  console.log(products);

  return (
    <div className="min-h-screen px-6 pb-16 pt-4 md:px-10 flex flex-col gap-2">

      {/* ── Hero Header ── */}
      <div className="flex flex-col gap-1 items-center justify-center pt-8 pb-4">
        <p className="text-xs font-bold text-[#a28d7e] uppercase tracking-widest">
          BROWSE <span className="mx-1">›</span> BRAND
        </p>
        <h1 className="text-[40px] sm:text-[72px] font-[900] text-[#e0e3e5] uppercase leading-none tracking-tight">
          {displayName}
        </h1>
      </div>

      {/* ── Sort & Info Bar ── */}
      <div className="flex flex-col gap-4 py-4 border-b border-[#272a2c]">

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#101415] border border-[#323537] rounded-md px-4 py-2 text-sm text-[#e0e3e5] focus:outline-none focus:border-[#ffc49a] transition-colors"
              />
            </div>
            {/* Budget Input */}
            <div className="relative w-full sm:w-48 flex items-center">
              <span className="absolute left-3 text-[#a28d7e] text-sm">₱</span>
              <input
                type="number"
                placeholder="Max Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-[#101415] border border-[#323537] rounded-md pl-8 pr-4 py-2 text-sm text-[#e0e3e5] focus:outline-none focus:border-[#ffc49a] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#e0e3e5] font-bold w-full sm:w-auto justify-end">
            <span className="text-[#a28d7e] uppercase text-xs tracking-wider">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer uppercase tracking-wider text-[#e0e3e5]"
            >
              <option value="newest" className="bg-[#101415]">Newest Arrivals</option>
              <option value="price_low" className="bg-[#101415]">Price: Low to High</option>
              <option value="price_high" className="bg-[#101415]">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Results Info */}
        <p className="text-sm text-[#a28d7e] font-semibold">
          {!initialLoading ? `${products.length} products - Page ${currentPage} of ${lastPage}` : 'Loading...'}
        </p>
      </div>

      {/* ── Content ── */}
      {initialLoading ? (
        /* Skeleton grid */
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
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

          {/* ── Pagination ── */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <PaginationBtn
              disabled={currentPage === 1 || loading}
              onClick={() => fetchProducts(currentPage - 1, searchQuery, budget, sortOption)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </PaginationBtn>

            <div className="flex items-center gap-2">
              {Array.from({ length: lastPage }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchProducts(i + 1, searchQuery, budget, sortOption)}
                  disabled={loading}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-all duration-200 border
                    ${currentPage === i + 1
                      ? 'bg-[#ffc49a] text-[#4f2500] border-[#ffc49a]'
                      : 'border-[#323537] text-[#a28d7e] hover:border-[#a28d7e]'
                    }
                  `}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <PaginationBtn
              disabled={!hasMore || loading}
              onClick={() => fetchProducts(currentPage + 1, searchQuery, budget, sortOption)}
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </PaginationBtn>
          </div>
        </>
      ) : (
        /* Empty state */
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
          <Link href="/"
            className="px-6 py-2.5 bg-[#ffc49a] text-[#4f2500] font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:bg-[#ff9d4d]"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}