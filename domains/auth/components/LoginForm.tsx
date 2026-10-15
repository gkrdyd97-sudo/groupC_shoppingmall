import Link from "next/link";

export default function LoginForm() {
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
          placeholder="이메일"
        />

        <input
          className="auth-input"
          type="password"
          placeholder="비밀번호"
        />

       

        <button
          className="auth-button black-button"
          type="button"
        >
          로그인
        </button>
      </form>

      

      <button
        className="auth-button kakao-button"
        type="button"
      >
        카카오로 시작하기
      </button>

      <button
        className="auth-button apple-button"
        type="button"
      >
        Apple로 시작하기
      </button>

      <Link
        className="auth-button email-button"
        href="/register"
      >
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