'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Eye,
    Package,
    Clock,
    DollarSign,
    TrendingUp,
    X,
    MapPin,
    CreditCard,
    FileText,
    Truck,
    AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- Types ---
type PaymentStatus = 'pending_verification' | 'verified' | 'invalid' | 'failed';
type FulfillmentStatus = 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
    id: number;
    title: string;
    unit_price: number;
    weight: number;
    quantity: number;
    image_url?: string;
}

interface Order {
    id: number;
    order_number: string;
    created_at: string;
    customer_name: string;
    customer_phone: string;
    shipping_address: {
        full_name: string;
        phone: string;
        address_line: string;
        barangay: string;
        city: string;
        province: string;
        region: string;
    };
    items: OrderItem[];
    subtotal: number;
    promotions_discount: number;
    bulky_surcharge: number;
    regional_shipping_fee: number;
    grand_total: number;
    payment_status: PaymentStatus;
    fulfillment_status: FulfillmentStatus;
    gcash_sender_number?: string;
    gcash_reference_number?: string;
}

// --- Mock Data ---
const MOCK_ORDERS: Order[] = [
    {
        id: 1,
        order_number: 'ORD-20261010-001',
        created_at: '2026-10-10T08:30:00Z',
        customer_name: 'Juan Dela Cruz',
        customer_phone: '09171234567',
        shipping_address: {
            full_name: 'Juan Dela Cruz',
            phone: '09171234567',
            address_line: '123 Rizal St.',
            barangay: 'Brgy. San Lorenzo',
            city: 'Makati City',
            province: 'Metro Manila',
            region: 'NCR'
        },
        items: [
            { id: 101, title: 'Shimano Stella SW', unit_price: 45000, weight: 650, quantity: 1 },
            { id: 102, title: 'PowerPro Braided Line 30lb', unit_price: 1500, weight: 150, quantity: 2 }
        ],
        subtotal: 48000,
        promotions_discount: 0,
        bulky_surcharge: 0,
        regional_shipping_fee: 150,
        grand_total: 48150,
        payment_status: 'pending_verification',
        fulfillment_status: 'unfulfilled',
        gcash_sender_number: '09171234567',
        gcash_reference_number: '1234567890ABC'
    },
    {
        id: 2,
        order_number: 'ORD-20261010-002',
        created_at: '2026-10-10T09:15:00Z',
        customer_name: 'Maria Santos',
        customer_phone: '09189876543',
        shipping_address: {
            full_name: 'Maria Santos',
            phone: '09189876543',
            address_line: '456 Mango Ave.',
            barangay: 'Lahug',
            city: 'Cebu City',
            province: 'Cebu',
            region: 'Region VII'
        },
        items: [
            { id: 103, title: 'Daiwa Saltiga Rod 7ft', unit_price: 12000, weight: 1200, quantity: 1 }
        ],
        subtotal: 12000,
        promotions_discount: 500,
        bulky_surcharge: 75,
        regional_shipping_fee: 250,
        grand_total: 11825,
        payment_status: 'verified',
        fulfillment_status: 'unfulfilled',
        gcash_sender_number: '09189876543',
        gcash_reference_number: '9876543210XYZ'
    },
    {
        id: 3,
        order_number: 'ORD-20261010-003',
        created_at: '2026-10-09T14:20:00Z',
        customer_name: 'Pedro Penduko',
        customer_phone: '09223334444',
        shipping_address: {
            full_name: 'Pedro Penduko',
            phone: '09223334444',
            address_line: '789 Coconut St.',
            barangay: 'Buhangin',
            city: 'Davao City',
            province: 'Davao del Sur',
            region: 'Region XI'
        },
        items: [
            { id: 104, title: 'Rapala Magnum Lure', unit_price: 850, weight: 50, quantity: 3 }
        ],
        subtotal: 2550,
        promotions_discount: 0,
        bulky_surcharge: 0,
        regional_shipping_fee: 200,
        grand_total: 2750,
        payment_status: 'verified',
        fulfillment_status: 'fulfilled',
        gcash_sender_number: '09223334444',
        gcash_reference_number: '5556667778DEF'
    }
];

