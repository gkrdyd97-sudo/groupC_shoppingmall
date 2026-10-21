// 결제 요청 전 서버에 저장해두는 주문 정보 (승인 시 금액 위변조 검증용)
export interface PendingOrder {
    orderId: string;
    orderName: string;
    amount: number;
}

// 주문 생성 시 클라이언트에서 넘기는 상품 정보
export interface OrderItemInput {
    productName: string;
    price: number;
    quantity: number;
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
