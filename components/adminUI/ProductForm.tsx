'use client';

import React, { useState, useReducer, useMemo, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

import { createProduct, updateProduct, checkSkuUnique, ProductDetails as ServiceProductDetails } from '@/lib/api/productService';
import { generateSimpleSku, generateVariantSku } from '@/lib/utils/skuGenerator';
import { productFormReducer, defaultFormState, ProductFormState } from '@/lib/reducer/productFormReducer';
import { validateProduct } from '@/lib/validation';

import {
    SectionCard,
    ProductContentInputs,
    ProductVariantMatrix,
    ProductInventoryTypeToggle,
    ProductBaseDetails,
    ProductMedia,
    ProductSimpleInventory
} from '@/components/adminUI';

interface MatrixRowData {
    skuCode: string;
    stockQuantity: string;
    price: string;
    variantOptionIds: (string | number)[];
    imageUrl: File | string | null;
}

interface ProductFormProps {
    mode: 'add' | 'edit';
    productId?: number | string;
    initialData?: any;
}

const normalizeCategory = (catData: any) => {
    if (!catData) return null;
    if (typeof catData === 'object') {
        const categoryId = catData.categoryId ?? catData.category_id ?? catData.id ?? null;
        const categoryName = catData.categoryName ?? catData.category_name ?? catData.name ?? catData.title ?? '';
        if (categoryId || categoryName) return { ...catData, categoryId, categoryName };
    }
    return null;
};

const normalizeSubCategory = (subCatData: any) => {
    if (!subCatData) return null;
    if (typeof subCatData === 'object') {
        const subCategoryId = subCatData.subCategoryId ?? subCatData.sub_category_id ?? subCatData.id ?? null;
        const subCategoryName = subCatData.subCategoryName ?? subCatData.sub_category_name ?? subCatData.name ?? subCatData.title ?? '';
        if (subCategoryId || subCategoryName) return { ...subCatData, subCategoryId, subCategoryName };
    }
    return null;
};

const normalizeBrand = (brandData: any) => {
    if (!brandData) return null;
    if (typeof brandData === 'object') {
        const brandId = brandData.brandId ?? brandData.brand_id ?? brandData.id ?? null;
        const brandName = brandData.brandName ?? brandData.brand_name ?? brandData.name ?? '';
        if (brandId || brandName) return { ...brandData, brandId, brandName };
    }
    return null;
};

const mapInitialProductState = (data?: any): ProductFormState => {
    const p = data?.productdetail || data?.data || data;

    const rawStock = p?.initialStock ?? p?.stockQuantity ?? p?.stock ?? p?.quantity;
    const initialStock = rawStock !== null && rawStock !== undefined ? String(rawStock) : '';

    const rawMedias = p?.media || p?.productMedias || p?.medias || p?.images || [];
    const medias = Array.isArray(rawMedias)
        ? rawMedias.map((m: any, idx: number) => ({
            id: m.id || `media-${idx}`,
            file: typeof m === 'string' ? m : (m.mediaUrl || m.imageUrl || m.image_url || m.file || m.url || ''),
            url: typeof m === 'string' ? m : (m.mediaUrl || m.imageUrl || m.image_url || m.url || ''),
            isMain: Boolean(m.isMain || m.is_main || m.isPrimary)
        }))
        : [];

    const rawVariants = p?.productVariants || p?.variants || p?.product_variants || [];
    const variants = Array.isArray(rawVariants)
        ? rawVariants.map((v: any, vIdx: number) => ({
            id: v.id || v.variantTypeId || `vtype-${vIdx}`,
            variantTypeName: v.variantTypeName || v.variant_type_name || v.name || '',
            variantOptions: (v.variantOptions || v.variant_options || v.options || []).map((o: any, oIdx: number) => ({
                id: o.id || o.variantOptionId || `vopt-${vIdx}-${oIdx}`,
                variantOptionValue: o.variantOptionValue || o.variant_option_value || o.value || o.name || '',
                price_adjusting: String(o.priceAdjustment ?? o.price_adjusting ?? o.priceAdjust ?? '0'),
                imageUrl: o.imageUrl || o.image_url || o.url || null
            }))
        }))
        : [];

    const category = normalizeCategory(p?.category || (p?.categoryName || p?.category_name ? { categoryName: p.categoryName || p.category_name, categoryId: p.categoryId || p.category_id } : null));
    const subCategory = normalizeSubCategory(p?.subCategory || (p?.subCategoryName || p?.sub_category_name ? { subCategoryName: p.subCategoryName || p.sub_category_name, subCategoryId: p.subCategoryId || p.sub_category_id } : null));
    const brand = normalizeBrand(p?.brand || (p?.brandName || p?.brand_name ? { brandName: p.brandName || p.brand_name, brandId: p.brandId || p.brand_id } : null));

    const hasVariations = Boolean(
        p?.isVariant ||
        p?.is_variant ||
        p?.hasVariations ||
        p?.has_variations ||
        variants.length > 0 ||
        (p?.variantMatrix && p.variantMatrix.length > 0) ||
        (p?.variantMatrixRows && p.variantMatrixRows.length > 0)
    );

    return {
        productId: p?.productId || p?.id,
        productTitle: p?.productTitle || p?.title || p?.name || '',
        basePrice: p?.basePrice !== undefined && p?.basePrice !== null ? String(p.basePrice) : (p?.price !== undefined ? String(p.price) : ''),
        description: p?.description || null,
        features: p?.features || null,
        brand,
        category,
        subCategory,
        specifications: p?.specifications || null,
        variants,
        medias,
        masterSku: p?.sku || p?.masterSku || p?.master_sku || '',
        initialStock,
        hasVariations
    };
};

export function ProductForm({ mode, productId, initialData }: ProductFormProps) {
    const initialProductDetailState = useMemo(() => mapInitialProductState(initialData), [initialData]);

    const [ProductDetailState, dispatchProductDetailCreate] = useReducer(productFormReducer, initialProductDetailState);
    const [productType, setProductType] = useState<'simple' | 'variant'>(initialProductDetailState.hasVariations ? 'variant' : 'simple');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ message: string | null; type: 'success' | 'error' | null }>({ message: null, type: null });
    const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false);

    const isInitializedRef = useRef(false);
    const hasProductVariant = productType === 'variant';

    const buildMatrixRowMap = (data?: any): Record<string, MatrixRowData> => {
        const p = data?.productdetail || data?.data || data;
        const matrix = p?.variantMatrix || p?.variantMatrixRows || p?.variant_matrix;
        if (!matrix?.length) return {};

        const rowMap: Record<string, MatrixRowData> = {};
        matrix.forEach((row: any) => {
            const optionIdsKey = row.variantOptionIds?.join('-') || row.variant_option_ids?.join('-');
            const optionValuesKey = row.variant_option_values?.join('-') || row.variantOptionValues?.join('-');

            const primaryKey = optionIdsKey || optionValuesKey || row.skuCode || row.sku_code;

            if (primaryKey) {
                rowMap[primaryKey] = {
                    skuCode: row.skuCode || row.sku_code || '',
                    stockQuantity: String(row.stockQuantity ?? row.stock_quantity ?? '0'),
                    price: String(row.price ?? row.checkout_price ?? '0'),
                    variantOptionIds: row.variantOptionIds || row.variant_option_ids || [],
                    imageUrl: row.imageUrl || row.image_url || null,
                };
            }
        });
        return rowMap;
    };

    const [variantMatrixRows, setVariantMatrixRows] = useState<Record<string, MatrixRowData>>(() => buildMatrixRowMap(initialData));

    useEffect(() => {
        if (initialData && !isInitializedRef.current) {
            const mappedState = mapInitialProductState(initialData);

            setProductType(mappedState.hasVariations ? 'variant' : 'simple');
            dispatchProductDetailCreate({ type: 'SET_FORM_STATE', payload: mappedState });

            const rowMap = buildMatrixRowMap(initialData);
            if (Object.keys(rowMap).length > 0) {
                setVariantMatrixRows(rowMap);
            }

            isInitializedRef.current = true;
        }
    }, [initialData, productId]);

    const combinations = useMemo(() => {
        if (!hasProductVariant) return [];
        const validVariants = ProductDetailState.variants.filter(v => v.variantOptions && v.variantOptions.length > 0);
        if (!validVariants.length) return [];

        return validVariants.reduce((combos, variant) => {
            return combos.flatMap(combo =>
                variant.variantOptions.map((option) => ({
                    id: combo.id ? `${combo.id}-${option.variantOptionValue}` : option.variantOptionValue,
                    name: combo.name ? `${combo.name} | ${variant.variantTypeName}: ${option.variantOptionValue}` : `${variant.variantTypeName}: ${option.variantOptionValue}`,
                    optionValues: [...combo.optionValues, option.variantOptionValue],
                    optionIds: [...combo.optionIds, option.id]
                }))
            );
        }, [{ id: '', name: '', optionValues: [] as string[], optionIds: [] as (string | number)[] }]);
    }, [ProductDetailState.variants, hasProductVariant]);

    useEffect(() => {
        if (hasProductVariant) {
            setVariantMatrixRows(prev => {
                const nextData: Record<string, MatrixRowData> = {};

                const parentSku = generateSimpleSku(
                    ProductDetailState.productTitle,
                    ProductDetailState.brand?.brandName || '',
                    ProductDetailState.category?.categoryName || '',
                    ProductDetailState.subCategory?.subCategoryName || ''
                );

                combinations.forEach((combo, idx) => {
                    const optionIdsKey = combo.optionIds.join('-');
                    const existingData = prev[combo.id] || prev[optionIdsKey];

                    const defaultSku = `${generateVariantSku(parentSku, combo.optionValues)}-${idx + 1}`;

                    nextData[combo.id] = existingData ? {
                        ...existingData,
                        skuCode: existingData.skuCode?.trim() || defaultSku
                    } : {
                        skuCode: defaultSku,
                        stockQuantity: '0',
                        price: ProductDetailState.basePrice?.toString() || '0',
                        variantOptionIds: combo.optionIds,
                        imageUrl: null,
                    };
                });

                return nextData;
            });
        }
    }, [
        combinations,
        hasProductVariant,
        ProductDetailState.productTitle,
        ProductDetailState.basePrice,
        ProductDetailState.brand,
        ProductDetailState.category,
        ProductDetailState.subCategory
    ]);

    useEffect(() => {
        if (mode === 'add' && !isSkuManuallyEdited && ProductDetailState.productTitle && !hasProductVariant) {
            const autoSku = generateSimpleSku(ProductDetailState.productTitle, ProductDetailState.brand?.brandName || '');
            dispatchProductDetailCreate({ type: 'UPDATE_MASTER_SKU', payload: autoSku });
        }
    }, [ProductDetailState.productTitle, ProductDetailState.brand, hasProductVariant, isSkuManuallyEdited, mode]);

    const buildVariantMatrixPayload = () =>
        combinations.map(combo => {
            const row = variantMatrixRows[combo.id] || variantMatrixRows[combo.optionIds.join('-')];
            return {
                sku_code: row?.skuCode ?? '',
                checkout_price: Number(row?.price) || 0,
                price: Number(row?.price) || 0,
                stock_quantity: parseInt(String(row?.stockQuantity || '0'), 10) || 0,
                variant_option_ids: row?.variantOptionIds ?? combo.optionIds,
                variant_option_values: combo.optionValues,
                imageUrl: row?.imageUrl ?? null,
            };
        });

    const triggerNotification = (type: 'success' | 'error', message: string, duration = 5000) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: null, message: null }), duration);
    };

    const handleFormSubmit = async () => {
        const matrixPayload = hasProductVariant ? buildVariantMatrixPayload() : [];

        // 1. Run base validation passing clean variants array based on mode
        const { errors: validationErrors } = validateProduct({
            ...ProductDetailState,
            variants: hasProductVariant ? ProductDetailState.variants : [],
            variant_matrix: matrixPayload,
            isVariant: hasProductVariant
        });

        const currentErrors: Record<string, string> = { ...validationErrors };

        if (!hasProductVariant) {
            if (!ProductDetailState.masterSku?.trim()) {
                currentErrors.masterSku = "Product SKU is required for Simple Product.";
            }
        } else {
            if (combinations.length === 0) {
                currentErrors.variants = "Please add at least one variant attribute and option pill.";
            }
        }

        // 2. Local Intra-Form Uniqueness & Empty Check for Variant Matrix
        if (hasProductVariant && matrixPayload.length > 0) {
            const seenSkus = new Map<string, number>();

            matrixPayload.forEach((item, index) => {
                const sku = item.sku_code?.trim().toUpperCase();
                if (sku) {
                    if (seenSkus.has(sku)) {
                        const originalIdx = seenSkus.get(sku)!;
                        currentErrors[`variant_matrix.${index}.sku_code`] = `Duplicate SKU '${item.sku_code}'.`;
                        currentErrors[`variant_matrix.${originalIdx}.sku_code`] = `Duplicate SKU '${item.sku_code}'.`;
                    } else {
                        seenSkus.set(sku, index);
                    }
                } else {
                    currentErrors[`variant_matrix.${index}.sku_code`] = `SKU code is required.`;
                }
            });
        }

        // Stop early if local form validation fails
        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            console.error("Validation Errors Logged:", currentErrors);
            return triggerNotification('error', 'Validation failed. Please resolve highlighted errors and SKU conflicts.');
        }

        // 3. Database Uniqueness Check
        if (!hasProductVariant && ProductDetailState.masterSku?.trim()) {
            const check = await checkSkuUnique(ProductDetailState.masterSku.trim(), productId);
            if (!check.available) {
                currentErrors.masterSku = check.message || "This SKU is already in use.";
            }
        } else if (hasProductVariant && matrixPayload.length > 0) {
            await Promise.all(matrixPayload.map(async (item, index) => {
                if (item.sku_code) {
                    const check = await checkSkuUnique(item.sku_code, productId);
                    if (!check.available) {
                        currentErrors[`variant_matrix.${index}.sku_code`] = `SKU '${item.sku_code}' is already registered in DB.`;
                    }
                }
            }));
        }

        setErrors(currentErrors);

        if (Object.keys(currentErrors).length > 0) {
            console.error("Database Validation Errors:", currentErrors);
            return triggerNotification('error', 'SKU collision detected with existing system products.');
        }

        // Proceed to API submission
        setIsSaving(true);

        const categoryObj = ProductDetailState.category || {};
        const subCategoryObj = ProductDetailState.subCategory || {};
        const brandObj = ProductDetailState.brand || {};

        const brandId = (brandObj as any)?.brandId ?? (brandObj as any)?.id ?? null;
        const categoryId = (categoryObj as any)?.categoryId ?? (categoryObj as any)?.id ?? null;
        const subCategoryId = (subCategoryObj as any)?.subCategoryId ?? (subCategoryObj as any)?.id ?? null;

        const payload: ServiceProductDetails = {
            ...ProductDetailState,
            description: ProductDetailState.description || '',
            features: ProductDetailState.features || '',
            specifications: ProductDetailState.specifications || '',

            brand: brandObj,
            category: categoryObj,
            subCategory: subCategoryObj,

            brandId,
            categoryId,
            subCategoryId,

            masterSku: hasProductVariant ? '' : ProductDetailState.masterSku,
            initialStock: hasProductVariant ? '' : ProductDetailState.initialStock,
            variants: (hasProductVariant ? ProductDetailState.variants : []) as any,
            variantMatrixRows: matrixPayload
        } as any;

        try {
            if (mode === 'add') {
                await createProduct(payload);
                dispatchProductDetailCreate({ type: 'SET_FORM_STATE', payload: defaultFormState });
                setVariantMatrixRows({});
                setErrors({});
                setIsSkuManuallyEdited(false);
                triggerNotification('success', 'Product created successfully!');
            } else if (mode === 'edit' && productId) {
                await updateProduct(productId, payload);
                triggerNotification('success', 'Product updated successfully!');
            }
        } catch (error: any) {
            triggerNotification('error', error.message || `Failed to ${mode} product.`, 7000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 text-[#d9e3f4] font-sans relative pb-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-primaryColor text-2xl font-extrabold tracking-tight uppercase">
                        {mode === 'add' ? 'ADD NEW PRODUCT' : `EDIT PRODUCT #${productId || ''}`}
                    </h1>
                    <p className="text-[#a6a7a6] text-sm mt-1">Configure base details, product type, inventory settings, and media.</p>
                </div>

                {status.message && (
                    <div className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                        {status.message}
                    </div>
                )}
            </div>

            <ProductInventoryTypeToggle
                productType={productType}
                setProductType={setProductType}
                ProductDetailState={ProductDetailState}
                dispatchProductDetailCreate={dispatchProductDetailCreate}
                variantMatrixRows={variantMatrixRows}
                setVariantMatrixRows={setVariantMatrixRows}
            />

            <SectionCard step={1} title="Base Details & Categorization">
                <ProductBaseDetails
                    mode={mode}
                    ProductDetailState={ProductDetailState}
                    dispatchProductDetailCreate={dispatchProductDetailCreate}
                    errors={errors}
                />
            </SectionCard>

            <SectionCard step={2} title="Product Descriptions & Content">
                <ProductContentInputs
                    ProductDetailState={ProductDetailState}
                    dispatchProductDetailCreate={dispatchProductDetailCreate}
                />
            </SectionCard>

            <SectionCard step={3} title={hasProductVariant ? "Variant Configuration & Stock Matrix" : "Simple Product Inventory & SKU"}>
                {hasProductVariant ? (
                    <ProductVariantMatrix
                        ProductDetailState={ProductDetailState}
                        dispatchProductDetailCreate={dispatchProductDetailCreate}
                        variantMatrixRows={variantMatrixRows}
                        setVariantMatrixRows={setVariantMatrixRows}
                        errors={errors}
                    />
                ) : (
                    <ProductSimpleInventory
                        ProductDetailState={ProductDetailState}
                        dispatchProductDetailCreate={dispatchProductDetailCreate}
                        setIsSkuManuallyEdited={setIsSkuManuallyEdited}
                        errors={errors}
                    />
                )}
            </SectionCard>

            <SectionCard step={4} title="Product Media & Images">
                <ProductMedia
                    ProductDetailState={ProductDetailState}
                    dispatchProductDetailCreate={dispatchProductDetailCreate}
                    errors={errors}
                />
            </SectionCard>

            <div className="fixed bottom-0 left-0 right-0 bg-[#12171e]/95 backdrop-blur-md border-t border-greyColor/20 p-4 z-40">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div>
                        {status.message && (
                            <div
                                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${status.type === 'success'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                                    }`}
                            >
                                {status.message}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleFormSubmit}
                        disabled={isSaving}
                        className="bg-primaryColor text-black font-extrabold text-xs tracking-wider uppercase px-8 py-3 rounded-xl shadow-lg hover:bg-primaryColor/90 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            mode === 'add' ? 'Publish Product' : 'Save Changes'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}