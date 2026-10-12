import React, { ButtonHTMLAttributes } from 'react';

export interface CustomPrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isSelected?: boolean;
}

export default function CustomPrimaryButton({
    children,
    isSelected = false,
    className = '',
    disabled,
    ...props
}: CustomPrimaryButtonProps) {
    const stateStyles = disabled
        ? 'opacity-40 cursor-not-allowed border-dashed border-zinc-600 bg-zinc-900/30 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900/30 pointer-events-none'
        : isSelected
            ? 'bg-ma-primary text-ma-on-primary border-ma-primary shadow-[0_4px_14px_rgba(255,196,154,0.3)] scale-[1.02]'
            : 'bg-transparent text-ma-on-surface border-white/15 hover:border-ma-primary/60 hover:bg-white/5';

    return (
        <button
            {...props}
            disabled={disabled}
            className={`relative flex items-center justify-center gap-3 px-5 py-3 rounded-lg text-sm font-bold transition-all duration-300 overflow-hidden group border ${stateStyles} ${className}`}
        >
            {children}
        </button>
    );
}
