import type { ShippingInput } from '../types/order.types';

export function validateShipping(input: ShippingInput): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!input.receiverName.trim()) {
        errors.receiverName = '받는 분 이름을 입력해주세요.';
    }

    if (!/^01\d{8,9}$/.test(input.receiverPhone.replace(/-/g, ''))) {
        errors.receiverPhone = '휴대폰 번호를 정확히 입력해주세요.';
    }

    if (!/^\d{5}$/.test(input.receiverZipcode.trim())) {
        errors.receiverZipcode = '우편번호 5자리를 입력해주세요.';
    }

    if (!input.receiverAddress.trim()) {
        errors.receiverAddress = '주소를 입력해주세요.';
    }

    return errors;
}
