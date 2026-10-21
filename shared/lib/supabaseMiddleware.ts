import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { forbidden } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value),
                );
                supabaseResponse = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options),
                );
            },
        },
    });

    // 현재 로그인 세션 유저 검증
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // 이미 로그인한 사용자가 /sign_in 또는 /sign_up 접근 시 메인 홈으로 리다이렉트
    if (
        user &&
        (pathname.startsWith('/login') || pathname.startsWith('/register'))
    ) {
        const homeUrl = request.nextUrl.clone();
        homeUrl.pathname = '/';
        homeUrl.search = '';
        return NextResponse.redirect(homeUrl);
    }

    // 비회원이 메인 또는 /todo로 시작하는 페이지에 접속할 경우 /sign_in?redirectUrl=...으로 리다이렉트
    const userOnlyPath = ['/mypage', '/cart', '/order', '/boards'];

    const isProtectedPath = userOnlyPath.some((path) =>
        pathname.startsWith(path),
    );

    if (!user && isProtectedPath) {
        const signInUrl = request.nextUrl.clone();
        signInUrl.pathname = '/login';
        signInUrl.searchParams.set('redirectUrl', pathname);
        return NextResponse.redirect(signInUrl);
    }

    // 관리자 페이지 접근 제한
    if (pathname.startsWith('/admin')) {
        let isAllowed: boolean = false;
        if (user) {
            const { data, error } = await supabase
                .from('PROFILES')
                .select('user_type')
                .eq('id', user.id)
                .maybeSingle();
            isAllowed = Boolean(!error && data && data.user_type === 'ADMIN');
        }

        if (!isAllowed) {
            await supabase.auth.signOut();
            const adminUrl = request.nextUrl.clone();
            adminUrl.pathname = '/login';
            adminUrl.searchParams.set('redirectUrl', pathname);
            return NextResponse.redirect(adminUrl);
        }
    }

    return supabaseResponse;
}
