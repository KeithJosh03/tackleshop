'use client';
import { useState } from 'react';

import DashboardHeader from './DashboardHeader';
import DashboardLayoutComponent from './layout';
import DashboardLayoutMain from './DashboardLayoutMain';

import DashboardBrand from './DashboardBrand';
import DashboardCategory from './DashboardCategory';
import DashboardType from './DashboardType';

import { usePathname } from 'next/navigation';

export default function DashBoard() {
    const [dashboard, setdashboard] = useState()

    return (
        <h1>Hello</h1>
        // <DashboardHeader />
        // <DashboardLayoutMain /> 
        // <DashboardBrand />
        // <DashboardCategory />
        // <DashboardType /> 
    )
}
