import { Suspense } from 'react';
import { connection } from 'next/server';
import CartView from '@/domains/cart/components/CartView';
import { getCart } from '@/domains/cart/queries/getCart.query';

export default function CartPage() {
    return (
        <div className="mx-auto mb-20 max-w-7xl px-4 pb-4">
            <h1 className="my-4 border-b-1 pb-4 text-2xl md:text-4xl">
                장바구니
            </h1>
            <Suspense fallback={<div>로딩중...</div>}>
                <CartContent />
            </Suspense>
        </div>
    );
}

async function CartContent() {
    await connection();
    const items = await getCart();
    return <CartView initialItems={items} />;
}
