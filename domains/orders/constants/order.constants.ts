import type { OrderStatus } from '../types/order.types';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    PENDING: '결제대기',
    PAID: '결제완료',
    PREPARING: '상품준비중',
    SHIPPING: '배송중',
    DELIVERED: '배송완료',
    CANCELED: '주문취소',
};

// 주문 확인 페이지의 배송 현황 단계 (순서대로 진행)
export const DELIVERY_STEPS: OrderStatus[] = [
    'PAID',
    'PREPARING',
    'SHIPPING',
    'DELIVERED',
];
