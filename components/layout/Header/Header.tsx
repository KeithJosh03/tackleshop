// components/Header.tsx
import HeaderClient from './HeaderClient';
import { BrandListNameSearchHeader } from '@/lib/api/brandService';
import { CategoryListNameSearchHeader } from '@/lib/api/categoryService';

export default async function Header() {
  const [brands, categories] = await Promise.all([
    BrandListNameSearchHeader(),
    CategoryListNameSearchHeader(),
  ]);

  return <HeaderClient initialBrands={brands} initialCategories={categories} />;
}