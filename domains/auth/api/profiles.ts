import { supabase } from '@/shared/lib/supabase';

export async function getCurrentUser() {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        throw new Error(error.message);
    }

    return user;
}

export async function getMyProfile() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('로그인이 필요합니다.');
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function updateMyProfile(input: {
    name: string;
    phone: string;
    gender: string;
}) {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('로그인이 필요합니다.');
    }

    const { data, error } = await supabase
        .from('profiles')
        .update({
            name: input.name,
            phone: input.phone,
            gender: input.gender,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
