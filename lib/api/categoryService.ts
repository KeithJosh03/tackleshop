import axios, { AxiosError } from "axios";

import {
  SubCategoryProps,
  CategoryProducts
} from "@/types/dataprops";

import {
  CategoryCollectionProps, CategoryCollectionResponse,
  CategoryPropsListAdmin, HeaderCategoryResponse,
  CategoryProps, selectedCategorySubCategoryProps,
  selectedCategorySubCategoriesProps, ProductCollections
} from "@/types/categoryType";

export type { CategoryCollectionProps, ProductCollections };

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';


export async function CategoryListNameSearchHeader(): Promise<CategoryPropsListAdmin[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/categories/header-list`, {
      next: { revalidate: 3600, tags: ['header-categories'] },
    });

    if (!res.ok) {
      console.error(`Failed to fetch header categories. Status: ${res.status}`);
      return [];
    }

    const data: HeaderCategoryResponse = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error('Network error fetching header categories:', error);
    return [];
  }
}

export async function selectedCategorySubCategory(
  { categoryId }: { categoryId: number }
): Promise<selectedCategorySubCategoriesProps[]> {
  const res = await fetch(
    `${BASE_URL}/api/categories/categorysub/${categoryId}/`,
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
  payload: NewCategoryPayload,
  token: string
): Promise<NewCategoryResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
export async function deleteCategory(categoryId: number, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status === 204;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
}

// UPDATE CATEGORY
export interface UpdateCategoryPayload {
  category_name?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdatedCategoryResponse {
  categoryId: number;
  categoryName: string;
  subcategoriesCount?: number;
  isActive?: boolean;
  is_active?: boolean;
  sortOrder?: number;
  sort_order?: number;
}

export async function editCategory(
  categoryId: number,
  payload: UpdateCategoryPayload,
  token: string
): Promise<UpdatedCategoryResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

export async function toggleCategoryStatus(
  categoryId: number,
  is_active: boolean,
  token: string
): Promise<CategoryProps | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/categories/${categoryId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active }),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error toggling category status:", error);
    return null;
  }
}

export async function reorderCategories(
  orderedIds: number[],
  token: string
): Promise<boolean> {
  try {
    const orders = orderedIds.map((id, index) => ({ id, sort_order: index }));

    const res = await fetch(`${BASE_URL}/api/categories/reorder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orders }),
    });

    return res.ok;
  } catch (error) {
    console.error("Error reordering categories:", error);
    return false;
  }
}

export async function fetchCategoryCollection(): Promise<CategoryCollectionProps[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/categories/categorycollection`,
      {
        next: {
          revalidate: 300,
          tags: ['category-collections']
        },
      }
    );
    if (!res.ok) {
      console.error(`Failed to fetch category collection. Status: ${res.status}`);
      return [];
    }
    const data: CategoryCollectionResponse = await res.json();
    return data?.categories || [];
  } catch (error) {
    console.error('Network error fetching category collection:', error);
    return [];
  }
}

// Read
export interface CategoryPropsResponse {
  status: boolean;
  categories: CategoryProps[];
}

interface CategorySubResponse {
  status: boolean;
  categorySub: SubCategoryProps[];
}

export const showCategories = async (): Promise<CategoryPropsResponse | null> => {
  try {
    const response = await axios.get<CategoryPropsResponse>(`${BASE_URL}/api/categories`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching categories:`, err);
    return null;
  }
};

export const showSubCategory = async (id: number): Promise<SubCategoryProps[] | null> => {
  try {
    const response = await axios.get<CategorySubResponse>(`${BASE_URL}/api/categories/SubCatByCategoryId/${id}`);
    return response.data.categorySub;
  } catch (err) {
    console.error(`Error fetching subcategories:`, err);
    return null;
  }
};

interface CategoryProductResponse {
  status: boolean;
  categoryproducts: CategoryProducts;
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
}

export const fetchSpecificCategoryProducts = async (
  category: string,
  page: number
): Promise<CategoryProductResponse | null> => {
  try {
    const encodedCategory = encodeURIComponent(category);
    const response = await axios.get<CategoryProductResponse>(
      `${BASE_URL}/api/categories/specificCategory/${encodedCategory}?page=${page}`
    );

    return response.data;
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
      console.error("Error fetching category products:", error.response.data);
    } else if (error.request) {
      console.error("No response received from backend server:", error.request);
    } else {
      console.error("Request configuration error:", error.message);
    }

    return null;
  }
};