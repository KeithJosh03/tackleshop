'use client';

import React, { Dispatch } from 'react';
import { ProductFormState, ProductFormAction } from '@/lib/reducer/productFormReducer';
import { generateSimpleSku } from '@/lib/utils/skuGenerator';
import { Sparkles } from 'lucide-react';

interface ProductSimpleInventoryProps {
    ProductDetailState: ProductFormState;
    dispatchProductDetailCreate: Dispatch<ProductFormAction>;
    setIsSkuManuallyEdited?: (edited: boolean) => void;
    errors?: Record<string, string>;
}

export function ProductSimpleInventory({
    ProductDetailState,
    dispatchProductDetailCreate,
    setIsSkuManuallyEdited,
    errors = {},
}: ProductSimpleInventoryProps) {

    const handleGenerateSku = () => {
        const title = ProductDetailState.productTitle || '';
        const brandName = ProductDetailState.brand?.brandName || '';
        const categoryName = ProductDetailState.category?.categoryName || '';
        const subCategoryName = ProductDetailState.subCategory?.subCategoryName || '';

        const generatedSku = generateSimpleSku(title, brandName, categoryName, subCategoryName);

        console.log(generatedSku);

        setIsSkuManuallyEdited?.(false);

        dispatchProductDetailCreate({
            type: 'UPDATE_MASTER_SKU',
            payload: generatedSku,
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Master SKU Field */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[#a6a7a6]">Master SKU</label>
                    <button
                        type="button"
                        onClick={handleGenerateSku}
                        className="text-xs text-[#ffb77c] hover:text-[#ffcda3] font-medium flex items-center gap-1 transition-colors focus:outline-none"
                    >
                        <Sparkles className="w-3 h-3" />
                        Auto-Generate SKU
                    </button>
                </div>
                <input
                    type="text"
                    value={ProductDetailState.masterSku || ''}
                    onChange={(e) => {
                        setIsSkuManuallyEdited?.(true);
                        dispatchProductDetailCreate({
                            type: 'UPDATE_MASTER_SKU',
                            payload: e.target.value,
                        });
                    }}
                    placeholder="e.g. SPOR-001"
                    className={`bg-[#12171e] border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffb77c] ${errors.masterSku ? 'border-[#ffb4ab]' : 'border-[#2c3542]'
                        }`}
                />
                {errors.masterSku && <span className="text-xs text-[#ffb4ab]">{errors.masterSku}</span>}
            </div>

            {/* Initial Stock Field */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#a6a7a6]">Stock Quantity</label>
                <input
                    type="number"
                    value={ProductDetailState.initialStock || ''}
                    onChange={(e) =>
                        dispatchProductDetailCreate({
                            type: 'UPDATE_INITIAL_STOCK',
                            payload: e.target.value,
                        })
                    }
                    placeholder="0"
                    className={`bg-[#12171e] border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffb77c] ${errors.initialStock ? 'border-[#ffb4ab]' : 'border-[#2c3542]'
                        }`}
                />
                {errors.initialStock && <span className="text-xs text-[#ffb4ab]">{errors.initialStock}</span>}
            </div>
        </div>
    );
}