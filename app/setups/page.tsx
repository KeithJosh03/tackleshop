import { Metadata } from 'next';
import { Suspense } from 'react';
import SetupsClient from './SetupsClient';

export const metadata: Metadata = {
    title: 'Curated Fishing Setups & Bundles | SmoothCast',
    description:
        'Shop expertly assembled fishing setups and bundles. Everything you need for your next trip in one hassle-free package.',
    openGraph: {
        title: 'Curated Fishing Setups & Bundles | SmoothCast',
        description:
            'Shop expertly assembled fishing setups and bundles at SmoothCast.',
        type: 'website',
    },
};

function SetupsLoading() {
    return (
        <div className="min-h-[50vh] flex items-center justify-center text-[#a28d7e] font-semibold uppercase tracking-wider text-sm">
            Loading setups...
        </div>
    );
}

export default function SetupsPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Fishing Setups & Bundles',
        description: 'Curated fishing setups and bundle deals at SmoothCast.',
        url: 'https://yourdomain.com/setups',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Suspense fallback={<SetupsLoading />}>
                <SetupsClient />
            </Suspense>
        </>
    );
}
