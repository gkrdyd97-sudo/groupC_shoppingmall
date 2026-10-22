'use server';
// 회원가입 Server Action
// Supabase Auth 계정 생성 → PROFILES 테이블에 회원 프로필 저장
import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { RegisterInput, RegisterValues } from '../types/auth.types';
import { formatPhone, validateRegister } from '../utils/authValidation';

export async function registerAction(
    _prevState: ActionState<RegisterValues>,
    formData: FormData,
): Promise<ActionState<RegisterValues>> {
    const input: RegisterInput = {
        email: String(formData.get('email') ?? '').trim(),
        password: String(formData.get('password') ?? ''),
        passwordConfirm: String(formData.get('passwordConfirm') ?? ''),
        name: String(formData.get('name') ?? '').trim(),
        phone: String(formData.get('phone') ?? '').trim(),
        gender: String(formData.get('gender') ?? ''),
        // 체크박스는 체크된 경우에만 FormData 에 'on' 값으로 들어옴
        agreeService: formData.get('agreeService') === 'on',
        agreePrivacy: formData.get('agreePrivacy') === 'on',
    };

    // 검증 실패 시 폼에 다시 채워줄 값 (비밀번호 제외)
    const values: RegisterValues = {
        email: input.email,
        name: input.name,
        phone: input.phone,
        gender: input.gender,
        agreeService: input.agreeService,
        agreePrivacy: input.agreePrivacy,
    };

    // 1) 입력값 검사
    const errors = validateRegister(input);
    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: '입력 정보를 확인해주세요.',
            errors,
            data: values,
        };
    }

    const supabase = createServerClient();

    // 2) Supabase Auth 계정 생성
    // options.data 에 넣은 값은 auth.users.raw_user_meta_data 에도 저장되어
    // 추후 DB 트리거로 프로필을 만드는 방식으로 바꿀 때도 활용할 수 있다
    const {
        data: { user, session },
        error: signUpError,
    } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
            data: { name: input.name },
        },
    });

    if (signUpError) {
        const isDuplicated = signUpError.code === 'user_already_exists';
        return {
            success: false,
            message: isDuplicated
                ? '이미 가입된 이메일입니다.'
                : `회원가입에 실패했습니다: ${signUpError.message}`,
            errors: isDuplicated
                ? { email: '이미 가입된 이메일입니다.' }
                : undefined,
            data: values,
        };
    }

    // 이메일 인증을 켜둔 프로젝트에서는 이미 가입된 이메일이어도 에러 대신
    // identities 가 빈 user 를 돌려준다 (가입 여부 노출 방지 정책)
    if (!user || user.identities?.length === 0) {
        return {
            success: false,
            message: '이미 가입된 이메일입니다.',
            errors: { email: '이미 가입된 이메일입니다.' },
            data: values,
        };
    }

    // 3) PROFILES 테이블에 회원 정보 저장 (id 는 auth.users.id 와 동일)
    const { error: profileError } = await supabase.from('PROFILES').insert({
        id: user.id,
        user_type: 'USER',
        name: input.name,
        phone: formatPhone(input.phone),
        gender: input.gender,
        private_agree: input.agreePrivacy,
        trade_agree: input.agreeService,
    });

    if (profileError) {
        return {
            success: false,
            message: `회원 정보 저장에 실패했습니다: ${profileError.message}`,
            data: values,
        };
    }

    // 4-a) 이메일 인증이 꺼져 있으면 가입과 동시에 로그인 세션이 생김 → 홈으로 이동
    if (session) {
        revalidatePath('/', 'layout');
        redirect('/');
    }

    // 4-b) 이메일 인증이 켜져 있으면 세션이 없음 → 메일 확인 안내
    return {
        success: true,
        message:
            '가입하신 이메일로 인증 메일을 보냈습니다. 인증 후 로그인해주세요.',
    };
}
