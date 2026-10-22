'use client';
// 회원정보 수정 폼
// - 초기값(현재 프로필)은 서버 컴포넌트(페이지)에서 조회해 props 로 받음
//   → 예전처럼 useEffect 로 클라이언트에서 다시 불러오지 않아 로딩 깜빡임이 없음
// - 저장은 Server Action(updateProfileAction) 으로 처리
import { useActionState } from 'react';
import type { ActionState } from '@/shared/types/action.types';
import { updateProfileAction } from '../actions/profile.action';
import { GENDER_OPTIONS } from '../constants/auth.constants';
import type { ProfileValues } from '../types/auth.types';
import FieldError from './FieldError';

interface ProfileEditFormProps {
    email: string;
    initialValues: ProfileValues;
}

export default function ProfileEditForm({
    email,
    initialValues,
}: ProfileEditFormProps) {
    // 첫 화면에서는 DB 의 현재 값을, 제출 후에는 서버가 돌려준 값을 사용
    const [state, formAction, isPending] = useActionState(updateProfileAction, {
        success: false,
        data: initialValues,
    } as ActionState<ProfileValues>);

    const values = state.data ?? initialValues;

    return (
        <div className="auth-form">
            <form action={formAction} noValidate className="auth-form-content">
                {/* 이메일은 로그인 ID 라 수정 불가 (name 이 없어서 서버로 전송되지 않음) */}
                <label className="text-xs font-semibold text-gray-700">
                    이메일
                </label>
                <input
                    className="auth-input bg-gray-50 text-gray-500"
                    type="email"
                    value={email}
                    readOnly
                />

                <label
                    htmlFor="name"
                    className="text-xs font-semibold text-gray-700"
                >
                    이름
                </label>
                <input
                    id="name"
                    className="auth-input"
                    name="name"
                    defaultValue={values.name}
                    aria-invalid={Boolean(state.errors?.name)}
                />
                <FieldError message={state.errors?.name} />

                <label
                    htmlFor="phone"
                    className="text-xs font-semibold text-gray-700"
                >
                    휴대폰 번호
                </label>
                <input
                    id="phone"
                    className="auth-input"
                    type="tel"
                    name="phone"
                    defaultValue={values.phone}
                    aria-invalid={Boolean(state.errors?.phone)}
                />
                <FieldError message={state.errors?.phone} />

                <label
                    htmlFor="gender"
                    className="text-xs font-semibold text-gray-700"
                >
                    성별
                </label>
                {/* key: 서버 응답마다 select 를 새로 그려 defaultValue 가 다시 적용되도록 함 */}
                <select
                    key={values.gender}
                    id="gender"
                    className="auth-input"
                    name="gender"
                    defaultValue={values.gender}
                    aria-invalid={Boolean(state.errors?.gender)}
                >
                    <option value="">성별 선택</option>
                    {GENDER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <FieldError message={state.errors?.gender} />

                {/* 비밀번호 변경 (선택) - 비워두면 기존 비밀번호 유지 */}
                <p className="mt-4 text-xs font-semibold text-gray-700">
                    비밀번호 변경{' '}
                    <span className="font-normal text-gray-400">
                        (변경 시에만 입력)
                    </span>
                </p>
                <input
                    className="auth-input"
                    type="password"
                    name="newPassword"
                    placeholder="새 비밀번호 (영문, 숫자 포함 8자 이상)"
                    autoComplete="new-password"
                    aria-invalid={Boolean(state.errors?.newPassword)}
                />
                <FieldError message={state.errors?.newPassword} />

                <input
                    className="auth-input"
                    type="password"
                    name="newPasswordConfirm"
                    placeholder="새 비밀번호 확인"
                    autoComplete="new-password"
                    aria-invalid={Boolean(state.errors?.newPasswordConfirm)}
                />
                <FieldError message={state.errors?.newPasswordConfirm} />

                {/* 성공(파란색) / 실패(빨간색) 메시지 */}
                {state.message && (
                    <p
                        className={
                            state.success
                                ? 'text-center text-sm text-blue-600'
                                : 'text-center text-sm text-red-500'
                        }
                    >
                        {state.message}
                    </p>
                )}

                <button
                    className="auth-button black-button"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? '저장 중...' : '회원정보 수정'}
                </button>
            </form>
        </div>
    );
}
