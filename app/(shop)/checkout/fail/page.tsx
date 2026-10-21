// 결제 실패 페이지
// 토스 결제창 실패/취소 → failUrl?code&message&orderId 로 리다이렉트
// 승인 페이지에서 검증·승인에 실패한 경우도 이 페이지로 보냄
import Link from 'next/link';
import { CircleAlert } from 'lucide-react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function CheckoutFailPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { code, message, orderId } = await searchParams;

    const isCanceled = code === 'PAY_PROCESS_CANCELED';
    const title = isCanceled ? '결제를 취소했습니다' : '결제에 실패했습니다';
    const description = isCanceled
        ? '결제가 진행되지 않았습니다.'
        : typeof message === 'string'
          ? message
          : '알 수 없는 오류가 발생했습니다.';

    return (
        <div className="mx-auto mb-20 max-w-2xl px-4 pb-4">
            <div className="my-10 flex flex-col items-center gap-3 text-center">
                <CircleAlert className="size-16 text-red-500" />
                <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
                <p className="text-gray-500">{description}</p>
            </div>

            {(typeof code === 'string' || typeof orderId === 'string') && (
                <dl className="flex flex-col gap-3 rounded-lg border p-4 text-sm md:p-5">
                    {typeof code === 'string' && (
                        <div className="flex justify-between gap-4">
                            <dt className="shrink-0 text-gray-500">
                                에러코드
                            </dt>
                            <dd className="break-all">{code}</dd>
                        </div>
                    )}
                    {typeof orderId === 'string' && (
                        <div className="flex justify-between gap-4">
                            <dt className="shrink-0 text-gray-500">
                                주문번호
                            </dt>
                            <dd className="break-all text-right">{orderId}</dd>
                        </div>
                    )}
                </dl>
            )}

            {/* 체크아웃은 장바구니에서 고른 상품으로 시작하므로 장바구니로 보냄 */}
            <Link
                href="/cart"
                className="mt-6 flex h-12 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
                장바구니로 돌아가기
            </Link>
        </div>
    );
}
