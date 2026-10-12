import type { Metadata } from 'next';
import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer';
import './globals.css';

export const metadata: Metadata = {
    title: 'Team Shopping Mall',
    description: '쇼핑몰 팀 프로젝트',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className="flex min-h-screen flex-col bg-white text-gray-900">
                <Header />
                <main className="w-full flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}