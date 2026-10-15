import Link from 'next/link';
import { notFound } from 'next/navigation';

import type {
    BoardId,
    Post,
} from '@/domains/boards/types/post.types';

interface PageProps {
    params: Promise<{
        boardId: string;
        postId: string;
    }>;
}

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

export default async function PostDetailPage({
    params,
}: PageProps): Promise<React.JSX.Element> {
    const { boardId, postId } = await params;

    if (
        boardId !== 'qna' &&
        boardId !== 'notice'
    ) {
        notFound();
    }

    const post = postsByBoard[boardId].find(
        (item) => item.id === Number(postId)
    );

    if (!post) {
        notFound();
    }

    return (
        <section className="mx-auto min-h-[700px] max-w-4xl px-4 py-12">
            <div className="border-b border-gray-900 pb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {post.title}
                </h1>

                <div className="mt-4 flex gap-4 text-sm text-gray-500">
                    <span>
                        작성자: {post.author}
                    </span>

                    <span>
                        작성일: {post.createdAt}
                    </span>

                    <span>
                        조회수: {post.views}
                    </span>
                </div>
            </div>

            <div className="whitespace-pre-wrap py-10 text-gray-700">
                {post.contents}
            </div>

            <div className="border-t border-gray-200 pt-6">
                <Link
                    href={`/boards/${boardId}`}
                    className="border border-gray-300 px-5 py-3 text-sm text-gray-700"
                >
                    목록으로 돌아가기
                </Link>
            </div>
        </section>
    );
}