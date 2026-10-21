import type { CategoryInput } from '../types/category.types';

export function validateAddCategory(
    input: CategoryInput,
): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!input.name || !input.name.trim()) {
        errors.name = '분류명을 입력하세요.';
    }

    return errors;
}
