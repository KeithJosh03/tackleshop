'use client';

import React from 'react';
import Link from 'next/link';
import { worksans, inter } from '@/types/fonts';

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA — Replace with real API calls when backend endpoints are ready
   ═══════════════════════════════════════════════════════════════════════════ */

const kpiCards = [
  {
    label: 'TOTAL PRODUCTS',
    value: '1,284',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    change: '+12%',
    changeType: 'up' as const,
    active: false,
  },
  {
    label: 'REVENUE',
    value: '₱42.5k',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    change: '+8.4%',
    changeType: 'up' as const,
    active: true,
  },
  {
    label: 'ACTIVE ORDERS',
    value: '156',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    change: 'Stable',
    changeType: 'neutral' as const,
    active: false,
  },
  {
    label: 'TOP BRAND',
    value: 'Shimano',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
    change: '324 items sold',
    changeType: 'muted' as const,
    active: false,
  },
  {
    label: 'LOW STOCK',
    value: '12 SKUs',
    icon: (
      <svg className="w-5 h-5 text-[#ffb4ab]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    change: 'Action Required',
    changeType: 'error' as const,
    active: false,
  },
];

const recentOrders = [
  { id: '#ORD-2891', customer: 'Miguel de la Cruz', location: 'Manila, PH', items: '3x Stella SW-C', total: '₱124,500', status: 'PROCESSING' },
  { id: '#ORD-2890', customer: 'Sarah Jenkins', location: 'Cebu City', items: '1x G.Loomis Rod', total: '₱18,200', status: 'SHIPPED' },
  { id: '#ORD-2889', customer: 'Artur Volkov', location: 'Davao', items: '12x Rapala Lures', total: '₱4,320', status: 'PENDING' },
];

const revenueData = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 62 },
  { day: 'Wed', value: 55 },
  { day: 'Thu', value: 78, isMax: true },
  { day: 'Fri', value: 72 },
];

/* ═══════════════════════════════════════════════════════════════════════════ */

const statusColors: Record<string, string> = {
  PENDING: 'bg-[#ffdcbb]/10 text-[#dcac7a] border-[#614017]/30',
  PROCESSING: 'bg-[#212b37] text-[#a6a7a6] border-[#303a47]',
  SHIPPED: 'bg-[#1a2e1d] text-emerald-400 border-emerald-500/30', // Custom green
};

export default function DashboardOverviewClient() {
  const maxRevenue = Math.max(...revenueData.map((d) => d.value));

  return (
    <div className={`${worksans.className} flex flex-col gap-y-6`}>
      {/* ═══ KPI STAT CARDS ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className={`bg-[#121c28] border rounded-xl p-5 flex flex-col hover:border-[#a18d7f]/40 transition-colors duration-300 relative ${
              card.active ? 'border-[#ffb77c]/50' : 'border-[#2c3542]'
            }`}
          >
            {card.active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-[#ffb77c] rounded-r-md"></div>
            )}
            
            <div className="flex items-start justify-between mb-4">
              <p className={`${inter.className} text-[#a6a7a6] text-[11px] font-semibold uppercase tracking-wider`}>{card.label}</p>
              <div className={`${card.changeType === 'error' ? 'text-[#ffb4ab]' : 'text-[#d9c2b3]'}`}>
                {card.icon}
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-[#d9e3f4] text-2xl font-extrabold tracking-tight leading-none mb-2">{card.value}</p>
              
              <div className="mt-auto">
                {card.changeType === 'up' && (
                  <span className={`${inter.className} text-[11px] font-bold text-emerald-400 flex items-center gap-x-1`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                    {card.change}
                  </span>
                )}
                {card.changeType === 'neutral' && (
                  <span className={`${inter.className} text-[11px] font-bold text-[#e89347] flex items-center gap-x-1`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                    {card.change}
                  </span>
                )}
                {card.changeType === 'error' && (
                  <span className={`${inter.className} text-[11px] font-bold text-[#ffb4ab]`}>
                    {card.change}
                  </span>
                )}
                {card.changeType === 'muted' && (
                  <span className={`${inter.className} text-[11px] font-medium text-[#a6a7a6]`}>
                    {card.change}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ MAIN CONTENT: ORDERS + REVENUE ═══════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Recent Orders (2/3 width) ── */}
        <div className="lg:col-span-2 bg-[#121c28] border border-[#2c3542] rounded-xl flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-[#212b37]">
            <h2 className="text-[#d9e3f4] text-lg font-bold tracking-tight">Recent Orders</h2>
            <button className={`${inter.className} text-[#ffb77c] text-sm font-semibold hover:underline underline-offset-2`}>
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className={`${inter.className} w-full text-sm`}>
              <thead>
                <tr className="border-b border-[#212b37]">
                  <th className="text-left text-[#a6a7a6] text-[10px] font-semibold uppercase tracking-wider p-4">Order ID</th>
                  <th className="text-left text-[#a6a7a6] text-[10px] font-semibold uppercase tracking-wider p-4">Customer</th>
                  <th className="text-left text-[#a6a7a6] text-[10px] font-semibold uppercase tracking-wider p-4">Items</th>
                  <th className="text-left text-[#a6a7a6] text-[10px] font-semibold uppercase tracking-wider p-4">Status</th>
                  <th className="text-right text-[#a6a7a6] text-[10px] font-semibold uppercase tracking-wider p-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#212b37]/50 last:border-b-0 hover:bg-[#16202c] transition-colors">
                    <td className="p-4 text-[#e89347] font-mono text-xs">{order.id}</td>
                    <td className="p-4">
                      <p className="text-[#d9e3f4] font-medium text-sm">{order.customer}</p>
                      <p className="text-[#a6a7a6] text-xs mt-0.5">{order.location}</p>
                    </td>
                    <td className="p-4 text-[#d9e3f4] text-sm">{order.items}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center justify-center text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${statusColors[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-[#d9e3f4] font-bold text-sm">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Revenue Growth (1/3 width) ── */}
        <div className="bg-[#121c28] border border-[#2c3542] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[#d9e3f4] text-lg font-bold tracking-tight">Revenue Growth</h2>
          </div>

          {/* Bar Chart */}
          <div className="flex-1 flex flex-col justify-end min-h-[250px]">
            <div className="flex items-end justify-between gap-x-3 px-1 h-full pb-4 border-b border-[#212b37]">
              {revenueData.map((data) => {
                const barHeight = Math.round((data.value / maxRevenue) * 100);
                return (
                  <div key={data.day} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ease-out ${
                        data.isMax ? 'bg-[#a18d7f]' : 'bg-[#303a47]'
                      }`}
                      style={{ height: `${barHeight}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between px-2 pt-3">
              {revenueData.map((data) => (
                <span key={data.day} className={`${inter.className} text-[11px] text-[#a6a7a6] font-medium`}>{data.day}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
