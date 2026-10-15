import { notFound } from 'next/navigation';
import { products } from '@/shared/mocks/products.mock';
import { formatPrice } from '@/shared/utils/formatPrice';
import { Suspense } from 'react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
    params,
}: PageProps): Promise<React.JSX.Element> {
    const { id } = await params;

    const product = products.find((p) => p.id === Number(id));

    if (!product) notFound();

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                {/* 왼쪽 — 이미지 */}
                <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* 오른쪽 — 정보 */}
                <div>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
                    <p className="mt-3 text-xl font-bold">
                        {formatPrice(product.price)}
                    </p>
                    <p className="mt-3 text-sm text-gray-600">
                        {product.description}
                    </p>

                    <div className="mt-6 border-t pt-6">
                        <p className="mb-2 text-sm font-medium">사이즈</p>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                                <span
                                    key={size}
                                    className="border border-gray-300 px-4 py-2 text-sm"
                                >
                                    {size}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 아래 — 상품 정보 표 */}
            <section className="mt-12 border-t pt-6">
                <h2 className="mb-4 font-bold">상품 정보</h2>
                <table className="text-sm">
                    <tbody>
                        <tr>
                            <th className="py-1 pr-8 text-left font-normal text-gray-500">
                                스타일 코드
                            </th>
                            <td className="py-1">{product.styleCode}</td>
                        </tr>
                        <tr>
                            <th className="py-1 pr-8 text-left font-normal text-gray-500">
                                원산지
                            </th>
                            <td className="py-1">{product.country}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}
