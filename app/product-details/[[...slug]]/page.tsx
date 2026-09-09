import ProductDetailClient from "./productDetailClient";
import { ProductViewDetails } from "@/lib/api/productService";

interface PageProps {
    params: Promise<{
        slug?: string[];
    }>;
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;

    const productId = slug?.[0] ? Number(slug[0]) : null;

    if (!productId) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-ma-on-surface-variant text-lg font-medium">
                Product not found
            </div>
        );
    }

    const initialVariantId =
        slug?.[2] === "variant" && slug?.[3] ? Number(slug[3]) : null;

    const productDetails = await ProductViewDetails(productId);

    if (!productDetails) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-ma-on-surface-variant text-lg font-medium">
                Product not found
            </div>
        );
    }
    return (
        <ProductDetailClient
            productDetailProps={productDetails}
            initialVariantId={initialVariantId}
        />
    );
}
