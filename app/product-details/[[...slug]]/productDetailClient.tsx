'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { numericConverter } from '@/utils/priceUtils';
import { buildProductImages, UIProductImage } from '@/utils/productMedia.UI';
import { slugify } from '@/utils/slugUtils';
import { Info, Settings, FileText, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

import ProductDetailsDropDown from '@/components/ProductDetailsDropDown';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';

import { ProductDetailsViewProps } from '@/types/productTypes';
import { ProductVariantOptions } from '@/types/productVariantsTypes';

interface ProductDetailClientProps {
    productDetailProps: ProductDetailsViewProps;
    initialVariantId: number | null;
}

type VariantSelections = Record<string, ProductVariantOptions>;

/**
 * Safely formats image URLs so relative paths and absolute URLs both work seamlessly.
 */
function getImageUrl(path?: string | null): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return base ? `${base}${cleanPath}` : cleanPath;
}

export default function ProductDetailClient({
    productDetailProps,
    initialVariantId,
}: ProductDetailClientProps) {
    const [productDetails] = useState<ProductDetailsViewProps>(productDetailProps);

    // Images
    const [productImages, setProductImages] = useState<UIProductImage[]>([]);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

    // Cart integration
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    // Variant selections
    const [variantSelections, setVariantSelections] = useState<VariantSelections>({});

    const hasVariants =
        Array.isArray(productDetails?.productVariants) &&
        productDetails.productVariants.length > 0;

    // Derived SKU match based on current selections
    const currentSku = useMemo(() => {
        if (!hasVariants || !productDetails?.productSkus || productDetails.productSkus.length === 0) return null;

        const selectedOptionIds = Object.values(variantSelections).map(opt => opt.variantOptionId);

        return productDetails.productSkus.find(sku => {
            if (sku.variantOptionIds.length !== selectedOptionIds.length) return false;
            return selectedOptionIds.every(id => sku.variantOptionIds.includes(id));
        }) || null;
    }, [variantSelections, productDetails?.productSkus, hasVariants]);

    // Current stock calculation
    const currentStock = useMemo(() => {
        return hasVariants
            ? (currentSku ? currentSku.stockQuantity : 0)
            : (productDetails?.stockQuantity || 0);
    }, [hasVariants, currentSku, productDetails?.stockQuantity]);

    const isOutOfStock = currentStock === 0;

    // Ensure quantity never exceeds available stock when stock/variant changes
    useEffect(() => {
        if (quantity > currentStock && currentStock > 0) {
            setQuantity(currentStock);
        } else if (quantity < 1 && currentStock > 0) {
            setQuantity(1);
        }
    }, [currentStock, quantity]);

    useEffect(() => {
        if (!productDetails) return;

        const images = buildProductImages(productDetails);
        setProductImages(images);

        const defaultImage =
            images.find((img) => img.source === 'product' && img.isMain) ??
            images.find((img) => img.source === 'sku' && img.isMain) ??
            images.find((img) => img.source === 'product') ??
            images.find((img) => img.source === 'variant') ??
            images[0];

        setSelectedImageId(defaultImage?.id ?? null);
    }, [productDetails]);

    useEffect(() => {
        if (!hasVariants || !productDetails.productVariants) return;

        const initialSelections: VariantSelections = {};

        for (const variantType of productDetails.productVariants) {
            if (variantType.variantOptions.length === 0) continue;

            const matchedOption = initialVariantId
                ? variantType.variantOptions.find(
                    (opt) => opt.variantOptionId === initialVariantId
                )
                : null;

            initialSelections[variantType.variantTypeName] =
                matchedOption ?? variantType.variantOptions[0];
        }

        setVariantSelections(initialSelections);
    }, [hasVariants, productDetails.productVariants, initialVariantId]);

    // Set initial image when SKU matches initially
    useEffect(() => {
        if (currentSku && productImages.length > 0) {
            const uiImage = productImages.find(
                (img) => img.source === 'sku' && img.id.startsWith(`sku-${currentSku.skuId}-`)
            );
            if (uiImage) setSelectedImageId(uiImage.id);
        }
    }, [currentSku, productImages]);

    const pushVariantUrl = useCallback(
        (option: ProductVariantOptions) => {
            if (!productDetails) return;
            const titleSlug = slugify(productDetails.productTitle);
            const valueSlug = slugify(option.variantOptionValue);
            const newPath = `/product-details/${productDetails.productId}/${titleSlug}/variant/${option.variantOptionId}/${valueSlug}`;
            window.history.pushState(null, '', newPath);
        },
        [productDetails]
    );

    const handleSelectVariantOption = (
        variantTypeName: string,
        option: ProductVariantOptions
    ) => {
        const newSelections = {
            ...variantSelections,
            [variantTypeName]: option,
        };
        setVariantSelections(newSelections);

        const selectedOptionIds = Object.values(newSelections).map(opt => opt.variantOptionId);

        const nextSku = productDetails?.productSkus?.find(sku => {
            if (sku.variantOptionIds.length !== selectedOptionIds.length) return false;
            return selectedOptionIds.every(id => sku.variantOptionIds.includes(id));
        });

        if (nextSku) {
            const uiImage = productImages.find(
                (img) => img.source === 'sku' && img.id.startsWith(`sku-${nextSku.skuId}-`)
            );
            if (uiImage) setSelectedImageId(uiImage.id);
        } else {
            const uiImage = productImages.find(
                (img) => img.source === 'variant' && img.id === `variant-${option.variantOptionId}`
            );
            if (uiImage) setSelectedImageId(uiImage.id);
        }

        pushVariantUrl(option);
    };

    // Calculate effective price
    const displayPrice = (): string => {
        if (!productDetails) return '0.00';

        if (hasVariants && currentSku) {
            return String(currentSku.finalPrice || currentSku.price);
        }

        const baseFinalPriceNum = parseFloat(String(productDetails.finalPrice || productDetails.basePrice || 0));
        if (baseFinalPriceNum > 0) {
            return baseFinalPriceNum.toFixed(2);
        }

        if (productDetails.productSkus && productDetails.productSkus.length > 0) {
            const validPrices = productDetails.productSkus
                .map((s) => parseFloat(String(s.finalPrice || s.price)))
                .filter((p) => p > 0);
            if (validPrices.length > 0) {
                return Math.min(...validPrices).toFixed(2);
            }
        }

        return '0.00';
    };

    const displayOriginalPrice = (): string | null => {
        if (!productDetails) return null;

        if (hasVariants && currentSku && currentSku.hasDiscount) {
            return String(currentSku.price);
        }

        if (!hasVariants && productDetails.hasDiscount) {
            return parseFloat(String(productDetails.basePrice || 0)).toFixed(2);
        }

        return null;
    };

    const currentDiscountLabel = (): string | null => {
        if (hasVariants && currentSku && currentSku.hasDiscount) return currentSku.discountLabel;
        if (!hasVariants && productDetails.hasDiscount) return productDetails.discountLabel;
        return null;
    };

    const currentImage = productImages.find((img) => img.id === selectedImageId);

    const handleAddToCart = async () => {
        if (!productDetails || isOutOfStock) return;

        if (hasVariants && !currentSku) {
            alert('Please select all options before adding to cart.');
            return;
        }

        setIsAdding(true);
        try {
            const success = await addToCart({
                product_id: productDetails.productId,
                sku_id: currentSku?.skuId || null,
                quantity: quantity
            });

            if (success) {
                setQuantity(1);
            } else {
                alert('Failed to add item to cart. Please try again.');
            }
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* ─── LEFT COLUMN: Image Gallery ─── */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:sticky lg:top-32 self-start">
                {/* Main Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full aspect-[4/5] bg-ma-surface-container-low/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl"
                >
                    <AnimatePresence mode="wait">
                        {currentImage ? (
                            <motion.div
                                key={currentImage.id}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.04 }}
                                transition={{ duration: 0.4 }}
                                className="relative w-full h-full p-8"
                            >
                                <Image
                                    src={getImageUrl(currentImage.imageUrl)}
                                    alt={productDetails?.productTitle || 'Product Image'}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                                {currentDiscountLabel() && (
                                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[0.65rem] font-black px-2.5 py-1 rounded-sm uppercase tracking-wider z-10 shadow-md">
                                        {currentDiscountLabel()} SALE
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="text-ma-on-surface-variant text-sm tracking-widest uppercase">No image available</div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Thumbnail Strip */}
                {productImages.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex gap-4 overflow-x-auto py-2 custom-scrollbar snap-x"
                    >
                        {productImages.map((img) => (
                            <button
                                key={img.id}
                                onClick={() => setSelectedImageId(img.id)}
                                className={`relative w-28 h-28 shrink-0 rounded-xl overflow-hidden transition-all duration-300 snap-center
                                ${selectedImageId === img.id
                                        ? 'ring-2 ring-ma-primary ring-offset-2 ring-offset-ma-background scale-105 opacity-100 shadow-[0_0_15px_rgba(255,196,154,0.3)]'
                                        : 'border border-white/10 opacity-60 hover:opacity-100 hover:border-ma-primary/50 bg-ma-surface-container-low/40'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-ma-surface/30 backdrop-blur-[2px] z-0" />
                                <Image
                                    src={getImageUrl(img.imageUrl)}
                                    alt="Thumbnail"
                                    fill
                                    sizes="112px"
                                    loading="lazy"
                                    className="object-cover z-10 p-2"
                                />
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* ─── RIGHT COLUMN: Product Info ─── */}
            <div className="w-full lg:w-1/2 flex flex-col gap-10">
                {/* Header Section */}
                <div className="flex flex-col gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3"
                    >
                        {productDetails?.brandName && (
                            <span className="text-ma-primary font-bold tracking-[0.15em] text-xs uppercase bg-ma-primary/10 px-3 py-1.5 rounded flex items-center">
                                {productDetails.brandName}
                            </span>
                        )}
                        {productDetails?.brandName && productDetails?.subCategoryName && (
                            <span className="w-1.5 h-1.5 rounded-full bg-ma-surface-bright" />
                        )}
                        {productDetails?.subCategoryName && (
                            <span className="text-ma-on-surface-variant text-xs font-semibold tracking-wider uppercase">
                                {productDetails.subCategoryName}
                            </span>
                        )}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-ma-on-surface text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.02em]"
                    >
                        {productDetails?.productTitle}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col gap-2 mt-2"
                    >
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl md:text-5xl font-extrabold text-ma-primary">
                                {numericConverter(displayPrice())}
                            </span>
                            {displayOriginalPrice() && (
                                <span className="text-2xl md:text-3xl font-semibold text-ma-on-surface-variant line-through">
                                    {numericConverter(displayOriginalPrice()!)}
                                </span>
                            )}
                        </div>

                        {/* Display Stock Status */}
                        <div className={`text-sm font-semibold tracking-wide ${currentStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {currentStock > 0 ? `${currentStock} in stock` : 'Out of Stock'}
                        </div>
                    </motion.div>
                </div>

                <hr className="border-white/10" />

                {/* ─── Variant Selectors ─── */}
                {hasVariants && (
                    <div className="flex flex-col gap-8">
                        {productDetails.productVariants!.map((variant, vi) => (
                            <motion.div
                                key={vi}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 + vi * 0.1 }}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-ma-on-surface-variant text-xs font-bold tracking-[0.15em] uppercase">
                                        Select {variant.variantTypeName}
                                    </p>
                                    <span className="text-ma-on-surface font-semibold text-sm">
                                        {variantSelections[variant.variantTypeName]?.variantOptionValue || 'None'}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {variant.variantOptions.map((option) => {
                                        const isSelected =
                                            variantSelections[variant.variantTypeName]?.variantOptionId ===
                                            option.variantOptionId;

                                        const variantImg = productImages.find(
                                            (img) =>
                                                img.source === 'variant' &&
                                                img.id === `variant-${option.variantOptionId}`
                                        );

                                        return (
                                            <CustomPrimaryButton
                                                key={option.variantOptionId}
                                                isSelected={isSelected}
                                                onClick={() =>
                                                    handleSelectVariantOption(variant.variantTypeName, option)
                                                }
                                            >
                                                {variantImg && (
                                                    <span className="relative w-6 h-6 rounded-md overflow-hidden shrink-0 ring-1 ring-white/20 shadow-sm">
                                                        <Image
                                                            src={getImageUrl(variantImg.imageUrl)}
                                                            alt={option.variantOptionValue}
                                                            fill
                                                            sizes="24px"
                                                            className="object-cover"
                                                        />
                                                    </span>
                                                )}
                                                <span className="relative z-10 tracking-wide">{option.variantOptionValue}</span>
                                            </CustomPrimaryButton>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {hasVariants && <hr className="border-white/10" />}

                {/* ─── Quantity & Add to Cart ─── */}
                <div className="flex flex-col sm:flex-row gap-4 mt-2 mb-4">
                    <div className="flex items-center justify-between bg-ma-surface-container-low border border-white/10 rounded-xl px-4 py-3 h-14 sm:w-32 shrink-0">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1 || isOutOfStock}
                            className="text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            <Minus className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                        <span className="text-white font-bold text-lg select-none w-8 text-center">
                            {quantity}
                        </span>
                        <button
                            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                            disabled={quantity >= currentStock || isOutOfStock}
                            className="text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            <Plus className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || isAdding || (hasVariants && !currentSku)}
                        className={`flex-1 flex items-center justify-center gap-x-3 h-14 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 relative overflow-hidden
                            ${isOutOfStock || (hasVariants && !currentSku)
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
                                {isOutOfStock ? 'Out of Stock' : (hasVariants && !currentSku ? 'Select Options' : 'Add to Cart')}
                            </>
                        )}
                    </button>
                </div>

                {/* ─── Description / Features / Specifications Accordions ─── */}
                <ProductDetailsDropDown
                    defaultOpenSection="description"
                    sections={[
                        { id: 'description', label: 'DESCRIPTION', icon: FileText, content: productDetails?.description },
                        { id: 'features', label: 'FEATURES', icon: Settings, content: productDetails?.features },
                        { id: 'specifications', label: 'SPECIFICATIONS', icon: Info, content: productDetails?.specifications },
                    ]}
                />
            </div>
        </div>
    );
}