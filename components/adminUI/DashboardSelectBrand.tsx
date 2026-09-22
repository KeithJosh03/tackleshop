'use client';

import React, { useState, useEffect } from "react";

import { BrandProps } from "@/types/brandType";
import { BrandListNameSearchHeader } from "@/lib/api/brandService";
import { ProductFormAction } from "@/lib/reducer/productFormReducer";

import DropDownText from "@/components/ui/DropDownText";
import SearchText from "../SearchText";

type ReducerType = 'CREATE' | 'EDIT' | 'FILTER';

interface BrandComponentProps {
  dispatchProductDetailCreate?: React.Dispatch<ProductFormAction>;
  reducerType: ReducerType;
  choosenBrand: BrandProps | null;
  onSelectBrand?: (brand: BrandProps | null) => void;
  customPlaceholder?: string;
}

const DashboardSelectBrand: React.FC<BrandComponentProps> = ({
  dispatchProductDetailCreate,
  reducerType,
  choosenBrand,
  onSelectBrand,
  customPlaceholder,
}) => {
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<BrandProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<BrandProps | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData: BrandProps[] = await BrandListNameSearchHeader();
        setBrands(brandsData || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (!choosenBrand) {
      setSelectedBrand(null);
      setSearchTerm('');
      return;
    }
    setSelectedBrand(choosenBrand);
    setSearchTerm(choosenBrand.brandName || '');
  }, [choosenBrand]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredBrands(brands);
    } else {
      setFilteredBrands(
        brands.filter((brand) =>
          brand.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, brands]);

  const clearSearch = () => {
    if (dispatchProductDetailCreate) {
      dispatchProductDetailCreate({ type: 'SET_BRAND', payload: null });
    }

    if (reducerType === 'FILTER' && onSelectBrand) {
      onSelectBrand(null);
    }

    setSelectedBrand(null);
    setSearchTerm('');
  };

  const dispatchBrandSelect = (brand: BrandProps) => {
    if (dispatchProductDetailCreate) {
      dispatchProductDetailCreate({
        type: 'SET_BRAND',
        payload: brand,
      });
    }

    if (reducerType === 'FILTER' && onSelectBrand) {
      onSelectBrand(brand);
    }

    setSelectedBrand(brand);
    setSearchTerm(brand.brandName);
    setIsFocused(false);
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
        onBlur={() => setTimeout(() => setIsFocused(false), 300)}
      />
      {isFocused && (
        <ul className="absolute top-full left-0 right-0 mt-1.5 z-[100] list-none bg-[#16202c] border rounded-xl border-[#3d4859] shadow-2xl shadow-black/80 max-h-56 overflow-y-auto custom-scrollbar ring-1 ring-white/10 py-1">
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
              <DropDownText
                key={brand.brandId}
                onClick={() => dispatchBrandSelect(brand)}
                indexKey={brand.brandId}
                listName={brand.brandName.toUpperCase()}
                isSelected={selectedBrand?.brandId === brand.brandId}
              />
            ))
          ) : (
            <li className="px-4 py-3 text-xs text-[#a6a7a6] text-center font-medium">
              No brands found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DashboardSelectBrand;