'use client';

import { useState, useEffect } from "react";
import MainLayoutCollection from "./layout";
import CollectionComponentLayout from './CollectionComponentLayout';
import Loading from "./Loading";

import { CategoryCollectionProps } from "@/lib/api/categoryService";

type Props = {
    categoryProductsProps: CategoryCollectionProps[];
};

export default function CollectionClient({ categoryProductsProps }: Props) {
    const [categoryProducts] = useState(categoryProductsProps);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    console.log(categoryProducts);
    return (
        <MainLayoutCollection>
            {loading ? (
                <Loading />
            ) : (
                Array.isArray(categoryProducts) &&
                categoryProducts.length > 0 &&
                categoryProducts.map(({ categoryName, categoryId, products }) => {
                    if (products.length > 0) {
                        return (
                            <CollectionComponentLayout
                                key={categoryId}
                                categoryName={categoryName}
                                products={products}
                            />
                        );
                    }
                })
            )}
        </MainLayoutCollection>
    );
}
