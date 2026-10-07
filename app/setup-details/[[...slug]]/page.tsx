import { Metadata } from 'next';
import SetupDetailClient from './setupDetailClient';
import { fetchSetupViewDetails } from '@/lib/api/setupService';

interface PageProps {
    params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const setupId = slug?.[0] ? Number(slug[0]) : null;

    if (!setupId) {
        return { title: 'Setup Not Found | SmoothCast' };
    }

    const setup = await fetchSetupViewDetails(setupId);
    if (!setup) {
        return { title: 'Setup Not Found | SmoothCast' };
    }

    const title = `${setup.bundleTitle} | SmoothCast Setups`;
    const rawDesc = setup.description ? setup.description.replace(/<[^>]+>/g, '').trim() : '';
    const description =
        rawDesc.substring(0, 155) + (rawDesc.length > 155 ? '...' : '') ||
        `Shop the ${setup.bundleTitle} bundle at SmoothCast.`;
    const images =
        setup.setupMedias?.filter((m) => m.isMain).map((m) => m.imageUrl).filter(Boolean) ||
        setup.setupMedias?.map((m) => m.imageUrl).filter(Boolean) ||
        [];

    return {
        title,
        description,
        openGraph: { title, description, images: images.length ? images : undefined, type: 'website' },
        twitter: { card: 'summary_large_image', title, description, images: images.length ? images : undefined },
    };
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const setupId = slug?.[0] ? Number(slug[0]) : null;

    if (!setupId) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-ma-on-surface-variant text-lg font-medium">
                Setup not found
            </div>
        );
    }

    const setupDetails = await fetchSetupViewDetails(setupId);

    if (!setupDetails) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-ma-on-surface-variant text-lg font-medium">
                Setup not found
            </div>
        );
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: setupDetails.bundleTitle,
        sku: setupDetails.sku,
        description: setupDetails.description ? setupDetails.description.replace(/<[^>]+>/g, '') : '',
        image: setupDetails.setupMedias?.filter((m) => m.isMain).map((m) => m.imageUrl) || [],
        offers: {
            '@type': 'Offer',
            url: `https://yourdomain.com/setup-details/${slug?.join('/')}`,
            priceCurrency: 'PHP',
            price: setupDetails.finalPrice,
            availability: setupDetails.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        },
    };

    console.log(setupDetails);
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <SetupDetailClient setupDetailProps={setupDetails} />
        </>
    );
}
