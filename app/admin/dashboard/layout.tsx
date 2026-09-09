'use client';
import { worksans, inter } from '@/types/fonts';
import DashboardHeader from '@/components/adminUI/DashboardHeader';
import DashboardSidebar from '@/components/adminUI/DashboardSidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayoutComponent({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ma-background">
                <div className="w-8 h-8 rounded-full border-2 border-ma-primary border-t-transparent animate-spin" />
            </div>
        );
    }
    return (
        <div className={`${worksans.className} flex h-screen overflow-hidden bg-ma-background`}>
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A0E0F]">
                {/* Top Header */}
                <DashboardHeader />

                {/* Scrollable Content */}
                <main className='flex-1 w-full overflow-y-auto scroller-hide'>
                    <div className='max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-y-2 min-h-full'>
                        {children}

                        {/* ── Admin Footer ── */}
                        <footer className='w-full border-t border-greyColor/20 mt-auto pt-6 pb-2'>
                            <div className='flex flex-col sm:flex-row items-center justify-between gap-y-2'>
                                <div className={`${inter.className} flex items-center gap-x-3 text-[#d9e3f4]/70 text-[13px]`}>
                                    <span>© 2024 TackleShop Admin. System Status: <span className="text-primaryColor font-bold">Optimal</span></span>
                                </div>
                                <div className={`${inter.className} flex items-center gap-x-6 text-[#d9e3f4]/70 text-[13px]`}>
                                    <span className='hover:text-white cursor-pointer transition-colors'>Documentation</span>
                                    <span className='hover:text-white cursor-pointer transition-colors'>API Reference</span>
                                    <span className='hover:text-white cursor-pointer transition-colors'>Support</span>
                                </div>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
}
