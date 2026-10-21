// 결제 요청에 필요한 주문 정보 (orderId = ORDERS.id)
export interface PendingOrder {
    orderId: string;
    orderName: string;
    amount: number;
}

// 주문 생성 시 클라이언트에서 넘기는 상품 정보
export interface OrderItemInput {
    productId: string;
    optionId?: string;
    productName: string;
    price: number;
    optionPrice?: number;
    quantity: number;
}

// 체크아웃에서 입력받는 배송지
export interface ShippingInput {
    receiverName: string;
    receiverPhone: string;
    receiverZipcode: string;
    receiverAddress: string;
}

export type OrderStatus =
    | 'PENDING'
    | 'PAID'
    | 'PREPARING'
    | 'SHIPPING'
    | 'DELIVERED'
    | 'CANCELED';

// ORDERS 테이블
export interface Order {
    id: string;
    user_id: string;
    status: OrderStatus;
    order_name: string;
    total_price: number;
    receiver_name: string;
    receiver_phone: string;
    receiver_zipcode: string;
    receiver_address: string;
    created_at: string;
    updated_at: string | null;
}

// ORDER_ITEMS 테이블
export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string | null;
    option_id: string | null;
    product_name: string;
    product_price: number;
    option_price: number | null;
    quantity: number;
}

export interface OrderWithItems extends Order {
    ORDER_ITEMS: OrderItem[];
}

// 토스페이먼츠 Payment 객체 중 화면에서 쓰는 필드
// https://docs.tosspayments.com/reference#payment-객체
export interface TossPayment {
    paymentKey: string;
    orderId: string;
    orderName: string;
    status: string;
    method: string | null;
    totalAmount: number;
    approvedAt: string | null;
    receipt: { url: string } | null;
}

export interface TossError {
    code: string;
    message: string;
}

export type ConfirmPaymentResult =
    | { success: true; payment: TossPayment }
    | { success: false; error: TossError };
