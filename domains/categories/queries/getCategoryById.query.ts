'use server';
import { createServerClient } from '@/shared/lib/supabase';
import type { Category } from '../types/category.types';

export async function getCategoryById(id: string): Promise<Category | null> {
    const supabase = createServerClient();

    const { data } = await supabase
        .from('PRODUCT_CATEGORY')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    return data
        ? {
              id: data.id,
              name: data.name,
              parentId: data.parent_id,
          }
        : null;
}
