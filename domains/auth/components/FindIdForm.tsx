import Link from "next/link";

export default function FindIdForm() {
  return (
    <div className="auth-form">
      <p className="auth-description">
        가입할 때 사용한 이메일을 입력해주세요.
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
          아이디 찾기
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