import { SetupDetailsViewProps } from '@/types/setupTypes';
import { apiClient } from './apiClient';

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export async function fetchSetupViewDetails(id: number): Promise<SetupDetailsViewProps | null> {
    try {
        const response = await apiClient<{ status: boolean; data?: SetupDetailsViewProps }>(
            `/api/setups/setupviewdetails/${id}`,
            {
                next: {
                    revalidate: 300,
                    tags: [`setup-details-${id}`, 'setup-details'],
                },
            }
        );
        return response?.data ?? null;
    } catch (error) {
        console.error(`fetchSetupViewDetails error for ID ${id}:`, error);
        return null;
    }
}

export function buildSetupDetailsPath(setupId: number, slugOrTitle: string): string {
    const segment = slugOrTitle.trim() || String(setupId);
    return `/setup-details/${setupId}/${segment}`;
}

export interface SetupCategoryGroup {
    id: number;
    name: string;
    slug?: string;
    setups?: SetupListItem[];
}

export interface SetupListItem {
    setup_id: number;
    bundle_title: string;
    slug?: string;
    description?: string;
    bundle_price: number;
    retail_price?: number;
    pricing_type?: string;
    setup_category_id?: number | null;
    created_at?: string;
    items?: { product?: { product_title?: string } }[];
    inclusions?: unknown[];
    main_image?: { image_url?: string; url?: string };
    mainImage?: { image_url?: string; url?: string };
    categoryName?: string;
    categorySlug?: string;
}

export interface GroupedSetupsResponse {
    status: boolean;
    data: {
        categories: SetupCategoryGroup[];
        uncategorized: SetupListItem[];
    };
}

function normalizeSetup(setup: SetupListItem): SetupListItem {
    return {
        ...setup,
        main_image: setup.main_image ?? setup.mainImage,
    };
}

export function flattenGroupedSetups(data: GroupedSetupsResponse['data']): SetupListItem[] {
    const seen = new Set<number>();
    const result: SetupListItem[] = [];

    const pushUnique = (setup: SetupListItem, meta?: { categoryName?: string; categorySlug?: string }) => {
        if (seen.has(setup.setup_id)) return;
        seen.add(setup.setup_id);
        result.push({
            ...normalizeSetup(setup),
            ...meta,
        });
    };

    for (const category of data.categories || []) {
        for (const setup of category.setups || []) {
            pushUnique(setup, { categoryName: category.name, categorySlug: category.slug });
        }
    }

    for (const setup of data.uncategorized || []) {
        pushUnique(setup);
    }

    return result;
}

export async function fetchGroupedSetups(): Promise<SetupListItem[] | null> {
    try {
        const res = await fetch(`${BASE_URL}/api/setups-grouped`, {
            headers: { Accept: 'application/json' },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error('[setupService] setups-grouped failed', res.status);
            return null;
        }

        const json: GroupedSetupsResponse = await res.json();
        if (!json.status || !json.data) return null;

        return flattenGroupedSetups(json.data);
    } catch (error) {
        console.error('[setupService] fetchGroupedSetups', error);
        return null;
    }
}

const PAGE_SIZE = 8;

export function filterAndSortSetups(
    setups: SetupListItem[],
    options: {
        search: string;
        maxBudget: string;
        sort: string;
        categorySlug?: string | null;
    }
): SetupListItem[] {
    let list = [...setups];

    if (options.categorySlug) {
        const slug = options.categorySlug.toLowerCase();
        list = list.filter(
            (s) =>
                s.categorySlug?.toLowerCase() === slug ||
                String(s.setup_category_id) === slug
        );
    }

    const q = options.search.trim().toLowerCase();
    if (q) {
        list = list.filter(
            (s) =>
                s.bundle_title?.toLowerCase().includes(q) ||
                s.description?.toLowerCase().includes(q) ||
                s.categoryName?.toLowerCase().includes(q)
        );
    }

    if (options.maxBudget) {
        const max = parseFloat(options.maxBudget);
        if (!Number.isNaN(max) && max > 0) {
            list = list.filter((s) => Number(s.bundle_price) <= max);
        }
    }

    switch (options.sort) {
        case 'price_low':
            list.sort((a, b) => Number(a.bundle_price) - Number(b.bundle_price));
            break;
        case 'price_high':
            list.sort((a, b) => Number(b.bundle_price) - Number(a.bundle_price));
            break;
        case 'newest':
        default:
            list.sort((a, b) => {
                const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
                const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
                return tb - ta;
            });
            break;
    }

    return list;
}

export function paginateSetups<T>(items: T[], page: number, pageSize = PAGE_SIZE) {
    const lastPage = Math.max(1, Math.ceil(items.length / pageSize));
    const safePage = Math.min(Math.max(1, page), lastPage);
    const start = (safePage - 1) * pageSize;
    return {
        items: items.slice(start, start + pageSize),
        currentPage: safePage,
        lastPage,
        hasMore: safePage < lastPage,
        total: items.length,
    };
}

export { PAGE_SIZE as SETUPS_PAGE_SIZE };
