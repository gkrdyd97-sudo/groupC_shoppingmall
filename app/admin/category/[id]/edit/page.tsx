// 관리자 > 카테고리 수정
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import CategoryForm from '@/domains/categories/components/CategoryForm';
import { getCategoryRows } from '@/domains/categories/queries/getCategoryRows.query';
import {
    flattenCategoryTree,
    getDescendantIds,
} from '@/domains/categories/utils/categoryTree';

export const instant = false;

export default async function EditCategoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Supabase 가 내부에서 현재 시각(Date.now)을 사용하므로, 요청이 들어온 뒤에 실행되도록 표시
    await connection();
    const { id } = await params;
    const rows = await getCategoryRows();
    const category = rows.find((row) => row.id === id);
    if (!category) notFound();

    // 상위 분류 선택지에서 자기 자신과 자기 하위 분류는 제외 (순환 방지)
    const excluded = new Set([id, ...getDescendantIds(rows, id)]);
    const parentOptions = flattenCategoryTree(rows).filter(
        (item) => !excluded.has(item.id),
    );

    return (
        <div>
            <AdminPageHeader title="분류 수정" description={category.name} />
            <CategoryForm
                categoryId={id}
                parentOptions={parentOptions}
                initialData={{
                    name: category.name,
                    parentId: category.parentId ?? '',
                    sortOrder: String(category.sortOrder),
                    active: category.active,
                }}
            />
        </div>
    );
}
