'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductActionsProps {
    sizes: string[];
}

export default function ProductActions({
    sizes,
}: ProductActionsProps): React.JSX.Element {
    const router = useRouter();
    const [selectedSize, setSelectedSize] = useState('');

    return (
        <div className="mt-6 border-t pt-6">
            <p className="mb-2 text-sm font-medium">
                사이즈
                {selectedSize && (
                    <span className="ml-2 text-gray-500">{selectedSize}</span>
                )}
            </p>

            <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                    <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`border px-4 py-2 text-sm ${
                            size === selectedSize
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300'
                        }`}
                    >
                        {size}
                    </button>
                ))}
            </div>

            {!selectedSize && (
                <p className="mt-2 text-xs text-gray-500">
                    사이즈를 선택해 주세요.
                </p>
            )}

            <div className="mt-6 flex gap-2">
                <button
                    type="button"
                    onClick={() => router.push('/cart')}
                    disabled={!selectedSize}
                    className="flex-1 border border-black py-3 text-sm font-medium disabled:border-gray-300 disabled:text-gray-300"
                >
                    장바구니
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/checkout')}
                    disabled={!selectedSize}
                    className="flex-1 bg-black py-3 text-sm font-medium text-white disabled:bg-gray-300"
                >
                    구매하기
                </button>
            </div>
        </div>
    );
}
