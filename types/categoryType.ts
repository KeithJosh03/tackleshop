export interface CategoryProps {
    categoryName: string;
    categoryId: number;
    subcategoriesCount?: number;
    isActive?: boolean;
    is_active?: boolean;
    sortOrder?: number;
    sort_order?: number;
}

export type Category = CategoryProps;

export interface ProductCollections {
    productId: number;
    categoryId?: number;
    productTitle: string;
    basePrice: number | string;
    minPrice?: number;
    maxPrice?: number;
    discountedMinPrice?: number;
    hasDiscount?: boolean;
    discountLabel?: string;
    promotionName?: string;
    formattedPrice?: string;
    brandName?: string;
    productThumbNail?: string;
    subCategoryName?: string;
    isActive?: boolean;
    is_active?: boolean;
}

export interface CategoryCollectionProps {
    categoryId: number;
    categoryName: string;
    products: ProductCollections[];
}

export interface CategoryCollectionResponse {
    categories: CategoryCollectionProps[];
}

export interface selectedCategorySubCategoriesProps {
    subCategoryId: number;
    subCategoryName: string;
    isActive?: boolean;
    is_active?: boolean;
    sortOrder?: number;
    sort_order?: number;
}

export interface selectedCategorySubCategoryProps {
    status: boolean;
    categorySubs: selectedCategorySubCategoriesProps[];
}

// Admin / Header API Responses
export interface CategoryPropsListAdmin {
    categoryId: number;
    categoryName: string;
    subcategoriesCount?: number;
    isActive?: boolean;
    is_active?: boolean;
    sortOrder?: number;
    sort_order?: number;
}

export interface HeaderCategoryResponse {
    status: boolean;
    categories: CategoryPropsListAdmin[];
}