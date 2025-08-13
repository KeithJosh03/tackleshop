export interface Product {
  product_id: number;
  category_id: number;
  type_id: number;
  brand_id: number;
  product_name: string;
  base_price: string;
  description: string | null;
}

export interface Category {
  category_id: number;
  category_name: string;
  product: Product[];
}
