'use client';

import CartItem from '@/domains/cart/components/CartItem';
import { MOCK_CART_ITEMS } from '@/shared/mocks/mockData';
import { useState, useMemo } from 'react';
import { type Cart } from '@/domains/cart/types/Cart.types';

// 총합계를 구하는 함수
function resolveTotalPrice(items: Cart[]): number {
    // let total = 0;
    // for (const {price, quantity} of items) {
    //     total += price * quantity;
    // }
    console.log('호출!');
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export default function CartPage() {
    const [items, setItems] = useState(MOCK_CART_ITEMS);
    const totalPrice = useMemo<number>(() => resolveTotalPrice(items), [items]);

    const onChangeItem = (id: number, type: 'plus' | 'minus') => {
        // const index = items.findIndex((item) => item.id === id); // 매개변수 id값과 일치하는 장바구니 상품 인덱스 번호
        // items[index].quantity =
        //     type === 'plus' ? ++items[index].quantity : --items[index].quantity;

        setItems(
            items.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity:
                              type === 'plus'
                                  ? item.quantity + 1
                                  : item.quantity - 1,
                      }
                    : item,
            ),
        );
    };

    const onRemoveItem = (id: number) => {
        setItems(items.filter((item) => item.id !== id));
    };

    return ( 
        <>
            <h1>장바구니</h1>
            {items.length === 0 ? (
                <div>장바구니가 비어있습니다.</div>
            ) : (
                items.map((item) => (
                    <CartItem
                        key={item.id}
                        {...item}
                        onChangeItem={onChangeItem}
                        onRemoveItem={onRemoveItem}
                    />
                ))
            )}
            <div>총 합계: {totalPrice}</div>
        </>
    );
}
