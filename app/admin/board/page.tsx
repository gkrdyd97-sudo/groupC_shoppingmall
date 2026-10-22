// 관리자 > 게시판 관리
// 쿼리: ?board=qna&field=title&q=검색어&page=2
import { connection } from 'next/server';
import Link from 'next/link';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import Pagination from '@/domains/boards/components/Pagination';
import PostAdminTable from '@/domains/boards/components/PostAdminTable';
import {
    BOARD_INFO,
    POSTS_PER_PAGE,
} from '@/domains/boards/constants/board.constants';
import { getPosts } from '@/domains/boards/queries/getPosts.query';
import type {
    BoardId,
    PostSearchField,
} from '@/domains/boards/types/post.types';
import { isBoardId, parsePage } from '@/domains/boards/utils/postValidation';
import { cn } from '@/shared/utils/cn';

export const instant = false;

const BOARD_IDS = Object.keys(BOARD_INFO) as BoardId[];

export default async function AdminBoardPage({
    searchParams,
}: {
    searchParams: Promise<{
        board?: string;
        field?: string;
        q?: string;
        page?: string;
    }>;
}) {
    // Supabase 가 내부에서 현재 시각(Date.now)을 사용하므로, 요청이 들어온 뒤에 실행되도록 표시
    await connection();
    const query = await searchParams;
    // 잘못된 게시판 값이면 공지사항 탭으로
    const boardId: BoardId =
        query.board && isBoardId(query.board) ? query.board : 'notice';
    const field: PostSearchField =
        query.field === 'content' ? 'content' : 'title';
    const keyword = query.q?.trim() ?? '';
    const page = parsePage(query.page);

    const { posts, totalCount } = await getPosts({
        boardId,
        page,
        field,
        keyword,
    });

    // 페이지를 넘겨도 게시판·검색 조건 유지
    const keepParams: Record<string, string> = { board: boardId };
    if (keyword) Object.assign(keepParams, { field, q: keyword });

    return (
        <div>
            <AdminPageHeader
                title="게시판 관리"
                description="공지사항 작성과 게시글 관리(삭제)를 합니다."
                action={{ label: '+ 공지 작성', href: '/boards/notice/new' }}
            />

            {/* 게시판 탭 */}
            <div className="mb-4 flex gap-2">
                {BOARD_IDS.map((id) => (
                    <Link
                        key={id}
                        href={`/admin/board?board=${id}`}
                        className={cn(
                            'rounded-full px-4 py-1.5 text-xs font-semibold',
                            id === boardId
                                ? 'bg-gray-900 text-white'
                                : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50',
                        )}
                    >
                        {BOARD_INFO[id].title}
                    </Link>
                ))}
            </div>

            {/* 검색 (현재 탭 유지를 위해 board 값을 hidden 으로 함께 전송) */}
            <form method="get" className="mb-4 flex items-center gap-2">
                <input type="hidden" name="board" value={boardId} />
                <select
                    name="field"
                    defaultValue={field}
                    aria-label="검색 대상"
                    className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm"
                >
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                </select>
                <input
                    name="q"
                    defaultValue={keyword}
                    placeholder="검색어"
                    aria-label="검색어"
                    className="h-9 w-64 rounded-lg border border-gray-300 bg-white px-3 text-sm"
                />
                <button
                    type="submit"
                    className="h-9 rounded-lg bg-gray-900 px-4 text-sm text-white"
                >
                    검색
                </button>
                <span className="ml-auto text-sm text-gray-500">
                    총 {totalCount}개
                </span>
            </form>

            <PostAdminTable
                boardId={boardId}
                posts={posts}
                startNumber={totalCount - (page - 1) * POSTS_PER_PAGE}
            />

            <div className="mt-6 flex justify-center">
                <Pagination
                    basePath="/admin/board"
                    currentPage={page}
                    totalPages={Math.ceil(totalCount / POSTS_PER_PAGE)}
                    searchParams={keepParams}
                />
            </div>
        </div>
    );
}
