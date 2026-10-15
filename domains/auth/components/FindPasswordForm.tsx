import Link from "next/link";

export default function FindPasswordForm() {
  return (
    <div className="auth-form">
      <p className="auth-description">
        가입한 이메일을 입력하면 비밀번호 재설정 안내를 받을 수 있어요.
      </p>

      <form className="auth-form-content">
        <input
          className="auth-input"
          type="email"
          placeholder="이메일"
        />

        <button
          className="auth-button black-button"
          type="button"
        >
          비밀번호 재설정 메일 받기
        </button>
      </form>

      <div className="auth-bottom-links">
        <Link href="/login">돌아가기</Link>
        <span>|</span>
        <Link href="/register">회원가입</Link>
      </div>
    </div>
  );
}