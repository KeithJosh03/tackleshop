import CheckoutClient from './CheckoutClient';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, ShieldCheck, Lock } from 'lucide-react';

export default function CheckoutPage() {
    return (
        <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40 mb-6">
                <Link href="/" className="hover:text-ma-primary transition-colors">
                    Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                <Link href="/cart" className="hover:text-ma-primary transition-colors">
                    Tackle Cart
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                <span className="text-ma-primary">Checkout</span>
            </nav>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2.5">
                        <Lock className="w-3 h-3" />
                        256-Bit SSL Encrypted Checkout
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                        Order Finalization
                    </h1>
                </div>

                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#a28d7e] hover:text-[#ffc49a] transition-colors bg-[#141A1F] border border-white/10 px-4 py-2.5 rounded-xl shadow-md hover:border-[#ffc49a]/40 w-fit"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Tackle Cart</span>
                </Link>
            </div>

            <CheckoutClient />
        </main>
    );
}
