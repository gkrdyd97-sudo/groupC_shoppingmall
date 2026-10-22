// 게시글 검색 폼 (서버 컴포넌트)
// method="get" 기본 폼이라 JS 없이도 동작: 제출하면 ?field=title&q=검색어 로 이동하고
// 페이지(서버 컴포넌트)가 searchParams 를 읽어 다시 조회한다.
import type { PostSearchField } from '../types/post.types';

interface PostSearchProps {
    boardId: string;
    field: PostSearchField;
    keyword: string;
}

export default function PostSearch({
    boardId,
    field,
    keyword,
}: PostSearchProps) {
    return (
        <form
            action={`/boards/${boardId}`}
            method="get"
            className="flex justify-end gap-2"
        >
            {/* page 를 보내지 않으므로 검색하면 항상 1페이지부터 */}
            <select
                name="field"
                defaultValue={field}
                aria-label="검색 대상"
                className="h-9 border border-gray-300 px-3 text-sm"
            >
                <option value="title">제목</option>
                <option value="content">내용</option>
            </select>

            <input
                name="q"
                type="text"
                defaultValue={keyword}
                placeholder="검색어를 입력하세요"
                aria-label="검색어"
                className="h-9 w-52 border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
            />

            <button
                type="submit"
                className="h-9 bg-gray-900 px-5 text-sm text-white"
            >
                검색
            </button>
        </form>
    );
}
