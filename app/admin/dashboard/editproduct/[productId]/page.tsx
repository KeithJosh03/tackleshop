import { ProductDetailsEdit } from "@/lib/api/productService";
import EditProductClient from "./editProductClient";


interface PageProps {
  params: {
    productId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { productId } = params;

  const productDetailsEdit = await ProductDetailsEdit(Number(productId));

  if (!productDetailsEdit) {
    return <div>Product not found</div>;
  }

  return (
    <EditProductClient 
    productDetailEditProps={productDetailsEdit} 
    />
  );
}
