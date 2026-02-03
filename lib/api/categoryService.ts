import axios, { AxiosError } from "axios";
import { 
  SubCategoryProps, 
  CategoryProducts,
  CategorizeProduct
} from "@/types/dataprops";


// Header
export interface CategoryProps {
  categoryId: number;
  categoryName: string;
}

interface HeaderCategoryResponse {
  status: boolean;
  categories: CategoryProps[];
}

export async function CategoryList(): Promise<CategoryProps[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data: HeaderCategoryResponse = await res.json();
  return data.categories;
}


export interface selectedCategorySubCategoriesProps {
  subCategoryId:number;
  subCategoryName:string;
}

interface selectedCategorySubCategoryProps {
  status:boolean;
  categorySubs: selectedCategorySubCategoriesProps[];
}


export async function selectedCategorySubCategory(
  { categoryId }: { categoryId: number }
): Promise<selectedCategorySubCategoriesProps[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/categorysub/${categoryId}/`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data: selectedCategorySubCategoryProps = await res.json();
  return data.categorySubs;
}

// ADD CATEGORY

export interface NewCategoryPayload {
  category_name: string;
}

export interface NewCategoryResponse {
  categoryId: number;
  categoryName: string;
}

export async function addCategory(
  payload: NewCategoryPayload
): Promise<NewCategoryResponse | null> {
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.status !== 201) {
      console.error(`Failed to add category. Status: ${res.status}`);
      return null;
    }

    const data: NewCategoryResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error adding category:', error);
    return null;
  }
}









// DELETE CATEGORY
export async function deleteCategory(categoryId: number): Promise<boolean> {
  try {
    const res = await fetch(`/api/categories/${categoryId}`, {
      method: "DELETE",
    });

    return res.status === 204;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
}


export interface UpdateCategoryPayload {
  category_name: string;
}

export interface UpdatedCategoryResponse {
  categoryId: number;
  categoryName: string;
}


// UPDATE CATEGORY
export async function editCategory(
  categoryId: number,
  payload: UpdateCategoryPayload
): Promise<UpdatedCategoryResponse | null> {
  try {
    const res = await fetch(`/api/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(`Failed to update category. Status: ${res.status}`);
      return null;
    }

    const data: UpdatedCategoryResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
  }
}






interface CategorySubResponse {
  status:boolean;
  categorySub:SubCategoryProps[];
}

export interface CategoryPropsResponse {
  status: boolean;
  categories: CategoryProps[];
}

export interface ProductCollections {
  productId:number;
  productTitle:string;
  basePrice:string;
  brandName:string;
  productThumbNail:string;
  subCategoryName:string;
}

export interface CategoryCollectionProps {
  categoryId: number;
  categoryName:string;
  products: ProductCollections[]
}

interface CategoryCollectionResponse {
  categories:CategoryCollectionProps[];
}


export async function fetchCategoryCollection(): Promise<CategoryCollectionProps[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/categorycollection`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data: CategoryCollectionResponse = await res.json();
  return data.categories;
}







export const showCategories = async (): Promise<CategoryPropsResponse | any> => {
  try{
    const response = await axios.get<CategoryProps>('/api/categories');
    return response.data;
  } catch (err) {
    console.log(`Error fetching category ${err}`)
    return null;
  }
}

export const showSubCategory = async (id:number): Promise<SubCategoryProps[] | null> => {
  try{
    const response = await axios.get<CategorySubResponse>(`/api/categories/SubCatByCategoryId/${id}`)
    return response.data.categorySub;
  } catch (err) {
    console.log(`Error fetching category ${err}`)
    return null;
  }
}


interface CategoryProductResponse {
  status: boolean;
  categoryproducts: CategoryProducts;
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
}

export const fetchCategoryProducts = async (
  category: string,
  page: number
): Promise<CategoryProductResponse | null> => {
  try {
    const response = await axios.get<CategoryProductResponse>(
      `/api/categories/specificCategory/${category}?page=${page}`
    );

    return response.data;
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
      console.error("Error fetching category products:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
    }

    return null;
  }
};
