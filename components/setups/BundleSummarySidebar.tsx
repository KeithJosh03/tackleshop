'use client';

import React from 'react';
import { Sparkles, Calendar, Tag, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

interface BundleSummarySidebarProps {
  totalRetailValue: number;
  pricingType: 'fixed' | 'calculated';
  fixedPrice: number;
  discountPercentage: number;
  bundlePrice: number;
  savingsAmount: number;
  savingsPercentage: number;
  isPublished: boolean;
  setIsPublished: (val: boolean) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  itemCount: number;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function BundleSummarySidebar({
  totalRetailValue,
  pricingType,
  fixedPrice,
  discountPercentage,
  bundlePrice,
  savingsAmount,
  savingsPercentage,
  isPublished,
  setIsPublished,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  itemCount,
  onSubmit,
  isSubmitting = false,
}: BundleSummarySidebarProps) {
  return (
    <div className="space-y-6">
      {/* Live Price & Savings Card */}
      <div className="bg-ma-surface-container/50 border-2 border-greyColor/20 rounded-2xl p-6 shadow-sm backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primaryColor/5 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="flex items-center gap-2 mb-4 text-[#788ca5] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-primaryColor" />
          <span>Live Pricing Summary</span>
        </div>

        <div className="space-y-4">
          {/* Individual Retail Total */}
          <div className="flex justify-between items-center text-sm py-2 border-b border-greyColor/15">
            <span className="text-[#9cb3cf]">Total Retail Value</span>
            <span className="font-semibold text-[#d9e3f4] line-through text-base">
              ${totalRetailValue.toFixed(2)}
            </span>
          </div>

          {/* Pricing Strategy Note */}
          <div className="flex justify-between items-center text-xs text-[#788ca5]">
            <span>Strategy</span>
            <span className="capitalize px-2 py-0.5 rounded bg-greyColor/10 text-[#a9b7cd] font-medium">
              {pricingType === 'fixed' ? 'Fixed Bundle Price' : `${discountPercentage}% Category Off`}
            </span>
          </div>

          {/* Offer Price */}
          <div className="bg-[#121922]/80 border border-greyColor/20 rounded-xl p-4 flex flex-col gap-1">
            <span className="text-xs text-[#788ca5] font-medium">Bundle Offer Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                ${bundlePrice.toFixed(2)}
              </span>
              <span className="text-xs text-[#788ca5]">USD</span>
            </div>
          </div>

          {/* Customer Savings Highlight */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-emerald-400/80 font-medium">Customer Savings</div>
              <div className="text-sm font-bold text-emerald-400">
                Save ${savingsAmount.toFixed(2)} ({savingsPercentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion & Status Controls */}
      <div className="bg-ma-surface-container/50 border-2 border-greyColor/20 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-[#d9e3f4] flex items-center gap-2">
          <Clock className="w-4 h-4 text-primaryColor" />
          <span>Publish & Schedule</span>
        </h3>

        {/* Publish Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#121922] border border-greyColor/20">
          <div>
            <div className="text-sm font-medium text-[#d9e3f4]">Bundle Status</div>
            <div className="text-xs text-[#788ca5]">
              {isPublished ? 'Visible in store catalog' : 'Saved as private draft'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublished ? 'bg-primaryColor' : 'bg-greyColor/40'
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublished ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[#9cb3cf] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#788ca5]" /> Promotion Start Date (Optional)
            </label>
            {startDate && (
              <button
                type="button"
                onClick={() => setStartDate('')}
                className="text-[10px] text-primaryColor hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 bg-[#16202c] border border-greyColor/30 rounded-xl text-sm text-[#d9e3f4] focus:outline-none focus:border-primaryColor"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[#9cb3cf] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#788ca5]" /> Promotion End Date (Optional)
            </label>
            {endDate && (
              <button
                type="button"
                onClick={() => setEndDate('')}
                className="text-[10px] text-primaryColor hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 bg-[#16202c] border border-greyColor/30 rounded-xl text-sm text-[#d9e3f4] focus:outline-none focus:border-primaryColor"
          />
        </div>
      </div>

      {/* Action Submit Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || itemCount === 0}
        className="w-full py-4 px-6 rounded-2xl bg-primaryColor text-slate-950 font-bold text-base hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primaryColor/10 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <span>Creating Bundle...</span>
        ) : (
          <>
            <span>Save & Publish Setup</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
