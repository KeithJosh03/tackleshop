'use client';

export interface VariantDetails{
  variantTypeName: string;
  variantOptions: VariantOption[];
}

export interface VariantOption {
    variantOptionValue:string;
    price_adjusting:string;
    variant_image: File | null;
}

interface ProductImage {
  file: File;
  isMain: boolean;
}

interface ProductDetails {
  productTitle: string;
  basePrice:string;
  brandId: number | null;
  categoryId: number | null;
  subCategoryId:number | null;
  description: string | null;
  features: string | null;
  specifications: string | null;
  variants: VariantDetails[];
  medias: ProductImage[];
}


  export default function EditProductClient({productDetailEditProps} : {productDetailEditProps: ProductDetails}) {
  return (
  <h1>
    Hello
  </h1>
  )
}





