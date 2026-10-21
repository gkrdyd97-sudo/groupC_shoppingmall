import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validateShipping } from './orderValidation';

const VALID_INPUT = {
    receiverName: '홍길동',
    receiverPhone: '010-1234-5678',
    receiverZipcode: '06236',
    receiverAddress: '서울 강남구 테헤란로 123 4층',
};

describe('validateShipping 함수 테스트', () => {
    it('올바른 배송지는 에러가 없다', () => {
        assert.deepStrictEqual(validateShipping(VALID_INPUT), {});
    });

    it('하이픈 없는 휴대폰 번호도 허용한다', () => {
        const errors = validateShipping({
            ...VALID_INPUT,
            receiverPhone: '01012345678',
        });
        assert.strictEqual(errors.receiverPhone, undefined);
    });

    it('빈 값은 모든 항목에 에러를 반환한다', () => {
        const errors = validateShipping({
            receiverName: ' ',
            receiverPhone: '',
            receiverZipcode: '',
            receiverAddress: '',
        });
        assert.deepStrictEqual(Object.keys(errors).sort(), [
            'receiverAddress',
            'receiverName',
            'receiverPhone',
            'receiverZipcode',
        ]);
    });

    it('휴대폰 번호 형식이 아니면 에러를 반환한다', () => {
        const errors = validateShipping({
            ...VALID_INPUT,
            receiverPhone: '02-123-4567',
        });
        assert.ok(errors.receiverPhone);
    });

    it('우편번호가 5자리 숫자가 아니면 에러를 반환한다', () => {
        const errors = validateShipping({
            ...VALID_INPUT,
            receiverZipcode: '123-45',
        });
        assert.ok(errors.receiverZipcode);
    });
});
