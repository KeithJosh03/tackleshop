'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, X, Image as ImageIcon, Upload } from 'lucide-react';
import Image from 'next/image';
import { ProductFormState, ProductFormAction } from '@/lib/reducer/productFormReducer';
import { FileDropImage } from '@/components/ui';

interface MatrixRowData {
    skuCode: string;
    stockQuantity: string;
    price: string;
    variantOptionIds: (string | number)[];
    imageUrl: File | string | null;
}

interface ProductVariantMatrixProps {
    ProductDetailState: ProductFormState;
    dispatchProductDetailCreate: React.Dispatch<ProductFormAction>;
    variantMatrixRows: Record<string, MatrixRowData>;
    setVariantMatrixRows: React.Dispatch<React.SetStateAction<Record<string, MatrixRowData>>>;
    errors?: Record<string, string>;
}

export function ProductVariantMatrix({
    ProductDetailState,
    dispatchProductDetailCreate,
    variantMatrixRows,
    setVariantMatrixRows,
    errors
}: ProductVariantMatrixProps) {
    const [newAttributeName, setNewAttributeName] = useState('');
    const [optionInputs, setOptionInputs] = useState<Record<string | number, string>>({});

    // Hover preview state
    const [hoveredImage, setHoveredImage] = useState<{ url: string; title: string } | null>(null);

    // Track object URLs for uploaded File objects to avoid memory leaks
    const objectUrls = useMemo(() => {
        const urls: Record<string, string> = {};
        Object.entries(variantMatrixRows).forEach(([key, row]) => {
            if (row.imageUrl instanceof File) {
                urls[key] = URL.createObjectURL(row.imageUrl);
            }
        });
        return urls;
    }, [variantMatrixRows]);

    // Clean up Blob URLs when files change or component unmounts
    useEffect(() => {
        return () => {
            Object.values(objectUrls).forEach((url) => URL.revokeObjectURL(url));
        };
    }, [objectUrls]);

    const handleAddVariantType = () => {
        const trimmed = newAttributeName.trim();
        if (!trimmed) return;

        dispatchProductDetailCreate({
            type: 'ADD_VARIANT_TYPE',
            payload: {
                id: `vtype-${Date.now()}`,
                variantTypeName: trimmed,
                variantOptions: []
            }
        });
        setNewAttributeName('');
    };

    const handleAddVariantOption = (typeId: string | number) => {
        const value = (optionInputs[typeId] || '').trim();
        if (!value) return;

        dispatchProductDetailCreate({
            type: 'ADD_VARIANT_OPTION',
            payload: {
                typeId,
                option: {
                    id: `vopt-${Date.now()}`,
                    variantOptionValue: value,
                    price_adjusting: '0',
                    imageUrl: null
                }
            }
        });

        setOptionInputs(prev => ({ ...prev, [typeId]: '' }));
    };

    const handleRowChange = (comboId: string, field: keyof MatrixRowData, value: any) => {
        // 1. Update Matrix Table local state
        setVariantMatrixRows(prev => ({
            ...prev,
            [comboId]: {
                ...prev[comboId],
                [field]: value
            }
        }));

        // 2. Sync image changes directly with ProductDetailState.variants
        if (field === 'imageUrl') {
            const rowData = variantMatrixRows[comboId];
            if (rowData?.variantOptionIds && rowData.variantOptionIds.length > 0) {
                rowData.variantOptionIds.forEach((optId) => {
                    const parentType = ProductDetailState.variants.find(v =>
                        v.variantOptions.some(o => o.id === optId)
                    );

                    if (parentType) {
                        dispatchProductDetailCreate({
                            type: 'UPDATE_VARIANT_OPTION',
                            payload: {
                                typeId: parentType.id,
                                optionId: optId,
                                fields: { imageUrl: value }
                            }
                        });
                    }
                });
            }
        }
    };

    const handleRemoveImage = (comboId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        handleRowChange(comboId, 'imageUrl', null);
        if (hoveredImage?.title === comboId) {
            setHoveredImage(null);
        }
    };

    const matrixKeys = Object.keys(variantMatrixRows);

    return (
        <div className="flex flex-col gap-8 relative">
            {/* Hover Popover Preview */}
            {hoveredImage && (
                <div className="fixed bottom-6 right-6 z-50 p-2 bg-[#12171e] border border-primaryColor/40 shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                    <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-[#0b0f14]">
                        <Image
                            src={hoveredImage.url}
                            alt={hoveredImage.title}
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    </div>
                    <p className="mt-2 text-[11px] font-bold text-center text-[#d9e3f4] truncate max-w-[12rem]">
                        {hoveredImage.title}
                    </p>
                </div>
            )}

            {/* Step 1: Define Attributes & Values */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primaryColor">
                    1. Define Variant Attributes & Option Values
                </h3>

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Add Attribute (e.g. Size, Color, Material)"
                        value={newAttributeName}
                        onChange={(e) => setNewAttributeName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVariantType())}
                        className="bg-[#0b0f14] border border-greyColor/20 rounded-xl px-4 py-2.5 text-sm text-[#d9e3f4] focus:outline-none focus:border-primaryColor w-full sm:w-80"
                    />
                    <button
                        type="button"
                        onClick={handleAddVariantType}
                        className="bg-primaryColor text-black font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-primaryColor/90 transition-all flex items-center gap-1.5 shrink-0"
                    >
                        <Plus className="w-4 h-4" /> Add Attribute
                    </button>
                </div>

                {errors?.variants && (
                    <p className="text-xs text-red-400 font-semibold">{errors.variants}</p>
                )}

                <div className="flex flex-col gap-4 mt-2">
                    {ProductDetailState.variants.map((vType) => (
                        <div key={vType.id} className="bg-[#0b0f14]/60 border border-greyColor/15 rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-4">
                                <input
                                    type="text"
                                    value={vType.variantTypeName}
                                    onChange={(e) => dispatchProductDetailCreate({
                                        type: 'UPDATE_VARIANT_TYPE_NAME',
                                        payload: { typeId: vType.id, name: e.target.value }
                                    })}
                                    className="bg-transparent text-sm font-bold text-primaryColor focus:outline-none border-b border-transparent focus:border-primaryColor px-1 py-0.5"
                                />
                                <button
                                    type="button"
                                    onClick={() => dispatchProductDetailCreate({ type: 'REMOVE_VARIANT_TYPE', payload: vType.id })}
                                    className="text-red-400/70 hover:text-red-400 transition-colors p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {vType.variantOptions.map((opt) => (
                                    <div
                                        key={opt.id}
                                        className="inline-flex items-center gap-1.5 bg-[#12171e] border border-greyColor/30 rounded-lg px-2.5 py-1 text-xs text-[#d9e3f4] font-medium focus-within:border-primaryColor transition-colors"
                                    >
                                        <input
                                            type="text"
                                            value={opt.variantOptionValue}
                                            onChange={(e) => dispatchProductDetailCreate({
                                                type: 'UPDATE_VARIANT_OPTION',
                                                payload: {
                                                    typeId: vType.id,
                                                    optionId: opt.id,
                                                    fields: { variantOptionValue: e.target.value }
                                                }
                                            })}
                                            className="bg-transparent text-xs text-[#d9e3f4] font-medium focus:outline-none border-b border-transparent focus:border-primaryColor px-0.5 py-0"
                                            style={{
                                                width: `${Math.max((opt.variantOptionValue || '').length, 2)}ch`
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => dispatchProductDetailCreate({
                                                type: 'REMOVE_VARIANT_OPTION',
                                                payload: { typeId: vType.id, optionId: opt.id }
                                            })}
                                            className="text-[#a6a7a6] hover:text-red-400 transition-colors shrink-0"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}

                                <div className="inline-flex items-center gap-1">
                                    <input
                                        type="text"
                                        placeholder="Add value..."
                                        value={optionInputs[vType.id] || ''}
                                        onChange={(e) => setOptionInputs({ ...optionInputs, [vType.id]: e.target.value })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddVariantOption(vType.id);
                                            }
                                        }}
                                        className="bg-[#0b0f14] border border-greyColor/20 rounded-lg px-2.5 py-1 text-xs text-[#d9e3f4] focus:outline-none focus:border-primaryColor w-28"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddVariantOption(vType.id)}
                                        className="p-1 bg-greyColor/20 hover:bg-greyColor/40 text-[#d9e3f4] rounded-lg transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 2: Variant Matrix Table */}
            {matrixKeys.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primaryColor">
                        2. Variant Combinations & Stock Matrix
                    </h3>

                    <div className="overflow-x-auto border border-greyColor/20 rounded-xl bg-[#0b0f14]/40">
                        <table className="w-full text-left text-xs text-[#d9e3f4]">
                            <thead className="bg-[#12171e] text-[#a6a7a6] uppercase tracking-wider text-[11px] border-b border-greyColor/20">
                                <tr>
                                    <th className="py-3 px-4">Variant</th>
                                    <th className="py-3 px-4">SKU Code</th>
                                    <th className="py-3 px-4">Price ($)</th>
                                    <th className="py-3 px-4">Stock Qty</th>
                                    <th className="py-3 px-4 text-center">Image</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-greyColor/10">
                                {matrixKeys.map((comboId) => {
                                    const row = variantMatrixRows[comboId];
                                    if (!row) return null;

                                    const previewUrl = typeof row.imageUrl === 'string'
                                        ? row.imageUrl
                                        : objectUrls[comboId];

                                    return (
                                        <tr key={comboId} className="hover:bg-[#12171e]/50 transition-colors">
                                            <td className="py-3 px-4 font-semibold text-[#d9e3f4]">
                                                {comboId}
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="text"
                                                    value={row.skuCode}
                                                    onChange={(e) => handleRowChange(comboId, 'skuCode', e.target.value)}
                                                    className="bg-[#0b0f14] border border-greyColor/20 rounded-lg px-3 py-1.5 text-xs text-[#d9e3f4] focus:outline-none focus:border-primaryColor w-full"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={row.price}
                                                    onChange={(e) => handleRowChange(comboId, 'price', e.target.value)}
                                                    className="bg-[#0b0f14] border border-greyColor/20 rounded-lg px-3 py-1.5 text-xs text-[#d9e3f4] focus:outline-none focus:border-primaryColor w-24"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    value={row.stockQuantity}
                                                    onChange={(e) => handleRowChange(comboId, 'stockQuantity', e.target.value)}
                                                    className="bg-[#0b0f14] border border-greyColor/20 rounded-lg px-3 py-1.5 text-xs text-[#d9e3f4] focus:outline-none focus:border-primaryColor w-20"
                                                />
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div
                                                    className="flex justify-center items-center"
                                                    onMouseEnter={() => previewUrl && setHoveredImage({ url: previewUrl, title: comboId })}
                                                    onMouseLeave={() => setHoveredImage(null)}
                                                >
                                                    {previewUrl ? (
                                                        <div className="relative w-10 h-10 group shrink-0">
                                                            {/* Thumbnail & Centered Replace Overlay */}
                                                            <FileDropImage
                                                                maxImages={1}
                                                                onFileChange={(files) => {
                                                                    const file = Array.isArray(files) ? files[0] : files;
                                                                    if (file) handleRowChange(comboId, 'imageUrl', file);
                                                                }}
                                                                className="w-full h-full rounded-lg overflow-hidden border border-greyColor/30 bg-[#12171e] relative cursor-pointer"
                                                            >
                                                                <Image
                                                                    src={previewUrl}
                                                                    alt={comboId}
                                                                    fill
                                                                    unoptimized={typeof row.imageUrl !== 'string'}
                                                                    className="object-cover"
                                                                />

                                                                {/* Centered Upload / Replace Icon on Hover */}
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <Upload className="w-4 h-4 text-white" />
                                                                </div>
                                                            </FileDropImage>

                                                            {/* Top-Right Close / Remove Badge */}
                                                            <button
                                                                type="button"
                                                                title="Remove Image"
                                                                onClick={(e) => handleRemoveImage(comboId, e)}
                                                                className="absolute -top-1.5 -right-1.5 z-10 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
                                                            >
                                                                <X className="w-2.5 h-2.5 stroke-[3]" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <FileDropImage
                                                            maxImages={1}
                                                            onFileChange={(files) => {
                                                                const file = Array.isArray(files) ? files[0] : files;
                                                                if (file) handleRowChange(comboId, 'imageUrl', file);
                                                            }}
                                                            className="w-10 h-10 border border-dashed border-greyColor/30 hover:border-primaryColor bg-[#12171e] rounded-lg flex items-center justify-center cursor-pointer transition-all group shrink-0"
                                                        >
                                                            <ImageIcon className="w-4 h-4 text-[#a6a7a6] group-hover:text-primaryColor transition-colors" />
                                                        </FileDropImage>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}