import { connection } from 'next/server';
import CategoryNav from '@/domains/categories/components/CategoryNav';
import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';
import AuthStatus from './AuthStatus';
export default async function Header() {
    await connection();
    return (
        <header
            className={cn(
                'backgrop-blur-md sticky top-0 z-50 w-full border-b border-gray-200 bg-mist-900 transition-all',
            )}
        >
            {/* 기본 모바일: h-14, px-4 / md 이상: h-16, px-6 */}
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
                {/* 로고 영역 */}
                <Link
                    href="/"
                    className="text-xl font-black tracking-tight text-white transition-colors hover:text-white/80 md:text-2xl"
                >
                    RNDO
                </Link>

                {/* 네비게이션 영역 */}
                <nav
                    aria-label="사용자메뉴"
                    className="flex items-center gap-1 md:gap-3"
                >
                    {/* 전체 상품 링크: 2일차에 카테고리 GNB로 확장 */}

                    {/* 장바구니 링크 */}
                    <Link
                        href="/cart"
                        aria-label="장바구니"
                        className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-white transition-colors hover:bg-white/10 md:px-3 md:text-sm"
                    >
                        <FiShoppingBag className="h-4 w-4 shrink-0" />
                        <span className="hidden md:inline"></span>
                    </Link>
                    <AuthStatus />
                </nav>
            </div>
            <CategoryNav />
        </header>
    );
}
