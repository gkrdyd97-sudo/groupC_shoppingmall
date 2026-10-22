'use client';
// 관리자 상품 등록/수정 공용 폼
// - productId 가 있으면 수정, 없으면 등록
// - 옵션(사이즈 등)은 행을 추가/삭제할 수 있어야 해서 useState 로 관리하고,
//   제출 시에는 같은 name(optionId/optionName/optionPrice)의 input 여러 개로 서버에 전달
import Link from 'next/link';
import { useActionState, useState } from 'react';
import type { CategoryTreeItem } from '@/domains/categories/types/category.types';
import type { ActionState } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';
import {
    createProductAction,
    updateProductAction,
} from '../actions/product.admin.actions';
import type {
    ProductFormInput,
    ProductOptionInput,
} from '../types/Product.types';

interface ProductAdminFormProps {
    categories: CategoryTreeItem[];
    productId?: string;
    initialData?: ProductFormInput;
}

const EMPTY: ProductFormInput = {
    name: '',
    brand: 'RNDO',
    styleCode: '',
    categoryId: '',
    salePrice: '',
    consumerPrice: '',
    shortDescription: '',
    longDescription: '',
    options: [],
};

const inputClass =
    'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600 aria-invalid:border-red-500';

// 옵션 행마다 React key 가 필요해서 화면 전용 key 를 붙여서 관리
type OptionRow = ProductOptionInput & { key: number };
let nextKey = 0;
const withKey = (option: ProductOptionInput): OptionRow => ({
    ...option,
    key: nextKey++,
});

