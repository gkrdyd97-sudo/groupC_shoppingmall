// 결제 승인 페이지
// 토스 결제창 인증 성공 → successUrl?paymentKey&orderId&amount 로 리다이렉트
// → DB 주문 금액 검증 후 서버에서 결제 승인 API 호출 → 주문 확인 페이지로 이동
import { redirect } from 'next/navigation';
import {
    getMyOrder,
    removeOrderedCartItems,
    updateOrderStatus,
} from '@/domains/orders/api/order';
import { confirmPayment } from '@/domains/orders/api/payment';
import type { ConfirmPaymentResult } from '@/domains/orders/types/order.types';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function failUrl(code: string, message: string, orderId?: string): string {
    const params = new URLSearchParams({ code, message });
    if (orderId) params.set('orderId', orderId);
    return `/checkout/fail?${params.toString()}`;
}

export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { paymentKey, orderId, amount: amountParam } = await searchParams;
    const amount = Number(amountParam);

    if (
        typeof paymentKey !== 'string' ||
        typeof orderId !== 'string' ||
        !Number.isInteger(amount)
    ) {
        redirect(failUrl('INVALID_REQUEST', '잘못된 결제 요청입니다.'));
    }

    // 결제 요청 전에 저장한 주문과 비교해 금액 위변조 검증
    const order = await getMyOrder(orderId);
    if (!order || order.total_price !== amount) {
        redirect(
            failUrl(
                'INVALID_ORDER',
                '주문 정보가 일치하지 않습니다. 다시 시도해주세요.',
                orderId,
            ),
        );
    }

    // 이미 승인된 주문(새로고침 등)은 바로 주문 확인 페이지로
    if (order.status !== 'PENDING') {
        redirect(`/orders/${orderId}`);
    }

    let result: ConfirmPaymentResult;
    try {
        result = await confirmPayment({ paymentKey, orderId, amount });
    } catch (error) {
        console.error(error);
        result = {
            success: false,
            error: {
                code: 'CONFIRM_ERROR',
                message: '결제 승인 중 오류가 발생했습니다.',
            },
        };
    }

    if (!result.success) {
        redirect(failUrl(result.error.code, result.error.message, orderId));
    }

    // 결제는 승인됐으므로 상태 변경에 실패해도 주문 확인 페이지로 보냄 (로그로 추적)
    await updateOrderStatus(orderId, 'PAID');
    await removeOrderedCartItems(order);

    redirect(`/orders/${orderId}?completed=true`);
}
