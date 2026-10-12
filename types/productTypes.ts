import { BrandProps } from "./brandType";
import { SubCategory } from "./subCategoryTypes";
import { CategoryProps } from "./categoryType";
import { ProductVariantTypes } from "./productVariantsTypes";
import { ProductMedias } from "./productMedia";

export interface ProductSkuImage {
  imageUrl: string;
  isMain: boolean;
}

export interface MatrixRowData {
  skuCode: string;
  stockQuantity: string;
  price: string;
  variantOptionIds: (string | number)[];
  imageUrl: File | string | null;
  isActive: boolean;
  weight?: string;
  weight_g?: string;
  packaging_type?: string;
  isBulky?: boolean;
}

export interface ProductSku {
  skuId: number;
  skuCode: string;
  price: string;
  finalPrice?: string;
  hasDiscount?: boolean;
  discountLabel?: string | null;
  stockQuantity: number;
  inStock: boolean;
  variantOptionIds: number[];
  skuImages: ProductSkuImage[] | null;
  isActive?: boolean;
  is_active?: boolean;
  weight?: number;
  weight_g?: number;
  packaging_type?: string;
  isBulky?: boolean;
  is_bulky?: boolean;
}

export interface ProductDetailsViewProps {
  productId: number;
  productTitle: string;
  basePrice: string;
  finalPrice?: string;
  hasDiscount?: boolean;
  discountLabel?: string | null;
  specifications: string | null;
  features: string | null;
  description: string | null;
  subCategoryName: string | null;
  categoryName: string | null;
  brandName: string | null;
  hasVariants: boolean;
  sku: string | null;
  stockQuantity: number | null;
  inStock: boolean;
  isActive?: boolean;
  is_active?: boolean;
  productMedias: ProductMedias[];
  productVariants: ProductVariantTypes[] | null;
  productSkus: ProductSku[] | null;
}

export interface ProductDetailsEditProps {
  productId: number;
  productTitle: string;
  basePrice: string;
  specifications: string | null;
  features: string | null;
  description: string | null;
  subCategory: SubCategory | null;
  category: CategoryProps | null;
  brand: BrandProps | null;
  productMedias: ProductMedias[]; // Non-nullable array for clean state management
  productVariants: ProductVariantTypes[];
}

export interface ProductListDashboardVariantOption {
  optionId: number;
  optionName: string;
  priceAdjustment: string;
  image: string | null;
}

export interface ProductListDashboardVariant {
  variantTypeName: string;
  variantOptions: ProductListDashboardVariantOption[];
}

export interface ProductListDashboardSku {
  skuId: number;
  skuCode: string;
  price: string;
  stockQuantity: number;
  isActive: boolean;
  variantOptions: {
    optionId: number;
    optionName: string;
  }[];
}

export interface ProductListDashboard {
  productId: number;
  productTitle: string;
  basePrice: string;
  brandName: string | null;
  categoryName?: string | null;
  subCategoryName: string | null;
  productTypeVariant: ProductListDashboardVariant[];
  sku: string | null;
  isActive?: boolean;
  stockQuantity: number | null;
  hasVariants: boolean;
  productSkus: ProductListDashboardSku[];
}

export interface PaginationProps {
  current_page: number;
  last_page: number;
  total: number;
}