'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import { signIn } from '@/domains/auth/api/auth';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrorMessage('');
        setIsLoading(true);

        const result = await signIn({
            email,
            password,
        });

        setIsLoading(false);

        if (!result.success) {
            setErrorMessage(result.message ?? '로그인에 실패했습니다.');
            return;
        }

        window.location.href = '/';
    };

    return (
        <div className="auth-form">
            <form className="auth-form-content" onSubmit={onSubmit}>
                <input
                    className="auth-input"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="이메일"
                    required
                />

                <input
                    className="auth-input"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="비밀번호"
                    required
                />

                {errorMessage && <p className="auth-error">{errorMessage}</p>}

                <button
                    className="auth-button black-button"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? '로그인 중...' : '로그인'}
                </button>
            </form>

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
