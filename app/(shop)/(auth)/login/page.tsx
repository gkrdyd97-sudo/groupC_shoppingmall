import LoginForm from "@/domains/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <section className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">로그인</h1>
        <LoginForm />
      </div>
    </section>
  );
}