'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { numericConverter } from '@/utils/priceUtils';

function getImageUrl(path?: string | null): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return base ? `${base}${cleanPath}` : cleanPath;
}

export default function CartClient() {
    const { cart, isLoading, updateQuantity, removeFromCart } = useCart();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-10 h-10 border-4 border-ma-primary/20 border-t-ma-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-ma-surface-container-low rounded-2xl border border-white/5 shadow-2xl">
                <ShoppingBag className="w-20 h-20 text-ma-primary/40 mb-6 stroke-1" />
                <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">Your cart is empty</h2>
                <p className="text-ma-primary/60 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Explore our top products.</p>
                <Link 
                    href="/products" 
                    className="px-8 py-3.5 bg-ma-primary text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-ma-primary/90 transition-all shadow-[0_4px_20px_rgba(255,196,154,0.3)] hover:shadow-[0_4px_30px_rgba(255,196,154,0.4)] hover:scale-105"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const calculateItemPrice = (item: any) => {
        if (item.setup_id && item.setup) {
            return parseFloat(String(item.setup.bundle_price ?? 0));
        }
        if (item.sku && parseFloat(item.sku.price) > 0) {
            return parseFloat(item.sku.price);
        }
        if (item.product && parseFloat(item.product.base_price) > 0) {
            return parseFloat(item.product.base_price);
        }
        return 0;
    };

    const subtotal = cart.items.reduce((acc, item) => {
        return acc + calculateItemPrice(item) * item.quantity;
    }, 0);

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Cart Items List */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
                {cart.items.map((item) => {
                    const price = calculateItemPrice(item);
                    const isSetupLine = Boolean(item.setup_id && item.setup);

                    let imageUrl = null;
                    if (isSetupLine && item.setup?.images?.length) {
                        imageUrl =
                            item.setup.images.find((img: any) => img.isMain || img.is_main)?.image_url ||
                            item.setup.images[0]?.image_url;
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

                    return (
                        <div key={item.cart_item_id} className="flex gap-4 sm:gap-6 bg-ma-surface-container-low p-4 rounded-2xl border border-white/5 shadow-xl transition-all hover:border-white/10">
                            {/* Image */}
                            <Link href={detailHref} className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-black/40 rounded-xl overflow-hidden border border-white/10 group">
                                {imageUrl ? (
                                    <Image src={getImageUrl(imageUrl)} alt="Product" fill sizes="128px" className="object-contain p-3 group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] uppercase text-white/30 tracking-widest text-center px-2">No Image</div>
                                )}
                            </Link>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div className="flex flex-col sm:flex-row justify-between gap-2 items-start">
                                    <div>
                                        <Link href={detailHref}>
                                            <h3 className="text-white font-bold text-sm sm:text-base leading-snug hover:text-ma-primary transition-colors">
                                                {title}
                                            </h3>
                                        </Link>
                                        {isSetupLine ? (
                                            <p className="text-ma-on-surface-variant text-[11px] font-semibold mt-1.5 uppercase tracking-wider">
                                                Bundle · SKU:{' '}
                                                <span className="text-ma-primary/80">{item.setup?.sku}</span>
                                            </p>
                                        ) : item.sku ? (
                                            <p className="text-ma-on-surface-variant text-[11px] font-semibold mt-1.5 uppercase tracking-wider">
                                                SKU: <span className="text-ma-primary/80">{item.sku.sku_code}</span>
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="text-ma-primary font-black text-lg">
                                        {numericConverter(price.toFixed(2))}
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center justify-between bg-[#141A1F] border border-white/10 rounded-xl h-10 w-28 px-1">
                                        <button 
                                            onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-white text-sm font-bold select-none">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => removeFromCart(item.cart_item_id)}
                                        className="text-red-400/80 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="hidden sm:inline">Remove</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Order Summary Checkout Box */}
            <div className="w-full lg:w-1/3 bg-ma-surface-container-low p-6 sm:p-8 rounded-3xl border border-white/5 sticky top-32 shadow-2xl">
                <h2 className="text-base font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-ma-primary" />
                    Order Summary
                </h2>
                
                <div className="flex justify-between items-center mb-4 text-white/70 text-sm font-medium">
                    <span>Subtotal</span>
                    <span className="text-white">{numericConverter(subtotal.toFixed(2))}</span>
                </div>
                
                <div className="flex justify-between items-center mb-6 text-white/70 text-sm font-medium">
                    <span>Shipping Estimate</span>
                    <span className="text-white">Calculated at checkout</span>
                </div>

                <hr className="border-white/10 mb-6" />

                <div className="flex justify-between items-end mb-8">
                    <span className="text-white font-bold text-sm uppercase tracking-wider">Total</span>
                    <span className="text-ma-primary font-black text-2xl leading-none">{numericConverter(subtotal.toFixed(2))}</span>
                </div>

                <button className="w-full bg-ma-primary text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-ma-primary/90 hover:scale-[1.02] transition-all shadow-[0_4px_20px_rgba(255,196,154,0.3)]">
                    Proceed to Checkout
                </button>

                <p className="text-center text-ma-on-surface-variant text-[10px] font-semibold tracking-widest uppercase mt-6">
                    Secure & Encrypted Checkout
                </p>
            </div>
        </div>
    );
}
