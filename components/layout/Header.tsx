import HeaderClient from './HeaderClient';
import { showBrand } from '@/lib/api/brandService';
import { CategoryHeader } from '@/lib/api/categoryService';

export default async function Header() {
  const brands = await showBrand();
  const categories = await CategoryHeader();

  return (
    <HeaderClient
      brands={brands}
      categories={categories}
    />
  );
}

