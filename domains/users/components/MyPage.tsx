'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser, FiPackage, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '@/shared/store/useAuthStore';

export default function MyPage() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    function handleLogout() {
        logout();
        router.push('/');
    }

    if (!user) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-20 text-center">
                <p className="mb-4 text-gray-600">
                    로그인이 필요한 페이지입니다.
                </p>
                <Link
                    href="/login"
                    className="inline-block rounded-sm bg-black px-6 py-2 text-white"
                >
                    로그인하러 가기
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto mb-20 max-w-7xl px-4 pb-4">
            <h1 className="my-4 border-b pb-4 text-2xl md:text-4xl">
                마이페이지
            </h1>

            <section className="mb-8 flex items-center gap-4 rounded-lg border p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                    <FiUser className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                    <p className="text-lg font-bold">{user.id} 님</p>
                    <p className="text-sm text-gray-500">RNDO 회원</p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                    <FiPackage /> 주문 내역
                </h2>
                <div className="rounded-lg border py-12 text-center text-gray-500">
                    주문 내역이 없습니다.
                </div>
            </section>

            <button
                type="button"
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-500 hover:text-black"
            >
                <FiLogOut /> 로그아웃
            </button>
        </div>
    );
}
