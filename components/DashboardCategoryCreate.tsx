'use client';
import { worksans } from '@/types/fonts';
import { useEffect, useState } from 'react';
import { CategoryProps, SubCategoryProps, CategorySubProps } from '@/types/dataprops';
import axios from 'axios';

import SearchTextAdmin from '@/components/SearchTextAdmin';
import DropDownText from '@/components/DropDownText';
import IconButton from '@/components/IconButton';
import DashBoardButtonLayoutOption from '@/components/DashBoardButtonLayoutOption';


export default function DashboardCategoryCreate() {

  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [subCategory, setsubCategory] = useState<SubCategoryProps[]>([]);

  const [selectedCategory, setselectedCategory] = useState<CategoryProps | null>();
  const [selectedSubCategory,setselectSubCategory] = useState<SubCategoryProps | null>();
  
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

  interface CategorySubResponse {
    status: boolean;
    categories: CategoryProps[];
    categorySub: CategorySubProps;
  }

  useEffect(() => {
    axios.get<CategorySubResponse>('/api/categories/')
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => console.error('Error fetching Categories:', error));
  }, []);

  useEffect(() => {
    if (!selectedCategory?.categoryId) return; 

    axios.get<CategorySubResponse>(`/api/categories/categorysub/${selectedCategory?.categoryId}/`)
    .then((response) => {
      setsubCategory(response.data.categorySub.subCategories);
    })
    .catch((error) => console.error('Error fetching Sub Categories:', error));
  }, [selectedCategory?.categoryId]);

  const handleSearchChangeSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchSubcategory(e.target.value);
  };

  // useEffect(() => {
  //   setFilteredBrands(
  //     brands.filter((brand) =>
  //       brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   );
  // }, [searchTerm, brands]);



  // ADD
  const handleAddCategory = async () => {
    if (!newCategory) return; 
    
    try {
      const response = await axios.post('/api/categories', {
        category_name: newCategory,
      });

      if (response.status === 201) {
        setCategories([...categories, response.data]);
        setIsCreatingCategory(false); 
        setNewCategory(''); 
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  
  const handleAddSubCategegory = async () => {
    if(!selectedCategory || !newSubcategory.length) return;

    try{
      const response = await axios.post('/api/subcategory/',{
          category_id:selectedCategory.categoryId,
          sub_category_name:newSubcategory
      });

      if (response.status === 201) {
        setsubCategory([...subCategory, response.data]);
        setisCreatingSubcategory(false); 
        setnewSubcategory(''); 
      }

    } catch (error) {
      console.error(`Error adding subcategory, ${error}`)
    }
  }

  // EDIT
  const handleEditSubCategory = async () => {
    if(!selectedSubCategory || !newEditingSubCategoryName.length) return;

    try {
      const response = await axios.put(`/api/subcategory/${selectedSubCategory.subCategoryId}`, {
        sub_category_name: newEditingSubCategoryName,
      });

      if(response.status === 200 || response.status === 201){
        const updateSubCategory = response.data

        if(updateSubCategory && updateSubCategory.subCategoryId){
          setsubCategory((prevSubCategories) =>
            prevSubCategories.map((subcategory) =>
              subcategory.subCategoryId === updateSubCategory.subCategoryId
                ? { ...subcategory, subCategoryName: updateSubCategory.subCategoryName }
                : subcategory
            )
          );
          setisEditingSubCategory(false)
          setselectSubCategory(null)
          setnewEditingSubCategoryName('')
        } else {
          console.error('The update Sub Category data is invalid')
        }

      }
    } catch (error) {
      console.log(`Error update subcategory: ${error}`)
    } 
  }

  const handleEditCategory = async () => {
    if (!newEditCategoryName.length || !selectedCategory) return;
    try {
      const response = await axios.put(`/api/categories/${selectedCategory.categoryId}`, {
        category_name: newEditCategoryName,
      });

      if (response.status === 200 || response.status === 201) {
        const updatedCategory = response.data;

        if (updatedCategory && updatedCategory.categoryId) {
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.categoryId === updatedCategory.categoryId
                ? { ...category, categoryName: updatedCategory.categoryName }
                : category
            )
          )
          setEditCategoryName('')
          setselectedCategory(null)
          setisEditingCategory(false)
        } else {
          console.error("The updated category data is invalid.");
        }
      }
    } catch (error) {
      console.error(`Error updating category: ${error}`);
    }
  };

  // DELETE
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    const categoryId = selectedCategory.categoryId;
    try {
      const response = await axios.delete(`/api/categories/${categoryId}`);

      if (response.status === 204) {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.categoryId !== categoryId)
        );
        setselectedCategory(null); 
        console.log(`Category with ID ${categoryId} deleted successfully.`);
      }
    } catch (error) {
      console.error(`Error deleting category: ${error}`);
    }
  };

  const handleDeleteSubCategory = async () => {
    if (!selectedSubCategory) return;
    const subCategoryId = selectedSubCategory.subCategoryId;
    try {
      const response = await axios.delete(`/api/subcategory/${subCategoryId}`);
      if (response.status === 204) {
        setsubCategory((prevSubcategories) =>
          prevSubcategories.filter((subcategory) => subcategory.subCategoryId !== subCategoryId)
        );
        setselectSubCategory(null); 
      }
    } catch (error) {
      console.error(`Error deleting category: ${error}`);
    }
  };



  return (
    <div className={`${worksans.className} bg-mainBackgroundColor border border-greyColor font-extrabold rounded p-4 w-full flex flex-col space-y-1`}>
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
