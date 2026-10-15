import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        boardId: string;
    }>;
}

const boardInfo = {
    qna: {
        title: '고객 Q&A',
        description: '상품과 주문에 대해 궁금한 점을 남겨주세요.',
    },
    notice: {
        title: '공지사항',
        description: 'RNDO 쇼핑몰의 새로운 소식을 알려드립니다.',
    },
};

export default async function NewPostPage({
    params,
}: PageProps): Promise<React.JSX.Element> {
    const { boardId } = await params;

    if (boardId !== 'qna' && boardId !== 'notice') {
        notFound();
    }

    const board = boardInfo[boardId];

    return (
        <section className="mx-auto min-h-[700px] max-w-4xl px-4 py-12">
            <div className="mb-10 border-b border-gray-900 pb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {board.title}
                </h1>

                <p className="mt-3 text-sm text-gray-500">
                    {board.description}
                </p>
            </div>

            <form className="space-y-6">
                <div>
                    <label
                        htmlFor="title"
                        className="mb-2 block text-sm font-semibold text-gray-900"
                    >
                        제목
                    </label>

                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="제목을 입력하세요."
                        className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                    />
                </div>

                <div>
                    <label
                        htmlFor="contents"
                        className="mb-2 block text-sm font-semibold text-gray-900"
                    >
                        내용
                    </label>

                    <textarea
                        id="contents"
                        name="contents"
                        placeholder="내용을 입력하세요."
                        className="min-h-[300px] w-full resize-none border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Link
                        href={`/boards/${boardId}`}
                        className="border border-gray-300 px-5 py-3 text-sm text-gray-700"
                    >
                        취소
                    </Link>

                    <button
                        type="button"
                        className="bg-gray-900 px-5 py-3 text-sm text-white"
                    >
                        등록하기
                    </button>
                </div>
            </form>
        </section>
    );
}
