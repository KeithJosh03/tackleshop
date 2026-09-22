'use client';

import { useReducer, Dispatch, useEffect } from 'react';
import { UIComponentReducer, initialUIComponent } from '@/lib/api/reDucer';
import CollapsibleTextarea from './CollapsibleTextarea';
import { ProductFormState, ProductFormAction } from '@/lib/reducer/productFormReducer';

export interface ProductContentInputsProps {
    ProductDetailState: ProductFormState;
    dispatchProductDetailCreate: Dispatch<ProductFormAction>;
    errors?: Record<string, string>;
}

export default function ProductContentInputs({
    ProductDetailState,
    dispatchProductDetailCreate,
    errors = {},
}: ProductContentInputsProps) {
    const initialUi: initialUIComponent = {
        descriptionUI: Boolean(ProductDetailState.description),
        specificationsUI: Boolean(ProductDetailState.specifications),
        featuresUI: Boolean(ProductDetailState.features),
    };

    const [uiState, dispatchUI] = useReducer(UIComponentReducer, initialUi);

    useEffect(() => {
        if (ProductDetailState.description && !uiState.descriptionUI) {
            dispatchUI({ type: 'UPDATE_FIELD', field: 'descriptionUI', value: true });
        }
        if (ProductDetailState.specifications && !uiState.specificationsUI) {
            dispatchUI({ type: 'UPDATE_FIELD', field: 'specificationsUI', value: true });
        }
        if (ProductDetailState.features && !uiState.featuresUI) {
            dispatchUI({ type: 'UPDATE_FIELD', field: 'featuresUI', value: true });
        }
    }, [ProductDetailState.description, ProductDetailState.specifications, ProductDetailState.features]);

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
                value={ProductDetailState.description}
                placeholder='Describe the product in detail…'
                onChange={(val) => dispatchProductDetailCreate({ type: 'UPDATE_DESCRIPTION', payload: val })}
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
                value={ProductDetailState.specifications}
                placeholder='List specifications (weight, dimensions, material…)'
                onChange={(val) => dispatchProductDetailCreate({ type: 'UPDATE_SPECIFICATIONS', payload: val })}
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
                value={ProductDetailState.features}
                placeholder='Highlight key product features…'
                onChange={(val) => dispatchProductDetailCreate({ type: 'UPDATE_FEATURES', payload: val })}
            />
        </div>
    );
}