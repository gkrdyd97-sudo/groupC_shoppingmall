// 관리자 상품 등록/수정 입력값 검사 (순수 함수 → node:test 로 테스트)
import type { ProductFormInput } from '../types/Product.types';

export const PRODUCT_NAME_MAX_LENGTH = 100;

// 0 이상의 정수인지 (가격, 추가금액)
function isNonNegativeInt(value: string): boolean {
    const number = Number(value);
    return value.trim() !== '' && Number.isInteger(number) && number >= 0;
}

export function validateProduct(
    input: ProductFormInput,
): Record<string, string> {
    const errors: Record<string, string> = {};

    const name = input.name.trim();
    if (!name) {
        errors.name = '상품명을 입력하세요.';
    } else if (name.length > PRODUCT_NAME_MAX_LENGTH) {
        errors.name = `상품명은 ${PRODUCT_NAME_MAX_LENGTH}자 이하로 입력하세요.`;
    }

    if (!input.brand.trim()) errors.brand = '브랜드를 입력하세요.';
    if (!input.styleCode.trim())
        errors.styleCode = '스타일 코드(품번)를 입력하세요.';
    if (!input.categoryId) errors.categoryId = '카테고리를 선택하세요.';

    if (!isNonNegativeInt(input.salePrice)) {
        errors.salePrice = '판매가는 0 이상의 정수로 입력하세요.';
    }
    if (!isNonNegativeInt(input.consumerPrice)) {
        errors.consumerPrice = '정가는 0 이상의 정수로 입력하세요.';
    } else if (
        !errors.salePrice &&
        Number(input.consumerPrice) < Number(input.salePrice)
    ) {
        // 정가(소비자가)가 판매가보다 낮으면 할인율이 음수가 됨
        errors.consumerPrice = '정가는 판매가보다 크거나 같아야 합니다.';
    }

    if (!input.shortDescription.trim()) {
        errors.shortDescription = '한 줄 설명을 입력하세요.';
    }

    // 옵션: 이름 필수, 이름 중복 금지, 추가금액 0 이상 정수
    const names = input.options.map((option) => option.name.trim());
    if (names.some((optionName) => !optionName)) {
        errors.options = '옵션명이 비어 있는 행이 있습니다.';
    } else if (new Set(names).size !== names.length) {
        errors.options = '같은 이름의 옵션이 있습니다.';
    } else if (
        input.options.some((option) => !isNonNegativeInt(option.addPrice))
    ) {
        errors.options = '옵션 추가금액은 0 이상의 정수로 입력하세요.';
    }

    return errors;
}

// 새 상품의 그룹 ID (FILE_INFO.gid 와 연결되는 값, 기존 데이터 형식 P + 영문/숫자)
export function createProductGid(now: number = Date.now()): string {
    return `P${now.toString(36).toUpperCase()}`;
}
