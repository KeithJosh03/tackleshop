/**
 * Convert a string into a URL-safe slug.
 * e.g. "Shimano Reel XR-4000" → "shimano-reel-xr-4000"
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')   // remove non-word chars (except spaces & hyphens)
        .replace(/[\s_]+/g, '-')    // collapse whitespace / underscores → single hyphen
        .replace(/-+/g, '-')        // collapse consecutive hyphens
        .replace(/^-+|-+$/g, '');   // trim leading/trailing hyphens
}
