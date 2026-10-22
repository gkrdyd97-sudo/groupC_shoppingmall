// 관리자 > 카테고리 등록
import { connection } from 'next/server';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import CategoryForm from '@/domains/categories/components/CategoryForm';
import { getCategoryRows } from '@/domains/categories/queries/getCategoryRows.query';
import { flattenCategoryTree } from '@/domains/categories/utils/categoryTree';

export const instant = false;

export default async function AddCategoryPage() {
    // Supabase 가 내부에서 현재 시각(Date.now)을 사용하므로, 요청이 들어온 뒤에 실행되도록 표시
    await connection();
    const rows = await getCategoryRows();

    return (
        <div>
            <AdminPageHeader title="분류 등록" />
            <CategoryForm parentOptions={flattenCategoryTree(rows)} />
        </div>
    );
}
