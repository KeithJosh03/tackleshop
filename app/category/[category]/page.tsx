'use client';

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import CardsLayoutCategory from "./CardsLayout";
import CategoryCards from "./CategoryCards";

import { fetchCategoryProducts } from "@/lib/api/categoryService";
import { CategorizeProduct } from "@/types/dataprops";

export default function Category() {
  const { category } = useParams<{ category: string }>();

  const [products, setProducts] = useState<CategorizeProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  /* ===========================
     Fetch Products (PAGE ONLY)
  ============================ */
  const fetchProducts = useCallback(async (page: number) => {
    if (loading) return;

    setLoading(true);

    try {
      const data = await fetchCategoryProducts(
        category.replaceAll("-", " "),
        page
      );

      if (!data) return;

      // 🔒 REPLACE PRODUCTS (NO APPEND)
      setProducts(data.categoryproducts.products);
      setCurrentPage(data.currentPage);
      setLastPage(data.lastPage);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [category, loading]);

  /* ===========================
     Initial Load / Category Change
  ============================ */
  useEffect(() => {
    setInitialLoading(true);
    setProducts([]);
    setCurrentPage(1);

    fetchProducts(1);
  }, [category]); // ❗ intentionally no fetchProducts here

  /* ===========================
     Render
  ============================ */
  return (
    <>
      <div className="flex">
        <h4 className="text-primaryColor font-extrabold text-5xl p-4">
          {category.replaceAll("-", " ").toUpperCase()}
        </h4>
      </div>

      {initialLoading ? (
        <div className="h-96 flex items-center justify-center text-primaryColor font-bold">
          Loading products...
        </div>
      ) : products.length > 0 ? (
        <>
          <CardsLayoutCategory>
            {products.map((product) => (
              <CategoryCards
                key={product.productId}
                index={product.productId}
                product={product}
              />
            ))}
          </CardsLayoutCategory>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => fetchProducts(currentPage - 1)}
              className="px-4 py-2 bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-2 font-bold text-primaryColor">
              Page {currentPage} of {lastPage}
            </span>

            <button
              disabled={!hasMore || loading}
              onClick={() => fetchProducts(currentPage + 1)}
              className="px-4 py-2 bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="h-96 text-center text-primaryColor font-bold">
          <h3>No {category.toUpperCase()} Available</h3>
          <Link href="/">
            <button className="bg-secondary text-md font-extrabold button-view mt-10">
              Go Back
            </button>
          </Link>
        </div>
      )}
    </>
  );
}
