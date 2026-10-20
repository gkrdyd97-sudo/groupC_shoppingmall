import type { CartInput } from "../types/Cart.types";

export function validateAddCart(input: CartInput): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!input.productId || !input.productId.trim()) {
        errors.productId = "상품 ID가 누락되었습니다.";
    }

    if (!input.quantity || input.quantity < 1) {
        errors.quantity = "수량은 1이상 입력해야 합니다.";
    }

    return errors;
}