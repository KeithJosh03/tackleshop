import { Metadata } from 'next';
import CategoryClient from './CategoryClient';

interface PageProps {
    params: Promise<{
        category: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category } = await params;
    const displayName = category.replaceAll("-", " ").toUpperCase();
    
    const title = `${displayName} Fishing Gear & Tackle | SmoothCast`;
    const description = `Shop our top selection of ${displayName} fishing gear. Explore high-quality products for your next fishing trip at SmoothCast.`;

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
    const { category } = await params;

    // Construct CollectionPage Schema (JSON-LD)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${category.replaceAll("-", " ").toUpperCase()} Fishing Gear`,
        description: `Shop our top selection of ${category.replaceAll("-", " ").toUpperCase()} fishing gear at SmoothCast.`,
        url: `https://yourdomain.com/category/${category}`
    };

    return (
        <>
            {/* Inject JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryClient category={category} />
        </>
    );
}
