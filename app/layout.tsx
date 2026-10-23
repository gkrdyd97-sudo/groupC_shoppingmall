import Footer from '@/shared/components/Footer';
import Header from '@/shared/components/Header';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';

// Noto Sans KR 폰트 인스턴스 생성
const notoSansKr = Noto_Sans_KR({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '900'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'RNOD',
    description: '러너를 위한 기어샵',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className="h-full">
            <body
                className={`${notoSansKr.className} flex min-h-screen flex-col bg-white text-gray-900 antialiased`}
            >
              {children}
            </body>
        </html>
    );
}
