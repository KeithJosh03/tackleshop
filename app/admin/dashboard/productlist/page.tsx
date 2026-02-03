'use client';

import { useEffect, useState } from 'react';
// import SearchText from '@/components/SearchText';
import { SearchText } from '@/components';
import {
  ProductListDashboard,
  ProductListDashboardSearch,
} from '@/lib/api/productService';
import { numericConverter } from '@/utils/priceUtils';
import Link from 'next/link';

export default function Page() {
  const [searchProduct, setSearchProduct] = useState('');
  const [productsLists, setProductLists] = useState<ProductListDashboard[]>([]);
  const [page, setPage] = useState(1);

  // REQUIRED for SearchTextTest ❌ button
  const [selectedProduct, setSelectedProduct] =
    useState<ProductListDashboard | undefined>(undefined);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const clearSearch = () => {
    setSearchProduct('');
    setSelectedProduct(undefined);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchProduct(value);
    setPage(1);

    // IMPORTANT: this makes SearchTextTest work without changing it
    if (value) {
      setSelectedProduct({} as ProductListDashboard);
    } else {
      setSelectedProduct(undefined);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ProductListDashboardSearch(searchProduct, page);
        setProductLists(res.products);
        setPagination(res.pagination);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [searchProduct, page]);

  return (
    <div className="flex flex-col border border-greyColor p-4 gap-y-4 font-extrabold rounded bg-blackgroundColor">
      <h1 className="text-primaryColor text-xl">PRODUCT LISTS</h1>

      <SearchText
        placeholderText="Search Product"
        value={searchProduct}
        choosen={selectedProduct}
        onChange={handleSearchChange}
        onClear={clearSearch}
      />

      <div className="overflow-x-auto border border-greyColor rounded">
        <table className="w-full text-sm text-secondary">
          <thead className="bg-primaryColor text-tertiaryColor">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Brand</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Base Price</th>
              <th className="p-3 text-left">Variants</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {productsLists.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-greyColor">
                  No products found
                </td>
              </tr>
            )}

            {productsLists.map((product) => (
              <tr
                key={product.productId}
                className="border-t border-greyColor hover:bg-secondary text-primaryColor"
              >
                <td className="p-3">{product.productId}</td>
                <td className="p-3">{product.productTitle}</td>
                <td className="p-3">{product.brandName}</td>
                <td className="p-3">{product.subCategoryName}</td>
                <td className="p-3">
                  {numericConverter(product.basePrice)}
                </td>

                <td className="p-3 text-xs">
                  {product.productTypeVariant.length > 0 ? (
                    product.productTypeVariant.map((variant) => (
                      <div key={variant.variantTypeName}>
                        <span className="text-primaryColor">
                          {variant.variantTypeName}:
                        </span>{' '}
                        {variant.variantOptions
                          .map((opt) => opt.optionName)
                          .join(', ')}
                      </div>
                    ))
                  ) : (
                    <span className="text-greyColor">—</span>
                  )}
                </td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs rounded border border-primaryColor text-primaryColor">
                      <Link
                      href={`/admin/dashboard/editproduct/${product.productId}`}
                      >
                        Edit
                      </Link>
                    </button>
                    <button className="px-3 py-1 text-xs rounded border border-red-500 text-red-500">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      <div className="flex justify-between items-center text-sm text-secondary mt-4">
        <span>
          Showing {productsLists.length} of {pagination.total} results
        </span>

        <div className="flex gap-2 items-center">
          {/* Previous Button */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border border-greyColor bg-white text-greyColor hover:bg-primaryColor hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Prev
          </button>

          {/* Page Numbers */}
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pNum) => (
            <button
              key={pNum}
              onClick={() => setPage(pNum)}
              className={`px-3 py-1 rounded border ${
                page === pNum
                  ? 'bg-primaryColor text-white border-primaryColor'
                  : 'border-greyColor text-greyColor hover:bg-primaryColor hover:text-white'
              } transition`}
            >
              {pNum}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
            disabled={page === pagination.last_page}
            className="px-3 py-1 rounded border border-greyColor bg-white text-greyColor hover:bg-primaryColor hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>





    </div>
  );
}
