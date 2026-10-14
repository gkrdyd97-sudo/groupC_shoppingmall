import FindPasswordForm from "@/domains/auth/components/FindPasswordForm";

export default function FindPasswordPage() {
  return (
    <section className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">비밀번호 찾기</h1>
        <FindPasswordForm />
      </div>
    </section>
  );
}