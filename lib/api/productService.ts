// API Service
import { uploadImages } from './uploadImage';

import { ProductDetailsViewProps, ProductListDashboard, PaginationProps } from '@/types/productTypes';

export interface VariantOption {
    variantOptionValue: string;
    price_adjusting: string;
    imageUrl: File | null;
}

export interface VariantDetails {
    variantTypeName: string;
    variantOptions: VariantOption[];
}

export interface VariantOptionToSend {
    variantOptionValue: string;
    price_adjustment: string;
    variant_image: string | null;
}

export interface VariantDetailsToSend {
    variantTypeName: string;
    variantOptions: VariantOptionToSend[];
}

export interface ProductImageInput {
    file: File;
    isMain: boolean;
}

export interface ProductImageToSend {
    url: string;
    isMain: boolean;
}

export interface UploadImageProps {
    file: File;
    originIndex: number;
}

export interface UploadedImageProps {
    url: string;
    originIndex: number;
}

export interface ProductDetails {
    productTitle: string;
    basePrice: string | number;
    description: string;
    features: string;
    specifications: string;
    brand: Record<string, any>;
    category: Record<string, any>;
    subCategory: Record<string, any>;
    variants: VariantDetails[];
    medias: ProductImageInput[];
    masterSku?: string;
    initialStock?: string | number;
    variantMatrixRows: any[];
}

export const createProduct = async (productDetails: ProductDetails): Promise<any> => {
    // Helper function to extract ID cleanly from structural selection objects
    const extractId = (entity: Record<string, any> | undefined | null): string => {
        if (!entity) return '';
        return String(entity.categoryId || entity.subCategoryId || entity.brandId || entity.id || entity.value || '');
    };

    // Core Global Mapping Strategy
    const category_id = extractId(productDetails.category);
    const sub_category_id = extractId(productDetails.subCategory);
    const brand_id = extractId(productDetails.brand);

    const payload: Record<string, any> = {
        product_title: productDetails.productTitle,
        base_price: Number(productDetails.basePrice) || 0,
        description: productDetails.description,
        features: productDetails.features,
        specifications: productDetails.specifications,
        category_id,
        sub_category_id,
        brand_id,
    };

    // Process global media first
    let globalMediasToSend: ProductImageToSend[] = [];
    if (productDetails.medias && productDetails.medias.length > 0) {
        const globalUploadProps: UploadImageProps[] = productDetails.medias.map((m, idx) => ({
            file: m.file,
            originIndex: idx
        }));

        const uploadedGlobal = await uploadImages(globalUploadProps);

        globalMediasToSend = uploadedGlobal.map((uploaded) => ({
            url: uploaded.url,
            isMain: productDetails.medias[uploaded.originIndex].isMain
        }));
    }
    payload.medias = globalMediasToSend;

    // Conditional Branching based on variant lengths
    if (!productDetails.variants || productDetails.variants.length === 0) {
        // Conditional Branch A: Simple Product
        payload.sku = productDetails.masterSku || '';
        payload.stock_quantity = parseInt(String(productDetails.initialStock).replace(/[^0-9]/g, ''), 10) || 0;
        payload.variants = [];
        payload.variant_matrix = [];
    } else {
        // Conditional Branch B: Complex Variant Product
        payload.sku = null;
        payload.stock_quantity = null;

        // Process variants through an internal media handler
        const variantsToSend: VariantDetailsToSend[] = [];
        for (const variant of productDetails.variants) {
            const vUploadProps: UploadImageProps[] = [];
            variant.variantOptions.forEach((opt, idx) => {
                if (opt.imageUrl instanceof File) {
                    vUploadProps.push({ file: opt.imageUrl, originIndex: idx });
                }
            });

            let uploadedVImages: UploadedImageProps[] = [];
            if (vUploadProps.length > 0) {
                uploadedVImages = await uploadImages(vUploadProps);
            }

            const optionsToSend: VariantOptionToSend[] = variant.variantOptions.map((opt, idx) => {
                const uploadedMatch = uploadedVImages.find(img => img.originIndex === idx);
                return {
                    variantOptionValue: opt.variantOptionValue,
                    price_adjustment: String(opt.price_adjusting),
                    variant_image: uploadedMatch ? uploadedMatch.url : null
                };
            });

            variantsToSend.push({
                variantTypeName: variant.variantTypeName,
                variantOptions: optionsToSend
            });
        }
        payload.variants = variantsToSend;

        // Process variantMatrixRows using an OPTIMIZED PARALLEL upload strategy
        const matrixUploadProps: UploadImageProps[] = [];
        if (productDetails.variantMatrixRows && productDetails.variantMatrixRows.length > 0) {
            productDetails.variantMatrixRows.forEach((row, idx) => {
                if (row.imageUrl instanceof File) {
                    matrixUploadProps.push({ file: row.imageUrl, originIndex: idx });
                }
            });
        }

        let uploadedMatrixImages: UploadedImageProps[] = [];
        if (matrixUploadProps.length > 0) {
            uploadedMatrixImages = await uploadImages(matrixUploadProps);
        }

        const variant_matrix = (productDetails.variantMatrixRows || []).map((row, idx) => {
            const uploadedMatch = uploadedMatrixImages.find(img => img.originIndex === idx);
            // Dynamically reconstruct their mapped asset strings using array key index anchors
            const image_url = uploadedMatch ? uploadedMatch.url : null;

            return {
                sku_code: row.sku_code || '',
                price: Number(row.price) || 0,
                stock_quantity: parseInt(String(row.stock_quantity).replace(/[^0-9]/g, ''), 10) || 0,
                variant_option_ids: row.variant_option_ids || [],
                image_url: image_url
            };
        });

        payload.variant_matrix = variant_matrix;
    }

    // 4. SOPHISTICATED ERROR INTERCEPTION GATEWAY
    const response = await fetch('/api/products/store', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const textBuffer = await response.text();
        try {
            const jsonError = JSON.parse(textBuffer);
            throw new Error(jsonError.message || 'Product creation failed.');
        } catch (error) {
            if (error instanceof SyntaxError) {
                // If JSON extraction fails, detect unhandled Laravel HTML crash stack-trace
                console.error('Laravel HTML Crash Trace:', textBuffer);
                throw new Error('A critical server error occurred. Check the developer console for the raw trace stream.');
            } else {
                // If it is the actual explicitly thrown Error from the try block, re-throw it.
                throw error;
            }
        }
    }
    return await response.json();
};


