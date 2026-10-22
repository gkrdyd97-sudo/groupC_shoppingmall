// 게시글 수정 페이지 (/boards/qna/12/edit)
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import PostForm from '@/domains/boards/components/PostForm';
import { BOARD_INFO } from '@/domains/boards/constants/board.constants';
import { getPost } from '@/domains/boards/queries/getPosts.query';
import { canManagePost } from '@/domains/boards/utils/boardPermission';
import { isBoardId } from '@/domains/boards/utils/postValidation';
import { getCurrentUser } from '@/domains/users/queries/getCurrentUser.query';

type Params = Promise<{ boardId: string; postId: string }>;

async function EditPostContent({ params }: { params: Params }) {
    const { boardId, postId } = await params;
    const id = Number(postId);
    if (!isBoardId(boardId) || !Number.isInteger(id)) notFound();

    const [post, user] = await Promise.all([
        getPost(boardId, id),
        getCurrentUser(),
    ]);
    if (!post) notFound();

    // 작성자 본인/관리자가 아니면 상세 페이지로 돌려보냄
    if (!canManagePost(post, user)) {
        redirect(`/boards/${boardId}/${id}`);
    }

    return (
        <>
            <div className="mb-10 border-b border-gray-900 pb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {BOARD_INFO[boardId].title} 글 수정
                </h1>
            </div>

            {/* 기존 글 내용을 초기값으로 채운 수정 폼 */}
            <PostForm
                boardId={boardId}
                postId={post.id}
                initialData={{
                    title: post.title,
                    content: post.content,
                    category: post.category ?? '',
                }}
            />
        </>
    );
}

export default function EditPostPage({ params }: { params: Params }) {
    return (
        <section className="mx-auto min-h-[700px] max-w-4xl px-4 py-12">
            <Suspense fallback={null}>
                <EditPostContent params={params} />
            </Suspense>
        </section>
    );
}