export default function AdminOrdersPage() {
    // --- State ---
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState<'All' | 'Pending GCash' | 'Verified' | 'Fulfilled'>('All');

    // Slide-over state
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

    // --- Derived Data (Stats) ---
    const pendingVerificationCount = orders.filter(o => o.payment_status === 'pending_verification').length;
    const unfulfilledCount = orders.filter(o => o.fulfillment_status === 'unfulfilled').length;
    const ordersToday = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length;
    const revenueToday = orders
        .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString() && o.payment_status === 'verified')
        .reduce((sum, order) => sum + order.grand_total, 0);

    // --- Filtering ---
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Tab filtering
            if (filterTab === 'Pending GCash' && order.payment_status !== 'pending_verification') return false;
            if (filterTab === 'Verified' && order.payment_status !== 'verified') return false;
            if (filterTab === 'Fulfilled' && order.fulfillment_status !== 'fulfilled') return false;

            // Search filtering
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesName = order.customer_name.toLowerCase().includes(query);
                const matchesPhone = order.customer_phone.includes(query);
                const matchesRef = order.gcash_reference_number?.toLowerCase().includes(query);
                const matchesOrderNo = order.order_number.toLowerCase().includes(query);
                if (!matchesName && !matchesPhone && !matchesRef && !matchesOrderNo) return false;
            }

            return true;
        });
    }, [orders, filterTab, searchQuery]);

    // --- Handlers ---
    const handleVerifyPayment = (orderId: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening modal
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: 'verified' } : o));
    };

    const handleInvalidatePayment = (orderId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: 'invalid' } : o));
    };

    const openOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsSlideOverOpen(true);
    };

    const closeSlideOver = () => {
        setIsSlideOverOpen(false);
        setTimeout(() => setSelectedOrder(null), 300); // Wait for transition
    };

    // --- Helpers ---
    const getPaymentStatusBadge = (status: PaymentStatus) => {
        switch (status) {
            case 'pending_verification':
                return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5 w-fit"><Clock className="w-3 h-3" /> Pending</span>;
            case 'verified':
                return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5 w-fit"><CheckCircle2 className="w-3 h-3" /> Verified</span>;
            case 'invalid':
                return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30 flex items-center gap-1.5 w-fit"><XCircle className="w-3 h-3" /> Invalid</span>;
            default:
                return <span className="px-2.5 py-1 rounded-full bg-greyColor/20 text-[#a6a7a6] text-[10px] font-bold uppercase tracking-wider border border-greyColor/30 flex items-center gap-1.5 w-fit">{status}</span>;
        }
    };

    const getFulfillmentStatusBadge = (status: FulfillmentStatus) => {
        switch (status) {
            case 'unfulfilled':
                return <span className="text-amber-500 font-semibold text-xs flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Unfulfilled</span>;
            case 'processing':
                return <span className="text-blue-400 font-semibold text-xs flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Processing</span>;
            case 'shipped':
                return <span className="text-indigo-400 font-semibold text-xs flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Shipped</span>;
            case 'delivered':
            case 'fulfilled':
                return <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Fulfilled</span>;
            default:
                return <span className="text-[#788ca5] font-semibold text-xs capitalize">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-[#0d131a] text-[#d9e3f4] p-6 lg:p-10 font-sans pb-24 relative overflow-x-hidden">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <Package className="w-8 h-8 text-primaryColor" />
                        Orders Management
                    </h1>
                    <p className="text-sm text-[#788ca5] mt-1">
                        Track, verify, and fulfill customer orders.
                    </p>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Pending Payments */}
                <div className="bg-[#16202c] border border-greyColor/20 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full group-hover:bg-amber-500/10 transition-colors" />
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold text-[#788ca5] uppercase tracking-wider">Pending GCash</h3>
                    </div>
                    <div className="text-3xl font-extrabold text-white">{pendingVerificationCount}</div>
                </div>

                {/* Unfulfilled Orders */}
                <div className="bg-[#16202c] border border-greyColor/20 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full group-hover:bg-blue-500/10 transition-colors" />
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                            <Package className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold text-[#788ca5] uppercase tracking-wider">Unfulfilled</h3>
                    </div>
                    <div className="text-3xl font-extrabold text-white">{unfulfilledCount}</div>
                </div>

                {/* Orders Today */}
                <div className="bg-[#16202c] border border-greyColor/20 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primaryColor/5 rounded-full group-hover:bg-primaryColor/10 transition-colors" />
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-primaryColor/10 text-primaryColor">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold text-[#788ca5] uppercase tracking-wider">Orders Today</h3>
                    </div>
                    <div className="text-3xl font-extrabold text-white">{ordersToday}</div>
                </div>

                {/* Revenue Today */}
                <div className="bg-[#16202c] border border-greyColor/20 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:bg-emerald-500/10 transition-colors" />
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold text-[#788ca5] uppercase tracking-wider">Revenue Today</h3>
                    </div>
                    <div className="text-3xl font-extrabold text-emerald-400">₱{revenueToday.toLocaleString()}</div>
                </div>
            </div>

            {/* Controls (Filters & Search) */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                {/* Tabs */}
                <div className="flex items-center gap-2 p-1.5 bg-[#121922] border border-greyColor/20 rounded-xl overflow-x-auto w-full lg:w-auto">
                    {['All', 'Pending GCash', 'Verified', 'Fulfilled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilterTab(tab as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${filterTab === tab
                                ? 'bg-primaryColor text-slate-950 shadow-sm'
                                : 'text-[#788ca5] hover:text-white hover:bg-greyColor/10'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full lg:w-96">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#788ca5]">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search name, phone, or GCash ref..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#121922] border border-greyColor/20 rounded-xl text-sm text-white placeholder-[#4e6178] focus:outline-none focus:border-primaryColor transition-colors"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="max-w-7xl mx-auto bg-[#16202c] border border-greyColor/20 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#d9e3f4] whitespace-nowrap">
                        <thead className="bg-[#121922] text-[#788ca5] uppercase tracking-wider text-[11px] font-bold border-b border-greyColor/20">
                            <tr>
                                <th className="px-6 py-4">Order # & Date</th>
                                <th className="px-6 py-4">Customer Details</th>
                                <th className="px-6 py-4">Region</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Grand Total</th>
                                <th className="px-6 py-4">GCash Ref</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-greyColor/10">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        onClick={() => openOrderDetails(order)}
                                        className="hover:bg-[#1a2533] transition-colors cursor-pointer group"
                                    >
                                        {/* Order # & Date */}
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white group-hover:text-primaryColor transition-colors">{order.order_number}</div>
                                            <div className="text-[11px] text-[#788ca5] mt-1">{new Date(order.created_at).toLocaleString()}</div>
                                        </td>

                                        {/* Customer */}
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white">{order.customer_name}</div>
                                            <div className="text-xs text-[#788ca5] mt-1">{order.customer_phone}</div>
                                        </td>

                                        {/* Region */}
                                        <td className="px-6 py-4">
                                            <div className="text-xs">{order.shipping_address.region}</div>
                                        </td>

                                        {/* Items Summary */}
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-semibold">{order.items.length} item(s)</div>
                                            <div className="text-[11px] text-[#788ca5] mt-1 max-w-[150px] truncate" title={order.items.map(i => i.title).join(', ')}>
                                                {order.items.map(i => i.title).join(', ')}
                                            </div>
                                        </td>

                                        {/* Total */}
                                        <td className="px-6 py-4">
                                            <div className="font-extrabold text-emerald-400">₱{order.grand_total.toLocaleString()}</div>
                                        </td>

                                        {/* GCash Ref */}
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs">{order.gcash_reference_number || '-'}</div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                {getPaymentStatusBadge(order.payment_status)}
                                                {getFulfillmentStatusBadge(order.fulfillment_status)}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            {order.payment_status === 'pending_verification' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={(e) => handleVerifyPayment(order.id, e)}
                                                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-xs font-bold transition-all shadow-sm"
                                                    >
                                                        Verify
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleInvalidatePayment(order.id, e)}
                                                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-xs font-bold transition-all shadow-sm"
                                                    >
                                                        Invalid
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openOrderDetails(order); }}
                                                    className="px-3 py-1.5 rounded-lg bg-greyColor/10 text-[#788ca5] hover:bg-greyColor/20 hover:text-white text-xs font-bold transition-all flex items-center justify-end gap-1.5 ml-auto"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-[#788ca5]">
                                        <div className="flex flex-col items-center gap-3">
                                            <Package className="w-10 h-10 opacity-20" />
                                            <p>No orders found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Slide-Over Modal for Order Details */}
            {isSlideOverOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={closeSlideOver}
                    />

                    {/* Slide-over panel */}
                    <div className="relative w-full max-w-xl h-full bg-[#121922] border-l border-greyColor/20 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-greyColor/20 bg-[#16202c]">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primaryColor" />
                                    Order Details
                                </h2>
                                <p className="text-xs text-[#788ca5] mt-1 font-mono">
                                    {selectedOrder?.order_number}
                                </p>
                            </div>
                            <button
                                onClick={closeSlideOver}
                                className="p-2 rounded-full hover:bg-greyColor/20 text-[#788ca5] hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        {selectedOrder && (
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                                {/* Status Overview */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-[#16202c] border border-greyColor/20">
                                        <div className="text-[11px] font-bold text-[#788ca5] uppercase tracking-wider mb-2">Payment Status</div>
                                        {getPaymentStatusBadge(selectedOrder.payment_status)}
                                    </div>
                                    <div className="p-4 rounded-xl bg-[#16202c] border border-greyColor/20">
                                        <div className="text-[11px] font-bold text-[#788ca5] uppercase tracking-wider mb-2">Fulfillment</div>
                                        {getFulfillmentStatusBadge(selectedOrder.fulfillment_status)}
                                    </div>
                                </div>

                                {/* GCash Details */}
                                <div className="bg-[#16202c] border border-greyColor/20 rounded-xl overflow-hidden">
                                    <div className="px-4 py-3 border-b border-greyColor/20 bg-[#1a2533] flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-primaryColor" />
                                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">GCash Transfer</h3>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-[#788ca5] text-xs mb-1">Sender Number</div>
                                            <div className="font-bold text-white">{selectedOrder.gcash_sender_number || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[#788ca5] text-xs mb-1">Reference Number</div>
                                            <div className="font-bold font-mono text-primaryColor bg-primaryColor/10 px-2 py-1 rounded w-fit">{selectedOrder.gcash_reference_number || '-'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="bg-[#16202c] border border-greyColor/20 rounded-xl overflow-hidden">
                                    <div className="px-4 py-3 border-b border-greyColor/20 bg-[#1a2533] flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-400" />
                                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">J&T Shipping Address</h3>
                                    </div>
                                    <div className="p-4 text-sm space-y-1">
                                        <div className="font-bold text-white text-base">{selectedOrder.shipping_address.full_name}</div>
                                        <div className="text-primaryColor font-medium mb-2">{selectedOrder.shipping_address.phone}</div>
                                        <div className="text-[#d9e3f4]">{selectedOrder.shipping_address.address_line}</div>
                                        <div className="text-[#d9e3f4]">{selectedOrder.shipping_address.barangay}, {selectedOrder.shipping_address.city}</div>
                                        <div className="text-[#d9e3f4]">{selectedOrder.shipping_address.province}, {selectedOrder.shipping_address.region}</div>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="bg-[#16202c] border border-greyColor/20 rounded-xl overflow-hidden">
                                    <div className="px-4 py-3 border-b border-greyColor/20 bg-[#1a2533] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-emerald-400" />
                                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Order Items</h3>
                                        </div>
                                        <span className="text-xs font-bold text-[#788ca5]">{selectedOrder.items.length} items</span>
                                    </div>
                                    <div className="divide-y divide-greyColor/10">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="p-4 flex gap-4">
                                                <div className="w-12 h-12 rounded bg-[#0d131a] border border-greyColor/20 flex items-center justify-center shrink-0">
                                                    <Package className="w-6 h-6 text-[#788ca5]" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-white text-sm">{item.title}</div>
                                                    <div className="text-xs text-[#788ca5] mt-1 flex items-center gap-3">
                                                        <span>Weight: {item.weight}g</span>
                                                        <span>Qty: <span className="text-white font-bold">{item.quantity}</span></span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-white text-sm">₱{(item.unit_price * item.quantity).toLocaleString()}</div>
                                                    <div className="text-xs text-[#788ca5] mt-1">₱{item.unit_price.toLocaleString()} each</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Financial Breakdown */}
                                <div className="bg-[#16202c] border border-greyColor/20 rounded-xl p-5 space-y-3 text-sm">
                                    <div className="flex justify-between items-center text-[#d9e3f4]">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">₱{selectedOrder.subtotal.toLocaleString()}</span>
                                    </div>
                                    {selectedOrder.promotions_discount > 0 && (
                                        <div className="flex justify-between items-center text-rose-400">
                                            <span>Promotions Discount</span>
                                            <span className="font-semibold">-₱{selectedOrder.promotions_discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-[#d9e3f4]">
                                        <span>Regional Shipping Fee</span>
                                        <span className="font-semibold">₱{selectedOrder.regional_shipping_fee.toLocaleString()}</span>
                                    </div>
                                    {selectedOrder.bulky_surcharge > 0 && (
                                        <div className="flex justify-between items-center text-amber-500">
                                            <span>Bulky Item Surcharge</span>
                                            <span className="font-semibold">+₱{selectedOrder.bulky_surcharge.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-greyColor/20 flex justify-between items-center mt-2">
                                        <span className="text-base font-bold text-white">Grand Total</span>
                                        <span className="text-xl font-extrabold text-emerald-400">₱{selectedOrder.grand_total.toLocaleString()}</span>
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* Footer Actions if needed */}
                        {selectedOrder?.payment_status === 'pending_verification' && (
                            <div className="p-6 border-t border-greyColor/20 bg-[#16202c] flex items-center gap-4">
                                <button
                                    onClick={(e) => { handleInvalidatePayment(selectedOrder.id, e); closeSlideOver(); }}
                                    className="flex-1 px-4 py-3 rounded-xl border border-rose-500/30 text-rose-400 font-bold hover:bg-rose-500/10 transition-colors"
                                >
                                    Mark Invalid
                                </button>
                                <button
                                    onClick={(e) => { handleVerifyPayment(selectedOrder.id, e); closeSlideOver(); }}
                                    className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-slate-900 font-extrabold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                                >
                                    Verify Payment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
