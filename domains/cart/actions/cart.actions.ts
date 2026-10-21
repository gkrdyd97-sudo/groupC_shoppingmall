'use server';
import { type ActionState } from '@/shared/types/action.types';
import { createServerClient } from '@/shared/lib/supabase';
import { validateAddCart } from '../util/cartValidation';

interface AddCartParams {
    productId: string;
    quantity: number;
    optionId?: string;
}

// 장바구니 담기 (같은 상품·옵션이 이미 있으면 수량만 더함)
export async function addCart({
    productId,
    quantity,
    optionId,
}: AddCartParams): Promise<ActionState> {
    const errors = validateAddCart({ productId, quantity, optionId });
    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: Object.values(errors)[0],
            errors,
        };
    }

    const supabase = createServerClient();

    // 회원 로그인 여부 체크, 회원 ID 조회
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return {
            success: false,
            message: '로그인이 필요한 서비스입니다.',
        };
    }

    const { data: product } = await supabase
        .from('PRODUCTS')
        .select('id')
        .eq('id', productId)
        .is('deleted_at', null)
        .maybeSingle();
    if (!product) {
        return {
            success: false,
            message: `상품을 찾을 수 없습니다 - ID:${productId}`,
        };
    }

    // 옵션이 해당 상품의 옵션인지 확인
    if (optionId) {
        const { data: option } = await supabase
            .from('PRODUCT_OPTIONS')
            .select('id')
            .eq('id', optionId)
            .eq('product_id', productId)
            .maybeSingle();
        if (!option) {
            return { success: false, message: '옵션을 찾을 수 없습니다.' };
        }
    }

    let existingQuery = supabase
        .from('CART')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId);
    existingQuery = optionId
        ? existingQuery.eq('option_id', optionId)
        : existingQuery.is('option_id', null);
    const { data: existing } = await existingQuery.maybeSingle();

    // DB 추가/수정 처리
    const { error } = existing
        ? await supabase
              .from('CART')
              .update({
                  quantity: existing.quantity + quantity,
                  updated_at: new Date().toISOString(),
              })
              .eq('id', existing.id)
        : await supabase.from('CART').insert({
              product_id: productId,
              option_id: optionId ?? null,
              quantity,
              user_id: user.id,
          });

    if (error) {
        return {
            success: false,
            message: '장바구니 등록에 실패했습니다.',
        };
    }

    return {
        success: true,
        message: '장바구니에 추가되었습니다.',
    };
}

// 장바구니 상품 수량 변경

interface ChangeCartParams {
    id: number;
    quantity?: number;
    optionId?: string;
}

export async function changeCart({
    id,
    quantity,
    optionId,
}: ChangeCartParams): Promise<ActionState> {
    // 바꿀 값이 하나도 없으면 종료
    if (quantity === undefined && optionId === undefined) {
        return { success: false, message: '변경할 내용이 없습니다.' };
    }

    // 수량이 넘어왔다면 검사
    if (
        quantity !== undefined &&
        (!Number.isInteger(quantity) || quantity < 1)
    ) {
        return { success: false, message: '수량은 1 이상의 정수여야 합니다.' };
    }

    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return {
            success: false,
            message: '로그인이 필요한 서비스입니다.',
        };
    }
    // 넘어온 값만 수정 대상에 담기
    const updates: {
        quantity?: number;
        option_id?: string;
        updated_at: string;
    } = { updated_at: new Date().toISOString() };
    if (quantity !== undefined) updates.quantity = quantity;
    if (optionId !== undefined) updates.option_id = optionId;

    const { error } = await supabase
        .from('CART')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id); // 내 장바구니만 수정 가능하게

    if (error) {
        return {
            success: false,
            message: '장바구니 수정에 실패했습니다.',
        };
    }

    return {
        success: true,
        message: '변경되었습니다.',
    };
}

// 장바구니 상품 삭제
export async function deleteCart(ids: number[]): Promise<ActionState> {
    if (ids.length === 0) {
        return {
            success: false,
            message: '삭제할 상품을 선택해주세요.',
        };
    }

    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return {
            success: false,
            message: '로그인이 필요한 서비스입니다.',
        };
    }

    const { error } = await supabase
        .from('CART')
        .delete()
        .in('id', ids)
        .eq('user_id', user.id);

    if (error) {
        return {
            success: false,
            message: '장바구니 삭제에 실패했습니다.',
        };
    }
    return {
        success: true,
        message: '삭제되었습니다.',
    };
}
