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