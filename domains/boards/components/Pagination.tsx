// 게시판 페이지 번호 (서버 컴포넌트)
// 페이지를 옮겨도 검색 조건(field, q)은 유지되도록 링크를 만든다.
import Link from 'next/link';
import { cn } from '@/shared/utils/cn';
import { PAGE_GROUP_SIZE } from '../constants/board.constants';
import { getPageNumbers } from '../utils/postValidation';

interface PaginationProps {
    basePath: string; // 예: /boards/qna
    currentPage: number;
    totalPages: number;
    searchParams: Record<string, string>; // 유지할 쿼리 (field, q)
}

export default function Pagination({
    basePath,
    currentPage,
    totalPages,
    searchParams,
}: PaginationProps) {
    const pages = getPageNumbers(currentPage, totalPages, PAGE_GROUP_SIZE);
    if (pages.length === 0) return null;

    // 기존 검색 조건 + page 번호로 링크 생성
    const hrefOf = (page: number) =>
        `${basePath}?${new URLSearchParams({ ...searchParams, page: String(page) })}`;

    const firstOfGroup = pages[0];
    const lastOfGroup = pages[pages.length - 1];

    return (
        <nav
            aria-label="페이지 이동"
            className="flex items-center gap-3 text-sm text-gray-500"
        >
            {/* 이전 묶음 (예: 6~10 → 5) */}
            {firstOfGroup > 1 && (
                <Link
                    href={hrefOf(firstOfGroup - 1)}
                    className="hover:text-gray-900"
                >
                    이전
                </Link>
            )}

            {pages.map((page) => (
                <Link
                    key={page}
                    href={hrefOf(page)}
                    aria-current={page === currentPage ? 'page' : undefined}
                    className={cn(
                        'hover:text-gray-900',
                        page === currentPage && 'font-semibold text-gray-900',
                    )}
                >
                    {page}
                </Link>
            ))}

            {/* 다음 묶음 (예: 1~5 → 6) */}
            {lastOfGroup < totalPages && (
                <Link
                    href={hrefOf(lastOfGroup + 1)}
                    className="hover:text-gray-900"
                >
                    다음
                </Link>
            )}
        </nav>
    );
}
