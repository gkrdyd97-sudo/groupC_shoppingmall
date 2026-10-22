// 게시판 권한 판단 (화면의 버튼 노출 + 서버 액션의 실제 권한 검사에서 공용 사용)
import { BOARD_INFO } from '../constants/board.constants';
import type { BoardId } from '../types/post.types';

// 권한 판단에 필요한 최소한의 로그인 사용자 정보 (비로그인이면 null)
export interface Viewer {
    id: string;
    userType: string; // PROFILES.user_type: 'USER' | 'ADMIN'
}

export function isAdmin(viewer: Viewer | null): boolean {
    return viewer?.userType === 'ADMIN';
}

// 글쓰기 권한: 공지사항은 관리자만, Q&A 는 로그인 회원 모두
export function canWritePost(boardId: BoardId, viewer: Viewer | null): boolean {
    if (!viewer) return false;
    if (BOARD_INFO[boardId].writeRole === 'admin') return isAdmin(viewer);
    return true;
}

// 수정·삭제 권한: 작성자 본인 또는 관리자
export function canManagePost(
    post: { userId: string },
    viewer: Viewer | null,
): boolean {
    if (!viewer) return false;
    return post.userId === viewer.id || isAdmin(viewer);
}
