import type { BoardWriteRole } from '../types/board.types';
import type { BoardId } from '../types/post.types';

// 게시판별 화면 문구와 글쓰기 권한
// - notice(공지사항): 관리자(ADMIN)만 작성
// - qna(고객 Q&A): 로그인한 회원 누구나 작성
export const BOARD_INFO: Record<
    BoardId,
    { title: string; description: string; writeRole: BoardWriteRole }
> = {
    notice: {
        title: '공지사항',
        description: 'RNDO 쇼핑몰의 새로운 소식을 알려드립니다.',
        writeRole: 'admin',
    },
    qna: {
        title: '고객 Q&A',
        description: '상품과 주문에 대해 궁금한 점을 남겨주세요.',
        writeRole: 'user',
    },
};

// Q&A 문의 유형 (POSTS.category 에 저장)
export const QNA_CATEGORIES = [
    '상품',
    '배송',
    '교환/반품',
    '주문/결제',
    '기타',
];

// 목록 한 페이지당 게시글 수
export const POSTS_PER_PAGE = 10;

// 하단 페이지 번호를 한 번에 몇 개씩 보여줄지 (1~5, 6~10 ...)
export const PAGE_GROUP_SIZE = 5;
