import RegisterForm from '@/domains/auth/components/RegisterForm';

export default function RegisterPage() {
    return (
        <section className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">회원가입</h1>
                <RegisterForm />
            </div>
        </section>
    );
}