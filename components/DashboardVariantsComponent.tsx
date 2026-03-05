'use client';

import { useState, useReducer } from "react";
import Image from "next/image";


import {
    InputText,
    IconButton,
    CustomButton,
    SearchTextAdmin,
    InputPrice
} from '@/components'

import { VariantDetails, VariantOption } from "../app/admin/dashboard/addproduct/page";
import ImageIconUpload from "@/components/ImageIconUpload";
// ACTION REDUCER
import { ProductDetailActionCreate } from "../app/admin/dashboard/addproduct/page";
import { ProductDetailActionEdit } from "@/app/admin/dashboard/editproduct/[productId]/ProductClientEdit";
import { ProductVariantTypes } from "@/types/productVariants";
import { ProductDetailsEdit } from "@/lib/api/productService";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';


type ReducerType = 'CREATE' | 'EDIT'

interface VariantsComponentProps {
    variantsList?: VariantDetails[];
    basePrice: string;
    currentVariants?: ProductVariantTypes[];
    ReduceType: ReducerType
    dispatchProductDetailCreate?: React.Dispatch<ProductDetailActionCreate>;
    ProductDetailEditReducer?: React.Dispatch<ProductDetailActionEdit>;
}



type createVariantDetailAction =
    | { type: 'UPDATE_TYPE_NAME'; payload: string }
    | { type: 'ADD_OPTION_NAME'; payload: string }
    | { type: 'REMOVE_OPTION_NAME'; payload: number }
    | { type: 'RESET_VARIANT_DETAILS'; payload: VariantDetails }
    | { type: 'ADJUST_PRICE'; payload: { id: number, price_adjust: string } }



function VariantDetailReducer(
    state: VariantDetails,
    action: createVariantDetailAction
): VariantDetails {
    switch (action.type) {
        case 'UPDATE_TYPE_NAME':
            return { ...state, variantTypeName: action.payload }
        case "ADD_OPTION_NAME":
            const newOption: VariantOption = {
                variantOptionValue: action.payload,
                price_adjusting: '',
                variant_image: null
            };
            return {
                ...state,
                variantOptions: [...state.variantOptions, newOption]
            };
        case "REMOVE_OPTION_NAME":
            return {
                ...state,
                variantOptions: [...state.variantOptions.filter((_, i) => i !== action.payload)]
            }
        case "ADJUST_PRICE":
            const updatedVariantOptions = state.variantOptions.map((option, index) => {
                console.log(`Checking option at index ${index}`);
                if (index === action.payload.id) {
                    console.log(`Updating option at index ${index}, price_adjusting: ${action.payload.price_adjust}`);
                    return { ...option, price_adjusting: action.payload.price_adjust };
                }
                console.log('No update for this option', option);
                return option;
            });
            return {
                ...state,
                variantOptions: updatedVariantOptions,
            };
        case "RESET_VARIANT_DETAILS":
            return action.payload
        default:
            return state
    }
}




