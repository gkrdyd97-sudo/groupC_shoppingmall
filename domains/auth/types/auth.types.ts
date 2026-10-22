// 회원 인증(로그인/회원가입/회원정보 수정) 도메인 타입

// PROFILES.gender 컬럼에 저장되는 값
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

// 로그인 폼 입력값
export interface LoginInput {
    email: string;
    password: string;
}

// 회원가입 폼 입력값 (약관 동의는 체크박스라 boolean)
export interface RegisterInput {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    phone: string;
    gender: string;
    agreeService: boolean;
    agreePrivacy: boolean;
}

// 회원정보 수정 폼 입력값
// 새 비밀번호는 선택 입력: 비워두면 비밀번호는 변경하지 않음
export interface ProfileInput {
    name: string;
    phone: string;
    gender: string;
    newPassword: string;
    newPasswordConfirm: string;
}

// 검증 실패 시 사용자가 입력했던 값을 폼에 되돌려주기 위한 타입
// (비밀번호는 보안상 되돌려주지 않음)
export type RegisterValues = Omit<
    RegisterInput,
    'password' | 'passwordConfirm'
>;
export type ProfileValues = Pick<ProfileInput, 'name' | 'phone' | 'gender'>;
