'use client';
import React, { useEffect, useState } from 'react';
import { showCategories, CategoryPropsResponse } from '@/lib/api/categoryService';
import { CategoryProps } from '@/types/dataprops';

import DropDownText from '@/components/DropDownText';
import SearchText from './SearchText';

import { Category } from '@/types/categoryType';

import { ProductDetailActionCreate } from "../app/admin/dashboard/addproduct/page";
import { ProductDetailActionEdit } from "@/app/admin/dashboard/editproduct/[productId]/ProductClientEdit";


type ReducerType = 'CREATE' | 'EDIT'

interface CategoryPropsComponent {
  dispatchProductDetailCreate?:React.Dispatch<ProductDetailActionCreate>; 
  ProductDetailEditReducer?: React.Dispatch<ProductDetailActionEdit>;
  ReducerType:ReducerType;
  currentCategory: Category | null;
}

export default function DashboardSelectCategory(
  {
    ProductDetailEditReducer,
    dispatchProductDetailCreate,
    ReducerType,
    currentCategory
  } : CategoryPropsComponent) {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryProps | null>();
  const [filteredCategories, setFilteredCategories] = useState<CategoryProps[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesList: CategoryPropsResponse = await showCategories();
        setCategories(categoriesList.categories);
        setFilteredCategories(categoriesList.categories); 
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if(selectedCategory?.categoryName.toLowerCase() === searchTerm.toLowerCase()){
      setFilteredCategories([])
      return;
    } else {
      setSelectedCategory(undefined)
    }
    setFilteredCategories(
      categories.filter((category) =>
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, categories, selectedCategory]);

  useEffect(() => {
    if(currentCategory === null){
      setSelectedCategory(null)
      setSearchTerm(''); 
      return;
    };
      setSelectedCategory(currentCategory);
      setSearchTerm(currentCategory.categoryName); 
  },[currentCategory])


  const handleCategorySelect = (category: CategoryProps) => {
    if(ReducerType === 'EDIT' && ProductDetailEditReducer){
      ProductDetailEditReducer({
        type:'UPDATE_CATEGORY',
        payload:category
      })
    }

    if(ReducerType === 'CREATE' && dispatchProductDetailCreate){
      dispatchProductDetailCreate({
        type:'UPDATE_CATEGORY',
        payload:category
      })
    }
  };


  const clearInputs = () => {
    if(ReducerType === 'CREATE' && dispatchProductDetailCreate){
      dispatchProductDetailCreate({
      type:'REMOVE_CATEGORY'
      })
      dispatchProductDetailCreate({
      type:'SELECT_SUBCATEGORY_DELETE'
      })
    }
    if(ReducerType === 'EDIT' && ProductDetailEditReducer){
      ProductDetailEditReducer({
        type:'REMOVE_CATEGORY'
      })
      ProductDetailEditReducer({
        type:'REMOVE_SUBCATEGORY'
      })
    }
    setFilteredCategories([])
    setSearchTerm('')
  }


  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-primaryColor text-xl">SELECT CATEGORY</h1>
      <SearchText
        choosen={selectedCategory} 
        placeholderText="Search Category"
        onClear={clearInputs}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredCategories.length > 0 && (
        <ul className="list-none bg-secondary border rounded border-primaryColor text-base max-h-40 overflow-y-auto">
          {filteredCategories.map((category) => (
            <DropDownText 
              onClick={() => handleCategorySelect(category)} 
              key={category.categoryId} 
              indexKey={category.categoryId} 
              listName={category.categoryName}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