export default function ProductAdminForm({
    categories,
    productId,
    initialData = EMPTY,
}: ProductAdminFormProps) {
    const isEdit = productId !== undefined;
    const action = isEdit
        ? updateProductAction.bind(null, productId)
        : createProductAction;

    const [state, formAction, isPending] = useActionState(action, {
        success: false,
        data: initialData,
    } as ActionState<ProductFormInput>);

    const values = state.data ?? initialData;
    const [options, setOptions] = useState<OptionRow[]>(() =>
        initialData.options.map(withKey),
    );

    const updateOption = (
        key: number,
        field: 'name' | 'addPrice',
        value: string,
    ) => {
        setOptions((previous) =>
            previous.map((option) =>
                option.key === key ? { ...option, [field]: value } : option,
            ),
        );
    };

    // 칸 하나 (라벨 + 입력 + 에러)
    const field = (
        name: keyof ProductFormInput,
        label: string,
        props: React.ComponentProps<'input'> = {},
    ) => (
        <div className="space-y-1.5">
            <label htmlFor={name} className="text-xs font-bold text-gray-700">
                {label}
            </label>
            <input
                id={name}
                name={name}
                defaultValue={String(values[name] ?? '')}
                aria-invalid={Boolean(state.errors?.[name])}
                className={inputClass}
                {...props}
            />
            {state.errors?.[name] && (
                <p className="text-xs text-red-500">{state.errors[name]}</p>
            )}
        </div>
    );

    return (
        <form
            action={formAction}
            noValidate
            autoComplete="off"
            className="max-w-3xl space-y-6 rounded-2xl border border-gray-200 bg-white p-6"
        >
            {/* 기본 정보 */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                    {field('name', '상품명', {
                        placeholder: '예: 라이트 러닝 윈드 재킷',
                    })}
                </div>
                {field('brand', '브랜드')}
                {field('styleCode', '스타일 코드(품번)', {
                    placeholder: '예: RNDO-T001',
                })}

                <div className="space-y-1.5">
                    <label
                        htmlFor="categoryId"
                        className="text-xs font-bold text-gray-700"
                    >
                        카테고리
                    </label>
                    {/* key: 서버 응답마다 select 를 새로 그려 defaultValue 가 다시 적용되도록 함 */}
                    <select
                        key={values.categoryId}
                        id="categoryId"
                        name="categoryId"
                        defaultValue={values.categoryId}
                        aria-invalid={Boolean(state.errors?.categoryId)}
                        className={inputClass}
                    >
                        <option value="">카테고리 선택</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {'　'.repeat(category.depth)}
                                {category.depth > 0 ? '└ ' : ''}
                                {category.name}
                                {category.active ? '' : ' (숨김)'}
                            </option>
                        ))}
                    </select>
                    {state.errors?.categoryId && (
                        <p className="text-xs text-red-500">
                            {state.errors.categoryId}
                        </p>
                    )}
                </div>
                <div />

                {field('salePrice', '판매가 (원)', { type: 'number', min: 0 })}
                {field('consumerPrice', '정가 (원)', {
                    type: 'number',
                    min: 0,
                })}
            </section>

            {/* 설명 */}
            <section className="space-y-4">
                {field('shortDescription', '한 줄 설명')}
                <div className="space-y-1.5">
                    <label
                        htmlFor="longDescription"
                        className="text-xs font-bold text-gray-700"
                    >
                        상세 설명
                    </label>
                    <textarea
                        id="longDescription"
                        name="longDescription"
                        rows={5}
                        defaultValue={values.longDescription}
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-600"
                    />
                </div>
            </section>

            {/* 옵션 */}
            <section className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">
                        옵션 (사이즈 등)
                    </span>
                    <button
                        type="button"
                        onClick={() =>
                            setOptions((previous) => [
                                ...previous,
                                withKey({ id: '', name: '', addPrice: '0' }),
                            ])
                        }
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold"
                    >
                        + 옵션 추가
                    </button>
                </div>

                {options.length === 0 && (
                    <p className="rounded-lg bg-gray-50 py-4 text-center text-xs text-gray-400">
                        옵션이 없는 상품입니다.
                    </p>
                )}

                {options.map((option, index) => (
                    <div key={option.key} className="flex items-center gap-2">
                        <span className="w-6 text-center text-xs text-gray-400">
                            {index + 1}
                        </span>
                        {/* 기존 옵션이면 id, 새 옵션이면 '' → 서버에서 수정/추가 구분 */}
                        <input
                            type="hidden"
                            name="optionId"
                            value={option.id}
                        />
                        <input
                            name="optionName"
                            value={option.name}
                            onChange={(event) =>
                                updateOption(
                                    option.key,
                                    'name',
                                    event.target.value,
                                )
                            }
                            placeholder="옵션명 (예: M)"
                            className={cn(inputClass, 'flex-1')}
                        />
                        <input
                            name="optionPrice"
                            type="number"
                            min={0}
                            value={option.addPrice}
                            onChange={(event) =>
                                updateOption(
                                    option.key,
                                    'addPrice',
                                    event.target.value,
                                )
                            }
                            className={cn(inputClass, 'w-32')}
                            aria-label="추가금액"
                        />
                        <span className="text-xs text-gray-500">원</span>
                        <button
                            type="button"
                            onClick={() =>
                                setOptions((previous) =>
                                    previous.filter(
                                        (row) => row.key !== option.key,
                                    ),
                                )
                            }
                            className="rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                        >
                            삭제
                        </button>
                    </div>
                ))}
                {state.errors?.options && (
                    <p className="text-xs text-red-500">
                        {state.errors.options}
                    </p>
                )}
            </section>

            <p className="rounded-lg bg-gray-50 p-3 text-[11px] text-gray-500">
                ※ 상품 이미지는 FILE_INFO 테이블(gid 기준)에서 관리됩니다.
                이미지 업로드 기능은 파일 업로더 연동 후 추가 예정입니다.
            </p>

            {/* 권한 없음, DB 오류 등 폼 전체 에러 */}
            {state.message && (
                <p className="text-sm text-red-500">{state.message}</p>
            )}

            <div className="flex justify-end gap-2 border-t border-gray-100 pt-5">
                <Link
                    href="/admin/products"
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
