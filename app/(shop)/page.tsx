import { connection } from 'next/server';
import { Suspense } from 'react';
import { getProducts } from '@/domains/products/queries/getProducts.query';
import ProductSwiper from '@/domains/products/components/ProductSwiper';
import HeroVideoBanner from '@/shared/components/HeroVideoBanner';


//메인 - 김민지
export default function HomePage() {
    

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
            <HeroVideoBanner />

            <div className="relative mt-10">
                <div
                    className="absolute inset-y-0 left-0 z-10 flex w-96 flex-col justify-center gap-4 bg-black p-8 text-white"
                    style={{
                        clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 100%)',
                    }}
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
                <Suspense fallback={<div>로딩중 . . .</div>}>
                    <NewArriavalSwiper />
                </Suspense>
            </div>
            <div className="relative mt-30">
                <div
                    className="absolute inset-y-0 right-0 z-10 flex w-96 flex-col justify-center gap-4 bg-mist-900 py-8 pr-8 pl-16 text-white"
                    style={{
                        clipPath: 'polygon(100% 0, 15% 0, 0 100%, 100% 100%)',
                    }}
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
                <Suspense fallback={<div>로딩중 . . . </div>}>
                    <BestPickSwiper />
                </Suspense>
            </div>
        </div>
    );
}

async function NewArriavalSwiper() {
    await connection();
    const products = await getProducts();
    return <ProductSwiper products={products.slice(0, 4)} />;
}

async function BestPickSwiper() {
    await connection();
    const products = await getProducts();
    return <ProductSwiper products={products.slice(4,8)} />;
}