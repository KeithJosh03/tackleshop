import HeaderClient from './HeaderClient';
import { showBrandListName } from '@/lib/api/brandService';
import { CategoryList } from '@/lib/api/categoryService';

export default async function Header() {
  const brands = await showBrandListName();
  const categories = await CategoryList();

  console.log(brands);
  console.log(categories);

  return (
    <HeaderClient
      brands={brands}
      categories={categories}
    />
  );
}

