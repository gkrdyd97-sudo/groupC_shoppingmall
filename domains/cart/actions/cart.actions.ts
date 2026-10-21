'use server';
import type { Cart } from '../types/Cart.types';
import { type ActionState } from '@/shared/types/action.types';
import { createServerClient } from '@/shared/lib/supabase';

interface AddCartParams {
    productId: string;
    quantity: number;
    optionId?: string;
}

export async function addCart({
    productId,
    quantity,
    optionId,
}: AddCartParams): Promise<ActionState> {
    const product = await getProductById(productId);
    if (!product) {
        return {
            success: false,
            message: `상품을 찾을 수 없습니다 - ID:${productId}`,
        };
    }

    // 회원 로그인 여부 체크, 회원 ID 조회
    const user = await getCurrentUser();
    if (!user) {
        return {
            success: false,
            message: '로그인이 필요한 서비스입니다.',
        };
    }

    // DB 추가 처리
    const supabase = createServerClient();
    const { error } = await supabase.from('CART').insert({
        product_id: productId,
        option_id: optionId,
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

    const user = await getCurrentUser();
    if (!user) {
        return {
            success: false,
            message: '로그인이 필요한 서비스입니다.',
        };
    }
    // 넘어온 값만 수정 대상에 담기
    const updates: { quantity?: number; option_id?: string } = {};
    if (quantity !== undefined) updates.quantity = quantity;
    if (optionId !== undefined) updates.option_id = optionId;

    const supabase = createServerClient();
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
export async function deleteCart(ids: string[]): Promise<ActionState> {
    if (ids.length === 0) {
        return {
            success: false,
            message: '삭제할 상품을 선택해주세요.',
        };
    }

    const user = await getCurrentUser();
    if (!user) {
        return {
            success: false,
            message: '로그인이 필요한 서비스입니다.',
        };
    }

    const supabase = createServerClient();
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

// 임시
async function getProductById(id: string) {
    return {
        id: 1001,
        category: 'tops',
        brand: 'RNDO',
        name: '라이트 러닝 윈드 재킷',
        price: 89000,
        images: [
            '/images/products/top1-1.jpg',
            '/images/products/top1-2.jpg',
            '/images/products/top1-3.jpg',
            '/images/products/top1-4.jpg',
        ],
        description:
            '가볍고 바람을 막아주는 데일리 러닝 재킷. 후드와 지퍼 포켓을 갖춘 러닝용 아우터입니다.',
        styleCode: 'RNDO-T001',
        country: '베트남',
        sizes: ['S', 'M', 'L', 'XL'],
    };
}

async function getCurrentUser() {
    return {
        id: '8685b727-1be4-43de-83aa-cc91da5ca595',
    };
}
