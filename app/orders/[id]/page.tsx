import Link from 'next/link';
import { CheckCircle2, ChevronRight, Package, CreditCard, Clock } from 'lucide-react';

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
    return (
        <main className="min-h-screen pt-32 pb-16 px-4 sm:px-8 max-w-3xl mx-auto">
            <div className="bg-ma-surface-container-low rounded-3xl p-8 sm:p-12 border border-white/5 shadow-2xl flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-widest mb-3">
                    Order Placed!
                </h1>
                
                <p className="text-white/60 mb-8 max-w-md text-sm sm:text-base">
                    Thank you for your order! Your order ID is <span className="text-ma-primary font-bold">#{params.id}</span>. We are currently verifying your GCash payment.
                </p>

                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
                    <div className="bg-[#11161d] p-4 rounded-xl border border-white/5 flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
                        <CreditCard className="w-5 h-5 text-ma-primary" />
                        <div>
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Step 1</div>
                            <div className="text-sm font-bold text-white">Payment Verification</div>
                        </div>
                    </div>
                    <div className="bg-[#11161d] p-4 rounded-xl border border-white/5 flex flex-col items-center sm:items-start text-center sm:text-left gap-2 opacity-50">
                        <Package className="w-5 h-5 text-ma-primary" />
                        <div>
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Step 2</div>
                            <div className="text-sm font-bold text-white">Fulfillment</div>
                        </div>
                    </div>
                    <div className="bg-[#11161d] p-4 rounded-xl border border-white/5 flex flex-col items-center sm:items-start text-center sm:text-left gap-2 opacity-50">
                        <Clock className="w-5 h-5 text-ma-primary" />
                        <div>
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Step 3</div>
                            <div className="text-sm font-bold text-white">Shipping</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Link 
                        href="/products" 
                        className="flex-1 bg-ma-primary text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-ma-primary/90 transition-all text-sm flex items-center justify-center"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    );
}
