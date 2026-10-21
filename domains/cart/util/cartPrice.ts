import type { Cart } from '../types/Cart.types';

// 상품 1개 가격 = 판매가 + 옵션 추가금
export function getUnitPrice(item: Pick<Cart, 'price' | 'optionPrice'>): number {
    return item.price + (item.optionPrice ?? 0);
}

// 장바구니 상품 금액 합계 (배송비 제외)
export function getProductTotal(items: Cart[]): number {
    return items.reduce(
        (acc, item) => acc + getUnitPrice(item) * item.quantity,
        0,
    );
}
