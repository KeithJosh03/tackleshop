import { Metadata } from 'next';
import BrandClient from './BrandClient';

interface PageProps {
    params: Promise<{
        brandName: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { brandName } = await params;
    const displayName = brandName.replaceAll("-", " ").toUpperCase();

    const title = `${displayName} Fishing Gear | Shop ${displayName} at SmoothCast`;
    const description = `Shop the latest ${displayName} fishing gear and accessories at SmoothCast. Browse our extensive collection of high-quality tackle.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { brandName } = await params;

    // Construct CollectionPage Schema (JSON-LD)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${brandName.replaceAll("-", " ").toUpperCase()} Fishing Gear`,
        description: `Shop our top selection of ${brandName.replaceAll("-", " ").toUpperCase()} fishing gear at SmoothCast.`,
        url: `https://yourdomain.com/brand/${brandName}`
    };

    return (
        <>
            {/* Inject JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BrandClient brandName={brandName} />
        </>
    );
}
