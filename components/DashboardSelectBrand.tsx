'use client';

import React, { useState, useEffect } from "react";

import { ProductDetailActionCreate } from "../app/admin/dashboard/addproduct/page";
import { ProductDetailActionEdit } from "@/app/admin/dashboard/editproduct/[productId]/ProductClientEdit";
import { BrandProps } from "@/types/brandType";

import { showBrandListName } from "@/lib/api/brandService";

import {
  SearchText,
  DropDownText
} from '@/components/'

type ReducerType = 'CREATE' | 'EDIT'

interface BrandComponentProps {
  dispatchProductDetailCreate?: React.Dispatch<ProductDetailActionCreate>; 
  ProductDetailEditReducer?: React.Dispatch<ProductDetailActionEdit>;
  reducerType: ReducerType;
  choosenBrand: BrandProps | null;
}

const DashboardSelectBrand: React.FC<BrandComponentProps> = (
  { dispatchProductDetailCreate, 
    ProductDetailEditReducer,
    reducerType,
    choosenBrand 
  }) => {
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<BrandProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<BrandProps | null>();
  

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData: BrandProps[] = await showBrandListName();
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if(choosenBrand === null) {
      setSelectedBrand(null);
      setSearchTerm('');
      return
    }
    setSelectedBrand(choosenBrand);
    setSearchTerm(choosenBrand.brandName);
  },[choosenBrand])


  useEffect(() => {
    if(selectedBrand?.brandName.toLowerCase() === searchTerm.toLowerCase()){
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
      type:'REMOVE_BRAND'
      })
    }

    if(reducerType === 'EDIT' && ProductDetailEditReducer){
      ProductDetailEditReducer({
      type:'REMOVE_BRAND'
      })
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
    if(reducerType === 'CREATE' && dispatchProductDetailCreate){
      dispatchProductDetailCreate({
        type:'SELECT_BRAND',
        payload:brand
      })
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-primaryColor text-xl">SELECT BRAND</h1>
      <SearchText
        choosen={selectedBrand} 
        onClear={clearSearch}
        placeholderText="Search Brand"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredBrands.length > 0 && (
        <ul className="list-none bg-secondary border rounded border-primaryColor text-base max-h-40 overflow-y-auto">
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
