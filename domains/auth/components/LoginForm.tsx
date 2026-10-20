'use client';

import Link from 'next/link';
import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from 'react';

import { signIn } from '@/domains/auth/api/auth';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        setErrorMessage('');

        if (!email || !password) {
            setErrorMessage(
                '이메일과 비밀번호를 입력해주세요.',
            );
            return;
        }

        setIsLoading(true);

        const result = await signIn(
            email,
            password,
        );

        setIsLoading(false);

        if (!result.success) {
            setErrorMessage(
                result.message ?? '로그인에 실패했습니다.',
            );
            return;
        }

        window.location.href = '/';
    };

    return (
        <div className="auth-form">
            <form
                className="auth-form-content"
                onSubmit={onSubmit}
            >
                <input
                    className="auth-input"
                    type="email"
                    value={email}
                    onChange={(
                        event: ChangeEvent<HTMLInputElement>,
                    ) => setEmail(event.target.value)}
                    placeholder="이메일"
                    disabled={isLoading}
                />

                <input
                    className="auth-input"
                    type="password"
                    value={password}
                    onChange={(
                        event: ChangeEvent<HTMLInputElement>,
                    ) => setPassword(event.target.value)}
                    placeholder="비밀번호"
                    disabled={isLoading}
                />

                <button
                    className="auth-button black-button"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading
                        ? '로그인 중...'
                        : '로그인'}
                </button>

                {errorMessage && (
                    <p className="auth-error">
                        {errorMessage}
                    </p>
                )}
            </form>

            <Link
                className="auth-button email-button"
                href="/register"
            >
                이메일로 가입하기
            </Link>

            <div className="find-links">
                <Link href="/find-id">
                    아이디 찾기
                </Link>

                <span>|</span>

                <Link href="/find-password">
                    비밀번호 찾기
                </Link>
            </div>
        </div>
    );
}