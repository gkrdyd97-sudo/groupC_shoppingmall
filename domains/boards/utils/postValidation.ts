// 게시판 관련 순수 함수 모음 (node:test 로 단위 테스트)
import { BOARD_INFO, QNA_CATEGORIES } from '../constants/board.constants';
import type { BoardId, PostInput } from '../types/post.types';

export const TITLE_MAX_LENGTH = 100;
export const CONTENT_MAX_LENGTH = 5000;

// URL 의 [boardId] 가 우리가 운영하는 게시판인지 확인 (타입 가드)
export function isBoardId(value: string): value is BoardId {
    return Object.keys(BOARD_INFO).includes(value);
}

// 게시글 작성/수정 입력값 검사
export function validatePost(
    boardId: BoardId,
    input: PostInput,
): Record<string, string> {
    const errors: Record<string, string> = {};
    const title = input.title.trim();
    const content = input.content.trim();

    if (title.length < 2) {
        errors.title = '제목은 2자 이상 입력해주세요.';
    } else if (title.length > TITLE_MAX_LENGTH) {
        errors.title = `제목은 ${TITLE_MAX_LENGTH}자 이하로 입력해주세요.`;
    }

    if (content.length < 10) {
        errors.content = '내용은 10자 이상 입력해주세요.';
    } else if (content.length > CONTENT_MAX_LENGTH) {
        errors.content = `내용은 ${CONTENT_MAX_LENGTH}자 이하로 입력해주세요.`;
    }

    // Q&A 는 문의 유형 필수
    if (boardId === 'qna' && !QNA_CATEGORIES.includes(input.category)) {
        errors.category = '문의 유형을 선택해주세요.';
    }

    return errors;
}

// ?page= 값을 1 이상의 정수로 보정 (잘못된 값이면 1페이지)
export function parsePage(value: string | undefined): number {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
}

// 검색어를 Supabase ilike 패턴으로 변환
// 사용자가 입력한 %, _ 는 와일드카드가 아니라 문자 그대로 검색되도록 이스케이프
export function toLikePattern(keyword: string): string {
    return `%${keyword.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}

// 현재 페이지가 속한 페이지 번호 묶음 계산 (예: 7페이지, 묶음 5개 → [6,7,8,9,10])
export function getPageNumbers(
    currentPage: number,
    totalPages: number,
    groupSize: number,
): number[] {
    if (totalPages < 1) return [];
    const start = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
    const end = Math.min(start + groupSize - 1, totalPages);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
