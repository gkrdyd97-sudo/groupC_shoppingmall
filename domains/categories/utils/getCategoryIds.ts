import { type Category } from '@/domains/categories/types/category.types';

function collectIds(category: Category): string[] {
    const childIds = (category.children ?? []).flatMap(collectIds);
    return [category.id, ...childIds];
}

export function getCategoryIds(
    categories: Category[],
    targetId: string,
): string[] {
    for (const category of categories) {
        if (category.id === targetId) {
            return collectIds(category);
        }

        const found = getCategoryIds(category.children ?? [], targetId);
        if (found.length > 0) {
            return found;
        }
    }

    return [];
}
