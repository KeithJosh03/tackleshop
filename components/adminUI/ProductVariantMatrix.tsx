'use client';

import React, { useState, KeyboardEvent, useMemo, useEffect, Dispatch } from 'react';
import { Trash2, Plus, X, RefreshCw } from 'lucide-react';
import { ProductDetails, ProductDetailActionCreate } from '@/lib/reducer/productReducer';
import { generateVariantSkuFromTitle } from '@/lib/utils/skuGenerator';

export interface MatrixRowData {
    skuCode: string;
    stockQuantity: string;
    price: string;
    variantOptionIds: number[];
    imageUrl: File | string | null;
}

interface ProductVariantMatrixProps {
    ProductDetailState: ProductDetails;
    dispatchProductDetailCreate: Dispatch<ProductDetailActionCreate>;
    variantMatrixRows: Record<string, MatrixRowData>;
    setVariantMatrixRows: React.Dispatch<React.SetStateAction<Record<string, MatrixRowData>>>;
    errors?: Record<string, string>;
}

export function ProductVariantMatrix({
    ProductDetailState,
    dispatchProductDetailCreate,
    variantMatrixRows,
    setVariantMatrixRows,
    errors = {},
}: ProductVariantMatrixProps) {
    const [pillInputs, setPillInputs] = useState<Record<number, string>>({});
    const [bulkPrice, setBulkPrice] = useState('');
    const [bulkStock, setBulkStock] = useState('');

    // Compute option combinations
    const combinations = useMemo(() => {
        const validVariants = ProductDetailState.variants.filter(v => v.variantOptions.length > 0);
        if (validVariants.length === 0) return [];

        let combos: { id: string; name: string; optionValues: string[]; optionIds: number[] }[] = [
            { id: '', name: '', optionValues: [], optionIds: [] }
        ];

        for (const variant of validVariants) {
            const nextCombos: { id: string; name: string; optionValues: string[]; optionIds: number[] }[] = [];
            for (const combo of combos) {
                variant.variantOptions.forEach((option, idx) => {
                    const simulatedId = (option as any).variantOptionId || (idx + 1);
                    const id = combo.id ? `${combo.id}-${option.variantOptionValue}` : option.variantOptionValue;
                    const name = combo.name
                        ? `${combo.name} | ${variant.variantTypeName}: ${option.variantOptionValue}`
                        : `${variant.variantTypeName}: ${option.variantOptionValue}`;

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
    }, [ProductDetailState.variants]);

    // Synchronize variant matrix rows when combinations change
    useEffect(() => {
        if (combinations.length > 0) {
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
    }, [combinations, ProductDetailState.productTitle, ProductDetailState.basePrice, setVariantMatrixRows]);

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

    const handleApplyBulkSettings = () => {
        if (!bulkPrice && !bulkStock) return;
        setVariantMatrixRows(prev => {
            const updated = { ...prev };
            combinations.forEach(combo => {
                if (updated[combo.id]) {
                    updated[combo.id] = {
                        ...updated[combo.id],
                        ...(bulkPrice !== '' ? { price: bulkPrice } : {}),
                        ...(bulkStock !== '' ? { stockQuantity: bulkStock } : {})
                    };
                }
            });
            return updated;
        });
    };

    return (
        <div className="flex flex-col gap-6 p-2">
            <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#a6a7a6] uppercase">Attributes & Options</span>
                <button
                    type="button"
                    onClick={handleAddVariantType}
                    className="text-xs bg-primaryColor/10 text-primaryColor hover:bg-primaryColor/20 border border-primaryColor/30 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold transition-all"
                >
                    <Plus className="w-3.5 h-3.5" /> Add Attribute
                </button>
            </div>

            {/* Attributes & Pills List */}
            {ProductDetailState.variants.map((variant, vIdx) => (
                <div key={vIdx} className="bg-[#16202c] p-4 rounded-xl border border-greyColor/30 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        <input
                            type="text"
                            value={variant.variantTypeName}
                            onChange={(e) => dispatchProductDetailCreate({
                                type: 'UPDATE_VARIANT_TYPE_NAME',
                                payload: { variantIndex: vIdx, variantTypeName: e.target.value }
                            })}
                            className="bg-[#12171e] border border-greyColor/30 px-3 py-1.5 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-primaryColor"
                            placeholder="e.g. Size, Color"
                        />
                        <button
                            type="button"
                            onClick={() => dispatchProductDetailCreate({ type: 'REMOVE_VARIANT_TYPE', payload: vIdx })}
                            className="text-red-400 hover:text-red-300 p-1"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 bg-[#12171e] p-2 rounded-lg border border-greyColor/20">
                        {variant.variantOptions.map((opt, oIdx) => (
                            <span key={oIdx} className="bg-primaryColor/10 border border-primaryColor/30 text-primaryColor px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5">
                                {opt.variantOptionValue}
                                <button
                                    type="button"
                                    onClick={() => dispatchProductDetailCreate({
                                        type: 'REMOVE_VARIANT_OPTION',
                                        payload: { variantIndex: vIdx, optionIndex: oIdx }
                                    })}
                                    className="hover:text-white"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={pillInputs[vIdx] || ''}
                            onChange={(e) => setPillInputs({ ...pillInputs, [vIdx]: e.target.value })}
                            onKeyDown={(e) => handlePillKeyDown(e, vIdx)}
                            placeholder="Type option and hit Enter..."
                            className="bg-transparent text-xs text-white placeholder:text-[#a6a7a6]/50 focus:outline-none px-2 py-1 min-w-[160px]"
                        />
                    </div>
                </div>
            ))}

            {errors.variants && <span className="text-xs text-[#ffb4ab]">{errors.variants}</span>}

            {/* Matrix Table */}
            {combinations.length > 0 && (
                <div className="overflow-x-auto border border-greyColor/30 rounded-xl mt-2">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#16202c] border-b border-greyColor/30 text-[11px] uppercase tracking-wider text-[#a6a7a6]">
                                <th className="p-3">Variant Combination</th>
                                <th className="p-3">SKU</th>
                                <th className="p-3">Price (₱)</th>
                                <th className="p-3">Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-greyColor/20 text-xs">
                            {combinations.map(combo => {
                                const row = variantMatrixRows[combo.id] || { skuCode: '', price: ProductDetailState.basePrice, stockQuantity: '0' };
                                return (
                                    <tr key={combo.id} className="hover:bg-[#16202c]/50">
                                        <td className="p-3 font-semibold text-white">{combo.name}</td>
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={row.skuCode}
                                                onChange={(e) => setVariantMatrixRows({
                                                    ...variantMatrixRows,
                                                    [combo.id]: { ...row, skuCode: e.target.value }
                                                })}
                                                className="bg-[#12171e] border border-greyColor/30 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-primaryColor w-full"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                value={row.price}
                                                onChange={(e) => setVariantMatrixRows({
                                                    ...variantMatrixRows,
                                                    [combo.id]: { ...row, price: e.target.value }
                                                })}
                                                className="bg-[#12171e] border border-greyColor/30 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-primaryColor w-28"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                value={row.stockQuantity}
                                                onChange={(e) => setVariantMatrixRows({
                                                    ...variantMatrixRows,
                                                    [combo.id]: { ...row, stockQuantity: e.target.value }
                                                })}
                                                className="bg-[#12171e] border border-greyColor/30 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-primaryColor w-24"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}