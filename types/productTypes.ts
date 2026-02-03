import { BrandProps } from "./brandType";
import { SubCategory } from "./subCategoryTypes";
import { Category } from "./categoryType";
import { ProductVariantTypes } from "./productVariants";
import { ProductMedias } from "./productMedia";


export interface ProductDetails {
  productId:number;
  productTitle: string;
  basePrice: string;
  specifications: string | null;
  features: string | null;
  description: string | null;
  subCategory: SubCategory;
  category: Category;
  brand: BrandProps;
  productMedias: ProductMedias[] | null;
  productVariantsTypes: ProductVariantTypes[] | null;
}










export interface ProductDetailsEditProps {
  productId:number;
  productTitle: string;
  basePrice: string;
  specifications: string | null;
  features: string | null;
  description: string | null;
  subCategory: SubCategory | null;
  category: Category | null;
  brand: BrandProps | null;
  productMedias: ProductMedias[] | null;
  productVariantsTypes: ProductVariantTypes[];
}
