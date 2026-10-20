'use client';

import Link from 'next/link';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { FaCheckSquare, FaRegCheckSquare } from 'react-icons/fa';

import { signUp } from '@/domains/auth/api/auth';
import type { RegisterFormType } from '@/domains/auth/types/auth.types';

export default function RegisterForm() {
    const [form, setForm] = useState<RegisterFormType>({
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
        agreeAll: false,
        agreeService: false,
        agreePrivacy: false,
    });

    const [errorMessage, setErrorMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const onToggle = (name: 'agreeService' | 'agreePrivacy') => {
        setForm((previous) => {
            const nextService =
                name === 'agreeService'
                    ? !previous.agreeService
                    : previous.agreeService;

            const nextPrivacy =
                name === 'agreePrivacy'
                    ? !previous.agreePrivacy
                    : previous.agreePrivacy;

            return {
                ...previous,
                [name]: !previous[name],
                agreeAll: nextService && nextPrivacy,
            };
        });
    };

    const onToggleAll = () => {
        const nextValue = !form.agreeAll;

        setForm((previous) => ({
            ...previous,
            agreeAll: nextValue,
            agreeService: nextValue,
            agreePrivacy: nextValue,
        }));
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrorMessage('');

        if (!form.email || !form.password) {
            setErrorMessage('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        if (form.password !== form.passwordConfirm) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!form.name) {
            setErrorMessage('이름을 입력해주세요.');
            return;
        }

        if (!form.agreeService || !form.agreePrivacy) {
            setErrorMessage('필수 약관에 동의해주세요.');
            return;
        }

        setIsLoading(true);

        const result = await signUp({
            email: form.email,
            password: form.password,
            name: form.name,
            privateAgreement: form.agreePrivacy,
            tradeAgreement: form.agreeService,
        });

        setIsLoading(false);

        if (!result.success) {
            setErrorMessage(result.message ?? '회원가입에 실패했습니다.');
            return;
        }

        alert(result.message ?? '회원가입이 완료되었습니다.');

        window.location.href = '/login';
    };

    return (
        <div className="auth-form">
            <p className="auth-description">
                RNDO 회원이 되어 다양한 혜택을 받아보세요.
            </p>

            <form className="auth-form-content" onSubmit={onSubmit}>
                <input
                    className="auth-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="이메일"
                    disabled={isLoading}
                />

                <input
                    className="auth-input"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="비밀번호"
                    disabled={isLoading}
                />

                <input
                    className="auth-input"
                    type="password"
                    name="passwordConfirm"
                    value={form.passwordConfirm}
                    onChange={onChange}
                    placeholder="비밀번호 확인"
                    disabled={isLoading}
                />

                <input
                    className="auth-input"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="이름"
                    disabled={isLoading}
                />

                <div className="agreement-list">
                    <button
                        className="agreement-item"
                        type="button"
                        onClick={onToggleAll}
                        aria-pressed={form.agreeAll}
                    >
                        {form.agreeAll ? (
                            <FaCheckSquare />
                        ) : (
                            <FaRegCheckSquare />
                        )}

                        <span>전체 약관에 동의합니다.</span>
                    </button>

                    <button
                        className="agreement-item"
                        type="button"
                        onClick={() => onToggle('agreeService')}
                        aria-pressed={form.agreeService}
                    >
                        {form.agreeService ? (
                            <FaCheckSquare />
                        ) : (
                            <FaRegCheckSquare />
                        )}

                        <span>이용약관에 동의합니다.</span>
                    </button>

                    <button
                        className="agreement-item"
                        type="button"
                        onClick={() => onToggle('agreePrivacy')}
                        aria-pressed={form.agreePrivacy}
                    >
                        {form.agreePrivacy ? (
                            <FaCheckSquare />
                        ) : (
                            <FaRegCheckSquare />
                        )}

                        <span>개인정보 처리방침에 동의합니다.</span>
                    </button>
                </div>

                <button
                    className="auth-button black-button"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? '가입 중...' : '회원가입'}
                </button>

                {errorMessage && <p className="auth-error">{errorMessage}</p>}
            </form>

            <div className="login-guide">
                이미 회원이신가요? <Link href="/login">로그인하기</Link>
            </div>
        </div>
    );
}
