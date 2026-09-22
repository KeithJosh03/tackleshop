import { Metadata } from 'next';
import { Suspense } from 'react';
import PromotionsSalesClient from '@/app/admin/dashboard/promotions-sales/PromotionsSalesClient';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Promotions & Sales | Admin Dashboard',
    description: 'Manage store promotions, discount campaigns, and flash sales.',
};

export default function PromotionsSalesPage() {
    return (
        <Suspense
            fallback={
                <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-primaryColor animate-spin" />
                    <p className="text-xs text-[#d9e3f4]/60 uppercase tracking-wider font-medium">
                        Loading Promotions Dashboard...
                    </p>
                </div>
            }
        >
            <PromotionsSalesClient />
        </Suspense>
    );
}