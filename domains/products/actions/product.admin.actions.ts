'use server';
// 관리자 상품 관리 Server Actions
// - 상품 등록 / 수정 (옵션 포함) / 삭제(소프트 삭제)
import { isAdminUser, NOT_ADMIN } from '@/domains/admin/utils/requireAdmin';
import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ProductFormInput } from '../types/Product.types';
import { createProductGid, validateProduct } from '../utils/productValidation';

type ProductActionState = ActionState<ProductFormInput>;
type SupabaseClient = ReturnType<typeof createServerClient>;

const LIST_PATH = '/admin/products';

// FormData → 입력값
// 옵션은 같은 name 의 input 이 여러 개라 getAll 로 배열을 받아 같은 순서끼리 묶는다
function readProductInput(formData: FormData): ProductFormInput {
    const get = (key: string) => String(formData.get(key) ?? '');
    const optionIds = formData.getAll('optionId').map(String);
    const optionNames = formData.getAll('optionName').map(String);
    const optionPrices = formData.getAll('optionPrice').map(String);

    return {
        name: get('name'),
        brand: get('brand'),
        styleCode: get('styleCode'),
        categoryId: get('categoryId'),
        salePrice: get('salePrice'),
        consumerPrice: get('consumerPrice'),
        shortDescription: get('shortDescription'),
        longDescription: get('longDescription'),
        options: optionNames.map((name, index) => ({
            id: optionIds[index] ?? '',
            name,
            addPrice: optionPrices[index] ?? '0',
        })),
    };
}

// 화면 입력값 → PRODUCTS 컬럼
function toProductColumns(input: ProductFormInput) {
    return {
        name: input.name.trim(),
        brand: input.brand.trim(),
        style_code: input.styleCode.trim(),
        category_id: input.categoryId,
        sale_price: Number(input.salePrice),
        consumer_price: Number(input.consumerPrice),
        short_description: input.shortDescription.trim(),
        long_description: input.longDescription.trim(),
    };
}

// 입력값 검사 + 카테고리 존재 여부 확인
async function validateWithDb(
    supabase: SupabaseClient,
    input: ProductFormInput,
): Promise<Record<string, string>> {
    const errors = validateProduct(input);
    if (!errors.categoryId) {
        const { data: category } = await supabase
            .from('PRODUCT_CATEGORY')
            .select('id')
            .eq('id', input.categoryId)
            .maybeSingle();
        if (!category) errors.categoryId = '존재하지 않는 카테고리입니다.';
    }
    return errors;
}

// 옵션 동기화: 폼에 남은 옵션은 수정, 새 옵션은 추가, 폼에서 지운 옵션은 삭제
// 옵션 id 는 장바구니(CART)·주문(ORDER_ITEMS)에서 참조하므로
// 전부 지우고 다시 넣지 않고, 기존 id 를 유지한 채 바뀐 것만 반영한다
async function syncOptions(
    supabase: SupabaseClient,
    productId: string,
    input: ProductFormInput,
): Promise<string | null> {
    const { data: existing, error: loadError } = await supabase
        .from('PRODUCT_OPTIONS')
        .select('id')
        .eq('product_id', productId);
    if (loadError) return `옵션 조회 실패: ${loadError.message}`;

    const keptIds = new Set(input.options.filter((o) => o.id).map((o) => o.id));
    const removedIds = (existing ?? [])
        .map((row) => row.id as string)
        .filter((id) => !keptIds.has(id));

    // 1) 폼에서 지운 옵션 삭제
    if (removedIds.length > 0) {
        const { error } = await supabase
            .from('PRODUCT_OPTIONS')
            .delete()
            .in('id', removedIds);
        if (error) {
            // 23503: 외래키 위반 = 장바구니나 주문 내역이 이 옵션을 쓰고 있음
            return error.code === '23503'
                ? '장바구니나 주문 내역에서 사용 중인 옵션은 삭제할 수 없습니다.'
                : `옵션 삭제 실패: ${error.message}`;
        }
    }

    // 2) 남은 옵션 수정 + 새 옵션 추가 (화면 순서대로 sort_order 부여)
    for (const [index, option] of input.options.entries()) {
        const columns = {
            item_name: option.name.trim(),
            add_price: Number(option.addPrice),
            sort_order: index + 1,
        };
        const { error } = option.id
            ? await supabase
                  .from('PRODUCT_OPTIONS')
                  .update(columns)
                  .eq('id', option.id)
                  .eq('product_id', productId) // 다른 상품의 옵션 id 를 보내도 수정되지 않게
            : await supabase
                  .from('PRODUCT_OPTIONS')
                  .insert({ ...columns, product_id: productId });
        if (error) return `옵션 저장 실패: ${error.message}`;
    }

    return null;
}

