'use server';
import { cookies } from 'next/headers';
import { SHIPPING_FEE } from '@/domains/cart/constants/cart.constants';
import { type ActionState } from '@/shared/types/action.types';
import { PENDING_ORDER_COOKIE } from '../api/payment';
import type { OrderItemInput, PendingOrder } from '../types/order.types';

// 결제 요청 직전에 주문을 생성하고, 결제 금액을 서버(httpOnly 쿠키)에 저장
// 승인 페이지에서 토스가 돌려준 금액과 비교해 위변조를 막는다
// TODO: ORDERS 테이블이 생기면 쿠키 대신 DB에 저장
export async function createOrder(
    items: OrderItemInput[],
): Promise<ActionState<PendingOrder>> {
    if (items.length === 0) {
        return { success: false, message: '주문할 상품을 선택해주세요.' };
    }

    const isValid = items.every(
        (item) =>
            Number.isInteger(item.price) &&
            item.price >= 0 &&
            Number.isInteger(item.quantity) &&
            item.quantity >= 1,
    );
    if (!isValid) {
        return { success: false, message: '주문 정보가 올바르지 않습니다.' };
    }

    const productPrice = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );
    const order: PendingOrder = {
        // 토스 orderId 규칙: 영문/숫자/-/_/= 6~64자
        orderId: `ORDER-${crypto.randomUUID()}`,
        orderName:
            items.length > 1
                ? `${items[0].productName} 외 ${items.length - 1}건`
                : items[0].productName,
        amount: productPrice + SHIPPING_FEE,
    };

    const cookieStore = await cookies();
    cookieStore.set(PENDING_ORDER_COOKIE, JSON.stringify(order), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // 토스 결제창 → successUrl 리다이렉트(top-level GET)에도 쿠키가 전송되도록 lax
        sameSite: 'lax',
        path: '/checkout',
        maxAge: 60 * 30,
    });

    return { success: true, data: order };
}
