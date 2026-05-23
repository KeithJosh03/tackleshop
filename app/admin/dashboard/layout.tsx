'use client';
import { worksans } from '@/types/fonts'
import DashboardHeader from '@/components/DashboardHeader';

export default function DashboardLayoutComponent({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${worksans.className} flex flex-col max-w-7xl mx-auto w-full px-4 md:px-8 py-6 gap-y-2 min-h-screen`}>
            <DashboardHeader />
            <main className='flex-1 w-full flex flex-col gap-y-2'>
                {children}
            </main>
        </div>
    )
}
