'use client';

import { useState, KeyboardEvent, ChangeEvent } from "react";
import Image from "next/image";

import { VariantDetails, VariantOption, ProductDetailActionCreate } from "@/lib/reducer/productReducer";
import { ProductDetailActionEdit } from "@/lib/reducer/editProductReducer";
import { ProductVariantTypes } from "@/types/productVariantsTypes";

type ReducerType = 'CREATE' | 'EDIT';

interface ProductVariantBuilderProps {
  variantsList?: VariantDetails[];
  basePrice: string;
  currentVariants?: ProductVariantTypes[];
  ReduceType: ReducerType;
  dispatchProductDetailCreate?: React.Dispatch<ProductDetailActionCreate>;
  ProductDetailEditReducer?: React.Dispatch<ProductDetailActionEdit>;
}

export default function ProductVariantBuilder({
  variantsList = [],
  dispatchProductDetailCreate,
  basePrice,
  ReduceType
}: ProductVariantBuilderProps) {
  
  // Local state for the input of new pills for each variant block
  const [pillInputs, setPillInputs] = useState<Record<number, string>>({});

  const handleAddVariantType = () => {
    if (dispatchProductDetailCreate) {
      dispatchProductDetailCreate({
        type: 'ADD_VARIANT_TYPE',
        payload: {
          variantTypeName: `Variant Type ${variantsList.length + 1}`,
          variantOptions: []
        }
      });
    }
  };

  const handlePillKeyDown = (e: KeyboardEvent<HTMLInputElement>, variantIndex: number) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = (pillInputs[variantIndex] || '').trim();
      
      if (val) {
        // Check if option already exists
        const exists = variantsList[variantIndex]?.variantOptions.find(opt => opt.variantOptionValue === val);
        if (!exists && dispatchProductDetailCreate) {
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

  const handlePillInputChange = (e: ChangeEvent<HTMLInputElement>, variantIndex: number) => {
    setPillInputs({ ...pillInputs, [variantIndex]: e.target.value });
  };

  return (
    <div className="flex flex-col gap-6 font-medium text-zinc-200">
      
      {Array.isArray(variantsList) && variantsList.length > 0 && (
        <div className="flex flex-col gap-6">
          {variantsList.map((variant, variantIndex) => (
            <div key={variantIndex} className="flex flex-col rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden shadow-sm relative animate-in fade-in slide-in-from-top-2 duration-300">
              
              <button 
                onClick={() => dispatchProductDetailCreate && dispatchProductDetailCreate({ type: 'REMOVE_VARIANT_TYPE', payload: { variantIndex } })}
                className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition-colors"
                title="Remove Variant Type"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-5 flex flex-col gap-5">
                {/* Variant Name */}
                <div className="max-w-xs">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Variant Type</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#E89347] focus:border-[#E89347] outline-none text-sm font-medium transition-all text-zinc-100"
                    value={variant.variantTypeName}
                    onChange={(e) => dispatchProductDetailCreate && dispatchProductDetailCreate({
                        type: 'UPDATE_VARIANT_TYPE_NAME',
                        payload: { variantIndex, variantTypeName: e.target.value }
                    })}
                    placeholder="e.g. Size, Color, Weight"
                  />
                </div>

                {/* Pills Input Box */}
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Options</label>
                  <div className="flex flex-wrap items-center gap-2 p-2 bg-zinc-950 border border-zinc-800 rounded-lg focus-within:ring-2 focus-within:ring-[#E89347] focus-within:border-[#E89347] transition-all min-h-[46px]">
                    {variant.variantOptions.map((option, optionIndex) => (
                      <span key={optionIndex} className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 bg-[#E89347]/10 border border-[#E89347]/30 text-[#E89347] text-sm font-bold rounded-full">
                        {option.variantOptionValue}
                        <button 
                          onClick={() => dispatchProductDetailCreate && dispatchProductDetailCreate({ type: 'REMOVE_VARIANT_OPTION', payload: { variantIndex, optionIndex } })}
                          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#E89347]/20 text-[#E89347] transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="flex-1 min-w-[120px] outline-none bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 px-1 font-medium"
                      placeholder={variant.variantOptions.length === 0 ? "Type option and press Enter..." : "Add another..."}
                      value={pillInputs[variantIndex] || ''}
                      onChange={e => handlePillInputChange(e, variantIndex)}
                      onKeyDown={e => handlePillKeyDown(e, variantIndex)}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1.5 font-medium">Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-400">Enter</kbd> or comma to add a pill.</p>
                </div>

                {/* Inline Pricing Matrix Table */}
                {variant.variantOptions.length > 0 && (
                  <div className="mt-2 border-t border-zinc-800/60 pt-4">
                    <div className="grid grid-cols-[1fr_160px_auto] gap-4 mb-2 px-2">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Option Value</span>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Price Adj. (PHP)</span>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider w-[120px] text-center">Media</span>
                    </div>
                    <div className="space-y-2">
                      {variant.variantOptions.map((option, optionIndex) => (
                        <div key={optionIndex} className="grid grid-cols-[1fr_160px_auto] gap-4 items-center bg-zinc-800/30 p-2 rounded-lg border border-zinc-800 shadow-sm animate-in fade-in duration-200">
                          <input
                              className="bg-transparent text-sm font-medium text-zinc-200 border-b border-transparent hover:border-zinc-600 focus:border-[#E89347] outline-none transition-colors w-full pl-2"
                              value={option.variantOptionValue}
                              onChange={(e) => dispatchProductDetailCreate && dispatchProductDetailCreate({
                                  type: 'UPDATE_VARIANT_OPTION_NAME',
                                  payload: { variantIndex, optionIndex, variantOptionValue: e.target.value }
                              })}
                          />
                          
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-bold">₱</span>
                            <input
                              type="number"
                              className="w-full pl-7 pr-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-md focus:ring-2 focus:ring-[#E89347] focus:border-[#E89347] outline-none text-sm transition-all text-zinc-200"
                              value={option.price_adjusting || ''}
                              onChange={(e) => {
                                  if (dispatchProductDetailCreate) {
                                      dispatchProductDetailCreate({
                                          type: 'ADJUST_PRICE',
                                          payload: { variantIndex, optiontIndex: optionIndex, price_adjust: e.target.value },
                                      });
                                  }
                              }}
                              placeholder="0.00"
                            />
                          </div>

                          <div className="w-[120px] flex justify-end pr-2 h-[34px]">
                            {option.imageUrl === null ? (
                              <label className="cursor-pointer flex items-center justify-center w-full gap-1.5 text-xs font-bold text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-zinc-200 px-2 py-1.5 rounded-md transition-colors border border-zinc-700 h-full">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Add Image</span>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0] && dispatchProductDetailCreate) {
                                        dispatchProductDetailCreate({
                                            type: 'ADD_IMAGE_VARIANT',
                                            payload: { variantIndex, optiontIndex: optionIndex, variantImage: e.target.files[0] },
                                        });
                                    }
                                  }}
                                />
                              </label>
                            ) : (
                              <div className="relative w-full h-full group rounded-md overflow-hidden border border-zinc-700 bg-zinc-900 flex items-center justify-center">
                                <Image
                                    src={URL.createObjectURL(option.imageUrl)}
                                    alt={`variant-${optionIndex}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={() => {
                                        if (dispatchProductDetailCreate) {
                                            dispatchProductDetailCreate({
                                                type: 'REMOVE_VARIANT_IMAGE',
                                                payload: { variantIndex, optionIndex }
                                            });
                                        }
                                    }}
                                    className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Variant Type Button */}
      <button
        type="button"
        onClick={handleAddVariantType}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-zinc-700 text-zinc-400 hover:text-[#E89347] hover:border-[#E89347]/50 hover:bg-[#E89347]/5 transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-sm font-bold">Add Variant Type</span>
      </button>

    </div>
  );
}
