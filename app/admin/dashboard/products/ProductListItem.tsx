'use client';

import { ProductListDashboard } from '@/types/productTypes';
import { numericConverter } from '@/utils/priceUtils';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { inter } from '@/types/fonts';

interface ProductListItemProps {
    product: ProductListDashboard;
    isExpanded: boolean;
    onToggleRow: (id: number) => void;
    onToggleStatus: (product: ProductListDashboard) => void;
    onToggleSkuStatus: (productId: number, skuId: number) => void;
    onDeleteRequest: (product: ProductListDashboard) => void;
}

export default function ProductListItem({
    product,
    isExpanded,
    onToggleRow,
    onToggleStatus,
    onToggleSkuStatus,
    onDeleteRequest,
}: ProductListItemProps) {
    return (
        <div className="flex flex-col border-b border-[#212b37] last:border-b-0">
            <div
                className={`grid grid-cols-[auto_2fr_1fr_1fr_1.5fr_auto] gap-4 p-5 items-center hover:bg-[#16202c]/50 transition-colors ${isExpanded ? 'bg-[#16202c]/30' : ''
                    }`}
            >
                {/* Product Info */}
                <div className="flex items-center gap-3">
                    <div className="flex flex-col min-w-0">
                        <span className="text-white font-bold text-sm truncate">{product.productTitle}</span>
                        <span className="text-[#a6a7a6] text-xs truncate">
                            Category {'>'} {product.subCategoryName}
                        </span>
                    </div>
                </div>

                {/* Brand */}
                <div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#212b37] border border-[#303a47] text-[#d9e3f4] text-[11px] font-semibold uppercase tracking-wider">
                        {product.brandName}
                    </span>
                </div>

                {/* Base Price */}
                <div className={`${inter.className} text-white font-medium text-sm`}>
                    {numericConverter(product.basePrice)}
                </div>

                {/* Variants & Stock */}
                <div className="flex flex-col gap-1">
                    {product.hasVariants ? (
                        <>
                            <div className="flex items-center gap-1 text-[#d9e3f4] text-[11px] font-semibold">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    ></path>
                                </svg>
                                {product.productTypeVariant?.length || 0} Attributes
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-[#a6a7a6] font-medium">{product.productSkus.length} Total SKUs</span>
                                <span className="bg-[#1a2e1d] text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    [ {product.productSkus.reduce((acc, sku) => acc + sku.stockQuantity, 0)} Units ]
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-1 text-[#d9e3f4] text-[11px] font-semibold">
                                <span className="text-[#a6a7a6] font-normal">SKU:</span>{' '}
                                <span className="font-mono text-[#a6a7a6]">{product.sku || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs mt-0.5">
                                <span className="text-[#a6a7a6] font-medium">Standard Item</span>
                                <span className="bg-[#1a2e1d] text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    [ {product.stockQuantity || 0} Units ]
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pr-2">
                    {/* Status Toggle */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(product);
                        }}
                        className={`p-1 transition-colors ${product.isActive ? 'text-green-400 hover:text-red-400' : 'text-red-400 hover:text-green-400'
                            }`}
                        title={product.isActive ? 'Deactivate Product' : 'Activate Product'}
                    >
                        {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-80" />}
                    </button>

                    {/* Edit Link */}
                    <Link
                        href={`/admin/dashboard/products/product-edit/${product.productId}`}
                        className="text-[#a6a7a6] hover:text-[#ffb77c] transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                    </Link>

                    {/* Delete Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRequest(product);
                        }}
                        className={`transition-colors p-1 ${product.isActive ? 'text-secondary opacity-30 cursor-not-allowed' : 'text-[#a6a7a6] hover:text-[#ffb4ab]'
                            }`}
                        title={product.isActive ? 'Cannot delete active product' : 'Delete Product'}
                        disabled={product.isActive}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Expand Toggle */}
                    {product.hasVariants ? (
                        <button
                            onClick={() => onToggleRow(product.productId)}
                            className="text-[#a6a7a6] hover:text-white transition-colors w-6 h-6 flex items-center justify-center bg-[#212b37] rounded-full"
                        >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    ) : (
                        <div className="w-6 h-6"></div>
                    )}
                </div>
            </div>

            {/* Expanded Variant Sub-rows */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-l-2 border-[#ffb77c] ml-[28px] mr-5 mb-4 bg-[#16202c] rounded-r-lg"
                    >
                        <div className="p-4">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#2c3542]">
                                        <th className="text-left pb-3 text-[#a6a7a6] text-[10px] uppercase font-bold tracking-wider">
                                            Variant Spec
                                        </th>
                                        <th className="text-left pb-3 text-[#a6a7a6] text-[10px] uppercase font-bold tracking-wider">
                                            SKU Code
                                        </th>
                                        <th className="text-left pb-3 text-[#a6a7a6] text-[10px] uppercase font-bold tracking-wider">
                                            Price
                                        </th>
                                        <th className="text-left pb-3 text-[#a6a7a6] text-[10px] uppercase font-bold tracking-wider">
                                            Stock
                                        </th>
                                        <th className="text-right pb-3 pr-2 text-[#a6a7a6] text-[10px] uppercase font-bold tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`${inter.className}`}>
                                    {!product.hasVariants ? (
                                        <tr className="border-b border-[#212b37] last:border-0 hover:bg-[#212b37]/50">
                                            <td className="py-3 text-[#d9e3f4] font-medium text-xs">Default Variant</td>
                                            <td className="py-3 text-[#a6a7a6] font-mono text-[11px]">{product.sku || 'No SKU'}</td>
                                            <td className="py-3 text-white font-medium text-xs">{numericConverter(product.basePrice)}</td>
                                            <td className="py-3 text-[#d9e3f4] text-xs">{product.stockQuantity || 0} units</td>
                                            <td className="py-3 flex justify-end pr-2">
                                                <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                                                    <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        product.productSkus.map((sku) => (
                                            <tr key={sku.skuId} className="border-b border-[#212b37] last:border-0 hover:bg-[#212b37]/50">
                                                <td className="py-3 text-[#d9e3f4] font-medium text-xs">
                                                    {sku.variantOptions.map((opt) => opt.optionName).join(' / ')}
                                                </td>
                                                <td className="py-3 text-[#a6a7a6] font-mono text-[11px]">{sku.skuCode}</td>
                                                <td className="py-3 text-white font-medium text-xs">{numericConverter(sku.price)}</td>
                                                <td className="py-3 text-[#d9e3f4] text-xs">{sku.stockQuantity} units</td>
                                                <td className="py-3 flex justify-end pr-2">
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onToggleSkuStatus(product.productId, sku.skuId);
                                                        }}
                                                        className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${sku.isActive ? 'bg-emerald-500' : 'bg-[#ffb4ab]'}`}
                                                    >
                                                        <div
                                                            className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${sku.isActive ? 'right-0.5' : 'left-0.5'}`}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}