const DashboardVariantsComponent: React.FC<VariantsComponentProps> = (
    {
        variantsList,
        currentVariants,
        dispatchProductDetailCreate,
        ProductDetailEditReducer,
        basePrice,
        ReduceType
    }) => {
    const initialcreateVariantDetail = {
        variantTypeName: '',
        variantOptions: []
    }

    const [createVariantDetail, dispatchVariantCreate] = useReducer(VariantDetailReducer, initialcreateVariantDetail)
    const [variantBox, setvariantBox] = useState<boolean>(false);
    const [variantInputsBox, setvariantInputBox] = useState<boolean>(false);
    const [searchRecommend, setsearchRecommend] = useState<string>('')
    const [createOptionValue, setcreateOptionValue] = useState<string>('')
    const [optionRecommend, setoptionRecommend] = useState<any>([
        { option_id: 1, optionName: 'Color' },
        { option_id: 2, optionName: 'Metals' },
        { option_id: 3, optionName: 'Weights' },
    ])

    const clearingInputs = () => {
        dispatchVariantCreate({
            type: 'RESET_VARIANT_DETAILS',
            payload: initialcreateVariantDetail
        })
        setvariantBox(false);
        setvariantInputBox(false)
    }

    const addVariantOption = () => {
        if (createOptionValue.trim().length > 0) {
            dispatchVariantCreate({
                type: 'ADD_OPTION_NAME',
                payload: createOptionValue
            })
            setcreateOptionValue('')
        }
        return;
    }

    const selectOptionRecommend = (option: any) => {
        console.log(option)
        setvariantInputBox(true)
        setvariantBox(false)
        dispatchVariantCreate({
            type: 'UPDATE_TYPE_NAME',
            payload: option.optionName
        })
    }

    const doneInitialsVariant = () => {
        if (
            createVariantDetail.variantTypeName.trim().length > 0 &&
            Array.isArray(createVariantDetail.variantOptions)
            && createVariantDetail.variantOptions.length > 0
        ) {
            if (ReduceType === 'CREATE' && dispatchProductDetailCreate) {
                dispatchProductDetailCreate({
                    type: 'ADD_VARIANTS',
                    payload: createVariantDetail
                })
                clearingInputs()
            }
        }
    }
    return (
        <div className="flex flex-col gap-y-4 font-extrabold">

            {/* ══ CREATE MODE ══════════════════════════════════════════════ */}
            {ReduceType === 'CREATE' && (
                <div className="flex flex-col gap-y-3 h-fit">

                    {/* ── Added variant type summary cards ── */}
                    {Array.isArray(variantsList) && variantsList.length > 0 && (
                        <div className="flex flex-col gap-y-2">
                            {variantsList.map((variant, index) => (
                                <div key={index}
                                    className="rounded-lg border border-greyColor overflow-hidden"
                                    style={{ background: 'rgba(17,26,45,0.7)' }}
                                >
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-greyColor"
                                        style={{ background: 'rgba(131,93,50,0.12)' }}>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-3.5 h-3.5 text-primaryColor" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 12h6" />
                                            </svg>
                                            <span className="text-xs font-black text-primaryColor uppercase tracking-widest">{variant.variantTypeName}</span>
                                        </div>
                                        <span className="text-xs text-secondary font-semibold">{variant.variantOptions.length} option{variant.variantOptions.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 px-4 py-3">
                                        {variant.variantOptions.map((option, oi) => (
                                            <span key={oi}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                                                style={{ background: 'rgba(232,147,71,0.15)', color: '#E89347', border: '1px solid rgba(232,147,71,0.35)' }}
                                            >
                                                {option.variantOptionValue}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Variant creation form ── */}
                    {variantInputsBox && (
                        <div className="rounded-xl border border-greyColor"
                            style={{ background: 'rgba(17,26,45,0.9)' }}>
                            {/* form header */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-greyColor rounded-t-[11px]"
                                style={{ background: 'linear-gradient(90deg,rgba(17,26,45,1) 0%,rgba(19,29,41,0.6) 100%)' }}>
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primaryColor text-xs font-black text-white">+</span>
                                    <span className="text-xs font-black text-primaryColor uppercase tracking-widest">New Variant Type</span>
                                </div>
                                <button onClick={clearingInputs}
                                    className="flex items-center gap-1 text-xs text-secondary hover:text-primaryColor transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel
                                </button>
                            </div>

                            <div className="p-5 flex flex-col gap-y-5">
                                {/* Step 1 – Type name */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-primaryColor uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="flex items-center justify-center w-4 h-4 rounded-full text-white text-[10px] font-black"
                                            style={{ background: '#E89347' }}>1</span>
                                        Variant Type Name
                                    </label>
                                    <SearchTextAdmin
                                        placeholderText='e.g. Color, Weight, Size…'
                                        value={createVariantDetail.variantTypeName}
                                        onChange={(e) => dispatchVariantCreate({ type: 'UPDATE_TYPE_NAME', payload: e.target.value })}
                                    />
                                </div>

                                {/* Step 2 – Option values */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-primaryColor uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="flex items-center justify-center w-4 h-4 rounded-full text-white text-[10px] font-black"
                                            style={{ background: '#E89347' }}>2</span>
                                        Option Values
                                    </label>

                                    {/* existing pills */}
                                    {Array.isArray(createVariantDetail.variantOptions) && createVariantDetail.variantOptions.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-greyColor"
                                            style={{ background: 'rgba(131,93,50,0.06)' }}>
                                            {createVariantDetail.variantOptions.map((opt, index) => (
                                                <span key={index}
                                                    className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-bold"
                                                    style={{ background: 'rgba(232,147,71,0.18)', color: '#E89347', border: '1px solid rgba(232,147,71,0.35)' }}
                                                >
                                                    {opt.variantOptionValue}
                                                    <button
                                                        onClick={() => dispatchVariantCreate({ type: 'REMOVE_OPTION_NAME', payload: index })}
                                                        className="flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-primaryColor/30 transition-colors"
                                                    >
                                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* add value row */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <SearchTextAdmin
                                                placeholderText='Type a value and click +'
                                                value={createOptionValue}
                                                onChange={(e) => setcreateOptionValue(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={addVariantOption}
                                            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150 shrink-0"
                                            style={{ background: 'linear-gradient(135deg,#E89347 0%,#b8692e 100%)', boxShadow: '0 0 10px 1px rgba(232,147,71,0.3)' }}
                                        >
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Done button */}
                                <div className="flex justify-end pt-2 border-t border-greyColor">
                                    <button
                                        onClick={doneInitialsVariant}
                                        disabled={!createVariantDetail.variantTypeName.trim() || createVariantDetail.variantOptions.length === 0}
                                        className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-extrabold uppercase tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                        style={{ background: 'linear-gradient(135deg,#E89347 0%,#b8692e 100%)', color: '#fff' }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Add Variant Type
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── "Add variant type" trigger (shown when form is closed) ── */}
                    {!variantInputsBox && (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setvariantBox(!variantBox)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed transition-all duration-200 group"
                                style={{ borderColor: variantBox ? '#E89347' : 'oklch(37.3% 0.034 259.733)', color: variantBox ? '#E89347' : '#835d32' }}
                            >
                                <svg className="w-4 h-4 shrink-0 group-hover:text-primaryColor transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-sm font-bold group-hover:text-primaryColor transition-colors">Add variant type — e.g. Weight, Color, Size, Hook Thickness…</span>
                            </button>

                            {/* Picker dropdown */}
                            {variantBox && (
                                <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-greyColor shadow-2xl"
                                    style={{ background: '#111A2D', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
                                    <div className="p-3 border-b border-greyColor">
                                        <SearchTextAdmin
                                            placeholderText="Search variant types…"
                                            value={searchRecommend}
                                            onChange={(e) => setsearchRecommend(e.target.value)}
                                        />
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs text-secondary uppercase tracking-widest font-bold mb-2">Recommended</p>
                                        <ul className="flex flex-col gap-y-0.5">
                                            {optionRecommend
                                                .filter((o: any) => o.optionName.toLowerCase().includes(searchRecommend.toLowerCase()))
                                                .map((option: any) => (
                                                    <li key={option.option_id}
                                                        onClick={() => selectOptionRecommend(option)}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-secondary hover:bg-primaryColor/10 hover:text-primaryColor cursor-pointer transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 12h6" />
                                                        </svg>
                                                        {option.optionName}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    <div className="border-t border-greyColor p-3">
                                        <button
                                            onClick={() => { setvariantBox(false); setvariantInputBox(true); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-primaryColor hover:bg-primaryColor/10 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create custom variant type
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Variant options price / image table ── */}
                    {Array.isArray(variantsList) && variantsList.length > 0 && dispatchProductDetailCreate && (
                        <div className="flex flex-col gap-y-4 mt-2">
                            {variantsList.map((variant, variantIndex) => (
                                <div key={variantIndex} className="rounded-xl border border-greyColor overflow-hidden">
                                    {/* variant group header */}
                                    <div className="px-4 py-2.5 border-b border-greyColor flex items-center gap-2"
                                        style={{ background: 'rgba(131,93,50,0.12)' }}>
                                        <span className="text-xs font-black text-primaryColor uppercase tracking-widest">{variant.variantTypeName}</span>
                                        <span className="text-xs text-secondary">— set image & price per option</span>
                                    </div>

                                    {/* column headings */}
                                    <div className="grid grid-cols-[140px_1fr_1fr_1fr] items-center px-4 py-2 border-b border-greyColor">
                                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                                            Image
                                            <span className="ml-1 normal-case font-normal">(optional)</span>
                                        </span>
                                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">Option</span>
                                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">Price Adjustment</span>
                                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">Final Price</span>
                                    </div>

                                    {/* option rows */}
                                    {variant.variantOptions.map((option, optionIndex) => (
                                        <div key={optionIndex}
                                            className="grid grid-cols-[140px_1fr_1fr_1fr] items-center gap-x-4 px-4 py-3 border-b border-greyColor last:border-b-0 hover:bg-white/[0.02] transition-colors"
                                        >
                                            {/* image col */}
                                            <div className="w-[120px] h-[88px] rounded-lg overflow-hidden border border-greyColor flex items-center justify-center shrink-0"
                                                style={{ background: 'rgba(17,26,45,0.8)' }}>
                                                {option.variant_image === null ? (
                                                    <ImageIconUpload
                                                        uploadImage="/icons/imageupload.svg"
                                                        maxImages={1}
                                                        onFileChange={(file: File) => {
                                                            if (dispatchProductDetailCreate && ReduceType === 'CREATE') {
                                                                dispatchProductDetailCreate({
                                                                    type: 'ADD_IMAGE_VARIANT',
                                                                    payload: { variantIndex, optiontIndex: optionIndex, variantImage: file },
                                                                });
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="relative w-full h-full group">
                                                        <Image
                                                            src={URL.createObjectURL(option.variant_image)}
                                                            alt={`variant-${optionIndex}`}
                                                            fill
                                                            className="object-contain rounded-lg"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                if (dispatchProductDetailCreate && ReduceType === 'CREATE') {
                                                                    dispatchProductDetailCreate({
                                                                        type: 'REMOVE_VARIANT_IMAGE',
                                                                        payload: { variantIndex, optionIndex }
                                                                    });
                                                                }
                                                            }}
                                                            className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            style={{ background: 'rgba(248,113,113,0.9)' }}
                                                        >
                                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* option name */}
                                            <div>
                                                <span className="text-sm font-bold text-primaryColor">{option.variantOptionValue}</span>
                                            </div>

                                            {/* price adjustment */}
                                            <div>
                                                <InputPrice
                                                    isUnit={true}
                                                    placeholder="₱ 0.00"
                                                    value={`${option.price_adjusting}`}
                                                    onChange={(e) => {
                                                        if (dispatchProductDetailCreate && ReduceType === 'CREATE') {
                                                            dispatchProductDetailCreate({
                                                                type: 'ADJUST_PRICE',
                                                                payload: { variantIndex, optiontIndex: optionIndex, price_adjust: e.target.value },
                                                            });
                                                        }
                                                    }}
                                                />
                                            </div>

                                            {/* final price */}
                                            <div>
                                                <span className="text-sm font-bold"
                                                    style={{ color: '#E89347' }}>
                                                    {`₱ ${(parseFloat(option.price_adjusting !== '' ? option.price_adjusting : '0') + parseFloat(basePrice !== '' ? basePrice : '0')).toFixed(2)}`}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            )}



            {/* EDIT VARIANT TYPE & LIST RENDER*/}
            {(ReduceType == 'EDIT' &&
                ProductDetailEditReducer) && (
                    <div className="flex flex-col gap-y-2">
                        {Array.isArray(currentVariants) && currentVariants.length > 0 && (
                            currentVariants.map((variant, index) => (
                                <div className="flex flex-col gap-y-2 text-primaryColor p-6 border rounded w-full border-greyColor relative"
                                    key={index | variant.variantTypeId}
                                >
                                    <h1 className="text-sm font-extrabold">VARIANT TYPE</h1>
                                    <InputText
                                        key={variant.variantTypeId | index}
                                        value={variant.variantTypeName}
                                        onChange={(e) => {
                                            ProductDetailEditReducer({
                                                type: 'UPDATE_VARIANT_TYPE',
                                                payload: {
                                                    variantTypeId: variant.variantTypeId,
                                                    variantTypeName: e.target.value
                                                }
                                            })
                                        }}
                                        placeholder="Enter Model"
                                    />
                                    <CustomButton
                                        text="DELETE VARIANT TYPE"
                                        className="absolute top-2 right-2 button-view text-md font-extrabold"
                                        onClick={() => {
                                            ProductDetailEditReducer({
                                                type: 'REMOVE_VARIANT_TYPE',
                                                payload: {
                                                    variantTypeId: variant.variantTypeId,
                                                }
                                            })
                                        }}
                                    />
                                    <div className="flex flex-col mt-4 border-t border-greyColor pt-2">
                                        <h1 className="text-sm font-extrabold">VARIANT OPTIONS</h1>
                                        <ul className="flex flex-row gap-x-2 mt-2">
                                            {variant.variantOptions.map((option, index) => (
                                                <InputText
                                                    key={option.variantOptionId}
                                                    value={option.variantOptionValue}
                                                    onChange={(e) => {
                                                        ProductDetailEditReducer({
                                                            type: 'UPDATE_VARIANT_OPTION_NAME',
                                                            payload: {
                                                                variantTypeId: variant.variantTypeId,
                                                                variantOptionId: option.variantOptionId,
                                                                variantOptionValue: e.target.value
                                                            }
                                                        });
                                                    }}
                                                    placeholder="Enter Model"
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}


            {/* ══ EDIT MODE ═══════════════════════════════════════════════ */}

            {/* EDIT VARIANT TYPE & LIST RENDER*/}
            {(ReduceType == 'EDIT' &&
                ProductDetailEditReducer) && (
                    <div className="flex flex-col gap-y-2">
                        {Array.isArray(currentVariants) && currentVariants.length > 0 && (
                            currentVariants.map((variant, index) => (
                                <div className="flex flex-col gap-y-2 text-primaryColor p-6 border rounded w-full border-greyColor relative"
                                    key={index | variant.variantTypeId}
                                >
                                    <h1 className="text-sm font-extrabold">VARIANT TYPE</h1>
                                    <InputText
                                        key={variant.variantTypeId | index}
                                        value={variant.variantTypeName}
                                        onChange={(e) => {
                                            ProductDetailEditReducer({
                                                type: 'UPDATE_VARIANT_TYPE',
                                                payload: {
                                                    variantTypeId: variant.variantTypeId,
                                                    variantTypeName: e.target.value
                                                }
                                            })
                                        }}
                                        placeholder="Enter Model"
                                    />
                                    <CustomButton
                                        text="DELETE VARIANT TYPE"
                                        className="absolute top-2 right-2 button-view text-md font-extrabold"
                                        onClick={() => {
                                            ProductDetailEditReducer({
                                                type: 'REMOVE_VARIANT_TYPE',
                                                payload: {
                                                    variantTypeId: variant.variantTypeId,
                                                }
                                            })
                                        }}
                                    />
                                    <div className="flex flex-col mt-4 border-t border-greyColor pt-2">
                                        <h1 className="text-sm font-extrabold">VARIANT OPTIONS</h1>
                                        <ul className="flex flex-row gap-x-2 mt-2">
                                            {variant.variantOptions.map((option, index) => (
                                                <InputText
                                                    key={option.variantOptionId}
                                                    value={option.variantOptionValue}
                                                    onChange={(e) => {
                                                        ProductDetailEditReducer({
                                                            type: 'UPDATE_VARIANT_OPTION_NAME',
                                                            payload: {
                                                                variantTypeId: variant.variantTypeId,
                                                                variantOptionId: option.variantOptionId,
                                                                variantOptionValue: e.target.value
                                                            }
                                                        });
                                                    }}
                                                    placeholder="Enter Model"
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

            {/* EDIT PRICE VARIANT OPTION */}
            {(Array.isArray(currentVariants) &&
                currentVariants.length > 0
                && ReduceType === 'EDIT'
                && ProductDetailEditReducer) && (
                    <div className="flex flex-col gap-y-1 border-t border-greyColor mt-10">
                        {Array.isArray(currentVariants) && currentVariants.length > 0 && (
                            <ul className="flex flex-row items-center justify-between p-2 text-xl text-primaryColor">
                                <li className="flex-1">
                                    Variant Image
                                    <span className="ml-1 text-xs font-normal text-secondary">(optional)</span>
                                </li>
                                <li className="flex-1">Variant Name</li>
                                <li className="flex-1">Price Adjustment</li>
                                <li className="flex-1">Price (Base + Variant)</li>
                            </ul>
                        )}
                        {currentVariants.map((variant, variantIndex) => (
                            <div key={variantIndex} className="flex flex-col">
                                <div className="flex flex-col gap-y-2">
                                    {variant.variantOptions.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center gap-y-2 justify-between p-2">
                                            <div className="flex-1 flex flex-row items-center justify-between gap-x-4 border border-secondary rounded py-2 px-4 relative">
                                                <CustomButton
                                                    text="DELETE"
                                                    className="absolute top-2 right-2 button-view text-md font-extrabold"
                                                    onClick={() => {
                                                        ProductDetailEditReducer({
                                                            type: 'REMOVE_VARIANT_OPTION_NAME',
                                                            payload: {
                                                                variantTypeId: variant.variantTypeId,
                                                                variantOptionId: option.variantOptionId
                                                            }
                                                        })
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    {option.imageUrl !== null && (
                                                        <div className="relative min-w-[160px] h-40 w-40 rounded border border-primaryColor">
                                                            <Image
                                                                src={`${baseURL}${option.imageUrl}`}
                                                                alt={`media-${optionIndex}`}
                                                                fill
                                                                className="object-contain rounded"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h1 className="font-bold text-primaryColor text-xl">{option.variantOptionValue}</h1>
                                                </div>
                                                <div className="flex-1">
                                                    <InputPrice
                                                        isUnit={true}
                                                        placeholder="Base Price"
                                                        value={`${option.variantOptionPrice}`}
                                                        onChange={(e) => {
                                                            ProductDetailEditReducer({
                                                                type: 'UPDATE_PRICE_OPTION',
                                                                payload: {
                                                                    variantTypeId: variant.variantTypeId,
                                                                    variantOptionId: option.variantOptionId,
                                                                    variantOptionPrice: e.target.value
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h1 className="font-bold text-primaryColor text-xl">{`₱ ${(parseFloat((option.variantOptionPrice !== '' ? option.variantOptionPrice : '0')) + parseFloat((basePrice !== '' ? basePrice : '0'))).toFixed(2)}`}</h1>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

        </div>
    );
}

export default DashboardVariantsComponent;

