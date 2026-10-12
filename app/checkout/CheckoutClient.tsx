'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { numericConverter } from '@/utils/priceUtils';
import {
    ShieldCheck,
    MapPin,
    CreditCard,
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    AlertTriangle,
    Truck,
    Tag,
    Scale,
    Package,
    Sparkles,
    Banknote,
    Lock,
    RefreshCw,
    X,
    Check
} from 'lucide-react';
import { getSession } from 'next-auth/react';
import {
    PH_REGIONS,
    getProvincesByRegion,
    getCitiesByProvince,
    getBarangaysByCity,
    PlaceOption,
} from '@/lib/data/phLocations';
import SearchableSelect from '@/components/ui/SearchableSelect';

function getImageUrl(path?: string | null): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return base ? `${base}${cleanPath}` : cleanPath;
}

export default function CheckoutClient() {
    const router = useRouter();
    const { cart, isLoading, fetchCart } = useCart();

    const [evaluation, setEvaluation] = useState<any>(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Collapsible items drawer in right sidebar
    const [isItemListOpen, setIsItemListOpen] = useState(true);

    // Voucher code input & application state
    const [voucherInput, setVoucherInput] = useState('');
    const [appliedVoucherCode, setAppliedVoucherCode] = useState<string | null>(null);
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [voucherFeedback, setVoucherFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Payment Selection state: 'gcash' | 'card' | 'cod'
    const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'card' | 'cod'>('gcash');

    // Credit Card mock inputs
    const [cardDetails, setCardDetails] = useState({
        card_name: '',
        card_number: '',
        card_expiry: '',
        card_cvv: ''
    });

    // Cascading selection codes
    const [selectedRegionCode, setSelectedRegionCode] = useState<string>('');
    const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>('');
    const [selectedCityCode, setSelectedCityCode] = useState<string>('');

    const [form, setForm] = useState({
        full_name: '',
        phone_number: '',
        street_address: '',
        barangay: '',
        city_municipality: '',
        province: '',
        postal_code: '',
        region: '',
        gcash_sender_number: '',
        gcash_reference_number: ''
    });

    // Cascading options derived from active codes
    const provinceOptions: PlaceOption[] = useMemo(() => {
        return getProvincesByRegion(selectedRegionCode);
    }, [selectedRegionCode]);

    const cityOptions: PlaceOption[] = useMemo(() => {
        return getCitiesByProvince(selectedProvinceCode);
    }, [selectedProvinceCode]);

    const barangayOptions: PlaceOption[] = useMemo(() => {
        return getBarangaysByCity(selectedCityCode);
    }, [selectedCityCode]);

    // Check if cart is empty, redirect back
    useEffect(() => {
        if (!isLoading && (!cart || !cart.items || cart.items.length === 0)) {
            router.push('/cart');
        }
    }, [cart, isLoading, router]);

    const calculateTotals = async (
        selectedRegion: string | null = form.region || selectedRegionCode || null,
        voucherCode: string | null = appliedVoucherCode,
        province: string | null = form.province || selectedProvinceCode || null
    ) => {
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

            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (apiToken) headers['Authorization'] = `Bearer ${apiToken}`;
            if (sessionId) headers['X-Session-ID'] = sessionId;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/checkout/calculate`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    region: selectedRegion,
                    province: province,
                    province_code: province,
                    voucher_code: voucherCode
                })
            });

            const data = await res.json();
            if (data.status) {
                setEvaluation(data.data);
                return data.data;
            } else {
                setErrorMsg(data.message);
                return null;
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Calculation failed');
            return null;
        } finally {
            setIsEvaluating(false);
        }
    };

    // Initial calculation without shipping
    useEffect(() => {
        if (cart && cart.items && cart.items.length > 0) {
            calculateTotals(form.region || selectedRegionCode || null, appliedVoucherCode, form.province || selectedProvinceCode || null);
        }
    }, [cart]);

    const handleRegionChange = (regionCode: string) => {
        setSelectedRegionCode(regionCode);
        setSelectedProvinceCode('');
        setSelectedCityCode('');

        const found = PH_REGIONS.find((r) => r.code === regionCode);
        const islandGroup = found ? found.islandGroup : '';

        setForm((prev) => ({
            ...prev,
            region: islandGroup,
            province: '',
            city_municipality: '',
            barangay: '',
        }));

        calculateTotals(regionCode || islandGroup || null, appliedVoucherCode, null);
    };

    const handleProvinceChange = (provinceName: string, provinceCode?: string) => {
        setSelectedProvinceCode(provinceCode || '');
        setSelectedCityCode('');

        setForm((prev) => ({
            ...prev,
            province: provinceName,
            city_municipality: '',
            barangay: '',
        }));

        calculateTotals(selectedRegionCode || form.region || null, appliedVoucherCode, provinceName || provinceCode || null);
    };

    const handleCityChange = (cityName: string, cityCode?: string) => {
        setSelectedCityCode(cityCode || '');

        setForm((prev) => ({
            ...prev,
            city_municipality: cityName,
            barangay: '',
        }));
    };

    const handleBarangayChange = (barangayName: string) => {
        setForm((prev) => ({
            ...prev,
            barangay: barangayName,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Voucher application handler
    const handleApplyVoucher = async (codeToApply?: string) => {
        const code = (codeToApply || voucherInput).trim().toUpperCase();
        if (!code) {
            setVoucherFeedback({ type: 'error', message: 'Please enter a voucher code.' });
            return;
        }

        setVoucherLoading(true);
        setVoucherFeedback(null);

        try {
            const result = await calculateTotals(form.region || null, code);
            if (result && result.voucher_applied) {
                setAppliedVoucherCode(code);
                setVoucherFeedback({
                    type: 'success',
                    message: `Voucher applied: ${result.voucher_applied.name || code}`
                });
                setVoucherInput('');
            } else {
                setVoucherFeedback({
                    type: 'error',
                    message: 'Invalid or inactive voucher code.'
                });
            }
        } catch (err: any) {
            setVoucherFeedback({ type: 'error', message: 'Could not apply voucher.' });
        } finally {
            setVoucherLoading(false);
        }
    };

    // Voucher removal handler
    const handleRemoveVoucher = async () => {
        setAppliedVoucherCode(null);
        setVoucherFeedback(null);
        await calculateTotals(form.region || null, null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        if (!form.region) {
            setErrorMsg('Please select your Region to determine the J&T Express shipping rate.');
            setIsSubmitting(false);
            return;
        }

        if (paymentMethod === 'gcash') {
            if (!form.gcash_sender_number || !form.gcash_reference_number) {
                setErrorMsg('Please enter your GCash Sender Number and 13-digit Reference Number.');
                setIsSubmitting(false);
                return;
            }
        } else if (paymentMethod === 'card') {
            if (!cardDetails.card_name || !cardDetails.card_number || !cardDetails.card_expiry || !cardDetails.card_cvv) {
                setErrorMsg('Please complete all credit/debit card fields.');
                setIsSubmitting(false);
                return;
            }
        }

        try {
            const session: any = await getSession();
            let apiToken = null;
            if (session && session.accessToken) {
                apiToken = session.accessToken;
            } else if (session && session.user && (session.user as any).token) {
                apiToken = (session.user as any).token;
            }

            const sessionId = typeof window !== 'undefined' ? localStorage.getItem('cart_session_id') : null;
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (apiToken) headers['Authorization'] = `Bearer ${apiToken}`;
            if (sessionId) headers['X-Session-ID'] = sessionId;

            const payload: any = {
                ...form,
                payment_method: paymentMethod,
                voucher_code: appliedVoucherCode
            };

            if (paymentMethod === 'card') {
                payload.gcash_sender_number = form.phone_number;
                payload.gcash_reference_number = `CARD-${cardDetails.card_number.slice(-4)}`;
            } else if (paymentMethod === 'cod') {
                payload.gcash_sender_number = form.phone_number;
                payload.gcash_reference_number = 'COD-PAYMENT';
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/checkout/process`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.status) {
                await fetchCart(); // Refresh cart context to 0 items
                router.push(`/orders/${data.order_id}`);
            } else {
                setErrorMsg(data.message || 'Checkout failed. Please check your items.');
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'A network error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate promotions savings from evaluation items
    const eventSalesDiscount = useMemo(() => {
        return evaluation?.sales_discount ?? evaluation?.total_discount ?? 0;
    }, [evaluation]);

    // Active voucher discount
    const voucherDiscount = useMemo(() => {
        return evaluation?.voucher_discount ?? 0;
    }, [evaluation]);

    // Active promo label
    const eventPromoNames = useMemo(() => {
        if (!evaluation?.evaluated_items) return [];
        const names = evaluation.evaluated_items
            .map((ei: any) => ei.promotion_name)
            .filter((name: any): name is string => Boolean(name));
        return Array.from(new Set(names));
    }, [evaluation]);

    if (isLoading || !cart || cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 border-4 border-ma-primary/20 border-t-ma-primary rounded-full animate-spin" />
                <p className="text-white/60 text-xs font-semibold tracking-widest uppercase">
                    Preparing secure checkout...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ======================================================== */}
            {/* LEFT COLUMN: Step-by-Step Checkout Flow */}
            {/* ======================================================== */}
            <div className="w-full lg:w-2/3 space-y-6">

                {errorMsg && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-300 font-medium text-sm shadow-lg">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* STEP 1: Shipping Address & Region Selection */}
                {/* ---------------------------------------------------- */}
                <div className="bg-[#141A1F] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-ma-primary/20 border border-ma-primary/30 text-ma-primary flex items-center justify-center text-xs font-black">
                                01
                            </span>
                            <div>
                                <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-ma-primary" />
                                    Shipping Destination & Region
                                </h2>
                                <p className="text-[11px] text-white/50">Required for accurate J&T Express courier rate tiers</p>
                            </div>
                        </div>
                        {form.region && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                {form.region} Rate Active
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Recipient Full Name */}
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Full Name <span className="text-ma-primary">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                placeholder="Recipient Full Name"
                                className="w-full px-4 py-3 bg-[#101415] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-ma-primary placeholder-white/30 transition-colors"
                            />
                        </div>

                        {/* Recipient Phone Number */}
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Phone Number <span className="text-ma-primary">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                                placeholder="09XXXXXXXXX"
                                className="w-full px-4 py-3 bg-[#101415] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-ma-primary placeholder-white/30 transition-colors"
                            />
                        </div>

                        {/* 1. Region Dropdown */}
                        <div className="space-y-1.5 md:col-span-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                    Philippine Region (Island Group) <span className="text-ma-primary">*</span>
                                </label>
                                <span className="text-[10px] text-white/40">Select to lock courier rate</span>
                            </div>
                            <div className="relative">
                                <select
                                    required
                                    value={selectedRegionCode}
                                    onChange={(e) => handleRegionChange(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#101415] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-ma-primary appearance-none cursor-pointer pr-10"
                                >
                                    <option value="" disabled>Select Philippine Region</option>
                                    <optgroup label="Luzon (Includes Metro Manila)">
                                        {PH_REGIONS.filter((r) => r.islandGroup === 'LUZON').map((r) => (
                                            <option key={r.code} value={r.code}>
                                                {r.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Visayas">
                                        {PH_REGIONS.filter((r) => r.islandGroup === 'VISAYAS').map((r) => (
                                            <option key={r.code} value={r.code}>
                                                {r.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Mindanao">
                                        {PH_REGIONS.filter((r) => r.islandGroup === 'MINDANAO').map((r) => (
                                            <option key={r.code} value={r.code}>
                                                {r.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Province Dropdown */}
                        <div className="space-y-1.5">
                            <SearchableSelect
                                label="Province / District"
                                name="province"
                                value={form.province}
                                options={provinceOptions}
                                placeholder="Select Province..."
                                disabledPlaceholder="Select Region first"
                                disabled={!selectedRegionCode}
                                required
                                onChange={handleProvinceChange}
                                helperText={selectedRegionCode ? `${provinceOptions.length} available` : undefined}
                            />
                        </div>

                        {/* 3. City / Municipality Dropdown */}
                        <div className="space-y-1.5">
                            <SearchableSelect
                                label="City / Municipality"
                                name="city_municipality"
                                value={form.city_municipality}
                                options={cityOptions}
                                placeholder="Select City / Municipality..."
                                disabledPlaceholder="Select Province first"
                                disabled={!selectedProvinceCode}
                                required
                                onChange={handleCityChange}
                                helperText={selectedProvinceCode ? `${cityOptions.length} available` : undefined}
                            />
                        </div>

                        {/* 4. Barangay Dropdown */}
                        <div className="space-y-1.5">
                            <SearchableSelect
                                label="Barangay"
                                name="barangay"
                                value={form.barangay}
                                options={barangayOptions}
                                placeholder="Select Barangay..."
                                disabledPlaceholder="Select City first"
                                disabled={!selectedCityCode}
                                required
                                onChange={handleBarangayChange}
                                helperText={selectedCityCode ? `${barangayOptions.length} available` : undefined}
                            />
                        </div>

                        {/* 5. Postal Code */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Postal Code <span className="text-ma-primary">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="postal_code"
                                value={form.postal_code}
                                onChange={handleChange}
                                placeholder="e.g. 4102"
                                className="w-full px-4 py-3 bg-[#101415] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-ma-primary placeholder-white/30 transition-colors"
                            />
                        </div>

                        {/* Street Address */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Street Address / House No., Bldg, Landmark <span className="text-ma-primary">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="street_address"
                                value={form.street_address}
                                onChange={handleChange}
                                placeholder="e.g. Blk 12 Lot 34 Phase 2, Molino Blvd"
                                className="w-full px-4 py-3 bg-[#101415] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-ma-primary placeholder-white/30 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* STEP 2: Shipping Method (J&T Express) */}
                {/* ---------------------------------------------------- */}
                <div className="bg-[#141A1F] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-ma-primary/20 border border-ma-primary/30 text-ma-primary flex items-center justify-center text-xs font-black">
                                02
                            </span>
                            <div>
                                <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-ma-primary" />
                                    Shipping Method & Courier Specs
                                </h2>
                                <p className="text-[11px] text-white/50">J&T Express Nationwide Express Parcel Logistics</p>
                            </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-wider">
                            J&T Express
                        </span>
                    </div>

                    {/* Weight & Bulky Confirmation Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-ma-primary shrink-0">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <span>Origin: Davao City Hub</span>
                                        {evaluation?.shipping_breakdown?.distance_zone && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-ma-primary/20 text-ma-primary border border-ma-primary/30">
                                                Zone: {evaluation.shipping_breakdown.distance_zone.replace(/_/g, ' ')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-[11px] text-white/60 mt-0.5">
                                        Packaging:{' '}
                                        <span className="text-white font-semibold">
                                            {evaluation?.shipping_breakdown?.package_type || (evaluation?.has_bulky ? 'Special Courier / PVC Rod Tube' : 'Standard Parcel Box')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-left sm:text-right">
                                <div className="text-xs font-bold text-white/60 uppercase">Delivery Time</div>
                                <div className="text-xs font-black text-emerald-400">
                                    {evaluation?.shipping_breakdown?.distance_zone === 'INTRA_MINDANAO'
                                        ? '1-2 Business Days (Intra-Mindanao)'
                                        : evaluation?.shipping_breakdown?.distance_zone === 'VISAYAS'
                                            ? '2-4 Business Days (Inter-Island Visayas)'
                                            : '3-5 Business Days'}
                                </div>
                            </div>
                        </div>

                        {/* Bulky Notice Alert */}
                        {evaluation?.has_bulky && (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-start gap-2.5">
                                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold">⚠️ Oversized / PVC Rod Tube Handling Surcharge Applies (+₱150.00)</span>
                                    <p className="text-[11px] text-amber-200/80 font-normal mt-0.5">
                                        Your order contains fishing rods, PVC tubes, or oversized tackle storage cases requiring dedicated carrier handling.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Weight Comparison (Physical vs Volumetric vs Chargeable) */}
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                                <span className="text-white/40 text-[10px] uppercase font-semibold block">Physical Weight</span>
                                <span className="font-bold text-white font-mono">
                                    {evaluation?.shipping_breakdown
                                        ? `${evaluation.shipping_breakdown.physical_weight_kg} kg`
                                        : `${((evaluation?.total_weight ?? 0) / 1000).toFixed(2)} kg`}
                                </span>
                            </div>

                            <div>
                                <span className="text-white/40 text-[10px] uppercase font-semibold block">Volumetric Weight (Divisor 3,500)</span>
                                <span className="font-bold text-cyan-400 font-mono">
                                    {evaluation?.shipping_breakdown
                                        ? `${evaluation.shipping_breakdown.volumetric_weight_kg} kg`
                                        : 'Preset Dimensions'}
                                </span>
                            </div>

                            <div className="border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-3">
                                <span className="text-ma-primary text-[10px] uppercase font-bold block">Chargeable Weight</span>
                                <span className="font-black text-ma-primary font-mono text-sm">
                                    {evaluation?.shipping_breakdown
                                        ? `${evaluation.shipping_breakdown.chargeable_weight_kg} kg`
                                        : `${((evaluation?.total_weight ?? 0) / 1000).toFixed(2)} kg`}
                                </span>
                            </div>
                        </div>

                        {/* Transparent Rate Breakdown */}
                        <div className="pt-3 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-white/40 text-[10px] uppercase font-semibold block">Base Rate</span>
                                <span className="font-bold text-white font-mono">
                                    {evaluation?.shipping_breakdown
                                        ? numericConverter(evaluation.shipping_breakdown.base_freight.toFixed(2))
                                        : form.region ? '₱85.00' : 'Select Destination'}
                                </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-white/40 text-[10px] uppercase font-semibold block">Bulky Surcharge</span>
                                <span className="font-bold text-amber-400 font-mono">
                                    {evaluation?.shipping_breakdown
                                        ? `+${numericConverter(evaluation.shipping_breakdown.bulky_surcharge.toFixed(2))}`
                                        : (evaluation?.has_bulky ? '+₱150.00' : '₱0.00')}
                                </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-white/40 text-[10px] uppercase font-semibold block">Declared Value Ins.</span>
                                <span className="font-bold text-emerald-400 font-mono">
                                    {evaluation?.shipping_breakdown
                                        ? (evaluation.shipping_breakdown.insurance_fee > 0
                                            ? `+${numericConverter(evaluation.shipping_breakdown.insurance_fee.toFixed(2))}`
                                            : 'Free (≤ ₱2,000)')
                                        : '1% (> ₱2k)'}
                                </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-ma-primary/10 border border-ma-primary/20">
                                <span className="text-ma-primary text-[10px] uppercase font-bold block">Total Shipping Fee</span>
                                <span className="font-black text-ma-primary font-mono text-sm">
                                    {evaluation?.shipping_fee !== undefined && (form.region || selectedRegionCode)
                                        ? numericConverter(evaluation.shipping_fee.toFixed(2))
                                        : 'Pending Destination'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* STEP 3: Promo / Voucher Code Input */}
                {/* ---------------------------------------------------- */}
                <div className="bg-[#141A1F] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-ma-primary/20 border border-ma-primary/30 text-ma-primary flex items-center justify-center text-xs font-black">
                                03
                            </span>
                            <div>
                                <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-ma-primary" />
                                    Promo Voucher / Store Coupon
                                </h2>
                                <p className="text-[11px] text-white/50">Apply your tournament discount or welcome coupon</p>
                            </div>
                        </div>
                    </div>

                    {/* Applied Voucher Card */}
                    {appliedVoucherCode && evaluation?.voucher_applied ? (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-emerald-900/40 to-teal-950/60 border border-emerald-500/40 shadow-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">
                                    🏷️
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-black text-emerald-300 uppercase px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                                            {evaluation.voucher_applied.code}
                                        </span>
                                        <span className="text-xs font-bold text-white">
                                            {evaluation.voucher_applied.name}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                                        Subtracted: -{numericConverter(evaluation.voucher_discount.toFixed(2))}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleRemoveVoucher}
                                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-bold uppercase transition-colors flex items-center gap-1"
                            >
                                <X className="w-3.5 h-3.5" />
                                <span>Remove</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex gap-2.5">
                                <input
                                    type="text"
                                    value={voucherInput}
                                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                                    placeholder="ENTER CODE (e.g. FIRSTCAST200)"
                                    className="flex-1 px-4 py-3 bg-[#101415] border border-white/10 rounded-xl text-sm font-mono text-white uppercase placeholder-white/30 focus:outline-none focus:border-ma-primary transition-colors"
                                />
                                <button
                                    type="button"
                                    disabled={voucherLoading || !voucherInput.trim()}
                                    onClick={() => handleApplyVoucher()}
                                    className="px-6 py-3 bg-ma-primary text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-ma-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                                >
                                    {voucherLoading ? (
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        'Apply'
                                    )}
                                </button>
                            </div>

                            {/* Feedback message */}
                            {voucherFeedback && (
                                <p className={`text-xs font-semibold ${voucherFeedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {voucherFeedback.message}
                                </p>
                            )}

                            {/* Suggested Quick Vouchers */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="text-[10px] text-white/40 uppercase font-semibold">Available Codes:</span>
                                <button
                                    type="button"
                                    onClick={() => handleApplyVoucher('FIRSTCAST200')}
                                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-ma-primary text-[10px] font-mono transition-colors"
                                >
                                    FIRSTCAST200 (-₱200)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleApplyVoucher('SMOOTHCAST10')}
                                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-ma-primary text-[10px] font-mono transition-colors"
                                >
                                    SMOOTHCAST10 (10% OFF)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleApplyVoucher('ANGLER500')}
                                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-ma-primary text-[10px] font-mono transition-colors"
                                >
                                    ANGLER500 (-₱500)
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ---------------------------------------------------- */}
                {/* STEP 4: Payment Selection */}
                {/* ---------------------------------------------------- */}
                <div className="bg-[#141A1F] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-ma-primary/20 border border-ma-primary/30 text-ma-primary flex items-center justify-center text-xs font-black">
                                04
                            </span>
                            <div>
                                <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-ma-primary" />
                                    Payment Method
                                </h2>
                                <p className="text-[11px] text-white/50">Choose your preferred settlement method</p>
                            </div>
                        </div>
                    </div>

                    {/* Radio Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        {/* GCash Radio Card */}
                        <div
                            onClick={() => setPaymentMethod('gcash')}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'gcash'
                                ? 'bg-[#007DFE]/15 border-[#007DFE] shadow-[0_0_20px_rgba(0,125,254,0.25)]'
                                : 'bg-[#101415] border-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black text-white uppercase tracking-wider">GCash</span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'gcash' ? 'border-[#007DFE] bg-[#007DFE]' : 'border-white/30'}`}>
                                    {paymentMethod === 'gcash' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                            </div>
                            <p className="text-[11px] text-white/60">Direct scan QR & Reference verification</p>
                        </div>

                        {/* Credit / Debit Card Radio Card */}
                        <div
                            onClick={() => setPaymentMethod('card')}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'card'
                                ? 'bg-purple-500/15 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                                : 'bg-[#101415] border-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black text-white uppercase tracking-wider">Card</span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-purple-500 bg-purple-500' : 'border-white/30'}`}>
                                    {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                            </div>
                            <p className="text-[11px] text-white/60">Visa / Mastercard 256-bit SSL encrypted</p>
                        </div>

                        {/* Cash on Delivery (COD) Radio Card */}
                        <div
                            onClick={() => setPaymentMethod('cod')}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'cod'
                                ? 'bg-emerald-500/15 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                                : 'bg-[#101415] border-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black text-white uppercase tracking-wider">Cash on Delivery</span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-500' : 'border-white/30'}`}>
                                    {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                            </div>
                            <p className="text-[11px] text-white/60">Pay cash upon delivery by J&T Express</p>
                        </div>
                    </div>

                    {/* GCash Details Panel */}
                    {paymentMethod === 'gcash' && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            <div className="flex flex-col sm:flex-row gap-6 bg-[#101415] p-5 rounded-2xl border border-white/10">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#007DFE] animate-pulse" />
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">Official GCash Merchant</span>
                                    </div>
                                    <p className="text-xs text-white/70 leading-relaxed">
                                        Scan the QR code or send to the mobile number below, then input your sender number and 13-digit reference ID.
                                    </p>
                                    <div className="mt-3 p-3.5 bg-[#007DFE]/10 rounded-xl border border-[#007DFE]/30">
                                        <div className="text-[10px] text-[#007DFE] font-bold uppercase tracking-wider">Store Account</div>
                                        <div className="text-lg font-black text-white font-mono">0917 123 4567</div>
                                        <div className="text-xs font-medium text-white/80">Smooth Casting Tackle / Juan Dela Cruz</div>
                                    </div>
                                </div>

                                {/* QR Code Container */}
                                <div className="w-32 h-32 bg-white rounded-2xl flex flex-col items-center justify-center shrink-0 border-4 border-[#007DFE] shadow-lg self-center">
                                    <div className="text-black font-black text-xs tracking-widest uppercase">GCASH QR</div>
                                    <div className="text-[9px] text-black/60 font-mono mt-1">Official Merchant</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                        GCash Sender Number <span className="text-[#007DFE]">*</span>
                                    </label>
                                    <input
                                        required={paymentMethod === 'gcash'}
                                        type="text"
                                        name="gcash_sender_number"
                                        value={form.gcash_sender_number}
                                        onChange={handleChange}
                                        placeholder="09XXXXXXXXX"
                                        className="w-full px-4 py-3 bg-[#101415] border border-[#007DFE]/40 rounded-xl text-sm text-white focus:outline-none focus:border-[#007DFE] placeholder-white/30"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                        13-Digit Reference Number <span className="text-[#007DFE]">*</span>
                                    </label>
                                    <input
                                        required={paymentMethod === 'gcash'}
                                        type="text"
                                        name="gcash_reference_number"
                                        value={form.gcash_reference_number}
                                        onChange={handleChange}
                                        placeholder="e.g. 1234567890123"
                                        className="w-full px-4 py-3 bg-[#101415] border border-[#007DFE]/40 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-[#007DFE] placeholder-white/30"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Credit / Debit Card Panel */}
                    {paymentMethod === 'card' && (
                        <div className="space-y-4 bg-[#101415] p-5 rounded-2xl border border-white/10 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">256-Bit SSL Encrypted</span>
                                </div>
                                <span className="text-[10px] text-white/40 uppercase font-mono">Visa / Mastercard / JCB</span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block mb-1">
                                        Cardholder Name <span className="text-purple-400">*</span>
                                    </label>
                                    <input
                                        required={paymentMethod === 'card'}
                                        type="text"
                                        value={cardDetails.card_name}
                                        onChange={(e) => setCardDetails(prev => ({ ...prev, card_name: e.target.value }))}
                                        placeholder="Full Name as on Card"
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-400 placeholder-white/30"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block mb-1">
                                        Card Number <span className="text-purple-400">*</span>
                                    </label>
                                    <input
                                        required={paymentMethod === 'card'}
                                        type="text"
                                        maxLength={19}
                                        value={cardDetails.card_number}
                                        onChange={(e) => setCardDetails(prev => ({ ...prev, card_number: e.target.value }))}
                                        placeholder="4000 1234 5678 9010"
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-purple-400 placeholder-white/30"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block mb-1">
                                            Expiry Date <span className="text-purple-400">*</span>
                                        </label>
                                        <input
                                            required={paymentMethod === 'card'}
                                            type="text"
                                            maxLength={5}
                                            value={cardDetails.card_expiry}
                                            onChange={(e) => setCardDetails(prev => ({ ...prev, card_expiry: e.target.value }))}
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-purple-400 placeholder-white/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block mb-1">
                                            CVV / CVC <span className="text-purple-400">*</span>
                                        </label>
                                        <input
                                            required={paymentMethod === 'card'}
                                            type="password"
                                            maxLength={4}
                                            value={cardDetails.card_cvv}
                                            onChange={(e) => setCardDetails(prev => ({ ...prev, card_cvv: e.target.value }))}
                                            placeholder="123"
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-purple-400 placeholder-white/30"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cash on Delivery (COD) Panel */}
                    {paymentMethod === 'cod' && (
                        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3 animate-in fade-in duration-200">
                            <div className="flex items-center gap-2">
                                <Banknote className="w-5 h-5 text-emerald-400" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">
                                    Cash on Delivery Selected
                                </span>
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed">
                                Please prepare the exact cash payment of{' '}
                                <span className="text-emerald-300 font-bold font-mono">
                                    {evaluation ? numericConverter(evaluation.grand_total.toFixed(2)) : '...'}
                                </span>{' '}
                                to handover to the J&T Express courier upon delivery to your doorstep.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: Order Summary & Value Proposition Sidebar */}
            {/* ======================================================== */}
            <div className="w-full lg:w-1/3 sticky top-24 space-y-4">
                <div className="bg-[#141A1F] p-6 sm:p-7 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    {/* Subtle glow */}
                    <div className="absolute -top-20 -right-20 w-44 h-44 bg-ma-primary/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-ma-primary" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">
                                Order Summary
                            </h2>
                        </div>
                        {isEvaluating && (
                            <span className="text-[10px] font-bold text-ma-primary uppercase tracking-wider animate-pulse flex items-center gap-1">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                Updating
                            </span>
                        )}
                    </div>

                    {/* 1. Mini Item List (Collapsible / Accordion) */}
                    <div className="mb-5 pb-4 border-b border-white/10">
                        <button
                            type="button"
                            onClick={() => setIsItemListOpen(prev => !prev)}
                            className="w-full flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider hover:text-ma-primary transition-colors py-1"
                        >
                            <span>Items in Order ({cart.items.length})</span>
                            <div className="flex items-center gap-1 text-[11px] text-white/40">
                                <span>{isItemListOpen ? 'Hide' : 'Show'}</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isItemListOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </button>

                        {isItemListOpen && (
                            <div className="mt-3 space-y-3 max-h-64 overflow-y-auto pr-1">
                                {cart.items.map((item: any) => {
                                    const isSetupLine = Boolean(item.setup_id && item.setup);
                                    let imgUrl = null;
                                    if (isSetupLine && item.setup?.images?.length) {
                                        imgUrl = item.setup.images.find((img: any) => img.isMain || img.is_main)?.image_url || item.setup.images[0]?.image_url;
                                    } else if (item.sku?.images?.length > 0) {
                                        imgUrl = item.sku.images.find((img: any) => img.isMain || img.is_main)?.image_url || item.sku.images[0]?.image_url;
                                    } else if (item.product?.images?.length > 0) {
                                        imgUrl = item.product.images.find((img: any) => img.is_main || img.isMain)?.image_url || item.product.images[0]?.image_url;
                                    }

                                    const title = isSetupLine ? item.setup?.bundle_title : item.product?.product_title;
                                    const evalItem = evaluation?.evaluated_items?.find((ei: any) => ei.cart_item_id === item.cart_item_id);
                                    const promoName = evalItem?.promotion_name;
                                    const unitPrice = evalItem ? evalItem.price_snapshot : (item.sku ? item.sku.price : (item.product?.base_price ?? item.setup?.bundle_price ?? 0));
                                    const finalUnitPrice = evalItem ? evalItem.final_price : unitPrice;
                                    const lineDiscount = evalItem ? evalItem.discount_applied_snapshot * item.quantity : 0;

                                    return (
                                        <div key={item.cart_item_id} className="flex gap-3 items-center p-2 rounded-xl bg-black/30 border border-white/5">
                                            <div className="relative w-12 h-12 bg-black/50 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                                {imgUrl ? (
                                                    <Image src={getImageUrl(imgUrl)} alt="Thumbnail" fill sizes="48px" className="object-contain p-1" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[8px] text-white/30 uppercase font-bold">Lure</div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-bold text-white truncate">{title}</div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-white/50 font-mono">Qty: {item.quantity}</span>
                                                    {promoName && (
                                                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded truncate">
                                                            {promoName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                {lineDiscount > 0 && (
                                                    <div className="text-[10px] text-white/40 line-through">
                                                        {numericConverter((unitPrice * item.quantity).toFixed(2))}
                                                    </div>
                                                )}
                                                <div className="text-xs font-bold text-ma-primary font-mono">
                                                    {numericConverter((finalUnitPrice * item.quantity).toFixed(2))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* 2. Mathematical Price Calculation Card */}
                    {evaluation ? (
                        <div className="space-y-3 text-xs">
                            {/* Gross Subtotal */}
                            <div className="flex justify-between items-center text-white/70">
                                <span className="uppercase tracking-wider font-semibold">Gross Subtotal</span>
                                <span className="font-bold text-white font-mono text-sm">
                                    {numericConverter(evaluation.subtotal.toFixed(2))}
                                </span>
                            </div>

                            {/* Active Event Sales Discount */}
                            {eventSalesDiscount > 0 && (
                                <div className="flex justify-between items-center text-emerald-400">
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span className="uppercase tracking-wider font-semibold">
                                            Active Event Sales Discount
                                            {eventPromoNames.length > 0 && (
                                                <span className="text-[10px] block text-emerald-300 font-normal">
                                                    ({eventPromoNames.join(', ')})
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <span className="font-bold font-mono text-sm">
                                        - {numericConverter(eventSalesDiscount.toFixed(2))}
                                    </span>
                                </div>
                            )}

                            {/* Applied Promo Voucher */}
                            {voucherDiscount > 0 && (
                                <div className="flex justify-between items-center text-emerald-400">
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span className="uppercase tracking-wider font-semibold">
                                            Applied Promo Voucher
                                            {evaluation?.voucher_applied?.code && (
                                                <span className="text-[10px] block text-emerald-300 font-mono">
                                                    ({evaluation.voucher_applied.code})
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <span className="font-bold font-mono text-sm">
                                        - {numericConverter(voucherDiscount.toFixed(2))}
                                    </span>
                                </div>
                            )}

                            {/* J&T Express Shipping Fee & Breakdown */}
                            <div className="space-y-1.5 pt-1">
                                <div className="flex justify-between items-center text-white/80">
                                    <div className="flex items-center gap-1.5">
                                        <Truck className="w-3.5 h-3.5 text-ma-primary shrink-0" />
                                        <div>
                                            <span className="uppercase tracking-wider font-semibold block">
                                                J&T Express Freight
                                            </span>
                                            {form.region && (
                                                <span className="text-[10px] text-white/40 block">
                                                    {evaluation?.shipping_breakdown
                                                        ? `${evaluation.shipping_breakdown.chargeable_weight_kg}kg Chargeable (${evaluation.shipping_breakdown.distance_zone.replace(/_/g, ' ')})`
                                                        : `Based on ${((evaluation.total_weight ?? 0) / 1000).toFixed(2)}kg`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-bold text-white font-mono text-sm">
                                        {form.region || selectedRegionCode ? (
                                            numericConverter(evaluation.shipping_fee.toFixed(2))
                                        ) : (
                                            <span className="text-white/40 text-[11px] font-normal italic">Select destination</span>
                                        )}
                                    </span>
                                </div>

                                {/* Subtle Sub-breakdown if bulky or insured */}
                                {evaluation?.shipping_breakdown && (evaluation.shipping_breakdown.bulky_surcharge > 0 || evaluation.shipping_breakdown.insurance_fee > 0) && (
                                    <div className="pl-5 space-y-1 text-[11px] text-white/50 border-l border-white/10 ml-1.5 mt-1">
                                        <div className="flex justify-between">
                                            <span>Base Freight:</span>
                                            <span className="font-mono text-white/70">
                                                {numericConverter(evaluation.shipping_breakdown.base_freight.toFixed(2))}
                                            </span>
                                        </div>
                                        {evaluation.shipping_breakdown.bulky_surcharge > 0 && (
                                            <div className="flex justify-between text-amber-400">
                                                <span>⚠️ Bulky / PVC Tube:</span>
                                                <span className="font-mono">
                                                    +{numericConverter(evaluation.shipping_breakdown.bulky_surcharge.toFixed(2))}
                                                </span>
                                            </div>
                                        )}
                                        {evaluation.shipping_breakdown.insurance_fee > 0 && (
                                            <div className="flex justify-between text-emerald-400">
                                                <span>🛡️ Insurance (1%):</span>
                                                <span className="font-mono">
                                                    +{numericConverter(evaluation.shipping_breakdown.insurance_fee.toFixed(2))}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <hr className="border-white/10 my-4" />

                            {/* Grand Total */}
                            <div className="flex justify-between items-end pt-1">
                                <div>
                                    <span className="text-xs font-black uppercase tracking-widest text-white/70 block">
                                        GRAND TOTAL
                                    </span>
                                    <span className="text-[10px] text-white/40 uppercase">All discounts & shipping included</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-ma-primary font-black text-2xl sm:text-3xl leading-none block font-mono">
                                        {numericConverter(evaluation.grand_total.toFixed(2))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-pulse space-y-3 py-4">
                            <div className="h-4 bg-white/5 rounded w-full" />
                            <div className="h-4 bg-white/5 rounded w-3/4" />
                            <div className="h-8 bg-white/5 rounded w-1/2 ml-auto mt-4" />
                        </div>
                    )}

                    {/* Action Button: PLACE ORDER */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={!evaluation || isEvaluating || isSubmitting || !form.region}
                            className="group relative w-full overflow-hidden rounded-2xl p-[1px] font-black uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.99] shadow-[0_0_25px_rgba(255,196,154,0.3)] hover:shadow-[0_0_40px_rgba(255,196,154,0.5)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#ffc49a] via-[#ff9d4d] to-[#ffc49a] rounded-2xl animate-pulse" />
                            <div className="relative flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-[#ffc49a] to-[#ff9d4d] text-black rounded-2xl font-black transition-colors">
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        <span>Processing Order...</span>
                                    </>
                                ) : !form.region ? (
                                    <span>Select Region to Place Order</span>
                                ) : (
                                    <>
                                        <span>
                                            PLACE ORDER ({numericConverter(evaluation?.grand_total ? evaluation.grand_total.toFixed(2) : '0')})
                                        </span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* 3. E-Commerce Trust & Offer Badges (Footer of Order Summary) */}
                    <div className="mt-6 pt-5 border-t border-white/5 space-y-2.5">
                        <div className="flex items-center gap-2.5 text-white/60 text-xs font-semibold">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>🛡️ 100% Authentic Tackle Guaranteed</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-white/60 text-xs font-semibold">
                            <Truck className="w-4 h-4 text-ma-primary shrink-0" />
                            <span>📦 J&T Express Insured Shipping & Live Tracking</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-white/60 text-xs font-semibold">
                            <RefreshCw className="w-4 h-4 text-sky-400 shrink-0" />
                            <span>🔄 7-Day Easy Returns / Defect Guarantee</span>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

