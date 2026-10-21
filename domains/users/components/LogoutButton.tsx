'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/shared/components/ui/button';
import { logoutAction } from '../actions/logout.action';

export default function LogoutButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const onClick = async () => {
        startTransition(async () => {
            const result = await logoutAction();
            if (result.success) {
                router.push('/');
                router.refresh();
            } else {
                // 로그아웃 처리 실패
                alert(result.message ?? '로그아웃 처리 실패');
            }
        });
    };

    return (
        <Button variant="outline" disabled={isPending} onClick={onClick}>
            로그아웃
        </Button>
    );
}
