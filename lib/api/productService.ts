import { getSession } from 'next-auth/react';
import { uploadImages } from './uploadImage';
import { ProductDetailsViewProps, ProductListDashboard, PaginationProps } from '@/types/productTypes';

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

// --- Interfaces ---

export interface VariantOption {
    variantOptionId?: number;
    variantOptionValue: string;
    price_adjusting: string;
    imageUrl: File | string | null;
}

export interface VariantDetails {
    variantTypeId?: number;
    variantTypeName: string;
    variantOptions: VariantOption[];
}

export interface VariantOptionToSend {
    variant_option_id?: number;
    variantOptionValue: string;
    price_adjustment: string;
    variant_image: string | null;
}

export interface VariantDetailsToSend {
    variant_type_id?: number;
    variantTypeName: string;
    variantOptions: VariantOptionToSend[];
}

export interface ProductImageInput {
    imageId?: number;
    file: File | string;
    isMain: boolean;
}

export interface ProductImageToSend {
    image_id?: number;
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

export interface MatrixRowInput {
    skuId?: number;
    sku_id?: number;
    skuCode?: string;
    sku_code?: string;
    price: number | string;
    stockQuantity?: number | string;
    stock_quantity?: number | string;
    imageUrl?: File | string | null;
    variantOptionIds?: number[];
    variant_option_ids?: number[];
    variantOptionValues?: (string | { value: string })[];
    variant_option_values?: (string | { value: string })[];
}

export interface ProductDetails {
    productTitle: string;
    basePrice: string | number;
    description: string;
    features: string;
    specifications: string;
    brand: Record<string, unknown> | number | string;
    category: Record<string, unknown> | number | string;
    subCategory?: Record<string, unknown> | number | string;
    variants: VariantDetails[];
    medias: ProductImageInput[];
    masterSku?: string;
    initialStock?: string | number;
    variantMatrixRows: MatrixRowInput[];
}

export type ProductDetailsEdit = ProductDetails;

export interface ProductEditData {
    status: boolean;
    productdetail: {
        productId: number;
        productTitle: string;
        basePrice: string;
        specifications: string;
        features: string;
        description: string;
        brand: { brandId: number; brandName: string };
        category: { categoryId: number; categoryName: string };
        subCategory: { subCategoryId: number; subCategoryName: string };
    };
}

// --- Helpers ---

const extractEntityId = (entity: unknown, preferredKey?: string): string | number => {
    if (entity === null || entity === undefined) return '';
    if (typeof entity === 'number' || typeof entity === 'string') return entity;
    if (typeof entity === 'object' && entity !== null) {
        const record = entity as Record<string, unknown>;
        if (preferredKey && record[preferredKey]) return record[preferredKey] as string | number;
        return (record.categoryId || record.subCategoryId || record.brandId || record.id || record.value || '') as string | number;
    }
    return '';
};

const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${BASE_URL}${endpoint}`;

    // Retrieve NextAuth session to extract access token
    const session = await getSession();
    const token = (session as { accessToken?: string } | null)?.accessToken;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const textBuffer = await response.text();
        try {
            const jsonError = JSON.parse(textBuffer);
            throw new Error(jsonError.message || `Request failed with status ${response.status}`);
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error(`Laravel HTML Crash Trace on ${endpoint}:`, textBuffer);
                throw new Error('A critical server error occurred. Check developer console.');
            }
            throw error;
        }
    }

    return response.json();
};

/**
 * Shared helper to format payload and upload all associated images in parallel
 */
async function prepareProductPayload(productDetails: ProductDetails, isUpdate = false): Promise<Record<string, unknown>> {
    const category_id = extractEntityId(productDetails.category, 'categoryId');
    const sub_category_id = extractEntityId(productDetails.subCategory, 'subCategoryId');
    const brand_id = extractEntityId(productDetails.brand, 'brandId');

    const payload: Record<string, unknown> = {
        product_title: productDetails.productTitle,
        base_price: Number(productDetails.basePrice) || 0,
        description: productDetails.description,
        features: productDetails.features,
        specifications: productDetails.specifications,
        category_id,
        sub_category_id: sub_category_id || null,
        brand_id: brand_id || null,
    };

    // 1. Process Global Medias
    let globalMediasToSend: ProductImageToSend[] = [];
    if (productDetails.medias?.length) {
        const filesToUpload: UploadImageProps[] = [];
        productDetails.medias.forEach((m, idx) => {
            if (m.file instanceof File) filesToUpload.push({ file: m.file, originIndex: idx });
        });

        const uploadedFiles = filesToUpload.length ? await uploadImages(filesToUpload) : [];

        globalMediasToSend = productDetails.medias.map((m, idx) => {
            const match = uploadedFiles?.find(img => img.originIndex === idx);
            const url = match ? match.url : (typeof m.file === 'string' ? m.file : '');
            return {
                ...(isUpdate && m.imageId ? { image_id: m.imageId } : {}),
                url,
                isMain: Boolean(m.isMain),
            };
        }).filter(m => !!m.url);
    }
    payload.medias = globalMediasToSend;

    // 2. Process Variants & Matrix
    const hasVariants = Boolean(productDetails.variants?.length);

    if (!hasVariants) {
        payload.sku = productDetails.masterSku || '';
        payload.stock_quantity = parseInt(String(productDetails.initialStock ?? 0).replace(/[^0-9]/g, ''), 10) || 0;
        payload.variants = [];
        payload.variant_matrix = [];
        return payload;
    }

    payload.sku = null;
    payload.stock_quantity = null;

    // Process Variant Images in Parallel
    const variantsPromise = Promise.all((productDetails.variants || []).map(async (variant) => {
        const vUploadProps: UploadImageProps[] = [];
        (variant.variantOptions || []).forEach((opt, idx) => {
            if (opt.imageUrl instanceof File) vUploadProps.push({ file: opt.imageUrl, originIndex: idx });
        });

        const uploadedVImages = vUploadProps.length ? await uploadImages(vUploadProps) : [];

        const optionsToSend: VariantOptionToSend[] = (variant.variantOptions || []).map((opt, idx) => {
            const match = uploadedVImages?.find(img => img.originIndex === idx);
            return {
                ...(isUpdate && opt.variantOptionId ? { variant_option_id: opt.variantOptionId } : {}),
                variantOptionValue: opt.variantOptionValue,
                price_adjustment: String(opt.price_adjusting || '0'),
                variant_image: match ? match.url : (typeof opt.imageUrl === 'string' ? opt.imageUrl : null),
            };
        });

        return {
            ...(isUpdate && variant.variantTypeId ? { variant_type_id: variant.variantTypeId } : {}),
            variantTypeName: variant.variantTypeName,
            variantOptions: optionsToSend,
        };
    }));

    // Process Matrix Images
    const matrixUploadProps: UploadImageProps[] = [];
    (productDetails.variantMatrixRows || []).forEach((row, idx) => {
        if (row.imageUrl instanceof File) matrixUploadProps.push({ file: row.imageUrl, originIndex: idx });
    });

    const matrixImagesPromise = matrixUploadProps.length ? uploadImages(matrixUploadProps) : Promise.resolve([]);

    const [variantsToSend, uploadedMatrixImages] = await Promise.all([variantsPromise, matrixImagesPromise]);

    payload.variants = variantsToSend;
    payload.variant_matrix = (productDetails.variantMatrixRows || []).map((row, idx) => {
        const match = uploadedMatrixImages?.find(img => img.originIndex === idx);
        const image_url = match ? match.url : (typeof row.imageUrl === 'string' ? row.imageUrl : null);

        return {
            ...(isUpdate && (row.skuId || row.sku_id) ? { sku_id: row.skuId || row.sku_id } : {}),
            sku_code: row.sku_code || row.skuCode || '',
            price: Number(row.price) || 0,
            stock_quantity: parseInt(String(row.stock_quantity || row.stockQuantity).replace(/[^0-9]/g, ''), 10) || 0,
            variant_option_ids: row.variant_option_ids || row.variantOptionIds || [],
            variant_option_values: row.variant_option_values || row.variantOptionValues || [],
            image_url,
        };
    });

    return payload;
}

// --- API Service Functions ---

export const createProduct = async (productDetails: ProductDetails): Promise<unknown> => {
    const payload = await prepareProductPayload(productDetails, false);
    return apiClient('/api/products', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const updateProduct = async (productId: number | string, productDetails: ProductDetails): Promise<unknown> => {
    const payload = await prepareProductPayload(productDetails, true);
    return apiClient(`/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
};

