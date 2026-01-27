'use client';
import { worksans } from '@/types/fonts';
import { useEffect, useState } from 'react';
import { SubCategoryProps, CategorySubProps } from '@/types/dataprops';
import axios from 'axios';

import SearchTextAdmin from '@/components/SearchTextAdmin';
import DropDownText from '@/components/DropDownText';
import IconButton from '@/components/IconButton';
import DashBoardButtonLayoutOption from '@/components/DashBoardButtonLayoutOption';



import { 
  CategoryProps,
  selectedCategorySubCategory,
  selectedCategorySubCategoriesProps,
  deleteCategory,
  editCategory,
  addCategory
} from '@/lib/api/categoryService';

import { 
  addSubCategory, 
  editSubCategory, 
  deleteSubCategory 
} from '@/lib/api/subCategoryService';

type Props = {
  categorylist: CategoryProps[];
};

export default function DashboardCategoryClient({categorylist} : Props) {
  const [categories, setCategories] = useState<CategoryProps[]>(categorylist);
  const [subCategory, setsubCategory] = useState<selectedCategorySubCategoriesProps[]>([]);

  const [selectedCategory, setselectedCategory] = useState<CategoryProps | null>();
  const [selectedSubCategory,setselectSubCategory] = useState<selectedCategorySubCategoriesProps | null>();
  
  // Search
  const [searchCategory, setsearchCategory] = useState('');
  const [searchSubcategory, setsearchSubcategory] = useState('');

  // Create
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isCreatingSubcategory, setisCreatingSubcategory] = useState(false);
  const [newSubcategory, setnewSubcategory] = useState('');
  
  // Editing
  const [isEditingCategory, setisEditingCategory] = useState(false);
  const [newEditCategoryName, setEditCategoryName] = useState('');
  const [isEditingSubCategory, setisEditingSubCategory] = useState(false);
  const [newEditingSubCategoryName, setnewEditingSubCategoryName] = useState('');

  useEffect(() => {
    if (!selectedCategory?.categoryId) return;

    const fetchSubCategories = async () => {
      try {
        const subCategories = await selectedCategorySubCategory({
          categoryId: selectedCategory.categoryId,
        });
        setsubCategory(subCategories);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubCategories();
  }, [selectedCategory?.categoryId]);
  
  const handleSearchChangeSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchSubcategory(e.target.value);
  };


  // ADD CATEGORY
  const handleAddCategory = async () => {
    if (!newCategory) return;

    const createdCategory = await addCategory({ category_name: newCategory });

    if (createdCategory) {
      setCategories([...categories, createdCategory]);
      setIsCreatingCategory(false);
      setNewCategory('');
      console.log(`Category "${createdCategory.categoryName}" added successfully.`);
    } else {
      console.error('Failed to add category.');
    }
  };

  // EDIT CATEGORY
  const handleEditCategory = async () => {
    if (!newEditCategoryName.length || !selectedCategory) return;

    const updatedCategory = await editCategory(selectedCategory.categoryId, {
      category_name: newEditCategoryName,
    });

    if (updatedCategory) {
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.categoryId === updatedCategory.categoryId
            ? { ...category, categoryName: updatedCategory.categoryName }
            : category
        )
      );
      setEditCategoryName('');
      setselectedCategory(null);
      setisEditingCategory(false);
      console.log(`Category with ID ${updatedCategory.categoryId} updated successfully.`);
    } else {
      console.error("Failed to update category.");
    }
  };

  // DELETE CATEGORY
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    const categoryId = selectedCategory.categoryId;

    try {
      const success = await deleteCategory(categoryId);

      if (success) {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.categoryId !== categoryId)
        );
        setselectedCategory(null);
        setsubCategory([]); // Clear subcategories when category is deleted
        console.log(`Category deleted successfully.`);
      } else {
        console.error('Failed to delete category.');
      }
    } catch (error) {
      console.error(`Error deleting category: ${error}`);
    }
  };

// ADD SUBCATEGORY
const handleAddSubCategegory = async () => {
  if (!selectedCategory || !newSubcategory.length) return;

  const createdSubCategory = await addSubCategory({
    category_id: selectedCategory.categoryId,
    sub_category_name: newSubcategory,
  });

  if (createdSubCategory) {
    setsubCategory([...subCategory, createdSubCategory]);
    setisCreatingSubcategory(false);
    setnewSubcategory('');
    console.log(`Subcategory "${createdSubCategory.subCategoryName}" added successfully.`);
  } else {
    console.error('Failed to add subcategory.');
  }
};

