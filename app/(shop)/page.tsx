import { MOCK_CART_ITEMS } from '@/shared/mocks/mockData';

//메인 - 김민지
export default function HomePage() {
    const sliceProducts = MOCK_CART_ITEMS.slice(0, 4);

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
            <div className="grid grid-cols-2 h-96">
                <div className='flex flex-col justify-center gap-4 bg-gray-100 p-6'>
                    <div className='text-2xl font-bold'>퇴근 후 러닝부터 주말 트레일까지</div>
                    <button type='button' className='w-fit bg-black px-4 py-2 text-white'>전체 상품 보기</button>
                </div>
                <div className='bg-gray-200'>오른쪽 영상</div>
            </div>

            <div className='mt-10'>
                <span className='text-xl font-bold'>신상품추천</span>
                <div className='mt-4 grid grid-cols-4 gap-x-8 gap-y-4'>
                    <div>상품1</div>
                    <div>상품2</div>
                    <div>상품3</div>
                    <div>상품4</div>
                </div>
            </div>
        </div>
    );
}
