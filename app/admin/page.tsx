// 관리자 대시보드 - 관리 메뉴별 현황 요약
import { connection } from 'next/server';
import Link from 'next/link';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import { createServerClient } from '@/shared/lib/supabase';

export const instant = false;

// 테이블별 개수 조회 (head: true → 데이터 없이 개수만 받음)
async function getSummary() {
    // Supabase 가 내부에서 현재 시각(Date.now)을 사용하므로, 요청이 들어온 뒤에 실행되도록 표시
    await connection();
    const supabase = createServerClient();
    const [products, categories, hiddenCategories, notices, qnas] =
        await Promise.all([
            supabase
                .from('PRODUCTS')
                .select('id', { count: 'exact', head: true })
                .is('deleted_at', null),
            supabase
                .from('PRODUCT_CATEGORY')
                .select('id', { count: 'exact', head: true }),
            supabase
                .from('PRODUCT_CATEGORY')
                .select('id', { count: 'exact', head: true })
                .eq('active', false),
            supabase
                .from('POSTS')
                .select('id', { count: 'exact', head: true })
                .eq('board_id', 'notice')
                .is('deleted_at', null),
            supabase
                .from('POSTS')
                .select('id', { count: 'exact', head: true })
                .eq('board_id', 'qna')
                .is('deleted_at', null),
        ]);

    return {
        products: products.count ?? 0,
        categories: categories.count ?? 0,
        hiddenCategories: hiddenCategories.count ?? 0,
        notices: notices.count ?? 0,
        qnas: qnas.count ?? 0,
    };
}

export default async function AdminMainPage() {
    const summary = await getSummary();

    const cards = [
        {
            title: '상품 관리',
            href: '/admin/products',
            value: `${summary.products}개`,
            detail: '판매 중인 상품',
        },
        {
            title: '카테고리/진열 관리',
            href: '/admin/category',
            value: `${summary.categories}개`,
            detail: `숨김 분류 ${summary.hiddenCategories}개`,
        },
        {
            title: '게시판 관리',
            href: '/admin/board',
            value: `${summary.notices + summary.qnas}개`,
            detail: `공지 ${summary.notices} · Q&A ${summary.qnas}`,
        },
    ];

    return (
        <div>
            <AdminPageHeader
                title="대시보드"
                description="쇼핑몰 운영 현황을 한눈에 확인합니다."
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {cards.map((card) => (
                    <Link
                        key={card.href}
                        href={card.href}
                        className="rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-400"
                    >
                        <p className="text-xs font-semibold text-gray-500">
                            {card.title}
                        </p>
                        <p className="mt-2 text-3xl font-black text-gray-900">
                            {card.value}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                            {card.detail}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
