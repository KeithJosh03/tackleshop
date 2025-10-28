'use client';
import { worksans } from '@/types/fonts'
import DashboardHeader from './DashboardHeader'
import DashboardLayoutMain from './DashboardLayoutMain';
    

export default function DashboardLayoutComponent({ children } : {children:React.ReactNode}) {

    return (
    <div className={`${worksans.className} flex flex-row px-26 gap-x-2 w-full`}>
        <DashboardHeader />
        <DashboardLayoutMain>
        {children}
        </DashboardLayoutMain>
    </div>
    )
}
