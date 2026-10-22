import LoginForm from '@/domains/auth/components/LoginForm';
import { Suspense } from 'react';

type SearchParams = Promise<{ redirectUrl?: string }>;

// ?redirectUrl= 은 요청마다 달라지는 값이라 Suspense 안에서 읽는다 (cacheComponents 규칙)
async function LoginFormWithRedirect({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { redirectUrl } = await searchParams;
    return <LoginForm redirectUrl={redirectUrl} />;
}

export default function LoginPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    return (
        <section className="auth-page">
            <div className="auth-container">
                <div className="auth-brand">RNDO</div>
                <h1 className="auth-title">로그인</h1>

                {/* 로딩 중에도 폼이 바로 보이도록 fallback 에 기본 폼을 둠 */}
                <Suspense fallback={<LoginForm />}>
                    <LoginFormWithRedirect searchParams={searchParams} />
                </Suspense>
            </div>
        </section>
    );
}
