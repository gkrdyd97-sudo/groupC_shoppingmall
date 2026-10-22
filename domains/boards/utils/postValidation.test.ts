import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    getPageNumbers,
    isBoardId,
    parsePage,
    toLikePattern,
    validatePost,
} from './postValidation';

const VALID_POST = {
    title: '배송 문의드립니다',
    content: '주문한 상품이 언제 도착하나요?',
    category: '배송',
};

describe('isBoardId 함수 테스트', () => {
    it('notice, qna 만 허용한다', () => {
        assert.strictEqual(isBoardId('notice'), true);
        assert.strictEqual(isBoardId('qna'), true);
        assert.strictEqual(isBoardId('review'), false);
        assert.strictEqual(isBoardId('toString'), false);
    });
});

describe('validatePost 함수 테스트', () => {
    it('올바른 Q&A 글은 에러가 없다', () => {
        assert.deepStrictEqual(validatePost('qna', VALID_POST), {});
    });

    it('공지사항은 문의 유형이 없어도 된다', () => {
        assert.deepStrictEqual(
            validatePost('notice', { ...VALID_POST, category: '' }),
            {},
        );
    });

    it('Q&A 는 문의 유형이 목록에 없으면 에러', () => {
        const errors = validatePost('qna', { ...VALID_POST, category: '' });
        assert.ok(errors.category);
    });

    it('공백만 있는 제목·짧은 내용은 에러', () => {
        const errors = validatePost('qna', {
            ...VALID_POST,
            title: '   ',
            content: '짧은 내용',
        });
        assert.deepStrictEqual(Object.keys(errors).sort(), [
            'content',
            'title',
        ]);
    });
});

describe('parsePage 함수 테스트', () => {
    it('잘못된 값은 1페이지로 보정한다', () => {
        assert.strictEqual(parsePage(undefined), 1);
        assert.strictEqual(parsePage('abc'), 1);
        assert.strictEqual(parsePage('0'), 1);
        assert.strictEqual(parsePage('1.5'), 1);
        assert.strictEqual(parsePage('3'), 3);
    });
});

describe('toLikePattern 함수 테스트', () => {
    it('검색어 앞뒤에 % 를 붙이고 와일드카드 문자는 이스케이프한다', () => {
        assert.strictEqual(toLikePattern('배송'), '%배송%');
        assert.strictEqual(toLikePattern('100%'), '%100\\%%');
        assert.strictEqual(toLikePattern('a_b'), '%a\\_b%');
    });
});

describe('getPageNumbers 함수 테스트', () => {
    it('현재 페이지가 속한 묶음을 반환한다', () => {
        assert.deepStrictEqual(getPageNumbers(1, 3, 5), [1, 2, 3]);
        assert.deepStrictEqual(getPageNumbers(7, 12, 5), [6, 7, 8, 9, 10]);
        assert.deepStrictEqual(getPageNumbers(11, 12, 5), [11, 12]);
    });

    it('게시글이 없으면 빈 배열', () => {
        assert.deepStrictEqual(getPageNumbers(1, 0, 5), []);
    });
});
