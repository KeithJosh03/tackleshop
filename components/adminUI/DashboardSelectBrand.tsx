'use client';

import React, { useState, useEffect } from "react";

import { ProductDetailActionCreate } from "@/lib/reducer/productReducer";
import { ProductDetailActionEdit } from "@/lib/reducer/editProductReducer";
import { BrandProps } from "@/types/brandType";

import { BrandListNameSearchHeader } from "@/lib/api/brandService";

import {
  SearchText,
  DropDownText
} from '@/components/'

type ReducerType = 'CREATE' | 'EDIT' | 'FILTER'

interface BrandComponentProps {
  dispatchProductDetailCreate?: React.Dispatch<ProductDetailActionCreate>;
  ProductDetailEditReducer?: React.Dispatch<ProductDetailActionEdit>;
  reducerType: ReducerType;
  choosenBrand: BrandProps | null;
  onSelectBrand?: (brand: BrandProps | null) => void;
  customPlaceholder?: string;
}

const DashboardSelectBrand: React.FC<BrandComponentProps> = (
  { dispatchProductDetailCreate,
    ProductDetailEditReducer,
    reducerType,
    choosenBrand,
    onSelectBrand,
    customPlaceholder
  }) => {
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<BrandProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<BrandProps | null>();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData: BrandProps[] = await BrandListNameSearchHeader();
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (choosenBrand === null) {
      setSelectedBrand(null);
      setSearchTerm('');
      return
    }
    setSelectedBrand(choosenBrand);
    setSearchTerm(choosenBrand.brandName);
  }, [choosenBrand])


  useEffect(() => {
    if (selectedBrand?.brandName.toLowerCase() === searchTerm.toLowerCase()) {
      setFilteredBrands([])
      return;
    } else {
      setSelectedBrand(undefined)
    }

    setFilteredBrands(
      brands.filter((brand) =>
        brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, brands]);

  const clearSearch = () => {
    if (reducerType === 'CREATE' && dispatchProductDetailCreate) {
      dispatchProductDetailCreate({
        type: 'REMOVE_BRAND'
      })
    }

    if (reducerType === 'EDIT' && ProductDetailEditReducer) {
      ProductDetailEditReducer({
        type: 'REMOVE_BRAND'
      })
    }

    if (reducerType === 'FILTER' && onSelectBrand) {
      onSelectBrand(null);
    }

    setSearchTerm('')
  }

  const dispatchBrandSelect = (brand: BrandProps) => {
    if (reducerType === 'EDIT' && ProductDetailEditReducer) {
      ProductDetailEditReducer({
        type: 'UPDATE_BRAND',
        payload: brand
      });
    }
    if (reducerType === 'CREATE' && dispatchProductDetailCreate) {
      dispatchProductDetailCreate({
        type: 'SELECT_BRAND',
        payload: brand
      })
    }
    if (reducerType === 'FILTER' && onSelectBrand) {
      onSelectBrand(brand);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full">
      <SearchText
        choosen={selectedBrand}
        onClear={clearSearch}
        placeholderText={customPlaceholder || "Search Brand..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />
      {isFocused && filteredBrands.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 z-[60] list-none bg-[#1e2a38] border rounded-xl border-[#3d4859] shadow-2xl shadow-black/60 max-h-56 overflow-y-auto custom-scrollbar ring-1 ring-white/5">
          {filteredBrands.map((brand) => (
            <DropDownText
              onClick={() =>
                dispatchBrandSelect(brand)
              }
              key={brand.brandId}
              indexKey={brand.brandId}
              listName={brand.brandName}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardSelectBrand;
