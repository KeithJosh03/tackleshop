'use client';

import React from 'react';
import { AlertTriangle, Layers, Box } from 'lucide-react';

interface ProductTypeConversionModalProps {
    isOpen: boolean;
    targetType: 'simple' | 'variant';
    variantCount: number;
    matrixRowCount: number;
    currentStockSum: number;
    currentBasePrice: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ProductTypeConversionModal({
    isOpen,
    targetType,
    variantCount,
    matrixRowCount,
    currentStockSum,
    currentBasePrice,
    onConfirm,
    onCancel,
}: ProductTypeConversionModalProps) {
    if (!isOpen) return null;

    const isConvertingToSimple = targetType === 'simple';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#12171e] border border-[#2c3542] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
                {/* Header Icon & Title */}
                <div className="flex items-center gap-3">
                    <div
                        className={`p-3 rounded-xl ${isConvertingToSimple
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-[#ffb77c]/10 text-[#ffb77c] border border-[#ffb77c]/20'
                            }`}
                    >
                        {isConvertingToSimple ? (
                            <AlertTriangle className="w-6 h-6" />
                        ) : (
                            <Layers className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white uppercase tracking-wide">
                            {isConvertingToSimple
                                ? 'Switch to Simple Product?'
                                : 'Enable Product Variations?'}
                        </h3>
                        <p className="text-xs text-[#a6a7a6]">
                            {isConvertingToSimple
                                ? 'This will consolidate your current matrix inventory.'
                                : 'Setup options like size, color, or material.'}
                        </p>
                    </div>
                </div>

                {/* Info / Impact Preview */}
                <div className="bg-[#16202c] p-4 rounded-xl text-xs space-y-2 border border-[#2c3542] text-[#d9e3f4]">
                    {isConvertingToSimple ? (
                        <>
                            <p>
                                Disabling variations will collapse{' '}
                                <strong className="text-white">{variantCount} variant type(s)</strong>{' '}
                                and <strong className="text-white">{matrixRowCount} combination row(s)</strong>.
                            </p>
                            <div className="pt-2 border-t border-[#2c3542] space-y-1 text-[#a6a7a6]">
                                <div className="flex justify-between items-center">
                                    <span>Consolidated Initial Stock:</span>
                                    <span className="text-emerald-400 font-bold">
                                        {currentStockSum} units
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Fallback Base Price:</span>
                                    <span className="text-emerald-400 font-bold">
                                        ₱{currentBasePrice || '0.00'}
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>
                            Converting to a variant product allows you to define multiple SKUs,
                            individual stock levels, and price adjustments per option combination.
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2.5 rounded-xl border border-[#2c3542] text-xs font-semibold text-[#a6a7a6] hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg ${isConvertingToSimple
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-[#ffb77c] text-[#12171e] hover:bg-[#ffb77c]/90'
                            }`}
                    >
                        {isConvertingToSimple ? 'Convert to Simple' : 'Enable Variations'}
                    </button>
                </div>
            </div>
        </div>
    );
}