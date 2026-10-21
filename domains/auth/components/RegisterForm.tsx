'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';

import { signUp } from '@/domains/auth/api/auth';
import type { RegisterFormType } from '@/domains/auth/types/auth.types';

export default function RegisterForm() {
    const router = useRouter();

    const [form, setForm] = useState<RegisterFormType>({
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
        phone: '',
        gender: '',

        agreeAll: false,
        agreeService: false,
        agreePrivacy: false,
    });

    const [errorMessage, setErrorMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const onChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = event.target;

        const checked =
            event.target instanceof HTMLInputElement
                ? event.target.checked
                : false;

        setForm((previous) => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const onAgreeAllChange = (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;

        setForm((previous) => ({
            ...previous,
            agreeAll: checked,
            agreeService: checked,
            agreePrivacy: checked,
        }));
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrorMessage('');

        if (form.password !== form.passwordConfirm) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!form.agreeService || !form.agreePrivacy) {
            setErrorMessage('약관 동의를 진행해주세요.');
            return;
        }

        if (!form.name.trim()) {
            setErrorMessage('이름을 입력해주세요.');
            return;
        }

        if (!form.phone.trim()) {
            setErrorMessage('전화번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);

        const result = await signUp({
            email: form.email,
            password: form.password,
            name: form.name,
            phone: form.phone,
            gender: form.gender,
            privateAgreement: form.agreePrivacy,
            tradeAgreement: form.agreeService,
        });

        setIsLoading(false);

        if (!result.success) {
            setErrorMessage(result.message ?? '회원가입에 실패했습니다.');
            return;
        }

        alert(result.message);

        router.push('/login');
    };

    return (
        <div className="auth-form">
            <form className="auth-form-content" onSubmit={onSubmit}>
                <input
                    className="auth-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="이메일"
                    required
                />

                <input
                    className="auth-input"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="비밀번호"
                    required
                />

                <input
                    className="auth-input"
                    type="password"
                    name="passwordConfirm"
                    value={form.passwordConfirm}
                    onChange={onChange}
                    placeholder="비밀번호 확인"
                    required
                />

                <input
                    className="auth-input"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="이름"
                    required
                />

                <input
                    className="auth-input"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="전화번호"
                    required
                />

                <select
                    className="auth-input"
                    name="gender"
                    value={form.gender}
                    onChange={onChange}
                >
                    <option value="">성별 선택</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    <option value="OTHER">기타</option>
                </select>

                <label>
                    <input
                        type="checkbox"
                        name="agreeAll"
                        checked={form.agreeAll}
                        onChange={onAgreeAllChange}
                    />
                    전체 약관에 동의합니다.
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="agreeService"
                        checked={form.agreeService}
                        onChange={onChange}
                    />
                    이용약관에 동의합니다.
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="agreePrivacy"
                        checked={form.agreePrivacy}
                        onChange={onChange}
                    />
                    개인정보 처리방침에 동의합니다.
                </label>

                {errorMessage && <p className="auth-error">{errorMessage}</p>}

                <button
                    className="auth-button black-button"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? '가입 중...' : '회원가입'}
                </button>
            </form>

            <div className="register-login-link">
                <span>이미 회원이신가요?</span>
                <Link href="/login">로그인하기</Link>
            </div>
        </div>
    );
}
