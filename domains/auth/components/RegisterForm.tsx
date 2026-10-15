import Link from "next/link";

export default function RegisterForm() {
  return (
    <div className="auth-form">
      <div className="auth-brand">RNDO</div>

      <p className="auth-description">
        RNDO 회원이 되어 다양한 혜택을 받아보세요.
      </p>

      <form className="auth-form-content">
        <input
          className="auth-input"
          type="email"
          placeholder="이메일"
        />

        <input
          className="auth-input"
          type="password"
          placeholder="비밀번호"
        />

        <input
          className="auth-input"
          type="password"
          placeholder="비밀번호 확인"
        />

        <input
          className="auth-input"
          type="text"
          placeholder="이름"
        />

        <div className="agreement-list">
          <label>
            <input type="checkbox" />
            <span>전체 약관에 동의합니다.</span>
          </label>

          <label>
            <input type="checkbox" />
            <span>이용약관에 동의합니다.</span>
          </label>

          <label>
            <input type="checkbox" />
            <span>개인정보 처리방침에 동의합니다.</span>
          </label>
        </div>

        <button
          className="auth-button black-button"
          type="button"
        >
          회원가입
        </button>
      </form>

      <div className="login-guide">
        이미 회원이신가요?{" "}
        <Link href="/login">로그인하기</Link>
      </div>
    </div>
  );
}