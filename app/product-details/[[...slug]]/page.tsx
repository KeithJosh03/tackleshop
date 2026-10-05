import ProductDetailClient from "./productDetailClient";
import { ProductViewDetails } from "@/lib/api/productService";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{
        slug?: string[];
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const productId = slug?.[0] ? Number(slug[0]) : null;

    if (!productId) {
        return {
            title: 'Product Not Found | SmoothCast',
            description: 'The requested product could not be found.',
        };
    }

    const productDetails = await ProductViewDetails(productId);

    if (!productDetails) {
        return {
            title: 'Product Not Found | SmoothCast',
        };
    }

    const title = `${productDetails.productTitle} | SmoothCast`;
    // Clean up description HTML or use a fallback
    const rawDesc = productDetails.description ? productDetails.description.replace(/<[^>]+>/g, '').trim() : '';
    const description = rawDesc.substring(0, 155) + (rawDesc.length > 155 ? '...' : '') || `Buy the ${productDetails.productTitle} at SmoothCast.`;
    const images = (productDetails.productMedias?.filter(m => m.isMain).map(m => m.imageUrl).filter(Boolean) || productDetails.productMedias?.map(m => m.imageUrl).filter(Boolean) || []) as string[];

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: images.length > 0 ? images : undefined,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: images.length > 0 ? images : undefined,
        }
    };
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

    // Determine availability
    let isAvailable = false;
    if (productDetails.hasVariants && productDetails.productSkus && productDetails.productSkus.length > 0) {
        isAvailable = productDetails.productSkus.some(row => Number(row.stockQuantity) > 0);
    } else {
        isAvailable = Number(productDetails.stockQuantity) > 0;
    }

    // Construct Product Schema (JSON-LD)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productDetails.productTitle,
        image: productDetails.productMedias?.filter(m => m.isMain).map(m => m.imageUrl) || [],
        description: productDetails.description ? productDetails.description.replace(/<[^>]+>/g, '') : '',
        sku: productDetails.sku || productDetails.productSkus?.[0]?.skuCode || '',
        offers: {
            '@type': 'Offer',
            url: `https://yourdomain.com/product-details/${slug?.join('/')}`,
            priceCurrency: 'USD',
            price: productDetails.basePrice,
            availability: isAvailable
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        }
    };

    return (
        <>
            {/* Inject JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient
                productDetailProps={productDetails}
                initialVariantId={initialVariantId}
            />
        </>
    );
}
