import { createServerClient } from '@/shared/lib/supabase';
import { type Product } from '../types/Product.types';

export async function getProducts(category?: string): Promise<Product[]> {
    const supabase = createServerClient();

    let query = supabase.from('PRODUCTS').select('*').is('deleted_at', null);

    if (category) {
        const { data: cat } = await supabase
            .from('PRODUCT_CATEGORY')
            .select('id')
            .eq('name', category)
            .maybeSingle();

        if (!cat) return [];
        query = query.eq('category_id', cat.id);
    }

    const { data, error } = await query.order('created_at', {
        ascending: false,
    });

    if (error) {
        console.error('상품 목록 조회 실패:', error.message);
        return [];
    }

    const rows = data ?? [];

    // 대표 이미지 한꺼번에 가져오기
    const { data: files } = await supabase
        .from('FILE_INFO')
        .select('gid, filename, extension')
        .in(
            'gid',
            rows.map((r) => r.gid),
        )
        .eq('location', 'main');

    const imageByGid: Record<string, string> = {};
    (files ?? []).forEach((f) => {
        imageByGid[f.gid] = `/images/products/${f.filename}.${f.extension}`;
    });

    return rows.map((row) => ({
        id: row.id,
        gid: row.gid,
        styleCode: row.style_code,
        name: row.name,
        brand: row.brand,
        shortDescription: row.short_description,
        longDescription: row.long_description,
        salePrice: row.sale_price,
        consumerPrice: row.consumer_price,
        categoryId: row.category_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        deletedAt: row.deleted_at,
        imageUrl: imageByGid[row.gid] ?? null,
    }));
}
