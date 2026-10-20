'use client';

import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
import { useMemo } from 'react';
import CartItem from '@/domains/cart/components/CartItem';
import CartSummary from '@/domains/cart/components/CartSummary';
import { useCartStore } from '@/domains/cart/store/cart.store';
import { type Cart } from '@/domains/cart/types/Cart.types';
import { useRouter } from 'next/navigation';

// 총합계를 구하는 함수
function resolveTotalPrice(items: Cart[]): number {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export default function CartPage() {
    const items = useCartStore((s) => s.items);
    const changeQuantity = useCartStore((s) => s.changeQuantity);
    const removeItem = useCartStore((s) => s.removeItem);
    const toggleItem = useCartStore((s) => s.toggleItem);
    const toggleAll = useCartStore((s) => s.toggleAll);
    const removeChecked = useCartStore((s) => s.removeChecked);
    const router = useRouter();
    const totalPrice = useMemo<number>(
        () => resolveTotalPrice(items.filter((item) => item.check)),
        [items],
    );

    const isAllChecked = items.length > 0 && items.every((item) => item.check);
    const checkedCount = items.filter((item) => item.check).length;
    

    return (
        <div className="mx-auto mb-20 max-w-7xl px-4 pb-4">
            <h1 className="my-4 border-b-1 pb-4 text-2xl md:text-4xl">
                장바구니
            </h1>
            <div className="flex flex-col justify-between px-1 lg:flex-row">
                {items.length === 0 ? (
                    <div className="grow">장바구니가 비어있습니다.</div>
                ) : (
                    <div className="min-w-0 grow lg:border-r-1 lg:px-4">
                        <div className="flex items-center justify-between border-b-1 px-4 pb-4">
                            <label
                                className="item-center flex cursor-pointer gap-3"
                                onClick={toggleAll}
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
                                onClick={removeChecked}
                            >
                                선택삭제
                            </button>
                        </div>

                        {items.map((item) => (
                            <CartItem
                                key={item.id}
                                {...item}
                                onChangeItem={changeQuantity}
                                onRemoveItem={removeItem}
                                onToggle={toggleItem}
                            />
                        ))}
                    </div>
                )}
                <div className="mt-6 w-full lg:sticky lg:top-40 lg:mt-0 lg:ml-10 lg:w-auto lg:shrink-0 lg:basis-90 lg:self-start">
                    <CartSummary
                        checkedCount={checkedCount}
                        totalPrice={totalPrice}
                        onCheckout={() => router.push('/checkout')}
                    />
                </div>
            </div>
        </div>
    );
}
