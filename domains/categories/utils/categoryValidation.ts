import type { CategoryFormInput } from '../types/category.types';

export const CATEGORY_NAME_MAX_LENGTH = 30;

// 카테고리 등록/수정 입력값 검사
// (상위 분류가 실제로 존재하는지 / 순환이 생기지 않는지는 DB 를 봐야 해서 액션에서 검사)
export function validateCategory(
    input: CategoryFormInput,
): Record<string, string> {
    const errors: Record<string, string> = {};
    const name = input.name.trim();

    if (!name) {
        errors.name = '분류명을 입력하세요.';
    } else if (name.length > CATEGORY_NAME_MAX_LENGTH) {
        errors.name = `분류명은 ${CATEGORY_NAME_MAX_LENGTH}자 이하로 입력하세요.`;
    }

    // 진열 순서: 0 이상의 정수 (비워두면 0)
    const sortOrder =
        input.sortOrder.trim() === '' ? 0 : Number(input.sortOrder);
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
        errors.sortOrder = '진열 순서는 0 이상의 정수로 입력하세요.';
    }

    return errors;
}
