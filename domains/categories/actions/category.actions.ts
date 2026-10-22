'use server';
// 카테고리/진열 관리 Server Actions (관리자 전용)
// - 등록 / 수정 / 삭제
// - 진열(노출) ON·OFF 전환
import { isAdminUser, NOT_ADMIN } from '@/domains/admin/utils/requireAdmin';
import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCategoryRows } from '../queries/getCategoryRows.query';
import type { CategoryFormInput } from '../types/category.types';
import { getDescendantIds } from '../utils/categoryTree';
import { validateCategory } from '../utils/categoryValidation';

type CategoryActionState = ActionState<CategoryFormInput>;

const LIST_PATH = '/admin/category';

function readCategoryInput(formData: FormData): CategoryFormInput {
    return {
        name: String(formData.get('name') ?? ''),
        parentId: String(formData.get('parentId') ?? ''),
        sortOrder: String(formData.get('sortOrder') ?? ''),
        // 체크박스는 체크했을 때만 'on' 으로 전송됨
        active: formData.get('active') === 'on',
    };
}

// 화면이 쓰는 값 → DB 컬럼
function toColumns(input: CategoryFormInput) {
    return {
        name: input.name.trim(),
        parent_id: input.parentId || null,
        sort_order: input.sortOrder.trim() === '' ? 0 : Number(input.sortOrder),
        active: input.active,
    };
}

// 등록·수정 공통 검사: 입력값 + 상위 분류 존재 여부 + 순환 방지
async function validateWithDb(
    input: CategoryFormInput,
    editingId?: string,
): Promise<Record<string, string>> {
    const errors = validateCategory(input);
    if (!input.parentId) return errors;

    const rows = await getCategoryRows();
    if (!rows.some((row) => row.id === input.parentId)) {
        errors.parentId = '존재하지 않는 상위 분류입니다.';
    } else if (
        editingId &&
        (input.parentId === editingId ||
            getDescendantIds(rows, editingId).includes(input.parentId))
    ) {
        // 자기 자신이나 자기 하위 분류 밑으로 옮기면 트리가 끊어짐
        errors.parentId =
            '자기 자신 또는 하위 분류를 상위 분류로 지정할 수 없습니다.';
    }
    return errors;
}

// 카테고리 등록
export async function createCategoryAction(
    _prevState: CategoryActionState,
    formData: FormData,
): Promise<CategoryActionState> {
    if (!(await isAdminUser())) return NOT_ADMIN;

    const input = readCategoryInput(formData);
    const errors = await validateWithDb(input);
    if (Object.keys(errors).length > 0) {
        return { success: false, errors, data: input };
    }

    const supabase = createServerClient();
    const { error } = await supabase
        .from('PRODUCT_CATEGORY')
        .insert(toColumns(input));

    if (error) {
        return {
            success: false,
            message: `분류 등록에 실패했습니다: ${error.message}`,
            data: input,
        };
    }

    revalidatePath(LIST_PATH);
    redirect(LIST_PATH);
}

// 카테고리 수정 (CategoryForm 에서 updateCategoryAction.bind(null, id) 로 사용)
export async function updateCategoryAction(
    id: string,
    _prevState: CategoryActionState,
    formData: FormData,
): Promise<CategoryActionState> {
    if (!(await isAdminUser())) return NOT_ADMIN;

    const input = readCategoryInput(formData);
    const errors = await validateWithDb(input, id);
    if (Object.keys(errors).length > 0) {
        return { success: false, errors, data: input };
    }

    // RLS 정책에 막히면 에러 없이 0건이 수정되므로 select 로 실제 반영 행을 확인
    const supabase = createServerClient();
    const { data: updated, error } = await supabase
        .from('PRODUCT_CATEGORY')
        .update({ ...toColumns(input), updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id');

    if (error || !updated?.length) {
        return {
            success: false,
            message: `분류 수정에 실패했습니다. ${error?.message ?? '(DB 수정 권한 확인 필요)'}`,
            data: input,
        };
    }

    revalidatePath(LIST_PATH);
    redirect(LIST_PATH);
}

// 진열(노출) ON/OFF 전환 - 목록의 버튼에서 바로 호출
export async function toggleCategoryActiveAction(
    id: string,
    nextActive: boolean,
): Promise<ActionState> {
    if (!(await isAdminUser())) return NOT_ADMIN;

    const supabase = createServerClient();
    const { data: updated, error } = await supabase
        .from('PRODUCT_CATEGORY')
        .update({ active: nextActive, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id');

    if (error || !updated?.length) {
        return {
            success: false,
            message: `진열 상태 변경에 실패했습니다. ${error?.message ?? '(DB 수정 권한 확인 필요)'}`,
        };
    }

    revalidatePath(LIST_PATH);
    return { success: true };
}

// 카테고리 삭제
// PRODUCT_CATEGORY 에는 deleted_at 이 없어 실제 삭제됨 → 데이터가 꼬이지 않도록
// 하위 분류나 상품이 남아 있으면 삭제를 막는다
export async function deleteCategoryAction(id: string): Promise<ActionState> {
    if (!(await isAdminUser())) return NOT_ADMIN;

    const supabase = createServerClient();

    const [{ count: childCount }, { count: productCount }] = await Promise.all([
        supabase
            .from('PRODUCT_CATEGORY')
            .select('id', { count: 'exact', head: true })
            .eq('parent_id', id),
        supabase
            .from('PRODUCTS')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', id)
            .is('deleted_at', null),
    ]);

    if (childCount) {
        return {
            success: false,
            message: `하위 분류 ${childCount}개를 먼저 삭제하거나 옮겨주세요.`,
        };
    }
    if (productCount) {
        return {
            success: false,
            message: `이 분류에 상품 ${productCount}개가 있습니다. 상품의 분류를 먼저 변경해주세요.`,
        };
    }

    const { data: deleted, error } = await supabase
        .from('PRODUCT_CATEGORY')
        .delete()
        .eq('id', id)
        .select('id');

    if (error || !deleted?.length) {
        return {
            success: false,
            message: `분류 삭제에 실패했습니다. ${error?.message ?? '(DB 삭제 권한 확인 필요)'}`,
        };
    }

    revalidatePath(LIST_PATH);
    return { success: true };
}
