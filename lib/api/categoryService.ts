import axios, { AxiosError } from "axios";
import { CategoryProps, SubCategoryProps } from "@/types/dataprops";
import {  } from "@/types/dataprops";
import { data } from "framer-motion/client";

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

export const fetchCategoryCollection = async (): Promise<CategoryCollectionResponse | null> => {
  try {
    const response = await axios.get<CategoryCollectionResponse>('/api/categories/categorycollection');
    return response.data; 
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
      console.error("Error fetching category collection:", error.response.data);
      console.error("Status code:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    return null;
  }
};

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