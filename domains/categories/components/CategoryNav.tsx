import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLinkItem,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import Link from 'next/link';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { Input } from '@/shared/components/ui/input';
import { getCategoryTree } from '../queries/getCategoryTree.query';
import { getProducts } from '@/domains/products/queries/getProducts.query';
import { type Category } from '@/domains/categories/types/category.types';

async function CategoryDropdown({ cat }: { cat: Category }) {
    const products = await getProducts(cat.name);

    return (
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
                <DropdownMenuLinkItem
                    render={
                        <Link
                            href={`/products?category=${cat.name}`}
                            className="w-full cursor-pointer text-xs font-bold text-blue-600"
                        />
                    }
                >
                    {cat.name} 전체보기
                </DropdownMenuLinkItem>
                {products.slice(0, 5).map((product) => (
                    <DropdownMenuLinkItem
                        key={product.id}
                        render={
                            <Link
                                href={`/products/${product.id}`}
                                className="w-full cursor-pointer text-xs text-gray-700"
                            />
                        }
                    >
                        {product.name}
                    </DropdownMenuLinkItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default async function CategoryNav() {
    const categories = await getCategoryTree();
    const NAV_CATEGORIES = categories;
    return (
        <div className="w-full border-b border-gray-800 bg-mist-900">
            <div className="mx-auto flex max-w-7xl items-center px-4 md:px-6">
                {/* 모바일 뷰: 가로 스크롤 메뉴 */}
                <nav className="no-scrollbar flex space-x-2 overflow-x-auto py-2.5 md:hidden">
                    <Link
                        href="/products"
                        className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black"
                    >
                        전체상품
                    </Link>
                    {NAV_CATEGORIES.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/products?category=${cat.name}`}
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
                        전체상품
                    </Link>
                    {NAV_CATEGORIES.map((cat) => (
                        <div key={cat.id} className="relative">
                            {cat.children && cat.children.length > 0 ? (
                                <CategoryDropdown cat={cat} />
                            ) : (
                                <Link
                                    href={`/products?category=${cat.name}`}
                                    className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400"
                                >
                                    {cat.name}
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
