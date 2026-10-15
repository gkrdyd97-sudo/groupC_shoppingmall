import FindIdForm from "@/domains/auth/components/FindIdForm";

export default function FindIdPage() {
  return (
    <section className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">아이디 찾기</h1>
        <FindIdForm />
      </div>
    </section>
  );
}