import CheckoutForm from '@/domains/orders/components/CheckoutForm';

export default function CheckoutPage() {
    return (
        <div className="mx-auto mb-20 max-w-7xl px-4 pb-4">
            <h1 className="my-4 border-b-1 pb-4 text-2xl md:text-4xl">
                주문/결제
            </h1>
            <CheckoutForm />
        </div>
    );
}
