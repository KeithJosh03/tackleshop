'use client';

import { useReducer } from 'react';
import { UIComponentReducer, initialUIComponent } from '@/lib/api/reDucer';
import CollapsibleTextarea from './CollapsibleTextarea';






export interface ProductContentInputsProps {
    description: string | null;
    specifications: string | null;
    features: string | null;
    errors?: Record<string, string>;
    onDescriptionChange: (value: string) => void;
    onSpecificationsChange: (value: string) => void;
    onFeaturesChange: (value: string) => void;
    onDescriptionErrorClear?: () => void;
}


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
