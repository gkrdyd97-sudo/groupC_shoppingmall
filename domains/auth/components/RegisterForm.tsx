'use client';

import Link from 'next/link';
import { useState, type ChangeEvent } from 'react';
import {
    FaCheckSquare,
    FaRegCheckSquare,
} from 'react-icons/fa';

import type {
    RegisterFormType,
} from '@/domains/auth/types/auth.types';

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

    const onChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const onToggle = (
        name:
            | 'agreeAll'
            | 'agreeService'
            | 'agreePrivacy'
    ) => {
        setForm((previous) => ({
            ...previous,
            [name]: !previous[name],
        }));
    };

    return (
        <div className="auth-form">
            <div className="auth-brand">
                RNDO
            </div>

            <p className="auth-description">
                RNDO 회원이 되어 다양한 혜택을 받아보세요.
            </p>

            <form className="auth-form-content">
                <input
                    className="auth-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="이메일"
                />

                <input
                    className="auth-input"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="비밀번호"
                />

                <input
                    className="auth-input"
                    type="password"
                    name="passwordConfirm"
                    value={form.passwordConfirm}
                    onChange={onChange}
                    placeholder="비밀번호 확인"
                />

                <input
                    className="auth-input"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="이름"
                />

                <div className="agreement-list">
                    <button
                        className="agreement-item"
                        type="button"
                        onClick={() =>
                            onToggle('agreeAll')
                        }
                        aria-pressed={form.agreeAll}
                    >
                        {form.agreeAll ? (
                            <FaCheckSquare />
                        ) : (
                            <FaRegCheckSquare />
                        )}

                        <span>
                            전체 약관에 동의합니다.
                        </span>
                    </button>

                    <button
                        className="agreement-item"
                        type="button"
                        onClick={() =>
                            onToggle('agreeService')
                        }
                        aria-pressed={form.agreeService}
                    >
                        {form.agreeService ? (
                            <FaCheckSquare />
                        ) : (
                            <FaRegCheckSquare />
                        )}

                        <span>
                            이용약관에 동의합니다.
                        </span>
                    </button>

                    <button
                        className="agreement-item"
                        type="button"
                        onClick={() =>
                            onToggle('agreePrivacy')
                        }
                        aria-pressed={form.agreePrivacy}
                    >
                        {form.agreePrivacy ? (
                            <FaCheckSquare />
                        ) : (
                            <FaRegCheckSquare />
                        )}

                        <span>
                            개인정보 처리방침에 동의합니다.
                        </span>
                    </button>
                </div>

                <button
                    className="auth-button black-button"
                    type="button"
                >
                    회원가입
                </button>
            </form>

            <div className="login-guide">
                이미 회원이신가요?{' '}
                <Link href="/login">
                    로그인하기
                </Link>
            </div>
        </div>
    );
}