// 관리자 전용 Server Action 에서 사용하는 권한 검사
// 관리자 화면(app/admin/layout.tsx)은 이미 일반 회원을 막지만,
// Server Action 은 화면을 거치지 않고 직접 호출될 수 있으므로 액션마다 다시 확인한다.
import { getCurrentUser } from '@/domains/users/queries/getCurrentUser.query';
import type { ActionState } from '@/shared/types/action.types';

// 관리자가 아니면 돌려줄 공통 실패 응답
// (data 가 없으므로 ActionState<never> → 어떤 액션의 반환 타입에도 넣을 수 있음)
export const NOT_ADMIN: ActionState<never> = {
    success: false,
    message: '관리자만 사용할 수 있는 기능입니다.',
};

// 관리자면 true
export async function isAdminUser(): Promise<boolean> {
    const user = await getCurrentUser();
    return user?.userType === 'ADMIN';
}
