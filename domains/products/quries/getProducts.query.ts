import { createServerClient } from '@/shared/lib/supabase';
import { type Product } from '../types/Product.types';

export async function toProduct(): Promise<Product[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('PRODUCTS')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

    if (error){
        console.error('상품 목록 조회 실패:', error.message);
        return [];
    }

    return (data ?? []) as Product[];
}
