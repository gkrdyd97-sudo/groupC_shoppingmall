'use server';
// 게시글 작성 / 수정 / 삭제 Server Actions
// 화면에서 버튼을 숨기는 것만으로는 보안이 되지 않으므로 (액션은 직접 호출 가능)
// 모든 액션에서 로그인 여부와 권한을 서버에서 다시 검사한다.
import { getCurrentUser } from '@/domains/users/queries/getCurrentUser.query';
import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getPost } from '../queries/getPosts.query';
import type { BoardId, PostInput } from '../types/post.types';
import { canManagePost, canWritePost } from '../utils/boardPermission';
import { isBoardId, validatePost } from '../utils/postValidation';

type PostActionState = ActionState<PostInput>;

// FormData → PostInput
function readPostInput(formData: FormData): PostInput {
    return {
        title: String(formData.get('title') ?? ''),
        content: String(formData.get('content') ?? ''),
        category: String(formData.get('category') ?? ''),
    };
}

// DB 에 저장할 값 (앞뒤 공백 제거, 공지사항은 문의 유형 없음)
function toPostColumns(boardId: BoardId, input: PostInput) {
    return {
        title: input.title.trim(),
        content: input.content.trim(),
        category: boardId === 'qna' ? input.category : null,
    };
}

// 게시글 작성
// PostForm 에서 createPostAction.bind(null, boardId) 로 게시판 ID 를 미리 채워서 사용
export async function createPostAction(
    boardId: string,
    _prevState: PostActionState,
    formData: FormData,
): Promise<PostActionState> {
    if (!isBoardId(boardId)) {
        return { success: false, message: '존재하지 않는 게시판입니다.' };
    }

    const input = readPostInput(formData);

    // 1) 권한 확인 (공지사항: 관리자만 / Q&A: 로그인 회원)
    const user = await getCurrentUser();
    if (!user) {
        return {
            success: false,
            message: '로그인이 필요한 서비스입니다.',
            data: input,
        };
    }
    if (!canWritePost(boardId, user)) {
        return {
            success: false,
            message: '글쓰기 권한이 없습니다.',
            data: input,
        };
    }

    // 2) 입력값 검사
    const errors = validatePost(boardId, input);
    if (Object.keys(errors).length > 0) {
        return { success: false, errors, data: input };
    }

    // 3) 저장 후 생성된 id 를 받아 상세 페이지로 이동
    const supabase = createServerClient();
    const { data: created, error } = await supabase
        .from('POSTS')
        .insert({
            board_id: boardId,
            user_id: user.id,
            ...toPostColumns(boardId, input),
        })
        .select('id')
        .single();

    if (error || !created) {
        return {
            success: false,
            message: `게시글 등록에 실패했습니다: ${error?.message ?? ''}`,
            data: input,
        };
    }

    revalidatePath(`/boards/${boardId}`);
    redirect(`/boards/${boardId}/${created.id}`);
}

// 게시글 수정
// PostForm 에서 updatePostAction.bind(null, boardId, postId) 로 사용
export async function updatePostAction(
    boardId: string,
    postId: number,
    _prevState: PostActionState,
    formData: FormData,
): Promise<PostActionState> {
    if (!isBoardId(boardId)) {
        return { success: false, message: '존재하지 않는 게시판입니다.' };
    }

    const input = readPostInput(formData);

    // 1) 원본 글 확인 + 작성자 본인/관리자인지 확인
    const [user, post] = await Promise.all([
        getCurrentUser(),
        getPost(boardId, postId),
    ]);
    if (!post) {
        return {
            success: false,
            message: '삭제되었거나 존재하지 않는 게시글입니다.',
        };
    }
    if (!canManagePost(post, user)) {
        return {
            success: false,
            message: '수정 권한이 없습니다.',
            data: input,
        };
    }

    // 2) 입력값 검사
    const errors = validatePost(boardId, input);
    if (Object.keys(errors).length > 0) {
        return { success: false, errors, data: input };
    }

    // 3) 수정
    // RLS 정책에 막히면 에러 없이 0건이 수정되므로 select 로 실제 반영 행을 확인
    const supabase = createServerClient();
    const { data: updated, error } = await supabase
        .from('POSTS')
        .update({
            ...toPostColumns(boardId, input),
            updated_at: new Date().toISOString(),
        })
        .eq('id', postId)
        .select('id');

    if (error || !updated?.length) {
        return {
            success: false,
            message: `게시글 수정에 실패했습니다. ${error?.message ?? '(DB 수정 권한 확인 필요)'}`,
            data: input,
        };
    }

    revalidatePath(`/boards/${boardId}`);
    revalidatePath(`/boards/${boardId}/${postId}`);
    redirect(`/boards/${boardId}/${postId}`);
}

// 게시글 삭제 (소프트 삭제: deleted_at 에 시각을 기록, 목록/상세 조회에서 제외됨)
export async function deletePostAction(
    boardId: string,
    postId: number,
): Promise<ActionState> {
    if (!isBoardId(boardId)) {
        return { success: false, message: '존재하지 않는 게시판입니다.' };
    }

    const [user, post] = await Promise.all([
        getCurrentUser(),
        getPost(boardId, postId),
    ]);
    if (!post) {
        return {
            success: false,
            message: '이미 삭제되었거나 존재하지 않는 게시글입니다.',
        };
    }
    if (!canManagePost(post, user)) {
        return { success: false, message: '삭제 권한이 없습니다.' };
    }

    const supabase = createServerClient();
    const { data: deleted, error } = await supabase
        .from('POSTS')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', postId)
        .select('id');

    if (error || !deleted?.length) {
        return {
            success: false,
            message: `게시글 삭제에 실패했습니다. ${error?.message ?? '(DB 수정 권한 확인 필요)'}`,
        };
    }

    revalidatePath(`/boards/${boardId}`);
    redirect(`/boards/${boardId}`);
}
