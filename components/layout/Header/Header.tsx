import HeaderClient from './HeaderClient';
import { BrandListNameSearchHeader } from '@/lib/api/brandService';
import { CategoryListNameSearchHeader } from '@/lib/api/categoryService';

export default async function Header() {
  const brands = await BrandListNameSearchHeader();
  const categories = await CategoryListNameSearchHeader();

  return (
    <HeaderClient
      brands={brands}
      categories={categories}
    />
  );
}

