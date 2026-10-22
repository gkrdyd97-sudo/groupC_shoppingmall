import ProductCard from '@/domains/products/components/ProductCard';
import { getProducts } from '@/domains/products/queries/getProducts.query';

interface PageProps {
    searchParams: Promise<{ category?: string }>;
}

export const instant = false;

export default async function ProductList({
    searchParams,
}: PageProps): Promise<React.JSX.Element> {
    const { category } = await searchParams;
    const products = await getProducts(category);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <h1 className="mb-6 text-2xl font-bold">
                {category ?? '전체 상품'}{' '}
                <span className="text-sm font-normal text-gray-500">
                    총 {products.length}개
                </span>
            </h1>

            {products.length === 0 ? (
                <p className="py-20 text-center text-sm text-gray-500">
                    등록된 상품이 없습니다.
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            )}
        </div>
    );
}
