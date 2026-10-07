import CartClient from './CartClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CartPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h1 className="text-3xl font-black text-ma-on-surface uppercase tracking-widest">Shopping Cart</h1>

                <Link
                    href="/"
                    className="flex items-center gap-2 text-xs font-bold text-[#a28d7e] hover:text-[#ffc49a] transition-colors bg-ma-surface-container-low border border-white/10 px-4 py-2.5 rounded-xl shadow-md hover:border-[#ffc49a]/40 w-fit"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Shopping</span>
                </Link>
            </div>

            <CartClient />
        </main>
    );
}