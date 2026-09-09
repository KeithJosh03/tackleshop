import React from 'react';
import { getProductById } from '@/lib/api/productService';
import ProductClientEdit from './ProductClientEdit';

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { productId } = await params;
  let initialData = null;

  try {
    initialData = await getProductById(productId);
  } catch (error) {
    console.error(`Error loading product #${productId}:`, error);
  }

  console.log(initialData)

  return <ProductClientEdit productId={productId} initialData={initialData} />;
}