import type { Gender } from '../types/auth.types';

// 성별 선택 옵션 (회원가입 / 회원정보 수정 폼 공용)
export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
    { value: 'MALE', label: '남성' },
    { value: 'FEMALE', label: '여성' },
    { value: 'OTHER', label: '기타' },
];

// 비밀번호 최소 길이 (Supabase Auth 기본 최소값 6자보다 엄격하게 8자)
export const PASSWORD_MIN_LENGTH = 8;