export async function ProductDetailsView(id: number) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/productdetail/${id}`,
        { cache: 'no-store' }
    );

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    const data = await res.json();
    return data.productdetail as ProductDetailsViewProps;
}

export const checkSkuUnique = async (sku: string): Promise<boolean> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/check-sku?sku=${sku}`);
        if (!res.ok) return false;
        const data = await res.json();
        return !data.exists;
    } catch (error) {
        console.error("Failed to check SKU uniqueness", error);
        return false;
    }
};

export const ProductListDashboardSearch = async (
    search: string,
    page: number,
    brandId?: number | null,
    categoryId?: number | null
): Promise<{ products: ProductListDashboard[], pagination: PaginationProps }> => {
    try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('productTitle', search);
        if (page) queryParams.append('page', page.toString());
        if (brandId) queryParams.append('brandId', brandId.toString());
        if (categoryId) queryParams.append('categoryId', categoryId.toString());

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/productlistdashboardsearch?${queryParams.toString()}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch products: ${res.statusText}`);
        }

        const data = await res.json();
        return {
            products: data.products as ProductListDashboard[],
            pagination: data.pagination as PaginationProps
        };
    } catch (error) {
        console.error("Error in ProductListDashboardSearch:", error);
        throw error;
    }
};

export const DeleteProductDashboard = async (productId: number): Promise<void> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/delete/${productId}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            throw new Error(`Failed to delete product: ${res.statusText}`);
        }
    } catch (error) {
        console.error("Error in DeleteProductDashboard:", error);
        throw error;
    }
};

export interface ProductEditData {
    status: boolean;
    productdetail: {
        productId: number;
        productTitle: string;
        basePrice: string;
        specifications: string;
        features: string;
        description: string;
        brand: {
            brandId: number;
            brandName: string;
        };
        category: {
            categoryId: number;
            categoryName: string;
        },
        subCategory: {
            subCategoryId: number;
            subCategoryName: string;
        }
    };
}


export const editProductDetailsFetch = async (productId: number): Promise<ProductEditData> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/productdetailEditDashboard/${productId}`, {
            method: 'GET', // 👈 Changed from DELETE to GET
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            cache: 'no-store' // 👈 Ensures fresh backend data when editing
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch product details: ${res.status} ${res.statusText}`);
        }

        const data: ProductEditData = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching product #${productId} for editing:`, error);
        throw error;
    }
};

export const searchProductsTitleSearchBar = async (search: string): Promise<ProductListDashboard[]> => {
    try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('productTitle', search);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/productsearch?${queryParams.toString()}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch products: ${res.statusText}`);
        }
        const data = await res.json();
        return data.products as ProductListDashboard[];
    } catch (error) {
        console.error("Error in searchProductsTitleSearchBar:", error);
        throw error;
    }
};