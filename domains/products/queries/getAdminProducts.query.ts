// 관리자 상품 조회 (서버 컴포넌트에서 사용)
// 쇼핑몰용 getProducts 와 달리 페이지네이션·검색·카테고리 필터를 지원하고 옵션 수까지 함께 조회
import { toLikePattern } from '@/domains/boards/utils/postValidation';
import { createServerClient } from '@/shared/lib/supabase';
import type { AdminProductRow, ProductFormInput } from '../types/Product.types';

export const ADMIN_PRODUCTS_PER_PAGE = 20;

interface AdminProductDbRow {
    id: string;
    style_code: string;
    name: string;
    brand: string;
    sale_price: number;
    consumer_price: number;
    created_at: string;
    PRODUCT_CATEGORY: { name: string } | null; // PRODUCTS.category_id → PRODUCT_CATEGORY JOIN
    PRODUCT_OPTIONS: { count: number }[]; // 옵션 개수 (PostgREST 집계)
}

interface GetAdminProductsParams {
    page: number;
    keyword?: string; // 상품명 또는 스타일 코드
    categoryId?: string;
}

export async function getAdminProducts({
    page,
    keyword,
    categoryId,
}: GetAdminProductsParams): Promise<{
    products: AdminProductRow[];
    totalCount: number;
}> {
    const supabase = createServerClient();
    const from = (page - 1) * ADMIN_PRODUCTS_PER_PAGE;

    let query = supabase
        .from('PRODUCTS')
        .select(
            'id, style_code, name, brand, sale_price, consumer_price, created_at, PRODUCT_CATEGORY(name), PRODUCT_OPTIONS(count)',
            { count: 'exact' },
        )
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .range(from, from + ADMIN_PRODUCTS_PER_PAGE - 1);

    if (keyword) {
        // 상품명 또는 스타일 코드에 검색어가 포함된 상품
        // or() 안의 값은 큰따옴표로 감싸고, 그 안의 \ 와 " 는 한 번 더 이스케이프 (PostgREST 문법)
        const pattern = toLikePattern(keyword).replace(
            /[\\"]/g,
            (char) => `\\${char}`,
        );
        query = query.or(
            `name.ilike."${pattern}",style_code.ilike."${pattern}"`,
        );
    }
    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data, count, error } = await query;

    if (error) {
        // 존재하지 않는 페이지 요청 → 빈 목록
        if (error.code === 'PGRST103') return { products: [], totalCount: 0 };
        throw new Error(`상품 목록 조회 실패: ${error.message}`);
    }

    const products = (data as unknown as AdminProductDbRow[]).map((row) => ({
        id: row.id,
        styleCode: row.style_code,
        name: row.name,
        brand: row.brand,
        salePrice: row.sale_price,
        consumerPrice: row.consumer_price,
        categoryName: row.PRODUCT_CATEGORY?.name ?? null,
        optionCount: row.PRODUCT_OPTIONS?.[0]?.count ?? 0,
        createdAt: row.created_at,
    }));

    return { products, totalCount: count ?? 0 };
}

// 수정 폼 초기값 (상품 + 옵션)
export async function getAdminProductForm(
    id: string,
): Promise<ProductFormInput | null> {
    const supabase = createServerClient();

    const { data: row, error } = await supabase
        .from('PRODUCTS')
        .select(
            'name, brand, style_code, category_id, sale_price, consumer_price, short_description, long_description, PRODUCT_OPTIONS(id, item_name, add_price, sort_order)',
        )
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

    if (error) throw new Error(`상품 조회 실패: ${error.message}`);
    if (!row) return null;

    const options = [...(row.PRODUCT_OPTIONS ?? [])]
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((option) => ({
            id: option.id as string,
            name: option.item_name as string,
            addPrice: String(option.add_price ?? 0),
        }));

    return {
        name: row.name,
        brand: row.brand,
        styleCode: row.style_code,
        categoryId: row.category_id ?? '',
        salePrice: String(row.sale_price),
        consumerPrice: String(row.consumer_price),
        shortDescription: row.short_description ?? '',
        longDescription: row.long_description ?? '',
        options,
    };
}
