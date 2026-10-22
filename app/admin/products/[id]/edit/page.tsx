// 관리자 > 상품 수정
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import { getCategoryRows } from '@/domains/categories/queries/getCategoryRows.query';
import { flattenCategoryTree } from '@/domains/categories/utils/categoryTree';
import ProductAdminForm from '@/domains/products/components/ProductAdminForm';
import { getAdminProductForm } from '@/domains/products/queries/getAdminProducts.query';

export const instant = false;

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Supabase 가 내부에서 현재 시각(Date.now)을 사용하므로, 요청이 들어온 뒤에 실행되도록 표시
    await connection();
    const { id } = await params;
    const [product, categoryRows] = await Promise.all([
        getAdminProductForm(id),
        getCategoryRows(),
    ]);
    if (!product) notFound();

    return (
        <div>
            <AdminPageHeader title="상품 수정" description={product.name} />
            <ProductAdminForm
                productId={id}
                initialData={product}
                categories={flattenCategoryTree(categoryRows)}
            />
        </div>
    );
}
