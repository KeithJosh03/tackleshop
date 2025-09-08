import { inter } from "./fonts";

export interface BrandProps {
  brand_id:number;
  brand_name:string;
  imageUrl:string | null;
}

export interface FeatureProps {
  feature_id:number;
  product_id:number;
  features:string;
}

export interface SpecificationProps {
  specs_id:number;
  product_id:number;
  specs_name:string;
  specs_value:string;
}

export interface CategoryTypeProps {
  type_id:number;
  catery_id:number;
  type_name:string;
}


export interface CategoryProps {
  category_id:number;
  category_name:string;
}

export interface ProductImage {
  productImg_id:number;
  variant_id:number;
  url:string;
  isMain:number;
}

export interface ProductVariant {
  variant_id: number;
  product_id: number;
  name: string;
  price: number;
  main_image: ProductImage;    
  all_image: ProductImage[]; 
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
  specification: SpecificationProps[];
  features:FeatureProps[];
  product_variant:ProductVariant[];
  categorytype:CategoryTypeProps;
}

export interface CategoryCollectionProps {
  category_id:number;
  category_name:string;
  product: ProductProps[];
}[]