export const getProductByIdForEdit = async (productId: number | string): Promise<Record<string, unknown> | null> => {
    try {
        const response = await apiClient<{ data?: Record<string, unknown>; productdetail?: Record<string, unknown> }>(
            `/api/products/productdetailEditDashboard/${productId}`,
            { cache: 'no-store' }
        );

        const raw = response.data || response.productdetail;
        if (!raw) return null;

        const resolvedCategory = raw.category || (raw.subCategory as Record<string, unknown>)?.category || {};

        return {
            productId: raw.productId,
            productTitle: raw.productTitle,
            basePrice: raw.basePrice,
            description: raw.description,
            features: raw.features || '',
            specifications: raw.specifications || '',
            masterSku: raw.sku || '',
            initialStock: raw.stockQuantity ?? 0,
            brand: raw.brand || {},
            category: resolvedCategory,
            subCategory: raw.subCategory || {},
            medias: ((raw.productMedias || raw.media || []) as Array<Record<string, unknown>>).map((m) => ({
                imageId: m.imageId,
                file: m.imageUrl,
                url: m.imageUrl,
                isMain: Boolean(m.isMain),
            })),
            variants: ((raw.productVariants || []) as Array<Record<string, unknown>>).map((v) => ({
                variantTypeId: v.variantTypeId,
                variantTypeName: v.variantTypeName,
                variantOptions: ((v.variantOptions || []) as Array<Record<string, unknown>>).map((opt) => ({
                    variantOptionId: opt.variantOptionId,
                    variantOptionValue: opt.variantOptionValue,
                    price_adjusting: opt.priceAdjustment || opt.price_adjustment || '0',
                    imageUrl: opt.imageUrl,
                })),
            })),
            variantMatrixRows: ((raw.variantMatrix || []) as Array<Record<string, unknown>>).map((m) => ({
                skuId: m.skuId,
                skuCode: m.skuCode || m.sku_code || '',
                sku_code: m.skuCode || m.sku_code || '',
                price: m.price,
                stockQuantity: m.stockQuantity || m.stock_quantity || 0,
                stock_quantity: m.stockQuantity || m.stock_quantity || 0,
                isActive: m.isActive,
                imageUrl: m.imageUrl,
                variantOptionIds: m.variantOptionIds || [],
                variant_option_ids: m.variantOptionIds || [],
                variantOptionValues: m.variantOptionValues || [],
                variant_option_values: m.variantOptionValues || [],
            })),
        };
    } catch (error) {
        console.error(`[Fetch Error] getProductByIdForEdit:`, error);
        throw error;
    }
};

