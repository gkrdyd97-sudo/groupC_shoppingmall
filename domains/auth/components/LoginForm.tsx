'use client';
// 로그인 폼
// - useActionState 로 Server Action(loginAction) 과 연결
// - noValidate 로 브라우저 기본 말풍선을 끄고, 서버 검증 결과(state.errors)를 인라인으로 표시
import Link from 'next/link';
import { useActionState } from 'react';
import type { ActionState } from '@/shared/types/action.types';
import { loginAction } from '../actions/login.action';
import FieldError from './FieldError';

const INITIAL_STATE: ActionState<{ email: string }> = { success: false };

interface LoginFormProps {
    // 미들웨어가 붙여준 로그인 후 이동 경로 (예: /mypage)
    redirectUrl?: string;
}

export default function LoginForm({ redirectUrl }: LoginFormProps) {
    // state: 서버 액션이 돌려준 결과, formAction: <form action> 에 넣을 함수
    // isPending: 서버 액션 처리 중 여부 (버튼 비활성화에 사용)
    const [state, formAction, isPending] = useActionState(
        loginAction,
        INITIAL_STATE,
    );

    return (
        <div className="auth-form">
            <form action={formAction} noValidate className="auth-form-content">
                {/* 로그인 성공 후 돌아갈 경로를 서버 액션에 함께 전달 */}
                <input
                    type="hidden"
                    name="redirectUrl"
                    value={redirectUrl ?? ''}
                />

                {/* 검증 실패 후에도 입력했던 이메일이 남도록 defaultValue 로 복원 */}
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

                <input
                    className="auth-input"
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    autoComplete="current-password"
                    aria-invalid={Boolean(state.errors?.password)}
                />
                <FieldError message={state.errors?.password} />

                {/* 아이디/비밀번호 불일치 등 폼 전체 에러 */}
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
                    {isPending ? '로그인 중...' : '로그인'}
                </button>
            </form>

            {/* 소셜 로그인은 아직 미구현 (UI 자리만 유지) */}
            <button className="auth-button kakao-button" type="button">
                카카오로 시작하기
            </button>

            <button className="auth-button apple-button" type="button">
                Apple로 시작하기
            </button>

            <Link className="auth-button email-button" href="/register">
                이메일로 가입하기
            </Link>

            <div className="find-links">
                <Link href="/find-id">아이디 찾기</Link>
                <span>|</span>
                <Link href="/find-password">비밀번호 찾기</Link>
            </div>
        </div>
    );
}
