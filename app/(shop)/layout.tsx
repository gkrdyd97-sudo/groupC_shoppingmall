'use client';
// 헤더 - 푸터 공통 레이아웃 - 김민지

import Footer from '@/shared/components/Footer';
import Header from '@/shared/components/Header';
import { Suspense } from 'react';
export default function MainPage({
    children,
}: {
    children: React.ReactNode;
}): React.JSX.Element {
    return (
        <main>
            <Header />
            <Suspense fallback={<div>로딩중...</div>}>{children}</Suspense>
            <Footer />
        </main>
    );
}
