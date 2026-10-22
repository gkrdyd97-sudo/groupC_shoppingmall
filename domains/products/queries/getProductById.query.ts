import { createServerClient } from '@/shared/lib/supabase';
import { type ProductDetail } from '../types/Product.types';

export async function getProductById(
    id: string,
): Promise<ProductDetail | null> {
    const supabase = createServerClient();

    const { data: row, error } = await supabase
        .from('PRODUCTS')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

    if (error) {
        console.error('상품 조회 실패:', error.message);
        return null;
    }
    if (!row) return null;

    // 이미지 전부 (main 이 맨 앞)
    const { data: files } = await supabase
        .from('FILE_INFO')
        .select('location, filename, extension')
        .eq('gid', row.gid)
        .order('id', { ascending: true });

    const images = (files ?? [])
        .slice()
        .sort((a, b) => {
            if (a.location === b.location) return 0;
            return a.location === 'main' ? -1 : 1;
        })
        .map((f) => `/images/products/${f.filename}.${f.extension}`);

    // 사이즈 옵션
    const { data: optionRows } = await supabase
        .from('PRODUCT_OPTIONS')
        .select('id, item_name, sort_order')
        .eq('product_id', row.id)
        .order('sort_order', { ascending: true });

    const options = (optionRows ?? []).map((o) => ({
        id: o.id,
        name: o.item_name,
    }));

    return {
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
        imageUrl: images[0] ?? null,
        images,
        options,
    };
}
