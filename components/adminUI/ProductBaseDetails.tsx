'use client';

import React, { Dispatch } from 'react';
import { ProductFormState, ProductFormAction } from '@/lib/reducer/productFormReducer';
import {
    DashboardSelectBrand,
    DashboardSelectCategory,
    DashboardSelectSubCategory,
} from '@/components/adminUI';

import {
    JNT_PACKAGING_PRESETS,
    PackagingType,
    calcVolumetricWeightKg,
    calcChargeableWeightKg,
    isBulkyPackaging,
} from '@/lib/constants/jntPackaging';

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
            <div className="flex items-center gap-3 bg-[#12171e] p-3 rounded-lg border border-greyColor/20 w-fit">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#a6a7a6]">
                    Active Status (Available in Store)
                </label>
                <div
                    onClick={() => dispatchProductDetailCreate({ type: 'TOGGLE_IS_ACTIVE', payload: !ProductDetailState.isActive })}
                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${ProductDetailState.isActive ? 'bg-primaryColor' : 'bg-greyColor/40'}`}
                >
                    <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${ProductDetailState.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
            </div>

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

            {/* Simplified Shipping Inputs & J&T Freight Calculations */}
            <div className="bg-[#12171e]/70 border border-greyColor/20 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-greyColor/20 pb-3">
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primaryColor flex items-center gap-2">
                            <span>📦 Shipping & Packaging Configuration</span>
                            <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-primaryColor/10 text-primaryColor border border-primaryColor/20">
                                J&T Express (Davao Origin)
                            </span>
                        </h4>
                        <p className="text-[11px] text-[#a6a7a6] mt-0.5">
                            Predefined packaging tiers eliminate manual dimension measuring. Volumetric and chargeable weight are auto-calculated.
                        </p>
                    </div>

                    {isBulkyPackaging(ProductDetailState.packaging_type || 'POUCH_S') && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
                            ⚠️ Oversized / PVC Tube Handling Surcharge Applies (+₱150.00)
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. Physical Weight */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#a6a7a6] mb-2">
                            Physical Weight (Grams)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                value={ProductDetailState.weight || ProductDetailState.weight_g || ''}
                                onChange={(e) =>
                                    dispatchProductDetailCreate({
                                        type: 'UPDATE_WEIGHT_G',
                                        payload: e.target.value,
                                    })
                                }
                                className="w-full bg-[#16202c] border border-greyColor/30 rounded-lg pl-4 pr-12 py-2.5 text-[#d9e3f4] focus:outline-none focus:border-primaryColor/60 transition-all placeholder:text-[#a6a7a6]/50"
                                placeholder="e.g. 185 (Daiwa Exist) or 1100 (Mebao Box)"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a6a7a6] pointer-events-none">
                                grams
                            </span>
                        </div>
                        {errors.weight && (
                            <span className="text-xs text-[#ffb4ab] mt-1.5 block">
                                {errors.weight}
                            </span>
                        )}
                        <span className="text-[11px] text-[#a6a7a6]/70 mt-1 block">
                            Equivalent to {((Number(ProductDetailState.weight || 0)) / 1000).toFixed(2)} kg physical
                        </span>
                    </div>

                    {/* 2. Packaging Size Tier */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#a6a7a6] mb-2">
                            Packaging Size Tier
                        </label>
                        <select
                            value={ProductDetailState.packaging_type || 'POUCH_S'}
                            onChange={(e) =>
                                dispatchProductDetailCreate({
                                    type: 'UPDATE_PACKAGING_TYPE',
                                    payload: e.target.value as PackagingType,
                                })
                            }
                            className="w-full bg-[#16202c] border border-greyColor/30 rounded-lg px-4 py-2.5 text-[#d9e3f4] focus:outline-none focus:border-primaryColor/60 transition-all cursor-pointer"
                        >
                            <option value="POUCH_S">✉️ Pouch S (Small Accessories / Lures)</option>
                            <option value="POUCH_L">✉️ Pouch L (Reels & Accessories)</option>
                            <option value="BOX_S">📦 Box S (Standard Tackle Box)</option>
                            <option value="BOX_M">📦 Box M (Medium Tackle Case)</option>
                            <option value="BOX_L">📦 Box L (Large Storage / Mebao Box)</option>
                            <option value="LONG_PARCEL">🎣 Long Parcel / Tube (Fishing Rods)</option>
                        </select>
                        <span className="text-[11px] text-[#a6a7a6]/70 mt-1 block">
                            {JNT_PACKAGING_PRESETS[ProductDetailState.packaging_type || 'POUCH_S']?.description}
                        </span>
                    </div>
                </div>

                {/* 3. Live Volumetric & Chargeable Weight Preview */}
                {(() => {
                    const currentPkg = ProductDetailState.packaging_type || 'POUCH_S';
                    const preset = JNT_PACKAGING_PRESETS[currentPkg] || JNT_PACKAGING_PRESETS.POUCH_S;
                    const physicalG = Number(ProductDetailState.weight || ProductDetailState.weight_g || 0);
                    const physicalKg = physicalG / 1000;
                    const volKg = calcVolumetricWeightKg(currentPkg);
                    const chargeableKg = calcChargeableWeightKg(physicalG, currentPkg);
                    const isVolumetricGoverning = volKg > physicalKg;

                    return (
                        <div className="mt-3 pt-3 border-t border-greyColor/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="bg-[#0b0f14]/60 p-3 rounded-lg border border-greyColor/15">
                                <span className="text-[10px] uppercase text-[#a6a7a6] tracking-wider block">
                                    Preset Dimensions
                                </span>
                                <span className="text-sm font-semibold text-[#d9e3f4] mt-0.5 block">
                                    {preset.length} × {preset.width} × {preset.height} cm
                                </span>
                                <span className="text-[10px] text-[#a6a7a6]">
                                    Divisor: 3,500
                                </span>
                            </div>

                            <div className="bg-[#0b0f14]/60 p-3 rounded-lg border border-greyColor/15">
                                <span className="text-[10px] uppercase text-[#a6a7a6] tracking-wider block">
                                    Volumetric Weight
                                </span>
                                <span className="text-sm font-semibold text-cyan-400 mt-0.5 block">
                                    {volKg.toFixed(2)} kg
                                </span>
                                <span className="text-[10px] text-[#a6a7a6]">
                                    ({preset.length} × {preset.width} × {preset.height}) ÷ 3500
                                </span>
                            </div>

                            <div className={`p-3 rounded-lg border ${isVolumetricGoverning ? 'bg-primaryColor/10 border-primaryColor/30' : 'bg-[#0b0f14]/60 border-greyColor/15'}`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase text-primaryColor font-bold tracking-wider">
                                        Chargeable Weight
                                    </span>
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-greyColor/20 text-[#a6a7a6]">
                                        MAX(Phys, Vol)
                                    </span>
                                </div>
                                <span className="text-base font-bold text-primaryColor mt-0.5 block">
                                    {chargeableKg.toFixed(2)} kg
                                </span>
                                <span className="text-[10px] text-[#a6a7a6]">
                                    {isVolumetricGoverning ? 'Governed by Volumetric Size' : 'Governed by Physical Weight'}
                                </span>
                            </div>
                        </div>
                    );
                })()}
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