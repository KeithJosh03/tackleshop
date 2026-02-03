'use client';
import React, { useEffect, useState } from 'react'
import { showSubCategory } from '@/lib/api/categoryService'
import { Category } from '@/types/categoryType';


import { SubCategory } from '@/types/subCategoryTypes';

import DropDownText from '@/components/DropDownText'
import SearchText from './SearchText'

// ACTION TYPES REDUCER
import { ProductDetailActionCreate } from '../app/admin/dashboard/addproduct/page'
import { ProductDetailActionEdit } from "@/app/admin/dashboard/editproduct/[productId]/ProductClientEdit";

interface SubCategorySelectionProps {
  currentCategory?: Category | null;
  currentSubCategory?:SubCategory | null;
  ReducerType: 'EDIT' | 'CREATE';
  ProductDetailEditReducer?: React.Dispatch<ProductDetailActionEdit>;
  dispatchProductDetailCreate?: React.Dispatch<ProductDetailActionCreate>; 
}

const DashboardSelectSubCategory: React.FC<SubCategorySelectionProps> = (
  { currentCategory ,
    ReducerType,
    currentSubCategory,
    dispatchProductDetailCreate,
    ProductDetailEditReducer
  }) => {
  const [subCategories, setSubCategories] = useState<SubCategory[] | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>() 
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if(currentCategory === null){
      clearSearch();
      return;
    }

    if(currentSubCategory === null || selectedSubCategory === null){
      const fetchSubCategory = async () => {
        try {
          const fetchSubCategories: SubCategory[] | null = await showSubCategory(Number(currentCategory?.categoryId));
          setSubCategories(fetchSubCategories);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setLoading(false);
        }
      };
      fetchSubCategory()
      return;
    }

    if(currentSubCategory !== null){
      setSelectedSubCategory(currentSubCategory)
      setSearchTerm(String(currentSubCategory?.subCategoryName)); 
    }

    setLoading(false)
  }, [currentCategory,currentSubCategory]);



  useEffect(() => {
    if(selectedSubCategory?.subCategoryName.toLowerCase() === searchTerm.toLowerCase()){
      setFilteredSubCategories([])
      return;
    } else {
      setSelectedSubCategory(undefined)
    }

    if (subCategories) {
      setFilteredSubCategories(
        subCategories.filter((subCategory) =>
          subCategory.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, subCategories]);


  
  const clearInputs = () => {
    setSearchTerm('')
    setSelectedSubCategory(null)
    setFilteredSubCategories([])
  }

  const handleSelectSubCategory = (subCategory: SubCategory) => {
    if(ReducerType === 'EDIT' && ProductDetailEditReducer){
      ProductDetailEditReducer({
        type:'UPDATE_SUBCATEGORY',
        payload:subCategory
      })
    }
    if(ReducerType === 'CREATE' && dispatchProductDetailCreate){
      dispatchProductDetailCreate({
        type:'SELECT_SUBCATEGORY',
        payload:subCategory
      })
    }
    setSelectedSubCategory(subCategory)
    setSearchTerm(subCategory.subCategoryName); 
  };

  const clearSearch = () => {
    if(ReducerType === 'EDIT' && ProductDetailEditReducer){
      ProductDetailEditReducer({
        type:'REMOVE_SUBCATEGORY',
      })
    }
    if(ReducerType === 'CREATE' && dispatchProductDetailCreate){
      dispatchProductDetailCreate({
        type:'SELECT_SUBCATEGORY_DELETE'
      })
    }
    clearInputs();
  }

  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-primaryColor text-xl">SELECT SUBCATEGORY</h1>
      <SearchText 
        onClear={clearSearch}
        choosen={selectedSubCategory}
        placeholderText="Search Subcategory"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredSubCategories.length > 0 && (
        <ul className="list-none bg-secondary border rounded border-primaryColor text-base max-h-40 overflow-y-auto">
          {filteredSubCategories.map((subCategory) => (
            <DropDownText 
              onClick={() => handleSelectSubCategory(subCategory)} 
              key={subCategory.subCategoryId} 
              indexKey={subCategory.subCategoryId} 
              listName={subCategory.subCategoryName}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardSelectSubCategory;
