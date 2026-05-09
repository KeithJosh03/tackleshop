import CollectionClient from "./CollectionClient";
import { fetchCategoryCollection } from "@/lib/api/categoryService";

export default async function Collections() {
  const categoryProducts = await fetchCategoryCollection();
  return (
    <CollectionClient
      categoryProductsProps={categoryProducts}
    />
  );
}


