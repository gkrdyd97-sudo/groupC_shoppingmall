import Link from 'next/link';
import { FiGrid, FiShoppingBag, FiUser } from 'react-icons/fi';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

export default function Header() {
    return (
        <header
            className={cn(
                'sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md',
            )}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="text-xl font-bold">
                    Team Shopping
                </Link>

                <nav className="flex items-center gap-4">
                    <Link href="/products" className="flex items-center gap-2">
                        <FiGrid />
                        <span>상품</span>
                    </Link>

                    <Link href="/cart" className="flex items-center gap-2">
                        <FiShoppingBag />
                        <span>장바구니</span>
                    </Link>

                    <Button variant="outline" asChild>
                        <Link href="/login" className="flex items-center gap-2">
                            <FiUser />
                            로그인
                        </Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}