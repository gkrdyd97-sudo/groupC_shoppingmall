'use client';
// 관리자 목록에서 쓰는 공용 버튼 (삭제, 노출 전환 등)
// 서버 컴포넌트에서 action={deleteXxxAction.bind(null, id)} 처럼 인자를 채워서 넘긴다.
// - confirmMessage 가 있으면 한 번 확인 후 실행
// - 실패하면 서버가 돌려준 message 를 alert 로 표시
import { useTransition } from 'react';
import type { ActionState } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';

interface ConfirmActionButtonProps {
    action: () => Promise<ActionState>;
    label: string;
    pendingLabel?: string;
    confirmMessage?: string;
    variant?: 'default' | 'danger';
}

export default function ConfirmActionButton({
    action,
    label,
    pendingLabel = '처리 중...',
    confirmMessage,
    variant = 'default',
}: ConfirmActionButtonProps) {
    const [isPending, startTransition] = useTransition();

    const onClick = () => {
        if (confirmMessage && !confirm(confirmMessage)) return;

        startTransition(async () => {
            const result = await action();
            if (!result.success) {
                alert(result.message ?? '처리에 실패했습니다.');
            }
            // 성공 시 화면 갱신은 서버 액션의 revalidatePath 가 처리
        });
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isPending}
            className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-semibold whitespace-nowrap disabled:opacity-50',
                variant === 'danger'
                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50',
            )}
        >
            {isPending ? pendingLabel : label}
        </button>
    );
}
