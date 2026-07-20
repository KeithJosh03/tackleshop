const handlePillKeyDown = (e: KeyboardEvent<HTMLInputElement>, variantIndex: number) => {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = (pillInputs[variantIndex] || '').trim();
        if (val) {
            const exists = ProductDetailState.variants[variantIndex]?.variantOptions.find(opt => opt.variantOptionValue === val);
            if (!exists) {
                dispatchProductDetailCreate({
                    type: 'ADD_VARIANT_OPTION',
                    payload: {
                        variantIndex,
                        variantOption: {
                            variantOptionValue: val,
                            price_adjusting: '',
                            imageUrl: null
                        }
                    }
                });
            }
            setPillInputs({ ...pillInputs, [variantIndex]: '' });
        }
    }
};