'use server';

import { createServerClient } from '@/shared/lib/supabase';
import { type ActionState } from '@/shared/types/action.types';
import { type CreateOrderInput } from '../types/order.types';

// 임시 - 실제 로그인 연동 후 교체
async function getCurrentUser() {
    return {
        id: '8685b727-1be4-43de-83aa-cc91da5ca595',
    };
}

export async function createOrder(
    input: CreateOrderInput,
): Promise<ActionState<{ orderId: string }>> {
    if (input.items.length === 0) {
        return {
            success: false,
            message: '주문할 상품이 없습니다.',
        };
    }

    for (const item of input.items) {
        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
            return {
                success: false,
                message: '수량은 1 이상의 정수여야 합니다.',
            };
        }
    }

    const user = await getCurrentUser();
    if (!user) {
        return {
            success: false,
            message: '로그인이 필요한 서비스입니다.',
        };
    }

    const supabase = createServerClient();

    // 클라이언트가 보낸 가격은 신뢰하지 않고, 상품/옵션의 진짜 가격을 다시 조회
    const productIds = input.items.map((item) => item.productId);
    const { data: products, error: productError } = await supabase
        .from('PRODUCTS')
        .select('id, name, sale_price')
        .in('id', productIds);

    if (productError || !products) {
        return {
            success: false,
            message: '상품 정보를 확인할 수 없습니다.',
        };
    }

    const optionIds = input.items
        .map((item) => item.optionId)
        .filter((id): id is string => Boolean(id));

    const { data: options, error: optionError } =
        optionIds.length > 0
            ? await supabase
                  .from('PRODUCT_OPTIONS')
                  .select('id, item_name, add_price')
                  .in('id', optionIds)
            : { data: [], error: null };

    if (optionError) {
        return {
            success: false,
            message: '옵션 정보를 확인할 수 없습니다.',
        };
    }

    // 서버에서 주문 항목을 다시 조립 (가격/이름은 지금 조회한 진짜 값만 사용)
    const orderItems: {
        productId: string;
        optionId: string | null;
        productName: string;
        optionItemName: string | null;
        productPrice: number;
        optionPrice: number;
        quantity: number;
    }[] = [];

    for (const item of input.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
            return {
                success: false,
                message: `상품을 찾을 수 없습니다 - ID:${item.productId}`,
            };
        }

        const option = item.optionId
            ? options?.find((o) => o.id === item.optionId)
            : undefined;

        if (item.optionId && !option) {
            return {
                success: false,
                message: `옵션을 찾을 수 없습니다 - ID:${item.optionId}`,
            };
        }

        orderItems.push({
            productId: product.id,
            optionId: option?.id ?? null,
            productName: product.name,
            optionItemName: option?.item_name ?? null,
            productPrice: product.sale_price,
            optionPrice: option?.add_price ?? 0,
            quantity: item.quantity,
        });
    }

    // 서버가 직접 계산한 총액 (클라이언트가 보낸 금액은 애초에 안 받음)
    const totalPrice = orderItems.reduce(
        (sum, item) => sum + (item.productPrice + item.optionPrice) * item.quantity,
        0,
    );

    const { data: orderId, error: orderError } = await supabase.rpc(
        'create_order_with_items',
        {
            p_user_id: user.id,
            p_order_name: input.orderName,
            p_order_email: input.orderEmail,
            p_order_phone: input.orderPhone,
            p_receiver_name: input.receiverName,
            p_receiver_phone: input.receiverPhone,
            p_receiver_zipcode: input.receiverZipcode,
            p_receiver_address: input.receiverAddress,
            p_receiver_address_sub: input.receiverAddressSub,
            p_total_price: totalPrice,
            p_items: orderItems,
        },
    );

    if (orderError || !orderId) {
        return {
            success: false,
            message: '주문 생성에 실패했습니다.',
        };
    }

    return {
        success: true,
        message: '주문이 생성되었습니다.',
        data: { orderId },
    };
}
