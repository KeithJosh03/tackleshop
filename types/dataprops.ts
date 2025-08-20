// Collections

import { inter } from "./fonts";


export interface BrandProps {
  brand_id:number;
  brand_name:string;
}

export interface ProductProps {
  product_id:number;
  brand_id:number;
  category_id:number;
  product_name:string;
  description:string;
  base_price:string;
  type_id:number
  brand: BrandProps;
}

export interface CategoryProps{
  category_id:number;
  category_name:string;
}


export interface CategoryCollectionProps {
  category_id:number;
  category_name:string;
  product: ProductProps[];
}[]

