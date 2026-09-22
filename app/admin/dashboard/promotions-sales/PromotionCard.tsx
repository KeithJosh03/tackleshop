// components/promotions/PromotionCard.tsx
import React from 'react';
import { Promotion } from '@/types/promotionsType';
import { Tag, Calendar, Edit2, Trash2 } from 'lucide-react';

interface PromotionCardProps {
    promotion: Promotion;
    onEdit?: (promotion: Promotion) => void;
    onDelete?: (id: string | number) => void;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({
    promotion,
    onEdit,
    onDelete,
}) => {
    // Status badge styling helper
    const getStatusBadge = (status: Promotion['status']) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'SCHEDULED':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'EXPIRED':
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
            default:
                return 'bg-zinc-800 text-zinc-300 border-zinc-700';
        }
    };

    return (
        <div className="bg-[#121417] border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 flex flex-col justify-between gap-4 transition-all duration-200 shadow-md">
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span
                            className={`px-2.5 py-0.5 text-[10px] font-bold tracking-wider rounded-full border ${getStatusBadge(
                                promotion.status
                            )}`}
                        >
                            {promotion.status}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium bg-zinc-800/80 px-2 py-0.5 rounded">
                            {promotion.applyTo}
                        </span>
                    </div>
                    <h3 className="text-base font-semibold text-zinc-100">{promotion.name}</h3>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(promotion)}
                            className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(promotion.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Value Badge */}
            <div className="flex items-center gap-2 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/50">
                <Tag className="w-5 h-5 text-[#f59e0b]" />
                <span className="text-lg font-bold text-zinc-100">
                    {promotion.discountType === 'PERCENTAGE'
                        ? `${promotion.discountValue}% OFF`
                        : `$${promotion.discountValue} OFF`}
                </span>
            </div>

            {/* Dates Footer */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>
                    {promotion.startDate} - {promotion.endDate}
                </span>
            </div>
        </div>
    );
};