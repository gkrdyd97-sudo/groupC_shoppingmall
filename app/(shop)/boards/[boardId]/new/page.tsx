// 게시글 작성 페이지 (/boards/qna/new)
import { connection } from 'next/server';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import PostForm from '@/domains/boards/components/PostForm';
import { BOARD_INFO } from '@/domains/boards/constants/board.constants';
import { canWritePost } from '@/domains/boards/utils/boardPermission';
import { isBoardId } from '@/domains/boards/utils/postValidation';
import { getCurrentUser } from '@/domains/users/queries/getCurrentUser.query';

type Params = Promise<{ boardId: string }>;

async function NewPostContent({ params }: { params: Params }) {
    // Supabase 가 내부에서 현재 시각(Date.now)을 사용하므로, 요청이 들어온 뒤에 실행되도록 표시
    await connection();
    const { boardId } = await params;
    if (!isBoardId(boardId)) notFound();

    // 권한이 없으면 (예: 일반 회원이 공지사항 글쓰기 주소로 직접 접근) 목록으로 돌려보냄
    const user = await getCurrentUser();
    if (!canWritePost(boardId, user)) {
        redirect(`/boards/${boardId}`);
    }

    const board = BOARD_INFO[boardId];

    return (
        <>
            <div className="mb-10 border-b border-gray-900 pb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {board.title} 글쓰기
                </h1>
                <p className="mt-3 text-sm text-gray-500">
                    {board.description}
                </p>
            </div>

            <PostForm boardId={boardId} />
        </>
    );
}

export default function NewPostPage({ params }: { params: Params }) {
    return (
        <section className="mx-auto min-h-[700px] max-w-4xl px-4 py-12">
            <Suspense fallback={null}>
                <NewPostContent params={params} />
            </Suspense>
        </section>
    );
}
