"use client";

import React, { useEffect, useState, useRef } from "react";
import { searchProductsTitleSearchBar } from "@/lib/api/productService";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { ProductSearchProps } from "@/types/dataprops";
import slugify from "slugify";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ProductSearchProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search debounce
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounce = setTimeout(() => {
      searchProductsTitleSearchBar(search)
        .then((products) => setResults(products))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <>
      {/* Search Trigger Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open search"
          className="p-1.5 text-ma-primary/70 hover:text-ma-primary transition-colors flex items-center justify-center cursor-pointer"
        >
          <Search className="w-5 h-5 md:w-[18px] md:h-[18px]" strokeWidth={1.8} />
        </button>
      ) : (
        /* Full Viewport Header Overlay Search */
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-0 bg-[#14181a] border-b border-[#ffc49a]/30 px-4 py-3 flex items-center justify-center z-[9999] shadow-2xl"
          >
            <div className="w-full max-w-4xl flex items-center gap-3 bg-black/80 border border-[#ffc49a]/40 rounded-xl h-12 px-4 shadow-inner">
              <Search className="w-5 h-5 text-[#ffc49a] shrink-0" strokeWidth={2.2} />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="w-full bg-transparent text-sm md:text-base font-semibold focus:outline-none placeholder-[#ffc49a]/40 text-white"
              />
              {isLoading && <Loader2 className="w-5 h-5 text-[#ffc49a] animate-spin shrink-0" />}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearch("");
                  setResults([]);
                }}
                aria-label="Close search"
                className="p-1.5 text-[#ffc49a]/70 hover:text-[#ffc49a] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" strokeWidth={2.2} />
              </button>
            </div>

            {/* Search Results Dropdown */}
            {search.trim() && (results.length > 0 || isLoading) && (
              <div className="absolute top-full left-0 right-0 bg-[#14181a] border-b border-[#ffc49a]/30 backdrop-blur-2xl shadow-2xl py-3 max-h-[60vh] overflow-y-auto custom-scrollbar px-4 z-[10000]">
                <div className="max-w-4xl mx-auto">
                  {isLoading && results.length === 0 ? (
                    <div className="py-8 text-center text-sm text-[#ffc49a]/60 font-semibold flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#ffc49a]" />
                      Searching for "{search}"...
                    </div>
                  ) : results.length === 0 ? (
                    <div className="py-8 text-center text-sm text-[#ffc49a]/60 font-semibold text-white/75">
                      No products found for "{search}"
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-1.5">
                      {results.map(({ productTitle, productId }) => (
                        <li key={productId}>
                          <Link
                            href={`/product-details/${productId}/${slugify(productTitle).toLowerCase()}`}
                            onClick={() => {
                              setIsOpen(false);
                              setSearch("");
                              setResults([]);
                            }}
                            className="block px-4 py-3 text-sm font-semibold text-[#ffc49a]/90 hover:text-white hover:bg-[#ffc49a]/15 rounded-xl transition-all truncate"
                          >
                            {productTitle}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}