// EDIT SUBCATEGORY
const handleEditSubCategory = async () => {
  if (!selectedSubCategory || !newEditingSubCategoryName.length) return;

  const updatedSubCategory = await editSubCategory(
    selectedSubCategory.subCategoryId,
    { sub_category_name: newEditingSubCategoryName }
  );

  if (updatedSubCategory) {
    setsubCategory((prevSubCategories) =>
      prevSubCategories.map((subcategory) =>
        subcategory.subCategoryId === updatedSubCategory.subCategoryId
          ? { ...subcategory, subCategoryName: updatedSubCategory.subCategoryName }
          : subcategory
      )
    );
    setisEditingSubCategory(false);
    setselectSubCategory(null);
    setnewEditingSubCategoryName('');
    console.log(`Subcategory "${updatedSubCategory.subCategoryName}" updated successfully.`);
  } else {
    console.error('Failed to update subcategory.');
  }
};

// DELETE SUBCATEGORY
const handleDeleteSubCategory = async () => {
  if (!selectedSubCategory) return;

  const success = await deleteSubCategory(selectedSubCategory.subCategoryId);

  if (success) {
    setsubCategory((prevSubcategories) =>
      prevSubcategories.filter(
        (subcategory) => subcategory.subCategoryId !== selectedSubCategory.subCategoryId
      )
    );
    setselectSubCategory(null);
    console.log(`Subcategory deleted successfully.`);
  } else {
    console.error('Failed to delete subcategory.');
  }
};

