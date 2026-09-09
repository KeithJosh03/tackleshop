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

export type ProductDetailsEdit = ProductDetails;

export const createProduct = async (productDetails: ProductDetails): Promise<any> => {
    const extractId = (entity: Record<string, any> | undefined | null): string | number => {
        if (!entity) return '';
        return entity.categoryId || entity.subCategoryId || entity.brandId || entity.id || entity.value || '';
    };

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

    // Process global media
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

    // Check variants
    if (!productDetails.variants || productDetails.variants.length === 0) {
        payload.sku = productDetails.masterSku || '';
        payload.stock_quantity = parseInt(String(productDetails.initialStock).replace(/[^0-9]/g, ''), 10) || 0;
        payload.variants = [];
        payload.variant_matrix = [];
    } else {
        payload.sku = null;
        payload.stock_quantity = null;

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
                    price_adjustment: String(opt.price_adjusting || '0'),
                    variant_image: uploadedMatch ? uploadedMatch.url : (typeof opt.imageUrl === 'string' ? opt.imageUrl : null)
                };
            });

            variantsToSend.push({
                variantTypeName: variant.variantTypeName,
                variantOptions: optionsToSend
            });
        }
        payload.variants = variantsToSend;

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
            const image_url = uploadedMatch ? uploadedMatch.url : (typeof row.imageUrl === 'string' ? row.imageUrl : null);

            return {
                sku_code: row.sku_code || row.skuCode || '',
                price: Number(row.price) || 0,
                stock_quantity: parseInt(String(row.stock_quantity || row.stockQuantity).replace(/[^0-9]/g, ''), 10) || 0,
                variant_option_ids: row.variant_option_ids || row.variantOptionIds || [],
                image_url: image_url
            };
        });

        payload.variant_matrix = variant_matrix;
    }

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
                console.error('Laravel HTML Crash Trace:', textBuffer);
                throw new Error('A critical server error occurred. Check developer console.');
            }
            throw error;
        }
    }
    return await response.json();
};

export const updateProduct = async (productId: number | string, productDetails: ProductDetails): Promise<any> => {
    const extractId = (entity: Record<string, any> | undefined | null): string | number => {
        if (!entity) return '';
        return entity.categoryId || entity.subCategoryId || entity.brandId || entity.id || entity.value || '';
    };

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

    // Process global media
    let globalMediasToSend: ProductImageToSend[] = [];
    if (productDetails.medias && productDetails.medias.length > 0) {
        const filesToUpload: UploadImageProps[] = [];
        productDetails.medias.forEach((m, idx) => {
            if (m.file instanceof File) {
                filesToUpload.push({ file: m.file, originIndex: idx });
            }
        });

        let uploadedFiles: UploadedImageProps[] = [];
        if (filesToUpload.length > 0) {
            uploadedFiles = await uploadImages(filesToUpload);
        }

        globalMediasToSend = productDetails.medias.map((m, idx) => {
            const uploadedMatch = uploadedFiles.find(img => img.originIndex === idx);
            const url = uploadedMatch ? uploadedMatch.url : (typeof m.file === 'string' ? m.file : (m as any).url || '');
            return {
                url,
                isMain: m.isMain
            };
        }).filter(m => !!m.url);
    }
    payload.medias = globalMediasToSend;

    // Check variants
    if (!productDetails.variants || productDetails.variants.length === 0) {
        payload.sku = productDetails.masterSku || '';
        payload.stock_quantity = parseInt(String(productDetails.initialStock).replace(/[^0-9]/g, ''), 10) || 0;
        payload.variants = [];
        payload.variant_matrix = [];
    } else {
        payload.sku = null;
        payload.stock_quantity = null;

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
                    price_adjustment: String(opt.price_adjusting || '0'),
                    variant_image: uploadedMatch ? uploadedMatch.url : (typeof opt.imageUrl === 'string' ? opt.imageUrl : null)
                };
            });

            variantsToSend.push({
                variantTypeName: variant.variantTypeName,
                variantOptions: optionsToSend
            });
        }
        payload.variants = variantsToSend;

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
            const image_url = uploadedMatch ? uploadedMatch.url : (typeof row.imageUrl === 'string' ? row.imageUrl : null);

            return {
                sku_code: row.sku_code || row.skuCode || '',
                price: Number(row.price) || 0,
                stock_quantity: parseInt(String(row.stock_quantity || row.stockQuantity).replace(/[^0-9]/g, ''), 10) || 0,
                variant_option_ids: row.variant_option_ids || row.variantOptionIds || [],
                image_url: image_url
            };
        });

        payload.variant_matrix = variant_matrix;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`, {
        method: 'PUT',
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
            throw new Error(jsonError.message || 'Product update failed.');
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error('Laravel HTML Crash Trace:', textBuffer);
                throw new Error('A critical server error occurred.');
            }
            throw error;
        }
    }
    return await response.json();
};

export const getProductById = async (productId: number | string): Promise<any> => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/productdetailEditDashboard/${productId}`,
        { cache: 'no-store' }
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch product #${productId}`);
    }

    const data = await res.json();
    return data.productdetail;
};


export async function ProductViewDetails(id: number) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/productviewdetails/${id}`,
        { cache: 'no-store' }
    );

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    const data = await res.json();
    return data.productdetail as ProductDetailsViewProps;
}

export const checkSkuUnique = async (sku: string, ignoreProductId?: number | string): Promise<{ available: boolean; message: string }> => {
    try {
        const queryParams = new URLSearchParams({ sku });
        if (ignoreProductId) {
            queryParams.append('ignore_product_id', String(ignoreProductId));
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/check-sku?${queryParams.toString()}`);
        if (!res.ok) return { available: false, message: 'Server error checking SKU.' };
        const data = await res.json();
        return {
            available: data.available ?? !data.exists,
            message: data.message || (data.available ? 'SKU is available.' : 'SKU is already taken.')
        };
    } catch (error) {
        console.error("Failed to check SKU uniqueness", error);
        return { available: false, message: 'Error checking SKU availability.' };
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