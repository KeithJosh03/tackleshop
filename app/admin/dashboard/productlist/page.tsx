'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchText } from '@/components';
import {
  ProductListDashboard,
  ProductListDashboardSearch,
  DeleteProductDashboard,
} from '@/lib/api/productService';
import { numericConverter } from '@/utils/priceUtils';
import Link from 'next/link';

export default function Page() {
  const [searchProduct, setSearchProduct] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [productsLists, setProductLists] = useState<ProductListDashboard[]>([]);
  const [page, setPage] = useState(1);

  // REQUIRED for SearchTextTest ❌ button
  const [selectedProduct, setSelectedProduct] =
    useState<ProductListDashboard | undefined>(undefined);

  const [productToDelete, setProductToDelete] = useState<ProductListDashboard | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await DeleteProductDashboard(productToDelete.productId);
        setProductLists((prev) => prev.filter((p) => p.productId !== productToDelete.productId));
        setProductToDelete(null);
        setStatusType('success');
        setStatusMessage('Product deleted successfully!');
        setTimeout(() => {
          setStatusMessage(null);
          setStatusType(null);
        }, 5000);
      } catch (error: any) {
        console.error('Failed to delete product', error);
        setProductToDelete(null);
        setStatusType('error');
        setStatusMessage('Failed to delete product.');
        setTimeout(() => {
          setStatusMessage(null);
          setStatusType(null);
        }, 7000);
      }
    }
  };

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const clearSearch = () => {
    setSearchProduct('');
    setDebouncedSearch('');
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

  // Debounce: update debouncedSearch 400ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchProduct.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchProduct]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ProductListDashboardSearch(debouncedSearch, page);
        console.log(res);
        setProductLists(res.products);
        setPagination(res.pagination);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [debouncedSearch, page]);


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
                    <button
                      onClick={() => setProductToDelete(product)}
                      className="px-3 py-1 text-xs rounded border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
                    >
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
              className={`px-3 py-1 rounded border ${page === pNum
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



      {/* ── Delete Confirmation Modal ── */}
      {productToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="bg-[#111A2D] border border-[#2A3441] rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm transform transition-all"
            style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto mb-4 border border-red-500/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-white text-center tracking-wide">Delete Product</h3>
              <p className="text-secondary text-sm text-center mt-2 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-bold">{productToDelete.productTitle}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex border-t border-[#2A3441]">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-3 text-sm font-bold text-secondary hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                style={{ borderRight: '1px solid #2A3441' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 text-sm font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${statusType === 'success' ? 'bg-[#1a2e1d] border-green-500/30' : 'bg-[#2e1a1a] border-red-500/30'
              }`}
          >
            {statusType === 'success' ? (
              <svg className="w-6 h-6 text-green-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <div className="flex flex-col max-w-[300px]">
              <span className={`text-sm font-bold ${statusType === 'success' ? 'text-green-400' : 'text-red-400'} uppercase tracking-wider`}>
                {statusType === 'success' ? 'Success' : 'Error'}
              </span>
              <p className="text-white text-sm font-medium mt-0.5 leading-snug">{statusMessage}</p>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="ml-4 text-secondary hover:text-white transition-colors shrink-0"
              title="Close notification"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
