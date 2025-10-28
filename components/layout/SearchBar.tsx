"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

import { searchicon } from "@/public"; 
import { motion, AnimatePresence } from "framer-motion";

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



  // handle search debounce
  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      axios
        .get<ProductSearchResponse>(`/api/products/productsearch/${search}`)
        .then((res) => setResults(res.data.products))
        .catch((err) => console.error(err));
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);


  return (
    <div className="relative flex items-center text-md font-extrabold">
      {/* Circle button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full bg-secondary hover:text-primaryColor transition"
        >
          <Image 
          src={searchicon} 
          alt="Search" 
          width={22} 
          height={22} 
          />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 250, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center bg-primaryColor rounded-full px-2 h-10"
          >
            <Image 
            src={searchicon} 
            alt="Search" 
            width={22} height={22} 
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent px-2 py-1 focus:outline-none placeholder-tertiaryColor text-tertiaryColor"
            />
            <button
              onClick={() => {
                setIsOpen(false);
                setSearch("");
                setResults([]);
              }}
              className="p-1 text-tertiaryColor cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {results.length > 0 && isOpen && (
        <div className="absolute top-11 left-0 w-64 bg-mainBackgroundColor flex flex-col gap-1 text-primaryColor rounded-md z-50 px-1 py-2">
          {results.map(({productName, productId}) => (
            <Link
              key={productId}
              href={`/product/${productId}/${slugify(productName).toLowerCase()}`}
              className="block px-4 py-2 text-primaryColor bg-secondary rounded hover:bg-primaryColor hover:text-tertiaryColor "
            >
              {productName}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
