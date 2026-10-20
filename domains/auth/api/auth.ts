import { supabase } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';

type SignUpInput = {
    email: string;
    password: string;
    name: string;
    privateAgreement: boolean;
    tradeAgreement: boolean;
};

export async function signIn(
    email: string,
    password: string,
): Promise<ActionState> {
    const { error } =
        await supabase.auth.signInWithPassword({
            email,
            password,
        });

    if (error) {
        return {
            success: false,
            message:
                '이메일 또는 비밀번호가 올바르지 않습니다.',
        };
    }

    return {
        success: true,
        message: '로그인되었습니다.',
    };
}

export async function signUp({
    email,
    password,
    name,
    privateAgreement,
    tradeAgreement,
}: SignUpInput): Promise<ActionState> {
    const { error } =
        await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    private_agreement: privateAgreement,
                    trade_agreement: tradeAgreement,
                },
            },
        });

    if (error) {
        return {
            success: false,
            message: error.message,
        };
    }

    return {
        success: true,
        message:
            '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
    };
}

export async function signOut(): Promise<ActionState> {
    const { error } =
        await supabase.auth.signOut();

    if (error) {
        return {
            success: false,
            message: '로그아웃에 실패했습니다.',
        };
    }

    return {
        success: true,
        message: '로그아웃되었습니다.',
    };
}