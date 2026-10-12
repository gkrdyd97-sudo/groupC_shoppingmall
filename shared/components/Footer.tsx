import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="mb-3 font-bold">쇼핑몰 소개</h3>
                        <p className="text-sm text-gray-600">
                            우리 팀이 개발하는 쇼핑몰 프로젝트입니다.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-3 font-bold">바로가기</h3>
                        <div className="flex flex-col gap-2 text-sm">
                            <Link href="/products">상품 목록</Link>
                            <Link href="/cart">장바구니</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-3 font-bold">고객센터</h3>
                        <p className="text-sm text-gray-600">
                            운영시간: 평일 09:00 ~ 18:00
                        </p>
                    </div>
                </div>

                <p className="mt-8 border-t pt-6 text-center text-xs text-gray-400">
                    © {new Date().getFullYear()} Team Shopping
                </p>
            </div>
        </footer>
    );
}