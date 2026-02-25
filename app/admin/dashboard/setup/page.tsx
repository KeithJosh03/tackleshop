'use client';

import React, { useState } from 'react';

interface VariantOption {
  variantOptionId: number;
  value: string;
}

interface VariantType {
  variantTypeId: number;
  variantTypeName: string;
  options: VariantOption[];
}

interface Product {
  productId: number;
  productTitle: string;
  hasVariants: boolean;
  variantTypes: VariantType[];
}

// Selected items per product
type SelectedItems = {
  [productId: number]:
    | true // for products without variants
    | {
        [variantTypeId: number]: number; // variantTypeId -> variantOptionId
      };
};

export default function SetupPage() {
  const allProducts: Product[] = [
    {
      productId: 1,
      productTitle: 'Fishing Rod',
      hasVariants: true,
      variantTypes: [
        {
          variantTypeId: 1,
          variantTypeName: 'Size',
          options: [
            { variantOptionId: 1, value: 'Small' },
            { variantOptionId: 2, value: 'Medium' },
          ],
        },
        {
          variantTypeId: 2,
          variantTypeName: 'Weight',
          options: [
            { variantOptionId: 3, value: '7g' },
            { variantOptionId: 4, value: '10g' },
          ],
        },
      ],
    },
    {
      productId: 2,
      productTitle: 'Fishing Reel',
      hasVariants: false,
      variantTypes: [],
    },
    {
      productId: 3,
      productTitle: 'Bait',
      hasVariants: false,
      variantTypes: [],
    },
  ];

  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});

  // Filter products based on search input
  const filteredProducts = allProducts.filter((p) =>
    p.productTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleProductSelect = (product: Product) => {
    if (product.hasVariants) {
      setSelectedItems((prev) => ({
        ...prev,
        [product.productId]: prev[product.productId] || {},
      }));
    } else {
      setSelectedItems((prev) => ({
        ...prev,
        [product.productId]: true,
      }));
    }
  };

  const handleVariantChange = (
    productId: number,
    variantTypeId: number,
    optionId: number
  ) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: {
        ...((prev[productId] as Record<number, number>) ?? {}),
        [variantTypeId]: optionId,
      },
    }));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Setup</h1>

      <input
        type="text"
        placeholder="Search products..."
        className="border p-2 w-full mb-4 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredProducts.map((product) => (
        <div
          key={product.productId}
          className="border rounded p-4 mb-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{product.productTitle}</h2>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => handleProductSelect(product)}
            >
              {selectedItems[product.productId] ? 'Selected' : 'Add'}
            </button>
          </div>

          {selectedItems[product.productId] && product.hasVariants && (
            <div className="mt-3 space-y-3">
              {product.variantTypes.map((vt) => (
                <div key={vt.variantTypeId}>
                  <p className="font-medium">{vt.variantTypeName}:</p>
                  <div className="flex space-x-3 mt-1">
                    {vt.options.map((opt) => (
                      <label
                        key={opt.variantOptionId}
                        className="inline-flex items-center border rounded px-2 py-1 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`product-${product.productId}-variant-${vt.variantTypeId}`}
                          value={opt.variantOptionId}
                          checked={
                            (selectedItems[product.productId] as Record<
                              number,
                              number
                            >)?.[vt.variantTypeId] === opt.variantOptionId
                          }
                          onChange={() =>
                            handleVariantChange(
                              product.productId,
                              vt.variantTypeId,
                              opt.variantOptionId
                            )
                          }
                          className="mr-2"
                        />
                        {opt.value}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="mt-6">
        <h3 className="text-lg font-bold">Selected Setup Items:</h3>
        <pre className="bg-gray-100 p-3 rounded mt-2">
          {JSON.stringify(selectedItems, null, 2)}
        </pre>
      </div>
    </div>
  );
}
