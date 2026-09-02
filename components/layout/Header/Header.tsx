import HeaderClient from './HeaderClient';
import { showBrandListName } from '@/lib/api/brandService';
import { categoryList } from '@/lib/api/categoryService';

export default async function Header() {
  const brands = await showBrandListName();
  const categories = await categoryList();

  return (
    <HeaderClient
      brands={brands}
      categories={categories}
    />
  );
}

