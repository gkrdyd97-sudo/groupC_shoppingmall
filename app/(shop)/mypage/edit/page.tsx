// 회원정보 수정 페이지
import ProfileEditForm from '@/domains/auth/components/ProfileEditForm';
import { getCurrentUser } from '@/domains/users/queries/getCurrentUser.query';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

// 로그인 쿠키를 읽어 현재 프로필을 조회 → 요청마다 달라지므로 Suspense 안에서 렌더링
async function ProfileEditSection() {
    const user = await getCurrentUser();

    // /mypage 는 미들웨어가 막지만, 프로필 행이 없는 경우 등을 대비해 한 번 더 확인
    if (!user) {
        redirect('/login?redirectUrl=/mypage/edit');
    }

    return (
        <ProfileEditForm
            email={user.email ?? ''}
            initialValues={{
                name: user.name,
                phone: user.phone ?? '',
                gender: user.gender ?? '',
            }}
        />
    );
}

export default function ProfileEditPage() {
    return (
        <section className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">회원정보 수정</h1>
                <Suspense
                    fallback={
                        <p className="text-center text-sm text-gray-500">
                            회원정보를 불러오는 중입니다...
                        </p>
                    }
                >
                    <ProfileEditSection />
                </Suspense>
            </div>
        </section>
    );
}