return (
  <div className='bg-blackgroundColor border border-greyColor font-extrabold rounded p-4 w-full flex flex-col space-y-1'>
    <h3 className="text-base text-primaryColor">
      CATEGORY 
      {categories.length === 0 && (
      <span className='text-secondary'> ( No Category Available)</span>
      )}
    </h3>
    <div className="flex items-center gap-x-2 text-xl">
      <SearchTextAdmin 
      placeholderText='Search Category'
      value={searchCategory}
      onChange={(e) => {setsearchCategory(e.target.value)}}
      />
      <IconButton 
      icon='/icons/addicon.svg'
      altText='Add Icon'
      onClick={() => {
      setIsCreatingCategory(true)
      setselectedCategory(null)
      setselectSubCategory(null)
      }}
      iconSize={8}
      />
    </div>

    {categories.length > 0 && (
      <ul className="list-none bg-secondary border rounded border-primaryColor text-base mt-1 max-h-40 overflow-y-auto">
        {categories.map((category) => (
          <DropDownText 
          key={category.categoryId}
          onClick={() => {
          setselectedCategory(category)
          setIsCreatingCategory(false)
          setselectSubCategory(null)
          }}
          indexKey={category.categoryId}
          listName={category.categoryName}
          />
        ))}
      </ul>
    )}

    {selectedCategory && (
      <div className="mt-4 text-primaryColor border border-greyColor p-4 rounded">
        <div className='flex flex-row justify-between p-2'>
          <h3 className="text-base text-secondary">CATEGORY SELECTED  - <span className='text-primaryColor'>{selectedCategory.categoryName.toUpperCase()}</span></h3>
          <IconButton 
          icon='/icons/closeicon.svg'
          altText='close Icon'
          onClick={() => {setselectedCategory(null)}}
          iconSize={8}
          />
        </div>
        <div className="flex flex-col items-center gap-y-4">
          <DashBoardButtonLayoutOption>
            {!isEditingCategory ? (
            <>
            <IconButton 
            icon='/icons/editicon.svg'
            altText='close Icon'
            onClick={() => {setisEditingCategory(true)}}
            iconSize={8}
            />

            <IconButton 
            icon='/icons/deleteicon.svg'
            altText='delete Icon'
            onClick={handleDeleteCategory}
            iconSize={8}
            />
            </>
            ):(
            <>
            <SearchTextAdmin 
            placeholderText='Edit Category'
            value={newEditCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
            />
            <IconButton
            icon='/icons/checkicon.svg'
            altText='Check Icon'
            onClick={handleEditCategory}
            iconSize={8}
            />
            </>
            )}
          </DashBoardButtonLayoutOption>
        </div>
        <div className='border border-greyColor p-4 rounded mt-2'>

          <h3 className="text-base text-primaryColor">
            SUB CATEGORY 
            {subCategory.length === 0 && (
            <span className='text-secondary'> ( No SubCategory Available)</span>
            )}
          </h3>

          <div className="flex items-center gap-x-2 text-xl">
            <SearchTextAdmin 
            placeholderText='Search Sub Category'
            value={searchSubcategory}
            onChange={(e) => {setsearchSubcategory(e.target.value)}}
            />
            <IconButton 
            icon='/icons/addicon.svg'
            altText='Add Icon'
            onClick={() => {
            setselectSubCategory(null)
            setisCreatingSubcategory(true)
            }}
            iconSize={8}
            />
          </div>


          {subCategory.length > 0 && (
          <ul className="list-none bg-secondary border rounded border-primaryColor text-base mt-1 max-h-40 overflow-y-auto">
            {subCategory.map((subcat,index) => (
              <DropDownText 
              key={subcat.subCategoryId}
              onClick={() => setselectSubCategory(subcat)}
              indexKey={subcat.subCategoryId}
              listName={subcat.subCategoryName}
              />
            ))}
          </ul>
          )}

          {selectedSubCategory && (
            <div className='flex flex-row justify-between items-center p-2'>
            <h3 className='text-base text-secondary mt-4'>
            SELECTED - <span className='text-primaryColor'>{`${selectedSubCategory.subCategoryName}`}</span>
            </h3>
              <IconButton 
              icon='/icons/closeicon.svg'
              altText='close Icon'
              onClick={() => {
              setselectSubCategory(null)
              }}
              iconSize={8}
              />
            </div>
          )}

          <DashBoardButtonLayoutOption>
            {!selectedSubCategory && (
            <>
              {isCreatingSubcategory && (
              <>
              <SearchTextAdmin 
              placeholderText='ADD SUB CATEGORY'
              value={newSubcategory}
              onChange={(e) => setnewSubcategory(e.target.value)}
              />
              <IconButton 
              icon='/icons/checkicon.svg'
              altText='check Icon'
              onClick={handleAddSubCategegory}
              iconSize={8}
              />
              <IconButton 
              icon='/icons/closeicon.svg'
              altText='Close Icon'
              onClick={() => {
              setisCreatingSubcategory(false)
              setnewSubcategory('')
              }}
              iconSize={8}
              />
              </>
              )}
            </>
            )}
            {(selectedSubCategory && !isEditingSubCategory) && (
            <>
            <IconButton 
            icon='/icons/editicon.svg'
            altText='close Icon'
            onClick={() => {setisEditingSubCategory(true)}}
            iconSize={8}
            />
            <IconButton 
            icon='/icons/deleteicon.svg'
            altText='delete Icon'
            onClick={handleDeleteSubCategory}
            iconSize={8}
            />
            </>
            )}
            {(selectedSubCategory && isEditingSubCategory) && (
            <>
            <SearchTextAdmin 
            placeholderText='EDIT SUB CATEGORY'
            value={newEditingSubCategoryName}
            onChange={(e) => setnewEditingSubCategoryName(e.target.value)}
            />
            <IconButton 
            icon='/icons/checkicon.svg'
            altText='Edit Icon'
            onClick={handleEditSubCategory}
            iconSize={8}
            />
            <IconButton 
            icon='/icons/closeicon.svg'
            altText='Edit Icon'
            onClick={() => {
            setisEditingSubCategory(false)
            setnewEditingSubCategoryName('')
            }}
            iconSize={8}
            />
            </>
            )}
          </DashBoardButtonLayoutOption>
        </div>
      </div>
    )}

      {isCreatingCategory && (
      <div className="mt-4 p-4 text-primaryColor border border-greyColor">
        <h3 className="text-lg">ADD NEW CATEGORY</h3>
          <div className="space-y-4">
            <input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border p-2 rounded-md w-full outline-none border-primaryColor text-secondary"
            />
            <DashBoardButtonLayoutOption>
              <IconButton 
              icon='/icons/addicon.svg'
              altText='Add Icon'
              onClick={handleAddCategory}
              iconSize={8}
              />

              <IconButton 
              icon='/icons/closeicon.svg'
              altText='Close Icon'
              onClick={() => {
              setIsCreatingCategory(false)
              setNewCategory('')
              }}
              iconSize={8}
              />
            </DashBoardButtonLayoutOption>
          </div>
      </div>
      )}

  </div>
  );
}
