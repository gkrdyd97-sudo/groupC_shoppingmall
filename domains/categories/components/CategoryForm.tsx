'use client';
// 카테고리 등록/수정 공용 폼 (관리자)
// - categoryId 가 있으면 수정, 없으면 등록
// - 상위 분류 선택지는 서버(페이지)에서 계산해서 넘겨줌 (수정 시 자기 자신·하위 분류 제외)
import Link from 'next/link';
import { useActionState } from 'react';
import type { ActionState } from '@/shared/types/action.types';
import {
    createCategoryAction,
    updateCategoryAction,
} from '../actions/category.actions';
import type {
    CategoryFormInput,
    CategoryTreeItem,
} from '../types/category.types';

interface CategoryFormProps {
    parentOptions: CategoryTreeItem[];
    categoryId?: string;
    initialData?: CategoryFormInput;
}

const EMPTY: CategoryFormInput = {
    name: '',
    parentId: '',
    sortOrder: '0',
    active: true,
};

const inputClass =
    'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600 aria-invalid:border-red-500';

export default function CategoryForm({
    parentOptions,
    categoryId,
    initialData = EMPTY,
}: CategoryFormProps) {
    const isEdit = categoryId !== undefined;
    const action = isEdit
        ? updateCategoryAction.bind(null, categoryId)
        : createCategoryAction;

    const [state, formAction, isPending] = useActionState(action, {
        success: false,
        data: initialData,
    } as ActionState<CategoryFormInput>);

    // 검증 실패 시 서버가 돌려준 입력값으로 복원
    const values = state.data ?? initialData;

    return (
        <form
            action={formAction}
            noValidate
            autoComplete="off"
            className="max-w-xl space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
        >
            <div className="space-y-1.5">
                <label
                    htmlFor="name"
                    className="text-xs font-bold text-gray-700"
                >
                    분류명
                </label>
                <input
                    id="name"
                    name="name"
                    defaultValue={values.name}
                    placeholder="예: tops"
                    aria-invalid={Boolean(state.errors?.name)}
                    className={inputClass}
                />
                {state.errors?.name && (
                    <p className="text-xs text-red-500">{state.errors.name}</p>
                )}
                <p className="text-[11px] text-gray-400">
                    쇼핑몰 상품 목록 주소에 사용됩니다. (예:
                    /products?category=tops)
                </p>
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="parentId"
                    className="text-xs font-bold text-gray-700"
                >
                    상위 분류
                </label>
                {/* key: 서버 응답마다 select 를 새로 그려 defaultValue 가 다시 적용되도록 함 */}
                <select
                    key={values.parentId}
                    id="parentId"
                    name="parentId"
                    defaultValue={values.parentId}
                    aria-invalid={Boolean(state.errors?.parentId)}
                    className={inputClass}
                >
                    <option value="">(최상위 분류)</option>
                    {parentOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                            {/* 단계만큼 들여쓰기해서 트리처럼 표시 */}
                            {'　'.repeat(option.depth)}
                            {option.depth > 0 ? '└ ' : ''}
                            {option.name}
                        </option>
                    ))}
                </select>
                {state.errors?.parentId && (
                    <p className="text-xs text-red-500">
                        {state.errors.parentId}
                    </p>
                )}
            </div>

            <div className="flex gap-6">
                <div className="w-40 space-y-1.5">
                    <label
                        htmlFor="sortOrder"
                        className="text-xs font-bold text-gray-700"
                    >
                        진열 순서
                    </label>
                    <input
                        id="sortOrder"
                        name="sortOrder"
                        type="number"
                        min={0}
                        defaultValue={values.sortOrder}
                        aria-invalid={Boolean(state.errors?.sortOrder)}
                        className={inputClass}
                    />
                    <p className="text-[11px] text-gray-400">
                        숫자가 작을수록 앞에 진열
                    </p>
                </div>

                <div className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-700">
                        진열 여부
                    </span>
                    <label className="flex h-10 items-center gap-2 text-sm">
                        <input
                            key={String(values.active)}
                            type="checkbox"
                            name="active"
                            defaultChecked={values.active}
                            className="h-4 w-4"
                        />
                        쇼핑몰에 노출
                    </label>
                </div>
            </div>
            {state.errors?.sortOrder && (
                <p className="text-xs text-red-500">{state.errors.sortOrder}</p>
            )}

            {/* 권한 없음, DB 오류 등 폼 전체 에러 */}
            {state.message && (
                <p className="text-sm text-red-500">{state.message}</p>
            )}

            <div className="flex justify-end gap-2 border-t border-gray-100 pt-5">
                <Link
                    href="/admin/category"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
                >
                    취소
                </Link>
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
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
