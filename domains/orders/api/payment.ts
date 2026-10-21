// 토스페이먼츠 서버 API (시크릿 키 사용 → 서버에서만 import 할 것)
import type {
    ConfirmPaymentResult,
    PendingOrder,
    TossError,
    TossPayment,
} from '../types/order.types';

export const PENDING_ORDER_COOKIE = 'pending_order';

const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments';

function getAuthHeader(): string {
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
        throw new Error('TOSS_SECRET_KEY가 설정되지 않았습니다.');
    }
    // 시크릿 키 뒤에 ':'를 붙여 base64 인코딩 (Basic 인증)
    return `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;
}

export function parsePendingOrder(value?: string): PendingOrder | null {
    if (!value) return null;
    try {
        return JSON.parse(value) as PendingOrder;
    } catch {
        return null;
    }
}

// 결제 승인 API
// https://docs.tosspayments.com/reference#결제-승인
export async function confirmPayment(params: {
    paymentKey: string;
    orderId: string;
    amount: number;
}): Promise<ConfirmPaymentResult> {
    const res = await fetch(`${TOSS_API_URL}/confirm`, {
        method: 'POST',
        headers: {
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        cache: 'no-store',
    });

    if (res.ok) {
        return { success: true, payment: (await res.json()) as TossPayment };
    }

    const error = (await res.json()) as TossError;

    // 새로고침 등으로 승인이 중복 호출된 경우 → 이미 승인된 결제를 조회해서 보여줌
    if (error.code === 'ALREADY_PROCESSED_PAYMENT') {
        const payment = await getPayment(params.paymentKey);
        if (
            payment?.status === 'DONE' &&
            payment.orderId === params.orderId &&
            payment.totalAmount === params.amount
        ) {
            return { success: true, payment };
        }
    }

    return { success: false, error };
}

// 결제 조회 API
// https://docs.tosspayments.com/reference#paymentkey로-결제-조회
async function getPayment(paymentKey: string): Promise<TossPayment | null> {
    const res = await fetch(
        `${TOSS_API_URL}/${encodeURIComponent(paymentKey)}`,
        {
            headers: { Authorization: getAuthHeader() },
            cache: 'no-store',
        },
    );
    if (!res.ok) return null;
    return (await res.json()) as TossPayment;
}
