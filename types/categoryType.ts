export interface CategoryProps {
    categoryName: string;
    categoryId: number;
}

export interface ProductCollections {
    productId: number;
    productTitle: string;
    basePrice: string;
    brandName: string;
    productThumbNail: string;
    subCategoryName: string;
}

export interface CategoryCollectionProps {
    categoryId: number;
    categoryName: string;
    products: ProductCollections[]
}

export interface selectedCategorySubCategoriesProps {
    subCategoryId: number;
    subCategoryName: string;
}


export interface selectedCategorySubCategoryProps {
    status: boolean;
    categorySubs: selectedCategorySubCategoriesProps[];
}

// API Response
export interface CategoryPropsListAdmin {
    categoryId: number;
    categoryName: string;
    subcategoriesCount?: number;
}

export interface HeaderCategoryResponse {
    status: boolean;
    categories: CategoryPropsListAdmin[];
}

export interface CategoryCollectionResponse {
    categories: CategoryCollectionProps[];
}

export interface selectedCategorySubCategoriesProps {
    subCategoryId: number;
    subCategoryName: string;
}