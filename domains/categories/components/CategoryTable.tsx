// 관리자 카테고리 트리 목록 (서버 컴포넌트)
// 버튼(진열 전환, 삭제)만 클라이언트 컴포넌트(ConfirmActionButton)로 동작
import Link from 'next/link';
import ConfirmActionButton from '@/domains/admin/components/ConfirmActionButton';
import { cn } from '@/shared/utils/cn';
import {
    deleteCategoryAction,
    toggleCategoryActiveAction,
} from '../actions/category.actions';
import type { CategoryTreeItem } from '../types/category.types';

interface CategoryTableProps {
    items: CategoryTreeItem[];
    productCounts: Record<string, number>;
}

export default function CategoryTable({
    items,
    productCounts,
}: CategoryTableProps) {
    if (items.length === 0) {
        return (
            <p className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">
                등록된 분류가 없습니다.
            </p>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500">
                    <tr>
                        <th className="px-4 py-3 text-left">분류명</th>
                        <th className="w-24 px-4 py-3">진열 순서</th>
                        <th className="w-24 px-4 py-3">상품 수</th>
                        <th className="w-24 px-4 py-3">진열</th>
                        <th className="w-56 px-4 py-3">관리</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {items.map((item) => (
                        <tr
                            key={item.id}
                            className={cn(
                                !item.active && 'bg-gray-50 text-gray-400',
                            )}
                        >
                            {/* depth 만큼 들여써서 트리 구조 표현 */}
                            <td
                                className="px-4 py-3"
                                style={{ paddingLeft: 16 + item.depth * 24 }}
                            >
                                {item.depth > 0 && (
                                    <span className="mr-1 text-gray-300">
                                        └
                                    </span>
                                )}
                                <span
                                    className={cn(
                                        item.depth === 0 && 'font-semibold',
                                    )}
                                >
                                    {item.name}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                {item.sortOrder}
                            </td>
                            <td className="px-4 py-3 text-center">
                                {productCounts[item.id] ?? 0}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <span
                                    className={cn(
                                        'rounded-full px-2 py-0.5 text-[11px] font-bold',
                                        item.active
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'bg-gray-200 text-gray-500',
                                    )}
                                >
                                    {item.active ? '노출' : '숨김'}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex justify-center gap-1.5">
                                    <ConfirmActionButton
                                        action={toggleCategoryActiveAction.bind(
                                            null,
                                            item.id,
                                            !item.active,
                                        )}
                                        label={
                                            item.active ? '숨기기' : '노출하기'
                                        }
                                    />
                                    <Link
                                        href={`/admin/category/${item.id}/edit`}
                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        수정
                                    </Link>
                                    <ConfirmActionButton
                                        action={deleteCategoryAction.bind(
                                            null,
                                            item.id,
                                        )}
                                        label="삭제"
                                        variant="danger"
                                        confirmMessage={`'${item.name}' 분류를 삭제하시겠습니까?`}
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
