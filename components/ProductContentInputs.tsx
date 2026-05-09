'use client';

import { useReducer } from 'react';
import { UIComponentReducer, initialUIComponent } from '@/lib/api/reDucer';
import CollapsibleTextarea from './ui/CollapsibleTextarea';

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

            <CollapsibleTextarea
                label='Description'
                required
                icon={
                    <svg className='w-4 h-4 text-primaryColor' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h10' />
                    </svg>
                }
                isOpen={uiState.descriptionUI}
                onToggle={() => dispatchUI({ type: 'UPDATE_FIELD', field: 'descriptionUI', value: !uiState.descriptionUI })}
                value={description}
                placeholder='Describe the product in detail…'
                onChange={(val) => { onDescriptionChange(val); onDescriptionErrorClear?.(); }}
                error={errors.description}
            />

            <CollapsibleTextarea
                label='Specifications'
                icon={
                    <svg className='w-4 h-4 text-primaryColor' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                    </svg>
                }
                isOpen={uiState.specificationsUI}
                onToggle={() => dispatchUI({ type: 'UPDATE_FIELD', field: 'specificationsUI', value: !uiState.specificationsUI })}
                value={specifications}
                placeholder='List specifications (weight, dimensions, material…)'
                onChange={onSpecificationsChange}
            />

            <CollapsibleTextarea
                label='Features'
                icon={
                    <svg className='w-4 h-4 text-primaryColor' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                    </svg>
                }
                isOpen={uiState.featuresUI}
                onToggle={() => dispatchUI({ type: 'UPDATE_FIELD', field: 'featuresUI', value: !uiState.featuresUI })}
                value={features}
                placeholder='Highlight key product features…'
                onChange={onFeaturesChange}
            />

        </div>
    );
}
