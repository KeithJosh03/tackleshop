'use client';
import React from 'react'

import { useState, useEffect } from 'react';
import axios from 'axios';

import MainLayoutDiscount from './layout';
import DiscountComponentLayout from './DiscountComponentLayout';
import DiscountProductCards from './DiscountProductCards';

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

    console.log(discountProducts);
    return (
        <MainLayoutDiscount>
            <DiscountComponentLayout 
            >
              {discountProducts?.map((discountProduct) => (
                <DiscountProductCards 
                  key={discountProduct.discountId}
                  discountProduct={discountProduct}
                />
              ))}    
            </DiscountComponentLayout>
        </MainLayoutDiscount>
    );
}
