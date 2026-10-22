// 게시글 목록 테이블 (서버 컴포넌트)
import Link from 'next/link';
import type { BoardId, Post } from '@/domains/boards/types/post.types';
import { cn } from '@/shared/utils/cn';
import { formatPostDate } from '../utils/formatPostDate';

interface PostListProps {
    boardId: BoardId;
    posts: Post[];
    // 화면에 보여줄 첫 글 번호 (전체 글 수 - 앞 페이지 글 수)
    // DB id 는 삭제 시 빈 번호가 생기므로 화면 번호는 따로 계산
    startNumber: number;
}

export default function PostList({
    boardId,
    posts,
    startNumber,
}: PostListProps): React.JSX.Element {
    // Q&A 는 "문의 유형" 칸이 하나 더 있음
    const isQna = boardId === 'qna';
    const gridCols = isQna
        ? 'grid-cols-[60px_90px_1fr_100px_110px]'
        : 'grid-cols-[60px_1fr_100px_110px]';

    return (
        <div className="overflow-hidden border-t border-gray-900">
            {/* 헤더 행 */}
            <div
                className={cn(
                    'grid border-b border-gray-200 bg-gray-50 px-4 py-3 text-center text-xs font-semibold text-gray-500',
                    gridCols,
                )}
            >
                <span>번호</span>
                {isQna && <span>유형</span>}
                <span>제목</span>
                <span>작성자</span>
                <span>작성일</span>
            </div>

            {/* 게시글이 없을 때 */}
            {posts.length === 0 && (
                <p className="border-b border-gray-200 py-16 text-center text-sm text-gray-500">
                    등록된 게시글이 없습니다.
                </p>
            )}

            {/* 게시글 목록 */}
            {posts.map((post, index) => (
                <div
                    key={post.id}
                    className={cn(
                        'grid items-center border-b border-gray-200 px-4 py-5 text-center text-sm',
                        gridCols,
                    )}
                >
                    <span className="text-gray-500">{startNumber - index}</span>

                    {isQna && (
                        <span className="text-xs text-gray-500">
                            {post.category ?? '-'}
                        </span>
                    )}

                    <Link
                        href={`/boards/${boardId}/${post.id}`}
                        className="truncate text-left font-medium text-gray-900 hover:underline"
                    >
                        {post.title}
                    </Link>

                    <span className="truncate text-gray-500">
                        {post.authorName}
                    </span>

                    <span className="text-gray-500">
                        {formatPostDate(post.createdAt)}
                    </span>
                </div>
            ))}
        </div>
    );
}
