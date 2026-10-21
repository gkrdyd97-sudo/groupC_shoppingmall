'use server';
import type { ActionState } from '@/shared/types/action.types';
import { validateAddCategory } from '../utils/categoryValidation';
import { getCategoryById } from '../queries/getCategoryById.query';
import { supabase } from '@/shared/lib/supabase';
import { Category } from '../types/category.types';

export async function addCategoryAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const name = (formData.get('name') as string) ?? '';
    const parentId = (formData.get('parentId') as string) ?? '';

    const errors = validateAddCategory({ name });

    // parentId가 있으면 실제로 있는 분류인지 체크
    if (parentId && !getCategoryById(parentId)) {
        errors.parentId = `등록되지 않은 상위 분류입니다 - ID:[${parentId}]`;
    }

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
        };
    }

    const inData = { name };
    if (parentId) inData.parent_id = parentId;

    const { error } = await supabase.from('PRODUCT_CATEGORY').insert(inData);

    if (error) {
        console.error('error:', error);
        return {
            success: false,
            message: '분류 등록 실패',
        };
    }

    return {
        success: true,
        message: '분류 등록 성공',
    };
}
