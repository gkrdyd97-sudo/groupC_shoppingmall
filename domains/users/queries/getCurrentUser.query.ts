'use server';
import { createServerClient } from '@/shared/lib/supabase';
import { type UserProfile } from '../types/auth.types';
import { cache } from 'react';

type UserType = UserProfile | null;
export const getCurrentUser = cache(async (): Promise<UserType> => {
    const supabase = createServerClient();

    const {
        data: { user: authUser },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
        return null;
    }

    const { data: profile } = await supabase
        .from('PROFILES')
        .select('*')
        .eq('id', authUser.id)
        .is('deleted_at', null)
        .maybeSingle();

    if (!profile) {
        return null;
    }

    return {
        id: profile.id,
        name: profile.name,
        email: authUser.email,
        userType: profile.user_type ?? 'USER',
        phone: profile.phone,
        gender: profile.gender ?? undefined, // 회원정보 수정 폼 초기값용
        privateAgree: profile.private_agree,
        tradeAgree: profile.trade_agree,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at ?? undefined,
        deletedAt: profile.deleted_at ?? undefined,
    };
});
