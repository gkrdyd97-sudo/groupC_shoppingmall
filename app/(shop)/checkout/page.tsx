import { getCart } from '@/domains/cart/queries/getCart.query';
import CheckoutForm from '@/domains/orders/components/CheckoutForm';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// 장바구니에서 /checkout?items=1,2,3 으로 넘어옴
function parseCartIds(value: string | string[] | undefined): number[] {
    if (typeof value !== 'string') return [];
    return value
        .split(',')
        .map(Number)
        .filter((id) => Number.isInteger(id) && id > 0);
}

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const cartIds = parseCartIds((await searchParams).items);
    const items = cartIds.length > 0 ? await getCart(cartIds) : [];

    return (
        <div className="mx-auto mb-20 max-w-7xl px-4 pb-4">
            <h1 className="my-4 border-b-1 pb-4 text-2xl md:text-4xl">
                주문/결제
            </h1>
            <CheckoutForm items={items} />
        </div>
    );
}
