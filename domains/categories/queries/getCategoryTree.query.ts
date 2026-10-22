import { createServerClient } from "@/shared/lib/supabase";
import type { Category } from "../types/category.types";

export async function getCategoryTree(): Promise<Category[]> {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
        .from('PRODUCT_CATEGORY')
        .select('*')

    if (error) {
        console.error('카테고리 조회 실패 :', error.message);
        return [];
    }

    const rows = data ?? [];

    const byId = new Map<string, Category>();
    rows.forEach((row) => {
        byId.set(row.id, {
            id: row.id,
            parentId: row.parent_id,
            name: row.name,
            children: [],
        });
    });

    const roots: Category[] = [];
    byId.forEach((category) => {
        if (category.parentId && byId.has(category.parentId)) {
            byId.get(category.parentId)!.children!.push(category);
        } else {
            roots.push(category);
        }
    });
    
    return roots;
}