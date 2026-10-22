'use server';
// 로그인 Server Action
// 가이드 3일차의 클라이언트 더미 loginAction 을 동일한 시그니처
// (prevState, formData) => ActionState 로 교체한 버전 (6일차)
import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
    getLoginRedirectPath,
    getSafeRedirectPath,
    validateLogin,
} from '../utils/authValidation';

export async function loginAction(
    _prevState: ActionState<{ email: string }>,
    formData: FormData,
): Promise<ActionState<{ email: string }>> {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    // 미들웨어가 비로그인 사용자를 /login?redirectUrl=/mypage 처럼 보내므로
    // 로그인 성공 후 원래 가려던 페이지로 돌려보낸다
    const redirectPath = getSafeRedirectPath(
        formData.get('redirectUrl') as string | null,
    );

    // 1) 입력값 형식 검사 → 실패 시 필드별 에러와 입력했던 이메일을 돌려줌
    const errors = validateLogin({ email, password });
    if (Object.keys(errors).length > 0) {
        return { success: false, errors, data: { email } };
    }

    // 2) Supabase Auth 로그인 (서버 클라이언트라 세션이 쿠키에 저장됨)
    const supabase = createServerClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !user) {
        // 계정 존재 여부를 노출하지 않도록 같은 문구로 안내
        return {
            success: false,
            message: '이메일 또는 비밀번호를 확인해주세요.',
            data: { email },
        };
    }

    // 3) 회원 유형 조회 → 관리자(ADMIN)면 관리자 페이지로 보내기 위함
    const { data: profile } = await supabase
        .from('PROFILES')
        .select('user_type')
        .eq('id', user.id)
        .maybeSingle();

    // 4) 헤더의 로그인 상태(AuthStatus)가 바로 바뀌도록 전체 레이아웃 갱신 후 이동
    // redirect 는 내부적으로 예외를 던지므로 try/catch 밖에서 호출해야 함
    revalidatePath('/', 'layout');
    redirect(getLoginRedirectPath(profile?.user_type, redirectPath));
}
