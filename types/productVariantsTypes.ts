export interface ProductVariantOptions {
    variantOptionId: number;
    imageUrl: string | File | null;
    variantOptionValue: string;
    variantOptionPrice: string;
}

export interface ProductVariantTypes {
    variantTypeId: number;
    variantTypeName: string;
    variantOptions: ProductVariantOptions[];
}