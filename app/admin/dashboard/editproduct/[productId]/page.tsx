import { ProductDetailsEdit } from "@/lib/api/productService";
import EditProductClient from "./ProductClientEdit";

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { productId } = await params;

  const productDetailsEdit = await ProductDetailsEdit(Number(productId));


  if (!productDetailsEdit) {
    return <div>Product not found</div>;
  }

  console.log(productDetailsEdit)

  return (
    <EditProductClient
      productDetailEditProps={productDetailsEdit}
    />
  );
}