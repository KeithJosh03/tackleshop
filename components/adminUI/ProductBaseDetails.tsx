'use client';

import React, { Dispatch } from 'react';
import { ProductFormState, ProductFormAction } from '@/lib/reducer/productFormReducer';
import {
    DashboardSelectBrand,
    DashboardSelectCategory,
    DashboardSelectSubCategory,
} from '@/components/adminUI';

interface ProductBaseDetailsProps {
    mode: 'add' | 'edit';
    ProductDetailState: ProductFormState;
    dispatchProductDetailCreate: Dispatch<ProductFormAction>;
    errors?: Record<string, string>;
}

export function ProductBaseDetails({
    mode,
    ProductDetailState,
    dispatchProductDetailCreate,
    errors = {},
}: ProductBaseDetailsProps) {
    const reducerType = mode === 'edit' ? 'EDIT' : 'CREATE';

    return (
        <div className="flex flex-col gap-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#a6a7a6] mb-2">
                        Product Title <span className="text-[#ffb4ab]">*</span>
                    </label>
                    <input
                        type="text"
                        value={ProductDetailState.productTitle || ''}
                        onChange={(e) =>
                            dispatchProductDetailCreate({
                                type: 'UPDATE_TITLE',
                                payload: e.target.value,
                            })
                        }
                        className="w-full bg-[#16202c] border border-greyColor/30 rounded-lg px-4 py-2.5 text-[#d9e3f4] focus:outline-none focus:border-primaryColor/60 transition-all placeholder:text-[#a6a7a6]/50"
                        placeholder="e.g. Fishing Rod Spec-X"
                    />
                    {errors.productTitle && (
                        <span className="text-xs text-[#ffb4ab] mt-1.5 block">
                            {errors.productTitle}
                        </span>
                    )}
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#a6a7a6]">
                        Base Price (₱) <span className="text-[#ffb4ab]">*</span>
                    </label>
                    <input
                        type="number"
                        value={ProductDetailState.basePrice || ''}
                        onChange={(e) =>
                            dispatchProductDetailCreate({
                                type: 'UPDATE_BASE_PRICE',
                                payload: e.target.value,
                            })
                        }
                        className="w-full bg-[#16202c] border border-greyColor/30 rounded-lg px-4 py-2.5 text-[#d9e3f4] focus:outline-none focus:border-primaryColor/60 transition-all placeholder:text-[#a6a7a6]/50"
                        placeholder="0.00"
                    />
                    {errors.basePrice && (
                        <span className="text-xs text-[#ffb4ab] mt-1.5 block">
                            {errors.basePrice}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Brand Picker */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a6a7a6]">
                        Brand
                    </label>
                    <DashboardSelectBrand
                        reducerType={reducerType}
                        choosenBrand={ProductDetailState.brand || null}
                        dispatchProductDetailCreate={dispatchProductDetailCreate}
                    />
                    {errors.brand && (
                        <span className="text-xs text-[#ffb4ab] mt-1">{errors.brand}</span>
                    )}
                </div>

                {/* Category Picker */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a6a7a6]">
                        Category
                    </label>
                    <DashboardSelectCategory
                        ReducerType={reducerType}
                        currentCategory={ProductDetailState.category || null}
                        dispatchProductDetailCreate={dispatchProductDetailCreate}
                    />
                    {errors.category && (
                        <span className="text-xs text-[#ffb4ab] mt-1">{errors.category}</span>
                    )}
                </div>

                {/* SubCategory Picker */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#a6a7a6]">
                        Sub Category
                    </label>
                    <DashboardSelectSubCategory
                        ReducerType={reducerType}
                        currentSubCategory={ProductDetailState.subCategory || null}
                        currentCategory={ProductDetailState.category || null}
                        dispatchProductDetailCreate={dispatchProductDetailCreate}
                    />
                    {errors.subCategory && (
                        <span className="text-xs text-[#ffb4ab] mt-1">
                            {errors.subCategory}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}