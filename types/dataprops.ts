export interface BrandProps {
  brand_id:number;
  brand_name:string;
}

export interface ProductCollectionProps {
  product_id:number;
  brand_id:number;
  category_id:number;
  product_name:string;
  base_price:string;
  brand: BrandProps;
}

export interface CategoryCollectionProps {
  category_id:number;
  category_name:string;
  product: ProductCollectionProps[];
}[]