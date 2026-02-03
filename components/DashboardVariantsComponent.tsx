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

import { VariantDetails,VariantOption } from "../app/admin/dashboard/addproduct/page";
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
    basePrice:string;
    currentVariants?: ProductVariantTypes[];
    ReduceType: ReducerType
    dispatchProductDetailCreate?: React.Dispatch<ProductDetailActionCreate>;
    ProductDetailEditReducer?:React.Dispatch<ProductDetailActionEdit>;
}



type createVariantDetailAction = 
| { type: 'UPDATE_TYPE_NAME'; payload: string}
| { type: 'ADD_OPTION_NAME'; payload: string}
| { type: 'REMOVE_OPTION_NAME'; payload: number}
| { type:'RESET_VARIANT_DETAILS'; payload:VariantDetails}
| { type: 'ADJUST_PRICE'; payload: {id:number, price_adjust:string}}



function VariantDetailReducer(
  state: VariantDetails,
  action: createVariantDetailAction
): VariantDetails {
    switch (action.type) {
        case 'UPDATE_TYPE_NAME' : 
            return {...state,variantTypeName:action.payload}
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
                variantOptions:[...state.variantOptions.filter((_, i) => i !== action.payload)]
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
        variantTypeName:'',
        variantOptions:[]
    }

    const [createVariantDetail, dispatchVariantCreate] = useReducer(VariantDetailReducer,initialcreateVariantDetail)
    const [variantBox, setvariantBox] = useState<boolean>(false);
    const [variantInputsBox, setvariantInputBox] = useState<boolean>(false);
    const [searchRecommend, setsearchRecommend] = useState<string>('')
    const [createOptionValue, setcreateOptionValue] = useState<string>('')
    const [optionRecommend, setoptionRecommend] = useState<any>([
    {option_id:1,optionName:'Color'},
    {option_id:2,optionName:'Metals'},
    {option_id:3,optionName:'Weights'},
    ])

    const clearingInputs = () => {
        dispatchVariantCreate({
        type:'RESET_VARIANT_DETAILS',
        payload:initialcreateVariantDetail
        })
        setvariantBox(false);
        setvariantInputBox(false)
    }

    const addVariantOption = () => {
        if(createOptionValue.trim().length > 0){
            dispatchVariantCreate({
            type:'ADD_OPTION_NAME',
            payload:createOptionValue
            })
            setcreateOptionValue('')
        }
        return;
    }

    const selectOptionRecommend = (option:any) => {
        console.log(option)
        setvariantInputBox(true)
        setvariantBox(false)
        dispatchVariantCreate({
        type:'UPDATE_TYPE_NAME',
        payload:option.optionName
        })
    }

    const doneInitialsVariant = () => {
        if(
        createVariantDetail.variantTypeName.trim().length > 0 && 
        Array.isArray(createVariantDetail.variantOptions) 
        && createVariantDetail.variantOptions.length > 0 
        ){
            if(ReduceType === 'CREATE' && dispatchProductDetailCreate){
                dispatchProductDetailCreate({
                    type:'ADD_VARIANTS',
                    payload:createVariantDetail
                })
                clearingInputs()
            }
        }
    }
    return(
    <div className="flex flex-col p-2 gap-x-2 font-extrabold rounded border border-greyColor bg-blackgroundColor">
        <div className='flex flex-col justify-between justify-items-center p-2 gap-y-2'>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-col'>
                    <h3 className="text-2xl text-primaryColor font-extrabold">
                    VARIANTS
                    </h3>
                </div>
            </div>


            {/* CREATE VARIANT TYPE & LIST RENDER*/}
            {ReduceType === 'CREATE' && (
            <div className="flex flex-col gap-y-2">
                {Array.isArray(variantsList) && variantsList.length > 0 && (
                    variantsList.map((variant,index) => (
                    <div className="flex flex-col gap-y-2 text-primaryColor p-6 border border-secondary rounded w-full"
                    key={index}
                    >
                        <h1 className="font-extrabold text-2xl">{variant.variantTypeName}</h1>
                        <ul className="flex flex-row gap-x-2">
                            {variant.variantOptions.map((option,index) => (
                            <li className="py-1 px-2 border bg-secondary border-secondary text-primaryColor rounded relative text-sm"
                            key={index}
                            >{option.variantOptionValue}</li>
                            ))}
                        </ul>
                    </div>
                    ))
                )}
            </div>
            )}

            {/* EDIT VARIANT TYPE & LIST RENDER*/}
            {(ReduceType == 'EDIT' && 
            ProductDetailEditReducer) && (
            <div className="flex flex-col gap-y-2">
                {Array.isArray(currentVariants) && currentVariants.length > 0 && (
                    currentVariants.map((variant,index) => (
                    <div className="flex flex-col gap-y-2 text-primaryColor p-6 border rounded w-full border-greyColor relative"
                    key={index | variant.variantTypeId}
                    >
                        <h1 className="text-sm font-extrabold">VARIANT TYPE</h1>
                        <InputText 
                            key={variant.variantTypeId | index}
                            value={variant.variantTypeName}
                            onChange={(e) => {
                                ProductDetailEditReducer({
                                    type:'UPDATE_VARIANT_TYPE',
                                    payload:{
                                    variantTypeId:variant.variantTypeId,
                                    variantTypeName:e.target.value
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
                                    type:'REMOVE_VARIANT_TYPE',
                                    payload:{
                                        variantTypeId:variant.variantTypeId,
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
                                        type:'UPDATE_VARIANT_OPTION_NAME',
                                        payload: { 
                                            variantTypeId:variant.variantTypeId,
                                            variantOptionId:option.variantOptionId,
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

            {/* CREATE VARIANT OPTION */}
            {(variantInputsBox && ReduceType === 'CREATE') && (
            <div className="flex flex-col border border-greyColor rounded px-2 py-1">
                <div className=" flex flex-col p-2 gap-y-2 w-1/2">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="font-extrabold text-primaryColor">Option Name</h1>
                        <SearchTextAdmin 
                        placeholderText="Option Name"
                        value={createVariantDetail.variantTypeName}
                        onChange={(e) => dispatchVariantCreate({
                        type:'UPDATE_TYPE_NAME',
                        payload:e.target.value
                        })}
                        />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <h1 className="font-extrabold text-primaryColor">Option Values</h1>
                        {Array.isArray(createVariantDetail.variantOptions) && createVariantDetail.variantOptions.length > 0 && (
                        <ul className="flex flex-row gap-x-2">
                            {createVariantDetail.variantOptions.map((optionName, index) => (
                            <li key={index} className="py-1 px-2 border bg-secondary border-secondary text-primaryColor rounded relative">
                                {optionName.variantOptionValue}
                                <IconButton 
                                altText='Close Icon'
                                icon='/icons/closeicon.svg'
                                iconSize={6}
                                className="absolute bottom-3 left-4"
                                onClick={() => 
                                    dispatchVariantCreate({
                                    type:'REMOVE_OPTION_NAME',
                                    payload:index
                                    })
                                } 
                                />
                            </li>
                            ))}
                        </ul>
                        )}
                        <div className="flex flex-row justify-between items-center gap-x-2">
                            <SearchTextAdmin 
                            placeholderText="Option Value"
                            value={createOptionValue}
                            onChange={(e) => setcreateOptionValue(e.target.value)}
                            />
                            <IconButton 
                            icon='/icons/addicon.svg'
                            altText='Add Icon'
                            iconSize={8}
                            onClick={addVariantOption}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center p-2 justify-between">
                    <CustomButton 
                    text="CANCEL"
                    onClick={clearingInputs}
                    />
                    <CustomButton 
                    text="DONE"
                    onClick={doneInitialsVariant}
                    />
                </div>
            </div>
            )}


            {/* CREATE NEW VARIANT TYPE */}
            { ReduceType === 'CREATE' && (
            <div className="relative">
                <div 
                className={
                `flex flex-row items-center gap-x-2 p-2 rounded  hover:bg-secondary hover:text-primaryColor 
                ${variantBox ? 'bg-secondary text-primaryColor' : 'text-secondary'} border border-secondary rounded w-full
                relative 
                `}
                onClick={() => setvariantBox(!variantBox)}
                >
                    <IconButton 
                    icon='/icons/addicon.svg'
                    altText='Add Icon'
                    iconSize={6}
                    onClick={() => {

                    }}
                    />
                    <p className='text-sm'>Add Options Variants example: Weights, Sizes, Colors, Hook Thickness, etc</p>
                </div>
                
                {variantBox && (
                <div className="border border-secondary absolute bottom-full rounded bg-blackgroundColor py-1 px-2 flex flex-col gap-y-4">
                    <SearchTextAdmin 
                    placeholderText="Search"
                    value={searchRecommend}
                    onChange={(e) => setsearchRecommend(e.target.value)}
                    />
                    <div className="flex flex-col font-extrabold text-primaryColor">
                        <h1>Recomended</h1>
                        <ul className="flex flex-col text-secondary">
                            {optionRecommend.map((option:any) => (
                            <li 
                            key={option.option_id}
                            className="p-1 rounded hover:bg-secondary hover:text-primaryColor"
                            onClick={() => 
                            selectOptionRecommend(option)
                            }
                            >{option.optionName}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-row gap-x-2 justify-items-center items-center border-t border-secondary px-1 py-2 hover:bg-secondary rounded"
                    onClick={() => {
                    setvariantBox(false)
                    setvariantInputBox(true)
                    }}
                    >
                        <IconButton 
                        icon='/icons/addicon.svg'
                        altText='Add Icon'
                        iconSize={6}
                        onClick={() => {
                        }}
                        />
                        <p className='text-sm text-primaryColor'>Create custom option</p>
                    </div>
                </div>
                )}
            </div>
            )}


            {/* CREATE VARIANT OPTION PRICE & IMAGE */}
            {(Array.isArray(variantsList) && 
            variantsList.length > 0 
            && ReduceType === 'CREATE' 
            && dispatchProductDetailCreate) && (
            <div className="flex flex-col gap-y-1 border-t border-greyColor mt-10">
                {Array.isArray(variantsList) && variantsList.length > 0 && (
                <ul className="flex flex-row items-center justify-between p-2 text-xl text-primaryColor">
                    <li className="flex-1">VariantImage</li>
                    <li className="flex-1">VariantName</li>
                    <li className="flex-1">PriceAdjustment</li>
                    <li className="flex-1">Price (Base + Variant)</li>
                </ul>
                )}
                {variantsList.map((variant, variantIndex) => (
                <div key={variantIndex} className="flex flex-col">
                    <div className="flex flex-col gap-y-2">
                        {variant.variantOptions.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-y-2 justify-between p-2">
                            <div className="flex-1 flex flex-row items-center justify-between gap-x-4 border border-secondary rounded py-2 px-4">
                                <div className="flex-1">
                                    {option.variant_image === null && (
                                    <ImageIconUpload
                                    uploadImage="/icons/imageupload.svg"
                                    maxImages={1}
                                    onFileChange={(file:File) => {
                                        if(dispatchProductDetailCreate && ReduceType === 'CREATE'){
                                            dispatchProductDetailCreate({
                                                type: 'ADD_IMAGE_VARIANT',
                                                payload: { 
                                                    variantIndex:variantIndex,
                                                    optiontIndex:optionIndex,
                                                    variantImage: file
                                                }, 
                                            });
                                        }
                                    }}
                                    />)}
                                    {option.variant_image !== null && (
                                    <div className="relative min-w-[160px] h-40 w-40 rounded border border-primaryColor">
                                        <div className="absolute top-2 right-2 z-10">
                                            <IconButton
                                            icon="/icons/closeicon.svg"
                                            altText="Delete Icon"
                                            iconSize={8}
                                            onClick={(e) => {
                                                if(dispatchProductDetailCreate && ReduceType === 'CREATE'){
                                                    dispatchProductDetailCreate({
                                                        type:'REMOVE_VARIANT_IMAGE',
                                                        payload:{
                                                        variantIndex:variantIndex,
                                                        optionIndex:optionIndex
                                                        }
                                                    })
                                                }
                                            }}
                                            />
                                        </div>
                                        <Image
                                        src={URL.createObjectURL(option.variant_image)}
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
                                    value={`${option.price_adjusting}`} 
                                    onChange={(e) => {
                                        if(dispatchProductDetailCreate && ReduceType === 'CREATE'){
                                            dispatchProductDetailCreate({
                                                type: 'ADJUST_PRICE',
                                                payload: { 
                                                    variantIndex:variantIndex,
                                                    optiontIndex:optionIndex,
                                                    price_adjust: e.target.value 
                                                }, 
                                            });
                                        }
                                    }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h1 className="font-bold text-primaryColor text-xl">{`₱ ${(parseFloat((option.price_adjusting !== '' ? option.price_adjusting : '0')) + parseFloat((basePrice !== '' ? basePrice : '0'))).toFixed(2)}`}</h1>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                ))}
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
                    <li className="flex-1">VariantImage</li>
                    <li className="flex-1">VariantName</li>
                    <li className="flex-1">PriceAdjustment</li>
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
                                        type:'REMOVE_VARIANT_OPTION_NAME',
                                        payload:{
                                            variantTypeId:variant.variantTypeId,
                                            variantOptionId:option.variantOptionId
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
                                            type:'UPDATE_PRICE_OPTION',
                                            payload: { 
                                                variantTypeId:variant.variantTypeId,
                                                variantOptionId:option.variantOptionId,
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
    </div>
    );
}

export default DashboardVariantsComponent;
