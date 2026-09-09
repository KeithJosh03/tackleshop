'use client';

import React, { useState, useReducer, KeyboardEvent, useMemo, useEffect } from 'react';
import { Trash2, Plus, X, Box, RefreshCw } from 'lucide-react';

import { createProduct, updateProduct } from '@/lib/api/productService';
import { generateSimpleSku, generateVariantSkuFromTitle } from '@/lib/utils/skuGenerator';
import { ProductDetailCreateReducer, ProductDetails } from '@/lib/reducer/productReducer';
import { AddProductValidation } from '@/lib/validation/AddProductValidation';



import {
    DashboardSelectBrand,
    DashboardSelectCategory,
    DashboardSelectSubCategory,
    SectionCard, ProductContentInputs,
    ProductVariantMatrix, ProductInventoryTypeToggle,
    ProductBaseDetails, ProductMedia
} from '@/components/adminUI'


interface MatrixRowData {
    skuCode: string;
    stockQuantity: string;
    price: string;
    variantOptionIds: number[];
    imageUrl: File | string | null;
}

interface ProductFormProps {
    mode: 'add' | 'edit';
    productId?: number | string;
    initialData?: any;
}

export function ProductForm({ mode, productId, initialData }: ProductFormProps) {
    const initialProductDetailState: ProductDetails = {
        productTitle: initialData?.productTitle || '',
        basePrice: initialData?.basePrice || '',
        description: initialData?.description || '',
        features: initialData?.features || '',
        brand: initialData?.brand || (initialData?.brandName ? { brandName: initialData.brandName } : null),
        category: initialData?.category || (initialData?.categoryName ? { categoryName: initialData.categoryName } : null),
        subCategory: initialData?.subCategory || (initialData?.subCategoryName ? { subCategoryName: initialData.subCategoryName } : null),
        specifications: initialData?.specifications || '',
        variants: initialData?.productVariants?.map((v: any) => ({
            variantTypeName: v.variantTypeName,
            variantOptions: v.variantOptions?.map((o: any) => ({
                variantOptionId: o.variantOptionId,
                variantOptionValue: o.variantOptionValue,
                price_adjusting: o.priceAdjustment || '0',
                imageUrl: o.imageUrl || null
            })) || []
        })) || [],
        medias: (initialData?.media || initialData?.productMedias)?.map((m: any) => ({
            file: m.imageUrl || m.file || m.url || '',
            isMain: !!m.isMain
        })) || [],
        masterSku: initialData?.sku || '',
        initialStock: initialData?.stockQuantity !== null && initialData?.stockQuantity !== undefined ? String(initialData.stockQuantity) : '',
        hasVariations: !!(initialData?.isVariant || (initialData?.productVariants && initialData.productVariants.length > 0))
    };

    const [ProductDetailState, dispatchProductDetailCreate] = useReducer(ProductDetailCreateReducer, initialProductDetailState);

    const [productType, setProductType] = useState<'simple' | 'variant'>(
        initialData?.isVariant || (initialData?.productVariants && initialData.productVariants.length > 0) ? 'variant' : 'simple'
    );

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);

    const [pillInputs, setPillInputs] = useState<Record<number, string>>({});
    const [variantMatrixRows, setVariantMatrixRows] = useState<Record<string, MatrixRowData>>({});
    const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false);

    console.log(ProductDetailState)

    const hasProductVariant = productType === 'variant';

    useEffect(() => {
        if (initialData) {
            const hasVars = !!(initialData.isVariant || (initialData.productVariants && initialData.productVariants.length > 0));
            setProductType(hasVars ? 'variant' : 'simple');
            dispatchProductDetailCreate({
                type: 'CLEAR_INPUTS',
                payload: {
                    productTitle: initialData.productTitle || '',
                    basePrice: initialData.basePrice || '',
                    description: initialData.description || '',
                    features: initialData.features || '',
                    brand: initialData.brand || null,
                    category: initialData.category || null,
                    subCategory: initialData.subCategory || null,
                    specifications: initialData.specifications || '',
                    variants: initialData.productVariants?.map((v: any) => ({
                        variantTypeName: v.variantTypeName,
                        variantOptions: v.variantOptions?.map((o: any) => ({
                            variantOptionId: o.variantOptionId,
                            variantOptionValue: o.variantOptionValue,
                            price_adjusting: o.priceAdjustment || '0',
                            imageUrl: o.imageUrl || null
                        })) || []
                    })) || [],

                    medias: (initialData?.media || initialData?.productMedias)?.map((m: any) => ({
                        file: m.imageUrl || m.file || m.url || '',
                        isMain: !!m.isMain
                    })) || [],

                    masterSku: initialData.sku || '',
                    initialStock: initialData.stockQuantity !== null && initialData.stockQuantity !== undefined ? String(initialData.stockQuantity) : '',
                    hasVariations: hasVars
                }
            });

        }
    }, [initialData]);

    const combinations = useMemo(() => {
        if (!hasProductVariant) return [];
        const validVariants = ProductDetailState.variants.filter(v => v.variantOptions.length > 0);
        if (validVariants.length === 0) return [];

        let combos: { id: string; name: string; optionValues: string[]; optionIds: number[] }[] = [{ id: '', name: '', optionValues: [], optionIds: [] }];
        for (const variant of validVariants) {
            const nextCombos: { id: string; name: string; optionValues: string[]; optionIds: number[] }[] = [];
            for (const combo of combos) {
                variant.variantOptions.forEach((option, idx) => {
                    const simulatedId = (option as any).variantOptionId || (idx + 1);
                    const id = combo.id ? `${combo.id}-${option.variantOptionValue}` : option.variantOptionValue;
                    const name = combo.name ? `${combo.name} | ${variant.variantTypeName}: ${option.variantOptionValue}` : `${variant.variantTypeName}: ${option.variantOptionValue}`;
                    nextCombos.push({
                        id,
                        name,
                        optionValues: [...combo.optionValues, option.variantOptionValue],
                        optionIds: [...combo.optionIds, simulatedId]
                    });
                });
            }
            combos = nextCombos;
        }
        return combos;
    }, [ProductDetailState.variants, hasProductVariant]);

    useEffect(() => {
        if (hasProductVariant && combinations.length > 0) {
            setVariantMatrixRows(prev => {
                const newData = { ...prev };
                let updated = false;

                combinations.forEach(combo => {
                    if (!newData[combo.id]) {
                        const autoVariantSku = generateVariantSkuFromTitle(
                            ProductDetailState.productTitle,
                            combo.optionValues
                        );

                        newData[combo.id] = {
                            skuCode: autoVariantSku,
                            stockQuantity: '0',
                            price: ProductDetailState.basePrice?.toString() || '0',
                            variantOptionIds: combo.optionIds,
                            imageUrl: null,
                        };
                        updated = true;
                    }
                });
                return updated ? newData : prev;
            });
        }
    }, [combinations, hasProductVariant, ProductDetailState.productTitle, ProductDetailState.basePrice]);

    useEffect(() => {
        if (mode === 'add' && !isSkuManuallyEdited && ProductDetailState.productTitle && !hasProductVariant) {
            const brandName = ProductDetailState.brand?.brandName || '';
            const autoSku = generateSimpleSku(ProductDetailState.productTitle, brandName);
            dispatchProductDetailCreate({ type: 'UPDATE_MASTER_SKU', payload: autoSku });
        }
    }, [ProductDetailState.productTitle, ProductDetailState.brand, hasProductVariant, isSkuManuallyEdited, mode]);

    const buildVariantMatrixPayload = () =>
        combinations.map((combo) => {
            const row = variantMatrixRows[combo.id];
            return {
                sku_code: row?.skuCode ?? '',
                price: Number(row?.price) || 0,
                stock_quantity: parseInt(String(row?.stockQuantity || '0'), 10) || 0,
                variant_option_ids: row?.variantOptionIds ?? combo.optionIds,
                variant_option_values: combo.optionValues,
                imageUrl: row?.imageUrl ?? null,
            };
        });

    const handleFormSubmit = async () => {
        const validationState = {
            ...ProductDetailState,
            variant_matrix: hasProductVariant ? buildVariantMatrixPayload() : [],
        };

        const { isValid, errors: newErrors } = AddProductValidation(validationState);
        const currentErrors = { ...newErrors };
        let canSubmit = isValid;

        if (!hasProductVariant) {
            if (!ProductDetailState.masterSku?.trim()) {
                currentErrors.masterSku = "Product SKU is required for Simple Product Mode.";
                canSubmit = false;
            }
        } else {
            if (combinations.length === 0) {
                currentErrors.variants = "Please add at least one variant attribute and option pill.";
                canSubmit = false;
            }
        }

        setErrors(currentErrors);

        if (!canSubmit) {
            setStatusType('error');
            setStatusMessage('Validation failed. Please check highlighted fields.');
            setTimeout(() => { setStatusMessage(null); setStatusType(null); }, 5000);
            return;
        }

        setIsSaving(true);
        setStatusMessage(null);

        const payload: ProductDetails & { variantMatrixRows?: any[] } = {
            ...ProductDetailState,
            masterSku: hasProductVariant ? '' : ProductDetailState.masterSku,
            initialStock: hasProductVariant ? '' : ProductDetailState.initialStock,
            variants: hasProductVariant ? ProductDetailState.variants : [],
            variantMatrixRows: hasProductVariant ? buildVariantMatrixPayload() : []
        };

        try {
            if (mode === 'add') {
                await createProduct(payload as any);
                dispatchProductDetailCreate({ type: 'CLEAR_INPUTS', payload: initialProductDetailState });
                setVariantMatrixRows({});
                setErrors({});
                setStatusType('success');
                setStatusMessage('Product created successfully!');
            } else if (mode === 'edit' && productId) {
                await updateProduct(productId, payload as any);
                setStatusType('success');
                setStatusMessage('Product updated successfully!');
            }
            setTimeout(() => { setStatusMessage(null); setStatusType(null); }, 5000);
        } catch (error: any) {
            setStatusType('error');
            setStatusMessage(error.message || `Failed to ${mode} product.`);
            setTimeout(() => { setStatusMessage(null); setStatusType(null); }, 7000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddVariantType = () => {
        dispatchProductDetailCreate({
            type: 'ADD_VARIANT_TYPE',
            payload: {
                variantTypeName: `Attribute ${ProductDetailState.variants.length + 1}`,
                variantOptions: []
            }
        });
    };

    const handlePillKeyDown = (e: KeyboardEvent<HTMLInputElement>, variantIndex: number) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = (pillInputs[variantIndex] || '').trim();
            if (val) {
                const exists = ProductDetailState.variants[variantIndex]?.variantOptions.find(opt => opt.variantOptionValue === val);
                if (!exists) {
                    dispatchProductDetailCreate({
                        type: 'ADD_VARIANT_OPTION',
                        payload: {
                            variantIndex,
                            variantOption: {
                                variantOptionValue: val,
                                price_adjusting: '',
                                imageUrl: null
                            }
                        }
                    });
                }
                setPillInputs({ ...pillInputs, [variantIndex]: '' });
            }
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

                {statusMessage && (
                    <div className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${statusType === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                        {statusMessage}
                    </div>
                )}
            </div>

            {/* Inventory Type Toggle */}
            <ProductInventoryTypeToggle
                productType={productType}
                setProductType={setProductType}
                ProductDetailState={ProductDetailState}
                dispatchProductDetailCreate={dispatchProductDetailCreate}
            />

            {/* Base Details & Categorization */}
            <SectionCard step={1} title="Base Details & Categorization">
                <ProductBaseDetails
                    mode={mode}
                    ProductDetailState={ProductDetailState}
                    dispatchProductDetailCreate={dispatchProductDetailCreate}
                    errors={errors}
                />
            </SectionCard>

            {/* Product Descriptions and Content Inputs */}
            <SectionCard step={2} title="Product Descriptions & Content">
                <ProductContentInputs
                    ProductDetailState={ProductDetailState}
                    dispatchProductDetailCreate={dispatchProductDetailCreate}
                />
            </SectionCard>

            {/* Simple Product SKU/Stock */}
            {hasProductVariant && (
                <SectionCard step={3} title="Variant Configuration & Stock Matrix">
                    <ProductVariantMatrix
                        ProductDetailState={ProductDetailState}
                        dispatchProductDetailCreate={dispatchProductDetailCreate}
                        variantMatrixRows={variantMatrixRows}
                        setVariantMatrixRows={setVariantMatrixRows}
                        errors={errors}
                    />
                </SectionCard>
            )}

            {/* Media Upload Section */}
            <SectionCard step={4} title="Product Media & Images">
                <ProductMedia
                    ProductDetailState={ProductDetailState}
                    dispatchProductDetailCreate={dispatchProductDetailCreate}
                    errors={errors}
                />
            </SectionCard>

            {/* Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#12171e]/95 backdrop-blur-md border-t border-greyColor/20 p-4 z-40">
                <div className="max-w-7xl mx-auto flex items-center justify-end gap-4">
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