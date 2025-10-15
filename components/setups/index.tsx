'use client';
import React from 'react'

import { useState, useEffect } from 'react';
import axios from 'axios';

import MainLayoutSetups from './layout';
import SetupsComponentLayout from './SetupsComponentLayout';
import SetupsCards from './SetupsCards';

import { SetupCollection } from '@/types/dataprops';

interface SetupProductResponse {
    status:boolean;
    setupcollection:SetupCollection[];
}



export default function Setups() {
    let [setupProducts, setSetupProducts] = useState<SetupCollection[]>();

    useEffect(() => {
        axios.get<SetupProductResponse>('/api/setups/setupcollection')
        .then(res => setSetupProducts(res.data.setupcollection))
        .catch(err => console.error(err));
    }, []);

    return (
        <MainLayoutSetups>
            <SetupsComponentLayout 
            >
              {setupProducts?.map((setupProduct) => (
                <SetupsCards 
                  key={setupProduct.setupId}
                  setupProduct={setupProduct}
                />
              ))}    
            </SetupsComponentLayout>
        </MainLayoutSetups>
    );
}
