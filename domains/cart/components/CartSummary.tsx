import { Button } from '@/shared/components/ui/button';

export interface CartSummaryProps {
    checkedCount: number;
    totalPrice: number;
}

const SHIPPING_FEE = 3000;

export default function CartSummary({
    checkedCount,
    totalPrice,
}: CartSummaryProps) {
    const shippingFee = checkedCount > 0 ? SHIPPING_FEE : 0;
    const paymentPrice = totalPrice + shippingFee;

    return (
        <div className="rounded-lg border p-5">
            <h3 className="mb-4 text-2xl font-bold">주문요약</h3>
            <div className="flex flex-col gap-2 border-t-1">
                <div className="mt-4 flex justify-between">
                    <span>상품수</span>
                    <span>{checkedCount}개</span>
                </div>
                <div className="flex justify-between">
                    <span>상품 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                    <span>배송비</span>
                    <span>{shippingFee.toLocaleString()}원</span>
                </div>
            </div>
            <div className="mt-4 flex justify-between border-t-1 pt-2">
                <span>총 결제 예정 금액</span>
                <span>{paymentPrice.toLocaleString()}원</span>
            </div>
            <Button
                type="button"
                className="mt-5 h-15 w-full cursor-pointer bg-blue-500 text-2xl hover:bg-blue-500"
                disabled={checkedCount === 0}
            >
                구매하기
            </Button>
        </div>
    );
}
