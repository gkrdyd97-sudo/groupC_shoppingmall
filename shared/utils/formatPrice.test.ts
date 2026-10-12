import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatPrice } from './formatPrice';

describe('formatPrice 함수 테스트', () => {
    it('가격에 쉼표와 원 단위를 붙인다', () => {
        assert.strictEqual(formatPrice(1500000), '1,500,000원');
    });

    it('0원을 올바르게 표시한다', () => {
        assert.strictEqual(formatPrice(0), '0원');
    });

    it('음수 가격을 올바르게 표시한다', () => {
        assert.strictEqual(formatPrice(-5000), '-5,000원');
    });
});