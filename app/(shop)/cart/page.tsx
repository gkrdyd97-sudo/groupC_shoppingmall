import CartView from '@/domains/cart/components/CartView';
import { getCart } from '@/domains/cart/queries/getCart.query';

export default async function CartPage() {
    const items = await getCart();

    return (
        <div className="mx-auto mb-20 max-w-7xl px-4 pb-4">
            <h1 className="my-4 border-b-1 pb-4 text-2xl md:text-4xl">
                장바구니
            </h1>
            <CartView initialItems={items} />
        </div>
    );
}
