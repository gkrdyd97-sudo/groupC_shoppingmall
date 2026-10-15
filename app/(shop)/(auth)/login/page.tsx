'use client';

import { ChangeEvent, useState } from 'react';
import LoginForm from '@/domains/auth/components/LoginForm';

export interface LoginFormType {
    email?: string;
    password?: string;
    autoLogin?: boolean;
}

const initialForm: LoginFormType = {
    email: '',
    password: '',
    autoLogin: false,
};

export default function LoginPage() {
    const [form, setForm] = useState(initialForm);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const el = e.target;
        setForm({ ...form, [el.name]: el.value });
    };

    const onToggle = () => {
      setForm({...form, autoLogin: !form.autoLogin})
    };
    return (
        <section className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">로그인</h1>
                <LoginForm form={form} onChange={onChange} onToggle={onToggle} />
            </div>
        </section>
    );
}
