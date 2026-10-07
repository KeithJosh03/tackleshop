import { SetupBundleItem } from '@/types/setupTypes';

export interface SetupChoiceGroup {
    groupName: string;
    options: SetupBundleItem[];
}

export function partitionSetupBundleItems(items: SetupBundleItem[]) {
    const fixed: SetupBundleItem[] = [];
    const groupMap = new Map<string, SetupBundleItem[]>();

    for (const item of items) {
        const group = item.groupName?.trim();
        if (!group) {
            fixed.push(item);
            continue;
        }
        const list = groupMap.get(group) ?? [];
        list.push(item);
        groupMap.set(group, list);
    }

    const choiceGroups: SetupChoiceGroup[] = Array.from(groupMap.entries()).map(([groupName, options]) => ({
        groupName,
        options,
    }));

    return { fixed, choiceGroups };
}

export function buildDefaultGroupSelections(choiceGroups: SetupChoiceGroup[]): Record<string, number> {
    const selections: Record<string, number> = {};
    for (const group of choiceGroups) {
        const first = group.options[0];
        if (first?.setupItemId != null) {
            selections[group.groupName] = first.setupItemId;
        }
    }
    return selections;
}

export interface SetupCartChoice {
    group_name: string;
    setup_item_id: number;
    product_id: number;
    sku_id?: number | null;
    label?: string;
}

export function buildChoicesPayload(
    choiceGroups: SetupChoiceGroup[],
    groupSelections: Record<string, number>
): SetupCartChoice[] {
    return choiceGroups.map(({ groupName, options }) => {
        const setupItemId = groupSelections[groupName];
        const option = options.find((o) => o.setupItemId === setupItemId) ?? options[0];
        const label = option.skuCode
            ? `${option.productTitle ?? 'Item'} (${option.skuCode})`
            : option.productTitle ?? 'Item';

        return {
            group_name: groupName,
            setup_item_id: option.setupItemId!,
            product_id: option.productId,
            sku_id: option.skuId ?? null,
            label,
        };
    });
}

export function allChoiceGroupsSelected(
    choiceGroups: SetupChoiceGroup[],
    groupSelections: Record<string, number>
): boolean {
    return choiceGroups.every(
        (g) =>
            groupSelections[g.groupName] != null &&
            g.options.some((o) => o.setupItemId === groupSelections[g.groupName])
    );
}
