import React from 'react';
import { getProductByIdForEdit } from '@/lib/api/productService';
import ProductClientEdit from './ProductClientEdit';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { productId } = await params;

  let initialData = null;

  try {
    initialData = await getProductByIdForEdit(productId);
  } catch (error) {
    console.error(`Error loading product #${productId}:`, error);
  }

  return <ProductClientEdit productId={productId} initialData={initialData} />;
}