// 상품 등록
export async function createProductAction(
    _prevState: ProductActionState,
    formData: FormData,
): Promise<ProductActionState> {
    if (!(await isAdminUser())) return NOT_ADMIN;

    const input = readProductInput(formData);
    const supabase = createServerClient();

    const errors = await validateWithDb(supabase, input);
    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: '입력 정보를 확인해주세요.',
            errors,
            data: input,
        };
    }

    const { data: created, error } = await supabase
        .from('PRODUCTS')
        .insert({ ...toProductColumns(input), gid: createProductGid() })
        .select('id')
        .single();

    if (error || !created) {
        return {
            success: false,
            message: `상품 등록에 실패했습니다: ${error?.message ?? ''}`,
            data: input,
        };
    }

    const optionError = await syncOptions(supabase, created.id, input);
    if (optionError) {
        // 상품은 이미 저장됨 → 수정 화면에서 옵션만 다시 저장하도록 안내
        return {
            success: false,
            message: `상품은 등록됐지만 ${optionError} 수정 화면에서 옵션을 다시 저장해주세요.`,
            data: input,
        };
    }

    revalidatePath(LIST_PATH);
    revalidatePath('/products');
    redirect(LIST_PATH);
}

// 상품 수정 (ProductAdminForm 에서 updateProductAction.bind(null, id) 로 사용)
export async function updateProductAction(
    id: string,
    _prevState: ProductActionState,
    formData: FormData,
): Promise<ProductActionState> {
    if (!(await isAdminUser())) return NOT_ADMIN;

    const input = readProductInput(formData);
    const supabase = createServerClient();

    const errors = await validateWithDb(supabase, input);
    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: '입력 정보를 확인해주세요.',
            errors,
            data: input,
        };
    }

    // RLS 정책에 막히면 에러 없이 0건이 수정되므로 select 로 실제 반영 행을 확인
    const { data: updated, error } = await supabase
        .from('PRODUCTS')
        .update({
            ...toProductColumns(input),
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .is('deleted_at', null)
        .select('id');

    if (error || !updated?.length) {
        return {
            success: false,
            message: `상품 수정에 실패했습니다. ${error?.message ?? '(DB 수정 권한 확인 필요)'}`,
            data: input,
        };
    }

    const optionError = await syncOptions(supabase, id, input);
    if (optionError) {
        return { success: false, message: optionError, data: input };
    }

    revalidatePath(LIST_PATH);
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    redirect(LIST_PATH);
}

// 상품 삭제 (소프트 삭제: deleted_at 기록)
// 주문 내역이 상품을 참조하므로 실제로 지우지 않고 쇼핑몰 목록에서만 숨긴다
export async function deleteProductAction(id: string): Promise<ActionState> {
    if (!(await isAdminUser())) return NOT_ADMIN;

    const supabase = createServerClient();
    const { data: deleted, error } = await supabase
        .from('PRODUCTS')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null)
        .select('id');

    if (error || !deleted?.length) {
        return {
            success: false,
            message: `상품 삭제에 실패했습니다. ${error?.message ?? '(DB 수정 권한 확인 필요)'}`,
        };
    }

    revalidatePath(LIST_PATH);
    revalidatePath('/products');
    return { success: true };
}
