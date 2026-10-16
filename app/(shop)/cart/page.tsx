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
                                  : item.quantity - 1 < 1
                                    ? 1
                                    : item.quantity - 1,
                      }
                    : item,
            ),
        );
    };

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

    const onSelectiveRemove = () => {
        setItems((prev) => prev.filter((item) => !item.check));
    };

    const isAllChecked = items.length > 0 && items.every((item) => item.check);
    const onToggleAll = () => {
        setItems((prev) =>
            prev.map((item) => ({ ...item, check: !isAllChecked })),
        );
    };

    const checkedCount = items.filter((item) => item.check).length;

    return (
        <div className="mx-auto mb-20 max-w-7xl pb-4">
            <h1 className="my-4 border-b-1 pb-4 text-4xl">장바구니</h1>
            <div className="flex justify-between px-1">
                {items.length === 0 ? (
                    <div className="grow">장바구니가 비어있습니다.</div>
                ) : (
                    <div className="grow border-r-1 px-4">
                        <div className="flex items-center justify-between border-b-1 px-4 pb-4">
                            <label
                                className="item-center flex cursor-pointer gap-3"
                                onClick={onToggleAll}
                            >
                                <span className="relative top-[5px]">
                                    {isAllChecked ? (
                                        <MdCheckBox />
                                    ) : (
                                        <MdCheckBoxOutlineBlank />
                                    )}
                                </span>
                                전체선택 (
                                {items.filter((item) => item.check).length}/
                                {items.length})
                            </label>
                            <button
                                type="button"
                                className="cursor-pointer rounded-sm border px-3 py-1"
                                onClick={onSelectiveRemove}
                            >
                                선택삭제
                            </button>
                        </div>

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
                <div className="sticky top-40 ml-10 basis-90 self-start">
                    <CartSummary
                        checkedCount={checkedCount}
                        totalPrice={totalPrice}
                    />
                </div>
            </div>
        </div>
    );
}
