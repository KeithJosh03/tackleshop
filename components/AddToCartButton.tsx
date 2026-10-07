'use client';

import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
    onClick: () => void;
    disabled?: boolean;
    isAdding?: boolean;
    isOutOfStock?: boolean;
    needsVariantSelection?: boolean;
    outOfStockText?: string;
    selectOptionsText?: string;
    defaultText?: string;
    className?: string;
}

export default function AddToCartButton({
    onClick,
    disabled = false,
    isAdding = false,
    isOutOfStock = false,
    needsVariantSelection = false,
    outOfStockText = 'Out of Stock',
    selectOptionsText = 'Select Options',
    defaultText = 'Add to Cart',
    className = '',
}: AddToCartButtonProps) {
    const isDisabled = disabled || isOutOfStock || needsVariantSelection || isAdding;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isDisabled}
            className={`flex items-center justify-center gap-x-3 h-14 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 relative overflow-hidden ${isDisabled
                    ? 'bg-ma-surface-container-low text-white/30 cursor-not-allowed'
                    : 'bg-ma-primary text-black hover:bg-ma-primary/90 hover:scale-[1.02] shadow-[0_4px_20px_rgba(255,196,154,0.3)] hover:shadow-[0_4px_30px_rgba(255,196,154,0.4)]'
                } ${className}`}
        >
            {isAdding ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
                <>
                    <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                    {isOutOfStock
                        ? outOfStockText
                        : needsVariantSelection
                            ? selectOptionsText
                            : defaultText}
                </>
            )}
        </button>
    );
}