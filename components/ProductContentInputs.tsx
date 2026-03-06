'use client';

import { useReducer } from 'react';
import { UIComponentReducer, initialUIComponent } from '@/lib/api/reDucer';

/* ─── Shared UI helpers ──────────────────────────────────────────────────── */

export function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return (
        <p className='mt-1 flex items-center gap-1 text-xs font-semibold' style={{ color: '#f87171' }}>
            <svg className='w-3 h-3 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
            </svg>
            {msg}
        </p>
    );
}

export function FieldHint({ msg }: { msg: string }) {
    return <p className='mt-1 text-xs text-secondary'>{msg}</p>;
}

export function SectionCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
    return (
        <div className='rounded-xl border border-greyColor bg-blackgroundColor'>
            <div className='flex items-center gap-3 px-5 py-3 border-b border-greyColor rounded-t-xl'
                style={{ background: 'linear-gradient(90deg,rgba(17,26,45,1) 0%,rgba(19,29,41,0.6) 100%)' }}>
                <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primaryColor text-xs font-black text-white shrink-0'>
                    {step}
                </span>
                <h2 className='text-primaryColor font-extrabold tracking-widest text-sm uppercase'>
                    {title}
                </h2>
            </div>
            <div className='p-5'>{children}</div>
        </div>
    );
}

/* ─── Props ──────────────────────────────────────────────────────────────── */

export interface ProductContentInputsProps {
    description: string | null;
    specifications: string | null;
    features: string | null;
    errors?: Record<string, string>;
    onDescriptionChange: (value: string) => void;
    onSpecificationsChange: (value: string) => void;
    onFeaturesChange: (value: string) => void;
    /** Optional: called after description changes to clear its error */
    onDescriptionErrorClear?: () => void;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ProductContentInputs({
    description,
    specifications,
    features,
    errors = {},
    onDescriptionChange,
    onSpecificationsChange,
    onFeaturesChange,
    onDescriptionErrorClear,
}: ProductContentInputsProps) {
    const initialUi: initialUIComponent = {
        descriptionUI: false,
        specificationsUI: false,
        featuresUI: false,
    };

    const [uiState, dispatchUI] = useReducer(UIComponentReducer, initialUi);

    return (
        <div className='flex flex-col gap-3'>

            {/* Description */}
            <div className='rounded-lg border border-greyColor overflow-hidden'>
                <button
                    type='button'
                    className='w-full flex items-center justify-between px-4 py-3 transition-colors duration-150 group'
                    style={{ background: uiState.descriptionUI ? 'rgba(232,147,71,0.08)' : 'transparent' }}
                    onClick={() => dispatchUI({ type: 'UPDATE_FIELD', field: 'descriptionUI', value: !uiState.descriptionUI })}
                >
                    <div className='flex items-center gap-2'>
                        <svg className='w-4 h-4 text-primaryColor' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h10' />
                        </svg>
                        <span className='text-sm font-bold text-primaryColor uppercase tracking-wider'>
                            Description <span className='text-red-400'>*</span>
                        </span>
                    </div>
                    <div className='flex items-center gap-3'>
                        {description?.length ? (
                            <span className='text-xs text-secondary'>{description.length} chars</span>
                        ) : null}
                        <svg
                            className={`w-4 h-4 text-secondary transition-transform duration-200 ${uiState.descriptionUI ? 'rotate-180' : ''}`}
                            fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                        </svg>
                    </div>
                </button>

                {uiState.descriptionUI && (
                    <div className='border-t border-greyColor'>
                        <textarea
                            rows={7}
                            placeholder='Describe the product in detail…'
                            value={description || ''}
                            onChange={(e) => {
                                onDescriptionChange(e.target.value);
                                onDescriptionErrorClear?.();
                            }}
                            className='w-full bg-transparent text-sm text-primaryColor placeholder:text-secondary p-4 resize-none outline-none'
                        />
                    </div>
                )}
                {errors.description && <div className='px-4 pb-2'><FieldError msg={errors.description} /></div>}
            </div>

            {/* Specifications */}
            <div className='rounded-lg border border-greyColor overflow-hidden'>
                <button
                    type='button'
                    className='w-full flex items-center justify-between px-4 py-3 transition-colors duration-150'
                    style={{ background: uiState.specificationsUI ? 'rgba(232,147,71,0.08)' : 'transparent' }}
                    onClick={() => dispatchUI({ type: 'UPDATE_FIELD', field: 'specificationsUI', value: !uiState.specificationsUI })}
                >
                    <div className='flex items-center gap-2'>
                        <svg className='w-4 h-4 text-primaryColor' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                        </svg>
                        <span className='text-sm font-bold text-primaryColor uppercase tracking-wider'>Specifications</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        {specifications?.length ? (
                            <span className='text-xs text-secondary'>{specifications.length} chars</span>
                        ) : null}
                        <svg
                            className={`w-4 h-4 text-secondary transition-transform duration-200 ${uiState.specificationsUI ? 'rotate-180' : ''}`}
                            fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                        </svg>
                    </div>
                </button>

                {uiState.specificationsUI && (
                    <div className='border-t border-greyColor'>
                        <textarea
                            rows={7}
                            placeholder='List specifications (weight, dimensions, material…)'
                            value={specifications || ''}
                            onChange={(e) => onSpecificationsChange(e.target.value)}
                            className='w-full bg-transparent text-sm text-primaryColor placeholder:text-secondary p-4 resize-none outline-none'
                        />
                    </div>
                )}
            </div>

            {/* Features */}
            <div className='rounded-lg border border-greyColor overflow-hidden'>
                <button
                    type='button'
                    className='w-full flex items-center justify-between px-4 py-3 transition-colors duration-150'
                    style={{ background: uiState.featuresUI ? 'rgba(232,147,71,0.08)' : 'transparent' }}
                    onClick={() => dispatchUI({ type: 'UPDATE_FIELD', field: 'featuresUI', value: !uiState.featuresUI })}
                >
                    <div className='flex items-center gap-2'>
                        <svg className='w-4 h-4 text-primaryColor' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                        </svg>
                        <span className='text-sm font-bold text-primaryColor uppercase tracking-wider'>Features</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        {features?.length ? (
                            <span className='text-xs text-secondary'>{features.length} chars</span>
                        ) : null}
                        <svg
                            className={`w-4 h-4 text-secondary transition-transform duration-200 ${uiState.featuresUI ? 'rotate-180' : ''}`}
                            fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
                        </svg>
                    </div>
                </button>

                {uiState.featuresUI && (
                    <div className='border-t border-greyColor'>
                        <textarea
                            rows={7}
                            placeholder='Highlight key product features…'
                            value={features || ''}
                            onChange={(e) => onFeaturesChange(e.target.value)}
                            className='w-full bg-transparent text-sm text-primaryColor placeholder:text-secondary p-4 resize-none outline-none'
                        />
                    </div>
                )}
            </div>

        </div>
    );
}
