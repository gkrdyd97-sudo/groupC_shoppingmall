import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { MOCK_CATEGORIES } from '@/shared/mocks/mockData';
import Link from 'next/link';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { Input } from '@/shared/components/ui/input';
import { type Category } from '@/domains/categories/types/category.types';

function getLeafCategories(categories: Category[]): Category[] {
    return categories.flatMap((cat) =>
        cat.children && cat.children.length > 0
            ? getLeafCategories(cat.children)
            : [cat],
    );
}

export default function CategoryNav() {
    return (
        <div className="w-full border-b border-gray-800 bg-mist-900">
            <div className="mx-auto flex max-w-7xl items-center px-4 md:px-6">
                {/* 모바일 뷰: 가로 스크롤 메뉴 */}
                <nav className="no-scrollbar flex space-x-2 overflow-x-auto py-2.5 md:hidden">
                    <Link
                        href="/products"
                        className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black"
                    >
                        전체
                    </Link>
                    {MOCK_CATEGORIES.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/products?category=${cat.id}`}
                            className="shrink-0 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-700"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                {/* 데스크톱 뷰 (md:): 중첩 드롭다운 GNB 메뉴 */}
                <nav className="hidden w-full items-center gap-6 py-3 md:flex">
                    <Link
                        href="/products"
                        className="text-sm font-bold text-white transition-colors hover:text-blue-400"
                    >
                        전체 카테고리
                    </Link>
                    {MOCK_CATEGORIES.map((cat) => (
                        <div key={cat.id} className="relative">
                            {cat.children && cat.children.length > 0 ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        openOnHover
                                        delay={0}
                                        closeDelay={150}
                                        className="flex items-center gap-1 text-sm font-medium text-gray-300 transition-colors outline-none hover:text-blue-400"
                                    >
                                        <span>{cat.name}</span>
                                        <FiChevronDown className="h-3.5 w-3.5 text-gray-400" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="w-44 bg-white p-1 shadow-lg"
                                    >
                                        <DropdownMenuItem>
                                            <Link
                                                href={`/products?category=${cat.id}`}
                                                className="w-full cursor-pointer text-xs font-bold text-blue-600"
                                            >
                                                {cat.name} 전체보기
                                            </Link>
                                        </DropdownMenuItem>
                                        {getLeafCategories(cat.children).map(
                                            (sub) => (
                                                <DropdownMenuItem key={sub.id}>
                                                    <Link
                                                        href={
                                                            sub.productId
                                                                ? `/products/${sub.productId}`
                                                                : `/products?category=${sub.id}`
                                                        }
                                                        className="w-full cursor-pointer text-xs text-gray-700"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ),
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    href={`/products?category=${cat.id}`}
                                    className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400"
                                >
                                    ALL 
                                </Link>
                            )}
                        </div>
                    ))}
                    <form
                        method="get"
                        action="/products"
                        className="relative ml-auto w-80"
                    >
                        <Input
                            type="text"
                            name="keyword"
                            placeholder="Search"
                            className="rounded-none bg-white pr-8 text-black focus-visible:border-black focus-visible:ring-white"
                        />
                        <button
                            type="submit"
                            className="absolute top-1/2 right-2.5 cursor-pointer"
                        >
                            <FiSearch className="h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </button>
                    </form>
                </nav>
            </div>
        </div>
    );
}
