// 관리자 > 상품 관리 목록
// 쿼리: ?q=검색어&category=카테고리id&page=2
import { connection } from 'next/server';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import Pagination from '@/domains/boards/components/Pagination';
import { parsePage } from '@/domains/boards/utils/postValidation';
import { getCategoryRows } from '@/domains/categories/queries/getCategoryRows.query';
import { flattenCategoryTree } from '@/domains/categories/utils/categoryTree';
import ProductAdminTable from '@/domains/products/components/ProductAdminTable';
import {
    ADMIN_PRODUCTS_PER_PAGE,
    getAdminProducts,
} from '@/domains/products/queries/getAdminProducts.query';

export const instant = false;

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
    // Supabase 가 내부에서 현재 시각(Date.now)을 사용하므로, 요청이 들어온 뒤에 실행되도록 표시
    await connection();
    const query = await searchParams;
    const keyword = query.q?.trim() ?? '';
    const categoryId = query.category ?? '';
    const page = parsePage(query.page);

    const [{ products, totalCount }, categoryRows] = await Promise.all([
        getAdminProducts({ page, keyword, categoryId }),
        getCategoryRows(),
    ]);

    // 페이지를 넘겨도 검색 조건 유지
    const keepParams: Record<string, string> = {};
    if (keyword) keepParams.q = keyword;
    if (categoryId) keepParams.category = categoryId;

    return (
        <div>
            <AdminPageHeader
                title="상품 관리"
                description="상품 정보와 가격, 옵션을 관리합니다."
                action={{ label: '+ 상품 등록', href: '/admin/products/new' }}
            />

            {/* 검색: 기본 GET 폼이라 제출하면 ?q=&category= 로 이동 */}
            <form
                method="get"
                className="mb-4 flex flex-wrap items-center gap-2"
            >
                <select
                    name="category"
                    defaultValue={categoryId}
                    aria-label="카테고리"
                    className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm"
                >
                    <option value="">전체 카테고리</option>
                    {flattenCategoryTree(categoryRows).map((category) => (
                        <option key={category.id} value={category.id}>
                            {'　'.repeat(category.depth)}
                            {category.name}
                        </option>
                    ))}
                </select>
                <input
                    name="q"
                    defaultValue={keyword}
                    placeholder="상품명 또는 스타일 코드"
                    aria-label="검색어"
                    className="h-9 w-64 rounded-lg border border-gray-300 bg-white px-3 text-sm"
                />
                <button
                    type="submit"
                    className="h-9 rounded-lg bg-gray-900 px-4 text-sm text-white"
                >
                    검색
                </button>
                <span className="ml-auto text-sm text-gray-500">
                    총 {totalCount}개
                </span>
            </form>

            <ProductAdminTable products={products} />

            <div className="mt-6 flex justify-center">
                <Pagination
                    basePath="/admin/products"
                    currentPage={page}
                    totalPages={Math.ceil(totalCount / ADMIN_PRODUCTS_PER_PAGE)}
                    searchParams={keepParams}
                />
            </div>
        </div>
    );
}
