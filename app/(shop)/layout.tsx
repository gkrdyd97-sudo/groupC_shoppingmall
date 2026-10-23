import { connection } from 'next/server';
import Footer from '@/shared/components/Footer';
import Header from '@/shared/components/Header';
import { Suspense } from 'react';

async function ConnectionGate() {
    await connection();
    return null;
}

export default function MainPage({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Suspense>
                <ConnectionGate />
            </Suspense>

            <Suspense fallback={<div>로딩중...</div>}>
                <Header />
            </Suspense>

            <main>{children}</main>
            <Footer />
        </>
    );
}
