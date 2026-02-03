export interface ProductVariantOptions {
    variantOptionId:number;
    imageUrl:string;
    variantOptionValue:string;
    variantOptionPrice:string;
}

export interface ProductVariantTypes {
    variantTypeId:number;
    variantTypeName:string;
    variantOptions:ProductVariantOptions[];
}