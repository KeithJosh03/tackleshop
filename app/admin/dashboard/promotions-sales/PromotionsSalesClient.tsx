'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getSession } from 'next-auth/react';
import { inter } from '@/types/fonts';
import { Plus, Tag, X, Loader2 } from 'lucide-react';

import { Promotion } from '@/types/promotionsType';
import { usePromotions } from '@/hooks/usePromotions';

import { PromotionCard } from './PromotionCard';
import { PromotionFilterBar } from './PromotionFilterBar';

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type PromotionScope = 'ALL' | 'PRODUCT';

export interface OptionItem {
    id: number | string;
    name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const parseDate = (str: string): Date => {
    if (!str) return new Date();
    const formatted = str.includes('T') ? str : str.replace(' ', 'T');
    const parsed = new Date(formatted);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
};

export default function PromotionsSalesClient() {
    const {
        promotions,
        loading: loadingPromos,
        createPromotion,
        updatePromotion,
        deletePromotion
    } = usePromotions();

    const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'SCHEDULED' | 'EXPIRED'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [products, setProducts] = useState<OptionItem[]>([]);
    const [productSearch, setProductSearch] = useState('');
    const [loadingOptions, setLoadingOptions] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromoId, setEditingPromoId] = useState<number | string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        discountType: 'PERCENTAGE' as DiscountType,
        discountValue: '',
        startDate: '',
        endDate: '',
        hasDates: true,
        applyTo: 'ALL' as PromotionScope,
        targetItems: [] as (number | string)[]
    });

    const fetchTargetOptions = useCallback(async () => {
        setLoadingOptions(true);
        try {
            const session: any = await getSession();
            const token = session?.accessToken || session?.user?.token;

            const headers: HeadersInit = {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            };

            const prodsRes = await fetch(`${API_BASE_URL}/products`, { headers });

            if (prodsRes.ok) {
                const prodsData = await prodsRes.json();
                let prodList = [];
                if (Array.isArray(prodsData)) prodList = prodsData;
                else if (Array.isArray(prodsData.products?.data)) prodList = prodsData.products.data;
                else if (Array.isArray(prodsData.products)) prodList = prodsData.products;
                else if (Array.isArray(prodsData.data)) prodList = prodsData.data;
                else if (prodsData.data?.data && Array.isArray(prodsData.data.data)) prodList = prodsData.data.data;

                setProducts(prodList.map((p: any) => ({
                    id: p.product_id || p.id,
                    name: p.product_title || p.name
                })));
            }
        } catch (error) {
            console.error('Error loading target options:', error);
        } finally {
            setLoadingOptions(false);
        }
    }, []);

    useEffect(() => {
        fetchTargetOptions();
    }, [fetchTargetOptions]);

    const handleOpenCreateModal = () => {
        setEditingPromoId(null);
        setFormData({
            name: '',
            discountType: 'PERCENTAGE',
            discountValue: '',
            startDate: '',
            endDate: '',
            hasDates: true,
            applyTo: 'ALL',
            targetItems: []
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (promo: Promotion) => {
        setEditingPromoId(promo.id);

        const formatForInput = (dateStr: string) => {
            const d = parseDate(dateStr);
            const pad = (n: number) => n.toString().padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };

        setFormData({
            name: promo.name,
            discountType: promo.discountType,
            discountValue: promo.discountValue.toString(),
            startDate: promo.startDate ? formatForInput(promo.startDate) : '',
            endDate: promo.endDate ? formatForInput(promo.endDate) : '',
            hasDates: !!(promo.startDate && promo.endDate),
            applyTo: promo.applyTo,
            targetItems: promo.targetItems || []
        });
        setIsModalOpen(true);
    };

    const toggleTargetItem = (id: number | string) => {
        setFormData(prev => {
            const exists = prev.targetItems.some(item => String(item) === String(id));
            return {
                ...prev,
                targetItems: exists
                    ? prev.targetItems.filter(i => String(i) !== String(id))
                    : [...prev.targetItems, id]
            };
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => {
            if (name === 'applyTo') {
                return { ...prev, [name]: value as PromotionScope, targetItems: [] };
            }
            if (type === 'checkbox' && name === 'hasDates') {
                return { ...prev, hasDates: checked };
            }
            return { ...prev, [name]: value };
        });
    };

    console.log(promotions);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.discountValue) return;
        if (formData.hasDates && (!formData.startDate || !formData.endDate)) return;

        setSubmitting(true);
        try {
            // Mapped targetItems to Number[] to fix the TS compilation error
            const payload = {
                name: formData.name,
                discount_type: formData.discountType,
                discount_value: Number(formData.discountValue),
                apply_to: formData.applyTo,
                target_ids: formData.applyTo === 'ALL'
                    ? []
                    : formData.targetItems.map((id) => Number(id)),
                start_date: formData.hasDates ? formData.startDate.replace('T', ' ') + ':00' : null,
                end_date: formData.hasDates ? formData.endDate.replace('T', ' ') + ':00' : null,
                is_active: true
            };

            if (editingPromoId) {
                await updatePromotion(editingPromoId, payload);
            } else {
                await createPromotion(payload);
            }

            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Submit error:', error);
            alert(error?.message || 'Failed to save promotion campaign.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number | string) => {
        if (!confirm('Are you sure you want to delete this promotional campaign?')) return;

        try {
            await deletePromotion(id);
        } catch (error: any) {
            console.error('Delete error:', error);
            alert(error?.message || 'Failed to delete promotion.');
        }
    };

    const filteredPromotions = useMemo(() => {
        return promotions.filter(p => {
            const matchesTab = activeTab === 'ALL' || p.status === activeTab;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [promotions, activeTab, searchQuery]);

    const isLoading = loadingPromos || loadingOptions;


    return (
        <div className={`${inter.className} flex flex-col gap-y-6 text-[#d9e3f4] pb-12`}>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight uppercase">
                        Promotions & Sales
                    </h1>
                    <p className="text-xs text-[#d9e3f4]/60 mt-1">
                        Configure automated flash sales, coupon-less store discounts, and seasonal campaigns.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreateModal}
                    className="bg-primaryColor hover:bg-primaryColor/90 text-black font-bold text-xs uppercase px-5 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-x-2 self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4 stroke-[2.5]" /> Create Campaign
                </button>
            </div>

            {/* Filter and Search Bar */}
            <PromotionFilterBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* Loading Indicator */}
            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-primaryColor animate-spin" />
                    <p className="text-xs text-[#d9e3f4]/60">Fetching promotions from server...</p>
                </div>
            ) : (
                /* Campaigns Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredPromotions.map((promo) => (
                        <PromotionCard
                            key={promo.id}
                            promotion={promo}
                            onEdit={handleOpenEditModal}
                            onDelete={handleDelete}
                        />
                    ))}

                    {filteredPromotions.length === 0 && (
                        <div className="col-span-full py-16 bg-ma-surface-container/30 rounded-xl border border-dashed border-greyColor/20 text-center">
                            <Tag className="w-10 h-10 text-[#d9e3f4]/30 mx-auto mb-3" />
                            <p className="text-[#d9e3f4]/60 font-medium text-sm">No sales campaigns found.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-[#0D1216]/90 border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">
                            <div className="flex items-center gap-x-2">
                                <Tag className="w-5 h-5 text-primaryColor" />
                                <h2 className="text-base font-bold uppercase text-white">
                                    {editingPromoId
                                        ? 'Edit Sales Campaign'
                                        : (formData.applyTo === 'ALL' ? 'Create Event Sale' : 'Create Product Discount')}
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-[#d9e3f4]/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#d9e3f4]/70 mb-1.5">
                                    {formData.applyTo === 'ALL' ? 'Campaign Title' : 'Internal Reference Name (For Dashboard)'}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder={formData.applyTo === 'ALL' ? 'e.g. Mid-Year Tech Sale' : 'e.g. Shimano Reel Clearance'}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primaryColor focus:bg-white/10 transition-all duration-300 shadow-inner"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-[#d9e3f4]/70 mb-1.5">
                                        Discount Type
                                    </label>
                                    <select
                                        name="discountType"
                                        value={formData.discountType}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primaryColor focus:bg-white/10 transition-all duration-300 shadow-inner"
                                    >
                                        <option value="PERCENTAGE" className="bg-[#0D1216] text-white">Percentage (%)</option>
                                        <option value="FIXED_AMOUNT" className="bg-[#0D1216] text-white">Fixed Amount (₱)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-[#d9e3f4]/70 mb-1.5">
                                        Discount Value
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="discountValue"
                                            required
                                            min="1"
                                            placeholder={formData.discountType === 'PERCENTAGE' ? '10' : '500'}
                                            value={formData.discountValue}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primaryColor focus:bg-white/10 transition-all duration-300 shadow-inner"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#d9e3f4]/40 font-bold">
                                            {formData.discountType === 'PERCENTAGE' ? '%' : '₱'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <input
                                    type="checkbox"
                                    name="hasDates"
                                    id="hasDates"
                                    checked={formData.hasDates}
                                    onChange={handleInputChange}
                                    className="accent-primaryColor w-4 h-4 cursor-pointer"
                                />
                                <label htmlFor="hasDates" className="text-xs font-semibold text-[#d9e3f4] uppercase cursor-pointer">
                                    Set Sale Dates (Optional)
                                </label>
                            </div>

                            {formData.hasDates && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase text-[#d9e3f4]/70 mb-1.5">
                                            Start Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="startDate"
                                            required
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primaryColor focus:bg-white/10 transition-all duration-300 shadow-inner"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase text-[#d9e3f4]/70 mb-1.5">
                                            End Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="endDate"
                                            required
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primaryColor focus:bg-white/10 transition-all duration-300 shadow-inner"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#d9e3f4]/70 mb-1.5">
                                    Applies To
                                </label>
                                <select
                                    name="applyTo"
                                    value={formData.applyTo}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primaryColor focus:bg-white/10 transition-all duration-300 shadow-inner"
                                >
                                    <option value="ALL" className="bg-[#0D1216] text-white">Entire Store (All Products)</option>
                                    <option value="PRODUCT" className="bg-[#0D1216] text-white">Specific Products</option>
                                </select>
                            </div>

                            {formData.applyTo === 'PRODUCT' && (
                                <div className="p-5 bg-gradient-to-br from-black/40 to-black/10 border border-white/5 rounded-2xl space-y-4 shadow-inner">
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-[11px] font-bold uppercase tracking-widest text-primaryColor">
                                            Select Target Products
                                        </label>
                                        <span className="text-[10px] text-white/60 bg-white/10 px-2.5 py-1 rounded-full font-medium">
                                            {formData.targetItems.length} selected
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primaryColor/50 focus:bg-white/10 transition-all duration-300"
                                    />
                                    <div className="max-h-52 overflow-y-auto space-y-2 pr-2 scroller-hide">
                                        {products
                                            .filter(p => (p.name || '').toLowerCase().includes((productSearch || '').toLowerCase()))
                                            .map(item => {
                                                const isSelected = formData.targetItems.some(i => String(i) === String(item.id));
                                                return (
                                                    <div
                                                        key={item.id}
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => toggleTargetItem(item.id)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                toggleTargetItem(item.id);
                                                            }
                                                        }}
                                                        className={`group flex items-center justify-between p-3.5 rounded-xl text-xs cursor-pointer transition-all duration-300 border ${isSelected
                                                            ? 'bg-primaryColor/10 text-white border-primaryColor/40 shadow-[0_0_15px_rgba(202,176,13,0.15)]'
                                                            : 'bg-white/5 text-[#d9e3f4]/70 border-transparent hover:text-white hover:bg-white/10 hover:border-white/10'
                                                            }`}
                                                    >
                                                        <span className="font-medium tracking-wide">{item.name}</span>
                                                        <div className={`w-4 h-4 rounded flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-primaryColor text-black scale-110' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                                            {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        {products.filter(p => (p.name || '').toLowerCase().includes((productSearch || '').toLowerCase())).length === 0 && (
                                            <div className="text-center py-6 text-xs text-white/40 italic bg-white/5 rounded-xl">No products found.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-end gap-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase text-[#d9e3f4]/60 hover:text-white hover:bg-white/5 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-primaryColor hover:bg-primaryColor/90 text-black font-bold text-xs uppercase px-6 py-3 rounded-xl transition-all duration-300 shadow-[0_4px_14px_rgba(202,176,13,0.3)] hover:shadow-[0_6px_20px_rgba(202,176,13,0.4)] hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingPromoId ? 'Update Campaign' : 'Save & Launch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}