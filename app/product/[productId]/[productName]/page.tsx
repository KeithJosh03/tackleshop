import ProductDetailClient from "./productDetailClient";
import { ProductDetails } from "@/lib/api/productService";

interface PageProps {
  params: {
    productId: string;
    productName: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { productId } = params;

  const productDetails = await ProductDetails(Number(productId));

  if (!productDetails) {
    return <div>Product not found</div>;
  }

  return (
    <ProductDetailClient 
    productDetailProps={productDetails} 
    />
  );
}
