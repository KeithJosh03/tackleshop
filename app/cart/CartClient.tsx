'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import {
    Trash2,
    Plus,
    Minus,
    ShoppingBag,
    AlertTriangle,
    ShieldCheck,
    Scale,
    Truck,
    ArrowRight,
    Tag,
    Package,
    Sparkles,
    CheckCircle2
} from 'lucide-react';
import { numericConverter } from '@/utils/priceUtils';
import { getSession } from 'next-auth/react';

function getImageUrl(path?: string | null): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return base ? `${base}${cleanPath}` : cleanPath;
}

export default function CartClient() {
    const { cart, isLoading, updateQuantity, removeFromCart } = useCart();
    const router = useRouter();

    const [evaluation, setEvaluation] = useState<any>(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
    const [hasInvalidItems, setHasInvalidItems] = useState(false);

    // Fetch live evaluation / calculations
    useEffect(() => {
        if (!cart || !cart.items || cart.items.length === 0) {
            setEvaluation(null);
            return;
        }

        const fetchCalculation = async () => {
            setIsEvaluating(true);
            try {
                const session: any = await getSession();
                let apiToken = null;
                if (session && session.accessToken) {
                    apiToken = session.accessToken;
                } else if (session && session.user && (session.user as any).token) {
                    apiToken = (session.user as any).token;
                }

                const sessionId = typeof window !== 'undefined' ? localStorage.getItem('cart_session_id') : null;

                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                };
                if (apiToken) headers['Authorization'] = `Bearer ${apiToken}`;
                if (sessionId) headers['X-Session-ID'] = sessionId;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/checkout/calculate`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ region: null })
                });

                const data = await res.json();
                if (data.status) {
                    setEvaluation(data.data);
                }
            } catch (err) {
                // Silently handle network errors
            } finally {
                setIsEvaluating(false);
            }
        };

        fetchCalculation();
    }, [cart]);

    // Track unavailable or out-of-stock items
    useEffect(() => {
        if (!cart || !cart.items) return;
        let invalid = false;
        cart.items.forEach((item: any) => {
            if (item.setup_id && item.setup) {
                if (!item.setup.is_published) invalid = true;
                if (item.setup.stock_quantity < item.quantity) invalid = true;
            } else if (item.product) {
                if (!item.product.is_active) invalid = true;
                if (item.sku && !item.sku.is_active) invalid = true;

                const stock = item.sku ? item.sku.stock_quantity : item.product.stock_quantity;
                if (stock < item.quantity) invalid = true;
            }
        });
        setHasInvalidItems(invalid);
    }, [cart]);

    // Active promotions list across the entire cart
    const activePromotions = useMemo(() => {
        if (!evaluation?.evaluated_items) return [];
        const names = evaluation.evaluated_items
            .map((ei: any) => ei.promotion_name)
            .filter((name: any): name is string => Boolean(name && typeof name === 'string'));
        return Array.from(new Set(names));
    }, [evaluation]);

    const handleUpdateQuantity = async (itemId: number, newQty: number) => {
        if (newQty < 1 || updatingItemId !== null) return;
        setUpdatingItemId(itemId);
        try {
            await updateQuantity(itemId, newQty);
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        if (updatingItemId !== null) return;
        setUpdatingItemId(itemId);
        try {
            await removeFromCart(itemId);
        } finally {
            setUpdatingItemId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-4 border-ma-primary/20 animate-ping" />
                    <div className="w-14 h-14 border-4 border-ma-primary/30 border-t-ma-primary rounded-full animate-spin" />
                </div>
                <p className="text-white/60 text-xs font-semibold tracking-widest uppercase">Loading your tackle gear...</p>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="relative overflow-hidden flex flex-col items-center justify-center py-24 text-center bg-gradient-to-b from-[#141A1F] to-[#101415] rounded-3xl border border-white/10 shadow-2xl px-6">
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-ma-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative w-24 h-24 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    <ShoppingBag className="w-12 h-12 text-ma-primary/70 stroke-1" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-wide uppercase">
                    Your Tackle Box Is Empty
                </h2>
                <p className="text-ma-on-surface-variant text-sm mb-8 max-w-md leading-relaxed">
                    You haven’t added any reels, rods, or tackle gear yet. Explore our tournament-grade Japanese fishing selection and build your ultimate setup.
                </p>
                <Link
                    href="/products"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#ffc49a] to-[#ff9d4d] text-black font-black uppercase tracking-widest text-xs rounded-xl hover:shadow-[0_0_30px_rgba(255,196,154,0.4)] hover:scale-105 active:scale-95 transition-all"
                >
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* ======================================================== */}
            {/* 1. CART ITEMS LIST (Main Panel) */}
            {/* ======================================================== */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
                {/* Header Info Banner */}
                <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                    <span>{cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'} in Tackle Box</span>
                    <span className="hidden sm:inline text-white/40">Prices reflect live promotions</span>
                </div>

                {cart.items.map((item: any) => {
                    const isSetupLine = Boolean(item.setup_id && item.setup);

                    // Image resolution
                    let imageUrl = null;
                    if (isSetupLine && item.setup?.images?.length) {
                        imageUrl =
                            item.setup.images.find((img: any) => img.isMain || img.is_main)?.image_url ||
                            item.setup.images[0]?.image_url;
                    } else if (item.sku?.images?.length > 0) {
                        imageUrl =
                            item.sku.images.find((img: any) => img.isMain || img.is_main)?.image_url ||
                            item.sku.images[0]?.image_url;
                    } else if (item.product?.images?.length > 0) {
                        imageUrl =
                            item.product.images.find((img: any) => img.is_main || img.isMain)?.image_url ||
                            item.product.images[0].image_url;
                    }

                    const detailHref = isSetupLine
                        ? `/setup-details/${item.setup_id}/${item.setup?.slug || 'setup'}`
                        : `/product-details/${item.product_id}`;

                    const title = isSetupLine
                        ? item.setup?.bundle_title
                        : item.product?.product_title;

                    // Availability & Stock Checking
                    let isAvailable = true;
                    let stockMsg = '';
                    if (isSetupLine) {
                        if (!item.setup.is_published) {
                            isAvailable = false;
                            stockMsg = 'Setup Unavailable';
                        } else if (item.setup.stock_quantity < item.quantity) {
                            isAvailable = false;
                            stockMsg = `Only ${item.setup.stock_quantity} left in stock`;
                        }
                    } else {
                        if (!item.product?.is_active || (item.sku && !item.sku?.is_active)) {
                            isAvailable = false;
                            stockMsg = 'Item Currently Inactive';
                        } else {
                            const stock = item.sku ? item.sku.stock_quantity : item.product?.stock_quantity;
                            if (stock < item.quantity) {
                                isAvailable = false;
                                stockMsg = stock === 0 ? 'Out of Stock' : `Only ${stock} left in stock`;
                            }
                        }
                    }

                    // Evaluation breakdown for this specific line
                    const evalItem = evaluation?.evaluated_items?.find(
                        (ei: any) => ei.cart_item_id === item.cart_item_id
                    );

                    // Pricing & Promotions
                    const originalUnitPrice = evalItem
                        ? Number(evalItem.price_snapshot)
                        : Number(item.sku ? item.sku.price : (item.product?.base_price ?? item.setup?.bundle_price ?? 0));

                    const unitDiscount = evalItem ? Number(evalItem.discount_applied_snapshot || 0) : 0;
                    const hasDiscount = unitDiscount > 0;
                    const discountedUnitPrice = evalItem
                        ? Number(evalItem.final_price ?? (originalUnitPrice - unitDiscount))
                        : (originalUnitPrice - unitDiscount);

                    const lineSubtotal = originalUnitPrice * item.quantity;
                    const lineFinalTotal = discountedUnitPrice * item.quantity;
                    const lineTotalSaved = unitDiscount * item.quantity;

                    // Promotion Name tag
                    const promoName = evalItem?.promotion_name || 'Active Sale';

                    // Unit Weight (in grams)
                    const unitWeight = evalItem && typeof evalItem.weight_snapshot === 'number'
                        ? evalItem.weight_snapshot
                        : Number(item.sku?.effective_weight ?? item.sku?.weight ?? item.product?.weight ?? item.setup?.effective_weight ?? item.setup?.weight ?? 0);

                    // Bulky state
                    const itemIsBulky = evalItem && typeof evalItem.is_bulky === 'boolean'
                        ? evalItem.is_bulky
                        : Boolean(item.sku?.effective_is_bulky ?? item.sku?.is_bulky ?? item.product?.is_bulky ?? item.setup?.is_bulky);

                    // Extract variant pills
                    const variantOptions = item.sku?.variant_options || item.sku?.variantOptions || [];
                    const formattedVariants: string[] = variantOptions.map((opt: any) => {
                        const typeName = opt.variant_type?.variant_name || opt.variantType?.variant_name;
                        const val = opt.variant_value;
                        if (typeName && val) return `${typeName}: ${val}`;
                        return val || '';
                    }).filter(Boolean);

                    const isLineUpdating = updatingItemId === item.cart_item_id || isEvaluating;

                    return (
                        <div
                            key={item.cart_item_id}
                            className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${!isAvailable
                                ? 'bg-red-950/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                                : hasDiscount
                                    ? 'bg-gradient-to-br from-[#161c22] via-[#141A1F] to-[#12161b] border-ma-primary/20 hover:border-ma-primary/40 shadow-xl'
                                    : 'bg-[#141A1F] border-white/10 hover:border-white/20 shadow-xl'
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                                {/* Thumbnail Image */}
                                <Link
                                    href={detailHref}
                                    className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-black/50 rounded-xl overflow-hidden border border-white/10 group-hover:border-ma-primary/40 transition-colors"
                                >
                                    {imageUrl ? (
                                        <Image
                                            src={getImageUrl(imageUrl)}
                                            alt={title || 'Product Image'}
                                            fill
                                            sizes="(max-width: 640px) 96px, 112px"
                                            className={`object-contain p-2.5 transition-transform duration-500 group-hover:scale-105 ${!isAvailable ? 'grayscale opacity-40' : ''
                                                }`}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-[10px] uppercase font-bold tracking-wider">
                                            <ShoppingBag className="w-6 h-6 mb-1 opacity-40" />
                                            <span>No Image</span>
                                        </div>
                                    )}

                                    {/* Bulky indicator badge on image */}
                                    {itemIsBulky && (
                                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-500/90 text-black text-[9px] font-black uppercase tracking-wider shadow">
                                            Bulky
                                        </div>
                                    )}
                                </Link>

                                {/* Main Item Details */}
                                <div className="flex-1 flex flex-col justify-between w-full min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <Link href={detailHref}>
                                                <h3 className={`font-bold text-sm sm:text-base leading-snug transition-colors line-clamp-2 ${!isAvailable
                                                    ? 'text-white/50'
                                                    : 'text-white group-hover:text-ma-primary'
                                                    }`}>
                                                    {title}
                                                </h3>
                                            </Link>

                                            {/* Spec Pills & Metadata */}
                                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                {/* SKU Code */}
                                                {isSetupLine ? (
                                                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-white/70 uppercase tracking-wider">
                                                        Bundle: {item.setup?.sku || 'Custom Setup'}
                                                    </span>
                                                ) : item.sku?.sku_code ? (
                                                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-white/70 uppercase tracking-wider">
                                                        SKU: {item.sku.sku_code}
                                                    </span>
                                                ) : null}

                                                {/* Selected Variant Options */}
                                                {formattedVariants.map((pill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 rounded-md bg-ma-primary/10 border border-ma-primary/20 text-[10px] font-semibold text-ma-primary uppercase tracking-wider"
                                                    >
                                                        {pill}
                                                    </span>
                                                ))}

                                                {/* Setup Selections */}
                                                {isSetupLine && Array.isArray(item.selections) && item.selections.map((sel: any, sIdx: number) => (
                                                    <span
                                                        key={sIdx}
                                                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-medium text-white/60"
                                                    >
                                                        {sel.label || `${sel.group_name}: Selection`}
                                                    </span>
                                                ))}

                                                {/* Weight Pill */}
                                                {unitWeight > 0 && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/70">
                                                        <Scale className="w-3 h-3 text-ma-primary/70" />
                                                        <span>{unitWeight}g</span>
                                                    </span>
                                                )}

                                                {/* Packaging Preset Badge */}
                                                {(item.sku?.packaging_type || item.product?.packaging_type) && (
                                                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${itemIsBulky
                                                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                                        : 'bg-white/5 text-white/60 border-white/10'
                                                        }`}>
                                                        {item.sku?.packaging_type === 'LONG_PARCEL' || item.product?.packaging_type === 'LONG_PARCEL'
                                                            ? '🎣 Long Parcel / Tube'
                                                            : item.sku?.packaging_type === 'BOX_L' || item.product?.packaging_type === 'BOX_L'
                                                                ? '📦 Box L (Storage)'
                                                                : item.sku?.packaging_type === 'BOX_M' || item.product?.packaging_type === 'BOX_M'
                                                                    ? '📦 Box M (Tackle)'
                                                                    : item.sku?.packaging_type === 'BOX_S' || item.product?.packaging_type === 'BOX_S'
                                                                        ? '📦 Box S (Reel Box)'
                                                                        : item.sku?.packaging_type === 'POUCH_L' || item.product?.packaging_type === 'POUCH_L'
                                                                            ? '✉️ Pouch L'
                                                                            : '✉️ Pouch S'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stock / Availability Warning */}
                                            {!isAvailable && (
                                                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
                                                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                                    <span>{stockMsg}</span>
                                                </div>
                                            )}

                                            {/* Sleek Active Sale / Promotion Badge */}
                                            {isAvailable && hasDiscount && (
                                                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold shadow-sm">
                                                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                                                    <span>🏷️ {promoName} - Saved {numericConverter(lineTotalSaved.toFixed(2))}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Pricing Block */}
                                        <div className="text-left sm:text-right shrink-0 mt-1 sm:mt-0">
                                            {hasDiscount ? (
                                                <div>
                                                    {/* Strikethrough Original Price */}
                                                    <div className="text-xs sm:text-sm font-semibold text-white/40 line-through">
                                                        {numericConverter(originalUnitPrice.toFixed(2))}
                                                    </div>
                                                    {/* Highlighted Discounted Price */}
                                                    <div className="text-lg sm:text-xl font-black text-ma-primary tracking-tight">
                                                        {numericConverter(discountedUnitPrice.toFixed(2))}
                                                    </div>
                                                    {item.quantity > 1 && (
                                                        <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                                                            Total: {numericConverter(lineFinalTotal.toFixed(2))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-lg sm:text-xl font-black text-white tracking-tight">
                                                        {numericConverter(originalUnitPrice.toFixed(2))}
                                                    </div>
                                                    {item.quantity > 1 && (
                                                        <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                                                            Total: {numericConverter(lineSubtotal.toFixed(2))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom Row: Quantity Controls & Remove Action */}
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center bg-[#101415] border border-white/10 rounded-xl p-0.5 shadow-inner">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                                                disabled={item.quantity <= 1 || isLineUpdating}
                                                title="Decrease quantity"
                                                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/5 transition-colors active:scale-95"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="w-10 text-center text-white text-xs sm:text-sm font-bold font-mono select-none">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                                                disabled={isLineUpdating}
                                                title="Increase quantity"
                                                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/5 transition-colors active:scale-95"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {/* Subtle Delete Action */}
                                        <button
                                            onClick={() => handleRemoveItem(item.cart_item_id)}
                                            disabled={isLineUpdating}
                                            title="Remove item from cart"
                                            className="group/del inline-flex items-center gap-1.5 text-white/40 hover:text-red-400 py-1.5 px-3 rounded-lg hover:bg-red-500/10 disabled:opacity-40 transition-all text-xs font-semibold uppercase tracking-wider"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 group-hover/del:scale-110 transition-transform" />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ======================================================== */}
            {/* 2. DYNAMIC CART SUMMARY SIDEBAR (Sticky Right) */}
            {/* ======================================================== */}
            <div className="w-full lg:w-1/3 sticky top-28 space-y-4">
                <div className="bg-[#141A1F] p-6 sm:p-7 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    {/* Subtle background glow */}
                    <div className="absolute -top-20 -right-20 w-44 h-44 bg-ma-primary/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-ma-primary" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">
                                Order Summary
                            </h2>
                        </div>
                        {isEvaluating && (
                            <span className="text-[10px] font-bold text-ma-primary uppercase tracking-wider animate-pulse flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Updating
                            </span>
                        )}
                    </div>

                    {evaluation ? (
                        <div className="space-y-4">
                            {/* Subtotal Breakdown */}
                            <div className="space-y-2.5 text-sm">
                                {/* Items Subtotal (Original total before discounts) */}
                                <div className="flex justify-between items-center text-white/70">
                                    <span className="text-xs uppercase tracking-wider font-semibold">Items Subtotal</span>
                                    <span className="font-bold text-white font-mono">
                                        {numericConverter(evaluation.subtotal.toFixed(2))}
                                    </span>
                                </div>

                                {/* Promotion Savings (Highlighted in green/gold) */}
                                {evaluation.total_discount > 0 && (
                                    <div className="flex justify-between items-center text-emerald-400">
                                        <div className="flex items-center gap-1.5">
                                            <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            <span className="text-xs uppercase tracking-wider font-semibold">
                                                Promotion Savings
                                            </span>
                                        </div>
                                        <span className="font-bold font-mono">
                                            - {numericConverter(evaluation.total_discount.toFixed(2))}
                                        </span>
                                    </div>
                                )}

                                {/* Net Items Subtotal */}
                                <div className="flex justify-between items-center text-white/90 pt-1 border-t border-white/5">
                                    <span className="text-xs uppercase tracking-wider font-semibold">Net Items Subtotal</span>
                                    <span className="font-bold text-white font-mono">
                                        {numericConverter((evaluation.subtotal - evaluation.total_discount).toFixed(2))}
                                    </span>
                                </div>

                                {/* Bulky Handling Fee if applied */}
                                {evaluation.has_bulky && (
                                    <div className="flex justify-between items-center text-amber-400">
                                        <div className="flex items-center gap-1.5">
                                            <Package className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                            <span className="text-xs uppercase tracking-wider font-semibold">
                                                Bulky Courier Handling
                                            </span>
                                        </div>
                                        <span className="font-bold font-mono">
                                            +{numericConverter(evaluation.bulky_handling_fee.toFixed(2))}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Estimated Weight & Shipping Preview Container */}
                            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 mt-4">
                                {/* Combined Cart Weight */}
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Scale className="w-4 h-4 text-ma-primary" />
                                        <span className="font-semibold uppercase tracking-wider text-[11px]">Combined Weight</span>
                                    </div>
                                    <span className="font-mono font-bold text-white text-xs">
                                        {evaluation.total_weight.toLocaleString()}g{' '}
                                        <span className="text-white/40">/ {(evaluation.total_weight / 1000).toFixed(2)}kg</span>
                                    </span>
                                </div>

                                {/* Bulky Status Indicator Badge */}
                                {evaluation.has_bulky && (
                                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold leading-relaxed">
                                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                        <span>⚠️ Bulky Item Included - Special Courier Rate Applies</span>
                                    </div>
                                )}

                                {/* Estimated J&T Shipping Fee */}
                                <div className="pt-2 border-t border-white/5 space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 text-white/70">
                                            <Truck className="w-4 h-4 text-ma-primary" />
                                            <span className="font-semibold uppercase tracking-wider text-[11px]">J&T Express (Davao Origin)</span>
                                        </div>
                                        <span className="text-ma-primary text-xs font-mono font-bold">From ₱85.00</span>
                                    </div>
                                    <div className="text-[10px] text-white/40 leading-relaxed">
                                        Mindanao: ₱85-₱180 | Visayas/Luzon: ₱105-₱215. Final rate calculated at checkout.
                                    </div>
                                </div>
                            </div>

                            {/* Total Savings Celebratory Card */}
                            {evaluation.total_discount > 0 && (
                                <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-emerald-900/40 to-[#141A1F] border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.12)] flex items-center gap-3 mt-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-xl shadow-inner">
                                        🎉
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400">
                                            Celebratory Promotion
                                        </div>
                                        <div className="text-xs sm:text-sm font-black text-white">
                                            You are saving <span className="text-emerald-300 underline decoration-emerald-500/60 font-mono">{numericConverter(evaluation.total_discount.toFixed(2))}</span> on this order!
                                        </div>
                                    </div>
                                </div>
                            )}

                            <hr className="border-white/10 my-4" />

                            {/* Total Price Row */}
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <span className="text-white/60 text-xs font-extrabold uppercase tracking-widest block">
                                        Grand Total
                                    </span>
                                    <span className="text-white/40 text-[10px] font-medium tracking-wide">
                                        Exclusive of final destination shipping
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-ma-primary font-black text-2xl sm:text-3xl leading-none block tracking-tight font-mono">
                                        {numericConverter(evaluation.grand_total.toFixed(2))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-pulse space-y-4 py-6">
                            <div className="h-4 bg-white/5 rounded-lg w-full" />
                            <div className="h-4 bg-white/5 rounded-lg w-3/4" />
                            <div className="h-16 bg-white/5 rounded-2xl w-full" />
                            <div className="h-8 bg-white/5 rounded-lg w-1/2 ml-auto" />
                        </div>
                    )}

                    {/* Glowing Primary Call to Action Button */}
                    <div className="mt-6">
                        <button
                            onClick={() => router.push('/checkout')}
                            disabled={hasInvalidItems || isEvaluating || !evaluation}
                            className="group relative w-full overflow-hidden rounded-2xl p-[1px] font-black uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.99] shadow-[0_0_25px_rgba(255,196,154,0.3)] hover:shadow-[0_0_40px_rgba(255,196,154,0.5)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#ffc49a] via-[#ff9d4d] to-[#ffc49a] rounded-2xl animate-pulse" />
                            <div className="relative flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-[#ffc49a] to-[#ff9d4d] text-black rounded-2xl font-black transition-colors">
                                {isEvaluating ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        <span>Recalculating Cart...</span>
                                    </div>
                                ) : hasInvalidItems ? (
                                    <span>Resolve Unavailable Items</span>
                                ) : (
                                    <>
                                        <span>PROCEED TO CHECKOUT</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Guarantee & Trust Badges */}
                    <div className="mt-6 pt-5 border-t border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-white/50 text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>100% Guaranteed Authentic JDM Tackle</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/50 text-[11px] font-medium">
                            <Truck className="w-3.5 h-3.5 text-ma-primary shrink-0" />
                            <span>Bubble Wrapped & Packed in Protective Tube</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/50 text-[11px] font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-ma-primary shrink-0" />
                            <span>Manual GCash Reference Verification</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

