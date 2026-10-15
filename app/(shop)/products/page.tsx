import { products } from '@/shared/mocks/products.mock';
import ProductCard from '@/domains/products/components/ProductCard';
import React from 'react';

export default function ProductList(): React.JSX.Element {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <h1 className="mb-6 text-2xl font-bold">
                전체 상품{' '}
                <span className="text-sm font-normal text-gray-500">
                    총 {products.length}개
                </span>
            </h1>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </div>
    );
}
