'use client';
import React, { useEffect, useState } from 'react';

// API
import { showCategories, CategoryPropsResponse } from '@/lib/api/categoryService';

// Components
import DropDownText from '@/components/ui/DropDownText';
import SearchText from '../SearchText';

// Reducers
import { ProductDetailActionCreate } from "@/lib/reducer/productReducer";


import { CategoryProps } from '@/types/categoryType';


import { ProductDetailActionEdit } from '@/lib/reducer/editProductReducer';

type ReducerType = 'CREATE' | 'EDIT' | 'FILTER'

interface CategoryPropsComponent {
  dispatchProductDetailCreate?: React.Dispatch<ProductDetailActionCreate>;
  ProductDetailEditReducer?: React.Dispatch<ProductDetailActionEdit>;
  ReducerType: ReducerType;
  currentCategory: CategoryProps | null;
  onSelectCategory?: (category: CategoryProps | null) => void;
  customPlaceholder?: string;
}

export default function DashboardSelectCategory(
  {
    ProductDetailEditReducer,
    dispatchProductDetailCreate,
    ReducerType,
    currentCategory,
    onSelectCategory,
    customPlaceholder
  }: CategoryPropsComponent) {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryProps | null>();
  const [filteredCategories, setFilteredCategories] = useState<CategoryProps[]>([]);
  const [isFocused, setIsFocused] = useState(false);

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
    if (selectedCategory?.categoryName.toLowerCase() === searchTerm.toLowerCase()) {
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
    if (currentCategory === null) {
      setSelectedCategory(null)
      setSearchTerm('');
      return;
    };
    setSelectedCategory(currentCategory);
    setSearchTerm(currentCategory.categoryName);
  }, [currentCategory])


  const handleCategorySelect = (category: CategoryProps) => {
    if (ReducerType === 'EDIT' && ProductDetailEditReducer) {
      ProductDetailEditReducer({
        type: 'UPDATE_CATEGORY',
        payload: category
      })
    }

    if (ReducerType === 'CREATE' && dispatchProductDetailCreate) {
      dispatchProductDetailCreate({
        type: 'UPDATE_CATEGORY',
        payload: category
      })
    }

    if (ReducerType === 'FILTER' && onSelectCategory) {
      onSelectCategory(category);
    }
  };


  const clearInputs = () => {
    if (ReducerType === 'CREATE' && dispatchProductDetailCreate) {
      dispatchProductDetailCreate({
        type: 'REMOVE_CATEGORY'
      })
      dispatchProductDetailCreate({
        type: 'SELECT_SUBCATEGORY_DELETE'
      })
    }
    if (ReducerType === 'EDIT' && ProductDetailEditReducer) {
      ProductDetailEditReducer({
        type: 'REMOVE_CATEGORY'
      })
      ProductDetailEditReducer({
        type: 'REMOVE_SUBCATEGORY'
      })
    }
    if (ReducerType === 'FILTER' && onSelectCategory) {
      onSelectCategory(null);
    }
    setFilteredCategories([])
    setSearchTerm('')
  }

  return (
    <div className="flex-1 flex flex-col relative w-full">
      <SearchText
        choosen={selectedCategory}
        placeholderText={customPlaceholder || "Search Category..."}
        onClear={clearInputs}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />
      {isFocused && filteredCategories.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 z-[60] list-none bg-[#1e2a38] border rounded-xl border-[#3d4859] shadow-2xl shadow-black/60 max-h-56 overflow-y-auto custom-scrollbar ring-1 ring-white/5">
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
