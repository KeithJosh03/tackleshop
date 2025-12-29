'use client';

import React, { useState, useEffect } from "react";
import { ProductDetailAction } from "../app/admin/dashboard/products/addproduct/page";
import { showBrand } from "@/lib/api/brandService";
import { BrandProps } from "@/types/dataprops";

import DropDownText from "@/components/DropDownText";
import SearchTextAdmin from "@/components/SearchTextAdmin";
import SearchTextTest from "@/components/InputTextTest";


interface BrandsResponse {
  status: boolean;
  brands: BrandProps[];
}

interface BrandComponentProps {
  dispatchProductDetail: React.Dispatch<ProductDetailAction>; 
}

const DashboardSelectBrand: React.FC<BrandComponentProps> = ({ dispatchProductDetail }) => {
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<BrandProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<BrandProps | undefined>();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData: BrandsResponse = await showBrand();
        setBrands(brandsData.brands);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

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

  const handleSelectBrand = (brand: BrandProps) => {
    setSelectedBrand(brand);
    setSearchTerm(brand.brandName);
    dispatchProductDetail({ 
    type: 'SELECT_BRAND', payload: brand.brandId 
    });
  };

  const clearSearch = () => {
    dispatchProductDetail({
    type:'SELECT_BRAND_DELETE'
    })
    setSearchTerm('')
    setSelectedBrand(undefined)
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-primaryColor text-xl">SELECT BRAND</h1>
      <SearchTextTest
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
              onClick={() => handleSelectBrand(brand)} 
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