export async function ProductViewDetails(id: number): Promise<ProductDetailsViewProps | null> {
    try {
        const response = await apiClient<{ productdetail?: ProductDetailsViewProps; data?: ProductDetailsViewProps }>(
            `/api/products/productviewdetails/${id}`,
            {
                next: {
                    revalidate: 300,
                    tags: [`product-details-${id}`, 'product-details'],
                },
            }
        );
        return response.data || response.productdetail || null;
    } catch (error) {
        console.error(`ProductViewDetails network error for ID ${id}:`, error);
        return null;
    }
}

export const checkSkuUnique = async (
    sku: string,
    ignoreProductId?: number | string
): Promise<{ available: boolean; message: string }> => {
    try {
        const queryParams = new URLSearchParams({ sku });
        if (ignoreProductId) {
            queryParams.append('ignore_product_id', String(ignoreProductId));
        }

        const data = await apiClient<{ available?: boolean; exists?: boolean; message?: string }>(
            `/api/products/check-sku?${queryParams.toString()}`
        );

        return {
            available: data.available ?? !data.exists,
            message: data.message || (data.available ? 'SKU is available.' : 'SKU is already taken.'),
        };
    } catch (error) {
        console.error('Failed to check SKU uniqueness', error);
        return { available: false, message: 'Error checking SKU availability.' };
    }
};

export const ProductListDashboardSearch = async (
    search: string,
    page: number,
    brandId?: number | null,
    categoryId?: number | null
): Promise<{ products: ProductListDashboard[]; pagination: PaginationProps }> => {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('productTitle', search);
    if (page) queryParams.append('page', page.toString());
    if (brandId) queryParams.append('brandId', brandId.toString());
    if (categoryId) queryParams.append('categoryId', categoryId.toString());

    const data = await apiClient<{ products: ProductListDashboard[]; pagination: PaginationProps }>(
        `/api/products/productlistdashboardsearch?${queryParams.toString()}`
    );

    return {
        products: data.products,
        pagination: data.pagination,
    };
};

export const DeleteProductDashboard = async (productId: number): Promise<void> => {
    await apiClient<void>(`/api/products/${productId}`, {
        method: 'DELETE',
    });
};

export const ToggleProductStatus = async (productId: number): Promise<{ is_active: boolean }> => {
    return apiClient<{ is_active: boolean }>(`/api/admin/products/${productId}/status`, {
        method: 'PATCH',
    });
};

export const editProductDetailsFetch = async (productId: number | string): Promise<ProductEditData> => {
    return apiClient<ProductEditData>(`/api/products/productdetailEditDashboard/${productId}`, {
        method: 'GET',
        cache: 'no-store',
    });
};

export const searchProductsTitleSearchBar = async (search: string): Promise<ProductListDashboard[]> => {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('productTitle', search);

    const data = await apiClient<{ products: ProductListDashboard[] }>(
        `/api/products/productsearch?${queryParams.toString()}`
    );

    return data.products;
};