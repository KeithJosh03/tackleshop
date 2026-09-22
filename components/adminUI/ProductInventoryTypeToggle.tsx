'use client';

import React, { useState, Dispatch } from 'react';
import { Layers, Box } from 'lucide-react';
import { ProductFormState, ProductFormAction } from '@/lib/reducer/productFormReducer';
import { ProductTypeConversionModal } from './ProductTypeConversionModal';

interface MatrixRowData {
    skuCode: string;
    stockQuantity: string;
    price: string;
    variantOptionIds: (string | number)[];
    imageUrl: File | string | null;
}

interface ProductInventoryTypeToggleProps {
    productType: 'simple' | 'variant';
    setProductType: (type: 'simple' | 'variant') => void;
    ProductDetailState: ProductFormState;
    dispatchProductDetailCreate: Dispatch<ProductFormAction>;
    variantMatrixRows?: Record<string, MatrixRowData>;
    setVariantMatrixRows?: Dispatch<React.SetStateAction<Record<string, MatrixRowData>>>;
}

export function ProductInventoryTypeToggle({
    productType,
    setProductType,
    ProductDetailState,
    dispatchProductDetailCreate,
    variantMatrixRows = {},
    setVariantMatrixRows,
}: ProductInventoryTypeToggleProps) {
    const [pendingType, setPendingType] = useState<'simple' | 'variant' | null>(null);

    const matrixRowList = Object.values(variantMatrixRows);
    const totalMatrixStock = matrixRowList.reduce(
        (sum, row) => sum + (parseInt(row.stockQuantity, 10) || 0),
        0
    );
    const firstMatrixPrice = matrixRowList[0]?.price || ProductDetailState.basePrice || '0';
    const firstMatrixSku = matrixRowList[0]?.skuCode || ProductDetailState.masterSku || '';

    const handleTypeClick = (targetType: 'simple' | 'variant') => {
        if (targetType === productType) return;
        setPendingType(targetType);
    };

    const handleConfirmConversion = () => {
        if (!pendingType) return;

        if (pendingType === 'simple') {
            // Converting Variant -> Simple

            // 1. Toggle flag in reducer
            dispatchProductDetailCreate({
                type: 'TOGGLE_HAS_VARIATIONS',
                payload: false,
            });

            // 2. Clear variant definitions from reducer state using strong typing
            dispatchProductDetailCreate({
                type: 'CLEAR_VARIANTS',
            });

            // 3. Clear local variant matrix state if setter was provided
            if (setVariantMatrixRows) {
                setVariantMatrixRows({});
            }

            // 4. Transfer aggregated stock to Simple Product master state
            if (totalMatrixStock > 0) {
                dispatchProductDetailCreate({
                    type: 'UPDATE_INITIAL_STOCK',
                    payload: String(totalMatrixStock),
                });
            }

            // 5. Fallback base price if not already defined
            if (!ProductDetailState.basePrice && firstMatrixPrice) {
                dispatchProductDetailCreate({
                    type: 'UPDATE_BASE_PRICE',
                    payload: firstMatrixPrice,
                });
            }

            // 6. Preserve primary SKU fallback if missing
            if (!ProductDetailState.masterSku && firstMatrixSku) {
                dispatchProductDetailCreate({
                    type: 'UPDATE_MASTER_SKU',
                    payload: firstMatrixSku,
                });
            }

            setProductType('simple');
        } else {
            // Converting Simple -> Variant

            // 1. Toggle flag in reducer
            dispatchProductDetailCreate({
                type: 'TOGGLE_HAS_VARIATIONS',
                payload: true,
            });

            // 2. If no variants exist yet, seed a default variant attribute
            if (ProductDetailState.variants.length === 0) {
                dispatchProductDetailCreate({
                    type: 'ADD_VARIANT_TYPE',
                    payload: {
                        id: `vtype-${Date.now()}`,
                        variantTypeName: 'Option',
                        variantOptions: [
                            {
                                id: `vopt-${Date.now()}-0`,
                                variantOptionValue: 'Default',
                                price_adjusting: '0',
                                imageUrl: null,
                            },
                        ],
                    },
                });
            }

            setProductType('variant');
        }

        setPendingType(null);
    };

    return (
        <>
            <div className="bg-[#16202c] p-4 rounded-xl border border-[#2c3542] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                        Product Configuration Type
                    </h3>
                    <p className="text-xs text-[#a6a7a6] mt-0.5">
                        Select whether this product has variations or is a simple standalone item.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-[#12171e] p-1.5 rounded-xl border border-[#2c3542] w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => handleTypeClick('simple')}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${productType === 'simple'
                            ? 'bg-[#ffb77c] text-[#12171e] shadow-md'
                            : 'text-[#a6a7a6] hover:text-white'
                            }`}
                    >
                        <Box className="w-4 h-4" />
                        Simple Product
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTypeClick('variant')}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${productType === 'variant'
                            ? 'bg-[#ffb77c] text-[#12171e] shadow-md'
                            : 'text-[#a6a7a6] hover:text-white'
                            }`}
                    >
                        <Layers className="w-4 h-4" />
                        Variant Product
                    </button>
                </div>
            </div>

            <ProductTypeConversionModal
                isOpen={pendingType !== null}
                targetType={pendingType || 'simple'}
                variantCount={ProductDetailState.variants.length}
                matrixRowCount={matrixRowList.length}
                currentStockSum={totalMatrixStock}
                currentBasePrice={firstMatrixPrice}
                onConfirm={handleConfirmConversion}
                onCancel={() => setPendingType(null)}
            />
        </>
    );
}

export default ProductInventoryTypeToggle;