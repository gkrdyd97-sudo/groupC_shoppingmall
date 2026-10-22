// 게시글 상세 페이지 (/boards/qna/12)
import { connection } from 'next/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PostDeleteButton from '@/domains/boards/components/PostDeleteButton';
import { BOARD_INFO } from '@/domains/boards/constants/board.constants';
import { getPost } from '@/domains/boards/queries/getPosts.query';
import { canManagePost } from '@/domains/boards/utils/boardPermission';
import { formatPostDate } from '@/domains/boards/utils/formatPostDate';
import { isBoardId } from '@/domains/boards/utils/postValidation';
import { getCurrentUser } from '@/domains/users/queries/getCurrentUser.query';

type Params = Promise<{ boardId: string; postId: string }>;

async function PostDetail({ params }: { params: Params }) {
    // Supabase 가 내부에서 현재 시각(Date.now)을 사용하므로, 요청이 들어온 뒤에 실행되도록 표시
    await connection();
    const { boardId, postId } = await params;
    const id = Number(postId);

    // 잘못된 게시판 주소나 숫자가 아닌 글 번호는 404
    if (!isBoardId(boardId) || !Number.isInteger(id)) notFound();

    const [post, user] = await Promise.all([
        getPost(boardId, id),
        getCurrentUser(),
    ]);
    if (!post) notFound();

    return (
        <>
            <p className="mb-2 text-sm text-gray-500">
                {BOARD_INFO[boardId].title}
            </p>

            <div className="border-b border-gray-900 pb-6">
                <h1 className="text-2xl font-bold break-all text-gray-900">
                    {/* Q&A 는 제목 앞에 문의 유형 표시 */}
                    {post.category && (
                        <span className="mr-2 text-base font-medium text-gray-500">
                            [{post.category}]
                        </span>
                    )}
                    {post.title}
                </h1>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>작성자: {post.authorName}</span>
                    <span>작성일: {formatPostDate(post.createdAt)}</span>
                    {post.updatedAt && post.updatedAt !== post.createdAt && (
                        <span>수정일: {formatPostDate(post.updatedAt)}</span>
                    )}
                </div>
            </div>

            {/* whitespace-pre-wrap: 사용자가 입력한 줄바꿈을 그대로 표시 */}
            <div className="py-10 break-all whitespace-pre-wrap text-gray-700">
                {post.content}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <Link
                    href={`/boards/${boardId}`}
                    className="border border-gray-300 px-5 py-3 text-sm text-gray-700"
                >
                    목록으로 돌아가기
                </Link>

                {/* 작성자 본인 또는 관리자에게만 수정/삭제 버튼 노출 */}
                {canManagePost(post, user) && (
                    <div className="flex gap-2">
                        <Link
                            href={`/boards/${boardId}/${post.id}/edit`}
                            className="border border-gray-300 px-5 py-3 text-sm text-gray-700"
                        >
                            수정
                        </Link>
                        <PostDeleteButton boardId={boardId} postId={post.id} />
                    </div>
                )}
            </div>
        </>
    );
}

export default function PostDetailPage({ params }: { params: Params }) {
    return (
        <section className="mx-auto min-h-[700px] max-w-4xl px-4 py-12">
            <Suspense
                fallback={
                    <p className="py-20 text-center text-sm text-gray-500">
                        게시글을 불러오는 중입니다...
                    </p>
                }
            >
                <PostDetail params={params} />
            </Suspense>
        </section>
    );
}
