type discountType = "Unit" | "Percent";



export interface BrandProps {
brandId: number;
brandName: string;
imageUrl?: string | null;
}

export interface CategoryProps {
categoryId: number;
categoryName: string;
}

// BrandProducts 

export interface BrandProducts {
productId:number;
productName:string;
basePrice:number;
categoryType:string;
mainImage:string;
}

// ProductDetails
export interface ProductDetailInitialsProps {
productId:number; 
variantId:number;
productName:string;
}


export interface ProductDetailImageProps {
productimageId:number
variantId:number;
url:string;                    
isMain:number;
}


export interface ProductDetailVariantProps {
productId:number;
variantId:number;
name:string;
price:string;
discountPrice:string;
discountType:discountType;
discountEnd:Date;
allImage: ProductDetailImageProps[]
}


export interface ProductDetailsProps {
productId:number;
productName:string;
basePrice:string;
brandName:string;
specification:string | null;
features:string  | null;
description: string  | null;
typeName:string;
productVariant: ProductDetailVariantProps[];
}



// CollectionCategory
export interface ProductCollectionProps{
productId:number;
basePrice:number;
categoryType:string;
brandName:string;
productName:string;
url:string
}


export interface CategoryCollectionProps {
categoryId: number;
categoryName: string;
products:ProductCollectionProps[];
}

// ProductSearch
export interface ProductSearchProps {
productId:number;
productName:string;
}


// CategoryProducts 
export interface CategorizeProduct {
productId:number;
productName:string;
basePrice:string;
brandName:string;
typeName:string
imageThumbNail:string;
}


export interface CategoryProducts {
categoryId:number;
categoryName:string;
products: CategorizeProduct[];
}



// SetupCollection

export interface SetupPackage {
    variantId:number;
    setupId:number;
    productName:string;
    categorytypeName:string;
}


export interface SetupCollection {
setupId:number;
setupName:string;
valueDiscount:string;
codeName:string;
typeDiscount: discountType;
inclusion: string | null;
setupImageThumbNail:string;
totalProductPrice:string;
packages: SetupPackage[];
}


// DiscountedProductCollection
export interface DiscountProductCollection {
discountId:number;
variantId:number;
productId:number;
discountType: discountType;
discountValue: string;
productModel:string;
productPrice:string;
imageThumbNail:string;
brandName:string;
productName:string;
}




// SetupDetails
export interface SetupPackageDetails {
variantId:number;
productId:number;
productName:string;
categoryType:string;
}

export interface SetupImageDetails {
url:string;
isMain:number;
imageId:number;
}


export interface SetupDetails {
setupId:number;
setupName:string;
codeName:string;
description:string;
endDate:string;
startDate:string;
valueDiscount:string;
typeDiscount:discountType;
totalSetupPrice:number;
package:SetupPackageDetails[];
images:SetupImageDetails[];
}