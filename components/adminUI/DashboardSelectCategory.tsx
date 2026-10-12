'use client';

import React, { useEffect, useState } from 'react';

// API
import { showCategories, CategoryPropsResponse } from '@/lib/api/categoryService';

// Components
import DropDownText from '@/components/ui/DropDownText';
import SearchText from '../SearchText';

// Reducers
import { ProductFormAction } from "@/lib/reducer/productFormReducer";
import { CategoryProps } from '@/types/categoryType';

type ReducerType = 'CREATE' | 'EDIT' | 'FILTER';

interface CategoryPropsComponent {
  dispatchProductDetailCreate?: React.Dispatch<ProductFormAction>;
  ReducerType: ReducerType;
  currentCategory: CategoryProps | null;
  onSelectCategory?: (category: CategoryProps | null) => void;
  customPlaceholder?: string;
}

export default function DashboardSelectCategory({
  dispatchProductDetailCreate,
  ReducerType,
  currentCategory,
  onSelectCategory,
  customPlaceholder
}: CategoryPropsComponent) {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryProps | null>(null);
  const [filteredCategories, setFilteredCategories] = useState<CategoryProps[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesList: CategoryPropsResponse = await showCategories();
        setCategories(categoriesList.categories || []);
        setFilteredCategories(categoriesList.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter((category) =>
          category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, categories]);

  useEffect(() => {
    if (!currentCategory || !currentCategory.categoryId) {
      setSelectedCategory(null);
      setSearchTerm('');
      return;
    }
    setSelectedCategory(currentCategory);
    setSearchTerm(currentCategory.categoryName);
  }, [currentCategory]);

  const handleCategorySelect = (category: CategoryProps) => {
    if (dispatchProductDetailCreate) {
      dispatchProductDetailCreate({
        type: 'SET_CATEGORY',
        payload: category
      });
    }

    if (ReducerType === 'FILTER' && onSelectCategory) {
      onSelectCategory(category);
    }

    setSelectedCategory(category);
    setSearchTerm(category.categoryName);
    setIsFocused(false);
  };

  const clearInputs = () => {
    if (dispatchProductDetailCreate) {
      dispatchProductDetailCreate({
        type: 'SET_CATEGORY',
        payload: null
      });
    }

    if (ReducerType === 'FILTER' && onSelectCategory) {
      onSelectCategory(null);
    }

    setSelectedCategory(null);
    setFilteredCategories(categories);
    setSearchTerm('');
  };

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
      {isFocused && (
        <ul className="absolute top-full left-0 right-0 mt-1.5 z-[100] list-none bg-[#16202c] border rounded-xl border-[#3d4859] shadow-2xl shadow-black/80 max-h-56 overflow-y-auto custom-scrollbar ring-1 ring-white/10 py-1">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <DropDownText
                onClick={() => handleCategorySelect(category)}
                key={category.categoryId}
                indexKey={category.categoryId}
                listName={category.categoryName.toUpperCase()}
                isSelected={selectedCategory?.categoryId === category.categoryId}
              />
            ))
          ) : (
            <li className="px-4 py-3 text-xs text-[#a6a7a6] text-center font-medium">
              No categories found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}