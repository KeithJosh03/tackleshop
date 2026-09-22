'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  DollarSign,
  Box,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Users
} from 'lucide-react';
import { generateSku } from '@/lib/utils/skuGenerator';
import { createBundle } from '@/lib/api/bundleService';
import { BundleItemSelector, SelectedBundleItem } from '@/components/setups/BundleItemSelector';
import { BundleSummarySidebar } from '@/components/setups/BundleSummarySidebar';

export default function BuildSetupPage() {
  // Meta details state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [sku, setSku] = useState('');

  // Pricing Strategy state
  const [pricingType, setPricingType] = useState<'fixed' | 'calculated'>('fixed');
  const [fixedPrice, setFixedPrice] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(15);

  // Inventory & Stock state
  const [stockMode, setStockMode] = useState<'manual' | 'calculated'>('calculated');
  const [manualStock, setManualStock] = useState<number>(50);

  // Items List state
  const [selectedItems, setSelectedItems] = useState<SelectedBundleItem[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Status & Date controls
  const [isPublished, setIsPublished] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-slugify & SKU generation on title change
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(autoSlug);

    if (!sku || sku.startsWith('BNDL-')) {
      const generated = generateSku(val || 'Bundle', ['SETUP']);
      setSku(generated);
    }
  };

  const handleRegenerateSku = () => {
    setSku(generateSku(title || 'Bundle', ['SETUP']));
  };

  // Item additions from modal
  const handleSelectItems = (newItems: SelectedBundleItem[]) => {
    setSelectedItems((prev) => {
      const existingKeyMap = new Set(prev.map((item) => item.is_custom ? item.id : `${item.product?.productId}-${item.sku_id || 'base'}`));
      const itemsToAdd = newItems.filter(
        (item) => !existingKeyMap.has(item.is_custom ? item.id : `${item.product?.productId}-${item.sku_id || 'base'}`)
      );
      return [...prev, ...itemsToAdd];
    });
  };

  const handleQuantityChange = (index: number, newQty: number) => {
    const qty = Math.max(1, newQty);
    setSelectedItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: qty };
      return next;
    });
  };

  const handleToggleRequired = (index: number) => {
    setSelectedItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], is_required: !next[index].is_required };
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === selectedItems.length - 1)
    ) {
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    setSelectedItems((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
  };

  // Calculations
  const totalRetailValue = selectedItems.reduce((acc, item) => {
    return acc + item.unit_price * item.quantity;
  }, 0);

  const bundlePrice =
    pricingType === 'fixed'
      ? fixedPrice
      : Math.max(0, totalRetailValue * (1 - discountPercentage / 100));

  const savingsAmount = Math.max(0, totalRetailValue - bundlePrice);
  const savingsPercentage =
    totalRetailValue > 0 ? (savingsAmount / totalRetailValue) * 100 : 0;

  // Stock calculation from items
  const lowestComponentStock = selectedItems.reduce((min, item) => {
    if (item.is_custom) return min; // custom items don't have stock
    const itemStock = item.sku?.stockQuantity ?? item.product?.stockQuantity ?? 0;
    const maxBundlesFromThisItem = Math.floor(itemStock / item.quantity);
    return Math.min(min, maxBundlesFromThisItem);
  }, selectedItems.length > 0 ? Infinity : 0);

  const finalStock = stockMode === 'manual' ? manualStock : (lowestComponentStock === Infinity ? 0 : lowestComponentStock);

  // Submission handler
  const handleSubmit = async () => {
    if (!title.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Please enter a Setup Title.' });
      return;
    }
    if (selectedItems.length === 0) {
      setFeedbackMsg({ type: 'error', text: 'Please select at least one component product/variant for this bundle.' });
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const payload = {
        bundle_title: title,
        slug,
        description,
        hero_banner: bannerUrl,
        sku,
        pricing_type: pricingType,
        bundle_price: bundlePrice,
        discount_percentage: pricingType === 'calculated' ? discountPercentage : undefined,
        stock_quantity: finalStock,
        is_published: isPublished,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        bundle_items: selectedItems.filter(i => !i.is_custom).map((item) => ({
          product_id: item.product?.productId,
          sku_id: item.sku_id,
          quantity: item.quantity,
          is_required: item.is_required,
        })),
        custom_inclusions: selectedItems.filter(i => i.is_custom).map((item) => ({
          title: item.product_title,
          price: item.unit_price,
          quantity: item.quantity,
          is_required: item.is_required,
        })),
      };

      const res = await createBundle(payload);
      setFeedbackMsg({ type: 'success', text: res.message || 'Bundle setup created successfully!' });
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to create bundle setup. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d131a] text-[#d9e3f4] p-6 lg:p-10 font-sans pb-24">
      {/* Top Header Navigation */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/dashboard/setups"
            className="inline-flex items-center gap-2 text-sm text-[#788ca5] hover:text-primaryColor transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Setups List</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primaryColor/10 border border-primaryColor/20 text-primaryColor">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                Build New Setup Bundle
              </h1>
              <p className="text-xs lg:text-sm text-[#788ca5]">
                Combine catalog products and variants into a single discounted offer.
              </p>
            </div>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedbackMsg && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 max-w-md ${feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{feedbackMsg.text}</span>
          </div>
        )}
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Setup Form Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Header & General Meta Details */}
          <div className="bg-ma-surface-container/50 border-2 border-greyColor/20 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-greyColor/15 pb-4">
              <Sparkles className="w-5 h-5 text-primaryColor" />
              <span>General Setup Details</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Setup Title */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-[#9cb3cf] uppercase tracking-wider">
                  Setup / Bundle Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ultimate Pro Bass Angler Kit"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 bg-[#16202c] border border-greyColor/30 rounded-xl text-sm text-[#d9e3f4] placeholder-[#4e6178] focus:outline-none focus:border-primaryColor transition-all"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9cb3cf] uppercase tracking-wider">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="ultimate-pro-bass-angler-kit"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#16202c] border border-greyColor/30 rounded-xl text-sm text-[#d9e3f4] placeholder-[#4e6178] focus:outline-none focus:border-primaryColor transition-all"
                />
              </div>

              {/* SKU */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9cb3cf] uppercase tracking-wider flex items-center justify-between">
                  <span>Bundle SKU</span>
                  <button
                    type="button"
                    onClick={handleRegenerateSku}
                    className="text-[10px] text-primaryColor hover:underline flex items-center gap-1 normal-case"
                  >
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </button>
                </label>
                <input
                  type="text"
                  placeholder="BNDL-XXXX-XXXX"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#16202c] border border-greyColor/30 rounded-xl text-sm font-mono text-primaryColor placeholder-[#4e6178] focus:outline-none focus:border-primaryColor transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-[#9cb3cf] uppercase tracking-wider">
                  Bundle Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what's included in this premium setup and why customers should buy it..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#16202c] border border-greyColor/30 rounded-xl text-sm text-[#d9e3f4] placeholder-[#4e6178] focus:outline-none focus:border-primaryColor transition-all resize-none"
                />
              </div>

              {/* Hero Banner Image */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-[#9cb3cf] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#788ca5]" />
                  <span>Hero / Banner Image URL</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="https://example.com/images/bundle-banner.jpg"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#16202c] border border-greyColor/30 rounded-xl text-sm text-[#d9e3f4] placeholder-[#4e6178] focus:outline-none focus:border-primaryColor"
                  />
                  {bannerUrl && (
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-greyColor/30 flex-shrink-0">
                      <Image src={bannerUrl} alt="Banner Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Bundle Pricing Strategy */}
          <div className="bg-ma-surface-container/50 border-2 border-greyColor/20 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-greyColor/15 pb-4">
              <DollarSign className="w-5 h-5 text-primaryColor" />
              <span>Pricing Strategy</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Fixed Price */}
              <button
                type="button"
                onClick={() => setPricingType('fixed')}
                className={`p-5 rounded-xl border-2 text-left transition-all relative ${pricingType === 'fixed'
                  ? 'border-primaryColor bg-primaryColor/10'
                  : 'border-greyColor/20 bg-[#121922] hover:border-greyColor/40'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white text-sm">Fixed Bundle Price</span>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${pricingType === 'fixed' ? 'border-primaryColor bg-primaryColor' : 'border-greyColor/50'
                      }`}
                  >
                    {pricingType === 'fixed' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </div>
                </div>
                <p className="text-xs text-[#788ca5]">
                  Set a custom overall price regardless of individual item cost fluctuations.
                </p>
              </button>

              {/* Option 2: Calculated Discount */}
              <button
                type="button"
                onClick={() => setPricingType('calculated')}
                className={`p-5 rounded-xl border-2 text-left transition-all relative ${pricingType === 'calculated'
                  ? 'border-primaryColor bg-primaryColor/10'
                  : 'border-greyColor/20 bg-[#121922] hover:border-greyColor/40'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white text-sm">Percentage Discount</span>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${pricingType === 'calculated' ? 'border-primaryColor bg-primaryColor' : 'border-greyColor/50'
                      }`}
                  >
                    {pricingType === 'calculated' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </div>
                </div>
                <p className="text-xs text-[#788ca5]">
                  Automatically apply a percentage discount on the combined retail sum.
                </p>
              </button>
            </div>

            {/* Inputs based on pricing type selection */}
            {pricingType === 'fixed' ? (
              <div className="p-4 rounded-xl bg-[#121922] border border-greyColor/20 space-y-2">
                <label className="text-xs font-semibold text-[#9cb3cf] uppercase tracking-wider">
                  Fixed Bundle Offer Price ($ USD)
                </label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#788ca5] font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={fixedPrice}
                    onChange={(e) => setFixedPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 bg-[#16202c] border border-greyColor/30 rounded-xl text-sm text-white font-bold focus:outline-none focus:border-primaryColor"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#121922] border border-greyColor/20 space-y-2">
                <label className="text-xs font-semibold text-[#9cb3cf] uppercase tracking-wider">
                  Bundle Discount Percentage (%)
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="99"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                    className="w-full pl-4 pr-8 py-2.5 bg-[#16202c] border border-greyColor/30 rounded-xl text-sm text-white font-bold focus:outline-none focus:border-primaryColor"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-[#788ca5] font-semibold">
                    %
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: SKU & Inventory Control */}
          <div className="bg-ma-surface-container/50 border-2 border-greyColor/20 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-greyColor/15 pb-4">
              <Box className="w-5 h-5 text-primaryColor" />
              <span>Inventory & Stock Control</span>
            </h2>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setStockMode('calculated')}
                  className={`flex-1 p-4 rounded-xl border transition-all text-left ${stockMode === 'calculated'
                    ? 'border-primaryColor bg-primaryColor/10'
                    : 'border-greyColor/20 bg-[#121922]'
                    }`}
                >
                  <div className="text-sm font-semibold text-white">Calculated Lowest Stock</div>
                  <div className="text-xs text-[#788ca5] mt-1">
                    Auto-limits bundle stock by available component inventory.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStockMode('manual')}
                  className={`flex-1 p-4 rounded-xl border transition-all text-left ${stockMode === 'manual'
                    ? 'border-primaryColor bg-primaryColor/10'
                    : 'border-greyColor/20 bg-[#121922]'
                    }`}
                >
                  <div className="text-sm font-semibold text-white">Manual Stock Limit</div>
                  <div className="text-xs text-[#788ca5] mt-1">
                    Set a fixed custom stock quantity cap manually.
                  </div>
                </button>
              </div>

              {stockMode === 'manual' ? (
                <div className="p-4 rounded-xl bg-[#121922] border border-greyColor/20 max-w-xs space-y-1.5">
                  <label className="text-xs font-medium text-[#9cb3cf]">Manual Bundle Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={manualStock}
                    onChange={(e) => setManualStock(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-[#16202c] border border-greyColor/30 rounded-xl text-sm text-white focus:outline-none focus:border-primaryColor"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#121922] border border-greyColor/20 flex items-center justify-between text-xs">
                  <span className="text-[#9cb3cf]">Calculated Max Purchasable Bundles:</span>
                  <span className="text-sm font-bold text-primaryColor">
                    {lowestComponentStock === Infinity ? '0 (Add components)' : `${lowestComponentStock} units`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Included Component Items Matrix */}
          <div className="bg-ma-surface-container/50 border-2 border-greyColor/20 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-greyColor/15 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primaryColor" />
                  <span>Included Items Matrix ({selectedItems.length})</span>
                </h2>
                <p className="text-xs text-[#788ca5] mt-0.5">
                  Select products or specific SKU variants included in this bundle.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSelectorOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-primaryColor text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Products / Variants</span>
              </button>
            </div>

            {/* Selected Items List Table */}
            {selectedItems.length === 0 ? (
              <div className="p-12 border-2 border-dashed border-greyColor/20 rounded-xl text-center flex flex-col items-center justify-center gap-3">
                <div className="p-3 rounded-full bg-greyColor/10 text-[#788ca5]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="text-sm font-medium text-[#9cb3cf]">No bundle items added yet</div>
                <p className="text-xs text-[#788ca5] max-w-sm">
                  Click the button above to search catalog items or specific variants and add them to this bundle.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedItems.map((item, index) => {
                  const isFlexible = item.product?.hasVariants && item.sku_id === null && !item.is_custom;
                  const isCustom = item.is_custom;

                  return (
                    <div
                      key={isCustom ? item.id : `${item.product?.productId}-${item.sku_id || 'base'}`}
                      className={`p-4 rounded-xl bg-[#121922] border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${isCustom ? 'border-indigo-500/30' : isFlexible ? 'border-amber-500/30' : 'border-greyColor/20 hover:border-greyColor/40'}`}
                    >
                      {/* Left: Thumbnail & Title */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`relative w-14 h-14 rounded-lg overflow-hidden border flex-shrink-0 bg-slate-900 flex items-center justify-center ${isCustom ? 'border-indigo-500/50' : isFlexible ? 'border-amber-500/50' : 'border-greyColor/30'}`}>
                          {isCustom ? <Box className="w-6 h-6 text-indigo-400" /> : isFlexible ? <Users className="w-6 h-6 text-amber-500" /> : <ShoppingBag className="w-6 h-6 text-[#788ca5]" />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate flex items-center gap-2">
                            {item.product_title}
                          </div>

                          {isCustom ? (
                            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mt-1 px-2 py-0.5 rounded bg-indigo-500/10 inline-block">
                              Unlisted Item / Freebie
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1 mt-1">
                              {/* Category Path Badge */}
                              <div className="text-[10px] text-[#a9b7cd] flex items-center gap-1.5 uppercase tracking-wider">
                                {item.product?.categoryName || 'Uncategorized'}
                                {item.product?.subCategoryName && (
                                  <>
                                    <span className="text-greyColor/40">•</span>
                                    <span>{item.product.subCategoryName}</span>
                                  </>
                                )}
                              </div>

                              {/* Variant Badge */}
                              {isFlexible ? (
                                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 inline-block self-start">
                                  Customer Chooses Variant
                                </div>
                              ) : item.variant_label && item.variant_label !== 'Base Product' ? (
                                <div className="text-xs text-primaryColor font-medium">
                                  Fixed Variant: {item.variant_label}
                                </div>
                              ) : (
                                <div className="text-xs text-[#788ca5]">Base Product</div>
                              )}
                            </div>
                          )}

                          <div className="text-[11px] text-[#788ca5] font-mono mt-1">
                            SKU: {item.sku_code || item.product?.sku || 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Unit Price & Quantity Input */}
                      <div className="flex items-center gap-6">
                        <div className="text-left md:text-right">
                          <div className="text-[11px] text-[#788ca5]">Retail Price</div>
                          <div className="text-sm font-bold text-white">
                            ${item.unit_price.toFixed(2)}
                          </div>
                        </div>

                        {/* Quantity input */}
                        <div className="space-y-1">
                          <div className="text-[11px] text-[#788ca5]">Qty in Setup</div>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
                            className="w-16 px-2.5 py-1 bg-[#16202c] border border-greyColor/30 rounded-lg text-sm text-white font-bold text-center focus:outline-none focus:border-primaryColor"
                          />
                        </div>

                        {/* Required toggle */}
                        <div className="space-y-1 text-center">
                          <div className="text-[11px] text-[#788ca5]">Requirement</div>
                          <button
                            type="button"
                            onClick={() => handleToggleRequired(index)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${item.is_required
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-greyColor/20 text-[#788ca5]'
                              }`}
                          >
                            {item.is_required ? 'Required' : 'Optional'}
                          </button>
                        </div>
                      </div>

                      {/* Right: Reorder & Remove Actions */}
                      <div className="flex items-center gap-1 pt-2 md:pt-0 border-t md:border-t-0 border-greyColor/15 justify-end">
                        <button
                          type="button"
                          onClick={() => handleMoveItem(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg hover:bg-greyColor/20 text-[#788ca5] disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move Item Up"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveItem(index, 'down')}
                          disabled={index === selectedItems.length - 1}
                          className="p-1.5 rounded-lg hover:bg-greyColor/20 text-[#788ca5] disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move Item Down"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors ml-1"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Live Price & Savings Sidebar */}
        <div className="space-y-6">
          <BundleSummarySidebar
            totalRetailValue={totalRetailValue}
            pricingType={pricingType}
            fixedPrice={fixedPrice}
            discountPercentage={discountPercentage}
            bundlePrice={bundlePrice}
            savingsAmount={savingsAmount}
            savingsPercentage={savingsPercentage}
            isPublished={isPublished}
            setIsPublished={setIsPublished}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            itemCount={selectedItems.length}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Modal Component Picker */}
      <BundleItemSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelectItems={handleSelectItems}
      />
    </div>
  );
}
