'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdAdd, MdRemove } from 'react-icons/md';
import { addToCart } from '@/domains/cart/actions/addToCart.action';
import { formatPrice } from '@/shared/utils/formatPrice';
import { type ProductOption } from '../types/Product.types';

interface ProductActionsProps {
    productId: string;
    salePrice: number;
    options: ProductOption[];
}

export default function ProductActions({
    productId,
    salePrice,
    options,
}: ProductActionsProps): React.JSX.Element {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));
    const increase = () => setQuantity((prev) => prev + 1);

    const handleAdd = async (goToCart: boolean) => {
        if (!selectedId) return;

        setLoading(true);
        setMessage('');

        const result = await addToCart({
            productId,
            optionId: selectedId,
            quantity,
        });

        setLoading(false);

        if (!result.success) {
            setMessage(result.message ?? '담기에 실패했습니다.');
            return;
        }

        if (goToCart) {
            router.push('/cart');
        } else {
            setMessage('장바구니에 담았습니다.');
        }
    };

    return (
        <div className="mt-6 border-t pt-6">
            <p className="mb-2 text-sm font-medium">
                사이즈
                {selectedId && (
                    <span className="ml-2 text-gray-500">
                        {options.find((o) => o.id === selectedId)?.name}
                    </span>
                )}
            </p>

            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedId(option.id)}
                        className={`cursor-pointer border px-4 py-2 text-sm ${
                            option.id === selectedId
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300'
                        }`}
                    >
                        {option.name}
                    </button>
                ))}
            </div>

            {!selectedId && (
                <p className="mt-2 text-xs text-gray-500">
                    사이즈를 선택해 주세요.
                </p>
            )}

            <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium">수량</span>

                <div className="flex items-center border border-gray-300">
                    <button
                        type="button"
                        onClick={decrease}
                        disabled={quantity === 1}
                        aria-label="수량 줄이기"
                        className="cursor-pointer p-2 disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                        <MdRemove />
                    </button>

                    <span className="w-12 text-center text-sm">{quantity}</span>

                    <button
                        type="button"
                        onClick={increase}
                        aria-label="수량 늘리기"
                        className="cursor-pointer p-2"
                    >
                        <MdAdd />
                    </button>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">총 상품 금액</span>
                <span className="text-xl font-bold">
                    {formatPrice(salePrice * quantity)}
                </span>
            </div>

            <div className="mt-4 flex gap-2">
                <button
                    type="button"
                    onClick={() => handleAdd(false)}
                    disabled={!selectedId || loading}
                    className="flex-1 cursor-pointer border border-black py-3 text-sm font-medium disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
                >
                    {loading ? '처리중...' : '장바구니'}
                </button>
                <button
                    type="button"
                    onClick={() => handleAdd(true)}
                    disabled={!selectedId || loading}
                    className="flex-1 cursor-pointer bg-black py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                    {loading ? '처리중...' : '구매하기'}
                </button>
            </div>

            {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
        </div>
    );
}
