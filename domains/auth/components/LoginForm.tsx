import Link from 'next/link';
import { LoginFormType } from '@/app/(shop)/(auth)/login/page';
import { FaRegCheckSquare, FaCheckSquare } from 'react-icons/fa';
import { ChangeEvent } from 'react';

interface LoginFormProps {
    form: LoginFormType;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onToggle: () => void;
}

export default function LoginForm({
    form,
    onChange,
    onToggle,
}: LoginFormProps) {
    return (
        <div className="auth-form">
            <div className="auth-brand">RNDO</div>

            <p className="auth-description">
                로그인하고 더 편리하게 쇼핑해보세요.
            </p>

            <form className="auth-form-content">
                <input
                    className="auth-input"
                    type="email"
                    name="email"
                    value={form.email}
                    placeholder="이메일"
                    onChange={onChange}
                />

                <input
                    className="auth-input"
                    type="password"
                    name="password"
                    value={form.password}
                    placeholder="비밀번호"
                    onChange={onChange}
                />

                <label className="auto-login" onClick={onToggle}>
                    {form.autoLogin ? <FaCheckSquare /> : <FaRegCheckSquare />}
                    <span>자동 로그인</span>
                </label>

                <button className="auth-button black-button" type="button">
                    로그인
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
