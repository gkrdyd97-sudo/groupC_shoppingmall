// 로그인한 사용자의 장바구니 조회 (서버 컴포넌트·서버 액션에서 사용)
import { createServerClient } from '@/shared/lib/supabase';
import type { Cart } from '../types/Cart.types';

interface CartRow {
    id: number;
    product_id: string;
    option_id: string | null;
    quantity: number;
    PRODUCTS: {
        name: string;
        brand: string;
        sale_price: number;
        deleted_at: string | null;
    } | null;
    PRODUCT_OPTIONS: { item_name: string; add_price: number } | null;
}

// ids를 넘기면 해당 장바구니 항목만 조회 (체크아웃용)
export async function getCart(ids?: number[]): Promise<Cart[]> {
    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
        .from('CART')
        .select(
            'id, product_id, option_id, quantity, PRODUCTS(name, brand, sale_price, deleted_at), PRODUCT_OPTIONS(item_name, add_price)',
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
    if (ids) query = query.in('id', ids);

    const { data, error } = await query;
    console.log('CART raw data:', JSON.stringify(data, null, 2));
    if (error) {
        console.error('장바구니 조회 실패:', error.message);
        return [];
    }

    return (data as unknown as CartRow[])
        .filter((row) => row.PRODUCTS && !row.PRODUCTS.deleted_at)
        .map((row) => ({
            id: row.id,
            productId: row.product_id,
            productName: row.PRODUCTS!.name,
            brand: row.PRODUCTS!.brand,
            optionId: row.option_id ?? undefined,
            optionName: row.PRODUCT_OPTIONS?.item_name,
            optionPrice: row.PRODUCT_OPTIONS?.add_price ?? 0,
            price: row.PRODUCTS!.sale_price,
            quantity: row.quantity,
        }));
}
