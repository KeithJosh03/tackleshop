'use client';

import React from 'react';
import { ProductForm } from '@/components/adminUI/ProductForm';

interface ProductClientEditProps {
  productId: string;
  initialData: any;
}

export default function ProductClientEdit({ productId, initialData }: ProductClientEditProps) {
  if (!initialData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Product Not Found</h2>
        <p className="text-gray-600 max-w-md mb-4">
          Unable to retrieve details for product #{productId}. Please verify that the product exists on the server or check network connectivity.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return <ProductForm mode="edit" productId={productId} initialData={initialData} />;
}