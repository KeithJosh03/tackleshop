// Page Component
'use client';

import { BrandProps } from '@/types/brandType';
import { CategoryProps } from '@/types/categoryType';
import { ProductListDashboard, PaginationProps } from '@/types/productTypes';
import DashboardSelectBrand from '@/components/adminUI/DashboardSelectBrand';
import DashboardSelectCategory from '@/components/adminUI/DashboardSelectCategory';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ProductListDashboardSearch,
  DeleteProductDashboard
} from '@/lib/api/productService';
import { numericConverter } from '@/utils/priceUtils';
import Link from 'next/link';
import { worksans, inter } from '@/types/fonts';

import {
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function Page() {
  const [searchProduct, setSearchProduct] = useState('');
  const [page, setPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<BrandProps | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryProps | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [productsLists, setProductLists] = useState<ProductListDashboard[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchProduct(e.target.value);
    setPage(1);
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchProduct.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchProduct]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const brandId = selectedBrand ? selectedBrand.brandId : null;
        const categoryId = selectedCategory ? selectedCategory.categoryId : null;
        const res = await ProductListDashboardSearch(debouncedSearch, page, brandId, categoryId);
        setProductLists(res.products);
        setPagination(res.pagination);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, page, selectedBrand, selectedCategory]);

  const toggleRow = (id: number) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };
  return (
    <div className={`${worksans.className} flex flex-col gap-y-6 text-[#d9e3f4] h-full`}>
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Product Catalog</h1>
          <p className={`${inter.className} text-[#a6a7a6] text-sm mt-1`}>
            Manage your tackle inventory, SKUs, and stock levels.
          </p>
        </div>
        <Link href="/admin/dashboard/products/product-add" className="self-start sm:self-auto">
          <CustomPrimaryButton isSelected className="py-2.5 px-5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </CustomPrimaryButton>
        </Link>
      </div>

      {/* ── FILTERS ── */}

      <div className="bg-[#121c28] border border-[#2c3542] rounded-xl p-4 flex flex-col gap-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a6a7a6]" />
            <input
              type="text"
              placeholder="Search by Product Title, SKU, or Brand..."
              value={searchProduct}
              onChange={handleSearchChange}
              className={`${inter.className} w-full bg-[#0a1420] border border-[#303a47] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ffb77c]/50 transition-colors`}
            />
          </div>
          <div className="flex gap-4">
            <div className="w-48 relative z-[60] bg-[#212b37] border border-[#303a47] rounded-lg">
              <DashboardSelectBrand
                reducerType="FILTER"
                choosenBrand={selectedBrand}
                onSelectBrand={setSelectedBrand}
                customPlaceholder="Brand: All"
              />
            </div>
            <div className="w-48 relative z-[50] bg-[#212b37] border border-[#303a47] rounded-lg">
              <DashboardSelectCategory
                ReducerType="FILTER"
                currentCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                customPlaceholder="Category: All"
              />
            </div>
            <select className={`${inter.className} bg-[#212b37] border border-[#303a47] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none appearance-none pr-8 cursor-pointer`}>
              <option>Status: All</option>
            </select>
            <button className="bg-[#212b37] border border-[#303a47] hover:bg-[#303a47] text-white p-2.5 rounded-lg transition-colors flex items-center justify-center">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

      {/* ── PRODUCT LIST ── */}
      <div className="bg-[#121c28] border border-[#2c3542] rounded-xl flex flex-col flex-1 overflow-hidden">

        <div className="grid grid-cols-[auto_2fr_1fr_1fr_1.5fr_auto] gap-4 p-5 border-b border-[#2c3542] items-center bg-[#16202c]">
          <div className="flex items-center">
            <input type="checkbox" className="w-4 h-4 rounded bg-[#0a1420] border-[#303a47] text-[#ffb77c] focus:ring-[#ffb77c]/50" />
          </div>
          <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider">Product Info</div>
          <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider">Brand</div>
          <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider">Base Price</div>
          <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider">Variants & Stock</div>
          <div className="text-[#a6a7a6] text-[11px] font-bold uppercase tracking-wider text-right pr-4">Actions</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="grid grid-cols-[auto_2fr_1fr_1fr_1.5fr_auto] gap-4 p-5 items-center border-b border-[#212b37] animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-40 bg-[#212b37] rounded"></div>
                      <div className="h-3 w-24 bg-[#16202c] rounded"></div>
                    </div>
                  </div>
                  <div>
                    <div className="h-5 w-20 bg-[#212b37] rounded"></div>
                  </div>
                  <div>
                    <div className="h-4 w-16 bg-[#212b37] rounded"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="h-3 w-24 bg-[#212b37] rounded"></div>
                    <div className="h-4 w-32 bg-[#16202c] rounded-full"></div>
                  </div>
                  <div className="flex justify-end gap-3 pr-2">
                    <div className="h-4 w-4 bg-[#212b37] rounded"></div>
                    <div className="h-4 w-4 bg-[#212b37] rounded"></div>
                    <div className="h-4 w-4 bg-[#212b37] rounded"></div>
                    <div className="h-6 w-6 bg-[#212b37] rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : productsLists.length === 0 ? (
            <div className="p-8 text-center text-[#a6a7a6]">No products found</div>
          ) : (
            productsLists.map((product) => {
              const isExpanded = expandedRows.includes(product.productId);

              return (
                <div key={product.productId} className="flex flex-col border-b border-[#212b37] last:border-b-0">
                  <div className={`grid grid-cols-[auto_2fr_1fr_1fr_1.5fr_auto] gap-4 p-5 items-center hover:bg-[#16202c]/50 transition-colors ${isExpanded ? 'bg-[#16202c]/30' : ''}`}>
                    {/* <div className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 rounded bg-[#0a1420] border-[#303a47] text-[#ffb77c] focus:ring-[#ffb77c]/50" />
                    </div> */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col min-w-0">
                        <span className="text-white font-bold text-sm truncate">{product.productTitle}</span>
                        <span className="text-[#a6a7a6] text-xs truncate">Category {'>'} {product.subCategoryName}</span>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#212b37] border border-[#303a47] text-[#d9e3f4] text-[11px] font-semibold uppercase tracking-wider">
                        {product.brandName}
                      </span>
                    </div>
                    <div className={`${inter.className} text-white font-medium text-sm`}>
                      {numericConverter(product.basePrice)}
                    </div>
                    <div className="flex flex-col gap-1">
                      {product.hasVariants ? (
                        <>
                          <div className="flex items-center gap-1 text-[#d9e3f4] text-[11px] font-semibold">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            {product.productTypeVariant?.length || 0} Attributes
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-[#a6a7a6] font-medium">{product.productSkus.length} Total SKUs</span>
                            <span className="bg-[#1a2e1d] text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              [ {product.productSkus.reduce((acc, sku) => acc + sku.stockQuantity, 0)} Units ]
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1 text-[#d9e3f4] text-[11px] font-semibold">
                            <span className="text-[#a6a7a6] font-normal">SKU:</span> <span className="font-mono text-[#a6a7a6]">{product.sku || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs mt-0.5">
                            <span className="text-[#a6a7a6] font-medium">Standard Item</span>
                            <span className="bg-[#1a2e1d] text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              [ {product.stockQuantity || 0} Units ]
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-3 pr-2">
                      <button className="text-[#a6a7a6] hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                      <Link
                        href={`/admin/dashboard/products/product-edit/${product.productId}`}
                        className="text-[#a6a7a6] hover:text-[#ffb77c] transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => console.log("product details delete", product)}
                        className="text-[#a6a7a6] hover:text-[#ffb4ab] transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {product.hasVariants ? (
                        <button onClick={() => toggleRow(product.productId)} className="text-[#a6a7a6] hover:text-white transition-colors w-6 h-6 flex items-center justify-center bg-[#212b37] rounded-full">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      ) :
                        (
                          <div className="w-6 h-6"></div>
                        )}
                    </div>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-l-2 border-[#ffb77c] ml-[28px] mr-5 mb-4 bg-[#16202c] rounded-r-lg"
                      >
                        <div className="p-4">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-[#2c3542]">
                                <th className="text-left pb-3 text-[#a6a7a6] text-[10px] uppercase font-bold tracking-wider">Variant Spec</th>
                                <th className="text-left pb-3 text-[#a6a7a6] text-[10px] uppercase font-bold tracking-wider">SKU Code</th>
                                <th className="text-left pb-3 text-[#a6a7a6] text-[10px] uppercase font-bold tracking-wider">Price</th>
                                <th className="text-left pb-3 text-[#a6a7a6] text-[10px] uppercase font-bold tracking-wider">Stock</th>
                                <th className="text-right pb-3 pr-2 text-[#a6a7a6] text-[10px] uppercase font-bold tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className={`${inter.className}`}>
                              {!product.hasVariants ? (
                                <tr className="border-b border-[#212b37] last:border-0 hover:bg-[#212b37]/50">
                                  <td className="py-3 text-[#d9e3f4] font-medium text-xs">Default Variant</td>
                                  <td className="py-3 text-[#a6a7a6] font-mono text-[11px]">{product.sku || 'No SKU'}</td>
                                  <td className="py-3 text-white font-medium text-xs">{numericConverter(product.basePrice)}</td>
                                  <td className="py-3 text-[#d9e3f4] text-xs">{product.stockQuantity || 0} units</td>
                                  <td className="py-3 flex justify-end pr-2">
                                    <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                                      <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                product.productSkus.map((sku) => (
                                  <tr key={sku.skuId} className="border-b border-[#212b37] last:border-0 hover:bg-[#212b37]/50">
                                    <td className="py-3 text-[#d9e3f4] font-medium text-xs">
                                      {sku.variantOptions.map(opt => opt.optionName).join(' / ')}
                                    </td>
                                    <td className="py-3 text-[#a6a7a6] font-mono text-[11px]">{sku.skuCode}</td>
                                    <td className="py-3 text-white font-medium text-xs">{numericConverter(sku.price)}</td>
                                    <td className="py-3 text-[#d9e3f4] text-xs">{sku.stockQuantity} units</td>
                                    <td className="py-3 flex justify-end pr-2">
                                      <div className={`w-8 h-4 rounded-full relative ${sku.isActive ? 'bg-emerald-500' : 'bg-[#ffb4ab]'}`}>
                                        <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow-sm ${sku.isActive ? 'right-0.5' : 'left-0.5'}`}></div>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-[#2c3542] bg-[#0a1420]">
          <div></div>
          <div className={`${inter.className} text-xs text-[#a6a7a6]`}>
            Showing {productsLists.length} of {pagination.total} products
          </div>
          <div className="flex gap-1 items-center mt-4 sm:mt-0">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded flex items-center justify-center border border-[#303a47] text-[#a6a7a6] hover:bg-[#212b37] hover:text-white disabled:opacity-30 transition-colors"
            >
              {'<'}
            </button>
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                className={`w-8 h-8 rounded flex items-center justify-center border transition-colors ${page === pNum
                  ? 'bg-[#ffb77c] border-[#ffb77c] text-[#4d2600] font-bold'
                  : 'border-transparent text-[#a6a7a6] hover:bg-[#212b37] hover:text-white'
                  }`}
              >
                {pNum}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
              disabled={page === pagination.last_page}
              className="w-8 h-8 rounded flex items-center justify-center border border-[#303a47] text-[#a6a7a6] hover:bg-[#212b37] hover:text-white disabled:opacity-30 transition-colors"
            >
              {'>'}
            </button>
          </div>
        </div>

      </div>
      {/* ── Delete Modal ── */}
      {productToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="bg-[#121c28] border border-[#2c3542] rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm"
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#ffb4ab]/10 text-[#ffb4ab] mx-auto mb-4 border border-[#ffb4ab]/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white text-center">Delete Product</h3>
              <p className="text-[#a6a7a6] text-sm text-center mt-2 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-bold">{productToDelete.productTitle}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex border-t border-[#2c3542]">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-3 text-sm font-bold text-[#a6a7a6] hover:text-white hover:bg-white/5 transition-colors border-r border-[#2c3542]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 text-sm font-bold text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${statusType === 'success' ? 'bg-[#1a2e1d] border-emerald-500/30' : 'bg-[#2e1a1a] border-[#ffb4ab]/30'
              }`}
          >
            {statusType === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-[#ffb4ab] shrink-0" />
            )}
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${statusType === 'success' ? 'text-emerald-400' : 'text-[#ffb4ab]'} uppercase tracking-wider`}>
                {statusType === 'success' ? 'Success' : 'Error'}
              </span>
              <p className="text-white text-sm font-medium mt-0.5">{statusMessage}</p>
            </div>
            <button onClick={() => setStatusMessage(null)} className="ml-4 text-[#a6a7a6] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
