'use client';

import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
import CartItem from '@/domains/cart/components/CartItem';
import { MOCK_CART_ITEMS } from '@/shared/mocks/mockData';
import { useState, useMemo } from 'react';
import { type Cart } from '@/domains/cart/types/Cart.types';
import CartSummary from '@/domains/cart/components/CartSummary';

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
    const totalPrice = useMemo<number>(
        () => resolveTotalPrice(items.filter((item) => item.check)),
        [items],
    );

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
    // const onDelete = (id: number) => {
    //     setItems(items.filter((item) => item.id !== id));
    // };

    const onRemoveItem = (id: number) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const onToggle = (id: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, check: !item.check } : item,
            ),
        );
    };

    const isAllChecked = items.length > 0 && items.every((item) => item.check);
    const onToggleAll = () => {
        setItems((prev) =>
            prev.map((item) => ({ ...item, check: !isAllChecked })),
        );
    };

    const checkedCount = items.filter((item) => item.check).length;

    return (
        <div className="mx-auto max-w-7xl">
            <h1 className="mt-4 mb-5 border-b-1 pb-2">장바구니</h1>
            <div className="flex justify-between px-4">
                {items.length === 0 ? (
                    <div className="grow">장바구니가 비어있습니다.</div>
                ) : (
                    <div className="grow border-r-1 px-4">
                        <label
                            className="mb-3 flex cursor-pointer items-center gap-2"
                            onClick={onToggleAll}
                        >
                            {isAllChecked ? (
                                <MdCheckBox />
                            ) : (
                                <MdCheckBoxOutlineBlank />
                            )}
                            전체 선택 (
                            {items.filter((item) => item.check).length}/
                            {items.length})
                        </label>
                        {items.map((item) => (
                            <CartItem
                                key={item.id}
                                {...item}
                                onChangeItem={onChangeItem}
                                onRemoveItem={onRemoveItem}
                                onToggle={onToggle}
                            />
                        ))}
                    </div>
                )}
                <div className="ml-10 basis-90">
                    <CartSummary checkedCount={checkedCount} totalPrice={totalPrice}/>
                </div>
            </div>
        </div>
    );
}
