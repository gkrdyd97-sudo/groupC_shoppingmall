import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { CategoryRow } from '../types/category.types';
import { flattenCategoryTree, getDescendantIds } from './categoryTree';
import { validateCategory } from './categoryValidation';

const row = (
    id: string,
    parentId: string | null,
    sortOrder: number,
    name = id,
): CategoryRow => ({ id, name, parentId, sortOrder, active: true });

const ROWS: CategoryRow[] = [
    row('bottoms', null, 2),
    row('tops', null, 1),
    row('long', 'tops', 2),
    row('short', 'tops', 1),
    row('short-v', 'short', 1),
];

describe('flattenCategoryTree 함수 테스트', () => {
    it('부모 → 자식 순서로 펼치고, 같은 단계는 진열 순서대로 정렬한다', () => {
        const result = flattenCategoryTree(ROWS).map((item) => [
            item.id,
            item.depth,
        ]);
        assert.deepStrictEqual(result, [
            ['tops', 0],
            ['short', 1],
            ['short-v', 2],
            ['long', 1],
            ['bottoms', 0],
        ]);
    });

    it('부모가 없는 카테고리는 최상위로 표시한다', () => {
        const result = flattenCategoryTree([row('orphan', 'deleted', 1)]);
        assert.deepStrictEqual(
            result.map((item) => item.depth),
            [0],
        );
    });

    it('순환 데이터가 있어도 멈추지 않는다', () => {
        const result = flattenCategoryTree([
            row('a', 'b', 1),
            row('b', 'a', 1),
        ]);
        assert.ok(result.length <= 2);
    });
});

describe('getDescendantIds 함수 테스트', () => {
    it('모든 하위 카테고리를 찾는다', () => {
        assert.deepStrictEqual(getDescendantIds(ROWS, 'tops').sort(), [
            'long',
            'short',
            'short-v',
        ]);
        assert.deepStrictEqual(getDescendantIds(ROWS, 'bottoms'), []);
    });
});

describe('validateCategory 함수 테스트', () => {
    const VALID = { name: 'tops', parentId: '', sortOrder: '1', active: true };

    it('올바른 입력은 에러가 없다', () => {
        assert.deepStrictEqual(validateCategory(VALID), {});
        assert.deepStrictEqual(
            validateCategory({ ...VALID, sortOrder: '' }),
            {},
        );
    });

    it('빈 이름, 음수·소수 진열 순서는 에러', () => {
        assert.ok(validateCategory({ ...VALID, name: '  ' }).name);
        assert.ok(validateCategory({ ...VALID, sortOrder: '-1' }).sortOrder);
        assert.ok(validateCategory({ ...VALID, sortOrder: '1.5' }).sortOrder);
    });
});
