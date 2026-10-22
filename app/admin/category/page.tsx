// 관리자 > 카테고리/진열 관리 목록
import { connection } from 'next/server';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import CategoryTable from '@/domains/categories/components/CategoryTable';
import {
    getCategoryRows,
    getProductCountByCategory,
} from '@/domains/categories/queries/getCategoryRows.query';
import { flattenCategoryTree } from '@/domains/categories/utils/categoryTree';

// 관리자 화면은 항상 최신 DB 를 보여줘야 해서 요청 시점에 렌더링 (팀 공통 패턴)
export const instant = false;

export default async function AdminCategoryPage() {
    // Supabase 가 내부에서 현재 시각(Date.now)을 사용하므로, 요청이 들어온 뒤에 실행되도록 표시
    await connection();
    const [rows, productCounts] = await Promise.all([
        getCategoryRows(),
        getProductCountByCategory(),
    ]);

    return (
        <div>
            <AdminPageHeader
                title="카테고리/진열 관리"
                description="분류 구조와 진열 순서, 쇼핑몰 노출 여부를 관리합니다."
                action={{ label: '+ 분류 등록', href: '/admin/category/new' }}
            />
            <CategoryTable
                items={flattenCategoryTree(rows)}
                productCounts={productCounts}
            />
        </div>
    );
}
