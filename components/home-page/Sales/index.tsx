'use client';
import React from 'react'

import { useState, useEffect } from 'react';
import axios from 'axios';

import MainLayoutDiscount from './layout';
import SaleComponentLayout from './SaleComponentLayout';
import SaleProductCards from './SaleProductCards';

import { DiscountProductCollection } from '@/types/dataprops';

interface DiscountProductResponse {
status:boolean;
collectioncategories:DiscountProductCollection[];
}






export default function Discounts() {
    let [discountProducts, setDiscountProducts] = useState<DiscountProductCollection[]>();

    useEffect(() => {
        axios.get<DiscountProductResponse>('/api/productDiscounted/collection/')
        .then(res => setDiscountProducts(res.data.collectioncategories))
        .catch(err => console.error(err));
    }, []);

    return (
        <MainLayoutDiscount>
            <SaleComponentLayout 
            >
              {discountProducts?.map((discountProduct) => (
                <SaleProductCards 
                  key={discountProduct.discountId}
                  discountProduct={discountProduct}
                />
              ))}    
            </SaleComponentLayout>
        </MainLayoutDiscount>
    );
}
