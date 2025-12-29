'use client';
import React, { useEffect, useState } from 'react';
import { showCategories, CategoryPropsResponse } from '@/lib/api/categoryService';
import { CategoryProps } from '@/types/dataprops';

import DropDownText from '@/components/DropDownText';
import SearchTextTest from '@/components/InputTextTest';

import { ProductDetailAction } from "../app/admin/dashboard/products/addproduct/page";

interface CategoryPropsComponent {
  dispatchProductDetail:React.Dispatch<ProductDetailAction>; 
}

export default function DashboardSelectCategory({dispatchProductDetail}: CategoryPropsComponent) {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryProps | undefined>();
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

  const handleCategorySelect = (category: CategoryProps) => {
    setSelectedCategory(category);
    setSearchTerm(category.categoryName); 
    dispatchProductDetail({
    type:'SELECT_CATEGORY',
    payload:category.categoryId
    })
  };


  const clearInputs = () => {
    setSelectedCategory(undefined)
    setFilteredCategories([])
    setSearchTerm('')
  }


  const clearSearch = () => {
    clearInputs()
    dispatchProductDetail({
    type:'SELECT_CATEGORY_DELETE'
    })
  }

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-primaryColor text-xl">SELECT CATEGORY</h1>
      <SearchTextTest
        choosen={selectedCategory} 
        placeholderText="Search Category"
        onClear={clearSearch}
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
