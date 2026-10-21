import { FiUser } from 'react-icons/fi';
import { getCurrentUser } from '@/domains/users/queries/getCurrentUser.query';
import Link from 'next/link';
import LogoutButton from '@/domains/users/components/LogoutButton';

export default async function AuthStatus() {
    const user = await getCurrentUser();

    return user ? (
        <>
            <Link
                href="/mypage"
                aria-label="마이페이지"
                className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-white transition-colors hover:bg-white/20 md:px-3 md:text-sm"
            >
                <FiUser className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{user.name} 님</span>
            </Link>
            <LogoutButton />
        </>
    ) : (
        <Link
            href="/login"
            aria-label="로그인"
            className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-white transition-colors hover:bg-white/20 md:px-3 md:text-sm"
        >
            <FiUser className="h-3.5 w-3.5" />
            <span className="hidden md:inline">로그인</span>
        </Link>
    );
}

// export default async function AuthStatus()  {
//     const user = await getCurrentUser();

//     if (user) {
//         return (
{
    /* <Link
    href="/mypage"
    aria-label="마이페이지"
    className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-white transition-colors hover:bg-white/20 md:px-3 md:text-sm"
>
    <FiUser className="h-3.5 w-3.5" />
    <span className="hidden md:inline">{user.id} 님</span>
</Link>; */
}
//         );
//     }

//     return (

//     );
// }
