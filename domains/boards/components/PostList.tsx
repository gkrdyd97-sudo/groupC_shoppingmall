import Link from 'next/link';
import type {
    BoardId,
    Post,
} from '@/domains/boards/types/post.types';

interface PostListProps {
    boardId: BoardId;
    posts: Post[];
}

export default function PostList({
    boardId,
    posts,
}: PostListProps): React.JSX.Element {
    return (
        <div className="overflow-hidden border-t border-gray-900">
            {/* 게시글 제목 */}
            <div className="grid grid-cols-[70px_1fr_100px_100px_70px] border-b border-gray-200 bg-gray-50 px-4 py-3 text-center text-xs font-semibold text-gray-500">
                <span>번호</span>
                <span>제목</span>
                <span>작성자</span>
                <span>작성일</span>
                <span>조회</span>
            </div>

            {/* 게시글 목록 */}
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="grid grid-cols-[70px_1fr_100px_100px_70px] items-center border-b border-gray-200 px-4 py-5 text-center text-sm"
                >
                    <span className="text-gray-500">
                        {post.id}
                    </span>

                    <div className="flex items-center gap-2 text-left">
                        <Link
                            href={`/boards/${boardId}/${post.id}`}
                            className="font-medium text-gray-900 hover:underline"
                        >
                            {post.title}
                        </Link>

                        {boardId === 'qna' && post.status && (
                            <span
                                className={
                                    post.status === '답변완료'
                                        ? 'text-xs text-blue-600'
                                        : 'text-xs text-gray-400'
                                }
                            >
                                {post.status}
                            </span>
                        )}
                    </div>

                    <span className="text-gray-500">
                        {post.author}
                    </span>

                    <span className="text-gray-500">
                        {post.createdAt}
                    </span>

                    <span className="text-gray-500">
                        {post.views}
                    </span>
                </div>
            ))}
        </div>
    );
}