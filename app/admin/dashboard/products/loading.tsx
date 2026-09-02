import React from 'react';
import { worksans, inter } from '@/types/fonts';

export default function Loading() {
  return (
    <div className={`${worksans?.className || ''} flex flex-col gap-y-6 text-[#d9e3f4] h-full p-6 animate-pulse`}>
      {/* ── HEADER SKELETON ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-4">
        <div>
          <div className="h-9 w-64 bg-[#212b37] rounded-lg"></div>
          <div className="h-4 w-80 bg-[#16202c] rounded mt-2"></div>
        </div>
        <div className="h-11 w-40 bg-[#ffb77c]/20 rounded-lg"></div>
      </div>

      {/* ── FILTERS SKELETON ── */}
      <div className="bg-[#121c28] border border-[#2c3542] rounded-xl p-4 flex flex-col gap-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="h-11 w-full bg-[#0a1420] border border-[#303a47] rounded-lg"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-11 w-48 bg-[#212b37] border border-[#303a47] rounded-lg"></div>
            <div className="h-11 w-48 bg-[#212b37] border border-[#303a47] rounded-lg"></div>
            <div className="h-11 w-32 bg-[#212b37] border border-[#303a47] rounded-lg"></div>
            <div className="h-11 w-11 bg-[#212b37] border border-[#303a47] rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* ── PRODUCT LIST SKELETON ── */}
      <div className="bg-[#121c28] border border-[#2c3542] rounded-xl flex flex-col flex-1 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_2fr_1fr_1fr_1.5fr_auto] gap-4 p-5 border-b border-[#2c3542] items-center bg-[#16202c]">
          <div className="h-4 w-4 bg-[#212b37] rounded"></div>
          <div className="h-4 w-24 bg-[#212b37] rounded"></div>
          <div className="h-4 w-16 bg-[#212b37] rounded"></div>
          <div className="h-4 w-20 bg-[#212b37] rounded"></div>
          <div className="h-4 w-28 bg-[#212b37] rounded"></div>
          <div className="h-4 w-16 bg-[#212b37] rounded"></div>
        </div>

        {/* Table Rows */}
        <div className="flex-1 overflow-y-auto">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="grid grid-cols-[auto_2fr_1fr_1fr_1.5fr_auto] gap-4 p-5 items-center border-b border-[#212b37]">
              <div className="h-4 w-4 bg-[#212b37] rounded"></div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-48 bg-[#212b37] rounded"></div>
                <div className="h-3 w-32 bg-[#16202c] rounded"></div>
              </div>
              <div className="h-6 w-20 bg-[#212b37] rounded"></div>
              <div className="h-4 w-16 bg-[#212b37] rounded"></div>
              <div className="flex flex-col gap-2">
                <div className="h-3 w-24 bg-[#212b37] rounded"></div>
                <div className="h-4 w-32 bg-[#16202c] rounded-full"></div>
              </div>
              <div className="flex justify-end gap-3 pr-2">
                <div className="h-4 w-4 bg-[#212b37] rounded"></div>
                <div className="h-4 w-4 bg-[#212b37] rounded"></div>
                <div className="h-4 w-4 bg-[#212b37] rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
