import React, { useEffect, useState } from 'react';
import { showCategories, CategoryPropsResponse } from '@/lib/api/categoryService';
import { CategoryProps } from '@/types/dataprops';
import SearchTextAdmin from '@/components/SearchTextAdmin';
import DropDownText from '@/components/DropDownText';
import { ProductDetailAction } from "./page";

interface CategoryPropsComponent {
  dispatchProductDetail:React.Dispatch<ProductDetailAction>; 
}

export default function Category({dispatchProductDetail}: CategoryPropsComponent) {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryProps | null>(null);
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
    if (searchTerm.length !== 0) {
      setFilteredCategories(
        categories.filter((category) =>
          category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, categories]);

  const handleCategorySelect = (category: CategoryProps) => {
    setSelectedCategory(category);
    setSearchTerm(category.categoryName); 
    dispatchProductDetail({
    type:'SELECT_CATEGORY',
    payload:category.categoryId
    })
  };

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-primaryColor text-xl">SELECT CATEGORY</h1>
      <SearchTextAdmin 
        placeholderText="Search Category"
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
