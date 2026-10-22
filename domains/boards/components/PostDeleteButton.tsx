'use client';
// 게시글 삭제 버튼
// confirm 으로 한 번 확인 후 서버 액션 호출 → 성공 시 서버 액션이 목록으로 redirect
import { useTransition } from 'react';
import { deletePostAction } from '../actions/post.actions';

interface PostDeleteButtonProps {
    boardId: string;
    postId: number;
}

export default function PostDeleteButton({
    boardId,
    postId,
}: PostDeleteButtonProps) {
    // 삭제 처리 중 버튼 비활성화용
    const [isPending, startTransition] = useTransition();

    const onClick = () => {
        if (!confirm('게시글을 삭제하시겠습니까?')) return;

        startTransition(async () => {
            // 성공하면 redirect 되므로 여기로 돌아오는 건 실패한 경우뿐
            const result = await deletePostAction(boardId, postId);
            if (!result.success) {
                alert(result.message ?? '게시글 삭제에 실패했습니다.');
            }
        });
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isPending}
            className="border border-red-300 px-5 py-3 text-sm text-red-600 disabled:opacity-50"
        >
            {isPending ? '삭제 중...' : '삭제'}
        </button>
    );
}
