'use client';

import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { changeCart, deleteCart } from '../actions/cart.actions';
import { type Cart } from '../types/Cart.types';
import { getProductTotal } from '../util/cartPrice';

interface CartViewProps {
    initialItems: Cart[];
}

export default function CartView({ initialItems }: CartViewProps) {
    const router = useRouter();
    // 처음 들어오면 전체 선택 상태로 시작
    const [items, setItems] = useState<Cart[]>(() =>
        initialItems.map((item) => ({ ...item, check: true })),
    );

    const [prevIntialItems, setPrevInitalItems] = useState(initialItems);

    if (initialItems !== prevIntialItems) {
        setPrevInitalItems(initialItems);
        setItems(initialItems.map((item) => ({...item, check: true})));
    }

    const checkedItems = items.filter((item) => item.check);
    const totalPrice = getProductTotal(checkedItems);
    const isAllChecked = items.length > 0 && checkedItems.length === items.length;

    // 화면을 먼저 바꾸고(낙관적 업데이트) 서버 반영에 실패하면 되돌림
    const changeQuantity = async (id: number, type: 'plus' | 'minus') => {
        const target = items.find((item) => item.id === id);
        if (!target) return;
        const quantity =
            type === 'plus' ? target.quantity + 1 : target.quantity - 1;
        if (quantity < 1) return;

        const prevItems = items;
        setItems(
            items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        );
        const result = await changeCart({ id, quantity });
        if (!result.success) {
            setItems(prevItems);
            alert(result.message);
        }
    };

    const removeItems = async (ids: number[]) => {
        if (ids.length === 0) return;
        const prevItems = items;
        setItems(items.filter((item) => !ids.includes(item.id)));
        const result = await deleteCart(ids);
        if (!result.success) {
            setItems(prevItems);
            alert(result.message);
        }
    };

    const toggleItem = (id: number) =>
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, check: !item.check } : item,
            ),
        );

    const toggleAll = () =>
        setItems(items.map((item) => ({ ...item, check: !isAllChecked })));

    const handleCheckout = () => {
        const ids = checkedItems.map((item) => item.id).join(',');
        router.push(`/checkout?items=${ids}`);
    };

    return (
        <div className="flex flex-col justify-between px-1 lg:flex-row">
            {items.length === 0 ? (
                <div className="grow">장바구니가 비어있습니다.</div>
            ) : (
                <div className="min-w-0 grow lg:border-r-1 lg:px-4">
                    <div className="flex items-center justify-between border-b-1 px-4 pb-4">
                        <label
                            className="flex cursor-pointer items-center gap-3"
                            onClick={toggleAll}
                        >
                            {isAllChecked ? (
                                <MdCheckBox />
                            ) : (
                                <MdCheckBoxOutlineBlank />
                            )}
                            전체선택 ({checkedItems.length}/{items.length})
                        </label>
                        <button
                            type="button"
                            className="cursor-pointer rounded-sm border px-3 py-1"
                            onClick={() =>
                                removeItems(checkedItems.map((item) => item.id))
                            }
                        >
                            선택삭제
                        </button>
                    </div>

                    {items.map((item) => (
                        <CartItem
                            key={item.id}
                            {...item}
                            onChangeItem={changeQuantity}
                            onRemoveItem={(id) => removeItems([id])}
                            onToggle={toggleItem}
                        />
                    ))}
                </div>
            )}
            <div className="mt-6 w-full lg:sticky lg:top-40 lg:mt-0 lg:ml-10 lg:w-auto lg:shrink-0 lg:basis-90 lg:self-start">
                <CartSummary
                    checkedCount={checkedItems.length}
                    totalPrice={totalPrice}
                    onCheckout={handleCheckout}
                />
            </div>
        </div>
    );
}
