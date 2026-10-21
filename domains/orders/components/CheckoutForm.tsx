'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ANONYMOUS,
    loadTossPayments,
    type TossPaymentsWidgets,
} from '@tosspayments/tosspayments-sdk';
import { Button } from '@/shared/components/ui/button';
import { formatPrice } from '@/shared/utils/formatPrice';
import { SHIPPING_FEE } from '@/domains/cart/constants/cart.constants';
import { type Cart } from '@/domains/cart/types/Cart.types';
import { getProductTotal, getUnitPrice } from '@/domains/cart/util/cartPrice';
import { createOrder } from '../actions/order.actions';
import { validateShipping } from '../util/orderValidation';
import ShippingForm, {
    INITIAL_SHIPPING,
    type ShippingFormValues,
} from './ShippingForm';

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? '';

interface CheckoutFormProps {
    // 장바구니에서 선택해 넘어온 상품 (서버에서 DB 조회)
    items: Cart[];
}

export default function CheckoutForm({ items }: CheckoutFormProps) {
    const hasItems = items.length > 0;
    const productPrice = getProductTotal(items);
    const amount = productPrice + (hasItems ? SHIPPING_FEE : 0);

    const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [shipping, setShipping] =
        useState<ShippingFormValues>(INITIAL_SHIPPING);
    const [shippingErrors, setShippingErrors] = useState<
        Record<string, string>
    >({});
    const [isPending, startTransition] = useTransition();
    // StrictMode에서 effect가 두 번 실행돼도 위젯은 한 번만 렌더링
    const initializedRef = useRef(false);

    // 결제위젯 SDK 로드 + 결제수단/약관 UI 렌더링
    useEffect(() => {
        if (!hasItems || initializedRef.current) return;
        initializedRef.current = true;

        (async () => {
            const tossPayments = await loadTossPayments(CLIENT_KEY);
            const tossWidgets = tossPayments.widgets({
                customerKey: ANONYMOUS,
            });
            await tossWidgets.setAmount({ currency: 'KRW', value: amount });
            await Promise.all([
                tossWidgets.renderPaymentMethods({
                    selector: '#payment-method',
                    variantKey: 'DEFAULT',
                }),
                tossWidgets.renderAgreement({
                    selector: '#agreement',
                    variantKey: 'AGREEMENT',
                }),
            ]);
            setWidgets(tossWidgets);
        })().catch((error: unknown) => {
            console.error(error);
            setErrorMessage('결제 수단을 불러오지 못했습니다.');
        });
    }, [hasItems, amount]);

    // 주문 금액이 바뀌면 위젯 금액도 갱신
    useEffect(() => {
        widgets?.setAmount({ currency: 'KRW', value: amount });
    }, [widgets, amount]);

    const handleShippingChange = (
        name: keyof ShippingFormValues,
        value: string,
    ) => {
        setShipping((prev) => ({ ...prev, [name]: value }));
        setShippingErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handlePayment = () => {
        if (!widgets) return;
        setErrorMessage('');

        const { receiverAddressDetail, ...rest } = shipping;
        const shippingInput = {
            ...rest,
            receiverAddress:
                `${rest.receiverAddress.trim()} ${receiverAddressDetail.trim()}`.trim(),
        };
        const errors = validateShipping(shippingInput);
        if (Object.keys(errors).length > 0) {
            setShippingErrors(errors);
            setErrorMessage('배송지 정보를 확인해주세요.');
            return;
        }

        startTransition(async () => {
            // 서버에서 주문 저장(결제대기) + DB 가격으로 결제 금액 계산
            const result = await createOrder(
                items.map((item) => item.id),
                shippingInput,
            );
            if (!result.success || !result.data) {
                setShippingErrors(result.errors ?? {});
                setErrorMessage(result.message ?? '주문 생성에 실패했습니다.');
                return;
            }

            const { orderId, orderName, amount: orderAmount } = result.data;
            try {
                await widgets.setAmount({
                    currency: 'KRW',
                    value: orderAmount,
                });
                // 결제 성공/실패 시 각각 successUrl, failUrl로 리다이렉트
                await widgets.requestPayment({
                    orderId,
                    orderName,
                    successUrl: `${window.location.origin}/checkout/success`,
                    failUrl: `${window.location.origin}/checkout/fail`,
                });
            } catch (error) {
                // 약관 미동의 등 결제창을 띄우기 전 오류
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : '결제 요청에 실패했습니다.',
                );
            }
        });
    };

    if (!hasItems) {
        return (
            <div className="flex flex-col items-center gap-4 py-20">
                <p>주문할 상품이 없습니다.</p>
                <Link
                    href="/cart"
                    className="rounded-sm border px-4 py-2 hover:bg-gray-50"
                >
                    장바구니로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-between px-1 lg:flex-row">
            <div className="min-w-0 grow lg:border-r-1 lg:pr-4">
                <section>
                    <h2 className="border-b-1 pb-4 text-xl font-bold">
                        주문 상품 ({items.length})
                    </h2>
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 border-b-1 py-4 md:gap-5"
                        >
                            {item.imageUrl ? (
                                <Image
                                    src={item.imageUrl}
                                    width={100}
                                    height={100}
                                    alt={item.productName}
                                    className="h-auto w-16 shrink-0 object-contain md:w-20"
                                />
                            ) : (
                                <div className="aspect-square w-16 shrink-0 bg-gray-100 md:w-20" />
                            )}
                            <div className="min-w-0 grow">
                                <div className="line-clamp-2 break-words">
                                    {item.productName}
                                </div>
                                {item.optionName && (
                                    <div className="text-sm text-gray-500">
                                        옵션: {item.optionName}
                                    </div>
                                )}
                                <div className="text-sm text-gray-500">
                                    수량 {item.quantity}개
                                </div>
                            </div>
                            <div className="shrink-0 font-bold">
                                {formatPrice(
                                    getUnitPrice(item) * item.quantity,
                                )}
                            </div>
                        </div>
                    ))}
                </section>

                <section className="mt-8">
                    <h2 className="border-b-1 pb-4 text-xl font-bold">
                        배송지
                    </h2>
                    <ShippingForm
                        values={shipping}
                        errors={shippingErrors}
                        onChange={handleShippingChange}
                    />
                </section>

                <section className="mt-8">
                    <h2 className="border-b-1 pb-4 text-xl font-bold">
                        결제 수단
                    </h2>
                    <div id="payment-method" />
                    <div id="agreement" />
                </section>
            </div>

            <div className="mt-6 w-full lg:sticky lg:top-40 lg:mt-0 lg:ml-10 lg:w-auto lg:shrink-0 lg:basis-90 lg:self-start">
                <div className="rounded-lg border p-4 md:p-5">
                    <h3 className="mb-4 text-xl font-bold md:text-2xl">
                        결제 금액
                    </h3>
                    <div className="flex flex-col gap-2 border-t-1">
                        <div className="mt-4 flex justify-between">
                            <span>상품 금액</span>
                            <span>{formatPrice(productPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>배송비</span>
                            <span>{formatPrice(SHIPPING_FEE)}</span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between gap-2 border-t-1 pt-2 font-bold">
                        <span>총 결제 금액</span>
                        <span className="shrink-0">{formatPrice(amount)}</span>
                    </div>
                    {errorMessage && (
                        <p className="mt-3 text-sm text-red-500">
                            {errorMessage}
                        </p>
                    )}
                    <Button
                        type="button"
                        className="mt-5 h-12 w-full cursor-pointer bg-blue-500 text-lg hover:bg-blue-500 md:h-15 md:text-2xl"
                        disabled={!widgets || isPending}
                        onClick={handlePayment}
                    >
                        {isPending
                            ? '결제 진행 중...'
                            : `${formatPrice(amount)} 결제하기`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
