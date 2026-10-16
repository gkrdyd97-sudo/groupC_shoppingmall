import { products } from '@/shared/mocks/products.mock';
import ProductSwiper from '@/domains/products/components/ProductSwiper';
import HeroVideoBanner from '@/shared/components/HeroVideoBanner';

const NEW_ARRIVAL_IDS = [4001, 2001, 1002, 3002];
const BEST_PICK_IDS = [4002, 1001, 2002, 3001];

//메인 - 김민지
export default function HomePage() {
    const newProducts = NEW_ARRIVAL_IDS.map(
        (id) => products.find((p) => p.id === id)!,
    );
    const bestProducts = BEST_PICK_IDS.map(
        (id) => products.find((p) => p.id === id)!,
    );

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
            <HeroVideoBanner />

            <div className="relative mt-10">
                <div
                    className="absolute inset-y-0 left-0 z-10 flex w-96 flex-col justify-center gap-4 bg-black p-8 text-white"
                    style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 100%)' }}
                >
                    <span className="text-4xl leading-[0.9] font-black tracking-tight italic">
                        NEW
                        <br />
                        ARRIVALS
                    </span>
                    <span className="text-sm font-bold text-gray-300">
                        이번 주 새로 들어온 러닝 아이템
                    </span>
                </div>
                <ProductSwiper products={newProducts} />
            </div>
            <div className="relative mt-30">
                <div
                    className="absolute inset-y-0 right-0 z-10 flex w-96 flex-col justify-center gap-4 bg-mist-900 py-8 pr-8 pl-16 text-white"
                    style={{ clipPath: 'polygon(100% 0, 15% 0, 0 100%, 100% 100%)' }}
                >
                    <span className="text-4xl leading-[0.9] font-black tracking-tight italic">
                        BEST
                        <br />
                        RUNNING PICK
                    </span>
                    <span className="text-sm font-bold text-gray-300">
                        러너들이 직접 고른 베스트
                    </span>
                </div>
                <ProductSwiper products={bestProducts} />
            </div>
        </div>
    );
}
