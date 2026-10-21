// 결제 승인 페이지
// 토스 결제창 인증 성공 → successUrl?paymentKey&orderId&amount 로 리다이렉트
// → 주문 금액 검증 후 서버에서 결제 승인 API 호출
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CircleCheck } from 'lucide-react';
import {
    PENDING_ORDER_COOKIE,
    confirmPayment,
    parsePendingOrder,
} from '@/domains/orders/api/payment';
import type { ConfirmPaymentResult } from '@/domains/orders/types/order.types';
import ClearCheckedCart from '@/domains/cart/components/ClearCheckedCart';
import { formatPrice } from '@/shared/utils/formatPrice';

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

    // 결제 요청 전에 서버에 저장한 주문과 비교해 금액 위변조 검증
    const cookieStore = await cookies();
    const pendingOrder = parsePendingOrder(
        cookieStore.get(PENDING_ORDER_COOKIE)?.value,
    );
    if (
        !pendingOrder ||
        pendingOrder.orderId !== orderId ||
        pendingOrder.amount !== amount
    ) {
        redirect(
            failUrl(
                'INVALID_ORDER',
                '주문 정보가 일치하지 않습니다. 다시 시도해주세요.',
                orderId,
            ),
        );
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

    const { payment } = result;
    const approvedAt = payment.approvedAt
        ? new Date(payment.approvedAt).toLocaleString('ko-KR', {
              timeZone: 'Asia/Seoul',
          })
        : '-';

    return (
        <div className="mx-auto mb-20 max-w-2xl px-4 pb-4">
            <ClearCheckedCart />
            <div className="my-10 flex flex-col items-center gap-3 text-center">
                <CircleCheck className="size-16 text-blue-500" />
                <h1 className="text-2xl font-bold md:text-3xl">
                    결제가 완료되었습니다
                </h1>
                <p className="text-gray-500">주문해주셔서 감사합니다.</p>
            </div>

            <dl className="flex flex-col gap-3 rounded-lg border p-4 md:p-5">
                <div className="flex justify-between gap-4">
                    <dt className="shrink-0 text-gray-500">주문번호</dt>
                    <dd className="break-all text-right">{payment.orderId}</dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt className="shrink-0 text-gray-500">주문상품</dt>
                    <dd className="text-right">{payment.orderName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt className="shrink-0 text-gray-500">결제수단</dt>
                    <dd>{payment.method ?? '-'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt className="shrink-0 text-gray-500">결제일시</dt>
                    <dd>{approvedAt}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t-1 pt-3 font-bold">
                    <dt>결제금액</dt>
                    <dd>{formatPrice(payment.totalAmount)}</dd>
                </div>
            </dl>

            <div className="mt-6 flex gap-2">
                {payment.receipt?.url && (
                    <a
                        href={payment.receipt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 flex-1 items-center justify-center rounded-lg border hover:bg-gray-50"
                    >
                        영수증 보기
                    </a>
                )}
                <Link
                    href="/"
                    className="flex h-12 flex-1 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                    쇼핑 계속하기
                </Link>
            </div>
        </div>
    );
}
