import { supabase } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';

type SignUpInput = {
    email: string;
    password: string;
    name: string;
    phone: string;
    gender: string;
    privateAgreement: boolean;
    tradeAgreement: boolean;
};

export async function signUp(input: SignUpInput): Promise<ActionState> {
    const {
        data: { user: authUser },
        error,
    } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,

        // options: {
        //   data: {
        //     name: input.name,
        //     phone: input.phone,
        //     gender: input.gender,
        //     private_agreement: input.privateAgreement,
        //     trade_agreement: input.tradeAgreement,
        //     user_type: 'USER',
        //   },
        // },
    });

    if (!authUser || error) {
        return {
            success: false,
            message: error ? error.message : '회원가입에 실패했습니다.',
        };
    }

    const userId = authUser?.id;

    const { error: profileError } = await supabase.from('PROFILES').insert({
        id: userId,
        user_type: 'USER',
        name: input.name,
        phone: input.phone,
        gender: input.gender,
        private_agree: input.privateAgreement,
        trade_agree: input.tradeAgreement,
    });

    if (profileError) {
        return {
            success: false,
            message: profileError
                ? profileError.message
                : '회원가입에 실패했습니다.',
        };
    }

    return {
        success: true,
        message: '회원가입이 완료되었습니다. 이메일 인증이 필요할 수 있습니다.',
    };
}

type SignInInput = {
    email: string;
    password: string;
};

export async function signIn(input: SignInInput): Promise<ActionState> {
    const { error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
    });

    if (error) {
        return {
            success: false,
            message: '이메일 또는 비밀번호를 확인해주세요.',
        };
    }

    return {
        success: true,
        message: '로그인되었습니다.',
    };
}
