import { products } from '@/shared/mocks/products.mock';
import ProductCard from '@/domains/products/components/ProductCard';

//메인 - 김민지
export default function HomePage() {
    const sliceProducts = products.slice(0, 4);

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
            <div className="grid h-112 grid-cols-2">
                <div className="flex flex-col justify-center gap-4 bg-gray-100 p-6">
                    <div className="text-2xl font-bold">
                        퇴근 후 러닝부터 주말 트레일까지
                    </div>
                    <button
                        type="button"
                        className="w-fit bg-black px-4 py-2 text-white"
                    >
                        전체 상품 보기
                    </button>
                </div>
                {/* div className="bg-gray-200 */}
                <video src="/banner/banner-runner.mp4" autoPlay muted loop playsInline className='h-full w-full object-cover'>오른쪽 영상</video>
            </div>

            <div className="mt-10">
                <span className="text-2xl font-extrabold tracking-wide">NEW ARRIVALS</span><br/>
                <span className="text-sm font-bold">이번 주 새로 들어온 러닝 아이템</span>
                <div className="mt-4 grid grid-cols-4 gap-x-8 gap-y-4">
                    {sliceProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>
            <div className="mt-10">
                <span className="text-2xl font-extrabold tracking-wide">BEST RUNNING PICK</span><br />
                <span className="text-sm font-bold">러너들이 직접 고른 베스트</span>
                <div className="mt-4 grid grid-cols-4 gap-x-8 gap-y-4">
                    {sliceProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
