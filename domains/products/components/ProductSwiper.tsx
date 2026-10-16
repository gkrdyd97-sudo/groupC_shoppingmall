'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import HomeProductCard from './HomeProductCard';
import { type Product } from '../types/Product.types';

interface ProductSwiperProps {
    products: Product[];
}

export default function ProductSwiper({ products }: ProductSwiperProps) {
    return (
        <Swiper modules={[Navigation, Pagination, Autoplay]}
        className="pb-14"
        style={{ '--swiper-navigation-color': '#ffffff' } as React.CSSProperties}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1000}
        loop
        spaceBetween={24}
        slidesPerView={2.5}>
            {products.map((product) => (
                <SwiperSlide key={product.id}>
                    <HomeProductCard {...product} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}