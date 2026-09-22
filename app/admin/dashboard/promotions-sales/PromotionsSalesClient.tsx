'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { inter } from '@/types/fonts';
import { Plus, Tag, X, Loader2 } from 'lucide-react';

import { Promotion } from '@/types/promotionsType';
import { usePromotions } from '@/hooks/usePromotions';

import { PromotionCard } from './PromotionCard';
import { PromotionFilterBar } from './PromotionFilterBar';

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type PromotionScope = 'ALL' | 'CATEGORY' | 'PRODUCT';

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

    const [categories, setCategories] = useState<OptionItem[]>([]);
    const [products, setProducts] = useState<OptionItem[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromoId, setEditingPromoId] = useState<number | string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        discountType: 'PERCENTAGE' as DiscountType,
        discountValue: '',
        startDate: '',
        endDate: '',
        applyTo: 'ALL' as PromotionScope,
        targetItems: [] as (number | string)[]
    });

    const fetchTargetOptions = useCallback(async () => {
        setLoadingOptions(true);
        try {
            const token = localStorage.getItem('token');
            const headers: HeadersInit = {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            };

            const [catsRes, prodsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/categories`, { headers }),
                fetch(`${API_BASE_URL}/products`, { headers })
            ]);

            if (catsRes.ok) {
                const catsData = await catsRes.json();
                const catList = Array.isArray(catsData) ? catsData : catsData.data || [];
                setCategories(catList.map((c: any) => ({
                    id: c.category_id || c.id,
                    name: c.category_name || c.name
                })));
            }

            if (prodsRes.ok) {
                const prodsData = await prodsRes.json();
                const prodList = Array.isArray(prodsData) ? prodsData : prodsData.data || [];
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
            startDate: formatForInput(promo.startDate),
            endDate: formatForInput(promo.endDate),
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
        const { name, value } = e.target;
        setFormData(prev => {
            if (name === 'applyTo') {
                return { ...prev, [name]: value as PromotionScope, targetItems: [] };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.discountValue || !formData.startDate || !formData.endDate) return;

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
                start_date: formData.startDate.replace('T', ' ') + ':00',
                end_date: formData.endDate.replace('T', ' ') + ':00',
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
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0D1216] border border-greyColor/20 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
                        <div className="p-5 border-b border-greyColor/20 flex items-center justify-between">
                            <div className="flex items-center gap-x-2">
                                <Tag className="w-5 h-5 text-primaryColor" />
                                <h2 className="text-base font-bold uppercase text-white">
                                    {editingPromoId ? 'Edit Sales Campaign' : 'Create Sales Campaign'}
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
                                    Campaign Title
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="e.g. Mid-Year Tech Sale"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#141A1F] border border-greyColor/20 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primaryColor transition-all"
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
                                        className="w-full bg-[#141A1F] border border-greyColor/20 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primaryColor transition-all"
                                    >
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED_AMOUNT">Fixed Amount (₱)</option>
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
                                            className="w-full bg-[#141A1F] border border-greyColor/20 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primaryColor transition-all"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#d9e3f4]/40 font-bold">
                                            {formData.discountType === 'PERCENTAGE' ? '%' : '₱'}
                                        </span>
                                    </div>
                                </div>
                            </div>

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
                                        className="w-full bg-[#141A1F] border border-greyColor/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primaryColor transition-all"
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
                                        className="w-full bg-[#141A1F] border border-greyColor/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primaryColor transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-[#d9e3f4]/70 mb-1.5">
                                    Applies To
                                </label>
                                <select
                                    name="applyTo"
                                    value={formData.applyTo}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#141A1F] border border-greyColor/20 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primaryColor transition-all"
                                >
                                    <option value="ALL">Entire Store (All Products)</option>
                                    <option value="CATEGORY">Specific Categories</option>
                                    <option value="PRODUCT">Specific Products</option>
                                </select>
                            </div>

                            {formData.applyTo !== 'ALL' && (
                                <div className="p-3 bg-[#141A1F] border border-greyColor/20 rounded-lg space-y-2">
                                    <label className="block text-[11px] font-semibold uppercase text-primaryColor">
                                        Select Target {formData.applyTo === 'CATEGORY' ? 'Categories' : 'Products'}
                                    </label>
                                    <div className="max-h-32 overflow-y-auto space-y-1.5 pr-2 scroller-hide">
                                        {(formData.applyTo === 'CATEGORY' ? categories : products).map(item => {
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
                                                    className={`flex items-center justify-between p-2 rounded-md text-xs cursor-pointer transition-all ${isSelected
                                                        ? 'bg-primaryColor/20 text-white border border-primaryColor/30'
                                                        : 'bg-black/20 text-[#d9e3f4]/60 hover:text-white hover:bg-white/5'
                                                        }`}
                                                >
                                                    <span>{item.name}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        readOnly
                                                        className="accent-primaryColor pointer-events-none"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-greyColor/20 flex items-center justify-end gap-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-xs font-semibold text-[#d9e3f4]/60 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-primaryColor hover:bg-primaryColor/90 text-black font-bold text-xs uppercase px-5 py-2.5 rounded-lg transition-all shadow-md flex items-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
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