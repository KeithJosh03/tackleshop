'use client';
import { worksans } from '@/types/fonts'
import DashboardHeader from '@/components/DashboardHeader';

export default function DashboardLayoutComponent({ children } : {children:React.ReactNode}) {
    return (
    <div className={`${worksans.className} flex flex-col px-60 py-6 gap-y-2 h-screen justify-items-center items-center`}>
        <DashboardHeader />
        <main className='flex-1 w-full flex flex-col gap-y-2'>
        {children}
        </main>
    </div>
    )
}
