// 게시판 목록 페이지 (/boards/notice, /boards/qna)
// 쿼리: ?page=2&field=title&q=배송
import { connection } from 'next/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Pagination from '@/domains/boards/components/Pagination';
import PostList from '@/domains/boards/components/PostList';
import PostSearch from '@/domains/boards/components/PostSearch';
import {
    BOARD_INFO,
    POSTS_PER_PAGE,
} from '@/domains/boards/constants/board.constants';
import { getPosts } from '@/domains/boards/queries/getPosts.query';
import type { PostSearchField } from '@/domains/boards/types/post.types';
import { canWritePost } from '@/domains/boards/utils/boardPermission';
import { isBoardId, parsePage } from '@/domains/boards/utils/postValidation';
import { getCurrentUser } from '@/domains/users/queries/getCurrentUser.query';

type Params = Promise<{ boardId: string }>;
type SearchParams = Promise<{ page?: string; field?: string; q?: string }>;

// params/searchParams/로그인 쿠키는 요청마다 달라서 Suspense 안에서 읽는다 (cacheComponents 규칙)
async function BoardContent({
    params,
    searchParams,
}: {
    params: Params;
    searchParams: SearchParams;
}) {
    // Supabase 가 내부에서 현재 시각(Date.now)을 사용하므로, 요청이 들어온 뒤에 실행되도록 표시
    await connection();
    const { boardId } = await params;
    // notice, qna 외의 게시판 주소는 404
    if (!isBoardId(boardId)) notFound();

    const query = await searchParams;
    const page = parsePage(query.page);
    const field: PostSearchField =
        query.field === 'content' ? 'content' : 'title';
    const keyword = query.q?.trim() ?? '';

    // 게시글 목록과 로그인 사용자(글쓰기 버튼 노출용)를 동시에 조회
    const [{ posts, totalCount }, user] = await Promise.all([
        getPosts({ boardId, page, field, keyword }),
        getCurrentUser(),
    ]);

    const board = BOARD_INFO[boardId];
    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

    return (
        <>
            <div className="mb-10 border-b border-gray-900 pb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {board.title}
                </h1>
                <p className="mt-3 text-sm text-gray-500">
                    {board.description}
                </p>
            </div>

            <div className="mb-6">
                <PostSearch boardId={boardId} field={field} keyword={keyword} />
            </div>

            <div className="mb-3 text-sm text-gray-500">
                {keyword && <span>&apos;{keyword}&apos; 검색 결과 </span>}총{' '}
                {totalCount}개의 게시글
            </div>

            <PostList
                boardId={boardId}
                posts={posts}
                startNumber={totalCount - (page - 1) * POSTS_PER_PAGE}
            />

            <div className="relative mt-8 flex min-h-10 justify-center">
                <Pagination
                    basePath={`/boards/${boardId}`}
                    currentPage={page}
                    totalPages={totalPages}
                    // 검색 중일 때만 검색 조건을 페이지 링크에 유지
                    searchParams={keyword ? { field, q: keyword } : {}}
                />

                {/* 글쓰기 권한이 있을 때만 버튼 노출 (공지사항: 관리자 / Q&A: 회원) */}
                {canWritePost(boardId, user) && (
                    <Link
                        href={`/boards/${boardId}/new`}
                        className="absolute right-0 bg-gray-900 px-5 py-2 text-sm text-white"
                    >
                        글쓰기
                    </Link>
                )}
            </div>
        </>
    );
}

export default function BoardPage({
    params,
    searchParams,
}: {
    params: Params;
    searchParams: SearchParams;
}) {
    return (
        <section className="mx-auto min-h-[700px] max-w-7xl px-4 py-12 md:px-6">
            <Suspense
                fallback={
                    <p className="py-20 text-center text-sm text-gray-500">
                        게시글을 불러오는 중입니다...
                    </p>
                }
            >
                <BoardContent params={params} searchParams={searchParams} />
            </Suspense>
        </section>
    );
}
