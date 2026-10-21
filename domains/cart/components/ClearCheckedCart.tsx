'use client';

import { useEffect } from 'react';
import { useCartStore } from '../store/cart.store';

// 결제 완료 후 주문한(체크된) 상품을 장바구니에서 제거
export default function ClearCheckedCart() {
    const removeChecked = useCartStore((s) => s.removeChecked);

    useEffect(() => {
        removeChecked();
    }, [removeChecked]);

    return null;
}
