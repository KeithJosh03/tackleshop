'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, FileText, Layers, Minus, Package, Plus, Tag, ShoppingCart } from 'lucide-react';

import ProductDetailsDropDown from '@/components/ProductDetailsDropDown';

import { useCart } from '@/contexts/CartContext';
import { SetupDetailsViewProps } from '@/types/setupTypes';
import { numericConverter } from '@/utils/priceUtils';
import { slugify } from '@/utils/slugUtils';
import {
    partitionSetupBundleItems,
    buildDefaultGroupSelections,
    buildChoicesPayload,
    allChoiceGroupsSelected
} from '@/lib/utils/setupBundleGroups';

function getImageUrl(path?: string | null): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return base ? `${base}${cleanPath}` : cleanPath;
}

export default function SetupDetailClient({ setupDetailProps }: { setupDetailProps: SetupDetailsViewProps }) {
    const [setup] = useState(setupDetailProps);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);

    const { fixed, choiceGroups } = useMemo(() => partitionSetupBundleItems(setup.bundleItems ?? []), [setup.bundleItems]);
    const [groupSelections, setGroupSelections] = useState<Record<string, number>>(() => buildDefaultGroupSelections(choiceGroups));

    const medias = setup.setupMedias ?? [];

    useEffect(() => {
        const main = medias.find((m) => m.isMain) ?? medias[0];
        setSelectedMediaId(main?.mediaId ?? null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setup.setupId]);

    const currentImage = medias.find((m) => m.mediaId === selectedMediaId);

    const displayPrice = setup.finalPrice || setup.bundlePrice;
    const compareAt = setup.compareAtPrice || (setup.retailPrice && parseFloat(setup.retailPrice) > parseFloat(setup.bundlePrice) ? setup.retailPrice : null);

    const isOutOfStock = !setup.inStock || setup.stockQuantity <= 0;
    const needsVariantSelection = !allChoiceGroupsSelected(choiceGroups, groupSelections);

    const includedSummary = useMemo(() => {
        const itemCount = setup.bundleItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
        const inclusionCount = setup.inclusions?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
        return itemCount + inclusionCount;
    }, [setup.bundleItems, setup.inclusions]);

    const handleAddToCart = async () => {
        if (isOutOfStock || needsVariantSelection) {
            if (needsVariantSelection) {
                alert('Please select all required options for this setup.');
            }
            return;
        }

        setIsAdding(true);
        try {
            const payload = {
                setup_id: setup.setupId,
                quantity,
                choices: buildChoicesPayload(choiceGroups, groupSelections)
            };
            const success = await addToCart(payload);
            if (success) {
                setQuantity(1);
            } else {
                alert('Failed to add setup to cart. Please try again.');
            }
        } finally {
            setIsAdding(false);
        }
    };

    const whatsIncludedHtml = (
        <div className="flex flex-col gap-6 text-sm text-ma-on-surface-variant leading-relaxed">
            {(fixed.length > 0 || choiceGroups.length > 0) && (
                <ul className="space-y-3">
                    {/* Render Fixed Items */}
                    {fixed.map((item, idx) => (
                        <li key={`fixed-${item.setupItemId || idx}`} className="flex gap-3 items-start">
                            {item.thumbnailUrl ? (
                                <span className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-black/30 border border-white/10">
                                    <Image src={getImageUrl(item.thumbnailUrl)} alt="" fill className="object-contain p-1" sizes="48px" />
                                </span>
                            ) : (
                                <span className="w-12 h-12 shrink-0 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                    <Package className="w-5 h-5 text-ma-primary/60" />
                                </span>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] uppercase font-bold text-ma-on-surface-variant/70 mb-0.5">Included Item</p>
                                <p className="text-ma-on-surface font-semibold">
                                    {item.quantity}×{' '}
                                    {item.productId ? (
                                        <Link
                                            href={`/product-details/${item.productId}/${slugify(item.productTitle || 'product')}`}
                                            className="hover:text-ma-primary transition-colors"
                                        >
                                            {item.productTitle || 'Product'}
                                        </Link>
                                    ) : (
                                        item.productTitle || 'Product'
                                    )}
                                </p>
                                {item.skuCode && (
                                    <p className="text-[11px] uppercase tracking-wider mt-0.5 text-ma-on-surface-variant">
                                        SKU: {item.skuCode}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}

                    {/* Render Choice Groups with active User Selection UI state */}
                    {choiceGroups.map((group, idx) => {
                        const selectedId = groupSelections[group.groupName];
                        const opt = group.options.find(o => o.setupItemId === selectedId) || group.options[0];
                        if (!opt) return null;

                        return (
                            <li
                                key={`choice-${group.groupName}-${idx}`}
                                className="flex gap-3 items-start p-2.5 rounded-xl bg-ma-primary/[0.04] border border-ma-primary/20 relative"
                            >
                                {opt.thumbnailUrl ? (
                                    <span className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-black/30 border border-white/10">
                                        <Image src={getImageUrl(opt.thumbnailUrl)} alt="" fill className="object-contain p-1" sizes="48px" />
                                    </span>
                                ) : (
                                    <span className="w-12 h-12 shrink-0 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                        <Package className="w-5 h-5 text-ma-primary/60" />
                                    </span>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-[10px] uppercase font-bold text-ma-primary tracking-wider">{group.groupName}</p>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-ma-primary bg-ma-primary/10 px-2 py-0.5 rounded-full">
                                            <CheckCircle2 className="w-3 h-3" /> Selected Choice
                                        </span>
                                    </div>
                                    <p className="text-ma-on-surface font-semibold">
                                        {opt.quantity}×{' '}
                                        {opt.productId ? (
                                            <Link
                                                href={`/product-details/${opt.productId}/${slugify(opt.productTitle || 'product')}`}
                                                className="hover:text-ma-primary transition-colors"
                                            >
                                                {opt.productTitle || 'Product'}
                                            </Link>
                                        ) : (
                                            opt.productTitle || 'Product'
                                        )}
                                    </p>
                                    {opt.skuCode && (
                                        <p className="text-[11px] uppercase tracking-wider mt-0.5 text-ma-on-surface-variant">
                                            SKU: {opt.skuCode}
                                        </p>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {setup.inclusions?.length > 0 && (
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ma-primary mb-2">Bonus inclusions</p>
                    <ul className="space-y-2">
                        {setup.inclusions.map((inc, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                <Tag className="w-3.5 h-3.5 text-ma-primary shrink-0" />
                                <span>
                                    {inc.quantity}× {inc.title}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:sticky lg:top-32 self-start">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full aspect-[4/5] bg-ma-surface-container-low/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl"
                >
                    <AnimatePresence mode="wait">
                        {currentImage?.imageUrl ? (
                            <motion.div
                                key={currentImage.mediaId}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.04 }}
                                transition={{ duration: 0.4 }}
                                className="relative w-full h-full p-8"
                            >
                                <Image
                                    src={getImageUrl(currentImage.imageUrl)}
                                    alt={setup.bundleTitle}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                                {setup.discountLabel && (
                                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[0.65rem] font-black px-2.5 py-1 rounded-sm uppercase tracking-wider z-10 shadow-md">
                                        {setup.discountLabel} SALE
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 text-ma-on-surface-variant">
                                <Layers className="w-16 h-16 opacity-30" />
                                <span className="text-sm tracking-widest uppercase">No image</span>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {medias.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto py-2 custom-scrollbar snap-x">
                        {medias.map((img) => (
                            <button
                                key={img.mediaId}
                                type="button"
                                onClick={() => setSelectedMediaId(img.mediaId)}
                                className={`relative w-28 h-28 shrink-0 rounded-xl overflow-hidden transition-all duration-300 snap-center ${selectedMediaId === img.mediaId
                                    ? 'ring-2 ring-ma-primary ring-offset-2 ring-offset-ma-background scale-105 opacity-100'
                                    : 'border border-white/10 opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <Image
                                    src={getImageUrl(img.imageUrl)}
                                    alt=""
                                    fill
                                    sizes="112px"
                                    className="object-cover p-2"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-ma-primary font-bold tracking-[0.15em] text-xs uppercase bg-ma-primary/10 px-3 py-1.5 rounded">
                            Curated Setup
                        </span>
                        {setup.categoryName && (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-ma-surface-bright" />
                                <span className="text-ma-on-surface-variant text-xs font-semibold tracking-wider uppercase">
                                    {setup.categoryName}
                                </span>
                            </>
                        )}
                    </div>

                    <h1 className="text-ma-on-surface text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.02em]">
                        {setup.bundleTitle}
                    </h1>

                    <p className="text-sm text-ma-on-surface-variant font-semibold uppercase tracking-wider">
                        {includedSummary} pieces in this bundle · SKU {setup.sku}
                    </p>

                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl md:text-5xl font-extrabold text-ma-primary">
                                {numericConverter(displayPrice)}
                            </span>
                            {compareAt && parseFloat(compareAt) > parseFloat(displayPrice) && (
                                <span className="text-2xl md:text-3xl font-semibold text-ma-on-surface-variant line-through">
                                    {numericConverter(compareAt)}
                                </span>
                            )}
                        </div>
                        <div
                            className={`text-sm font-semibold tracking-wide ${setup.inStock ? 'text-green-400' : 'text-red-400'}`}
                        >
                            {setup.inStock ? `${setup.stockQuantity} bundles in stock` : 'Out of stock'}
                        </div>
                    </div>
                </div>

                <hr className="border-white/10 mt-6" />

                {choiceGroups.length > 0 && (
                    <div className="flex flex-col gap-6">
                        {choiceGroups.map(group => {
                            const hasMultipleOptions = group.options.length > 1;
                            const selectedOpt = group.options.find(o => o.setupItemId === groupSelections[group.groupName]) || group.options[0];

                            if (!hasMultipleOptions) {
                                return (
                                    <div key={group.groupName} className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-ma-on-surface-variant uppercase tracking-wider">
                                            {group.groupName} <span className="text-[10px] text-ma-primary/70 font-normal lowercase">(Included)</span>
                                        </label>
                                        <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-ma-surface-container-low/50">
                                            {selectedOpt?.thumbnailUrl ? (
                                                <div className="w-10 h-10 shrink-0 relative rounded bg-black/40 overflow-hidden">
                                                    <Image src={getImageUrl(selectedOpt.thumbnailUrl)} alt="" fill className="object-contain p-1" sizes="40px" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-white/5 rounded">
                                                    <Package className="w-4 h-4 opacity-50" />
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className="text-sm font-semibold text-white truncate">
                                                    {selectedOpt?.productTitle}
                                                </span>
                                                {selectedOpt?.skuCode && (
                                                    <span className="text-[10px] text-ma-on-surface-variant uppercase truncate">
                                                        SKU: {selectedOpt.skuCode}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs font-medium text-ma-on-surface-variant px-2.5 py-1 rounded bg-white/5">
                                                Fixed
                                            </span>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={group.groupName} className="flex flex-col gap-3">
                                    <label className="text-xs font-bold text-ma-on-surface uppercase tracking-wider flex items-center justify-between">
                                        <span>Select {group.groupName}</span>
                                        <span className="text-[10px] text-ma-primary font-normal">Choose 1</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {group.options.map(opt => (
                                            <label
                                                key={opt.setupItemId}
                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${groupSelections[group.groupName] === opt.setupItemId
                                                    ? 'bg-ma-primary/10 border-ma-primary shadow-sm'
                                                    : 'bg-ma-surface-container-low border-white/10 hover:bg-white/5'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={group.groupName}
                                                    checked={groupSelections[group.groupName] === opt.setupItemId}
                                                    onChange={() => setGroupSelections(prev => ({ ...prev, [group.groupName]: opt.setupItemId! }))}
                                                    className="w-4 h-4 text-ma-primary bg-black border-white/20 focus:ring-ma-primary focus:ring-1"
                                                />
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    {opt.thumbnailUrl ? (
                                                        <div className="w-10 h-10 shrink-0 relative rounded bg-black/40 overflow-hidden">
                                                            <Image src={getImageUrl(opt.thumbnailUrl)} alt="" fill className="object-contain p-1" sizes="40px" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-white/5 rounded">
                                                            <Package className="w-4 h-4 opacity-50" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-semibold text-white truncate">
                                                            {opt.productTitle}
                                                        </span>
                                                        {opt.skuCode && (
                                                            <span className="text-[10px] text-ma-on-surface-variant uppercase truncate">
                                                                SKU: {opt.skuCode}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        <hr className="border-white/10" />
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mt-2 mb-4">
                    <div className="flex items-center justify-between bg-ma-surface-container-low border border-white/10 rounded-xl px-4 py-3 h-14 sm:w-32 shrink-0">
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1 || isOutOfStock}
                            className="text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            <Minus className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                        <span className="text-white font-bold text-lg select-none w-8 text-center">{quantity}</span>
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.min(setup.stockQuantity, quantity + 1))}
                            disabled={quantity >= setup.stockQuantity || isOutOfStock}
                            className="text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            <Plus className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || isAdding || needsVariantSelection}
                        className={`flex-1 flex items-center justify-center gap-x-3 h-14 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 relative overflow-hidden
                            ${isOutOfStock || needsVariantSelection
                                ? 'bg-ma-surface-container-low text-white/30 cursor-not-allowed'
                                : 'bg-ma-primary text-black hover:bg-ma-primary/90 hover:scale-[1.02] shadow-[0_4px_20px_rgba(255,196,154,0.3)] hover:shadow-[0_4px_30px_rgba(255,196,154,0.4)]'
                            }
                        `}
                    >
                        {isAdding ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                                {isOutOfStock ? 'Out of Stock' : (needsVariantSelection ? 'Select All Options' : 'Add Bundle to Cart')}
                            </>
                        )}
                    </button>
                </div>

                <ProductDetailsDropDown
                    defaultOpenSection="included"
                    sections={[
                        { id: 'description', label: 'DESCRIPTION', icon: FileText, content: setup.description },
                        {
                            id: 'included',
                            label: "WHAT'S INCLUDED",
                            icon: Layers,
                            content: whatsIncludedHtml,
                        },
                    ]}
                />
            </div>
        </div>
    );
}