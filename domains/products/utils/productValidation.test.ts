import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createProductGid, validateProduct } from './productValidation';

const VALID = {
    name: '라이트 러닝 윈드 재킷',
    brand: 'RNDO',
    styleCode: 'RNDO-T001',
    categoryId: 'cat-1',
    salePrice: '89000',
    consumerPrice: '99000',
    shortDescription: '가볍고 바람을 막아주는 재킷',
    longDescription: '',
    options: [
        { id: '', name: 'M', addPrice: '0' },
        { id: 'opt-1', name: 'L', addPrice: '2000' },
    ],
};

describe('validateProduct 함수 테스트', () => {
    it('올바른 입력은 에러가 없다', () => {
        assert.deepStrictEqual(validateProduct(VALID), {});
        assert.deepStrictEqual(validateProduct({ ...VALID, options: [] }), {});
    });

    it('필수 항목이 비면 각각 에러', () => {
        const errors = validateProduct({
            ...VALID,
            name: ' ',
            brand: '',
            styleCode: '',
            categoryId: '',
            shortDescription: '',
        });
        assert.deepStrictEqual(Object.keys(errors).sort(), [
            'brand',
            'categoryId',
            'name',
            'shortDescription',
            'styleCode',
        ]);
    });

    it('가격은 0 이상의 정수여야 한다', () => {
        assert.ok(validateProduct({ ...VALID, salePrice: '-1' }).salePrice);
        assert.ok(validateProduct({ ...VALID, salePrice: '10.5' }).salePrice);
        assert.ok(validateProduct({ ...VALID, salePrice: '' }).salePrice);
    });

    it('정가가 판매가보다 낮으면 에러', () => {
        const errors = validateProduct({ ...VALID, consumerPrice: '50000' });
        assert.ok(errors.consumerPrice);
    });

    it('옵션명 누락·중복·잘못된 추가금액은 에러', () => {
        const blank = [{ id: '', name: ' ', addPrice: '0' }];
        const duplicated = [
            { id: '', name: 'M', addPrice: '0' },
            { id: '', name: 'M ', addPrice: '0' },
        ];
        const badPrice = [{ id: '', name: 'M', addPrice: '-500' }];
        assert.ok(validateProduct({ ...VALID, options: blank }).options);
        assert.ok(validateProduct({ ...VALID, options: duplicated }).options);
        assert.ok(validateProduct({ ...VALID, options: badPrice }).options);
    });
});

describe('createProductGid 함수 테스트', () => {
    it('P 로 시작하는 대문자 영숫자', () => {
        assert.match(createProductGid(1791937140774), /^P[0-9A-Z]+$/);
    });
});
