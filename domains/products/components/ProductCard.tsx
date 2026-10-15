import Link from 'next/link';
import { formatPrice } from '@/shared/utils/formatPrice';
import { type Product } from '../types/Product.types';

export default function ProductCard({
    id,
    brand,
    name,
    price,
    images,
}: Product): React.JSX.Element {
    return (
        <Link href={`/products/${id}`} className="group block">
            <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                    src={images[0]}
                    alt={name}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="mt-2">
                <p className="text-xs text-gray-500">{brand}</p>
                <h3 className="truncate text-sm">{name}</h3>
                <p className="mt-1 text-sm font-bold">{formatPrice(price)}</p>
            </div>
        </Link>
    );
}
