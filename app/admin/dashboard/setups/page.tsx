'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { worksans, inter } from '@/types/fonts';
import { getSetups, toggleSetupStatus, deleteSetup } from '@/lib/api/bundleService';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import {
    Plus,
    Search,
    Eye,
    EyeOff,
    Pencil,
    Trash2,
    CheckCircle2,
    AlertCircle,
    X,
    Layers,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function SetupsPage() {
    const { data: session } = useSession();
    const token = session?.accessToken || '';

    const [setups, setSetups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Status Toast
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setStatusMessage(message);
        setStatusType(type);
        setTimeout(() => {
            setStatusMessage(null);
            setStatusType(null);
        }, 5000);
    };

    useEffect(() => {
        if (token) {
            fetchSetups(token);
        }
    }, [token]);

    const fetchSetups = async (currentToken: string) => {
        setIsLoading(true);
        try {
            const res = await getSetups(currentToken);
            if (res.status) {
                setSetups(res.data.data || []);
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch setups.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        // Optimistic UI update
        setSetups(prev => prev.map(s => s.setup_id === id ? { ...s, is_published: !currentStatus } : s));
        try {
            const res = await toggleSetupStatus(id, token);
            if (res.status) {
                showToast(`Setup ${res.is_published ? 'published' : 'unpublished'} successfully`, 'success');
            } else {
                throw new Error('Failed');
            }
        } catch (error) {
            // Revert
            setSetups(prev => prev.map(s => s.setup_id === id ? { ...s, is_published: currentStatus } : s));
            showToast('Failed to toggle setup status', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this setup?')) return;
        try {
            const res = await deleteSetup(id, token);
            if (res.status) {
                setSetups(prev => prev.filter(s => s.setup_id !== id));
                showToast('Setup deleted successfully', 'success');
            }
        } catch (error) {
            showToast('Failed to delete setup', 'error');
        }
    };

    const filteredSetups = setups.filter(setup =>
        setup.bundle_title?.toLowerCase().includes(search.toLowerCase()) ||
        setup.sku?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={`${worksans.className} flex flex-col gap-y-6 text-[#d9e3f4] h-full p-6 lg:p-10 font-sans pb-24 min-h-screen`}>
            {/* ── HEADER ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                        <Layers className="w-8 h-8 text-primaryColor" />
                        Setups & Bundles
                    </h1>
                    <p className={`${inter.className} text-[#a6a7a6] text-sm mt-1`}>
                        Manage your setup bundles, pricing, and configurations.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                    <Link href="/admin/dashboard/setups/categories" className="py-2.5 px-5 rounded-xl border border-[#303a47] bg-[#16202c] hover:bg-[#212b37] text-white text-sm font-semibold transition-colors flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Categories
                    </Link>
                    <Link href="/admin/dashboard/setups/build-setup">
                        <CustomPrimaryButton isSelected className="py-2.5 px-5 flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Build New Setup
                        </CustomPrimaryButton>
                    </Link>
                </div>
            </div>

            {/* ── SEARCH & FILTER ── */}
            <div className="bg-[#121c28] border border-[#2c3542] rounded-xl p-4 flex flex-col gap-y-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a6a7a6]" />
                    <input
                        type="text"
                        placeholder="Search by Bundle Title or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`${inter.className} w-full bg-[#0a1420] border border-[#303a47] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ffb77c]/50 transition-colors`}
                    />
                </div>
            </div>

            {/* ── LISTINGS ── */}
            <div className="bg-[#121c28] border border-[#2c3542] rounded-xl flex flex-col flex-1 overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 p-5 border-b border-[#2c3542] items-center bg-[#16202c]">
                    <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider">Bundle Title & SKU</div>
                    <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider">Pricing Type</div>
                    <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider">Price</div>
                    <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider">Status</div>
                    <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider text-right pr-4">Actions</div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-[#a6a7a6] animate-pulse">Loading setups...</div>
                    ) : filteredSetups.length === 0 ? (
                        <div className="p-8 text-center text-[#a6a7a6]">No setups found. Create your first bundle!</div>
                    ) : (
                        filteredSetups.map((setup) => (
                            <div key={setup.setup_id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 p-5 items-center border-b border-[#212b37] last:border-b-0 hover:bg-[#16202c]/50 transition-colors">
                                <div className="flex flex-col min-w-0">
                                    <span className="text-white font-bold text-sm truncate">{setup.bundle_title}</span>
                                    <span className="text-[#a6a7a6] text-xs font-mono mt-0.5">{setup.sku}</span>
                                </div>
                                <div>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#212b37] border border-[#303a47] text-[#d9e3f4] text-[11px] font-semibold uppercase tracking-wider">
                                        {setup.pricing_type}
                                    </span>
                                </div>
                                <div className={`${inter.className} text-white font-medium text-sm`}>
                                    ₱{parseFloat(setup.bundle_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${setup.is_published ? 'bg-[#1a2e1d] text-emerald-400 border border-emerald-500/20' : 'bg-[#2e1a1a] text-[#ffb4ab] border border-[#ffb4ab]/20'}`}>
                                        {setup.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-end gap-3 pr-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleToggleStatus(setup.setup_id, setup.is_published); }}
                                        className={`p-1 transition-colors ${setup.is_published ? 'text-green-400 hover:text-red-400' : 'text-red-400 hover:text-green-400'}`}
                                        title={setup.is_published ? "Unpublish Setup" : "Publish Setup"}
                                    >
                                        {setup.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-80" />}
                                    </button>
                                    <Link
                                        href={`/admin/dashboard/setups/edit-setup/${setup.setup_id}`}
                                        className="text-[#a6a7a6] hover:text-[#ffb77c] transition-colors p-1"
                                        title="Edit Setup"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(setup.setup_id); }}
                                        className="text-[#a6a7a6] hover:text-[#ffb4ab] transition-colors p-1"
                                        title="Delete Setup"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── Toast ── */}
            <AnimatePresence>
                {statusMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${statusType === 'success' ? 'bg-[#1a2e1d] border-emerald-500/30' : 'bg-[#2e1a1a] border-[#ffb4ab]/30'}`}
                    >
                        {statusType === 'success' ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-[#ffb4ab] shrink-0" />
                        )}
                        <div className="flex flex-col">
                            <span className={`text-sm font-bold ${statusType === 'success' ? 'text-emerald-400' : 'text-[#ffb4ab]'} uppercase tracking-wider`}>
                                {statusType === 'success' ? 'Success' : 'Error'}
                            </span>
                            <p className="text-white text-sm font-medium mt-0.5">{statusMessage}</p>
                        </div>
                        <button onClick={() => setStatusMessage(null)} className="ml-4 text-[#a6a7a6] hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
