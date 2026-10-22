import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    formatPhone,
    getSafeRedirectPath,
    validateLogin,
    validateProfile,
    validateRegister,
} from './authValidation';

const VALID_REGISTER = {
    email: 'user@rndo.com',
    password: 'abcd1234',
    passwordConfirm: 'abcd1234',
    name: '홍길동',
    phone: '010-1234-5678',
    gender: 'MALE',
    agreeService: true,
    agreePrivacy: true,
};

const VALID_PROFILE = {
    name: '홍길동',
    phone: '01012345678',
    gender: 'FEMALE',
    newPassword: '',
    newPasswordConfirm: '',
};

describe('validateLogin 함수 테스트', () => {
    it('올바른 입력은 에러가 없다', () => {
        assert.deepStrictEqual(
            validateLogin({ email: 'user@rndo.com', password: '1234' }),
            {},
        );
    });

    it('빈 값이면 이메일·비밀번호 모두 에러', () => {
        const errors = validateLogin({ email: ' ', password: '' });
        assert.deepStrictEqual(Object.keys(errors).sort(), [
            'email',
            'password',
        ]);
    });

    it('이메일 형식이 아니면 에러', () => {
        const errors = validateLogin({ email: 'user', password: '1234' });
        assert.ok(errors.email);
    });
});

describe('validateRegister 함수 테스트', () => {
    it('올바른 입력은 에러가 없다', () => {
        assert.deepStrictEqual(validateRegister(VALID_REGISTER), {});
    });

    it('숫자 없는 비밀번호는 에러', () => {
        const errors = validateRegister({
            ...VALID_REGISTER,
            password: 'abcdefgh',
            passwordConfirm: 'abcdefgh',
        });
        assert.ok(errors.password);
    });

    it('8자 미만 비밀번호는 에러', () => {
        const errors = validateRegister({
            ...VALID_REGISTER,
            password: 'abc12',
            passwordConfirm: 'abc12',
        });
        assert.ok(errors.password);
    });

    it('비밀번호 확인이 다르면 에러', () => {
        const errors = validateRegister({
            ...VALID_REGISTER,
            passwordConfirm: 'abcd12345',
        });
        assert.ok(errors.passwordConfirm);
    });

    it('필수 약관 중 하나라도 미동의면 에러', () => {
        const errors = validateRegister({
            ...VALID_REGISTER,
            agreePrivacy: false,
        });
        assert.ok(errors.agreement);
    });

    it('성별 값이 목록에 없으면 에러', () => {
        const errors = validateRegister({ ...VALID_REGISTER, gender: '' });
        assert.ok(errors.gender);
    });

    it('휴대폰 번호 형식이 아니면 에러', () => {
        const errors = validateRegister({
            ...VALID_REGISTER,
            phone: '02-123-4567',
        });
        assert.ok(errors.phone);
    });
});

describe('validateProfile 함수 테스트', () => {
    it('비밀번호를 비워두면 비밀번호 검사는 건너뛴다', () => {
        assert.deepStrictEqual(validateProfile(VALID_PROFILE), {});
    });

    it('새 비밀번호를 입력하면 규칙과 일치 여부를 검사한다', () => {
        const errors = validateProfile({
            ...VALID_PROFILE,
            newPassword: 'abcd1234',
            newPasswordConfirm: 'abcd9999',
        });
        assert.ok(errors.newPasswordConfirm);
        assert.strictEqual(errors.newPassword, undefined);
    });

    it('이름이 1자면 에러', () => {
        const errors = validateProfile({ ...VALID_PROFILE, name: '김' });
        assert.ok(errors.name);
    });
});

describe('formatPhone 함수 테스트', () => {
    it('하이픈 없는 번호에 하이픈을 넣는다', () => {
        assert.strictEqual(formatPhone('01012345678'), '010-1234-5678');
        assert.strictEqual(formatPhone('0111234567'), '011-123-4567');
    });

    it('이미 하이픈이 있으면 그대로 유지한다', () => {
        assert.strictEqual(formatPhone('010-1234-5678'), '010-1234-5678');
    });
});

describe('getSafeRedirectPath 함수 테스트', () => {
    it('내부 경로는 그대로 반환한다', () => {
        assert.strictEqual(getSafeRedirectPath('/mypage'), '/mypage');
    });

    it('값이 없거나 외부 주소면 홈으로 보낸다', () => {
        assert.strictEqual(getSafeRedirectPath(null), '/');
        assert.strictEqual(getSafeRedirectPath('https://evil.com'), '/');
        assert.strictEqual(getSafeRedirectPath('//evil.com'), '/');
        assert.strictEqual(getSafeRedirectPath('/\\evil.com'), '/');
    });
});
