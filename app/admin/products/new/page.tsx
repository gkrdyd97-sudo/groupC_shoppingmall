// 관리자 > 상품 등록
import { connection } from 'next/server';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import { getCategoryRows } from '@/domains/categories/queries/getCategoryRows.query';
import { flattenCategoryTree } from '@/domains/categories/utils/categoryTree';
import ProductAdminForm from '@/domains/products/components/ProductAdminForm';

export const instant = false;

export default async function NewProductPage() {
    // Supabase 가 내부에서 현재 시각(Date.now)을 사용하므로, 요청이 들어온 뒤에 실행되도록 표시
    await connection();
    const categoryRows = await getCategoryRows();

    return (
        <div>
            <AdminPageHeader title="상품 등록" />
            <ProductAdminForm categories={flattenCategoryTree(categoryRows)} />
        </div>
    );
}
