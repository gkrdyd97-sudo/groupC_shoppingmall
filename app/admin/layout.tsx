export const instant = false;

import { connection } from 'next/server';
import { getCurrentUser } from '@/domains/users/queries/getCurrentUser.query';
import AdminSidebar from '@/domains/admin/components/AdminSidebar';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Supabase 가 내부에서 현재 시각(Date.now)을 사용하므로, 요청이 들어온 뒤에 실행되도록 표시
    await connection();
    const user = await getCurrentUser();
    const isAdmin = Boolean(user?.userType === 'ADMIN');

    // 비로그인 사용자 접근 시 로그인 페이지로 리다이렉트
    if (!user) {
        redirect('/login?redirectUrl=/admin');
    }

    // 일반 회원이 관리자 URL 직접 접근 시 메인 홈으로 차단
    if (!isAdmin) {
        redirect('/');
    }

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            <Suspense
                fallback={
                    <div className="h-96 w-full max-w-md animate-pulse rounded-3xl bg-gray-100" />
                }
            >
                {/* 관리자 사이드바 */}
                <AdminSidebar />

                {/* 관리자 컨텐츠 영역 */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </Suspense>
        </div>
    );
}
