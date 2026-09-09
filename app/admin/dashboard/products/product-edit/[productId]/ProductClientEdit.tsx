'use client';

import React from 'react';
import { ProductForm } from '@/components/ProductForm';

interface ProductClientEditProps {
  productId: string;
  initialData: any;
}

export default function ProductClientEdit({ productId, initialData }: ProductClientEditProps) {
  return <ProductForm mode="edit" productId={productId} initialData={initialData} />;
}
