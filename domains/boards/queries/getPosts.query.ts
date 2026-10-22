// 게시글 조회 (서버 컴포넌트에서 사용)
import { createServerClient } from '@/shared/lib/supabase';
import { POSTS_PER_PAGE } from '../constants/board.constants';
import type { BoardId, Post, PostSearchField } from '../types/post.types';
import { toLikePattern } from '../utils/postValidation';

// POSTS 행 + PROFILES(name) 조인 결과 (POSTS.user_id → PROFILES.id FK)
interface PostRow {
    id: number;
    board_id: BoardId;
    user_id: string;
    title: string;
    content: string;
    category: string | null;
    gid: string | null;
    created_at: string;
    updated_at: string | null;
    PROFILES: { name: string } | null;
}

const POST_COLUMNS =
    'id, board_id, user_id, title, content, category, gid, created_at, updated_at, PROFILES(name)';

// DB 컬럼(snake_case) → 화면용 타입(camelCase) 변환
function toPost(row: PostRow): Post {
    return {
        id: row.id,
        boardId: row.board_id,
        userId: row.user_id,
        title: row.title,
        content: row.content,
        category: row.category,
        gid: row.gid,
        authorName: row.PROFILES?.name ?? '탈퇴회원',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

interface GetPostsParams {
    boardId: BoardId;
    page: number;
    field?: PostSearchField;
    keyword?: string;
}

// 게시판 목록: 최신글 순 + 페이지네이션 + 제목/내용 검색
export async function getPosts({
    boardId,
    page,
    field = 'title',
    keyword,
}: GetPostsParams): Promise<{ posts: Post[]; totalCount: number }> {
    const supabase = createServerClient();

    // range(from, to): 0부터 시작하는 행 번호 구간 (양 끝 포함)
    const from = (page - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    // count: 'exact' → 페이지 수 계산용 전체 게시글 수도 함께 받음
    let query = supabase
        .from('POSTS')
        .select(POST_COLUMNS, { count: 'exact' })
        .eq('board_id', boardId)
        .is('deleted_at', null) // 소프트 삭제된 글 제외
        .order('id', { ascending: false })
        .range(from, to);

    if (keyword) {
        query = query.ilike(field, toLikePattern(keyword));
    }

    const { data, count, error } = await query;

    if (error) {
        // PGRST103: 존재하지 않는 페이지 요청 (예: ?page=999) → 빈 목록으로 처리
        if (error.code === 'PGRST103') {
            return { posts: [], totalCount: 0 };
        }
        throw new Error(`게시글 목록 조회 실패: ${error.message}`);
    }

    return {
        posts: (data as unknown as PostRow[]).map(toPost),
        totalCount: count ?? 0,
    };
}

// 게시글 상세: 없거나 삭제된 글이면 null
export async function getPost(
    boardId: BoardId,
    postId: number,
): Promise<Post | null> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('POSTS')
        .select(POST_COLUMNS)
        .eq('id', postId)
        .eq('board_id', boardId) // 다른 게시판 글을 URL 로 열람하지 못하게 함
        .is('deleted_at', null)
        .maybeSingle();

    if (error) {
        throw new Error(`게시글 조회 실패: ${error.message}`);
    }

    return data ? toPost(data as unknown as PostRow) : null;
}
