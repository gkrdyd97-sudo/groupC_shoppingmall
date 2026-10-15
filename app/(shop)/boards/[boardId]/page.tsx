import Link from 'next/link';
import { notFound } from 'next/navigation';

import PostList from '@/domains/boards/components/PostList';
import type {
    BoardId,
    Post,
} from '@/domains/boards/types/post.types';

interface PageProps {
    params: Promise<{
        boardId: string;
    }>;
}

const boardInfo: Record<
    BoardId,
    {
        title: string;
        description: string;
    }
> = {
    qna: {
        title: '고객 Q&A',
        description:
            '상품과 주문에 대해 궁금한 점을 남겨주세요.',
    },
    notice: {
        title: '공지사항',
        description:
            'RNDO 쇼핑몰의 새로운 소식을 알려드립니다.',
    },
};

const postsByBoard: Record<BoardId, Post[]> = {
    qna: [
        {
            id: 3,
            title: '배송 관련 문의드립니다.',
            contents:
                '배송이 언제 시작되나요?',
            author: '김태양',
            createdAt: '2026.10.15',
            views: 12,
            status: '답변대기',
        },
        {
            id: 2,
            title: '사이즈 문의드립니다.',
            contents:
                '사이즈가 어떻게 되나요?',
            author: '김민지',
            createdAt: '2026.10.14',
            views: 8,
            status: '답변완료',
        },
        {
            id: 1,
            title: '상품 교환 문의입니다.',
            contents:
                '상품을 교환하고 싶습니다.',
            author: '서종찬',
            createdAt: '2026.10.13',
            views: 15,
            status: '답변완료',
        },
    ],

    notice: [
        {
            id: 3,
            title: 'RNDO 쇼핑몰 이용 안내',
            contents:
                'RNDO 쇼핑몰을 이용하시기 전에 확인해주세요.',
            author: 'RNDO',
            createdAt: '2026.10.15',
            views: 42,
        },
        {
            id: 2,
            title: '배송 및 교환 정책 안내',
            contents:
                '배송 및 교환에 관한 정책을 안내드립니다.',
            author: 'RNDO',
            createdAt: '2026.10.14',
            views: 31,
        },
        {
            id: 1,
            title: 'RNDO 공식 오픈 안내',
            contents:
                'RNDO가 공식적으로 오픈되었습니다.',
            author: 'RNDO',
            createdAt: '2026.10.13',
            views: 56,
        },
    ],
};

export default async function BoardPage({
    params,
}: PageProps): Promise<React.JSX.Element> {
    const { boardId } = await params;

    if (
        boardId !== 'qna' &&
        boardId !== 'notice'
    ) {
        notFound();
    }

    const board = boardInfo[boardId];
    const posts = postsByBoard[boardId];

    return (
        <section className="mx-auto min-h-[700px] max-w-7xl px-4 py-12 md:px-6">
            <div className="mb-10 border-b border-gray-900 pb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {board.title}
                </h1>

                <p className="mt-3 text-sm text-gray-500">
                    {board.description}
                </p>
            </div>

            <div className="mb-6 flex justify-end gap-2">
                <select className="h-9 border border-gray-300 px-3 text-sm">
                    <option>제목</option>
                    <option>내용</option>
                    <option>작성자</option>
                </select>

                <input
                    className="h-9 w-52 border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
                    type="text"
                    placeholder="검색어를 입력하세요"
                />

                <button
                    className="h-9 bg-gray-900 px-5 text-sm text-white"
                    type="button"
                >
                    검색
                </button>
            </div>

            <div className="mb-3 text-sm text-gray-500">
                총 {posts.length}개의 게시글
            </div>

            <PostList
                boardId={boardId}
                posts={posts}
            />

            <div className="relative mt-8 flex justify-center">
                <div className="flex gap-3 text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">
                        1
                    </span>
                    <span>2</span>
                    <span>3</span>
                </div>

                {boardId === 'qna' && (
                    <Link
                        href={`/boards/${boardId}/new`}
                        className="absolute right-0 bg-gray-900 px-5 py-2 text-sm text-white"
                    >
                        글쓰기
                    </Link>
                )}
            </div>
        </section>
    );
}