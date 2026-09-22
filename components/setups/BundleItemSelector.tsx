'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Layers, Check, Plus, Package, PenTool } from 'lucide-react';
import { ProductListDashboardSearch } from '@/lib/api/productService';
import { ProductListDashboard, ProductListDashboardSku } from '@/types/productTypes';

export interface SelectedBundleItem {
    id: string; // unique internal key
    product_id: number;
    sku_id?: number | null;
    product_title: string;
    variant_name: string;
    sku_code: string;
    unit_price: number;
    quantity: number;
    is_required: boolean;
    image_url?: string | null;
    product: ProductListDashboard | null;
    sku?: ProductListDashboardSku | null;
    variant_label?: string;
    is_custom?: boolean;
}

export interface BundleItemSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectItems: (items: SelectedBundleItem[]) => void;
}

export function BundleItemSelector({ isOpen, onClose, onSelectItems }: BundleItemSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<ProductListDashboard[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductListDashboard | null>(null);
    const [selectedSku, setSelectedSku] = useState<ProductListDashboardSku | null>(null);

    // Custom Item State
    const [activeTab, setActiveTab] = useState<'catalog' | 'custom'>('catalog');
    const [customTitle, setCustomTitle] = useState('');
    const [customPrice, setCustomPrice] = useState<string>('0');

    useEffect(() => {
        if (isOpen) {
            fetchCatalogProducts('');
        }
    }, [isOpen]);

    const fetchCatalogProducts = async (term: string) => {
        setIsLoading(true);
        try {
            const data = await ProductListDashboardSearch(term, 1);
            console.log(data);
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error searching catalog:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);
        fetchCatalogProducts(val);
    };

    const handleAddSelected = () => {
        let itemToAdd: SelectedBundleItem;

        if (activeTab === 'custom') {
            if (!customTitle.trim()) return;
            const unitPrice = parseFloat(customPrice || '0');
            itemToAdd = {
                id: `custom-${Date.now()}`,
                product_id: 0,
                sku_id: null,
                product_title: customTitle,
                variant_name: 'Unlisted Item',
                variant_label: 'Unlisted Item',
                sku_code: `CUSTOM-${Date.now().toString().slice(-4)}`,
                unit_price: unitPrice,
                quantity: 1,
                is_required: true,
                image_url: null,
                product: null,
                sku: null,
                is_custom: true,
            };
        } else {
            if (!selectedProduct) return;

            if (selectedProduct.hasVariants && selectedSku) {
                const variantOptionsText = selectedSku.variantOptions?.map(o => o.optionName).join(' / ') || 'Variant';
                const unitPrice = parseFloat(selectedSku.price || selectedProduct.basePrice || '0');
                itemToAdd = {
                    id: `${selectedProduct.productId}-${selectedSku.skuId}`,
                    product_id: selectedProduct.productId,
                    sku_id: selectedSku.skuId,
                    product_title: selectedProduct.productTitle,
                    variant_name: variantOptionsText,
                    variant_label: variantOptionsText,
                    sku_code: selectedSku.skuCode || `SKU-${selectedSku.skuId}`,
                    unit_price: unitPrice,
                    quantity: 1,
                    is_required: true,
                    image_url: null,
                    product: selectedProduct,
                    sku: selectedSku,
                };
            } else if (selectedProduct.hasVariants && !selectedSku) {
                const unitPrice = parseFloat(selectedProduct.basePrice || '0');
                itemToAdd = {
                    id: `${selectedProduct.productId}-flexible`,
                    product_id: selectedProduct.productId,
                    sku_id: null,
                    product_title: selectedProduct.productTitle,
                    variant_name: 'Customer Choice (Flexible)',
                    variant_label: 'Customer Choice (Flexible)',
                    sku_code: selectedProduct.sku || `PRD-${selectedProduct.productId}`,
                    unit_price: unitPrice,
                    quantity: 1,
                    is_required: true,
                    image_url: null,
                    product: selectedProduct,
                    sku: null,
                };
            } else {
                const unitPrice = parseFloat(selectedProduct.basePrice || '0');
                itemToAdd = {
                    id: `${selectedProduct.productId}-simple`,
                    product_id: selectedProduct.productId,
                    sku_id: null,
                    product_title: selectedProduct.productTitle,
                    variant_name: 'Base Product',
                    variant_label: 'Base Product',
                    sku_code: selectedProduct.sku || `PRD-${selectedProduct.productId}`,
                    unit_price: unitPrice,
                    quantity: 1,
                    is_required: true,
                    image_url: null,
                    product: selectedProduct,
                    sku: null,
                };
            }
        }

        onSelectItems([itemToAdd]);
        setSelectedProduct(null);
        setSelectedSku(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#12171e] border-2 border-greyColor/20 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                {/* Modal Header */}
                <div className="flex flex-col border-b border-greyColor/20 bg-white/[0.02]">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2.5">
                            <Package className="w-5 h-5 text-primaryColor" />
                            <h2 className="text-white text-lg font-bold uppercase tracking-tight">Add Item to Bundle</h2>
                        </div>
                        <button onClick={onClose} className="text-[#a6a7a6] hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-6 px-6 pt-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('catalog')}
                            className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'catalog' ? 'border-primaryColor text-primaryColor' : 'border-transparent text-[#788ca5] hover:text-white'}`}
                        >
                            Catalog Search
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('custom')}
                            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'custom' ? 'border-amber-400 text-amber-400' : 'border-transparent text-[#788ca5] hover:text-white'}`}
                        >
                            <PenTool className="w-4 h-4" /> Custom Inclusion
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-1">
                    {activeTab === 'catalog' ? (
                        <>
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="w-4 h-4 text-[#a6a7a6] absolute left-3.5 top-3.5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search catalog products by title, category, or SKU..."
                                    className="w-full bg-[#16202c] border border-greyColor/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#d9e3f4] focus:outline-none focus:border-primaryColor/60 transition-all placeholder:text-[#a6a7a6]/50"
                                />
                            </div>

                            {/* Products Grid / List */}
                            <div className="space-y-3">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a6a7a6]">1. Choose Product</label>
                                {isLoading ? (
                                    <div className="py-8 text-center text-xs text-[#a6a7a6]">Searching catalog...</div>
                                ) : products.length === 0 ? (
                                    <div className="py-8 text-center text-xs text-[#a6a7a6]">No products found matching &quot;{searchQuery}&quot;.</div>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                        {products.map((prod) => {
                                            const isSelected = selectedProduct?.productId === prod.productId;
                                            return (
                                                <div
                                                    key={prod.productId}
                                                    onClick={() => {
                                                        setSelectedProduct(prod);
                                                        setSelectedSku(null);
                                                    }}
                                                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected ? 'bg-primaryColor/10 border-primaryColor text-white' : 'bg-[#16202c]/60 border-greyColor/20 text-[#d9e3f4] hover:bg-[#16202c]'}`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-xs">{prod.productTitle}</span>
                                                        <span className="text-[10px] text-[#a6a7a6]">{prod.brandName || 'Brand'} • Base ${prod.basePrice}</span>
                                                    </div>
                                                    {prod.hasVariants ? (
                                                        <span className="px-2 py-0.5 rounded bg-primaryColor/20 text-primaryColor text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                            <Layers className="w-3 h-3" /> {prod.productSkus?.length || 0} Variants
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-mono text-[#a6a7a6]">SKU: {prod.sku || 'N/A'}</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Variant Selection List if Product Has Variants */}
                            {selectedProduct && selectedProduct.hasVariants && (
                                <div className="space-y-3 pt-4 border-t border-greyColor/20">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#a6a7a6]">2. Choose SKU Variant Option</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                        <div
                                            onClick={() => setSelectedSku(null)}
                                            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${selectedSku === null ? 'bg-amber-500/20 border-amber-500/50 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-[#16202c]/80 border-greyColor/20 text-[#d9e3f4] hover:bg-[#16202c]'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-xs text-amber-500">Flexible: Customer Choice</span>
                                                {selectedSku === null && <Check className="w-4 h-4 text-amber-500" />}
                                            </div>
                                            <div className="flex items-center justify-between mt-2 text-[11px] text-[#a6a7a6]">
                                                <span className="font-mono">Any Variant</span>
                                                <span className="font-semibold text-white">Base: ${selectedProduct.basePrice}</span>
                                            </div>
                                        </div>
                                        {selectedProduct.productSkus?.map((sku) => {
                                            const isSkuSelected = selectedSku?.skuId === sku.skuId;
                                            const variantOptionsText = sku.variantOptions?.map(o => o.optionName).join(' / ') || `SKU #${sku.skuId}`;
                                            return (
                                                <div
                                                    key={sku.skuId}
                                                    onClick={() => setSelectedSku(sku)}
                                                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${isSkuSelected ? 'bg-primaryColor/20 border-primaryColor text-white' : 'bg-[#16202c]/80 border-greyColor/20 text-[#d9e3f4] hover:bg-[#16202c]'}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-xs text-primaryColor">{variantOptionsText}</span>
                                                        {isSkuSelected && <Check className="w-4 h-4 text-primaryColor" />}
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2 text-[11px] text-[#a6a7a6]">
                                                        <span className="font-mono">Code: {sku.skuCode}</span>
                                                        <span className="font-semibold text-white">${sku.price}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-5">
                            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-400 text-sm">
                                Use this tab to add unlisted items (like generic snaps, free lines, or custom lures) that do not exist as standard products in your catalog.
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#9cb3cf] uppercase tracking-wider">Item Name / Description</label>
                                <input
                                    type="text"
                                    value={customTitle}
                                    onChange={(e) => setCustomTitle(e.target.value)}
                                    placeholder="e.g. 10pcs generic swivel snap"
                                    className="w-full bg-[#16202c] border border-greyColor/30 rounded-xl px-4 py-3 text-sm text-[#d9e3f4] focus:outline-none focus:border-amber-400 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#9cb3cf] uppercase tracking-wider">Estimated Retail Value ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={customPrice}
                                    onChange={(e) => setCustomPrice(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-[#16202c] border border-greyColor/30 rounded-xl px-4 py-3 text-sm text-[#d9e3f4] focus:outline-none focus:border-amber-400 transition-all"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-greyColor/20 bg-white/[0.02]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-greyColor/30 text-xs font-semibold text-[#d9e3f4] hover:bg-[#16202c] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={activeTab === 'catalog' ? !selectedProduct : !customTitle.trim()}
                        onClick={handleAddSelected}
                        className={`px-5 py-2 rounded-xl text-black text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 ${activeTab === 'custom' ? 'bg-amber-400 hover:bg-amber-500' : 'bg-primaryColor hover:bg-primaryColor/90'}`}
                    >
                        <Plus className="w-4 h-4 stroke-[3]" /> Add to Bundle
                    </button>
                </div>
            </div>
        </div>
    );
}