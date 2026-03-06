'use client';

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import CategoryCards from "./CategoryCards";
import { fetchCategoryProducts } from "@/lib/api/categoryService";
import { CategorizeProduct } from "@/types/dataprops";

/* ─── Skeleton card ────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-greyColor bg-blackgroundColor/60 overflow-hidden animate-pulse min-h-[340px] flex flex-col">
      <div className="flex-1 bg-greyColor/20" style={{ minHeight: '220px' }} />
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="h-3 w-3/4 rounded bg-greyColor/30" />
        <div className="h-2 w-1/2 rounded bg-greyColor/20" />
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
      className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        background: disabled ? 'rgba(131,93,50,0.15)' : 'linear-gradient(135deg,#E89347 0%,#b8692e 100%)',
        color: '#fff',
        boxShadow: disabled ? 'none' : '0 0 14px 1px rgba(232,147,71,0.3)',
      }}
    >
      {children}
    </button>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */
export default function Category() {
  const { category } = useParams<{ category: string }>();
  const displayName = category.replaceAll("-", " ").toUpperCase();

  const [products, setProducts] = useState<CategorizeProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchProducts = useCallback(async (page: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await fetchCategoryProducts(category.replaceAll("-", " "), page);
      if (!data) return;
      setProducts(data.categoryproducts.products);
      setCurrentPage(data.currentPage);
      setLastPage(data.lastPage);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [category, loading]);

  useEffect(() => {
    setInitialLoading(true);
    setProducts([]);
    setCurrentPage(1);
    fetchProducts(1);
  }, [category]);

  return (
    <div className="min-h-screen px-6 pb-16 pt-4 md:px-10 flex flex-col gap-8">

      {/* ── Hero Header ── */}
      <div className="relative rounded-2xl overflow-hidden border border-greyColor px-8 py-8 flex flex-col gap-2"
        style={{ background: 'linear-gradient(110deg,rgba(17,26,45,0.98) 0%,rgba(19,29,41,0.9) 100%)' }}>
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(232,147,71,0.15) 0%,transparent 70%)' }} />
        <p className="text-xs font-bold text-secondary uppercase tracking-widest">Browse / Category</p>
        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-widest uppercase leading-tight"
          style={{
            background: 'linear-gradient(90deg, #E89347 0%, #fafaf9 55%, #835d32 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {displayName}
        </h1>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-primaryColor to-transparent" />
        {!initialLoading && (
          <p className="text-sm text-secondary font-semibold mt-1">
            {products.length} product{products.length !== 1 ? 's' : ''} · Page {currentPage} of {lastPage}
          </p>
        )}
      </div>

      {/* ── Content ── */}
      {initialLoading ? (
        /* Skeleton grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
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
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {products.map((product, i) => (
                <CategoryCards key={product.productId} index={i} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── Pagination ── */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <PaginationBtn
              disabled={currentPage === 1 || loading}
              onClick={() => fetchProducts(currentPage - 1)}
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
                  onClick={() => fetchProducts(i + 1)}
                  disabled={loading}
                  className="w-8 h-8 rounded-full text-xs font-bold transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: currentPage === i + 1 ? 'linear-gradient(135deg,#E89347 0%,#b8692e 100%)' : 'rgba(131,93,50,0.15)',
                    color: currentPage === i + 1 ? '#fff' : '#a17a52',
                    boxShadow: currentPage === i + 1 ? '0 0 10px 1px rgba(232,147,71,0.4)' : 'none',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <PaginationBtn
              disabled={!hasMore || loading}
              onClick={() => fetchProducts(currentPage + 1)}
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
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-24">
          <div className="w-20 h-20 rounded-full flex items-center justify-center border border-greyColor"
            style={{ background: 'rgba(232,147,71,0.08)' }}>
            <svg className="w-9 h-9 text-primaryColor" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black text-primaryColor">No Products Found</h3>
            <p className="text-sm text-secondary mt-1">There are no items in <span className="text-primaryColor font-semibold">{displayName}</span> yet.</p>
          </div>
          <Link href="/"
            className="px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider text-white transition-all duration-200"
            style={{ background: 'linear-gradient(135deg,#E89347 0%,#b8692e 100%)', boxShadow: '0 0 16px 2px rgba(232,147,71,0.3)' }}
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
