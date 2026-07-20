'use client';

import { FieldError } from './FieldError';
import { Bold, Italic, List, Link as LinkIcon } from 'lucide-react';

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
        <div className="bg-[#16202c] border border-[#212b37] rounded-lg overflow-hidden focus-within:border-[#ffb77c]/50 focus-within:ring-1 focus-within:ring-[#ffb77c]/50 transition-all">
            <button
                type='button'
                className='w-full flex items-center justify-between px-4 py-3 transition-colors duration-150 hover:bg-[#212b37]'
                style={{ background: isOpen ? '#212b37' : 'transparent' }}
                onClick={onToggle}
            >
                <div className='flex items-center gap-2'>
                    {icon}
                    <span className='text-sm font-bold text-[#d9e3f4] tracking-tight'>
                        {label}
                        {required && <span className='text-[#ffb4ab] ml-1'>*</span>}
                    </span>
                </div>
                <div className='flex items-center gap-3'>
                    {value?.length ? (
                        <span className='text-xs text-[#a6a7a6]'>{value.length} chars</span>
                    ) : null}
                    <svg
                        className={`w-4 h-4 text-[#a6a7a6] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'
                    >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className='border-t border-[#212b37]'>
                    <div className="flex items-center gap-1 border-b border-[#212b37] bg-[#121c28] p-1.5 px-3">
                        <button type="button" className="p-1.5 hover:bg-[#2c3542] rounded text-[#a6a7a6] hover:text-[#d9e3f4] transition-colors"><Bold className="w-4 h-4" /></button>
                        <button type="button" className="p-1.5 hover:bg-[#2c3542] rounded text-[#a6a7a6] hover:text-[#d9e3f4] transition-colors"><Italic className="w-4 h-4" /></button>
                        <button type="button" className="p-1.5 hover:bg-[#2c3542] rounded text-[#a6a7a6] hover:text-[#d9e3f4] transition-colors"><List className="w-4 h-4" /></button>
                        <button type="button" className="p-1.5 hover:bg-[#2c3542] rounded text-[#a6a7a6] hover:text-[#d9e3f4] transition-colors"><LinkIcon className="w-4 h-4" /></button>
                    </div>
                    <textarea
                        rows={4}
                        placeholder={placeholder}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className='w-full bg-transparent px-4 py-3 text-sm text-[#d9e3f4] focus:outline-none resize-none placeholder:text-[#a6a7a6]/50'
                    />
                </div>
            )}
            {error && <div className='px-4 pb-2'><FieldError msg={error} /></div>}
        </div>
    );
}
