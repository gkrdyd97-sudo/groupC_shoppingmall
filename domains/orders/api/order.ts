// 주문 DB 조회/수정 (서버 컴포넌트·서버 액션에서 사용)
import { createServerClient } from '@/shared/lib/supabase';
import type { OrderStatus, OrderWithItems } from '../types/order.types';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
    return UUID_REGEX.test(value);
}

// 로그인한 사용자 본인의 주문만 조회
export async function getMyOrder(
    orderId: string,
): Promise<OrderWithItems | null> {
    if (!isUuid(orderId)) return null;

    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('ORDERS')
        .select('*, ORDER_ITEMS(*, PRODUCT_OPTIONS(item_name))')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .maybeSingle();

    if (error) {
        console.error(error);
        return null;
    }
    return data as OrderWithItems | null;
}

// 결제 완료된 주문의 상품(같은 상품·옵션)을 장바구니에서 삭제
export async function removeOrderedCartItems(
    order: OrderWithItems,
): Promise<void> {
    const supabase = createServerClient();
    await Promise.all(
        order.ORDER_ITEMS.map(async (item) => {
            if (!item.product_id) return;
            let query = supabase
                .from('CART')
                .delete()
                .eq('user_id', order.user_id)
                .eq('product_id', item.product_id);
            query = item.option_id
                ? query.eq('option_id', item.option_id)
                : query.is('option_id', null);
            const { error } = await query;
            if (error) console.error(error);
        }),
    );
}

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus,
): Promise<boolean> {
    const supabase = createServerClient();
    const { error } = await supabase
        .from('ORDERS')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

    if (error) {
        console.error(error);
        return false;
    }
    return true;
}
