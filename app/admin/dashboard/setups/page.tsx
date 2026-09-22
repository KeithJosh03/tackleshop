"use client";

import React, { useState } from "react";

export interface VariantOption {
  id: number;
  name: string;
  price_adjustment: number;
  variantTypeId?: number;
}

export interface VariantType {
  id: number;
  name: string;
  options: VariantOption[];
}

export interface Product {
  id: number;
  name: string;
  base_price: number;
  variantTypes?: VariantType[];
}

export interface SetupItem {
  product: Product;
  selectedOptions: VariantOption[];
}

export default function AddSetup() {
  return (
    <div className="flex-1">

    </div>
  );
}