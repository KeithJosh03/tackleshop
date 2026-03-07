"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { ProductSearchProps } from "@/types/dataprops";
import slugify from "slugify";

interface ProductSearchResponse {
  status: boolean;
  products: ProductSearchProps[];
}

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

  // handle search debounce
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounce = setTimeout(() => {
      axios
        .get<ProductSearchResponse>(`/api/products/productsearch?productTitle=${search}`)
        .then((res) => {
          setResults(res.data.products || []);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="relative flex items-center justify-start md:justify-center w-full h-11 z-[1001]">
      {/* Search Input Container */}
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="search-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
            className="p-2.5 rounded-xl bg-blackgroundColor/50 hover:bg-primaryColor/20 text-primaryColor transition-colors border border-greyColor/30 hover:border-primaryColor/50 shadow-sm flex items-center justify-center cursor-pointer"
          >
            <Search className="w-5 h-5" strokeWidth={2.5} />
          </motion.button>
        ) : (
          <motion.div
            key="search-input"
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 40, opacity: 0, transition: { duration: 0.1 } }}
            transition={{ type: "spring", damping: 22, stiffness: 250 }}
            className="flex items-center w-full bg-blackgroundColor/95 backdrop-blur-md border border-primaryColor/60 rounded-xl h-11 px-3 shadow-[0_0_15px_rgba(232,147,71,0.2)] z-40 overflow-hidden"
          >
            <Search className="w-5 h-5 text-primaryColor shrink-0 hidden sm:block mr-2" strokeWidth={2.5} />

            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent py-1 text-sm font-semibold focus:outline-none placeholder-primaryColor/50 text-tertiaryColor"
            />

            {isLoading ? (
              <Loader2 className="w-5 h-5 text-primaryColor/70 animate-spin shrink-0 ml-2" />
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearch("");
                  setResults([]);
                }}
                className="p-1.5 ml-2 text-primaryColor/70 hover:text-primaryColor hover:bg-primaryColor/10 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && search.trim() && (results.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[3.25rem] left-0 w-full bg-blackgroundColor/95 backdrop-blur-xl border border-greyColor/40 shadow-2xl rounded-2xl overflow-hidden py-2 z-50 pointer-events-auto"
          >
            {isLoading && results.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-primaryColor/60 font-semibold flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primaryColor" />
                Searching for "{search}"...
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-primaryColor/60 font-semibold">
                No products found for "{search}"
              </div>
            ) : (
              <ul className="flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar px-2 gap-1 font-bold text-left">
                {results.map(({ productTitle, productId }) => (
                  <li key={productId}>
                    <Link
                      href={`/product/${productId}/${slugify(productTitle).toLowerCase()}`}
                      onClick={() => {
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className="block px-4 py-3 text-[15px] leading-tight text-primaryColor/80 hover:text-primaryColor hover:bg-primaryColor/15 rounded-xl transition-all truncate"
                    >
                      {productTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
