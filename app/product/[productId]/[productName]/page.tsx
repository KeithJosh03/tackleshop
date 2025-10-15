"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import slugify from "slugify";

import Loading from "../../Loading";

import { ProductDetailInitialsProps } from "@/types/dataprops";

interface ProductDetailsInitialsPropsResponse {
  status:boolean;
  productdetail:ProductDetailInitialsProps;
}

export default function ProductRedirect() {
  const router = useRouter();
  const params = useParams();
  const { productId, productName } = params;

  const [isLoading, Loades] = useState<boolean>(true);
  useEffect(() => {
    if (!productId) return;

    axios
      .get<ProductDetailsInitialsPropsResponse>(`/api/products/productsearchinitial/${productId}`)
      .then((res) => {
        const detail = res.data.productdetail;
        if (!detail.variantId === null) return;
        router.replace(
          `/product/${detail.productId}/${slugify(detail.productName).toLowerCase()}/variant/${detail.variantId}`
        );
      })
      .catch((err) => console.error(err));
  }, [productId, productName, router]);

  return <Loading />
}
