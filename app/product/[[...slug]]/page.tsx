import ProductDetailClient from "./productDetailClient";
import { ProductDetails } from "@/lib/api/productService";

interface PageProps {
    params: Promise<{
        slug?: string[];
    }>;
}

/**
 * Optional catch-all route: /product/[[...slug]]
 *
 * Expected URL patterns:
 *   /product                                                → no product (404 / fallback)
 *   /product/{productId}/{productName}                      → product without variant pre-selection
 *   /product/{productId}/{productName}/variant/{variantOptionId}/{variantSlug}
 *                                                           → product with variant pre-selected
 */
export default async function Page({ params }: PageProps) {
    const { slug } = await params;

    // slug[0] = productId, slug[1] = productName (ignored, cosmetic)
    const productId = slug?.[0] ? Number(slug[0]) : null;

    if (!productId) {
        return <div>Product not found</div>;
    }

    // slug[2] = "variant" keyword, slug[3] = variantOptionId
    const initialVariantId =
        slug?.[2] === "variant" && slug?.[3] ? Number(slug[3]) : null;

    const productDetails = await ProductDetails(productId);

    if (!productDetails) {
        return <div>Product not found</div>;
    }

    return (
        <ProductDetailClient
            productDetailProps={productDetails}
            initialVariantId={initialVariantId}
        />
    );
}
