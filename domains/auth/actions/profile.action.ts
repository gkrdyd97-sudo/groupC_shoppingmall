'use server';
// 회원정보 수정 Server Action
// PROFILES(이름/휴대폰/성별) 수정 + 새 비밀번호 입력 시 Supabase Auth 비밀번호 변경
import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';
import type { ProfileInput, ProfileValues } from '../types/auth.types';
import { formatPhone, validateProfile } from '../utils/authValidation';

export async function updateProfileAction(
    _prevState: ActionState<ProfileValues>,
    formData: FormData,
): Promise<ActionState<ProfileValues>> {
    const input: ProfileInput = {
        name: String(formData.get('name') ?? '').trim(),
        phone: String(formData.get('phone') ?? '').trim(),
        gender: String(formData.get('gender') ?? ''),
        newPassword: String(formData.get('newPassword') ?? ''),
        newPasswordConfirm: String(formData.get('newPasswordConfirm') ?? ''),
    };
    const values: ProfileValues = {
        name: input.name,
        phone: input.phone,
        gender: input.gender,
    };

    // 1) 입력값 검사
    const errors = validateProfile(input);
    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: '입력 정보를 확인해주세요.',
            errors,
            data: values,
        };
    }

    // 2) 로그인 사용자 확인
    // 화면은 미들웨어가 막아주지만, Server Action 은 직접 호출될 수 있으므로 다시 확인
    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: '로그인이 필요한 서비스입니다.' };
    }

    // 3) 프로필 수정 - 반드시 본인(id = user.id) 행만 수정
    // RLS 정책에 막히면 에러 없이 0건이 수정되므로 select 로 실제 반영 행을 확인
    const { data: updated, error: profileError } = await supabase
        .from('PROFILES')
        .update({
            name: input.name,
            phone: formatPhone(input.phone),
            gender: input.gender,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select('id');

    if (profileError || !updated?.length) {
        return {
            success: false,
            message: `회원정보 수정에 실패했습니다. ${profileError?.message ?? '(DB 수정 권한 확인 필요)'}`,
            data: values,
        };
    }

    // 4) 새 비밀번호를 입력한 경우에만 비밀번호 변경
    if (input.newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
            password: input.newPassword,
        });
        if (passwordError) {
            const isSamePassword = passwordError.code === 'same_password';
            return {
                success: false,
                message: isSamePassword
                    ? '기존 비밀번호와 다른 비밀번호를 입력해주세요.'
                    : `비밀번호 변경에 실패했습니다: ${passwordError.message}`,
                errors: isSamePassword
                    ? { newPassword: '기존 비밀번호와 동일합니다.' }
                    : undefined,
                data: values,
            };
        }
    }

    // 5) 헤더의 "OOO 님" 이름 표시까지 갱신되도록 레이아웃 전체 재검증
    revalidatePath('/', 'layout');

    return {
        success: true,
        message: '회원정보가 수정되었습니다.',
        data: { ...values, phone: formatPhone(input.phone) },
    };
}
