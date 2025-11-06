'use client';
import { worksans } from '@/types/fonts'
import DashboardHeader from '../components/DashboardHeader';
import DashboardLayoutMain from '../components/DashboardLayoutMain';
    

export default function DashboardLayoutComponent({ children } : {children:React.ReactNode}) {
    return (
    <div className={`${worksans.className} flex flex-row px-30 py-40 gap-x-2 w-full h-screen justify-items-center`}>
        <DashboardHeader />
        <DashboardLayoutMain>
        {children}
        </DashboardLayoutMain>
    </div>
    )
}
