// 헤더 - 푸터 공통 레이아웃 - 김민지

import Footer from '@/shared/components/Footer';
import Header from '@/shared/components/Header';

export default function MainPage({children}: {
    children: React.ReactNode;
}): React.JSX.Element {

    return (
        <main>
            <Header />
            {children}
            <Footer />
        </main>
    );
}
