'use client';
// 회원가입 폼
// - useActionState 로 Server Action(registerAction) 과 연결
// - 입력칸은 비제어(uncontrolled) 컴포넌트로 두고 FormData 로 서버에 전달
// - 약관 "전체 동의" 체크박스만 개별 체크와 연동되어야 해서 useState 로 제어
import Link from 'next/link';
import { useActionState, useState } from 'react';
import type { ActionState } from '@/shared/types/action.types';
import { registerAction } from '../actions/register.action';
import { GENDER_OPTIONS } from '../constants/auth.constants';
import type { RegisterValues } from '../types/auth.types';
import FieldError from './FieldError';

const INITIAL_STATE: ActionState<RegisterValues> = { success: false };

export default function RegisterForm() {
    const [state, formAction, isPending] = useActionState(
        registerAction,
        INITIAL_STATE,
    );

    // 필수 약관 동의 상태 (전체 동의 ↔ 개별 동의 연동)
    const [agreements, setAgreements] = useState({
        agreeService: false,
        agreePrivacy: false,
    });
    const agreeAll = agreements.agreeService && agreements.agreePrivacy;

    const onAgreeAllChange = (checked: boolean) => {
        setAgreements({ agreeService: checked, agreePrivacy: checked });
    };

    // 이메일 인증이 필요한 경우: 가입은 끝났으므로 폼 대신 안내 문구 표시
    // (이메일 인증이 꺼져 있으면 서버 액션이 바로 홈으로 redirect 함)
    if (state.success) {
        return (
            <div className="auth-form text-center">
                <p className="auth-description">{state.message}</p>
                <Link className="auth-button black-button" href="/login">
                    로그인하러 가기
                </Link>
            </div>
        );
    }

    return (
        <div className="auth-form">
            <form action={formAction} noValidate className="auth-form-content">
                {/* defaultValue: 검증 실패 시 서버가 돌려준 입력값으로 복원 */}
                <input
                    className="auth-input"
                    type="email"
                    name="email"
                    defaultValue={state.data?.email ?? ''}
                    placeholder="이메일"
                    autoComplete="email"
                    aria-invalid={Boolean(state.errors?.email)}
                />
                <FieldError message={state.errors?.email} />

                {/* 비밀번호는 보안상 복원하지 않음 */}
                <input
                    className="auth-input"
                    type="password"
                    name="password"
                    placeholder="비밀번호 (영문, 숫자 포함 8자 이상)"
                    autoComplete="new-password"
                    aria-invalid={Boolean(state.errors?.password)}
                />
                <FieldError message={state.errors?.password} />

                <input
                    className="auth-input"
                    type="password"
                    name="passwordConfirm"
                    placeholder="비밀번호 확인"
                    autoComplete="new-password"
                    aria-invalid={Boolean(state.errors?.passwordConfirm)}
                />
                <FieldError message={state.errors?.passwordConfirm} />

                <input
                    className="auth-input"
                    type="text"
                    name="name"
                    defaultValue={state.data?.name ?? ''}
                    placeholder="이름"
                    autoComplete="name"
                    aria-invalid={Boolean(state.errors?.name)}
                />
                <FieldError message={state.errors?.name} />

                <input
                    className="auth-input"
                    type="tel"
                    name="phone"
                    defaultValue={state.data?.phone ?? ''}
                    placeholder="휴대폰 번호 (예: 010-1234-5678)"
                    autoComplete="tel"
                    aria-invalid={Boolean(state.errors?.phone)}
                />
                <FieldError message={state.errors?.phone} />

                {/* key: 서버 응답마다 select 를 새로 그려 defaultValue 가 다시 적용되도록 함 */}
                <select
                    key={state.data?.gender}
                    className="auth-input"
                    name="gender"
                    defaultValue={state.data?.gender ?? ''}
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

                {/* 약관 동의 */}
                <div className="agreement-list">
                    <label className="agreement-item">
                        <input
                            type="checkbox"
                            checked={agreeAll}
                            onChange={(event) =>
                                onAgreeAllChange(event.target.checked)
                            }
                        />
                        전체 약관에 동의합니다.
                    </label>

                    {/* name 이 있는 체크박스만 FormData 로 전송됨 (체크 시 'on') */}
                    <label className="agreement-item">
                        <input
                            type="checkbox"
                            name="agreeService"
                            checked={agreements.agreeService}
                            onChange={(event) =>
                                setAgreements((previous) => ({
                                    ...previous,
                                    agreeService: event.target.checked,
                                }))
                            }
                        />
                        [필수] 이용약관에 동의합니다.
                    </label>

                    <label className="agreement-item">
                        <input
                            type="checkbox"
                            name="agreePrivacy"
                            checked={agreements.agreePrivacy}
                            onChange={(event) =>
                                setAgreements((previous) => ({
                                    ...previous,
                                    agreePrivacy: event.target.checked,
                                }))
                            }
                        />
                        [필수] 개인정보 처리방침에 동의합니다.
                    </label>
                </div>
                <FieldError message={state.errors?.agreement} />

                {/* 중복 이메일, DB 저장 실패 등 폼 전체 에러 */}
                {state.message && (
                    <p className="text-center text-sm text-red-500">
                        {state.message}
                    </p>
                )}

                <button
                    className="auth-button black-button"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? '가입 중...' : '회원가입'}
                </button>
            </form>

            <div className="login-guide">
                <span>이미 회원이신가요? </span>
                <Link href="/login">로그인하기</Link>
            </div>
        </div>
    );
}
