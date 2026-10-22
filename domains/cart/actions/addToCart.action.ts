'use server';

import { createServerClient } from '@/shared/lib/supabase';
import { getCurrentUser } from '@/domains/users/queries/getCurrentUser.query';
import { type ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';

interface AddToCartInput {
    productId: string;
    optionId: string;
    quantity: number;
}

export async function addToCart({
    productId,
    optionId,
    quantity,
}: AddToCartInput): Promise<ActionState> {
    const user = await getCurrentUser();

    if (!user) {
        return { success: false, message: '로그인이 필요합니다.' };
    }

    const supabase = createServerClient();

    // 같은 상품 + 같은 옵션이 이미 담겨 있나?
    const { data: existing } = await supabase
        .from('CART')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('option_id', optionId)
        .maybeSingle();

    if (existing) {
        const { error } = await supabase
            .from('CART')
            .update({
                quantity: existing.quantity + quantity,
                updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

        if (error) {
            return { success: false, message: error.message };
        }
    } else {
        const { error } = await supabase.from('CART').insert({
            user_id: user.id,
            product_id: productId,
            option_id: optionId,
            quantity,
        });

        if (error) {
            return { success: false, message: error.message };
        }
    }

    revalidatePath('/cart');

    return { success: true, message: '장바구니에 담았습니다.' };
}
