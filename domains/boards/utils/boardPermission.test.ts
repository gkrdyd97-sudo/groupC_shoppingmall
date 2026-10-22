import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canManagePost, canWritePost } from './boardPermission';

const USER = { id: 'user-1', userType: 'USER' };
const OTHER_USER = { id: 'user-2', userType: 'USER' };
const ADMIN = { id: 'admin-1', userType: 'ADMIN' };

describe('canWritePost 함수 테스트', () => {
    it('비로그인은 어떤 게시판에도 글을 쓸 수 없다', () => {
        assert.strictEqual(canWritePost('qna', null), false);
        assert.strictEqual(canWritePost('notice', null), false);
    });

    it('공지사항은 관리자만 작성 가능', () => {
        assert.strictEqual(canWritePost('notice', USER), false);
        assert.strictEqual(canWritePost('notice', ADMIN), true);
    });

    it('Q&A 는 로그인 회원 누구나 작성 가능', () => {
        assert.strictEqual(canWritePost('qna', USER), true);
        assert.strictEqual(canWritePost('qna', ADMIN), true);
    });
});

describe('canManagePost 함수 테스트', () => {
    const post = { userId: 'user-1' };

    it('작성자 본인과 관리자는 수정·삭제 가능', () => {
        assert.strictEqual(canManagePost(post, USER), true);
        assert.strictEqual(canManagePost(post, ADMIN), true);
    });

    it('다른 회원과 비로그인은 불가', () => {
        assert.strictEqual(canManagePost(post, OTHER_USER), false);
        assert.strictEqual(canManagePost(post, null), false);
    });
});
