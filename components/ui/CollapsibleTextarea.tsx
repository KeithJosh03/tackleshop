'use client';

import { FieldError } from '../ProductContentInputs';

export interface CollapsibleTextareaProps {
    label: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    value: string | null;
    placeholder: string;
    onChange: (value: string) => void;
    required?: boolean;
    error?: string;
}

export default function CollapsibleTextarea({
    label,
    icon,
    isOpen,
    onToggle,
    value,
    placeholder,
    onChange,
    required,
    error,
}: CollapsibleTextareaProps) {
    return (
        <div className='rounded-lg border border-greyColor overflow-hidden'>
            <button
                type='button'
                className='w-full flex items-center justify-between px-4 py-3 transition-colors duration-150'
                style={{ background: isOpen ? 'rgba(232,147,71,0.08)' : 'transparent' }}
                onClick={onToggle}
            >
                <div className='flex items-center gap-2'>
                    {icon}
                    <span className='text-sm font-bold text-primaryColor uppercase tracking-wider'>
                        {label}
                        {required && <span className='text-red-400 ml-1'>*</span>}
                    </span>
                </div>
                <div className='flex items-center gap-3'>
                    {value?.length ? (
                        <span className='text-xs text-secondary'>{value.length} chars</span>
                    ) : null}
                    <svg
                        className={`w-4 h-4 text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'
                    >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className='border-t border-greyColor'>
                    <textarea
                        rows={7}
                        placeholder={placeholder}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className='w-full bg-transparent text-sm text-primaryColor placeholder:text-secondary p-4 resize-none outline-none'
                    />
                </div>
            )}
            {error && <div className='px-4 pb-2'><FieldError msg={error} /></div>}
        </div>
    );
}
