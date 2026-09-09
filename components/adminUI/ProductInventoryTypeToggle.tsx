'use client';

import React, { Dispatch } from 'react';
import { Box } from 'lucide-react';
import { ProductDetails, ProductDetailActionCreate } from '@/lib/reducer/productReducer';

interface ProductInventoryTypeToggleProps {
    productType: 'simple' | 'variant';
    setProductType: (type: 'simple' | 'variant') => void;
    ProductDetailState: ProductDetails;
    dispatchProductDetailCreate: Dispatch<ProductDetailActionCreate>;
}

export function ProductInventoryTypeToggle({
    productType,
    setProductType,
    ProductDetailState,
    dispatchProductDetailCreate,
}: ProductInventoryTypeToggleProps) {
    const handleSelectVariant = () => {
        setProductType('variant');
        if (ProductDetailState.variants.length === 0) {
            dispatchProductDetailCreate({
                type: 'ADD_VARIANT_TYPE',
                payload: {
                    variantTypeName: 'Attribute 1',
                    variantOptions: [],
                },
            });
        }
    };

    return (
        <div className="bg-[#12171e] p-5 rounded-2xl border border-greyColor/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primaryColor/10 text-primaryColor border border-primaryColor/20">
                    <Box className="w-5 h-5" />
                </div>
                <div>
                    <span className="block text-xs font-extrabold uppercase tracking-wider text-white">
                        PRODUCT INVENTORY TYPE
                    </span>
                    <p className="text-xs text-[#a6a7a6] mt-0.5">Select simple or variant type.</p>
                </div>
            </div>
            <div className="flex items-center bg-[#16202c] p-1 rounded-xl border border-greyColor/30 shrink-0">
                <button
                    type="button"
                    onClick={() => setProductType('simple')}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${productType === 'simple'
                            ? 'bg-primaryColor text-black shadow-md'
                            : 'text-[#a6a7a6] hover:text-[#d9e3f4]'
                        }`}
                >
                    Simple Product
                </button>
                <button
                    type="button"
                    onClick={handleSelectVariant}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${productType === 'variant'
                            ? 'bg-primaryColor text-black shadow-md'
                            : 'text-[#a6a7a6] hover:text-[#d9e3f4]'
                        }`}
                >
                    Variant Product
                </button>
            </div>
        </div>
    );
}