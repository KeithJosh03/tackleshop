'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

export interface SelectOption {
    code: string;
    name: string;
    displayName?: string;
}

interface SearchableSelectProps {
    label: string;
    name?: string;
    value: string;
    options: SelectOption[];
    placeholder?: string;
    disabledPlaceholder?: string;
    disabled?: boolean;
    required?: boolean;
    onChange: (value: string, code?: string) => void;
    helperText?: string;
}

export default function SearchableSelect({
    label,
    name,
    value,
    options,
    placeholder = 'Select an option',
    disabledPlaceholder = 'Please make previous selection first',
    disabled = false,
    required = false,
    onChange,
    helperText,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const selectId = useId();

    const selectedOption = options.find((opt) => opt.name === value || opt.code === value);
    const displayValue = selectedOption ? (selectedOption.displayName || selectedOption.name) : value;

    const filteredOptions = query.trim()
        ? options.filter((opt) => {
            const text = (opt.displayName || opt.name).toLowerCase();
            return text.includes(query.trim().toLowerCase());
        })
        : options;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setQuery('');
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (option: SelectOption) => {
        onChange(option.name, option.code);
        setIsOpen(false);
        setQuery('');
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('', '');
        setQuery('');
    };

    return (
        <div className="space-y-1.5 relative" ref={containerRef}>
            <div className="flex items-center justify-between">
                <label htmlFor={selectId} className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    {label} {required && <span className="text-ma-primary">*</span>}
                </label>
                {helperText && <span className="text-[10px] text-white/40 font-mono">{helperText}</span>}
            </div>

            {/* Hidden input for form validation if required */}
            <input
                id={selectId}
                type="text"
                name={name}
                value={value}
                required={required}
                readOnly
                tabIndex={-1}
                className="opacity-0 pointer-events-none absolute -bottom-1 left-2 h-0 w-0"
                onChange={() => { }}
            />

            {/* Trigger Button */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => {
                    if (!disabled) setIsOpen((prev) => !prev);
                }}
                className={`w-full px-4 py-3 bg-[#11161d] border rounded-xl text-sm text-left flex items-center justify-between transition-all focus:outline-none ${disabled
                    ? 'opacity-40 cursor-not-allowed border-white/5 bg-[#11161d]/50'
                    : isOpen
                        ? 'border-ma-primary shadow-[0_0_0_1px_rgba(255,196,154,0.4)]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
            >
                <span className={`truncate mr-2 ${displayValue ? 'text-white font-medium' : 'text-white/40'}`}>
                    {disabled ? disabledPlaceholder : displayValue || placeholder}
                </span>

                <div className="flex items-center gap-1.5 shrink-0 text-white/40">
                    {displayValue && !disabled && (
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={handleClear}
                            title="Clear"
                            className="p-0.5 hover:text-white hover:bg-white/10 rounded transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </span>
                    )}
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-ma-primary' : ''}`}
                    />
                </div>
            </button>

            {/* Popover Dropdown */}
            {isOpen && !disabled && (
                <div className="absolute top-[calc(100%+6px)] left-0 w-full z-50 bg-[#141a22] border border-white/15 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 flex flex-col">
                    {/* Search Field */}
                    <div className="p-2 border-b border-white/10 bg-[#0f131a] flex items-center gap-2">
                        <Search className="w-4 h-4 text-white/40 ml-2 shrink-0" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`Search ${label.toLowerCase()}...`}
                            className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none py-1"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="text-white/40 hover:text-white p-1"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Options List */}
                    <div ref={listRef} className="max-h-60 overflow-y-auto divide-y divide-white/5 py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => {
                                const isSelected = opt.name === value || opt.code === value;
                                return (
                                    <button
                                        key={opt.code || opt.name}
                                        type="button"
                                        onClick={() => handleSelect(opt)}
                                        className={`w-full px-4 py-2.5 text-sm text-left flex items-center justify-between transition-colors ${isSelected
                                            ? 'bg-ma-primary/15 text-ma-primary font-bold'
                                            : 'text-white/80 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <span className="truncate">{opt.displayName || opt.name}</span>
                                        {isSelected && <Check className="w-4 h-4 text-ma-primary shrink-0 ml-2" />}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-6 text-center text-xs text-white/40">
                                No {label.toLowerCase()} found matching &ldquo;{query}&rdquo;
                            </div>
                        )}
                    </div>

                    {/* Footer count info */}
                    <div className="px-3 py-1.5 bg-[#0f131a] border-t border-white/5 text-[10px] text-white/40 flex justify-between items-center">
                        <span>{filteredOptions.length} of {options.length} {label.toLowerCase()}(s)</span>
                        <span className="font-mono">Offline-ready</span>
                    </div>
                </div>
            )}
        </div>
    );
}
