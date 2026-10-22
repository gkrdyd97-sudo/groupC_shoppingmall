// 관리자 상품 목록 표 (서버 컴포넌트)
import Link from 'next/link';
import ConfirmActionButton from '@/domains/admin/components/ConfirmActionButton';
import { formatPrice } from '@/shared/utils/formatPrice';
import { deleteProductAction } from '../actions/product.admin.actions';
import type { AdminProductRow } from '../types/Product.types';

export default function ProductAdminTable({
    products,
}: {
    products: AdminProductRow[];
}) {
    if (products.length === 0) {
        return (
            <p className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">
                조건에 맞는 상품이 없습니다.
            </p>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500">
                    <tr>
                        <th className="px-4 py-3 text-left">상품명</th>
                        <th className="w-32 px-4 py-3">카테고리</th>
                        <th className="w-28 px-4 py-3 text-right">판매가</th>
                        <th className="w-28 px-4 py-3 text-right">정가</th>
                        <th className="w-20 px-4 py-3">옵션</th>
                        <th className="w-28 px-4 py-3">등록일</th>
                        <th className="w-44 px-4 py-3">관리</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="px-4 py-3">
                                {/* 쇼핑몰 상세 페이지를 새 탭으로 열어 확인 */}
                                <Link
                                    href={`/products/${product.id}`}
                                    target="_blank"
                                    className="font-semibold text-gray-900 hover:underline"
                                >
                                    {product.name}
                                </Link>
                                <p className="text-xs text-gray-400">
                                    {product.brand} · {product.styleCode}
                                </p>
                            </td>
                            <td className="px-4 py-3 text-center text-gray-600">
                                {product.categoryName ?? '-'}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold">
                                {formatPrice(product.salePrice)}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-500">
                                {formatPrice(product.consumerPrice)}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-600">
                                {product.optionCount}개
                            </td>
                            <td className="px-4 py-3 text-center text-xs text-gray-500">
                                {new Date(product.createdAt).toLocaleDateString(
                                    'ko-KR',
                                    {
                                        timeZone: 'Asia/Seoul',
                                    },
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex justify-center gap-1.5">
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        수정
                                    </Link>
                                    <ConfirmActionButton
                                        action={deleteProductAction.bind(
                                            null,
                                            product.id,
                                        )}
                                        label="삭제"
                                        variant="danger"
                                        confirmMessage={`'${product.name}' 상품을 삭제하시겠습니까?\n(쇼핑몰에서 숨겨지며 주문 내역은 유지됩니다)`}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
