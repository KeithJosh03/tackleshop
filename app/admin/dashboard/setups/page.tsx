"use client";

import React, { useState } from "react";

export interface VariantOption {
  id: number;
  name: string;
  price_adjustment: number;
  variantTypeId?: number;
}

export interface VariantType {
  id: number;
  name: string;
  options: VariantOption[];
}

export interface Product {
  id: number;
  name: string;
  base_price: number;
  variantTypes?: VariantType[];
}

export interface SetupItem {
  product: Product;
  selectedOptions: VariantOption[];
}

export default function AddSetup() {
  const [setupName, setSetupName] = useState("");
  const [items, setItems] = useState<SetupItem[]>([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // MOCK PRODUCTS
  const products: Product[] = [
    {
      id: 1,
      name: "Tukob Nomadic Piercer Jigheads",
      base_price: 210,
      variantTypes: [
        {
          id: 1,
          name: "Weight",
          options: [
            { id: 1, name: "1g", price_adjustment: 0, variantTypeId: 1 },
            { id: 2, name: "9g", price_adjustment: 10, variantTypeId: 1 },
          ],
        },
        {
          id: 2,
          name: "Hook Thickness",
          options: [
            {
              id: 3,
              name: "Thin Hook 0.04mm",
              price_adjustment: 0,
              variantTypeId: 2,
            },
            {
              id: 4,
              name: "Thin Hook 0.06mm",
              price_adjustment: 10,
              variantTypeId: 2,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "DECOY BULLET SINKER",
      base_price: 180,
      variantTypes: [
        {
          id: 1,
          name: "Size",
          options: [
            { id: 5, name: "7g", price_adjustment: 0, variantTypeId: 1 },
            { id: 6, name: "9g", price_adjustment: 10, variantTypeId: 1 },
          ],
        },
      ],
    },
  ];

  // Search Handler
  const handleSearch = (value: string) => {
    setSearch(value);
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const addProduct = (product: Product) => {
    setItems((prev) => [
      ...prev,
      { product, selectedOptions: [] },
    ]);
    setSearch(""); // clear search
    setFilteredProducts([]); // hide dropdown
  };

  const updateVariant = (itemIndex: number, option: VariantOption) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[itemIndex].selectedOptions =
        updated[itemIndex].selectedOptions.filter(
          (o) => o.variantTypeId !== option.variantTypeId
        );
      updated[itemIndex].selectedOptions.push(option);
      return updated;
    });
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const optionTotal = item.selectedOptions.reduce(
        (sum, o) => sum + o.price_adjustment,
        0
      );
      return total + item.product.base_price + optionTotal;
    }, 0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Create Setup</h1>

      {/* Setup Name */}
      <input
        type="text"
        placeholder="Setup Name"
        className="w-full border p-2 rounded"
        value={setupName}
        onChange={(e) => setSetupName(e.target.value)}
      />

      {/* Product Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Product..."
          className="w-full border p-2 rounded"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {search && filteredProducts.length > 0 && (
          <ul className="absolute w-full bg-white border rounded shadow mt-1 z-10 max-h-60 overflow-auto">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                onClick={() => addProduct(product)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Setup Items */}
      {items.map((item, index) => (
        <div key={index} className="border p-4 rounded space-y-3">
          <div className="flex justify-between">
            <h3 className="font-semibold">{item.product.name}</h3>
            <button
              onClick={() =>
                setItems((prev) => prev.filter((_, i) => i !== index))
              }
              className="text-red-500"
            >
              Remove
            </button>
          </div>

          {item.product.variantTypes?.map((variant) => {
            const selectedOption = item.selectedOptions.find(
              (o) => o.variantTypeId === variant.id
            );

            return (
              <div key={variant.id}>
                <label className="block font-medium">{variant.name}</label>
                <select
                  value={selectedOption?.id || ""}
                  className="border p-2 rounded w-full"
                  onChange={(e) => {
                    const option = variant.options.find(
                      (o) => o.id === Number(e.target.value)
                    );
                    if (option) updateVariant(index, option);
                  }}
                >
                  <option value="">Select {variant.name}</option>
                  {variant.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} (+{option.price_adjustment})
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      ))}

      {/* Total */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-bold">
          Total: ₱ {calculateTotal().toFixed(2)}
        </h2>
      </div>

      <button className="bg-black text-white px-6 py-2 rounded">
        Save Setup
      </button>
    </div>
  );
}