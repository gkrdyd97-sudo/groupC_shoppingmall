// 인증 폼 유효성 검사
// 서버 액션에서 호출하며, 순수 함수라 node:test 로 단위 테스트한다.
// 반환값은 { 필드명: 에러 문구 } 형태이고, 빈 객체면 통과
import {
    GENDER_OPTIONS,
    PASSWORD_MIN_LENGTH,
} from '../constants/auth.constants';
import type {
    LoginInput,
    ProfileInput,
    RegisterInput,
} from '../types/auth.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 1자 이상 + 숫자 1자 이상 포함
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;
// 하이픈 유무와 관계없이 010-1234-5678 / 0101234567 형태 허용
const PHONE_REGEX = /^01\d{8,9}$/;

function validatePassword(password: string): string | undefined {
    if (!password) return '비밀번호를 입력해주세요.';
    if (
        password.length < PASSWORD_MIN_LENGTH ||
        !PASSWORD_REGEX.test(password)
    ) {
        return `비밀번호는 영문과 숫자를 포함해 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`;
    }
}

function validateName(name: string): string | undefined {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
        return '이름은 2~20자로 입력해주세요.';
    }
}

function validatePhone(phone: string): string | undefined {
    if (!PHONE_REGEX.test(phone.replace(/-/g, ''))) {
        return '휴대폰 번호를 정확히 입력해주세요.';
    }
}

function validateGender(gender: string): string | undefined {
    if (!GENDER_OPTIONS.some((option) => option.value === gender)) {
        return '성별을 선택해주세요.';
    }
}

// 휴대폰 번호를 010-1234-5678 형태로 통일해서 저장
export function formatPhone(phone: string): string {
    return phone
        .replace(/-/g, '')
        .replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
}

// 로그인: 형식만 확인 (실제 일치 여부는 Supabase Auth 가 판단)
export function validateLogin(input: LoginInput): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!input.email.trim()) {
        errors.email = '이메일을 입력해주세요.';
    } else if (!EMAIL_REGEX.test(input.email.trim())) {
        errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!input.password) {
        errors.password = '비밀번호를 입력해주세요.';
    }

    return errors;
}

// 회원가입
export function validateRegister(input: RegisterInput): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!EMAIL_REGEX.test(input.email.trim())) {
        errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    const passwordError = validatePassword(input.password);
    if (passwordError) errors.password = passwordError;

    if (!input.passwordConfirm || input.password !== input.passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    const nameError = validateName(input.name);
    if (nameError) errors.name = nameError;

    const phoneError = validatePhone(input.phone);
    if (phoneError) errors.phone = phoneError;

    const genderError = validateGender(input.gender);
    if (genderError) errors.gender = genderError;

    // 필수 약관 2개 모두 동의해야 가입 가능
    if (!input.agreeService || !input.agreePrivacy) {
        errors.agreement = '필수 약관에 모두 동의해주세요.';
    }

    return errors;
}

// 회원정보 수정: 새 비밀번호는 입력했을 때만 검사
export function validateProfile(input: ProfileInput): Record<string, string> {
    const errors: Record<string, string> = {};

    const nameError = validateName(input.name);
    if (nameError) errors.name = nameError;

    const phoneError = validatePhone(input.phone);
    if (phoneError) errors.phone = phoneError;

    const genderError = validateGender(input.gender);
    if (genderError) errors.gender = genderError;

    if (input.newPassword || input.newPasswordConfirm) {
        const passwordError = validatePassword(input.newPassword);
        if (passwordError) errors.newPassword = passwordError;

        if (input.newPassword !== input.newPasswordConfirm) {
            errors.newPasswordConfirm = '새 비밀번호가 일치하지 않습니다.';
        }
    }

    return errors;
}

// 로그인 후 이동할 경로 검증
// 미들웨어가 붙여주는 ?redirectUrl= 값을 그대로 쓰면 외부 사이트로 튕겨낼 수 있으므로
// (오픈 리다이렉트) 우리 사이트 내부 경로('/'로 시작)만 허용한다
// '//evil.com', '/\evil.com' 은 브라우저가 외부 주소로 해석하므로 차단
export function getSafeRedirectPath(
    redirectUrl: string | null | undefined,
): string {
    if (
        !redirectUrl ||
        !redirectUrl.startsWith('/') ||
        redirectUrl.startsWith('//') ||
        redirectUrl.startsWith('/\\')
    ) {
        return '/';
    }
    return redirectUrl;
}

// 로그인 성공 후 최종 이동 경로 결정
// - 관리자(ADMIN): 관리자 페이지(/admin)로 이동
//   단, 원래 가려던 곳이 관리자 하위 페이지(/admin/products 등)면 그곳으로 이동
// - 일반 회원: 원래 가려던 페이지 (없으면 메인)
// safeRedirectPath 는 getSafeRedirectPath() 를 거친 값이어야 함
export function getLoginRedirectPath(
    userType: string | null | undefined,
    safeRedirectPath: string,
): string {
    if (userType === 'ADMIN') {
        return safeRedirectPath.startsWith('/admin')
            ? safeRedirectPath
            : '/admin';
    }
    return safeRedirectPath;
}
