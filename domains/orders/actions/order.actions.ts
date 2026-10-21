'use server';
import { SHIPPING_FEE } from '@/domains/cart/constants/cart.constants';
import { getCart } from '@/domains/cart/queries/getCart.query';
import { getProductTotal } from '@/domains/cart/util/cartPrice';
import { createServerClient } from '@/shared/lib/supabase';
import { type ActionState } from '@/shared/types/action.types';
import type { PendingOrder, ShippingInput } from '../types/order.types';
import { validateShipping } from '../util/orderValidation';

// 결제 요청 직전에 주문(ORDERS, ORDER_ITEMS)을 결제대기 상태로 저장
// 금액은 클라이언트 값이 아니라 DB의 장바구니·상품 가격으로 계산하고,
// 승인 페이지에서 이 금액과 토스가 돌려준 금액을 비교해 위변조를 막는다
export async function createOrder(
    cartIds: number[],
    shipping: ShippingInput,
): Promise<ActionState<PendingOrder>> {
    if (cartIds.length === 0) {
        return { success: false, message: '주문할 상품을 선택해주세요.' };
    }

    const errors = validateShipping(shipping);
    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: '배송지 정보를 확인해주세요.',
            errors,
        };
    }

    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: '로그인이 필요한 서비스입니다.' };
    }

    const items = await getCart(cartIds);
    if (items.length !== cartIds.length) {
        return {
            success: false,
            message: '장바구니 정보가 변경되었습니다. 다시 확인해주세요.',
        };
    }

    const orderName =
        items.length > 1
            ? `${items[0].productName} 외 ${items.length - 1}건`
            : items[0].productName;
    const amount = getProductTotal(items) + SHIPPING_FEE;

    const { data: order, error: orderError } = await supabase
        .from('ORDERS')
        .insert({
            user_id: user.id,
            status: 'PENDING',
            order_name: orderName,
            total_price: amount,
            receiver_name: shipping.receiverName.trim(),
            receiver_phone: shipping.receiverPhone.replace(/-/g, ''),
            receiver_zipcode: shipping.receiverZipcode.trim(),
            receiver_address: shipping.receiverAddress.trim(),
        })
        .select('id')
        .single();

    if (orderError || !order) {
        console.error(orderError);
        return { success: false, message: '주문 생성에 실패했습니다.' };
    }

    const { error: itemsError } = await supabase.from('ORDER_ITEMS').insert(
        items.map((item) => ({
            order_id: order.id,
            product_id: item.productId,
            option_id: item.optionId ?? null,
            product_name: item.productName,
            product_price: item.price,
            option_price: item.optionPrice ?? 0,
            quantity: item.quantity,
        })),
    );

    if (itemsError) {
        console.error(itemsError);
        // 상품 저장에 실패하면 빈 주문이 남지 않도록 삭제
        await supabase.from('ORDERS').delete().eq('id', order.id);
        return { success: false, message: '주문 생성에 실패했습니다.' };
    }

    return {
        success: true,
        // ORDERS.id(uuid)를 토스 orderId로 사용 (영문/숫자/- 6~64자 규칙 충족)
        data: { orderId: order.id, orderName, amount },
    };
}
