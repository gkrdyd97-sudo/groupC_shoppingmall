// 게시글 도메인 타입 (Supabase POSTS 테이블 기준)

// 이 프로젝트에서 운영하는 게시판 (BOARD.id 값과 동일)
export type BoardId = 'notice' | 'qna';

// 목록 검색 대상 컬럼
export type PostSearchField = 'title' | 'content';

// POSTS 테이블 한 행 + 작성자 이름(PROFILES.name 조인 결과)
export interface Post {
    id: number;
    boardId: BoardId;
    userId: string;
    title: string;
    content: string;
    category: string | null; // Q&A 문의 유형 (공지사항은 null)
    gid: string | null; // 첨부파일 그룹 ID (FILE_INFO.gid) - 파일 업로드 연동 시 사용
    authorName: string;
    createdAt: string;
    updatedAt: string | null;
}

// 글 작성/수정 폼 입력값
export interface PostInput {
    title: string;
    content: string;
    category: string;
}
