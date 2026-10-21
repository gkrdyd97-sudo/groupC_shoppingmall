// 주문 확인 페이지 - 배송 현황, 주문 상품, 결제 금액, 배송지, 결제 정보(영수증)
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CircleCheck } from 'lucide-react';
import DeliveryStatus from '@/domains/orders/components/DeliveryStatus';
import { getMyOrder } from '@/domains/orders/api/order';
import { getPaymentByOrderId } from '@/domains/orders/api/payment';
import type { OrderItem } from '@/domains/orders/types/order.types';
import { formatPrice } from '@/shared/utils/formatPrice';

type Params = Promise<{ orderId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function formatDate(value: string): string {
    return new Date(value).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}

function formatPhone(phone: string): string {
    return phone.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-gray-500">{label}</dt>
            <dd className="text-right break-all">{children}</dd>
        </div>
    );
}

export default async function OrderDetailPage({
    params,
    searchParams,
}: {
    params: Params;
    searchParams: SearchParams;
}) {
    const { orderId } = await params;
    const { completed } = await searchParams;

    const order = await getMyOrder(orderId);
    if (!order) notFound();

    // 결제수단·승인일시·영수증은 토스 결제 조회 API에서 가져옴
    const payment =
        order.status === 'PENDING'
            ? null
            : await getPaymentByOrderId(order.id).catch(() => null);

    const unitPrice = (item: OrderItem) =>
        item.product_price + (item.option_price ?? 0);
    const productPrice = order.ORDER_ITEMS.reduce(
        (acc, item) => acc + unitPrice(item) * item.quantity,
        0,
    );
    const shippingFee = order.total_price - productPrice;

    return (
        <div className="mx-auto mb-20 max-w-3xl px-4 pb-4">
            {completed === 'true' ? (
                <div className="my-10 flex flex-col items-center gap-3 text-center">
                    <CircleCheck className="size-16 text-blue-500" />
                    <h1 className="text-2xl font-bold md:text-3xl">
                        결제가 완료되었습니다
                    </h1>
                    <p className="text-gray-500">주문해주셔서 감사합니다.</p>
                </div>
            ) : (
                <h1 className="my-4 border-b-1 pb-4 text-2xl md:text-4xl">
                    주문 상세
                </h1>
            )}

            <div className="mb-6 flex flex-col gap-1 text-sm text-gray-500">
                <span>주문번호 {order.id}</span>
                <span>주문일시 {formatDate(order.created_at)}</span>
            </div>

            <section className="mb-8">
                <h2 className="border-b-1 pb-3 text-lg font-bold md:text-xl">
                    배송 현황
                </h2>
                <DeliveryStatus status={order.status} />
            </section>

            <section className="mb-8">
                <h2 className="border-b-1 pb-3 text-lg font-bold md:text-xl">
                    주문 상품 ({order.ORDER_ITEMS.length})
                </h2>
                {order.ORDER_ITEMS.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 border-b-1 py-4"
                    >
                        <div className="min-w-0">
                            <div className="line-clamp-2 break-words">
                                {item.product_name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {item.PRODUCT_OPTIONS &&
                                    `옵션: ${item.PRODUCT_OPTIONS.item_name} · `}
                                {formatPrice(unitPrice(item))} ·{' '}
                                {item.quantity}개
                            </div>
                        </div>
                        <div className="shrink-0 font-bold">
                            {formatPrice(unitPrice(item) * item.quantity)}
                        </div>
                    </div>
                ))}
            </section>

            <section className="mb-8">
                <h2 className="border-b-1 pb-3 text-lg font-bold md:text-xl">
                    결제 정보
                </h2>
                <dl className="flex flex-col gap-3 py-4">
                    <Row label="상품 금액">{formatPrice(productPrice)}</Row>
                    <Row label="배송비">{formatPrice(shippingFee)}</Row>
                    {payment?.method && (
                        <Row label="결제수단">{payment.method}</Row>
                    )}
                    {payment?.approvedAt && (
                        <Row label="결제일시">
                            {formatDate(payment.approvedAt)}
                        </Row>
                    )}
                    <div className="flex justify-between gap-4 border-t-1 pt-3 text-lg font-bold">
                        <dt>총 결제금액</dt>
                        <dd>{formatPrice(order.total_price)}</dd>
                    </div>
                </dl>
                {payment?.receipt?.url && (
                    <a
                        href={payment.receipt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 items-center justify-center rounded-lg border hover:bg-gray-50"
                    >
                        영수증 보기
                    </a>
                )}
            </section>

            <section className="mb-8">
                <h2 className="border-b-1 pb-3 text-lg font-bold md:text-xl">
                    배송지
                </h2>
                <dl className="flex flex-col gap-3 py-4">
                    <Row label="받는 분">{order.receiver_name}</Row>
                    <Row label="연락처">
                        {formatPhone(order.receiver_phone)}
                    </Row>
                    <Row label="주소">
                        ({order.receiver_zipcode}) {order.receiver_address}
                    </Row>
                </dl>
            </section>

            <Link
                href="/"
                className="flex h-12 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
                쇼핑 계속하기
            </Link>
        </div>
    );
}
