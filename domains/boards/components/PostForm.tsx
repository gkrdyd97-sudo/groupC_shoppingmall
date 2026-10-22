'use client';
// 게시글 작성/수정 공용 폼
// - postId 가 있으면 수정, 없으면 작성
// - 서버 액션에 boardId/postId 를 bind 로 미리 채워 (prevState, formData) 형태로 맞춘 뒤
//   useActionState 에 연결 (가이드 3일차 PostForm 의 더미 postAction 을 실제 액션으로 교체)
import Link from 'next/link';
import { useActionState } from 'react';
import type { ActionState } from '@/shared/types/action.types';
import { createPostAction, updatePostAction } from '../actions/post.actions';
import { QNA_CATEGORIES } from '../constants/board.constants';
import type { BoardId, PostInput } from '../types/post.types';
import { CONTENT_MAX_LENGTH, TITLE_MAX_LENGTH } from '../utils/postValidation';

interface PostFormProps {
    boardId: BoardId;
    postId?: number;
    initialData?: PostInput; // 수정 시 기존 글 내용
}

export default function PostForm({
    boardId,
    postId,
    initialData,
}: PostFormProps) {
    const isEdit = postId !== undefined;
    const action = isEdit
        ? updatePostAction.bind(null, boardId, postId)
        : createPostAction.bind(null, boardId);

    // 수정이면 기존 글 내용을 초기값으로 사용
    const [state, formAction, isPending] = useActionState(action, {
        success: false,
        data: initialData,
    } as ActionState<PostInput>);

    // 검증 실패 시 서버가 돌려준 입력값 → 없으면 초기값
    const values = state.data ?? initialData;

    // 취소 시 돌아갈 곳: 수정이면 상세, 작성이면 목록
    const cancelHref = isEdit
        ? `/boards/${boardId}/${postId}`
        : `/boards/${boardId}`;

    return (
        <form action={formAction} noValidate className="space-y-6">
            {/* Q&A 만 문의 유형 선택 */}
            {boardId === 'qna' && (
                <div>
                    <label
                        htmlFor="category"
                        className="mb-2 block text-sm font-semibold text-gray-900"
                    >
                        문의 유형
                    </label>
                    {/* key: 서버 응답마다 select 를 새로 그려 defaultValue 가 다시 적용되도록 함 */}
                    <select
                        key={values?.category}
                        id="category"
                        name="category"
                        defaultValue={values?.category ?? ''}
                        aria-invalid={Boolean(state.errors?.category)}
                        className="h-11 w-48 border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
                    >
                        <option value="">선택하세요</option>
                        {QNA_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    {state.errors?.category && (
                        <p className="mt-1 text-xs text-red-500">
                            {state.errors.category}
                        </p>
                    )}
                </div>
            )}

            <div>
                <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-gray-900"
                >
                    제목
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    maxLength={TITLE_MAX_LENGTH}
                    defaultValue={values?.title ?? ''}
                    placeholder="제목을 입력하세요."
                    aria-invalid={Boolean(state.errors?.title)}
                    className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 aria-invalid:border-red-500"
                />
                {state.errors?.title && (
                    <p className="mt-1 text-xs text-red-500">
                        {state.errors.title}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="content"
                    className="mb-2 block text-sm font-semibold text-gray-900"
                >
                    내용
                </label>
                <textarea
                    id="content"
                    name="content"
                    maxLength={CONTENT_MAX_LENGTH}
                    defaultValue={values?.content ?? ''}
                    placeholder="내용을 입력하세요. (10자 이상)"
                    aria-invalid={Boolean(state.errors?.content)}
                    className="min-h-[300px] w-full resize-none border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 aria-invalid:border-red-500"
                />
                {state.errors?.content && (
                    <p className="mt-1 text-xs text-red-500">
                        {state.errors.content}
                    </p>
                )}
            </div>

            {/* 권한 없음, DB 오류 등 폼 전체 에러 */}
            {state.message && (
                <p className="text-sm text-red-500">{state.message}</p>
            )}

            <div className="flex justify-end gap-3">
                <Link
                    href={cancelHref}
                    className="border border-gray-300 px-5 py-3 text-sm text-gray-700"
                >
                    취소
                </Link>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-gray-900 px-5 py-3 text-sm text-white disabled:opacity-50"
                >
                    {isPending
                        ? '저장 중...'
                        : isEdit
                          ? '수정하기'
                          : '등록하기'}
                </button>
            </div>
        </form>
    );
}
