// 관리자 게시판 관리 표 (서버 컴포넌트)
import Link from 'next/link';
import ConfirmActionButton from '@/domains/admin/components/ConfirmActionButton';
import { adminDeletePostAction } from '../actions/post.actions';
import type { BoardId, Post } from '../types/post.types';
import { formatPostDate } from '../utils/formatPostDate';

interface PostAdminTableProps {
    boardId: BoardId;
    posts: Post[];
    startNumber: number; // 화면 번호 (전체 글 수 - 앞 페이지 글 수)
}

export default function PostAdminTable({
    boardId,
    posts,
    startNumber,
}: PostAdminTableProps) {
    if (posts.length === 0) {
        return (
            <p className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">
                게시글이 없습니다.
            </p>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500">
                    <tr>
                        <th className="w-16 px-4 py-3">번호</th>
                        {boardId === 'qna' && (
                            <th className="w-24 px-4 py-3">유형</th>
                        )}
                        <th className="px-4 py-3 text-left">제목</th>
                        <th className="w-28 px-4 py-3">작성자</th>
                        <th className="w-28 px-4 py-3">작성일</th>
                        <th className="w-40 px-4 py-3">관리</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {posts.map((post, index) => (
                        <tr key={post.id}>
                            <td className="px-4 py-3 text-center text-gray-500">
                                {startNumber - index}
                            </td>
                            {boardId === 'qna' && (
                                <td className="px-4 py-3 text-center text-xs text-gray-500">
                                    {post.category ?? '-'}
                                </td>
                            )}
                            <td className="max-w-0 truncate px-4 py-3 font-medium text-gray-900">
                                {post.title}
                            </td>
                            <td className="truncate px-4 py-3 text-center text-gray-600">
                                {post.authorName}
                            </td>
                            <td className="px-4 py-3 text-center text-xs text-gray-500">
                                {formatPostDate(post.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex justify-center gap-1.5">
                                    {/* 실제 게시판 화면에서 내용 확인 · 수정 (관리자는 모든 글 수정 가능) */}
                                    <Link
                                        href={`/boards/${boardId}/${post.id}`}
                                        target="_blank"
                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        보기
                                    </Link>
                                    <ConfirmActionButton
                                        action={adminDeletePostAction.bind(
                                            null,
                                            boardId,
                                            post.id,
                                        )}
                                        label="삭제"
                                        variant="danger"
                                        confirmMessage={`'${post.title}' 글을 삭제하시겠습니까?`}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
