// 관리자용 카테고리 조회 (서버 컴포넌트 · 서버 액션에서 사용)
import { createServerClient } from '@/shared/lib/supabase';
import type { CategoryRow } from '../types/category.types';

interface CategoryDbRow {
    id: string;
    name: string;
    parent_id: string | null;
    sort_order: number | null;
    active: boolean | null;
}

// DB 행 → 화면용 타입 (값이 비어 있으면 진열 순서 0, 노출 ON 으로 취급)
function toCategoryRow(row: CategoryDbRow): CategoryRow {
    return {
        id: row.id,
        name: row.name,
        parentId: row.parent_id,
        sortOrder: row.sort_order ?? 0,
        active: row.active !== false,
    };
}

// 전체 카테고리 (진열 여부와 관계없이 모두)
export async function getCategoryRows(): Promise<CategoryRow[]> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('PRODUCT_CATEGORY')
        .select('id, name, parent_id, sort_order, active')
        .order('sort_order', { ascending: true });

    if (error) {
        throw new Error(`카테고리 조회 실패: ${error.message}`);
    }
    return (data as CategoryDbRow[]).map(toCategoryRow);
}

// 카테고리별 상품 수 { 카테고리 id: 개수 } (삭제된 상품 제외)
export async function getProductCountByCategory(): Promise<
    Record<string, number>
> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('PRODUCTS')
        .select('category_id')
        .is('deleted_at', null);

    if (error) {
        throw new Error(`상품 수 조회 실패: ${error.message}`);
    }

    const counts: Record<string, number> = {};
    for (const { category_id } of data as { category_id: string | null }[]) {
        if (category_id) counts[category_id] = (counts[category_id] ?? 0) + 1;
    }
    return counts;
}
